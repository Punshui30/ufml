# Data Classification & Handling
- Classes: Public, Internal, Sensitive (PII), Restricted (SSN, DOB, credit report).
- Storage:
  - Restricted → encrypted at rest (DB + KMS), access logged.
  - S3 objects → SSE-KMS; presigned URLs only.
- Transmission: TLS 1.2+ only. No PII in logs.
- Retention: Dispute artifacts kept 3 years; purge schedule monthly.
