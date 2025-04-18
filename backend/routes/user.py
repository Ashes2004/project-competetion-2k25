# routes/user.py
from flask import Blueprint, request, jsonify
from utils.auth import token_required
from database import supabase
from models.user import User
from database import SessionLocal
from sqlalchemy.orm import Session

user_bp = Blueprint("users", __name__, url_prefix="/api/v1/users")

# Get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Sign Up Route
@user_bp.route("/signup", methods=["POST"])
def signup():
    data = request.json

    email = data.get("email")
    password = data.get("password")
    role = data.get("role", "user")  # Default to 'user' if no role is provided

    try:
        # Register user with Supabase
        response = supabase.auth.sign_up({
            "email": email,
            "password": password
        })

        # Insert user into the database (if needed)
        db = next(get_db())
        new_user = User(email=email, password=password, role=role)
        db.add(new_user)
        db.commit()

        return jsonify({
            "message": "User created successfully. Please check your email to verify."
        }), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400


# Login Route (Authenticate user and get JWT)
@user_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    try:
        # Authenticate user with Supabase
        response = supabase.auth.sign_in({
            "email": email,
            "password": password
        })

        # If authentication is successful, return user data and access token
        if response.get("error"):
            return jsonify({"error": "Invalid credentials"}), 401

        user = response["user"]

        return jsonify({
            "message": "Login successful",
            "access_token": user["access_token"]
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
