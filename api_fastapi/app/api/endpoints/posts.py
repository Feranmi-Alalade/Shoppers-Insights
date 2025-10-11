from crud import get_community_posts as crud_get_posts
from dependencies import get_db
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

router = APIRouter()


@router.get("/")
def get_community_posts(db: Session = Depends(get_db)):
    """
    Retrieves all community posts
    """
    all_posts = crud_get_posts(db=db)
    return all_posts
