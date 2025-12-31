from crud import get_recommendations as crud_get_recommendations
from dependencies import get_db
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

router = APIRouter()


@router.get("/")
def get_recommendations(db: Session = Depends(get_db)):
    """
    Retrieves recommendations
    """
    recommendations = crud_get_recommendations(db=db)
    return recommendations
