import boto3
from pipelines.image_processing import compress_image
from pipelines.ocr import run_ocr
from utils.utils import extract_s3_paths, process_event


def lambda_handler(event, context):
    # 1. Receive upload events from S3
    s3_paths = extract_s3_paths(event)
    results = []
    s3 = boto3.client("s3")
    for s3_path in s3_paths:
        bucket, key = s3_path["bucket"], s3_path["key"]
        # 2. Download S3 images
        tmp_img = f"/tmp/{key.split('/')[-1]}"
        s3.download_file(bucket, key, tmp_img)
        # 3. Perform image processing pipeline
        processed_img = compress_image(tmp_img)
        # 4. Perform OCR pipeline
        ocr_result = run_ocr(processed_img)
        results.append({"s3_path": s3_path, "ocr_result": ocr_result})
        # 5. Upload results to S3 (example: upload OCR result as JSON)
        result_key = key.replace(".jpg", "_ocr.json").replace(".png", "_ocr.json")
        s3.put_object(Bucket=bucket, Key=result_key, Body=str(ocr_result))
    return {"results": results}
