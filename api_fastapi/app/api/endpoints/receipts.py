from typing import List

from crud import create_receipt as crud_create_receipt
from crud import get_all_receipts as get_receipts
from crud import get_receipt as crud_get_receipt
from dependencies import get_db
from fastapi import APIRouter, Depends, HTTPException
from schemas import ReceiptCreate, ReceiptResponse
from sqlalchemy.orm import Session

router = APIRouter()


@router.post("/", response_model=ReceiptResponse)
def create_receipt(
    receipt: ReceiptCreate, db: Session = Depends(get_db)
) -> ReceiptResponse:
    """
    API logic
    Creates a new receipt record in the database

    Args:
        receipt: receipt data to be recorded based on ReceiptCreate schema
        db: db session dependency


    Returns: Newly created receipt record
    """

    return crud_create_receipt(receipt=receipt, db=db)


@router.get("/", response_model=List[ReceiptResponse])
def get_all_receipts(db: Session = Depends(get_db)) -> List[ReceiptResponse]:
    """
    Retrieves all receipt records in the database

    Args:
        db: database session dependency

    Returns:
        List of all receipt records in the database, each conforming
        to ReceiptResponse schema
    """
    all_receipts = get_receipts(db=db)

    return all_receipts


@router.get("/{receipt_id}", response_model=ReceiptResponse)
def get_receipt(receipt_id: int, db: Session = Depends(get_db)):
    """
    Retrieves a receipt record given a {receipt_id}

    Args:
        receipt_id: int unique id of the receipt record to be retrieved
        db

    Returns: The receipt record with that unique id
    """
    receipt_t = crud_get_receipt(receipt_id=receipt_id, db=db)
    if not receipt_t:
        raise HTTPException(status_code=404, detail="Receipt not found")
    return receipt_t
