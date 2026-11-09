from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class FoodCreate(BaseModel):
    title: str
    category: str
    quantity: int
    location: str
    description: Optional[str] = None
    image: Optional[str] = None
    expires_at: Optional[datetime] = None


class FoodResponse(BaseModel):
    id: int
    title: str
    category: str
    quantity: int
    location: str
    description: Optional[str] = None
    image: Optional[str] = None
    donor_id: int
    status: str
    expires_at: Optional[datetime] = None

    class Config:
        from_attributes = True