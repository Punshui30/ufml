#!/usr/bin/env python3
"""
Script to set the admin user password
"""

import os
import sys
from pathlib import Path

# Add the current directory to Python path
sys.path.insert(0, str(Path(__file__).parent))

from models.base import engine
from models.users import User
from passlib.context import CryptContext
from sqlalchemy.orm import Session

def main():
    """Set the admin user password"""
    print("Setting admin user password...")
    
    try:
        db = Session(engine)
        
        # Find the admin user
        admin_user = db.query(User).filter(User.email == "admin@credithardar.com").first()
        
        if admin_user:
            # Set the password
            pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")
            admin_user.pw_hash = pwd_context.hash("admin123")
            db.commit()
            print("✅ Admin user password set successfully!")
            print("Email: admin@credithardar.com")
            print("Password: admin123")
        else:
            print("❌ Admin user not found")
            
        db.close()
        
    except Exception as e:
        print(f"❌ Failed to set admin password: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()



