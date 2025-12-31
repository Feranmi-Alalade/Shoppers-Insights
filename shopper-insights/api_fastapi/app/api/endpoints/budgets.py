from typing import List

from crud import create_budget as crud_create_budget
from crud import get_all_budgets as crud_get_budgets
from dependencies import get_db
from fastapi import APIRouter, Depends, HTTPException
from schemas import BudgetCreate, BudgetResponse
from sqlalchemy.orm import Session

router = APIRouter()


@router.post("/", response_model=BudgetResponse)
def create_budget(
    budget: BudgetCreate, db: Session = Depends(get_db)
) -> BudgetResponse:
    """
    Creates a new budget record in the database

    Args:
        budget: The budget data to create, based on the BudgetCreate schema in the db module
        db: Database session dependency

    Returns:
        Created budget record based on BudgetResponse schema
    """
    return crud_create_budget(budget=budget, db=db)


@router.get("/", response_model=List[BudgetResponse])
def get_all_budgets(db: Session = Depends(get_db)) -> List[BudgetResponse]:
    """
    Returns all budget records in the database

    Args:
        db: Session dependency

    Returns:
        List of all budget records, each conforming to
        BudgetResponse schema
    """
    all_budgets = crud_get_budgets(db=db)
    return all_budgets
