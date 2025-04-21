from flask import Blueprint, request, jsonify
from models.innovation import Innovation
from database import SessionLocal
from utils.auth import token_required, role_required

innovation_bp = Blueprint("innovations", __name__, url_prefix="/api/v1/innovations")

# Get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Admin or User: View innovations
@innovation_bp.route("/", methods=["GET"])
@token_required
def get_all_innovations():
    db = next(get_db())
    role = request.user["role"]
    user_id = request.user["id"]

    if role == "admin":
        innovations = db.query(Innovation).all()
    else:
        innovations = db.query(Innovation).filter(Innovation.user_id == user_id).all()

    return jsonify([{
        "innovation_id": i.innovation_id,
        "title": i.title,
        "description": i.description,
        "domain": i.domain,
        "level": i.level,
        "status": i.status,
        "submitted_on": str(i.submitted_on),
        "user_id": str(i.user_id),
    } for i in innovations])

# Add innovation
@innovation_bp.route("/add-innovation", methods=["POST"])
@token_required
def add_innovation():
    db = next(get_db())
    data = request.json
    user_id = request.user["id"]

    new_innovation = Innovation(
        title=data.get("title"),
        description=data.get("description"),
        domain=data.get("domain"),
        level=data.get("level"),
        status=data.get("status", "draft"),
        user_id=user_id
    )

    db.add(new_innovation)
    db.commit()
    db.refresh(new_innovation)

    return jsonify({"message": "Innovation created", "innovation_id": new_innovation.innovation_id})

# Update innovation
@innovation_bp.route("/update-innovation/<int:innovation_id>", methods=["PUT"])
@token_required
def update_innovation(innovation_id):
    db = next(get_db())
    user_id = request.user["id"]
    role = request.user["role"]

    innovation = db.query(Innovation).filter(Innovation.innovation_id == innovation_id).first()
    if not innovation:
        return jsonify({"error": "Innovation not found"}), 404

    if role != "admin" and innovation.user_id != user_id:
        return jsonify({"error": "Unauthorized"}), 403

    data = request.json
    allowed_fields = ["title", "description", "domain", "level", "status"]
    for key, value in data.items():
        if key in allowed_fields:
            setattr(innovation, key, value)
        else:
            return jsonify({"error": f"Invalid Field - Cannot update: {key}"}), 400

    db.commit()
    db.refresh(innovation)

    return jsonify({"message": "Innovation updated"})

# Delete innovation (Admin only)
@innovation_bp.route("/delete-innovation/<int:innovation_id>", methods=["DELETE"])
@token_required
@role_required("admin")
def delete_innovation(innovation_id):
    db = next(get_db())
    innovation = db.query(Innovation).filter(Innovation.innovation_id == innovation_id).first()
    if not innovation:
        return jsonify({"error": "Innovation not found"}), 404

    db.delete(innovation)
    db.commit()

    return jsonify({"message": "Innovation deleted"})
