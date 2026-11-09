from sqlalchemy.orm import Session

from app.models.user import User
from app.utils.security import hash_password, verify_password


def register_user(
    db: Session,
    name: str,
    email: str,
    password: str,
    phone: str,
    role: str
):
    existing_user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if existing_user:
        return None

    user = User(
        name=name,
        email=email,
        password=hash_password(password),
        phone=phone,
        role=role
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


def login_user(
    db: Session,
    email: str,
    password: str
):
    user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if not user:
        return None

    if not verify_password(password, user.password):
        return None

    return user