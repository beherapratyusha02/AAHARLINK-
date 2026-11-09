def validate_role(role: str) -> bool:
    return role in ["donor", "seeker", "both"]


def validate_quantity(quantity: int) -> bool:
    return quantity > 0