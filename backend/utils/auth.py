from functools import wraps
from flask import request, jsonify
from database import supabase

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get("Authorization")
        if not token:
            return jsonify({"error": "Token required"}), 401
        try:
            user = supabase.auth.get_user(token.replace("Bearer ", "")).user
            if not user:
                return jsonify({"error": "Invalid token"}), 401
            request.user = user
            user_id = user.id

            # Also fetch role from Supabase DB
            response = supabase.table("users").select("role").eq("id", user_id).execute()
            role = response.data[0]["role"] if response.data else "user"
            request.user_role = role

        except Exception as e:
            return jsonify({"error": "Token error", "detail": str(e)}), 401
        return f(*args, **kwargs)
    return decorated

def role_required(required_role):
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            if request.user_role != required_role:
                return jsonify({"error": "Forbidden"}), 403
            return f(*args, **kwargs)
        return decorated
    return decorator
