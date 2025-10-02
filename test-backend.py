#!/usr/bin/env python3

import sys
import os

# Add the apps/api directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'apps', 'api'))

try:
    print("Testing backend imports...")
    
    # Test basic imports
    import main
    print("OK: main.py imports successfully")
    
    from main import app
    print("OK: FastAPI app imports successfully")
    
    # Test if we can create the app
    print("OK: Backend should be working!")
    
except Exception as e:
    print(f"ERROR: {e}")
    import traceback
    traceback.print_exc()