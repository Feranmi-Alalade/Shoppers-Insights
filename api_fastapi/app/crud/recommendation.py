from typing import Any, Dict, List

from dependencies import load_output_mock
from sqlalchemy.orm import Session


def get_recommendations(db: Session) -> List[Dict[str, Any]]:
    """
    Retrieves a list of all recommendations
    """
    data = load_output_mock()

    recommendations = data["getRecommendation"]
    return recommendations
