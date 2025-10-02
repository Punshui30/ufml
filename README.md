# UFML - Un Fuck My Life Credit Repair Platform

## 🚀 Quick Start (Windows)

### Option 1: One-Click Start (Recommended)
1. **Double-click `start-ufml.bat`**
2. Wait for both servers to start
3. Open http://localhost:3000 in your browser

### Option 2: Manual Start
1. **Backend**: Double-click `start-backend.bat`
2. **Frontend**: Double-click `start-frontend.bat`
3. Open http://localhost:3000 in your browser

## 📋 Requirements

- **Python 3.8+** (for backend)
- **Node.js 16+** (for frontend)
- **Git** (for cloning)

## 🔧 Installation

### First Time Setup
```bash
# Clone the repository
git clone <repository-url>
cd credit-platform-secure-scaffold-with-policies

# Install backend dependencies
cd apps/api
pip install -r requirements.txt

# Install frontend dependencies
cd ../web
npm install
```

## 🌐 URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://127.0.0.1:8000
- **API Documentation**: http://127.0.0.1:8000/docs

## 🛠️ Troubleshooting

### Backend Won't Start
1. Check Python is installed: `python --version`
2. Install dependencies: `pip install -r apps/api/requirements.txt`
3. Run: `start-backend.bat`

### Frontend Won't Start
1. Check Node.js is installed: `node --version`
2. Install dependencies: `npm install` (in apps/web folder)
3. Run: `start-frontend.bat`

### Port Already in Use
- Backend (port 8000): Kill Python processes or change port
- Frontend (port 3000): Kill Node processes or change port

## 📱 Features

- **Real AI Credit Analysis** - Uses Ollama for local AI processing
- **PDF Credit Report Parsing** - Extracts real data from uploaded PDFs
- **Advanced Dispute Strategies** - E Oscar bypass, factual disputes, consumer law violations
- **Specialty Bureau Targeting** - LexisNexis, LCI, Innovis, ARS, Clarity, DataX, etc.
- **Legal Compliance** - FCRA, FDCPA, TILA violation detection
- **Police Report Strategies** - Identity theft and fraud dispute techniques
- **Metro2 Compliance** - Advanced dispute validation bypass

## 🔒 Security

- All AI processing happens locally (Ollama)
- No data sent to external services
- Secure file uploads and processing
- GDPR compliant data handling

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Ensure all dependencies are installed
3. Verify both servers are running
4. Check browser console for errors

## ⚠️ Important Notes

- **Backend must be running** for real AI analysis
- **Mock data warnings** appear when backend is down
- **Never use mock data** for real credit disputes
- **Real AI analysis required** for legal compliance

## 🐳 Run with Docker

```bash
# Build and start all services
docker compose build
docker compose up

# Access the application
# Frontend: http://127.0.0.1:3000
# Backend: http://127.0.0.1:8000
```

Docker includes:
- Tesseract OCR for PDF processing
- All dependencies pre-installed
- Consistent environment across platforms

## 🖥️ Run on Windows (no Docker)

### Backend Setup
```bash
cd apps/api
pip install -r requirements.txt
set DATABASE_URL=sqlite:///./dev.db
set OLLAMA_HOST=http://127.0.0.1:11434
set OLLAMA_MODEL=llama3.1:8b-instruct
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

Test: http://127.0.0.1:8000/healthz

### Frontend Setup
```bash
cd apps/web
set NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
set NEXT_PUBLIC_USE_MOCKS=false
npm install
npm run dev
```

Open: http://127.0.0.1:3000

## 🧪 Testing

### Smoke Tests
Run the PowerShell smoke tests to verify functionality:
```powershell
.\scripts\smoke.ps1
```

Tests include:
- Health check
- AI health check  
- PDF upload (if sample.pdf exists)
- Report listing
- AI analysis
- Report deletion

### Quick Verification
```bash
# Test backend health
curl http://127.0.0.1:8000/healthz

# Test AI health
curl http://127.0.0.1:8000/ai/health
```

## 📊 Enhanced Features

- **PDF Upload & Parsing**: Upload credit reports with OCR fallback
- **AI Analysis**: Intelligent analysis using Ollama (llama3.1:8b-instruct)
- **Dispute Generation**: Automated dispute letter creation
- **Client Management**: Track clients and their reports
- **Real-time Updates**: Live status updates and notifications
- **Structured Logging**: Request tracking and performance monitoring
- **Error Handling**: Specific error messages for different failure types
- **No Mock Data**: Real API calls only (configurable via USE_MOCKS flag)