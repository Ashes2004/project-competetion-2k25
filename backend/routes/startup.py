from flask import Blueprint, request, jsonify
from database import supabase
from models.startup import Startup
from database import SessionLocal
from utils.auth import token_required, role_required
from sqlalchemy.orm import Session

startup_bp = Blueprint("startups", __name__, url_prefix="/api/v1/startups")

# Get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Admin: view all startups
@startup_bp.route("/", methods=["GET"])
@token_required
def get_all_startups():
    db = next(get_db())
    role = request.user_role
    user_id = request.user.id

    if role == "admin":
        startups = db.query(Startup).all()
    else:
        startups = db.query(Startup).filter(Startup.user_id == user_id).all()

    return jsonify([{
        "startup_id": s.startup_id,
        "name": s.name,
        "description": s.description,
        "founder": s.founder,
        "industry": s.industry,
        "status": s.status,
        "founded_date": str(s.founded_date),
        "user_id": str(s.user_id),
    } for s in startups])

# Add startup
@startup_bp.route("/", methods=["POST"])
@token_required
def add_startup():
    db = next(get_db())
    data = request.json
    user_id = request.user.id

    new_startup = Startup(
        name=data.get("name"),
        description=data.get("description"),
        founder=data.get("founder"),
        industry=data.get("industry"),
        founded_date=data.get("founded_date"),
        status=data.get("status"),
        user_id=user_id
    )
    db.add(new_startup)
    db.commit()
    db.refresh(new_startup)

    return jsonify({"message": "Startup created", "startup_id": new_startup.startup_id})

# Update startup
@startup_bp.route("/<int:startup_id>", methods=["PUT"])
@token_required
def update_startup(startup_id):
    db = next(get_db())
    user_id = request.user.id
    role = request.user_role

    startup = db.query(Startup).filter(Startup.startup_id == startup_id).first()
    if not startup:
        return jsonify({"error": "Startup not found"}), 404

    if role != "admin" and startup.user_id != user_id:
        return jsonify({"error": "Unauthorized"}), 403

    data = request.json
    for key, value in data.items():
        setattr(startup, key, value)
    db.commit()
    db.refresh(startup)

    return jsonify({"message": "Startup updated"})

# Delete startup (Admin only)
@startup_bp.route("/<int:startup_id>", methods=["DELETE"])
@token_required
@role_required("admin")
def delete_startup(startup_id):
    db = next(get_db())
    startup = db.query(Startup).filter(Startup.startup_id == startup_id).first()
    if not startup:
        return jsonify({"error": "Startup not found"}), 404

    db.delete(startup)
    db.commit()
    return jsonify({"message": "Startup deleted"})
