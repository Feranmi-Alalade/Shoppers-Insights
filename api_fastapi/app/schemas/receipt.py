import json
from datetime import datetime
from pydantic import BaseModel, validator, Field
from typing import List, Optional, Any

from pydantic import BaseModel

class ReceiptImage(BaseModel):
    image_base64: str

class Item(BaseModel):
    name: str
    price: float
    quantity: int
    category: str

class Category(BaseModel):
    name: str
    amount: float
    percentage: int

class ReceiptCreate(BaseModel):
    store: str
    total: float
    date: datetime
    items: int
    itemsList: List[Item]
    categories: List[Category]


class ReceiptResponse(BaseModel):
    id: int
    store: str
    total: float
    date: datetime
    items: int
    status: str
    itemsList: List[Item]
    categories: List[Category]

    class Config:
        # FIX 2: Use 'orm_mode' instead of 'from_attributes'
        orm_mode = True 
        allow_population_by_field_name = True

    # FIX 3: Use '@validator' with 'pre=True'
    @validator('itemsList', 'categories', pre=True)
    @classmethod
    def parse_json_string(cls, v: Any) -> Any:
        """
        Takes the string from the database and loads it as a list.
        """
        if isinstance(v, str):
            try:
                # Convert the JSON string into a Python list
                return json.loads(v)
            except json.JSONDecodeError:
                raise ValueError("Invalid JSON string in database")
        return v
