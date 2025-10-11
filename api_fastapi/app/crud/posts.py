from typing import Any, Dict, List

from dependencies import load_output_mock
from sqlalchemy.orm import Session


def get_community_posts(db: Session) -> List[Dict[str, Any]]:
    """
    Retrieves all community posts
    """
    data = load_output_mock()
    posts = data["getAllCommunityPosts"]
    return posts
