from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
import os

# Import blueprints AFTER app creation
from routes.register import register_bp
from routes.login import login_bp
from routes.joboffer import joboffers_bp
from routes.companies import bp as companies_bp
from routes.apply import bp as apply_bp

load_dotenv()

app = Flask(__name__)

# ✅ Global CORS: applies even during reload
CORS(
    app,
    origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    supports_credentials=True,
    allow_headers=[
        "Content-Type",
        "Authorization",
        "X-Admin-Username",
        "X-Admin-Password",
    ],
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
)

app.secret_key = os.getenv("SECRET_KEY")


@app.after_request
def add_cors_headers(response):
    """Guarantee CORS headers after every reload or error"""
    origin = request.headers.get("Origin")
    if origin in ["http://localhost:3000", "http://127.0.0.1:3000"]:
        response.headers["Access-Control-Allow-Origin"] = origin
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Allow-Methods"] = "GET,POST,PUT,DELETE,OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = (
        "Content-Type,Authorization,X-Admin-Username,X-Admin-Password"
    )
    return response


    # ✅ Register blueprints AFTER CORS
    app.register_blueprint(register_bp)
    app.register_blueprint(login_bp)
    app.register_blueprint(joboffers_bp)
    app.register_blueprint(companies_bp)
    app.register_blueprint(apply_bp)
@app.before_request
def handle_preflight():
    """Respond to browser preflight requests quickly (no 403 caching)"""
    if request.method == "OPTIONS":
        resp = app.make_default_options_response()
        origin = request.headers.get("Origin")
        if origin:
            resp.headers["Access-Control-Allow-Origin"] = origin
        resp.headers["Access-Control-Allow-Methods"] = "GET,POST,PUT,DELETE,OPTIONS"
        resp.headers["Access-Control-Allow-Headers"] = (
            "Content-Type,Authorization,X-Admin-Username,X-Admin-Password"
        )
        resp.headers["Access-Control-Allow-Credentials"] = "true"
        return resp


# Register blueprints AFTER CORS setup
app.register_blueprint(register_bp)
app.register_blueprint(login_bp)
app.register_blueprint(joboffers_bp)
app.register_blueprint(companies_bp)


@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Placement Tracker API running successfully"})


if __name__ == "__main__":
    # Disable auto-reload to prevent “temporary no-CORS” window
    app.run(debug=True, use_reloader=False)
