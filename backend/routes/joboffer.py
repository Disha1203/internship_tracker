from flask import Blueprint, jsonify, request
import MySQLdb
from db import get_db_connection  # your connection function (returns MySQLdb.connect)

joboffers_bp = Blueprint('joboffers', __name__, url_prefix='/api/joboffers')


# 🔒 Admin Authentication
def check_admin_auth():
    username = request.headers.get('X-Admin-Username')
    password = request.headers.get('X-Admin-Password')
    return username == 'admin' and password == 'admin123'


# 🟢 GET all job offers (supports filters)
@joboffers_bp.route('', methods=['GET'])
@joboffers_bp.route('/', methods=['GET'])
def get_job_offers():
    conn = get_db_connection()
    cursor = conn.cursor(MySQLdb.cursors.DictCursor)

    job_type = request.args.get('type')
    search = request.args.get('search')

    query = """
        SELECT j.JobID AS id, j.Title AS title, j.JobType AS type,
               j.Field AS field, j.Compensation AS compensation,
               j.Deadline AS deadline, j.Location AS location,
               j.Description AS description,
               j.MinGPA AS minGPA, j.MinTenthMarks AS minTenth,
               j.MinTwelfthMarks AS minTwelfth,
               c.CompanyName AS companyName, c.CompanyID AS companyId
        FROM JOB_OFFER j
        LEFT JOIN COMPANY c ON j.CompanyID = c.CompanyID
        WHERE 1=1
    """
    params = []

    if job_type:
        query += " AND j.JobType = %s"
        params.append(job_type)

    if search:
        query += " AND (j.Title LIKE %s OR c.CompanyName LIKE %s)"
        params.extend([f"%{search}%", f"%{search}%"])

    cursor.execute(query, params)
    jobs = cursor.fetchall()

    cursor.close()
    conn.close()
    return jsonify({"data": jobs}), 200


# 🟢 GET single job offer
@joboffers_bp.route('/<int:job_id>', methods=['GET'])
def get_job_by_id(job_id):
    conn = get_db_connection()
    cursor = conn.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute("""
        SELECT j.JobID AS id, j.Title AS title, j.JobType AS type,
               j.Field AS field, j.Compensation AS compensation,
               j.Deadline AS deadline, j.Location AS location,
               j.Description AS description,
               j.MinGPA AS minGPA, j.MinTenthMarks AS minTenth,
               j.MinTwelfthMarks AS minTwelfth,
               c.CompanyName AS companyName, c.CompanyID AS companyId
        FROM JOB_OFFER j
        LEFT JOIN COMPANY c ON j.CompanyID = c.CompanyID
        WHERE j.JobID = %s
    """, (job_id,))
    job = cursor.fetchone()

    cursor.close()
    conn.close()

    if job:
        return jsonify(job), 200
    else:
        return jsonify({"error": "Job not found"}), 404


# 🔒 POST: Create job
@joboffers_bp.route('', methods=['POST'])
def create_job():
    if not check_admin_auth():
        return jsonify({"error": "Unauthorized"}), 401

    data = request.get_json()
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO JOB_OFFER
        (CompanyID, Title, JobType, Field, Compensation, Deadline,
         Location, Description, MinGPA, MinTenthMarks, MinTwelfthMarks)
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
    """, (
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
    job_id = cursor.lastrowid
    cursor.close()
    conn.close()

    return jsonify({"message": "Job offer created", "id": job_id}), 201


# 🔒 PUT: Update job
@joboffers_bp.route('/<int:job_id>', methods=['PUT'])
def update_job(job_id):
    if not check_admin_auth():
        return jsonify({"error": "Unauthorized"}), 401

    data = request.get_json()
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE JOB_OFFER
        SET CompanyID=%s, Title=%s, JobType=%s, Field=%s, Compensation=%s,
            Deadline=%s, Location=%s, Description=%s,
            MinGPA=%s, MinTenthMarks=%s, MinTwelfthMarks=%s
        WHERE JobID=%s
    """, (
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
    cursor.close()
    conn.close()

    return jsonify({"message": "Job offer updated"}), 200


# 🔒 DELETE: Delete job
@joboffers_bp.route('/<int:job_id>', methods=['DELETE'])
def delete_job(job_id):
    if not check_admin_auth():
        return jsonify({"error": "Unauthorized"}), 401

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM JOB_OFFER WHERE JobID=%s", (job_id,))
    conn.commit()

    cursor.close()
    conn.close()
    return jsonify({"message": "Job offer deleted"}), 200
