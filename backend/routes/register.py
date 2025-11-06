from flask import Blueprint, request, jsonify
import os
import bcrypt
from db import get_db_connection

register_bp = Blueprint('register', __name__)

@register_bp.route('/api/register', methods=['POST'])
def register():
    # Try to detect if request is JSON or multipart/form-data
    if request.is_json:
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        phone = data.get('phone')
        degree = data.get('degree')
        branch = data.get('branch')
        batch = data.get('batch')
        tenth_marks = data.get('tenthMarks')
        twelfth_marks = data.get('twelfthMarks')
        gpa = data.get('gpa')
        password = data.get('password')
        resume_file = None
        profile_picture = None
    else:
        data = request.form
        name = data.get('name')
        email = data.get('email')
        phone = data.get('phone')
        degree = data.get('degree')
        branch = data.get('branch')
        batch = data.get('batch')
        tenth_marks = data.get('tenthMarks')
        twelfth_marks = data.get('twelfthMarks')
        gpa = data.get('gpa')
        password = data.get('password')
        resume_file = request.files.get('resume')
        profile_picture = request.files.get('profilePicture')

    # ✅ Basic validation
    if not all([name, email, phone, degree, branch, batch, tenth_marks, twelfth_marks, gpa, password]):
        return jsonify({'success': False, 'message': 'Missing required fields'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    # ✅ Check if email already exists
    cursor.execute("SELECT * FROM STUDENT WHERE email = %s", (email,))
    if cursor.fetchone():
        cursor.close()
        conn.close()
        return jsonify({'success': False, 'message': 'Email already registered'}), 409

    # ✅ Hash the password securely
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    # ✅ Save files only if they exist (for form-data requests)
    resume_path = None
    profile_pic_path = None

    upload_dir = "uploads"
    os.makedirs(os.path.join(upload_dir, "resumes"), exist_ok=True)
    os.makedirs(os.path.join(upload_dir, "profiles"), exist_ok=True)

    if resume_file:
        resume_path = os.path.join(upload_dir, "resumes", f"{email}_resume_{resume_file.filename}")
        resume_file.save(resume_path)

    if profile_picture:
        profile_pic_path = os.path.join(upload_dir, "profiles", f"{email}_pic_{profile_picture.filename}")
        profile_picture.save(profile_pic_path)

    # ✅ Insert into DB
    cursor.execute("""
        INSERT INTO STUDENT 
        (student_name, email, phone, degree, branch, batch,
         tenth_marks, twelfth_marks, gpa, resume_url, profile_picture, password_hash)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """, (name, email, phone, degree, branch, batch,
          tenth_marks, twelfth_marks, gpa, resume_path, profile_pic_path, hashed_password))

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({'success': True, 'message': 'Registration successful'}), 201
