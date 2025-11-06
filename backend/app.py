from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os
from routes.register import register_bp
from routes.login import login_bp
from routes.joboffer import joboffers_bp
from routes.companies import bp as companies_bp

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:3000", "http://127.0.0.1:3000"]}}, supports_credentials=True)

app.secret_key = os.getenv("SECRET_KEY")

# Register Blueprints
app.register_blueprint(register_bp)
app.register_blueprint(login_bp)
app.register_blueprint(joboffers_bp)
app.register_blueprint(companies_bp)

@app.route('/')
def home():
    return {'message': 'Placement Tracker API running successfully'}

if __name__ == '__main__':
    app.run(debug=True)
