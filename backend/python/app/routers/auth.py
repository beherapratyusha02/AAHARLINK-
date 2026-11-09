from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.user_schema import (
    UserRegister,
    UserLogin,
    UserResponse
)
from app.services.auth_services import (
    register_user,
    login_user
)
from app.utils.validators import validate_role


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/register", response_model=UserResponse)
def register(
    user: UserRegister,
    db: Session = Depends(get_db)
):
    if not validate_role(user.role):
        raise HTTPException(
            status_code=400,
            detail="Invalid role. Use donor, seeker, or both."
        )

    new_user = register_user(
        db=db,
        name=user.name,
        email=user.email,
        password=user.password,
        phone=user.phone,
        role=user.role
    )

    if new_user is None:
        raise HTTPException(
            status_code=400,
            detail="Email already registered."
        )

    return new_user


@router.post("/login", response_model=UserResponse)
def login(
    user: UserLogin,
    db: Session = Depends(get_db)
):
    logged_user = login_user(
        db=db,
        email=user.email,
        password=user.password
    )

    if logged_user is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password."
        )

    return logged_user