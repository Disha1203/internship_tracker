from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
import os

# Import blueprints AFTER creating app
# (important order)
from routes.register import register_bp
from routes.login import login_bp
from routes.joboffer import joboffers_bp
from routes.companies import bp as companies_bp

load_dotenv()

def create_app():
    app = Flask(__name__)

    # ✅ Apply CORS to all routes and blueprints
    CORS(
        app,
        origins=["http://localhost:3000", "http://127.0.0.1:3000"],
        supports_credentials=True,
        expose_headers=["Content-Type", "Authorization"],
        allow_headers=[
            "Content-Type",
            "Authorization",
            "X-Admin-Username",
            "X-Admin-Password"
        ],
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    )

    app.secret_key = os.getenv("SECRET_KEY")

    # ✅ Register blueprints AFTER CORS
    app.register_blueprint(register_bp)
    app.register_blueprint(login_bp)
    app.register_blueprint(joboffers_bp)
    app.register_blueprint(companies_bp)

    # ✅ Always include CORS headers
    # @app.after_request
    # def add_headers(response):
    #     origin = request.headers.get("Origin")
    #     if origin in ["http://localhost:3000", "http://127.0.0.1:3000"]:
    #         response.headers["Access-Control-Allow-Origin"] = origin
    #     response.headers["Access-Control-Allow-Credentials"] = "true"
    #     response.headers["Access-Control-Allow-Methods"] = "GET,POST,PUT,DELETE,OPTIONS"
    #     response.headers["Access-Control-Allow-Headers"] = (
    #         "Content-Type,Authorization,X-Admin-Username,X-Admin-Password"
    #     )
    #     return response

    @app.before_request
    def handle_preflight():
        if request.method == "OPTIONS":
            resp = app.make_default_options_response()
            headers = request.headers.get("Access-Control-Request-Headers")
            origin = request.headers.get("Origin")
            if origin:
                resp.headers["Access-Control-Allow-Origin"] = origin
            resp.headers["Access-Control-Allow-Methods"] = "GET,POST,PUT,DELETE,OPTIONS"
            resp.headers["Access-Control-Allow-Headers"] = headers or (
                "Content-Type,Authorization,X-Admin-Username,X-Admin-Password"
            )
            resp.headers["Access-Control-Allow-Credentials"] = "true"
            return resp

    @app.route("/", methods=["GET"])
    def home():
        return jsonify({"message": "Placement Tracker API running successfully"})

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
