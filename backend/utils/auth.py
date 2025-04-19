from functools import wraps
from flask import request, jsonify
from database import supabase, SessionLocal
from models.users import User

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.cookies.get("access_token")
        if not token:
            return jsonify({"error": "Session token missing"}), 401

        try:
            user = supabase.auth.get_user(token).user
            if not user:
                return jsonify({"error": "Invalid session"}), 401

            email = user.email

            db = SessionLocal()
            user_in_db = db.query(User).filter_by(email=email).first()
            db.close()

            if not user_in_db:
                return jsonify({"error": "User not found in internal DB"}), 404

            # Inject user identity into request context
            request.user = {
                "id": user_in_db.user_id,          # Internal DB ID (FK in Startup)
                "email": email,                    # Optional, if needed
                "role": user_in_db.role            # "user" or "admin"
            }

        except Exception as e:
            return jsonify({"error": "Token error", "detail": str(e)}), 401

        return f(*args, **kwargs)
    return decorated

def role_required(required_role):
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            if request.user["role"] != required_role:
                return jsonify({"error": "Forbidden"}), 403
            return f(*args, **kwargs)
        return decorated
    return decorator
