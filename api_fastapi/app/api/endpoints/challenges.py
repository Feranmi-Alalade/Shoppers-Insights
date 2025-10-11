from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from crud import get_community_challenges
from dependencies import get_db

router = APIRouter()

@router.get("/")
def get_community_challenges(db: Session = Depends(get_db)):
    """
    Retrieves all community challenges
    """
    challenges = get_community_challenges(db=db)
    return challenges