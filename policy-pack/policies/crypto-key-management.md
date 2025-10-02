# Cryptographic Key Management
- All secrets in a vault (AWS Secrets Manager). Keys rotated 90 days.
- Field-level encryption via AWS KMS; no plaintext SSN/DOB in DB.
- Separate KMS keys for prod vs non-prod. Access via IAM roles only.
