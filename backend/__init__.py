from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from supabase import create_client
from config import Config

db = SQLAlchemy()

supabase = create_client(Config.SUPABASE_URL, Config.SUPABASE_KEY)

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    from routes.auth import auth_bp


    app.register_blueprint(auth_bp)
    app.register_blueprint(startup_bp)

    return app