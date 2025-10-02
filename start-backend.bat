@echo off
setlocal

echo Starting UFML Backend...

REM Set environment variables
set DATABASE_URL=sqlite:///./dev.db
set JWT_SECRET=ufml_jwt_secret_32_chars_minimum_required
set FERNET_KEY=ZmDfcTF7_60GrrY167zsiPd67pEvs0aGOv2oasOM1Pg=
set OLLAMA_HOST=http://127.0.0.1:11434
set OLLAMA_MODEL=llama3.1:8b-instruct
set OLLAMA_TIMEOUT_SECONDS=20

REM Add Tesseract to PATH if available
if exist "C:\Program Files\Tesseract-OCR\tesseract.exe" (
    set PATH=%PATH%;C:\Program Files\Tesseract-OCR
    echo Tesseract OCR found and added to PATH
) else (
    echo WARNING: Tesseract OCR not found. Install from: https://github.com/tesseract-ocr/tesseract
)

REM Kill anything on port 8000
echo Checking for existing processes on port 8000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8000') do (
    echo Killing process %%a
    taskkill /PID %%a /F >nul 2>nul
)

REM Create virtual environment
if not exist ".venv" (
    echo Creating Python virtual environment...
    py -3.11 -m venv .venv
)

REM Activate virtual environment
echo Activating virtual environment...
call .venv\Scripts\activate

REM Install/upgrade requirements
echo Installing Python dependencies...
cd apps\api
python -m pip install --upgrade pip
python -m pip install -r requirements.txt

REM Start the backend
echo Starting backend server...
echo Backend will be available at: http://127.0.0.1:8000
echo API docs will be available at: http://127.0.0.1:8000/docs
echo.
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload

pause