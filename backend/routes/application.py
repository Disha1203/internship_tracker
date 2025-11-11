from flask import Blueprint, jsonify, request
from MySQLdb import connect, cursors
import os
from db import get_db_connection  # ✅ make sure this returns MySQLdb.connect()

applications_bp = Blueprint('applications', __name__)

# ===============================
# 1️⃣ Get all applications for a student
# ===============================
@applications_bp.route('/api/applications/<int:student_id>', methods=['GET'])
def get_applications(student_id):
    db = get_db_connection()
    cursor = db.cursor()

    query = """
    SELECT 
        a.ApplicationID AS id,
        c.CompanyName AS company,
        j.Title AS position,
        DATE_FORMAT(a.AppliedDate, '%%Y-%%m-%%d') AS appliedDate,
        a.Status AS status,
        CASE 
            WHEN a.Status = 'Accepted' THEN 'Selected'
            WHEN a.Status = 'Rejected' THEN 'Not Selected'
            ELSE 'Pending'
        END AS result
    FROM APPLICATIONS a
    JOIN JOB_OFFER j ON a.JobID = j.JobID
    JOIN COMPANY c ON j.CompanyID = c.CompanyID
    WHERE a.StudentID = %s
    ORDER BY a.AppliedDate DESC;
    """

    cursor.execute(query, (student_id,))
    rows = cursor.fetchall()

    applications = []
    for row in rows:
        applications.append({
            "id": row[0],
            "company": row[1],
            "position": row[2],
            "appliedDate": row[3],
            "status": row[4],
            "result": row[5]
        })

    cursor.close()
    db.close()

    return jsonify(applications)


# ===============================
# 2️⃣ Get aggregate application stats
# ===============================
@applications_bp.route('/api/applications/<int:student_id>/stats', methods=['GET'])
def get_application_stats(student_id):
    db = get_db_connection()
    cursor = db.cursor()

    query = """
        SELECT 
            Status,
            COUNT(*) AS count
        FROM APPLICATIONS
        WHERE StudentID = %s
        GROUP BY Status;
    """
    cursor.execute(query, (student_id,))
    rows = cursor.fetchall()

    stats = {
        "Applied": 0,
        "Under Review": 0,
        "Interview Scheduled": 0,
        "Rejected": 0,
        "Accepted": 0,
        "Total": 0
    }

    for row in rows:
        if isinstance(row, dict):
            stats[row["Status"]] = row["count"]
        else:
            status, count = row
            stats[status] = count

    stats["Total"] = sum(v for k, v in stats.items() if k != "Total")

    cursor.close()
    db.close()
    return jsonify(stats)


# ===============================
# 3️⃣ Get details for one application
# ===============================
@applications_bp.route('/api/applications/details/<int:application_id>', methods=['GET'])
def get_application_details(application_id):
    db = get_db_connection()
    cursor = db.cursor()

    query = """
        SELECT 
            a.ApplicationID,
            s.student_name,
            s.email,
            c.CompanyName,
            j.Title,
            j.Description,
            a.Status,
            a.AppliedDate
        FROM APPLICATIONS a
        JOIN STUDENT s ON a.StudentID = s.student_id
        JOIN JOB_OFFER j ON a.JobID = j.JobID
        JOIN COMPANY c ON j.CompanyID = c.CompanyID
        WHERE a.ApplicationID = %s;
    """
    cursor.execute(query, (application_id,))
    row = cursor.fetchone()

    if not row:
        cursor.close()
        db.close()
        return jsonify({"error": "Application not found"}), 404

    details = {
        "ApplicationID": row[0],
        "student_name": row[1],
        "email": row[2],
        "CompanyName": row[3],
        "Title": row[4],
        "Description": row[5],
        "Status": row[6],
        "AppliedDate": row[7].strftime("%Y-%m-%d") if row[7] else None,
    }

    cursor.close()
    db.close()
    return jsonify(details)
