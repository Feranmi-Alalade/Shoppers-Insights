import base64
import io
from typing import List
from crud import create_receipt as crud_create_receipt
from crud import get_all_receipts as get_receipts
from crud import get_receipt as crud_get_receipt
from dependencies import get_db
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from schemas import ReceiptResponse, ReceiptImage
from sqlalchemy.orm import Session
from PIL import Image, UnidentifiedImageError

router = APIRouter()

@router.post("/", response_model=ReceiptResponse)
async def create_receipt(
    file: UploadFile = File(...), db: Session = Depends(get_db)
) -> ReceiptResponse:
    """
    API logic
    Creates a new receipt record in the database by converting the 
    uploaded jpeg file to base64 format and calling the function
    that processes the image using genai llm

    Args:
        receipt: Uploaded jpeg image


    Returns: Newly created receipt record
    """

    try:
        if file.content_type != "image/jpeg":
            raise HTTPException(status_code=400, detail="Invalid file type, only jpeg accepted")
        
        image_bytes = await file.read()

        
        with Image.open(io.BytesIO(image_bytes)) as receipt_img:
            if receipt_img.format != 'JPEG':
                raise HTTPException(status_code=400, detail=f"Image must be in jpeg but is in {receipt_img.format}")
        
       
        image_base64 = base64.b64encode(image_bytes).decode("utf-8")
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Image could not be converted to base64, {e}")
    
    receipt_converted = ReceiptImage(
        image_base64=image_base64
    )

    return crud_create_receipt(receipt_base64=receipt_converted, db=db)




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
