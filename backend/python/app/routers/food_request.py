from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.food import Food
from app.models.request import FoodRequest
from app.schemas.request_schema import (
    FoodRequestCreate,
    FoodRequestResponse
)


router = APIRouter(
    prefix="/food-requests",
    tags=["Food Requests"]
)


@router.post(
    "/",
    response_model=FoodRequestResponse
)
def create_request(
    request: FoodRequestCreate,
    db: Session = Depends(get_db)
):
    food = (
        db.query(Food)
        .filter(Food.id == request.food_id)
        .first()
    )

    if not food:
        raise HTTPException(
            status_code=404,
            detail="Food donation not found."
        )

    if food.status != "Available":
        raise HTTPException(
            status_code=400,
            detail="This food is no longer available."
        )

    if request.quantity <= 0:
        raise HTTPException(
            status_code=400,
            detail="Quantity must be greater than zero."
        )

    if request.quantity > food.quantity:
        raise HTTPException(
            status_code=400,
            detail="Requested quantity is greater than available quantity."
        )

    new_request = FoodRequest(
        food_id=request.food_id,
        seeker_id=request.seeker_id,
        quantity=request.quantity,
        message=request.message,
        status="Pending"
    )

    db.add(new_request)
    db.commit()
    db.refresh(new_request)

    return new_request


@router.get(
    "/seeker/{seeker_id}",
    response_model=list[FoodRequestResponse]
)
def get_seeker_requests(
    seeker_id: int,
    db: Session = Depends(get_db)
):
    return (
        db.query(FoodRequest)
        .filter(FoodRequest.seeker_id == seeker_id)
        .order_by(FoodRequest.created_at.desc())
        .all()
    )