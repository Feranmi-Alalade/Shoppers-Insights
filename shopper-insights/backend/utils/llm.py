import requests


def call_mistral_ocr(image_path, api_url, api_key):
    """
    Call Mistral OCR API for the given image.
    """
    with open(image_path, "rb") as f:
        files = {"file": f}
        headers = {"Authorization": f"Bearer {api_key}"}
        response = requests.post(api_url, files=files, headers=headers)
    response.raise_for_status()
    return response.json()
