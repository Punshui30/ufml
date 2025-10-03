#!/usr/bin/env python3

import sys
import os

# Add the apps directory to the Python path so we can import packages cleanly
API_ROOT = os.path.join(os.path.dirname(__file__), 'apps')
if API_ROOT not in sys.path:
    sys.path.insert(0, API_ROOT)

try:
    print("Testing backend imports...")
    
    # Test basic imports
    from apps.api import main
    print("OK: apps.api.main imports successfully")

    from apps.api.main import app
    print("OK: FastAPI app imports successfully")
    
    # Test if we can create the app
    print("OK: Backend should be working!")
    
except Exception as e:
    print(f"ERROR: {e}")
    import traceback
    traceback.print_exc()