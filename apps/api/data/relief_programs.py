"""
Real relief programs database for ReliefFinder
Comprehensive list of government and private relief programs
"""

RELIEF_PROGRAMS = [
    {
        "slug": "snap-food-assistance",
        "title": "SNAP (Supplemental Nutrition Assistance Program)",
        "jurisdiction": "Federal",
        "eligibility": {
            "income_threshold": 130,  # % of federal poverty level
            "asset_limit": 2250,
            "household_size_based": True,
            "employment_required": False,
            "special_circumstances": ["disabled", "senior"]
        },
        "docs_required": ["income_verification", "identity", "residence_proof"],
        "source_url": "https://www.fns.usda.gov/snap",
        "description": "Provides monthly benefits to buy food for low-income families",
        "benefit_amount": "Varies by household size and income",
        "application_method": "Online or local office"
    },
    {
        "slug": "medicaid-health-insurance",
        "title": "Medicaid",
        "jurisdiction": "State/Federal",
        "eligibility": {
            "income_threshold": 138,  # % of federal poverty level (expansion states)
            "asset_limit": 2000,
            "household_size_based": True,
            "employment_required": False,
            "special_circumstances": ["disabled", "senior", "pregnant", "children"]
        },
        "docs_required": ["income_verification", "identity", "residence_proof", "citizenship"],
        "source_url": "https://www.medicaid.gov",
        "description": "Free or low-cost health coverage for low-income individuals and families",
        "benefit_amount": "Full coverage with minimal or no cost",
        "application_method": "Online, phone, or local office"
    },
    {
        "slug": "section-8-housing",
        "title": "Section 8 Housing Choice Voucher",
        "jurisdiction": "Federal/Local",
        "eligibility": {
            "income_threshold": 50,  # % of area median income
            "asset_limit": 5000,
            "household_size_based": True,
            "employment_required": False,
            "special_circumstances": ["disabled", "senior", "homeless"]
        },
        "docs_required": ["income_verification", "identity", "residence_proof", "rental_history"],
        "source_url": "https://www.hud.gov/program_offices/public_indian_housing/programs/hcv",
        "description": "Helps low-income families afford decent, safe housing in the private market",
        "benefit_amount": "Subsidy covers portion of rent based on income",
        "application_method": "Local housing authority"
    },
    {
        "slug": "liheap-energy-assistance",
        "title": "LIHEAP (Low Income Home Energy Assistance Program)",
        "jurisdiction": "Federal/State",
        "eligibility": {
            "income_threshold": 150,  # % of federal poverty level
            "asset_limit": 3000,
            "household_size_based": True,
            "employment_required": False,
            "special_circumstances": ["disabled", "senior"]
        },
        "docs_required": ["income_verification", "identity", "utility_bills"],
        "source_url": "https://www.acf.hhs.gov/ocs/programs/liheap",
        "description": "Helps low-income households with heating and cooling costs",
        "benefit_amount": "Varies by state, typically $200-$1000 per year",
        "application_method": "Local LIHEAP office"
    },
    {
        "slug": "wic-nutrition",
        "title": "WIC (Women, Infants, and Children)",
        "jurisdiction": "Federal",
        "eligibility": {
            "income_threshold": 185,  # % of federal poverty level
            "asset_limit": None,
            "household_size_based": True,
            "employment_required": False,
            "special_circumstances": ["pregnant", "postpartum", "breastfeeding", "children_under_5"]
        },
        "docs_required": ["income_verification", "identity", "residence_proof"],
        "source_url": "https://www.fns.usda.gov/wic",
        "description": "Provides nutritious foods, nutrition education, and healthcare referrals",
        "benefit_amount": "Monthly food package worth $50-$100",
        "application_method": "Local WIC office"
    },
    {
        "slug": "ssi-disability",
        "title": "SSI (Supplemental Security Income)",
        "jurisdiction": "Federal",
        "eligibility": {
            "income_threshold": 0,  # Very low income
            "asset_limit": 2000,
            "household_size_based": False,
            "employment_required": False,
            "special_circumstances": ["disabled", "senior", "blind"]
        },
        "docs_required": ["medical_records", "income_verification", "identity", "work_history"],
        "source_url": "https://www.ssa.gov/ssi",
        "description": "Monthly cash assistance for disabled, blind, or elderly with limited income",
        "benefit_amount": "Up to $943/month (2024)",
        "application_method": "Social Security office or online"
    },
    {
        "slug": "unemployment-insurance",
        "title": "Unemployment Insurance",
        "jurisdiction": "State",
        "eligibility": {
            "income_threshold": 0,
            "asset_limit": None,
            "household_size_based": False,
            "employment_required": True,  # Must have worked recently
            "special_circumstances": ["unemployed"]
        },
        "docs_required": ["employment_history", "identity", "bank_account_info"],
        "source_url": "https://www.dol.gov/general/topic/unemployment-insurance",
        "description": "Temporary cash assistance for workers who lost their job through no fault of their own",
        "benefit_amount": "Varies by state, typically 40-60% of previous wages",
        "application_method": "State unemployment office online"
    },
    {
        "slug": "temporary-cash-assistance",
        "title": "TANF (Temporary Assistance for Needy Families)",
        "jurisdiction": "State",
        "eligibility": {
            "income_threshold": 185,  # % of federal poverty level
            "asset_limit": 1000,
            "household_size_based": True,
            "employment_required": False,
            "special_circumstances": ["children_under_18"]
        },
        "docs_required": ["income_verification", "identity", "residence_proof", "children_birth_certificates"],
        "source_url": "https://www.acf.hhs.gov/ofa/programs/tanf",
        "description": "Temporary cash assistance for families with dependent children",
        "benefit_amount": "Varies by state, typically $200-$800/month",
        "application_method": "Local social services office"
    },
    {
        "slug": "free-cell-phone-program",
        "title": "Lifeline (Free Cell Phone Program)",
        "jurisdiction": "Federal",
        "eligibility": {
            "income_threshold": 135,  # % of federal poverty level
            "asset_limit": None,
            "household_size_based": True,
            "employment_required": False,
            "special_circumstances": ["disabled", "senior"]
        },
        "docs_required": ["income_verification", "identity", "residence_proof"],
        "source_url": "https://www.fcc.gov/lifeline-consumers",
        "description": "Provides free or discounted phone and internet service",
        "benefit_amount": "Free phone + 1000 minutes/texts + 1GB data",
        "application_method": "Online through approved providers"
    },
    {
        "slug": "weatherization-assistance",
        "title": "Weatherization Assistance Program",
        "jurisdiction": "Federal/State",
        "eligibility": {
            "income_threshold": 200,  # % of federal poverty level
            "asset_limit": None,
            "household_size_based": True,
            "employment_required": False,
            "special_circumstances": ["disabled", "senior"]
        },
        "docs_required": ["income_verification", "identity", "home_ownership_proof"],
        "source_url": "https://www.energy.gov/eere/wap/weatherization-assistance-program",
        "description": "Free home energy efficiency improvements to reduce utility costs",
        "benefit_amount": "Up to $8,000 in home improvements",
        "application_method": "Local weatherization agency"
    },
    {
        "slug": "va-disability-compensation",
        "title": "VA Disability Compensation",
        "jurisdiction": "Federal",
        "eligibility": {
            "income_threshold": 0,
            "asset_limit": None,
            "household_size_based": True,
            "employment_required": False,
            "special_circumstances": ["veteran", "disabled"]
        },
        "docs_required": ["military_records", "medical_records", "identity"],
        "source_url": "https://www.va.gov/disability/",
        "description": "Monthly tax-free compensation for veterans with service-connected disabilities",
        "benefit_amount": "Varies by disability rating, $171.23-$4,433.39/month",
        "application_method": "VA office or online"
    },
    {
        "slug": "pension-benefit-guaranty",
        "title": "Pension Benefit Guaranty Corporation",
        "jurisdiction": "Federal",
        "eligibility": {
            "income_threshold": 0,
            "asset_limit": None,
            "household_size_based": False,
            "employment_required": True,  # Must have had pension
            "special_circumstances": ["senior", "retired"]
        },
        "docs_required": ["pension_documents", "identity", "employment_history"],
        "source_url": "https://www.pbgc.gov/",
        "description": "Protects pension benefits when private pension plans fail",
        "benefit_amount": "Up to $6,751.14/month (2024)",
        "application_method": "PBGC online or mail"
    }
]

def get_programs_by_jurisdiction(jurisdiction: str):
    """Get all programs for a specific jurisdiction"""
    return [p for p in RELIEF_PROGRAMS if p["jurisdiction"] == jurisdiction]

def get_programs_by_income(income: int, household_size: int):
    """Get programs eligible based on income and household size"""
    federal_poverty_levels = {
        1: 14580, 2: 19720, 3: 24860, 4: 30000, 5: 35140, 6: 40280, 7: 45420, 8: 50560
    }
    
    fpl = federal_poverty_levels.get(min(household_size, 8), 50560)
    eligible_programs = []
    
    for program in RELIEF_PROGRAMS:
        if program["eligibility"]["income_threshold"] > 0:
            threshold = fpl * (program["eligibility"]["income_threshold"] / 100)
            if income <= threshold:
                eligible_programs.append(program)
    
    return eligible_programs

def get_programs_by_special_circumstances(circumstances: list):
    """Get programs for special circumstances"""
    eligible_programs = []
    
    for program in RELIEF_PROGRAMS:
        program_circumstances = program["eligibility"].get("special_circumstances", [])
        if any(circ in program_circumstances for circ in circumstances):
            eligible_programs.append(program)
    
    return eligible_programs

def calculate_match_score(client_profile: dict, program: dict) -> float:
    """Calculate how well a program matches the client profile"""
    score = 0.0
    max_score = 10.0
    
    # Income eligibility (40% of score)
    if client_profile.get("income") and program["eligibility"]["income_threshold"] > 0:
        household_size = int(client_profile.get("household_size", 1))
        federal_poverty_levels = {
            1: 14580, 2: 19720, 3: 24860, 4: 30000, 5: 35140, 6: 40280, 7: 45420, 8: 50560
        }
        fpl = federal_poverty_levels.get(min(household_size, 8), 50560)
        threshold = fpl * (program["eligibility"]["income_threshold"] / 100)
        
        if int(client_profile["income"]) <= threshold:
            # Closer to threshold = higher score
            income_ratio = int(client_profile["income"]) / threshold
            score += (1 - income_ratio) * 4.0
        else:
            return 0.0  # Not eligible
    elif program["eligibility"]["income_threshold"] == 0:
        score += 4.0  # No income requirement
    
    # Special circumstances (30% of score)
    circumstances = []
    if client_profile.get("has_disabilities"):
        circumstances.append("disabled")
    if client_profile.get("is_senior"):
        circumstances.append("senior")
    if client_profile.get("is_veteran"):
        circumstances.append("veteran")
    if client_profile.get("employment_status") == "unemployed":
        circumstances.append("unemployed")
    
    program_circumstances = program["eligibility"].get("special_circumstances", [])
    matching_circumstances = [c for c in circumstances if c in program_circumstances]
    if matching_circumstances:
        score += (len(matching_circumstances) / len(program_circumstances)) * 3.0
    
    # Employment requirement (20% of score)
    if program["eligibility"].get("employment_required", False):
        if client_profile.get("employment_status") in ["employed", "self_employed"]:
            score += 2.0
    else:
        score += 2.0  # No employment requirement
    
    # Jurisdiction match (10% of score)
    if client_profile.get("state"):
        if program["jurisdiction"] in ["Federal", "State/Federal"]:
            score += 1.0
        elif program["jurisdiction"] == client_profile["state"]:
            score += 1.0
    
    return min(score / max_score, 1.0)




