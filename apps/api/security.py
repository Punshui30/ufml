import os, time, secrets
from datetime import datetime, timedelta
from jose import jwt
from passlib.hash import argon2
from cryptography.fernet import Fernet, InvalidToken

JWT_SECRET = os.getenv("JWT_SECRET", "change_me_now")
JWT_ALG = "HS256"
ACCESS_TTL = int(os.getenv("ACCESS_TTL_SECONDS", "900"))      # 15m
REFRESH_TTL = int(os.getenv("REFRESH_TTL_SECONDS", "1209600")) # 14d

# Passwords
def hash_password(pw: str) -> str:
    return argon2.hash(pw)

def verify_password(pw: str, hashed: str) -> bool:
    return argon2.verify(pw, hashed)

# Tokens
def create_access_token(sub: str, role: str) -> str:
    now = int(time.time())
    payload = {"sub": sub, "role": role, "iat": now, "exp": now + ACCESS_TTL, "jti": secrets.token_urlsafe(8)}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALG)

def create_refresh_token(sub: str) -> str:
    now = int(time.time())
    payload = {"sub": sub, "iat": now, "exp": now + REFRESH_TTL, "jti": secrets.token_urlsafe(8), "typ": "refresh"}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALG)

def decode_token(token: str) -> dict:
    return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALG])

# Field encryption (demo; use KMS in prod)
_fernet_key = os.getenv("FERNET_KEY")
if not _fernet_key:
    # WARNING: For demo only. In production, set FERNET_KEY and rotate via KMS/HSM.
    _fernet_key = Fernet.generate_key().decode()
fernet = Fernet(_fernet_key.encode())

def enc(value: str) -> str:
    return fernet.encrypt(value.encode()).decode()

def dec(token: str) -> str:
    try:
        return fernet.decrypt(token.encode()).decode()
    except InvalidToken:
        return ""
