from typing import Any, Dict, List

from db import BudgetDB
from dependencies import get_db, load_input_mock, load_output_mock
from fastapi import Depends, HTTPException
from schemas import BudgetCreate
from sqlalchemy.orm import Session


def create_budget(budget: BudgetCreate, db: Session = Depends(get_db)) -> BudgetDB:
    """
    Creates a new budget record in the database

    Args:
        budget: The budget data to create based on the BudgetCreate schema

    Returns:
        The newly created BudgetDB instance
    """
    db_budget = BudgetDB(**budget.dict())
    db.add(db_budget)
    db.commit()
    db.refresh(db_budget)
    return db_budget


def get_all_budgets(db: Session = Depends(get_db)) -> List[Dict[str, Any]]:
    """
    Returns all budget records in the database

    Args:
        db: Session dependency

    Returns:
        List of all budget records, each conforming to
        BudgetResponse schema
    """
    data = load_output_mock()
    all_budgets = data["getAllBudgets"]
    return all_budgets
