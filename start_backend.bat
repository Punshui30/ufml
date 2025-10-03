@echo off
cd /d "C:\Users\simmo\Downloads\credit-platform-secure-scaffold-with-policies\apps\api"
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload

