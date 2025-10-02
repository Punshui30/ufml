import os, time, ipaddress
from typing import Optional
from fastapi import HTTPException, Request

# For local development without Redis, use in-memory storage
_login_attempts = {}
_login_locks = {}
_blacklist = {}

MAX_ATTEMPTS = int(os.getenv("LOGIN_MAX_ATTEMPTS", "5"))
LOCKOUT_MINUTES = int(os.getenv("LOGIN_LOCKOUT_MINUTES", "15"))

def _login_key(email: str) -> str:
    return f"login:attempts:{email.lower()}"

def _lock_key(email: str) -> str:
    return f"login:lock:{email.lower()}"

def record_failed_login(email: str):
    if _login_locks.get(email):
        return
    _login_attempts[email] = _login_attempts.get(email, 0) + 1
    if _login_attempts[email] >= MAX_ATTEMPTS:
        _login_locks[email] = time.time() + (LOCKOUT_MINUTES * 60)

def clear_login_attempts(email: str):
    _login_attempts.pop(email, None)
    _login_locks.pop(email, None)

def ensure_not_locked(email: str):
    if _login_locks.get(email) and time.time() < _login_locks[email]:
        raise HTTPException(423, "Account temporarily locked due to failed logins. Try again later.")
    # Clear expired locks
    if _login_locks.get(email) and time.time() >= _login_locks[email]:
        _login_locks.pop(email, None)

# Refresh token blacklist / rotation
def blacklist_jti(jti: str, ttl_seconds: int = 60*60*24*30):
    _blacklist[jti] = time.time() + ttl_seconds

def is_blacklisted(jti: str) -> bool:
    if jti in _blacklist:
        if time.time() < _blacklist[jti]:
            return True
        else:
            # Remove expired blacklist entry
            _blacklist.pop(jti, None)
    return False

# Admin IP allowlist
def admin_ip_allowed(client_ip: str) -> bool:
    allowlist = os.getenv("ADMIN_IP_ALLOWLIST", "").split(",")
    if not allowlist or allowlist == [""]:
        return True
    ip = ipaddress.ip_address(client_ip)
    for cidr in allowlist:
        net = ipaddress.ip_network(cidr.strip(), strict=False)
        if ip in net:
            return True
    return False
