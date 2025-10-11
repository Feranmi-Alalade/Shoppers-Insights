from typing import Any, Dict, List, Optional

from db import ReceiptDB
from dependencies import load_input_mock, load_output_mock
from fastapi import Depends
from schemas import ReceiptCreate
from sqlalchemy.orm import Session


def create_receipt(receipt: ReceiptCreate, db: Session) -> ReceiptDB:
    """
    Creates a new receipt record in the database

    Args:
        receipt: receipt data to be recorded based on ReceiptCreate schema
        db: db session dependency


    Returns: Newly created receipt record
    """
    db_receipt = ReceiptDB(**receipt.dict())
    db.add(db_receipt)
    db.commit()
    db.refresh(db_receipt)
    return db_receipt


def get_all_receipts(db: Session) -> List[Dict[str, Any]]:
    """
    Retrieves all receipt records in the database

    Args:
        db: database session dependency

    Returns:
        List of all receipt records in the database, each conforming
        to ReceiptResponse schema
    """
    data = load_output_mock()
    all_receipts = data["getAllReceipts"]
    return all_receipts


def get_receipt(receipt_id: int, db: Session) -> Optional[Dict[str, Any]]:
    """
    Retrieves a receipt record given a {receipt_id}

    Args:
        receipt_id: int unique id of the receipt record to be retrieved
        db

    Returns: The receipt record with that unique id
    """
    data = load_output_mock()

    receipts = data["getReceiptById"]

    receipt = next((r for r in receipts if int(r["id"]) == receipt_id), None)
    return receipt
