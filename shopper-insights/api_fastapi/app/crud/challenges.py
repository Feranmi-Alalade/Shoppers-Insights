from typing import Any, Dict, List

from dependencies import load_output_mock
from sqlalchemy.orm import Session


def get_community_challenges(db: Session) -> List[Dict[str, Any]]:
    """
    Retrieves all challenges
    """
    data = load_output_mock()

    challenges = data["getAllCommunityChallenges"]
    return challenges
