import os, boto3
from botocore.client import Config

region = os.getenv("S3_REGION", "us-east-1")
bucket = os.getenv("S3_BUCKET", "your-bucket")

s3 = boto3.client("s3", region_name=region, config=Config(signature_version="s3v4"))

def presign_put(key: str, content_type: str, expires=3600):
    return s3.generate_presigned_url(
        ClientMethod="put_object",
        Params={"Bucket": bucket, "Key": key, "ContentType": content_type},
        ExpiresIn=expires
    )

def presign_get(key: str, expires=3600):
    return s3.generate_presigned_url(
        ClientMethod="get_object",
        Params={"Bucket": bucket, "Key": key},
        ExpiresIn=expires
    )
