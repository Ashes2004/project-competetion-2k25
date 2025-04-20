from flask import Flask
from flask_cors import CORS
from routes.startup import startup_bp
from routes.research import research_bp
from routes.IPR import ipr_bp
from routes.user import user_bp
from routes.innovation import innovation_bp
from flask import jsonify

def create_app():
    app = Flask(__name__)
    CORS(app)

    @app.route("/health", methods=["GET"])
    def health_check():
        return jsonify({"status": "healthy"})

    # Register all blueprints
    app.register_blueprint(startup_bp)
    app.register_blueprint(user_bp)
    app.register_blueprint(research_bp)
    app.register_blueprint(ipr_bp)
    app.register_blueprint(innovation_bp)

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
