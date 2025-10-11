from db import Base
from sqlalchemy import Column, DateTime, Float, Integer, String, Text


class ReceiptDB(Base):
    __tablename__ = "receipts"

    receipt_id = Column(Integer, primary_key=True, index=True)
    store = Column(String)
    date = Column(DateTime)
    total = Column(Float)
    items = Column(Integer)
    status = Column(String, default="processing")
    imageUrl = Column(String)


class BudgetDB(Base):
    __tablename__ = "budgets"

    budget_id = Column(Integer, primary_key=True, index=True)
    category = Column(String)
    amount = Column(Float)
    spent = Column(Float)
    period = Column(String)
