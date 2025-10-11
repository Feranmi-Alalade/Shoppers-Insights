from typing import Any, Dict, List

from dependencies import load_output_mock
from sqlalchemy.orm import Session


def get_users(db: Session) -> List[Dict[str, Any]]:
    """
    Retrieves a list of all users
    """
    data = load_output_mock()

    users = data["getAllUsers"]
    return users
