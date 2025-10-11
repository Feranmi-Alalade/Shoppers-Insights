from datetime import datetime

from pydantic import BaseModel


class BudgetCreate(BaseModel):
    category: str
    amount: float
    spent: float
    period: str


class BudgetResponse(BudgetCreate):
    id: int
