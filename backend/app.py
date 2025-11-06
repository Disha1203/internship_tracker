from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
import os

from routes.register import register_bp
from routes.login import login_bp
from routes.joboffer import joboffers_bp
from routes.companies import bp as companies_bp

load_dotenv()

app = Flask(__name__)

# ✅ CORS always active
CORS(
    app,
    origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    supports_credentials=True,
    allow_headers=[
        "Content-Type",
        "Authorization",
        "X-Admin-Username",
        "X-Admin-Password"
    ],
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
)

@app.after_request
def add_cors_headers(resp):
    origin = request.headers.get("Origin")
    if origin in ["http://localhost:3000", "http://127.0.0.1:3000"]:
        resp.headers["Access-Control-Allow-Origin"] = origin
    resp.headers["Access-Control-Allow-Credentials"] = "true"
    resp.headers["Access-Control-Allow-Methods"] = "GET,POST,PUT,DELETE,OPTIONS"
    resp.headers["Access-Control-Allow-Headers"] = (
        "Content-Type,Authorization,X-Admin-Username,X-Admin-Password"
    )
    return resp

# register blueprints
app.register_blueprint(register_bp)
app.register_blueprint(login_bp)
app.register_blueprint(joboffers_bp)
app.register_blueprint(companies_bp)

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Placement Tracker API running successfully"})

if __name__ == "__main__":
    # 🚫 disable reloader (the flicker that causes CORS to drop)
    app.run(debug=True, use_reloader=False)
