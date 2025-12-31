import os

from PIL import Image


def compress_image(image_path, min_size_kb=100):
    """
    Compress image to a minimum size in KB.
    Returns path to compressed image.
    """
    img = Image.open(image_path)
    out_path = f"/tmp/compressed_{os.path.basename(image_path)}"
    quality = 85
    img.save(out_path, optimize=True, quality=quality)
    while os.path.getsize(out_path) / 1024 > min_size_kb and quality > 10:
        quality -= 5
        img.save(out_path, optimize=True, quality=quality)
    return out_path
