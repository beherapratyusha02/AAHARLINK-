from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime

from app.database import Base


class Food(Base):
    __tablename__ = "foods"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String(150), nullable=False)

    category = Column(String(100), nullable=False)

    quantity = Column(Integer, nullable=False)

    location = Column(String(200), nullable=False)

    description = Column(Text, nullable=True)

    image = Column(String(255), nullable=True)

    donor_id = Column(Integer, nullable=False)

    status = Column(String(30), default="Available")

    created_at = Column(DateTime, default=datetime.utcnow)

    expires_at = Column(DateTime, nullable=True)