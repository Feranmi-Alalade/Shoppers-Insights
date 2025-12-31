import pytesseract
from PIL import Image


def run_ocr(image_path):
    """
    Run OCR for an image and return extracted text.
    """
    img = Image.open(image_path)
    text = pytesseract.image_to_string(img)
    return text
