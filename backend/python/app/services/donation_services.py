from datetime import datetime
from typing import Optional
from sqlalchemy.orm import Session

from app.models.food import Food


def create_food(
    db: Session,
    title: str,
    category: str,
    quantity: int,
    location: str,
    description: str,
    image: str,
    donor_id: int,
    expires_at: Optional[datetime] = None
):
    food = Food(
        title=title,
        category=category,
        quantity=quantity,
        location=location,
        description=description,
        image=image,
        donor_id=donor_id,
        status="Available",
        expires_at=expires_at
    )

    db.add(food)
    db.commit()
    db.refresh(food)

    return food


def get_available_food(db: Session):
    return (
        db.query(Food)
        .filter(Food.status == "Available")
        .order_by(Food.created_at.desc())
        .all()
    )


def get_food_by_donor(db: Session, donor_id: int):
    return (
        db.query(Food)
        .filter(Food.donor_id == donor_id)
        .order_by(Food.created_at.desc())
        .all()
    )