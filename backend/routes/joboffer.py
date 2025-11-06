from flask import Blueprint, request, jsonify, current_app
import mysql.connector
from mysql.connector import Error
from datetime import datetime
import os

joboffers_bp = Blueprint('joboffers', __name__, url_prefix='/api/joboffers')

# ------------------------------
# Database Connection
# ------------------------------
def get_db_connection():
    db_config = {
        'host': os.environ.get('MYSQL_HOST', '127.0.0.1'),
        'user': os.environ.get('MYSQL_USER', 'root'),
        'password': os.environ.get('MYSQL_PASSWORD', ''),
        'database': os.environ.get('MYSQL_DATABASE', 'PlacementTracker'),
        'port': int(os.environ.get('MYSQL_PORT', 3306)),
    }
    return mysql.connector.connect(**db_config)

# ------------------------------
# Admin Authentication (Simple)
# ------------------------------
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "admin123"

def check_admin_auth():
    username = request.headers.get("X-Admin-Username")
    password = request.headers.get("X-Admin-Password")
    if username != ADMIN_USERNAME or password != ADMIN_PASSWORD:
        return False
    return True

# ------------------------------
# GET: All Job Offers
# ------------------------------
@joboffers_bp.route('', methods=['GET'])
@joboffers_bp.route('', methods=['GET'])
def get_job_offers():
    try:
        # Query params
        job_type = request.args.get('type')
        search = request.args.get('search')

        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # Base query
        query = """
            SELECT 
                jo.JobID AS id,
                jo.Title AS title,
                jo.JobType AS type,
                jo.Field AS field,
                jo.Compensation AS compensation,
                jo.Deadline AS deadline,
                jo.Location AS location,
                jo.Description AS description,
                jo.MinGPA AS minGPA,
                jo.MinTenthMarks AS minTenth,
                jo.MinTwelfthMarks AS minTwelfth,
                c.CompanyID AS companyId,
                c.CompanyName AS companyName
            FROM JOB_OFFER jo
            LEFT JOIN COMPANY c ON jo.CompanyID = c.CompanyID
        """

        # Dynamic filters
        conditions = []
        params = []

        if job_type:
            conditions.append("jo.JobType = %s")
            params.append(job_type)

        if search:
            conditions.append("(jo.Title LIKE %s OR c.CompanyName LIKE %s OR jo.Description LIKE %s)")
            params.extend([f"%{search}%", f"%{search}%", f"%{search}%"])

        if conditions:
            query += " WHERE " + " AND ".join(conditions)

        query += " ORDER BY jo.Deadline ASC"

        cursor.execute(query, tuple(params))
        jobs = cursor.fetchall()

        # Format results
        for job in jobs:
            if isinstance(job.get('deadline'), datetime):
                job['deadline'] = job['deadline'].isoformat()
            if job.get('compensation') is not None:
                job['compensation'] = float(job['compensation'])

        conn.close()
        return jsonify({"data": jobs}), 200

    except Error as e:
        current_app.logger.error("DB error in get_job_offers: %s", str(e))
        return jsonify({"error": "Database error"}), 500


# ------------------------------
# GET: Single Job Offer
# ------------------------------
@joboffers_bp.route('/<int:job_id>', methods=['GET'])
def get_single_job(job_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT 
                jo.JobID AS id,
                jo.Title AS title,
                jo.JobType AS type,
                jo.Field AS field,
                jo.Compensation AS compensation,
                jo.Deadline AS deadline,
                jo.Location AS location,
                jo.Description AS description,
                jo.MinGPA AS minGPA,
                jo.MinTenthMarks AS minTenth,
                jo.MinTwelfthMarks AS minTwelfth,
                c.CompanyID AS companyId,
                c.CompanyName AS companyName
            FROM JOB_OFFER jo
            LEFT JOIN COMPANY c ON jo.CompanyID = c.CompanyID
            WHERE jo.JobID = %s
        """, (job_id,))
        job = cursor.fetchone()
        cursor.close()
        conn.close()

        if not job:
            return jsonify({"error": "Job offer not found"}), 404

        if isinstance(job.get('deadline'), datetime):
            job['deadline'] = job['deadline'].isoformat()
        if job.get('compensation') is not None:
            job['compensation'] = float(job['compensation'])

        return jsonify(job), 200
    except Error as e:
        current_app.logger.error("DB error in get_single_job: %s", str(e))
        return jsonify({"error": "Database error"}), 500

# ------------------------------
# POST: Create Job Offer (Admin)
# ------------------------------
@joboffers_bp.route('', methods=['POST'])
def create_job_offer():
    if not check_admin_auth():
        return jsonify({"error": "Unauthorized"}), 401

    data = request.get_json()
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        query = """
            INSERT INTO JOB_OFFER (
                CompanyID, Title, JobType, Field, Compensation, 
                Deadline, Location, Description, MinGPA, MinTenthMarks, MinTwelfthMarks
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(query, (
            data.get('companyId'),
            data.get('title'),
            data.get('type'),
            data.get('field'),
            data.get('compensation'),
            data.get('deadline'),
            data.get('location'),
            data.get('description'),
            data.get('minGPA'),
            data.get('minTenth'),
            data.get('minTwelfth')
        ))

        conn.commit()
        new_id = cursor.lastrowid
        conn.close()
        return jsonify({"message": "Job offer created", "id": new_id}), 201

    except Error as e:
        current_app.logger.error("DB error in create_job_offer: %s", str(e))
        return jsonify({"error": "Database error"}), 500

# ------------------------------
# PUT: Update Job Offer (Admin)
# ------------------------------
@joboffers_bp.route('/<int:job_id>', methods=['PUT'])
def update_job_offer(job_id):
    if not check_admin_auth():
        return jsonify({"error": "Unauthorized"}), 401

    data = request.get_json()
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        query = """
            UPDATE JOB_OFFER
            SET CompanyID=%s, Title=%s, JobType=%s, Field=%s,
                Compensation=%s, Deadline=%s, Location=%s, Description=%s,
                MinGPA=%s, MinTenthMarks=%s, MinTwelfthMarks=%s
            WHERE JobID=%s
        """
        cursor.execute(query, (
            data.get('companyId'),
            data.get('title'),
            data.get('type'),
            data.get('field'),
            data.get('compensation'),
            data.get('deadline'),
            data.get('location'),
            data.get('description'),
            data.get('minGPA'),
            data.get('minTenth'),
            data.get('minTwelfth'),
            job_id
        ))

        conn.commit()
        affected = cursor.rowcount
        conn.close()

        if affected == 0:
            return jsonify({"error": "Job offer not found"}), 404
        return jsonify({"message": "Job offer updated"}), 200

    except Error as e:
        current_app.logger.error("DB error in update_job_offer: %s", str(e))
        return jsonify({"error": "Database error"}), 500

# ------------------------------
# DELETE: Delete Job Offer (Admin)
# ------------------------------
@joboffers_bp.route('/<int:job_id>', methods=['DELETE'])
def delete_job_offer(job_id):
    if not check_admin_auth():
        return jsonify({"error": "Unauthorized"}), 401

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM JOB_OFFER WHERE JobID = %s", (job_id,))
        conn.commit()
        affected = cursor.rowcount
        conn.close()

        if affected == 0:
            return jsonify({"error": "Job offer not found"}), 404
        return jsonify({"message": "Job offer deleted"}), 200
    except Error as e:
        current_app.logger.error("DB error in delete_job_offer: %s", str(e))
        return jsonify({"error": "Database error"}), 500
