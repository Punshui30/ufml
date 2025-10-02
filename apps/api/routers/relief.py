from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models.base import get_db
from models.relief import ReliefProgram, ReliefRecommendation
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid
from data.relief_programs import RELIEF_PROGRAMS, calculate_match_score

router = APIRouter()

class ClientProfile(BaseModel):
    income: Optional[int] = None
    household_size: Optional[int] = None
    state: Optional[str] = None
    employment_status: Optional[str] = None
    has_disabilities: Optional[bool] = False
    is_veteran: Optional[bool] = False
    is_senior: Optional[bool] = False
    is_pregnant: Optional[bool] = False
    has_children: Optional[bool] = False
    is_homeless: Optional[bool] = False
    marital_status: Optional[str] = None

class ReliefRecommendationResponse(BaseModel):
    id: str
    program_id: str
    program_title: str
    program_description: str
    jurisdiction: str
    match_score: float
    confidence: float
    why_recommended: str
    benefit_amount: str
    application_method: str
    source_url: str
    docs_required: List[str]
    special_notes: Optional[str] = None

@router.post("/recommend", response_model=List[ReliefRecommendationResponse])
def recommend_relief_programs(
    client_profile: ClientProfile,
    user_id: Optional[str] = None,
    client_id: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get intelligent relief program recommendations based on client profile"""
    try:
        # Convert client profile to dict for matching
        profile_dict = client_profile.dict()
        
        # Calculate match scores for all programs
        program_matches = []
        for program_data in RELIEF_PROGRAMS:
            match_score = calculate_match_score(profile_dict, program_data)
            
            if match_score > 0.1:  # Only include programs with at least 10% match
                program_matches.append({
                    'program_data': program_data,
                    'match_score': match_score
                })
        
        # Sort by match score (highest first)
        program_matches.sort(key=lambda x: x['match_score'], reverse=True)
        
        # Take top 8 recommendations
        top_programs = program_matches[:8]
        
        recommendations = []
        for match in top_programs:
            program = match['program_data']
            match_score = match['match_score']
            
            # Generate why_recommended based on profile and program
            why_reasons = generate_recommendation_reasons(profile_dict, program, match_score)
            
            # Calculate confidence based on match quality
            confidence = min(match_score + 0.2, 1.0)  # Boost confidence slightly
            
            recommendation = ReliefRecommendationResponse(
                id=str(uuid.uuid4()),
                program_id=program['slug'],
                program_title=program['title'],
                program_description=program['description'],
                jurisdiction=program['jurisdiction'],
                match_score=round(match_score, 2),
                confidence=round(confidence, 2),
                why_recommended=why_reasons,
                benefit_amount=program['benefit_amount'],
                application_method=program['application_method'],
                source_url=program['source_url'],
                docs_required=program['docs_required'],
                special_notes=get_special_notes(program, profile_dict)
            )
            
            recommendations.append(recommendation)
            
            # Store recommendation in database if user_id provided
            if user_id:
                db_recommendation = ReliefRecommendation(
                    id=str(uuid.uuid4()),
                    user_id=user_id,
                    program_id=program['slug'],
                    why=why_reasons,
                    confidence=confidence,
                    status="proposed",
                    created_at=datetime.now()
                )
                db.add(db_recommendation)
        
        if user_id:
            db.commit()
        
        return recommendations
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate recommendations: {str(e)}")

def generate_recommendation_reasons(profile: dict, program: dict, match_score: float) -> str:
    """Generate human-readable reasons for why a program is recommended"""
    reasons = []
    
    # Income-based reasons
    if profile.get("income") and program["eligibility"]["income_threshold"] > 0:
        household_size = int(profile.get("household_size", 1))
        federal_poverty_levels = {
            1: 14580, 2: 19720, 3: 24860, 4: 30000, 5: 35140, 6: 40280, 7: 45420, 8: 50560
        }
        fpl = federal_poverty_levels.get(min(household_size, 8), 50560)
        threshold = fpl * (program["eligibility"]["income_threshold"] / 100)
        
        if int(profile["income"]) <= threshold:
            income_ratio = int(profile["income"]) / threshold
            if income_ratio < 0.5:
                reasons.append("Your income is well below the eligibility threshold")
            elif income_ratio < 0.8:
                reasons.append("Your income qualifies you for this program")
            else:
                reasons.append("Your income is near the eligibility limit")
    
    # Special circumstances
    circumstances = []
    if profile.get("has_disabilities"):
        circumstances.append("disability")
    if profile.get("is_senior"):
        circumstances.append("age")
    if profile.get("is_veteran"):
        circumstances.append("military service")
    if profile.get("employment_status") == "unemployed":
        circumstances.append("unemployment")
    if profile.get("is_pregnant"):
        circumstances.append("pregnancy")
    if profile.get("has_children"):
        circumstances.append("dependent children")
    
    program_circumstances = program["eligibility"].get("special_circumstances", [])
    matching_circumstances = [c for c in circumstances if c in program_circumstances]
    
    if matching_circumstances:
        reason_text = f"This program specifically helps people with {', '.join(matching_circumstances)}"
        reasons.append(reason_text)
    
    # Employment status
    if program["eligibility"].get("employment_required", False):
        if profile.get("employment_status") in ["employed", "self_employed"]:
            reasons.append("You meet the employment requirements")
    else:
        if profile.get("employment_status") == "unemployed":
            reasons.append("No employment requirement - perfect for your current situation")
    
    # High match score
    if match_score > 0.8:
        reasons.append("Excellent match based on your profile")
    elif match_score > 0.6:
        reasons.append("Good match for your circumstances")
    elif match_score > 0.4:
        reasons.append("Potentially beneficial based on your situation")
    
    return ". ".join(reasons) + "." if reasons else "This program may be helpful based on your profile."

def get_special_notes(program: dict, profile: dict) -> Optional[str]:
    """Generate special notes for specific program and profile combinations"""
    notes = []
    
    # State-specific notes
    if profile.get("state") and program["jurisdiction"] == "State":
        notes.append(f"Contact your local {profile['state']} office for application details")
    
    # Urgency notes
    if program["slug"] in ["snap-food-assistance", "medicaid-health-insurance"]:
        notes.append("High priority - apply as soon as possible for immediate assistance")
    
    # Documentation notes
    if "medical_records" in program["docs_required"]:
        notes.append("Start gathering medical documentation now - this process can take time")
    
    # Veteran-specific notes
    if profile.get("is_veteran") and "veteran" in program["eligibility"].get("special_circumstances", []):
        notes.append("Veterans may receive priority processing and additional benefits")
    
    return "; ".join(notes) if notes else None

@router.get("/programs")
def list_all_programs():
    """Get all available relief programs"""
    return {"programs": RELIEF_PROGRAMS}

@router.get("/programs/{program_slug}")
def get_program_details(program_slug: str):
    """Get detailed information about a specific relief program"""
    program = next((p for p in RELIEF_PROGRAMS if p["slug"] == program_slug), None)
    if not program:
        raise HTTPException(status_code=404, detail="Program not found")
    
    return {"program": program}

@router.post("/forms/{program_id}")
def get_program_forms(program_id: str):
    """Get application forms for a specific relief program"""
    program = next((p for p in RELIEF_PROGRAMS if p["slug"] == program_id), None)
    if not program:
        raise HTTPException(status_code=404, detail="Program not found")
    
    # Generate form URLs based on program
    form_urls = {
        "snap-food-assistance": "https://www.fns.usda.gov/snap/apply",
        "medicaid-health-insurance": "https://www.healthcare.gov/medicaid-chip/",
        "section-8-housing": "https://www.hud.gov/program_offices/public_indian_housing/programs/hcv",
        "liheap-energy-assistance": "https://www.acf.hhs.gov/ocs/programs/liheap",
        "wic-nutrition": "https://www.fns.usda.gov/wic/apply-wic",
        "ssi-disability": "https://www.ssa.gov/benefits/ssi/apply.html",
        "unemployment-insurance": "https://www.dol.gov/general/topic/unemployment-insurance",
        "temporary-cash-assistance": "https://www.acf.hhs.gov/ofa/programs/tanf",
        "free-cell-phone-program": "https://www.fcc.gov/lifeline-consumers",
        "weatherization-assistance": "https://www.energy.gov/eere/wap/weatherization-assistance-program",
        "va-disability-compensation": "https://www.va.gov/disability/how-to-file-claim/",
        "pension-benefit-guaranty": "https://www.pbgc.gov/wr/benefits"
    }
    
    return {
        "program_id": program_id,
        "program_title": program["title"],
        "application_url": form_urls.get(program_id, program["source_url"]),
        "local_office_locator": f"https://www.benefits.gov/benefits/benefit-details/{program_id}",
        "application_method": program["application_method"],
        "required_documents": program["docs_required"],
        "estimated_processing_time": get_processing_time(program_id)
    }

def get_processing_time(program_id: str) -> str:
    """Get estimated processing time for a program"""
    processing_times = {
        "snap-food-assistance": "7-30 days",
        "medicaid-health-insurance": "45-90 days",
        "section-8-housing": "6-24 months (waiting list)",
        "liheap-energy-assistance": "30-60 days",
        "wic-nutrition": "Same day",
        "ssi-disability": "3-5 months",
        "unemployment-insurance": "2-3 weeks",
        "temporary-cash-assistance": "30-45 days",
        "free-cell-phone-program": "1-2 weeks",
        "weatherization-assistance": "3-6 months",
        "va-disability-compensation": "3-6 months",
        "pension-benefit-guaranty": "6-12 months"
    }
    
    return processing_times.get(program_id, "30-90 days")

@router.get("/client/{client_id}/recommendations")
def get_client_relief_recommendations(client_id: str, db: Session = Depends(get_db)):
    """Get relief recommendations for a specific client based on their credit report and profile"""
    try:
        from models.users import User
        from models.reports import CreditReport
        
        # Get client information
        client = db.query(User).filter(User.id == client_id, User.role == "client").first()
        if not client:
            raise HTTPException(status_code=404, detail="Client not found")
        
        # Get client's credit reports
        reports = db.query(CreditReport).filter(CreditReport.user_id == client_id).all()
        
        # Analyze credit report to determine financial profile
        financial_profile = analyze_credit_for_relief(reports)
        
        # Generate recommendations based on credit analysis
        recommendations = []
        for program_data in RELIEF_PROGRAMS:
            match_score = calculate_match_score(financial_profile, program_data)
            
            if match_score > 0.1:  # Only include programs with at least 10% match
                why_reasons = generate_recommendation_reasons(financial_profile, program_data, match_score)
                confidence = min(match_score + 0.2, 1.0)
                
                recommendation = ReliefRecommendationResponse(
                    id=str(uuid.uuid4()),
                    program_id=program_data['slug'],
                    program_title=program_data['title'],
                    program_description=program_data['description'],
                    jurisdiction=program_data['jurisdiction'],
                    match_score=round(match_score, 2),
                    confidence=round(confidence, 2),
                    why_recommended=why_reasons,
                    benefit_amount=program_data['benefit_amount'],
                    application_method=program_data['application_method'],
                    source_url=program_data['source_url'],
                    docs_required=program_data['docs_required'],
                    special_notes=get_special_notes(program_data, financial_profile)
                )
                
                recommendations.append(recommendation)
        
        # Sort by match score and take top 6
        recommendations.sort(key=lambda x: x.match_score, reverse=True)
        top_recommendations = recommendations[:6]
        
        return {
            "client_id": client_id,
            "client_email": client.email,
            "financial_profile": financial_profile,
            "recommendations": top_recommendations,
            "credit_reports_analyzed": len(reports)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get client relief recommendations: {str(e)}")

def analyze_credit_for_relief(reports: list) -> dict:
    """Analyze credit reports using AI to determine financial profile for relief programs"""
    profile = {
        "income": None,
        "household_size": 1,  # Default
        "state": None,
        "employment_status": "unknown",
        "has_disabilities": False,
        "is_veteran": False,
        "is_senior": False,
        "is_pregnant": False,
        "has_children": False,
        "credit_score": None,
        "debt_to_income_ratio": None,
        "total_debt": 0,
        "monthly_income": None,
        "financial_stress_indicators": []
    }
    
    if not reports:
        return profile
    
    # Use AI-powered analysis with Ollama
    try:
        from apps.api.services.credit_analyzer import CreditReportAnalyzer
        analyzer = CreditReportAnalyzer()
        
        # Analyze the most recent report
        latest_report = max(reports, key=lambda r: r.created_at)
        
        if hasattr(latest_report, 'text_content') and latest_report.text_content:
            # Use AI to analyze the credit report for relief program eligibility
            ai_analysis = analyzer.analyze_credit_report(
                bureau="Mixed", 
                text_content=latest_report.text_content
            )
            
            # Extract AI insights for relief program matching
            profile.update(extract_relief_profile_from_ai(ai_analysis))
            
        elif latest_report.parsed_json:
            # Fallback to existing parsed data
            parsed_data = latest_report.parsed_json
            profile.update(extract_relief_profile_from_parsed_data(parsed_data))
            
    except Exception as e:
        print(f"AI relief analysis failed: {e}")
        # Fallback to basic analysis
        if latest_report.parsed_json:
            parsed_data = latest_report.parsed_json
            profile.update(extract_relief_profile_from_parsed_data(parsed_data))
    
    return profile

def extract_relief_profile_from_ai(ai_analysis: dict) -> dict:
    """Extract relief program profile from AI analysis"""
    profile = {}
    
    if isinstance(ai_analysis, dict):
        # Extract credit score
        profile["credit_score"] = ai_analysis.get("credit_score")
        
        # Analyze accounts for financial stress indicators
        accounts = ai_analysis.get("accounts", [])
        total_debt = 0
        monthly_payments = 0
        
        for account in accounts:
            balance = account.get("balance", 0)
            if isinstance(balance, str):
                balance = float(balance.replace("$", "").replace(",", ""))
            total_debt += balance
            
            # Estimate monthly payment (rough calculation)
            if account.get("account_type") == "Credit Card":
                monthly_payments += balance * 0.02  # 2% minimum payment
            elif "Loan" in account.get("account_type", ""):
                monthly_payments += balance * 0.01  # Rough estimate
        
        profile["total_debt"] = total_debt
        profile["monthly_debt_payments"] = monthly_payments
        
        # Determine financial stress level
        stress_indicators = []
        if total_debt > 50000:
            stress_indicators.append("high_debt")
        if profile["credit_score"] and profile["credit_score"] < 600:
            stress_indicators.append("poor_credit")
        if len([a for a in accounts if a.get("status") == "Delinquent"]) > 0:
            stress_indicators.append("delinquent_accounts")
        
        profile["financial_stress_indicators"] = stress_indicators
        
        # Estimate income based on debt-to-income patterns
        if monthly_payments > 0:
            # Assume DTI should be around 36% for someone struggling
            estimated_monthly_income = monthly_payments / 0.36
            profile["monthly_income"] = estimated_monthly_income
            profile["income"] = int(estimated_monthly_income * 12)
        
        # Determine household size based on accounts
        credit_cards = [a for a in accounts if "Credit Card" in a.get("account_type", "")]
        if len(credit_cards) > 3:
            profile["household_size"] = min(len(credit_cards) // 2, 6)
        
        # Check for specific account types that indicate life circumstances
        for account in accounts:
            creditor = account.get("creditor_name", "").lower()
            if "veteran" in creditor or "military" in creditor:
                profile["is_veteran"] = True
            if "senior" in creditor or "retirement" in creditor:
                profile["is_senior"] = True
    
    return profile

def extract_relief_profile_from_parsed_data(parsed_data: dict) -> dict:
    """Extract relief program profile from parsed credit data"""
    profile = {}
    
    if isinstance(parsed_data, dict):
        profile["credit_score"] = parsed_data.get("credit_score")
        
        # Analyze accounts for financial stress indicators
        accounts = parsed_data.get("accounts", [])
        total_debt = 0
        monthly_payments = 0
        
        for account in accounts:
            balance = account.get("balance", 0)
            total_debt += balance
            
            # Estimate monthly payment (rough calculation)
            if account.get("account_type") == "Credit Card":
                monthly_payments += balance * 0.02  # 2% minimum payment
            elif "Loan" in account.get("account_type", ""):
                monthly_payments += balance * 0.01  # Rough estimate
        
        profile["total_debt"] = total_debt
        profile["monthly_debt_payments"] = monthly_payments
        
        # Determine financial stress level
        stress_indicators = []
        if total_debt > 50000:
            stress_indicators.append("high_debt")
        if profile["credit_score"] and profile["credit_score"] < 600:
            stress_indicators.append("poor_credit")
        if len([a for a in accounts if a.get("status") == "Delinquent"]) > 0:
            stress_indicators.append("delinquent_accounts")
        
        profile["financial_stress_indicators"] = stress_indicators
        
        # Estimate income based on debt-to-income patterns
        if monthly_payments > 0:
            estimated_monthly_income = monthly_payments / 0.36
            profile["monthly_income"] = estimated_monthly_income
            profile["income"] = int(estimated_monthly_income * 12)
        
        # Determine household size based on accounts
        credit_cards = [a for a in accounts if "Credit Card" in a.get("account_type", "")]
        if len(credit_cards) > 3:
            profile["household_size"] = min(len(credit_cards) // 2, 6)
        
        # Check for specific account types that indicate life circumstances
        for account in accounts:
            creditor = account.get("creditor", "").lower()
            if "veteran" in creditor or "military" in creditor:
                profile["is_veteran"] = True
            if "senior" in creditor or "retirement" in creditor:
                profile["is_senior"] = True
    
    return profile

@router.get("/user-recommendations/{user_id}")
def get_user_recommendations(user_id: str, db: Session = Depends(get_db)):
    """Get saved recommendations for a specific user"""
    try:
        recommendations = db.query(ReliefRecommendation).filter(
            ReliefRecommendation.user_id == user_id
        ).order_by(ReliefRecommendation.created_at.desc()).all()
        
        return {
            "user_id": user_id,
            "recommendations": [
                {
                    "id": str(r.id),
                    "program_id": r.program_id,
                    "why": r.why,
                    "confidence": r.confidence,
                    "status": r.status,
                    "created_at": r.created_at.isoformat()
                }
                for r in recommendations
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get user recommendations: {str(e)}")
