from dataclasses import dataclass, field
from typing import List

@dataclass
class HealthInsightReport:
    receipt_count: int
    date_range: str
    health_score: int
    dietary_analysis: str
    spending_patterns: str
    recommendations: List[str] = field(default_factory=list)

@dataclass
class ReceiptItem:
    name: str
    price: float
    quantity: int
    category: str

@dataclass
class CategorySummary:
    name: str
    amount: float
    percentage: int

@dataclass
class ReceiptExtraction:
    id: str
    store: str
    total: float
    date: str 
    items: int
    status: str
    # Nested lists of objects
    categories: List[CategorySummary] = field(default_factory=list)
    itemsList: List[ReceiptItem] = field(default_factory=list)

    @classmethod
    def from_dict(cls, data: dict):
        """
        Validates and converts raw JSON dictionary into a ReceiptExtraction object.
        """
        try:
            # Recursively convert nested lists into Dataclasses
            items_objs = [ReceiptItem(**item) for item in data.get("itemsList", [])]
            cats_objs = [CategorySummary(**cat) for cat in data.get("categories", [])]

            return cls(
                id=data.get("id", "receipt-placeholder"),
                store=data.get("store", "Unknown Store"),
                total=float(data.get("total", 0.0)),
                date=data.get("date", ""),
                items=int(data.get("items", 0)),
                status=data.get("status", "success"),
                categories=cats_objs,
                itemsList=items_objs
            )
        except (TypeError, ValueError) as e:
            raise ValueError(f"Data validation failed: {e}")