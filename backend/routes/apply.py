# apply.py
from flask import Blueprint, request, jsonify
from db import get_db_connection
import MySQLdb
from datetime import datetime
from flask_cors import CORS

# Blueprint
apply_bp = Blueprint('apply', __name__, url_prefix='/api')
CORS(apply_bp)  # ✅ enable CORS for React frontend

# 🟢 POST /api/apply - Apply for a job
@apply_bp.route('/apply', methods=['POST'])
def apply_job():
    conn = get_db_connection()
    cur = conn.cursor()

    data = request.get_json()
    student_id = data.get('student_id')
    job_id = data.get('job_id')

    if not student_id or not job_id:
        return jsonify({'error': 'Missing student_id or job_id'}), 400

    try:
        cur.execute("""
            INSERT INTO APPLICATIONS (StudentID, JobID, AppliedDate)
            VALUES (%s, %s, CURDATE())
        """, (student_id, job_id))
        conn.commit()
        return jsonify({'message': 'Application submitted successfully!'}), 201

    except MySQLdb.IntegrityError as e:
        conn.rollback()
        err_str = str(e)

        # ✅ Handle duplicate application or trigger-based eligibility rejection
        if "Duplicate entry" in err_str:
            return jsonify({'error': 'You have already applied for this job'}), 400
        elif "Application blocked" in err_str:  # trigger-based eligibility rejection
            return jsonify({'error': 'Application blocked: You are not eligible for this job'}), 400
        elif "foreign key constraint fails" in err_str:
            return jsonify({'error': 'Invalid student or job reference'}), 400
        else:
            return jsonify({'error': err_str}), 400

    except MySQLdb.Error as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500

    finally:
        cur.close()
        conn.close()


# 🟢 GET /api/applied/<student_id> - Fetch all applied jobs for a student
@apply_bp.route('/applied/<int:student_id>', methods=['GET'])
def get_applied_jobs(student_id):
    conn = get_db_connection()
    cur = conn.cursor(MySQLdb.cursors.DictCursor)

    try:
        cur.execute("""
            SELECT 
                a.ApplicationID AS application_id,
                a.JobID AS job_id,
                a.AppliedDate AS applied_date,
                a.Status AS status,
                j.Title AS title,
                j.JobType AS job_type,
                j.Location AS location,
                j.Compensation AS compensation,
                j.Deadline AS deadline,
                c.CompanyName AS company_name
            FROM APPLICATIONS a
            JOIN JOB_OFFER j ON a.JobID = j.JobID
            JOIN COMPANY c ON j.CompanyID = c.CompanyID
            WHERE a.StudentID = %s
            ORDER BY a.AppliedDate DESC
        """, (student_id,))

        results = cur.fetchall()

        # ✅ Format datetime fields for frontend (ISO strings)
        for row in results:
            if isinstance(row.get("applied_date"), datetime):
                row["applied_date"] = row["applied_date"].isoformat()
            if isinstance(row.get("deadline"), datetime):
                row["deadline"] = row["deadline"].isoformat()

        return jsonify(results), 200

    except MySQLdb.Error as e:
        return jsonify({'error': str(e)}), 400

    finally:
        cur.close()
        conn.close()
