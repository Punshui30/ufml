#!/usr/bin/env python3
"""
Database initialization script for Credit Hardar API
Run this script to create all database tables
"""

import os
import sys
from pathlib import Path

# Add the current directory to Python path
sys.path.insert(0, str(Path(__file__).parent))

from models.base import init_db, engine
from models.users import User
from models.other import Account
from models.disputes import Dispute
from models.reports import CreditReport

def main():
    """Initialize the database with all tables"""
    print("Initializing Credit Hardar database...")
    
    try:
        # Test database connection
        with engine.connect() as conn:
            print("✅ Database connection successful")
        
        # Create all tables
        init_db()
        print("✅ Database tables created successfully")
        
        # Create a default account for testing
        from sqlalchemy.orm import Session
        db = Session(engine)
        
        try:
            # Check if default account exists
            default_account = db.query(Account).filter(Account.name == "Default Agency").first()
            if not default_account:
                default_account = Account(
                    name="Default Agency",
                    plan="agency"
                )
                db.add(default_account)
                db.commit()
                print("✅ Default account created")
            else:
                print("✅ Default account already exists")
                
            # Create a default admin user
            admin_user = db.query(User).filter(User.email == "admin@credithardar.com").first()
            if not admin_user:
                from passlib.context import CryptContext
                pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")
                
                # Create admin user with default password
                admin_user = User(
                    email="admin@credithardar.com",
                    role="owner",
                    pw_hash=pwd_context.hash("admin123"),  # Default password
                    account_id=default_account.id
                )
                db.add(admin_user)
                db.commit()
                print("✅ Default admin user created")
            else:
                print("✅ Default admin user already exists")
                
        except Exception as e:
            db.rollback()
            print(f"⚠️  Warning: Could not create default data: {e}")
        finally:
            db.close()
            
        print("\n🎉 Database initialization complete!")
        print("\nDefault credentials:")
        print("Email: admin@credithardar.com")
        print("Password: admin123")
        print("Note: Change this password after first login!")
        
    except Exception as e:
        print(f"❌ Database initialization failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
