from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
import os

from routes.register import register_bp
from routes.login import login_bp
from routes.joboffer import joboffers_bp
from routes.companies import bp as companies_bp
from routes.apply import apply_bp
from routes.application import applications_bp  

load_dotenv()

app = Flask(__name__)

# ✅ Allowed origins list
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
]

# ✅ Global CORS configuration
CORS(
    app,
    origins=ALLOWED_ORIGINS,
    supports_credentials=True,
    allow_headers=[
        "Content-Type",
        "Authorization",
        "X-Admin-Username",
        "X-Admin-Password",
    ],
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
)

@app.after_request
def add_cors_headers(resp):
    origin = request.headers.get("Origin")
    if origin in ALLOWED_ORIGINS:
        resp.headers["Access-Control-Allow-Origin"] = origin
    resp.headers["Access-Control-Allow-Credentials"] = "true"
    resp.headers["Access-Control-Allow-Methods"] = "GET,POST,PUT,DELETE,OPTIONS"
    resp.headers["Access-Control-Allow-Headers"] = (
        "Content-Type,Authorization,X-Admin-Username,X-Admin-Password"
    )
    return resp

# ✅ Register blueprints
app.register_blueprint(register_bp)
app.register_blueprint(login_bp)
app.register_blueprint(joboffers_bp)
app.register_blueprint(companies_bp)
app.register_blueprint(apply_bp)
app.register_blueprint(applications_bp)

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Placement Tracker API running successfully"})

if __name__ == "__main__":
    # Disable reloader to prevent CORS flicker
    app.run(debug=True, use_reloader=False)
