from pydantic import BaseModel
from typing import Optional


class FoodRequestCreate(BaseModel):
    food_id: int
    seeker_id: int
    quantity: int
    message: Optional[str] = None


class FoodRequestResponse(BaseModel):
    id: int
    food_id: int
    seeker_id: int
    quantity: int
    message: Optional[str] = None
    status: str

    class Config:
        from_attributes = True