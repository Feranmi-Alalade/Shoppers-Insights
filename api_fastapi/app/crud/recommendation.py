# import os
# import google.generativeai as genai
# from typing import Any, Dict, List
# from db import engine, ReceiptDB
# from sqlalchemy.orm import Session
# from fastapi import HTTPException
# from dotenv import load_dotenv

# load_dotenv()

# system_instruction = """
#     You are an expert Nutritionist and Behavioral Economist. 
    
#     FIRST: Acknowledge how many receipts you are analyzing (e.g., "I analyzed your 5 receipts...").
    
#     Then, analyze the user's purchase history based on:
#     1. Spending Pattern: Do they cook at home vs eat out? Impulse buys?
#     2. Nutritional Quality: Ratio of whole foods to processed foods/alcohol/sugar.
#     3. Health Score: Assign a score (0-100). 
#        - Deduct points for: Fast food, Alcohol, Sugary drinks, Processed snacks.
#        - Add points for: Fresh produce, Lean proteins, Pharmacy/Health items.

#     Output structured Markdown:
#     ## Health Score: [Score]/100
#     ### Data Summary
#     I analyzed [Number] receipts from [Date Range].
    
#     ### Dietary Analysis
#     [Analysis of groceries vs dining out]
    
#     ### Spending Patterns
#     [Observations on how spending affects health]
    
#     ### Recommendations
#     1. [Actionable tip 1]
#     2. [Actionable tip 2]
#     3. [Actionable tip 3]
#     """

# def get_recommendations(db: Session):
#     """
#     Retrieves a receipt from the DB using the receipt ID

#     Returns a recommendation based on that receipt
#     """
#     api_key=os.getenv("GOOGLE_API_KEY")

#     if not api_key:
#         raise HTTPException(status_code=500, detail="Google API key not working")
#     genai.configure(api_key=api_key)

#     all_receipts = db.query(ReceiptDB).all()

#     receipt_data_str = "USER RECEIPT HISTORY:\n"

#     for receipt in all_receipts:
#         receipt_data_str += (
#             f"- Date: {receipt.date}, Store: {receipt.store}, "
#             f"Total: ${receipt.total}, Items/Categories: {receipt.categories}\n"
#         )

#     model = genai.GenerativeModel(
#         model_name="gemini-2.5-flash",
#         system_instruction=system_instruction
#     )

#     try:
#         response = model.generate_content(receipt_data_str)
#         return response.text
#     except Exception as e:
#         print(f"Error: {e}")
#         raise HTTPException(status_code=500, detail="Failed to generate recommendations")


import os, json
import google.generativeai as genai
from typing import Any, Dict, List
from db import engine, ReceiptDB
from sqlalchemy.orm import Session
from fastapi import HTTPException
from dotenv import load_dotenv

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
        structured_data = json.loads(response.text)
        return structured_data
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate recommendations")