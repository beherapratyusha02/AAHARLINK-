from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.food import Food
from app.models.request import FoodRequest


router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


@router.get("/{user_id}")
def dashboard(
    user_id: int,
    db: Session = Depends(get_db)
):
    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        return {
            "success": False,
            "message": "User not found."
        }

    donated_food = (
        db.query(Food)
        .filter(Food.donor_id == user_id)
        .count()
    )

    food_requests = (
        db.query(FoodRequest)
        .filter(FoodRequest.seeker_id == user_id)
        .count()
    )

    available_food = (
        db.query(Food)
        .filter(Food.status == "Available")
        .count()
    )

    return {
        "success": True,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role
        },
        "statistics": {
            "donated_food": donated_food,
            "food_requests": food_requests,
            "available_food": available_food
        }
    }