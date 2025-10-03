import sys
sys.path.append('.')

from models.base import engine
from models.users import User
from passlib.context import CryptContext
from sqlalchemy.orm import sessionmaker

# Create session
Session = sessionmaker(bind=engine)
session = Session()

try:
    # Find admin user
    admin = session.query(User).filter(User.email == "admin@credithardar.com").first()
    
    if admin:
        # Hash the password
        pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")
        admin.pw_hash = pwd_context.hash("admin123")
        session.commit()
        print("✅ Admin password set to: admin123")
    else:
        print("❌ Admin user not found")
        
except Exception as e:
    print(f"❌ Error: {e}")
finally:
    session.close()




