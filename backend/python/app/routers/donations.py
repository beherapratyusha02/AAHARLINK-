from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.food_schema import (
    FoodCreate,
    FoodResponse
)
from app.services.donation_services import (
    create_food,
    get_available_food,
    get_food_by_donor
)
from app.utils.validators import validate_quantity


router = APIRouter(
    prefix="/donations",
    tags=["Food Donations"]
)


@router.post("/", response_model=FoodResponse)
def add_donation(
    food: FoodCreate,
    donor_id: int,
    db: Session = Depends(get_db)
):
    if not validate_quantity(food.quantity):
        raise HTTPException(
            status_code=400,
            detail="Quantity must be greater than zero."
        )

    new_food = create_food(
        db=db,
        title=food.title,
        category=food.category,
        quantity=food.quantity,
        location=food.location,
        description=food.description,
        image=food.image,
        donor_id=donor_id,
        expires_at=food.expires_at
    )

    return new_food


@router.get("/", response_model=list[FoodResponse])
def available_food(
    db: Session = Depends(get_db)
):
    return get_available_food(db)


@router.get("/donor/{donor_id}", response_model=list[FoodResponse])
def donor_food(
    donor_id: int,
    db: Session = Depends(get_db)
):
    return get_food_by_donor(db, donor_id)