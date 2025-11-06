from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)

# ✅ Fully open CORS (for development)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

app.secret_key = os.getenv("SECRET_KEY")

from routes.register import register_bp
from routes.login import login_bp
from routes.joboffer import joboffers_bp
from routes.companies import bp as companies_bp
from routes.apply import bp as apply_bp

# ✅ Register blueprints
app.register_blueprint(register_bp)
app.register_blueprint(login_bp)
app.register_blueprint(joboffers_bp)
app.register_blueprint(companies_bp)
app.register_blueprint(apply_bp)


@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Placement Tracker API running successfully"})

@app.after_request
def add_cors_headers(response):
    """Guarantee CORS headers for all responses (even errors)"""
    response.headers["Access-Control-Allow-Origin"] = "http://localhost:3000"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, X-Admin-Username, X-Admin-Password"
    return response


if __name__ == "__main__":
    app.run(debug=True, use_reloader=False)
