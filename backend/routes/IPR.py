from flask import Blueprint, request, jsonify
from database import SessionLocal
from models.IPR import IPR
from utils.auth import token_required, role_required

ipr_bp = Blueprint("ipr", __name__, url_prefix="/api/v1/ipr")

# Get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Admin or User: View IPR entries
@ipr_bp.route("/", methods=["GET"])
@token_required
def get_all_ipr():
    db = next(get_db())
    role = request.user["role"]
    user_id = request.user["id"]

    if role == "admin":
        iprs = db.query(IPR).all()
    else:
        iprs = db.query(IPR).filter(IPR.user_id == user_id).all()

    return jsonify([{
        "ipr_id": i.ipr_id,
        "ipr_type": i.ipr_type,
        "title": i.title,
        "ipr_number": i.ipr_number,
        "filing_date": str(i.filing_date) if i.filing_date else None,
        "status": i.status,
        "related_startup_id": i.related_startup_id,
        "created_at": str(i.created_at) if i.created_at else None,
        "updated_at": str(i.updated_at) if i.updated_at else None,
        "user_id": i.user_id,
    } for i in iprs])

# Add IPR
@ipr_bp.route("/add-ipr", methods=["POST"])
@token_required
def add_ipr():
    db = next(get_db())
    data = request.json
    user_id = request.user["id"]

    new_ipr = IPR(
        ipr_type=data.get("ipr_type"),
        title=data.get("title"),
        ipr_number=data.get("ipr_number"),
        filing_date=data.get("filing_date"),
        status=data.get("status"),
        related_startup_id=data.get("related_startup_id"),
        created_at=data.get("created_at"),
        updated_at=data.get("updated_at"),
        user_id=user_id
    )
    db.add(new_ipr)
    db.commit()
    db.refresh(new_ipr)

    return jsonify({"message": "IPR record created", "ipr_id": new_ipr.ipr_id})

# Update IPR
@ipr_bp.route("/update-ipr/<int:ipr_id>", methods=["PUT"])
@token_required
def update_ipr(ipr_id):
    db = next(get_db())
    user_id = request.user["id"]
    role = request.user["role"]

    ipr = db.query(IPR).filter(IPR.ipr_id == ipr_id).first()
    if not ipr:
        return jsonify({"error": "IPR record not found"}), 404

    if role != "admin" and ipr.user_id != user_id:
        return jsonify({"error": "Unauthorized"}), 403

    data = request.json
    allowed_fields = ["ipr_type", "title", "ipr_number", "filing_date", "status", "related_startup_id", "created_at", "updated_at"]
    for key, value in data.items():
        if key in allowed_fields:
            setattr(ipr, key, value)
        else:
            return jsonify({"error": f"Invalid Field - Cannot update: {key}"}), 400

    db.commit()
    db.refresh(ipr)

    return jsonify({"message": "IPR record updated"})

# Delete IPR (Admin only)
@ipr_bp.route("/delete-ipr/<int:ipr_id>", methods=["DELETE"])
@token_required
@role_required("admin")
def delete_ipr(ipr_id):
    db = next(get_db())
    ipr = db.query(IPR).filter(IPR.ipr_id == ipr_id).first()
    if not ipr:
        return jsonify({"error": "IPR record not found"}), 404

    db.delete(ipr)
    db.commit()
    return jsonify({"message": "IPR record deleted"})
