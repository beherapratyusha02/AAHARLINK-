from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime

from app.database import Base


class FoodRequest(Base):
    __tablename__ = "food_requests"

    id = Column(Integer, primary_key=True, index=True)

    food_id = Column(Integer, nullable=False)

    seeker_id = Column(Integer, nullable=False)

    quantity = Column(Integer, nullable=False)

    message = Column(Text, nullable=True)

    status = Column(String(30), default="Pending")

    created_at = Column(DateTime, default=datetime.utcnow)