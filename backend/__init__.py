from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from supabase import create_client
from config import Config
from routes.startup import startup_bp
from routes.user import user_bp  # Importing auth blueprint if necessary

db = SQLAlchemy()

# Initialize Supabase client
supabase = create_client(Config.SUPABASE_URL, Config.SUPABASE_KEY)

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)  # Load configuration settings from Config

    # Register Blueprints
    app.register_blueprint(startup_bp)
    app.register_blueprint(user_bp)
  # If you have a separate auth blueprint

    return app
