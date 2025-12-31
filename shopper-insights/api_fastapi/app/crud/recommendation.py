import os, json
import google.generativeai as genai
from typing import Any, Dict, List
from db import engine, ReceiptDB
from sqlalchemy.orm import Session
from fastapi import HTTPException
from dotenv import load_dotenv
from schemas import HealthInsightReport

load_dotenv()

system_instruction = """
You are an expert Nutritionist and Behavioral Economist.

Analyze the provided receipt history and output a JSON object with the following structure:

{
  "receipt_count": integer,
  "date_range": "string (e.g., 'Jan 2023 - Mar 2024')",
  "health_score": integer (0-100),
  "dietary_analysis": "string (markdown allowed)",
  "spending_patterns": "string (markdown allowed)",
  "recommendations": [
    "string (tip 1)",
    "string (tip 2)",
    "string (tip 3)"
  ]
}

SCORING RULES:
- 90-100: Mostly whole foods, organic, no processed items.
- 70-89: Good balance, some dining out.
- 50-69: High eating out or processed foods.
- 0-49: Junk food, alcohol, sugary drinks dominant.

IMPORTANT: Return ONLY valid JSON. Do not include markdown formatting (like ```json) in the response.
"""

def get_recommendations(db: Session):
    """
    Retrieves a receipt from the DB using the receipt ID

    Returns a recommendation based on that receipt
    """
    api_key=os.getenv("GOOGLE_API_KEY")

    if not api_key:
        raise HTTPException(status_code=500, detail="Google API key not working")
    genai.configure(api_key=api_key)

    all_receipts = db.query(ReceiptDB).all()

    receipt_data_str = "USER RECEIPT HISTORY:\n"
    
    for receipt in all_receipts:
        receipt_data_str += (
            f"- Date: {receipt.date}, Store: {receipt.store}, "
            f"Total: ${receipt.total}, Items/Categories: {receipt.categories}\n"
        )

    model = genai.GenerativeModel(
        model_name="gemini-2.5-flash",
        system_instruction=system_instruction
    )

    try:
        response = model.generate_content(receipt_data_str)
        raw_dict = json.loads(response.text)

        report = HealthInsightReport(**raw_dict)
        return report
    
    except json.JSONDecodeError:
        print("AI did not return valid JSON")
        raise HTTPException(status_code=500, detail="AI Response malfunction")
    
    except TypeError as e:
        raise HTTPException(status_code=500, detail="AI Response Structure Error")
    
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate recommendations")
    