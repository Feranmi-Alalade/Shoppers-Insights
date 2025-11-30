from db import Base
from sqlalchemy import Column, DateTime, Float, Integer, String, Text


class ReceiptDB(Base):
    __tablename__ = "receipts"

    id = Column(Integer, primary_key=True, index=True)
    store = Column(String)
    total = Column(Float)
    date = Column(DateTime, nullable=True)
    items = Column(Integer)
    status = Column(String)
    itemsList = Column(String)
    categories = Column(String)

class BudgetDB(Base):
    __tablename__ = "budgets"

    budget_id = Column(Integer, primary_key=True, index=True)
    category = Column(String)
    amount = Column(Float)
    spent = Column(Float)
    period = Column(String)
