from flask import Flask
from flask_cors import CORS
from routes.startup import startup_bp
from routes.user import user_bp

def create_app():
    app = Flask(__name__)
    CORS(app)  # Allow cross-origin requests

    app.register_blueprint(startup_bp)
    app.register_blueprint(user_bp)
    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
