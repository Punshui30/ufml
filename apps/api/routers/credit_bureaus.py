from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from models.base import get_db
from pydantic import BaseModel
from typing import Optional, Dict, Any
import os
import requests
import json
from datetime import datetime, date
from services.credit_data_provider import CreditDataProvider

router = APIRouter()

# API Configuration
EXPERIAN_API_URL = os.getenv("EXPERIAN_API_URL", "https://api.experian.com")
EQUIFAX_API_URL = os.getenv("EQUIFAX_API_URL", "https://api.equifax.com")
TRANSUNION_API_URL = os.getenv("TRANSUNION_API_URL", "https://api.transunion.com")
ANNUAL_CREDIT_REPORT_API = os.getenv("ANNUAL_CREDIT_REPORT_API", "https://api.annualcreditreport.com")

class FreeCreditReportRequest(BaseModel):
    user_id: str
    first_name: str
    last_name: str
    ssn: str
    date_of_birth: str
    address: str
    city: str
    state: str
    zip_code: str
    email: str
    phone: str
    preferred_bureaus: list[str] = ["experian", "equifax", "transunion"]

class BureauConnectionRequest(BaseModel):
    user_id: str
    bureau: str
    username: Optional[str] = None
    password: Optional[str] = None
    security_questions: Optional[Dict[str, str]] = None

@router.post("/free-pull")
async def pull_free_credit_report(
    request: FreeCreditReportRequest,
    db: Session = Depends(get_db)
):
    """
    Pull real credit reports using CreditDataProvider
    Integrates with multiple credit data sources for AI processing
    """
    try:
        # Initialize credit data provider
        credit_provider = CreditDataProvider()
        
        # Convert request to user data format
        user_data = {
            "first_name": request.first_name,
            "last_name": request.last_name,
            "ssn": request.ssn,
            "date_of_birth": request.date_of_birth,
            "address": request.address,
            "city": request.city,
            "state": request.state,
            "zip_code": request.zip_code,
            "email": request.email,
            "phone": request.phone
        }
        
        # Get credit reports from available sources
        credit_results = await credit_provider.get_credit_reports(user_data)
        
        if not credit_results["success"]:
            # If all APIs fail, provide manual instructions
            return {
                "success": False,
                "user_id": request.user_id,
                "error": "Unable to access credit reports via API",
                "fallback_available": True,
                "instructions": _get_manual_instructions(),
                "next_available_date": _get_next_free_date()
            }
        
        # Get AI dispute recommendations
        dispute_recommendations = []
        if credit_results["ai_ready_data"]:
            dispute_recommendations = await credit_provider.get_dispute_recommendations(
                credit_results["ai_ready_data"]
            )
        
        return {
            "success": True,
            "user_id": request.user_id,
            "reports_pulled": credit_results["reports"],
            "sources_attempted": credit_results["sources_attempted"],
            "ai_analysis": credit_results["ai_ready_data"],
            "dispute_recommendations": dispute_recommendations,
            "next_available_date": _get_next_free_date(),
            "instructions": _get_manual_instructions(),
            "errors": credit_results["errors"]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to pull credit reports: {str(e)}")

@router.post("/bureau-connect")
async def connect_bureau_account(
    request: BureauConnectionRequest,
    db: Session = Depends(get_db)
):
    """
    Connect to a credit bureau account for ongoing monitoring
    This allows for more frequent credit report pulls
    """
    try:
        if request.bureau not in ["experian", "equifax", "transunion"]:
            raise HTTPException(status_code=400, detail="Invalid bureau")
        
        # Test the connection
        connection_test = await _test_bureau_connection(request.bureau, request.username, request.password)
        
        if connection_test["success"]:
            # Store the connection (in production, encrypt these credentials)
            connection_data = {
                "user_id": request.user_id,
                "bureau": request.bureau,
                "connected_at": datetime.now().isoformat(),
                "status": "active",
                "last_pull": None
            }
            
            return {
                "success": True,
                "bureau": request.bureau,
                "connection_status": "active",
                "next_pull_available": True,
                "connection_data": connection_data
            }
        else:
            raise HTTPException(status_code=401, detail="Invalid credentials or connection failed")
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to connect to bureau: {str(e)}")

@router.post("/auto-refresh")
async def auto_refresh_reports(
    user_id: str = Query(...),
    db: Session = Depends(get_db)
):
    """
    Automatically refresh credit reports for connected bureau accounts
    This runs daily/weekly to keep reports up to date
    """
    try:
        # Get user's connected bureaus
        connected_bureaus = await _get_connected_bureaus(user_id, db)
        
        refresh_results = {}
        
        for bureau in connected_bureaus:
            try:
                # Pull fresh report
                new_report = await _pull_bureau_report_auto(user_id, bureau)
                
                refresh_results[bureau] = {
                    "success": True,
                    "new_score": new_report.get("credit_score"),
                    "changes_detected": new_report.get("changes_detected", False),
                    "pulled_at": datetime.now().isoformat()
                }
                
            except Exception as e:
                refresh_results[bureau] = {
                    "success": False,
                    "error": str(e)
                }
        
        return {
            "success": True,
            "user_id": user_id,
            "refresh_results": refresh_results,
            "next_refresh": _get_next_refresh_time()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to auto-refresh reports: {str(e)}")

@router.get("/bureau-status")
async def get_bureau_status(
    user_id: str = Query(...),
    db: Session = Depends(get_db)
):
    """Get the status of all bureau connections and available pulls"""
    try:
        status = {
            "annual_credit_report": {
                "available": True,
                "last_pull": None,
                "next_available": _get_next_free_date(),
                "cost": "Free"
            },
            "experian": {
                "connected": False,
                "api_available": bool(os.getenv("EXPERIAN_API_KEY")),
                "last_pull": None,
                "cost": "Paid API"
            },
            "equifax": {
                "connected": False,
                "api_available": bool(os.getenv("EQUIFAX_API_KEY")),
                "last_pull": None,
                "cost": "Paid API"
            },
            "transunion": {
                "connected": False,
                "api_available": bool(os.getenv("TRANSUNION_API_KEY")),
                "last_pull": None,
                "cost": "Paid API"
            }
        }
        
        return {
            "user_id": user_id,
            "bureau_status": status,
            "recommendations": _get_pull_recommendations(status)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get bureau status: {str(e)}")

# Helper Functions

async def _pull_annual_credit_report(request: FreeCreditReportRequest, bureau: str) -> Dict[str, Any]:
    """Simulate Annual Credit Report API call with realistic mock data"""
    try:
        # Simulate API call delay
        import asyncio
        await asyncio.sleep(2)  # Simulate network delay
        
        # Generate realistic mock credit report data
        mock_report_data = {
            "personal_info": {
                "name": f"{request.first_name} {request.last_name}",
                "ssn": f"***-**-{request.ssn[-4:]}" if request.ssn else "***-**-****",
                "date_of_birth": request.date_of_birth,
                "address": f"{request.address}, {request.city}, {request.state} {request.zip_code}",
                "phone": request.phone,
                "email": request.email
            },
            "credit_score": {
                "experian": 720,
                "equifax": 715,
                "transunion": 725,
                "vantage_score": 740
            },
            "accounts": [
                {
                    "creditor": "Chase Credit Card",
                    "account_number": "****1234",
                    "account_type": "Credit Card",
                    "balance": 2500,
                    "credit_limit": 10000,
                    "status": "Open",
                    "payment_status": "Current",
                    "opened_date": "2020-03-15",
                    "last_payment": "2024-01-15"
                },
                {
                    "creditor": "Capital One Auto Loan",
                    "account_number": "****5678",
                    "account_type": "Auto Loan",
                    "balance": 18500,
                    "credit_limit": 25000,
                    "status": "Open",
                    "payment_status": "Current",
                    "opened_date": "2019-08-20",
                    "last_payment": "2024-01-20"
                },
                {
                    "creditor": "Wells Fargo Mortgage",
                    "account_number": "****9012",
                    "account_type": "Mortgage",
                    "balance": 285000,
                    "credit_limit": 350000,
                    "status": "Open",
                    "payment_status": "Current",
                    "opened_date": "2018-06-10",
                    "last_payment": "2024-01-01"
                }
            ],
            "inquiries": [
                {
                    "creditor": "American Express",
                    "date": "2023-11-15",
                    "type": "Hard Inquiry"
                }
            ],
            "public_records": [],
            "dispute_opportunities": [
                {
                    "account": "Chase Credit Card",
                    "issue": "Late payment reported but account was in forbearance",
                    "potential_score_impact": "+15 points"
                }
            ]
        }
        
        return {
            "success": True,
            "source": "annual_credit_report_simulation",
            "bureau": bureau,
            "report_data": mock_report_data,
            "cost": "Free",
            "pull_date": datetime.now().isoformat(),
            "next_available": _get_next_free_date(),
            "report_id": f"ACR_{bureau}_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        }
            
    except Exception as e:
        # Fallback to manual instructions
        return {
            "success": False,
            "error": str(e),
            "fallback_instructions": _get_manual_instructions()
        }

async def _pull_bureau_report(request: FreeCreditReportRequest, bureau: str) -> Dict[str, Any]:
    """Pull from individual bureau APIs (requires API keys)"""
    try:
        api_key = os.getenv(f"{bureau.upper()}_API_KEY")
        if not api_key:
            raise Exception(f"No API key configured for {bureau}")
        
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "first_name": request.first_name,
            "last_name": request.last_name,
            "ssn": request.ssn,
            "date_of_birth": request.date_of_birth,
            "address": request.address,
            "city": request.city,
            "state": request.state,
            "zip_code": request.zip_code
        }
        
        api_url = {
            "experian": EXPERIAN_API_URL,
            "equifax": EQUIFAX_API_URL,
            "transunion": TRANSUNION_API_URL
        }[bureau]
        
        response = requests.post(
            f"{api_url}/v1/credit-reports",
            headers=headers,
            json=payload,
            timeout=30
        )
        
        if response.status_code == 200:
            return {
                "success": True,
                "source": f"{bureau}_api",
                "bureau": bureau,
                "report_data": response.json(),
                "cost": "Paid API"
            }
        else:
            raise Exception(f"{bureau.title()} API error: {response.status_code}")
            
    except Exception as e:
        raise Exception(f"Failed to pull {bureau} report: {str(e)}")

async def _test_bureau_connection(bureau: str, username: str, password: str) -> Dict[str, Any]:
    """Test connection to bureau account"""
    try:
        # This would test the actual bureau connection
        # For now, return a mock response
        return {
            "success": True,
            "bureau": bureau,
            "connection_valid": True
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

async def _get_connected_bureaus(user_id: str, db: Session) -> list:
    """Get list of connected bureaus for a user"""
    # This would query the database for connected bureaus
    # For now, return empty list
    return []

async def _pull_bureau_report_auto(user_id: str, bureau: str) -> Dict[str, Any]:
    """Automatically pull report for connected bureau"""
    # This would pull fresh reports using stored credentials
    # For now, return mock data
    return {
        "credit_score": 720,
        "changes_detected": False,
        "pulled_at": datetime.now().isoformat()
    }

def _get_next_free_date() -> str:
    """Calculate next available free report date"""
    # Annual Credit Report allows free weekly reports
    from datetime import timedelta
    next_date = datetime.now() + timedelta(days=7)
    return next_date.strftime("%Y-%m-%d")

def _get_next_refresh_time() -> str:
    """Calculate next automatic refresh time"""
    from datetime import timedelta
    next_refresh = datetime.now().replace(hour=9, minute=0, second=0, microsecond=0)
    if next_refresh <= datetime.now():
        next_refresh = next_refresh + timedelta(days=1)
    return next_refresh.isoformat()

def _get_manual_instructions() -> Dict[str, Any]:
    """Get manual instructions for pulling free reports"""
    return {
        "annual_credit_report": {
            "url": "https://www.annualcreditreport.com",
            "instructions": [
                "Visit annualcreditreport.com",
                "Click 'Request your free credit reports'",
                "Fill out the identity verification form",
                "Select all three bureaus (Experian, Equifax, TransUnion)",
                "Download your reports as PDF files",
                "Upload the PDFs to Credit Hardar for analysis"
            ],
            "frequency": "Weekly (free)",
            "cost": "Free"
        },
        "bureau_websites": {
            "experian": "https://www.experian.com",
            "equifax": "https://www.equifax.com",
            "transunion": "https://www.transunion.com"
        }
    }

def _get_pull_recommendations(status: Dict[str, Any]) -> list:
    """Get recommendations for credit report pulling strategy"""
    recommendations = []
    
    if status["annual_credit_report"]["available"]:
        recommendations.append({
            "priority": "high",
            "method": "annual_credit_report",
            "reason": "Free weekly reports available",
            "action": "Pull free reports now"
        })
    
    for bureau in ["experian", "equifax", "transunion"]:
        if status[bureau]["api_available"]:
            recommendations.append({
                "priority": "medium",
                "method": f"{bureau}_api",
                "reason": f"API integration available for {bureau}",
                "action": f"Consider setting up {bureau} API for automated pulls"
            })
    
    return recommendations
