# login.py
from flask import Blueprint, request, jsonify
from db import get_db_connection
import MySQLdb.cursors
import jwt
from flask_cors import CORS
import datetime
import os
import bcrypt

# Create Blueprint
login_bp = Blueprint('login', __name__)

# Secret key for JWT (fallback for local dev)
SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "supersecretkey")

@login_bp.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()

        # ✅ Validate required fields
        if not data or 'email' not in data or 'password' not in data:
            return jsonify({'success': False, 'message': 'Email and password are required'}), 400

        email = data['email']
        password = data['password'].encode('utf-8')

        # ✅ Connect to DB
        conn = get_db_connection()
        cursor = conn.cursor(MySQLdb.cursors.DictCursor)
        cursor.execute("SELECT * FROM STUDENT WHERE email = %s", (email,))
        user = cursor.fetchone()
        cursor.close()
        conn.close()

        # ✅ Check if user exists
        if not user:
            return jsonify({'success': False, 'message': 'User not found'}), 404

        stored_hash = user['password_hash'].encode('utf-8')

        # ✅ Verify bcrypt hash
        if not bcrypt.checkpw(password, stored_hash):
            return jsonify({'success': False, 'message': 'Invalid password'}), 401

        # ✅ Generate JWT token
        token = jwt.encode({
            'student_id': user['student_id'],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
        }, SECRET_KEY, algorithm="HS256")

        # ✅ Return consistent response
        return jsonify({
            'success': True,
            'message': 'Login successful',
            'token': token,
            'student': {
                'id': user['student_id'],
                'name': user['student_name'],
                'email': user['email'],
                'phone': user['phone'],
                'degree': user['degree'],
                'branch': user['branch'],
                'batch': user['batch'],
                'gpa': user['gpa'],
                'tenthMarks': user['tenth_marks'],
                'twelfthMarks': user['twelfth_marks'],
                'resumeUrl': user['resume_url'],
                'profilePicture': user['profile_picture']
            }
        }), 200

    except Exception as e:
        # ✅ Handle unexpected errors
        return jsonify({'success': False, 'message': str(e)}), 500
