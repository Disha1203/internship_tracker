from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash
from functools import wraps
from db import get_db_connection
import MySQLdb

bp = Blueprint('companies', __name__, url_prefix='/api/companies')

# ---------------- Helper: Verify admin ----------------
def verify_admin_credentials(username, password_plain):
    if not username or not password_plain:
        return None
    conn = get_db_connection()
    cur = conn.cursor(MySQLdb.cursors.DictCursor)
    cur.execute("SELECT Username, PasswordHash, Role FROM ADMIN WHERE Username = %s", (username,))
    admin = cur.fetchone()
    cur.close(); conn.close()
    if not admin:
        return None
    if check_password_hash(admin['PasswordHash'], password_plain):
        return admin
    return None

def admin_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        username = request.headers.get('X-Admin-Username')
        password = request.headers.get('X-Admin-Password')
        admin = verify_admin_credentials(username, password)
        if not admin:
            return jsonify({"error": "Admin authentication required"}), 401
        request.admin = admin
        return f(*args, **kwargs)
    return wrapper

# ---------------- CRUD endpoints ----------------
@bp.route('', methods=['GET'])
def list_companies():
    conn = get_db_connection()
    cur = conn.cursor(MySQLdb.cursors.DictCursor)
    cur.execute("""
        SELECT CompanyID AS id, CompanyName AS name, Industry AS industry,
               ContactEmail AS contactEmail, ContactPhone AS contactPhone
        FROM COMPANY
    """)
    companies = cur.fetchall()
    cur.close(); conn.close()
    return jsonify(companies), 200


@bp.route('/<int:company_id>', methods=['GET'])
def get_company(company_id):
    conn = get_db_connection()
    cur = conn.cursor(MySQLdb.cursors.DictCursor)
    cur.execute("""
        SELECT CompanyID AS id, CompanyName AS name, Industry AS industry,
               ContactEmail AS contactEmail, ContactPhone AS contactPhone
        FROM COMPANY WHERE CompanyID = %s
    """, (company_id,))
    company = cur.fetchone()
    cur.close(); conn.close()
    if not company:
        return jsonify({"error": "Company not found"}), 404
    return jsonify(company), 200


@bp.route('', methods=['POST'])
@admin_required
def add_company():
    data = request.json or {}
    name = data.get('name')
    industry = data.get('industry')
    email = data.get('contactEmail')
    phone = data.get('contactPhone')

    if not name:
        return jsonify({"error": "Company name required"}), 400

    conn = get_db_connection(); cur = conn.cursor()
    try:
        cur.execute("CALL sp_add_company(%s, %s, %s, %s)", (name, industry, email, phone))
        conn.commit()
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close(); conn.close()
    return jsonify({"message": "Company added successfully"}), 201


@bp.route('/<int:company_id>', methods=['PUT'])
@admin_required
def update_company(company_id):
    data = request.json or {}
    name = data.get('name')
    industry = data.get('industry')
    email = data.get('contactEmail')
    phone = data.get('contactPhone')

    if not name:
        return jsonify({"error": "Company name required"}), 400

    conn = get_db_connection(); cur = conn.cursor()
    try:
        cur.execute("CALL sp_update_company(%s, %s, %s, %s, %s)",
                    (company_id, name, industry, email, phone))
        conn.commit()
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close(); conn.close()
    return jsonify({"message": "Company updated successfully"}), 200


@bp.route('/<int:company_id>', methods=['DELETE'])
@admin_required
def delete_company(company_id):
    conn = get_db_connection(); cur = conn.cursor()
    try:
        # prevent FK constraint errors by removing dependent rows first
        cur.execute("DELETE FROM JOB_OFFER WHERE CompanyID = %s", (company_id,))
        cur.execute("DELETE FROM PLACEMENT WHERE CompanyID = %s", (company_id,))
        cur.execute("CALL sp_delete_company(%s)", (company_id,))
        conn.commit()
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close(); conn.close()
    return jsonify({"message": "Company deleted successfully"}), 200


# ---------------- Company + Job Details Endpoint ----------------
@bp.route('/<int:company_id>/detail', methods=['GET'])
def get_company_detail(company_id):
    conn = get_db_connection()
    cur = conn.cursor(MySQLdb.cursors.DictCursor)

    cur.execute("""
        SELECT CompanyID AS id, CompanyName AS name, Industry AS industry,
               ContactEmail AS contactEmail, ContactPhone AS contactPhone
        FROM COMPANY WHERE CompanyID = %s
    """, (company_id,))
    company = cur.fetchone()
    if not company:
        cur.close(); conn.close()
        return jsonify({"error": "Company not found"}), 404

    # fetch all job offers related to this company
    cur.execute("""
        SELECT JobID AS id, Title AS title, JobType AS type, Field AS field,
               Compensation AS compensation, Deadline AS deadline,
               Location AS location, Description AS description, Requirements AS requirements
        FROM JOB_OFFER WHERE CompanyID = %s
    """, (company_id,))
    company['jobs'] = cur.fetchall()

    cur.close(); conn.close()
    return jsonify(company), 200
