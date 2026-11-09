from sqlalchemy.orm import Session

from app.models.food import Food


def find_matching_food(
    db: Session,
    category: str = None,
    location: str = None
):
    query = db.query(Food).filter(
        Food.status == "Available"
    )

    if category:
        query = query.filter(
            Food.category.ilike(f"%{category}%")
        )

    if location:
        query = query.filter(
            Food.location.ilike(f"%{location}%")
        )

    return query.all()