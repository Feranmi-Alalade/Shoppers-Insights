from datetime import datetime

from pydantic import BaseModel


class ReceiptCreate(BaseModel):
    store: str
    date: datetime
    total: float
    items: int
    imageUrl: str


class ReceiptResponse(ReceiptCreate):
    id: int
    status: str
