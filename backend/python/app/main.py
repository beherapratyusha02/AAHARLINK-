import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import inspect, text

from app.database import Base, engine

from app.models import User, Food, FoodRequest

from app.routers import (
    auth,
    donations,
    food_request,
    dashboard
)


# Create database tables
Base.metadata.create_all(bind=engine)
if "expires_at" not in {
    column["name"] for column in inspect(engine).get_columns("foods")
}:
    with engine.begin() as connection:
        connection.execute(text("ALTER TABLE foods ADD COLUMN expires_at DATETIME"))


app = FastAPI(
    title="AaharLink API",
    description="Backend API for the AaharLink food donation platform",
    version="1.0.0"
)


# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        origin.strip()
        for origin in os.getenv(
            "FRONTEND_ORIGINS",
            "http://127.0.0.1:5500"
        ).split(",")
        if origin.strip()
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# Routers
app.include_router(auth.router, prefix="/api")
app.include_router(donations.router, prefix="/api")
app.include_router(food_request.router, prefix="/api")
app.include_router(dashboard.router, prefix="/api")


@app.get("/")
def root():
    return {
        "success": True,
        "message": "Welcome to AaharLink API",
        "status": "Backend is running"
    }


@app.get("/health")
def health_check():
    return {
        "success": True,
        "message": "AaharLink backend is healthy"
    }