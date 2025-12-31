# Lambda entrypoint for API Gateway proxy integration
import json
import random

from utils import read_yaml_file

# Load mock data from YAML
mock_data = read_yaml_file("api/mock_data.yaml")
challenges = mock_data.get("challenges", [])
posts = mock_data.get("posts", [])
receipts = mock_data.get("receipts", [])
recommendations = mock_data.get("recommendations", [])
users = mock_data.get("users", [])


def _error_response(status_code, message):
    """Helper to format error responses."""
    return {
        "statusCode": status_code,
        "body": json.dumps({"error": message}),
        "headers": {"Content-Type": "application/json"},
    }


def lambda_handler(event, context):
    """
    Main Lambda handler for API Gateway proxy integration.
    All routes are versioned with /api/v1/ prefix.
    """
    path = event.get("path", "")
    http_method = event.get("httpMethod", "")
    response = None

    # --- Community routes ---
    if path == "/api/v1/community/challenges" and http_method == "GET":
        response = challenges

    elif path == "/api/v1/community/posts" and http_method == "GET":
        response = posts

    # --- Receipt OCR ---
    elif path == "/api/v1/receipt-ocr" and http_method == "POST":
        response = {"message": "Receipt OCR endpoint"}

    # --- Receipts ---
    elif path == "/api/v1/receipts" and http_method == "GET":
        response = receipts

    elif path.startswith("/api/v1/receipts/") and http_method == "GET":
        parts = path.split("/")
        # /api/v1/receipts/{id}
        if len(parts) == 5:
            receipt_id = parts[4]
            receipt = next((r for r in receipts if r["id"] == receipt_id), None)
            if not receipt:
                return _error_response(404, "Receipt not found")
            response = receipt
        # /api/v1/receipts/{id}/status
        elif len(parts) == 6 and parts[5] == "status":
            receipt_id = parts[4]
            receipt = next((r for r in receipts if r["id"] == receipt_id), None)
            if not receipt:
                return _error_response(404, "Receipt not found")
            # Simulate status update
            if receipt["status"] == "processing" and random.random() > 0.5:
                receipt["status"] = "success"
            response = {"id": receipt_id, "status": receipt["status"]}

    # --- Recommendations ---
    elif path == "/api/v1/recommendations" and http_method == "POST":
        insight = random.choice(recommendations)
        response = {"insight": insight}

    # --- Users ---
    elif path == "/api/v1/users" and http_method == "GET":
        response = users

    # --- Not found ---
    if response is None:
        return _error_response(404, "Not found")

    return {
        "statusCode": 200,
        "body": json.dumps(response),
        "headers": {"Content-Type": "application/json"},
    }
