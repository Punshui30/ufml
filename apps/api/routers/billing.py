"""
Billing and pricing models for Credit Hardar
Two-tier pricing: Software licensing for agencies + Credit repair services for consumers
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timedelta
from models.base import get_db

router = APIRouter()

# SOFTWARE LICENSING PRICING (For Agencies)
SOFTWARE_PRICING_PLANS = [
    {
        "plan_id": "starter_agency",
        "name": "Starter Agency",
        "description": "Perfect for new credit repair businesses",
        "price_monthly": 297,  # $297/month
        "price_yearly": 2970,  # $2,970/year (2 months free)
        "features": [
            "Up to 50 active clients",
            "Basic dispute letter generation",
            "Credit report analysis",
            "Client management dashboard",
            "Email support",
            "Basic reporting"
        ],
        "limits": {
            "max_clients": 50,
            "max_disputes_per_month": 200,
            "max_reports_per_month": 100,
            "storage_gb": 5
        },
        "launch_discount": 0.5  # 50% off for launch
    },
    {
        "plan_id": "professional_agency",
        "name": "Professional Agency",
        "description": "For established credit repair businesses",
        "price_monthly": 597,  # $597/month
        "price_yearly": 5970,  # $5,970/year (2 months free)
        "features": [
            "Up to 200 active clients",
            "Advanced dispute letter generation",
            "AI-powered credit report analysis",
            "ReliefFinder integration",
            "Direct mail integration",
            "Specialty bureau management",
            "Advanced reporting & analytics",
            "Priority support",
            "API access"
        ],
        "limits": {
            "max_clients": 200,
            "max_disputes_per_month": 1000,
            "max_reports_per_month": 500,
            "storage_gb": 25
        },
        "launch_discount": 0.5  # 50% off for launch
    },
    {
        "plan_id": "enterprise_agency",
        "name": "Enterprise Agency",
        "description": "For large credit repair organizations",
        "price_monthly": 1197,  # $1,197/month
        "price_yearly": 11970,  # $11,970/year (2 months free)
        "features": [
            "Unlimited active clients",
            "Premium AI dispute generation",
            "Advanced ReliefFinder with custom programs",
            "Full direct mail automation",
            "All specialty bureaus",
            "White-label options",
            "Custom reporting & dashboards",
            "Dedicated account manager",
            "Full API access",
            "Custom integrations",
            "Training & onboarding"
        ],
        "limits": {
            "max_clients": -1,  # Unlimited
            "max_disputes_per_month": -1,  # Unlimited
            "max_reports_per_month": -1,  # Unlimited
            "storage_gb": 100
        },
        "launch_discount": 0.5  # 50% off for launch
    }
]

# CREDIT REPAIR SERVICE PRICING (For Consumers)
SERVICE_PRICING_PLANS = [
    {
        "plan_id": "credit_repair_basic",
        "name": "Credit Repair Basic",
        "description": "Essential credit repair services",
        "price_monthly": 97,  # $97/month
        "price_setup": 197,  # $197 setup fee
        "features": [
            "Credit report analysis from all 3 bureaus",
            "5 dispute letters per month",
            "Credit monitoring",
            "Basic dispute tracking",
            "Email support"
        ],
        "services_included": [
            "Initial credit consultation",
            "Credit report review & analysis",
            "Dispute letter generation",
            "Bureau correspondence tracking",
            "Monthly progress reports"
        ],
        "guarantee": "30-day money-back guarantee"
    },
    {
        "plan_id": "credit_repair_plus",
        "name": "Credit Repair Plus",
        "description": "Comprehensive credit repair with ReliefFinder",
        "price_monthly": 147,  # $147/month
        "price_setup": 297,  # $297 setup fee
        "features": [
            "Everything in Basic",
            "Unlimited dispute letters",
            "ReliefFinder program matching",
            "Goodwill letter assistance",
            "Creditor negotiation support",
            "Priority support"
        ],
        "services_included": [
            "Everything in Basic plan",
            "ReliefFinder financial assistance matching",
            "Goodwill letter templates & assistance",
            "Creditor negotiation letters",
            "Specialty bureau disputes",
            "Credit building strategies",
            "Weekly progress updates"
        ],
        "guarantee": "60-day money-back guarantee"
    },
    {
        "plan_id": "credit_repair_premium",
        "name": "Credit Repair Premium",
        "description": "Full-service credit repair with premium features",
        "price_monthly": 197,  # $197/month
        "price_setup": 397,  # $397 setup fee
        "features": [
            "Everything in Plus",
            "Direct mail disputes",
            "Legal dispute assistance",
            "Credit score simulation",
            "Identity theft protection",
            "Dedicated credit specialist"
        ],
        "services_included": [
            "Everything in Plus plan",
            "Certified mail dispute delivery",
            "Legal dispute letter templates",
            "Credit score improvement simulation",
            "Identity theft monitoring",
            "Personal credit specialist",
            "Bi-weekly phone consultations",
            "Custom credit building plan"
        ],
        "guarantee": "90-day money-back guarantee"
    }
]

class PricingPlanResponse(BaseModel):
    plan_id: str
    name: str
    description: str
    price_monthly: int
    price_yearly: Optional[int] = None
    price_setup: Optional[int] = None
    features: List[str]
    services_included: Optional[List[str]] = None
    limits: Optional[dict] = None
    guarantee: Optional[str] = None
    launch_discount: float = 0.0
    discounted_price_monthly: Optional[float] = None
    discounted_price_yearly: Optional[float] = None
    discounted_price_setup: Optional[float] = None

class PricingResponse(BaseModel):
    software_plans: List[PricingPlanResponse]
    service_plans: List[PricingPlanResponse]
    launch_promo_active: bool
    launch_discount_percent: int

@router.get("/pricing", response_model=PricingResponse)
def get_pricing():
    """Get all pricing plans for software licensing and credit repair services"""
    
    # Calculate discounted prices
    software_plans = []
    for plan in SOFTWARE_PRICING_PLANS:
        discounted_monthly = plan["price_monthly"] * (1 - plan["launch_discount"])
        discounted_yearly = plan["price_yearly"] * (1 - plan["launch_discount"])
        
        software_plans.append(PricingPlanResponse(
            plan_id=plan["plan_id"],
            name=plan["name"],
            description=plan["description"],
            price_monthly=plan["price_monthly"],
            price_yearly=plan["price_yearly"],
            features=plan["features"],
            limits=plan["limits"],
            launch_discount=plan["launch_discount"],
            discounted_price_monthly=discounted_monthly,
            discounted_price_yearly=discounted_yearly
        ))
    
    service_plans = []
    for plan in SERVICE_PRICING_PLANS:
        service_plans.append(PricingPlanResponse(
            plan_id=plan["plan_id"],
            name=plan["name"],
            description=plan["description"],
            price_monthly=plan["price_monthly"],
            price_setup=plan["price_setup"],
            features=plan["features"],
            services_included=plan["services_included"],
            guarantee=plan["guarantee"]
        ))
    
    return PricingResponse(
        software_plans=software_plans,
        service_plans=service_plans,
        launch_promo_active=True,
        launch_discount_percent=50
    )

@router.get("/software-plans", response_model=List[PricingPlanResponse])
def get_software_pricing():
    """Get software licensing pricing for agencies"""
    software_plans = []
    for plan in SOFTWARE_PRICING_PLANS:
        discounted_monthly = plan["price_monthly"] * (1 - plan["launch_discount"])
        discounted_yearly = plan["price_yearly"] * (1 - plan["launch_discount"])
        
        software_plans.append(PricingPlanResponse(
            plan_id=plan["plan_id"],
            name=plan["name"],
            description=plan["description"],
            price_monthly=plan["price_monthly"],
            price_yearly=plan["price_yearly"],
            features=plan["features"],
            limits=plan["limits"],
            launch_discount=plan["launch_discount"],
            discounted_price_monthly=discounted_monthly,
            discounted_price_yearly=discounted_yearly
        ))
    
    return software_plans

@router.get("/service-plans", response_model=List[PricingPlanResponse])
def get_service_pricing():
    """Get credit repair service pricing for consumers"""
    service_plans = []
    for plan in SERVICE_PRICING_PLANS:
        service_plans.append(PricingPlanResponse(
            plan_id=plan["plan_id"],
            name=plan["name"],
            description=plan["description"],
            price_monthly=plan["price_monthly"],
            price_setup=plan["price_setup"],
            features=plan["features"],
            services_included=plan["services_included"],
            guarantee=plan["guarantee"]
        ))
    
    return service_plans

@router.get("/revenue-calculator")
def get_revenue_calculator():
    """Revenue calculator for agencies to estimate potential earnings"""
    
    # Example calculations for different scenarios
    scenarios = [
        {
            "scenario": "Small Agency (50 clients)",
            "clients": 50,
            "avg_monthly_fee": 147,  # Credit Repair Plus
            "avg_setup_fee": 297,
            "monthly_revenue": 50 * 147,  # $7,350
            "setup_revenue": 50 * 297,    # $14,850 (one-time)
            "annual_revenue": (50 * 147 * 12) + (50 * 297),  # $102,950
            "software_cost": 297 * 12,  # Starter Agency
            "net_annual_profit": ((50 * 147 * 12) + (50 * 297)) - (297 * 12)  # $99,266
        },
        {
            "scenario": "Medium Agency (200 clients)",
            "clients": 200,
            "avg_monthly_fee": 147,
            "avg_setup_fee": 297,
            "monthly_revenue": 200 * 147,  # $29,400
            "setup_revenue": 200 * 297,    # $59,400 (one-time)
            "annual_revenue": (200 * 147 * 12) + (200 * 297),  # $411,800
            "software_cost": 597 * 12,  # Professional Agency
            "net_annual_profit": ((200 * 147 * 12) + (200 * 297)) - (597 * 12)  # $404,636
        },
        {
            "scenario": "Large Agency (500 clients)",
            "clients": 500,
            "avg_monthly_fee": 147,
            "avg_setup_fee": 297,
            "monthly_revenue": 500 * 147,  # $73,500
            "setup_revenue": 500 * 297,    # $148,500 (one-time)
            "annual_revenue": (500 * 147 * 12) + (500 * 297),  # $1,029,500
            "software_cost": 1197 * 12,  # Enterprise Agency
            "net_annual_profit": ((500 * 147 * 12) + (500 * 297)) - (1197 * 12)  # $1,015,136
        }
    ]
    
    return {
        "scenarios": scenarios,
        "note": "Based on Credit Repair Plus pricing ($147/month + $297 setup). Actual results may vary.",
        "assumptions": [
            "Average client retention: 12 months",
            "Mix of Basic (30%), Plus (50%), Premium (20%) plans",
            "Software costs at launch pricing (50% off)",
            "No additional operational costs included"
        ]
    }

@router.get("/launch-promo")
def get_launch_promotion():
    """Get current launch promotion details"""
    return {
        "promo_active": True,
        "discount_percent": 50,
        "discount_code": "LAUNCH50",
        "valid_until": "2024-12-31",
        "description": "50% off all software plans for the first year",
        "terms": [
            "Valid for new agency accounts only",
            "Discount applies to first 12 months of service",
            "Cannot be combined with other offers",
            "Auto-renews at regular pricing after first year"
        ]
    }