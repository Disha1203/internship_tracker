from flask import Blueprint, request, jsonify
from db import get_db_connection
import MySQLdb
import datetime

bp = Blueprint('companies', __name__, url_prefix='/api/companies')

# ---------------- CRUD endpoints ----------------
@bp.route('', methods=['GET'])
def list_companies():
    """List all companies"""
    conn = get_db_connection()
    cur = conn.cursor(MySQLdb.cursors.DictCursor)
    cur.execute("""
        SELECT CompanyID AS id, CompanyName AS name, Industry AS industry,
               ContactEmail AS contactEmail, ContactPhone AS contactPhone
        FROM COMPANY
    """)
    companies = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify(companies), 200


@bp.route('/<int:company_id>', methods=['GET'])
def get_company(company_id):
    """Get a single company by ID"""
    conn = get_db_connection()
    cur = conn.cursor(MySQLdb.cursors.DictCursor)
    cur.execute("""
        SELECT CompanyID AS id, CompanyName AS name, Industry AS industry,
               ContactEmail AS contactEmail, ContactPhone AS contactPhone
        FROM COMPANY WHERE CompanyID = %s
    """, (company_id,))
    company = cur.fetchone()
    cur.close()
    conn.close()
    if not company:
        return jsonify({"error": "Company not found"}), 404
    return jsonify(company), 200


@bp.route('', methods=['POST'])
def add_company():
    """Add a new company"""
    data = request.json or {}
    name = data.get('name')
    industry = data.get('industry')
    email = data.get('contactEmail')
    phone = data.get('contactPhone')

    if not name:
        return jsonify({"error": "Company name required"}), 400

    conn = get_db_connection()
    cur = conn.cursor()
    try:
        print("📦 Adding company:", name, industry, email, phone)
        cur.execute("CALL sp_add_company(%s, %s, %s, %s)", (name, industry, email, phone))
        conn.commit()
    except Exception as e:
        print("❌ ERROR in add_company:", e)
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()

    return jsonify({"message": "Company added successfully"}), 201


@bp.route('/<int:company_id>', methods=['PUT'])
def update_company(company_id):
    """Update an existing company"""
    data = request.json or {}
    name = data.get('name')
    industry = data.get('industry')
    email = data.get('contactEmail')
    phone = data.get('contactPhone')

    if not name:
        return jsonify({"error": "Company name required"}), 400

    conn = get_db_connection()
    cur = conn.cursor()
    try:
        print("✏️ Updating company:", company_id, name, industry, email, phone)
        cur.execute("CALL sp_update_company(%s, %s, %s, %s, %s)",
                    (company_id, name, industry, email, phone))
        conn.commit()
    except Exception as e:
        print("❌ ERROR in update_company:", e)
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()

    return jsonify({"message": "Company updated successfully"}), 200


@bp.route('/<int:company_id>', methods=['DELETE'])
def delete_company(company_id):
    """Delete a company and related records"""
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        print("🗑 Deleting company:", company_id)
        # remove dependent rows to avoid FK constraint errors
        cur.execute("DELETE FROM JOB_OFFER WHERE CompanyID = %s", (company_id,))
        cur.execute("DELETE FROM PLACEMENT WHERE CompanyID = %s", (company_id,))
        cur.execute("CALL sp_delete_company(%s)", (company_id,))
        conn.commit()
    except Exception as e:
        print("❌ ERROR in delete_company:", e)
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()

    return jsonify({"message": "Company deleted successfully"}), 200


# ---------------- Company + Job Details Endpoint ----------------
@bp.route('/<int:company_id>/detail', methods=['GET'])
def get_company_detail(company_id):
    """Fetch company with all related job offers"""
    conn = get_db_connection()
    cur = conn.cursor(MySQLdb.cursors.DictCursor)

    cur.execute("""
        SELECT CompanyID AS id, CompanyName AS name, Industry AS industry,
               ContactEmail AS contactEmail, ContactPhone AS contactPhone
        FROM COMPANY WHERE CompanyID = %s
    """, (company_id,))
    company = cur.fetchone()

    if not company:
        cur.close()
        conn.close()
        return jsonify({"error": "Company not found"}), 404

    # fetch job offers for this company
    cur.execute("""
        SELECT JobID AS id, Title AS title, JobType AS type, Field AS field,
               Compensation AS compensation, Deadline AS deadline,
               Location AS location, Description AS description, Requirements AS requirements
        FROM JOB_OFFER WHERE CompanyID = %s
    """, (company_id,))
    jobs = cur.fetchall()

    # format dates properly
    for job in jobs:
        if isinstance(job.get("deadline"), (datetime.date, datetime.datetime)):
            job["deadline"] = job["deadline"].isoformat()

    company["jobs"] = jobs
    cur.close()
    conn.close()
    return jsonify(company), 200
