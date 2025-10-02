"""
Advanced Dispute Strategies Service
Implements all legal tricks and advanced dispute techniques for maximum success
"""

import json
import re
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
from dataclasses import dataclass

@dataclass
class DisputeStrategy:
    name: str
    description: str
    legal_basis: str
    success_rate: float
    complexity: str
    evidence_required: List[str]
    template: str
    follow_up_required: bool

class AdvancedDisputeStrategies:
    """Advanced dispute strategies incorporating all legal techniques"""
    
    def __init__(self):
        self.e_oscar_bypass_methods = self._load_e_oscar_bypass_methods()
        self.factual_dispute_techniques = self._load_factual_dispute_techniques()
        self.consumer_law_strategies = self._load_consumer_law_strategies()
        self.specialty_bureau_targets = self._load_specialty_bureau_targets()
        self.advanced_legal_tricks = self._load_advanced_legal_tricks()
    
    def generate_comprehensive_dispute_plan(self, credit_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate comprehensive dispute plan using ALL available strategies
        """
        dispute_plan = {
            "e_oscar_bypass_strategies": [],
            "factual_dispute_opportunities": [],
            "consumer_law_violations": [],
            "specialty_bureau_targets": [],
            "advanced_legal_strategies": [],
            "police_report_strategies": [],
            "dollar_amount_disputes": [],
            "metro2_compliance_issues": [],
            "fcra_violations": [],
            "fdcpa_violations": [],
            "priority_order": [],
            "estimated_success_rate": 0.0,
            "estimated_score_improvement": 0
        }
        
        # 1. E Oscar Bypass Strategies
        dispute_plan["e_oscar_bypass_strategies"] = self._identify_e_oscar_bypass_opportunities(credit_data)
        
        # 2. Factual Dispute Techniques
        dispute_plan["factual_dispute_opportunities"] = self._identify_factual_disputes(credit_data)
        
        # 3. Consumer Law Violations
        dispute_plan["consumer_law_violations"] = self._identify_consumer_law_violations(credit_data)
        
        # 4. Specialty Bureau Targets
        dispute_plan["specialty_bureau_targets"] = self._identify_specialty_bureau_targets(credit_data)
        
        # 5. Advanced Legal Strategies
        dispute_plan["advanced_legal_strategies"] = self._identify_advanced_legal_strategies(credit_data)
        
        # 6. Police Report Strategies
        dispute_plan["police_report_strategies"] = self._identify_police_report_opportunities(credit_data)
        
        # 7. Dollar Amount Disputes (even $1 discrepancies)
        dispute_plan["dollar_amount_disputes"] = self._identify_dollar_amount_disputes(credit_data)
        
        # 8. Metro2 Compliance Issues
        dispute_plan["metro2_compliance_issues"] = self._identify_metro2_compliance_issues(credit_data)
        
        # 9. FCRA Violations
        dispute_plan["fcra_violations"] = self._identify_fcra_violations(credit_data)
        
        # 10. FDCPA Violations
        dispute_plan["fdcpa_violations"] = self._identify_fdcpa_violations(credit_data)
        
        # Calculate overall metrics
        dispute_plan["estimated_success_rate"] = self._calculate_overall_success_rate(dispute_plan)
        dispute_plan["estimated_score_improvement"] = self._calculate_score_improvement(dispute_plan)
        dispute_plan["priority_order"] = self._generate_priority_order(dispute_plan)
        
        return dispute_plan
    
    def _load_e_oscar_bypass_methods(self) -> List[Dict[str, Any]]:
        """Load E Oscar bypass methods"""
        return [
            {
                "method": "Metro2 Format Compliance",
                "description": "Force creditors to use proper Metro2 format, making automated validation fail",
                "success_rate": 0.85,
                "technique": "Submit disputes in Metro2 format with specific field requirements",
                "legal_basis": "15 U.S.C. § 1681s-2(a)(5) - Accuracy and integrity requirements"
            },
            {
                "method": "Documentation Requirements",
                "description": "Require specific documentation that automated systems can't verify",
                "success_rate": 0.78,
                "technique": "Request original signed contracts, payment ledgers, or account opening documents",
                "legal_basis": "FCRA § 611 - Procedure in case of disputed accuracy"
            },
            {
                "method": "Timeline Discrepancies",
                "description": "Create timeline inconsistencies that require human review",
                "success_rate": 0.72,
                "technique": "Dispute dates, payment schedules, or reporting periods",
                "legal_basis": "FCRA § 605 - Requirements relating to information contained in consumer reports"
            },
            {
                "method": "Cross-Reference Validation",
                "description": "Require cross-referencing with other data sources",
                "success_rate": 0.80,
                "technique": "Request verification against bank records, tax documents, or other accounts",
                "legal_basis": "FCRA § 623 - Responsibilities of furnishers of information"
            }
        ]
    
    def _load_factual_dispute_techniques(self) -> List[Dict[str, Any]]:
        """Load factual dispute techniques"""
        return [
            {
                "technique": "Payment History Discrepancy",
                "description": "Dispute payment dates, amounts, or status based on bank records",
                "success_rate": 0.88,
                "evidence_required": ["bank_statements", "payment_confirmations", "account_history"]
            },
            {
                "technique": "Account Opening Date",
                "description": "Dispute when account was actually opened vs. reported date",
                "success_rate": 0.75,
                "evidence_required": ["original_contracts", "welcome_letters", "first_statements"]
            },
            {
                "technique": "Credit Limit Verification",
                "description": "Dispute reported credit limits against actual limits",
                "success_rate": 0.82,
                "evidence_required": ["credit_limit_letters", "account_statements", "online_accounts"]
            },
            {
                "technique": "Account Status Accuracy",
                "description": "Dispute whether account is open/closed/charged-off",
                "success_rate": 0.85,
                "evidence_required": ["account_statements", "correspondence", "online_accounts"]
            }
        ]
    
    def _load_consumer_law_strategies(self) -> List[Dict[str, Any]]:
        """Load consumer law violation strategies"""
        return [
            {
                "law": "Fair Credit Reporting Act (FCRA)",
                "violations": [
                    "Inaccurate reporting without investigation",
                    "Failure to provide dispute results within 30 days",
                    "Reporting outdated information",
                    "Failure to notify of dispute investigation"
                ],
                "penalties": "Actual damages, statutory damages up to $1,000, attorney fees",
                "success_rate": 0.90
            },
            {
                "law": "Fair Debt Collection Practices Act (FDCPA)",
                "violations": [
                    "False representation of debt amount",
                    "Threatening actions not legally taken",
                    "Contacting consumer at inconvenient times",
                    "Failure to validate debt within 5 days"
                ],
                "penalties": "Statutory damages up to $1,000, actual damages, attorney fees",
                "success_rate": 0.85
            },
            {
                "law": "Truth in Lending Act (TILA)",
                "violations": [
                    "Incorrect APR disclosure",
                    "Missing required disclosures",
                    "Incorrect payment schedule",
                    "Failure to provide periodic statements"
                ],
                "penalties": "Actual damages, statutory damages, attorney fees",
                "success_rate": 0.80
            }
        ]
    
    def _load_specialty_bureau_targets(self) -> List[Dict[str, Any]]:
        """Load specialty bureau targets beyond the big 3"""
        return [
            {
                "bureau": "LexisNexis Risk Solutions",
                "type": "Insurance and Risk Assessment",
                "address": "9443 Springboro Pike, Miamisburg, OH 45342",
                "phone": "(800) 456-1244",
                "email": "consumer.requests@lexisnexis.com",
                "dispute_methods": ["Written dispute", "Online dispute", "Phone dispute"],
                "success_rate": 0.72,
                "specialty": "Insurance claims, public records, identity verification"
            },
            {
                "bureau": "LCI Credit Services",
                "type": "Consumer Credit Reporting",
                "address": "P.O. Box 1357, Carmel, IN 46082",
                "phone": "(800) 875-4378",
                "email": "consumer@lci.com",
                "dispute_methods": ["Written dispute", "Online dispute"],
                "success_rate": 0.85,
                "specialty": "Alternative credit data, rental payments, utilities"
            },
            {
                "bureau": "Innovis Data Solutions",
                "type": "Consumer Credit Reporting",
                "address": "P.O. Box 1689, Pittsburgh, PA 15230",
                "phone": "(800) 540-2505",
                "email": "optout@innovis.com",
                "dispute_methods": ["Written dispute", "Online dispute"],
                "success_rate": 0.78,
                "specialty": "Credit reporting, identity verification, fraud prevention"
            },
            {
                "bureau": "ARS (Automotive Remarketing Services)",
                "type": "Automotive Credit Reporting",
                "address": "P.O. Box 5000, Costa Mesa, CA 92628",
                "phone": "(800) 892-7957",
                "email": "consumer@ars.com",
                "dispute_methods": ["Written dispute", "Online dispute"],
                "success_rate": 0.80,
                "specialty": "Automotive loans, leases, repossessions"
            },
            {
                "bureau": "Clarity Services",
                "type": "Alternative Credit Data",
                "address": "P.O. Box 2400, Clearwater, FL 33757",
                "phone": "(800) 631-7414",
                "email": "consumer@clarityservices.com",
                "dispute_methods": ["Written dispute", "Online dispute"],
                "success_rate": 0.82,
                "specialty": "Payday loans, installment loans, alternative credit"
            },
            {
                "bureau": "DataX",
                "type": "Consumer Credit Reporting",
                "address": "P.O. Box 4039, Alpharetta, GA 30023",
                "phone": "(888) 278-7111",
                "email": "consumer@datax.com",
                "dispute_methods": ["Written dispute", "Online dispute"],
                "success_rate": 0.75,
                "specialty": "Consumer finance, auto loans, credit cards"
            },
            {
                "bureau": "MicroBilt",
                "type": "Consumer Credit Reporting",
                "address": "P.O. Box 4000, Kennesaw, GA 30156",
                "phone": "(800) 884-4747",
                "email": "consumer@microbilt.com",
                "dispute_methods": ["Written dispute", "Online dispute"],
                "success_rate": 0.78,
                "specialty": "Background checks, credit reports, identity verification"
            },
            {
                "bureau": "Factor Trust",
                "type": "Alternative Credit Data",
                "address": "P.O. Box 4900, Carmel, IN 46082",
                "phone": "(800) 477-6000",
                "email": "consumer@factortrust.com",
                "dispute_methods": ["Written dispute", "Online dispute"],
                "success_rate": 0.80,
                "specialty": "Alternative credit data, rental payments, utilities"
            },
            {
                "bureau": "Credco",
                "type": "Consumer Credit Reporting",
                "address": "P.O. Box 2000, Chester, PA 19016",
                "phone": "(800) 916-8800",
                "email": "consumer@credco.com",
                "dispute_methods": ["Written dispute", "Online dispute"],
                "success_rate": 0.77,
                "specialty": "Credit reports, identity verification, fraud prevention"
            }
        ]
    
    def _load_advanced_legal_tricks(self) -> List[Dict[str, Any]]:
        """Load advanced legal tricks and strategies"""
        return [
            {
                "trick": "Police Report Strategy",
                "description": "Use police reports to dispute fraudulent or inaccurate information",
                "success_rate": 0.95,
                "technique": "File police report for identity theft or fraud, then dispute all related accounts",
                "legal_basis": "FCRA § 605B - Block of information resulting from identity theft",
                "evidence_required": ["police_report", "identity_theft_affidavit", "fraud_alerts"]
            },
            {
                "trick": "Dollar Amount Disputes",
                "description": "Dispute even $1 discrepancies as 'factually inaccurate'",
                "success_rate": 0.88,
                "technique": "Challenge any amount that doesn't match bank records exactly",
                "legal_basis": "FCRA § 623(a)(2) - Duty to provide accurate information",
                "evidence_required": ["bank_statements", "account_statements", "payment_records"]
            },
            {
                "trick": "Metro2 Compliance Enforcement",
                "description": "Force creditors to comply with Metro2 reporting standards",
                "success_rate": 0.82,
                "technique": "Dispute accounts not reported in proper Metro2 format",
                "legal_basis": "15 U.S.C. § 1681s-2(a)(5) - Accuracy and integrity requirements",
                "evidence_required": ["metro2_format_requirements", "account_documentation"]
            },
            {
                "trick": "Cross-Bureau Inconsistency",
                "description": "Use inconsistencies between bureaus to force corrections",
                "success_rate": 0.85,
                "technique": "Point out different information reported to different bureaus",
                "legal_basis": "FCRA § 623(a)(2) - Duty to provide accurate information",
                "evidence_required": ["credit_reports_from_all_bureaus", "comparison_chart"]
            },
            {
                "trick": "Timeline Violations",
                "description": "Dispute accounts reported outside legal reporting periods",
                "success_rate": 0.90,
                "technique": "Challenge accounts older than 7-10 years depending on type",
                "legal_basis": "FCRA § 605 - Requirements relating to information contained in consumer reports",
                "evidence_required": ["credit_reports", "date_calculations", "legal_citations"]
            },
            {
                "trick": "Validation Requirements",
                "description": "Require original documentation for all disputed items",
                "success_rate": 0.78,
                "technique": "Request original signed contracts, payment ledgers, account opening documents",
                "legal_basis": "FCRA § 611 - Procedure in case of disputed accuracy",
                "evidence_required": ["dispute_letters", "documentation_requests"]
            },
            {
                "trick": "Identity Verification Loopholes",
                "description": "Use identity verification requirements to force manual review",
                "success_rate": 0.80,
                "technique": "Request identity verification that automated systems can't handle",
                "legal_basis": "FCRA § 611 - Procedure in case of disputed accuracy",
                "evidence_required": ["identity_documents", "verification_requests"]
            },
            {
                "trick": "Statute of Limitations Defense",
                "description": "Use statute of limitations to dispute old debts",
                "success_rate": 0.85,
                "technique": "Challenge debts past statute of limitations in your state",
                "legal_basis": "State statute of limitations laws",
                "evidence_required": ["debt_documentation", "state_law_citations", "date_calculations"]
            }
        ]
    
    def _identify_e_oscar_bypass_opportunities(self, credit_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Identify E Oscar bypass opportunities"""
        opportunities = []
        
        for account in credit_data.get("accounts", []):
            # Check for Metro2 format issues
            if not account.get("metro2_compliant", True):
                opportunities.append({
                    "type": "metro2_compliance_dispute",
                    "account": account.get("creditor"),
                    "method": "Metro2 Format Compliance",
                    "description": "Account not reported in proper Metro2 format",
                    "success_rate": 0.85,
                    "evidence_required": ["metro2_format_requirements", "account_documentation"]
                })
            
            # Check for missing documentation
            if not account.get("has_original_documentation", True):
                opportunities.append({
                    "type": "documentation_requirement",
                    "account": account.get("creditor"),
                    "method": "Documentation Requirements",
                    "description": "Require original signed contracts and payment ledgers",
                    "success_rate": 0.78,
                    "evidence_required": ["original_contracts", "payment_ledgers", "account_opening_docs"]
                })
        
        return opportunities
    
    def _identify_factual_disputes(self, credit_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Identify factual dispute opportunities"""
        opportunities = []
        
        for account in credit_data.get("accounts", []):
            # Payment history disputes
            if account.get("status") in ["Late", "30 Days Late", "60 Days Late", "90 Days Late"]:
                opportunities.append({
                    "type": "payment_history_dispute",
                    "account": account.get("creditor"),
                    "technique": "Payment History Discrepancy",
                    "specific_reason": f"Payment was made on time but reported as {account.get('status')}",
                    "detailed_reason": f"Bank records show payment was processed on {account.get('actual_payment_date', 'the due date')} but creditor reported it as {account.get('status')} on {account.get('reported_date', 'date')}",
                    "ai_generated_narrative": f"I dispute the {account.get('status')} status on this {account.get('type', 'account')} with {account.get('creditor')}. Bank statements clearly show that payment was made on time on {account.get('actual_payment_date', 'the due date')}. The reported late status is factually inaccurate and must be corrected. Please verify this information with your payment processing records.",
                    "legal_basis": "FCRA § 623(a)(2) - Duty to provide accurate information",
                    "success_rate": 0.88,
                    "evidence_required": ["bank_statements", "payment_confirmations", "account_history"]
                })
            
            # Balance disputes (even $1 discrepancies)
            if account.get("balance_discrepancy", False):
                opportunities.append({
                    "type": "balance_dispute",
                    "account": account.get("creditor"),
                    "technique": "Dollar Amount Disputes",
                    "specific_reason": f"Balance amount is factually incorrect by ${abs(account.get('balance_discrepancy', 0))}",
                    "detailed_reason": f"Creditor reports balance as ${account.get('reported_balance')} but actual balance per bank records is ${account.get('actual_balance')}. Difference of ${abs(account.get('balance_discrepancy', 0))} must be corrected.",
                    "ai_generated_narrative": f"I dispute the balance amount reported for this {account.get('type', 'account')} with {account.get('creditor')}. The reported balance of ${account.get('reported_balance')} is factually inaccurate. Bank statements and account records show the actual balance is ${account.get('actual_balance')}. This ${abs(account.get('balance_discrepancy', 0))} discrepancy must be corrected immediately as it affects my credit utilization and score.",
                    "legal_basis": "FCRA § 623(a)(2) - Duty to provide accurate information",
                    "success_rate": 0.88,
                    "evidence_required": ["bank_statements", "account_statements", "payment_records"]
                })
            
            # Account opening date disputes
            if account.get("opening_date_discrepancy", False):
                opportunities.append({
                    "type": "opening_date_dispute",
                    "account": account.get("creditor"),
                    "technique": "Account Opening Date",
                    "description": "Dispute when account was actually opened vs. reported date",
                    "success_rate": 0.75,
                    "evidence_required": ["original_contracts", "welcome_letters", "first_statements"]
                })
        
        return opportunities
    
    def _identify_consumer_law_violations(self, credit_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Identify consumer law violations"""
        violations = []
        
        # FCRA violations
        for account in credit_data.get("accounts", []):
            if account.get("age_years", 0) > 7:
                violations.append({
                    "law": "FCRA",
                    "violation": "Reporting outdated information",
                    "account": account.get("creditor"),
                    "description": f"Account {account.get('age_years')} years old, past 7-year reporting limit",
                    "penalty": "Removal required",
                    "success_rate": 0.90
                })
        
        # FDCPA violations
        for account in credit_data.get("accounts", []):
            if account.get("collection_agency", False):
                violations.append({
                    "law": "FDCPA",
                    "violation": "False representation of debt amount",
                    "account": account.get("creditor"),
                    "description": "Collection agency reporting incorrect debt amount",
                    "penalty": "Statutory damages up to $1,000",
                    "success_rate": 0.85
                })
        
        return violations
    
    def _identify_specialty_bureau_targets(self, credit_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Identify specialty bureau targets"""
        targets = []
        
        # Check for accounts that might be reported to specialty bureaus
        for account in credit_data.get("accounts", []):
            if account.get("type") == "Auto Loan":
                targets.append({
                    "bureau": "ARS (Automotive Remarketing Services)",
                    "account": account.get("creditor"),
                    "reason": "Automotive loan likely reported to ARS",
                    "success_rate": 0.80,
                    "dispute_method": "Written dispute with account documentation"
                })
            
            if account.get("type") == "Payday Loan":
                targets.append({
                    "bureau": "Clarity Services",
                    "account": account.get("creditor"),
                    "reason": "Payday loan likely reported to Clarity Services",
                    "success_rate": 0.82,
                    "dispute_method": "Online dispute with payment history"
                })
        
        return targets
    
    def _identify_advanced_legal_strategies(self, credit_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Identify advanced legal strategies"""
        strategies = []
        
        # Police report strategy for fraud
        if credit_data.get("has_fraudulent_accounts", False):
            strategies.append({
                "strategy": "Police Report Strategy",
                "description": "File police report for identity theft, then dispute all related accounts",
                "success_rate": 0.95,
                "technique": "Identity theft affidavit with police report",
                "evidence_required": ["police_report", "identity_theft_affidavit", "fraud_alerts"]
            })
        
        # Cross-bureau inconsistency
        if credit_data.get("has_bureau_inconsistencies", False):
            strategies.append({
                "strategy": "Cross-Bureau Inconsistency",
                "description": "Use different information reported to different bureaus",
                "success_rate": 0.85,
                "technique": "Point out inconsistencies between bureau reports",
                "evidence_required": ["credit_reports_from_all_bureaus", "comparison_chart"]
            })
        
        return strategies
    
    def _identify_police_report_opportunities(self, credit_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Identify police report opportunities"""
        opportunities = []
        
        # Check for accounts that might be fraudulent
        for account in credit_data.get("accounts", []):
            if account.get("fraud_indicator", False):
                opportunities.append({
                    "type": "fraud_dispute",
                    "account": account.get("creditor"),
                    "description": "Account appears fraudulent, file police report",
                    "success_rate": 0.95,
                    "steps": [
                        "File police report for identity theft",
                        "Complete FTC identity theft affidavit",
                        "Place fraud alerts with all bureaus",
                        "Dispute account with police report"
                    ],
                    "evidence_required": ["police_report", "identity_theft_affidavit", "fraud_alerts"]
                })
        
        return opportunities
    
    def _identify_dollar_amount_disputes(self, credit_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Identify dollar amount disputes (even $1 discrepancies)"""
        disputes = []
        
        for account in credit_data.get("accounts", []):
            if account.get("balance_discrepancy", False):
                disputes.append({
                    "type": "balance_discrepancy",
                    "account": account.get("creditor"),
                    "description": f"Balance discrepancy of ${account.get('discrepancy_amount', 1)}",
                    "success_rate": 0.88,
                    "technique": "Challenge any amount that doesn't match bank records exactly",
                    "evidence_required": ["bank_statements", "account_statements", "payment_records"]
                })
            
            if account.get("payment_amount_discrepancy", False):
                disputes.append({
                    "type": "payment_amount_discrepancy",
                    "account": account.get("creditor"),
                    "description": f"Payment amount discrepancy of ${account.get('payment_discrepancy', 1)}",
                    "success_rate": 0.88,
                    "technique": "Challenge payment amounts that don't match bank records",
                    "evidence_required": ["bank_statements", "payment_confirmations", "account_history"]
                })
        
        return disputes
    
    def _identify_metro2_compliance_issues(self, credit_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Identify Metro2 compliance issues"""
        issues = []
        
        for account in credit_data.get("accounts", []):
            if not account.get("metro2_compliant", True):
                issues.append({
                    "type": "metro2_compliance",
                    "account": account.get("creditor"),
                    "description": "Account not reported in proper Metro2 format",
                    "success_rate": 0.82,
                    "technique": "Force compliance with Metro2 reporting standards",
                    "evidence_required": ["metro2_format_requirements", "account_documentation"]
                })
        
        return issues
    
    def _identify_fcra_violations(self, credit_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Identify FCRA violations"""
        violations = []
        
        for account in credit_data.get("accounts", []):
            # Outdated information
            if account.get("age_years", 0) > 7:
                violations.append({
                    "type": "outdated_information",
                    "account": account.get("creditor"),
                    "description": f"Account {account.get('age_years')} years old, past 7-year limit",
                    "penalty": "Removal required",
                    "success_rate": 0.90
                })
            
            # Inaccurate reporting
            if account.get("has_inaccuracies", False):
                violations.append({
                    "type": "inaccurate_reporting",
                    "account": account.get("creditor"),
                    "description": "Account contains inaccurate information",
                    "penalty": "Correction required",
                    "success_rate": 0.85
                })
        
        return violations
    
    def _identify_fdcpa_violations(self, credit_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Identify FDCPA violations"""
        violations = []
        
        for account in credit_data.get("accounts", []):
            if account.get("collection_agency", False):
                violations.append({
                    "type": "false_debt_amount",
                    "account": account.get("creditor"),
                    "description": "Collection agency reporting false debt amount",
                    "penalty": "Statutory damages up to $1,000",
                    "success_rate": 0.85
                })
        
        return violations
    
    def _calculate_overall_success_rate(self, dispute_plan: Dict[str, Any]) -> float:
        """Calculate overall success rate"""
        all_opportunities = []
        for key, value in dispute_plan.items():
            if isinstance(value, list) and key != "priority_order":
                all_opportunities.extend(value)
        
        if not all_opportunities:
            return 0.0
        
        success_rates = [opp.get("success_rate", 0.5) for opp in all_opportunities if "success_rate" in opp]
        return sum(success_rates) / len(success_rates) if success_rates else 0.0
    
    def _calculate_score_improvement(self, dispute_plan: Dict[str, Any]) -> int:
        """Calculate estimated score improvement"""
        improvement = 0
        
        # Base improvements by type
        type_improvements = {
            "e_oscar_bypass_strategies": 15,
            "factual_dispute_opportunities": 20,
            "consumer_law_violations": 25,
            "specialty_bureau_targets": 10,
            "advanced_legal_strategies": 30,
            "police_report_strategies": 40,
            "dollar_amount_disputes": 5,
            "metro2_compliance_issues": 12,
            "fcra_violations": 20,
            "fdcpa_violations": 15
        }
        
        for key, value in dispute_plan.items():
            if isinstance(value, list) and key in type_improvements:
                improvement += len(value) * type_improvements[key]
        
        return min(improvement, 150)  # Cap at 150 points
    
    def _generate_priority_order(self, dispute_plan: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Generate priority order for disputes"""
        all_opportunities = []
        
        for key, value in dispute_plan.items():
            if isinstance(value, list) and key != "priority_order":
                for item in value:
                    item["category"] = key
                    all_opportunities.append(item)
        
        # Sort by success rate and impact
        sorted_opportunities = sorted(
            all_opportunities,
            key=lambda x: (x.get("success_rate", 0), x.get("penalty", "")),
            reverse=True
        )
        
        priority_order = []
        for i, opportunity in enumerate(sorted_opportunities[:20]):  # Top 20
            priority_order.append({
                "order": i + 1,
                "category": opportunity.get("category"),
                "type": opportunity.get("type"),
                "description": opportunity.get("description"),
                "success_rate": opportunity.get("success_rate"),
                "estimated_impact": "high" if opportunity.get("success_rate", 0) > 0.8 else "medium"
            })
        
        return priority_order
