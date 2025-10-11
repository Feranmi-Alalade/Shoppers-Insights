from crud import get_users as crud_get_users
from dependencies import get_db
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

router = APIRouter()


@router.get("/")
def get_users(db: Session = Depends(get_db)):
    """
    Retrieves a list of all users
    """
    user_list = crud_get_users(db=db)
    return user_list
