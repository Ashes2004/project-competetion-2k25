# routes/user.py
from flask import Blueprint, request, jsonify, make_response
from database import supabase
from models.users import User
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

@user_bp.route("/signup", methods=["POST"])
def signup():
    data = request.json
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role", "user")  # Default to 'user' if no role is provided

    try:
        db = next(get_db())
        # Check if the user already exists in the local database
        if db.query(User).filter_by(email=email).first():
            return jsonify({"error": "User already exists, Kindly Login"}), 400

        # Sign up with Supabase
        try:
            response = supabase.auth.sign_up({
                "email": email,
                "password": password
            })
        except Exception as e:
            return jsonify({"error": f"Supabase signup failed: {str(e)}"}), 400

        if not response.user:
            return jsonify({"error": "Signup failed. No user returned."}), 400

        new_user = User(email=email, name=name, role=role)
        db.add(new_user)
        db.commit()

        return jsonify({
            "message": "User created successfully. Please check your email to verify."
        }), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 400


@user_bp.route("/login", methods=["POST"])
def login():
    db = next(get_db())

    # Check if user is already logged in by checking the cookie
    token = request.cookies.get("access_token")
    if token:
        try:
            user_info = supabase.auth.get_user(token)
            email = user_info.user.email
            role = db.query(User).filter_by(email=email).first().role

            return jsonify({
                "message": "Already logged in",
                "user": {
                    "email": email,
                    "role": role
                }
            }), 200
        except Exception:
            pass  # Invalid or expired token, continue to login flow

    # Fresh login flow
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    try:
        response = supabase.auth.sign_in_with_password({
            "email": email,
            "password": password
        })

        if not response.user or not response.session:
            return jsonify({"error": "Invalid credentials"}), 401

        user = response.user
        session = response.session

        res = make_response(jsonify({
            "message": "Login successful",
            "user": {
                "email": user.email,
                "role": db.query(User).filter_by(email=email).first().role,
            }
        }))

        # Set access token in cookie
        res.set_cookie(
            key="access_token",
            value=session.access_token,
            httponly=True,
            secure=False,  # Set to True in production with HTTPS
            samesite="None",
            max_age=3600
        )

        return res

    except Exception as e:
        return jsonify({"error": str(e)}), 400

@user_bp.route("/logout", methods=["POST"])
def logout():
    response = make_response(jsonify({"message": "Logged out successfully"}))
    response.set_cookie("access_token", "", expires=0)  # Clear the cookie
    return response