"""
AI Credit Analyzer Service
Processes credit report data and identifies dispute opportunities
"""

import json
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)

class AICreditAnalyzer:
    """AI-powered credit report analysis and dispute identification"""
    
    def __init__(self):
        self.dispute_patterns = self._load_dispute_patterns()
        self.bureau_contacts = self._load_bureau_contacts()
    
    def analyze_credit_report(self, credit_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Analyze credit report data and identify dispute opportunities
        """
        analysis = {
            "overall_score": self._calculate_credit_health(credit_data),
            "dispute_opportunities": [],
            "priority_actions": [],
            "bureau_targets": [],
            "success_probability": 0.0,
            "estimated_score_improvement": 0,
            "dispute_strategies": [],
            "evidence_required": []
        }
        
        # Analyze each account for disputes
        for account in credit_data.get("accounts", []):
            account_disputes = self._analyze_account(account)
            analysis["dispute_opportunities"].extend(account_disputes)
        
        # Analyze inquiries
        inquiry_disputes = self._analyze_inquiries(credit_data.get("inquiries", []))
        analysis["dispute_opportunities"].extend(inquiry_disputes)
        
        # Analyze public records
        public_record_disputes = self._analyze_public_records(credit_data.get("public_records", []))
        analysis["dispute_opportunities"].extend(public_record_disputes)
        
        # Generate priority actions
        analysis["priority_actions"] = self._generate_priority_actions(analysis["dispute_opportunities"])
        
        # Calculate success probability
        analysis["success_probability"] = self._calculate_success_probability(analysis["dispute_opportunities"])
        
        # Estimate score improvement
        analysis["estimated_score_improvement"] = self._estimate_score_improvement(analysis["dispute_opportunities"])
        
        # Generate dispute strategies
        analysis["dispute_strategies"] = self._generate_dispute_strategies(analysis["dispute_opportunities"])
        
        # Collect required evidence
        analysis["evidence_required"] = self._collect_required_evidence(analysis["dispute_opportunities"])
        
        return analysis
    
    def _calculate_credit_health(self, credit_data: Dict[str, Any]) -> Dict[str, Any]:
        """Calculate overall credit health metrics"""
        scores = credit_data.get("scores", [])
        accounts = credit_data.get("accounts", [])
        
        if not scores:
            return {"status": "unknown", "score": 0, "factors": []}
        
        # Get the most recent score
        latest_score = max(scores, key=lambda x: x.get("date", ""))
        score = latest_score.get("score", 0)
        
        factors = []
        if score < 580:
            status = "poor"
            factors = ["Multiple negative items", "High utilization", "Late payments"]
        elif score < 670:
            status = "fair"
            factors = ["Some negative items", "Moderate utilization"]
        elif score < 740:
            status = "good"
            factors = ["Minor issues", "Good payment history"]
        else:
            status = "excellent"
            factors = ["Clean history", "Low utilization", "Good mix"]
        
        return {
            "status": status,
            "score": score,
            "factors": factors,
            "improvement_potential": "high" if score < 700 else "moderate"
        }
    
    def _analyze_account(self, account: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Analyze individual account for dispute opportunities"""
        disputes = []
        
        # Check for late payment disputes
        if account.get("status") == "Late" and self._is_recent_late_payment(account):
            disputes.append({
                "type": "late_payment_dispute",
                "creditor": account.get("creditor"),
                "account_type": account.get("type"),
                "reason": "Recent late payment may be disputed if payment was made on time",
                "success_probability": 0.75,
                "bureau_targets": ["experian", "equifax", "transunion"],
                "evidence_needed": ["bank_statements", "payment_confirmations"],
                "dispute_letter_template": "late_payment_verification",
                "priority": "high"
            })
        
        # Check for balance disputes
        if account.get("balance", 0) > 0 and self._is_balance_discrepancy(account):
            disputes.append({
                "type": "balance_dispute",
                "creditor": account.get("creditor"),
                "account_type": account.get("type"),
                "reason": "Account balance may be incorrect",
                "success_probability": 0.65,
                "bureau_targets": ["experian", "equifax", "transunion"],
                "evidence_needed": ["account_statements", "payment_records"],
                "dispute_letter_template": "balance_verification",
                "priority": "medium"
            })
        
        # Check for account status disputes
        if account.get("status") == "Closed" and self._should_be_open(account):
            disputes.append({
                "type": "account_status_dispute",
                "creditor": account.get("creditor"),
                "account_type": account.get("type"),
                "reason": "Account should be marked as open",
                "success_probability": 0.70,
                "bureau_targets": ["experian", "equifax", "transunion"],
                "evidence_needed": ["account_statements", "recent_activity"],
                "dispute_letter_template": "account_status_verification",
                "priority": "high"
            })
        
        # Check for credit limit disputes
        if account.get("type") == "Credit Card" and self._is_credit_limit_low(account):
            disputes.append({
                "type": "credit_limit_dispute",
                "creditor": account.get("creditor"),
                "account_type": account.get("type"),
                "reason": "Credit limit may be underreported",
                "success_probability": 0.60,
                "bureau_targets": ["experian", "equifax", "transunion"],
                "evidence_needed": ["credit_limit_letters", "account_statements"],
                "dispute_letter_template": "credit_limit_verification",
                "priority": "medium"
            })
        
        return disputes
    
    def _analyze_inquiries(self, inquiries: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Analyze credit inquiries for dispute opportunities"""
        disputes = []
        
        for inquiry in inquiries:
            # Check for unauthorized inquiries
            if inquiry.get("type") == "Hard Inquiry" and self._is_unauthorized_inquiry(inquiry):
                disputes.append({
                    "type": "unauthorized_inquiry_dispute",
                    "creditor": inquiry.get("creditor"),
                    "date": inquiry.get("date"),
                    "reason": "Hard inquiry may be unauthorized",
                    "success_probability": 0.80,
                    "bureau_targets": ["experian", "equifax", "transunion"],
                    "evidence_needed": ["identity_theft_affidavit", "fraud_alerts"],
                    "dispute_letter_template": "unauthorized_inquiry",
                    "priority": "high"
                })
            
            # Check for duplicate inquiries
            if self._is_duplicate_inquiry(inquiry, inquiries):
                disputes.append({
                    "type": "duplicate_inquiry_dispute",
                    "creditor": inquiry.get("creditor"),
                    "date": inquiry.get("date"),
                    "reason": "Duplicate inquiry within 30-day window",
                    "success_probability": 0.85,
                    "bureau_targets": ["experian", "equifax", "transunion"],
                    "evidence_needed": ["inquiry_documentation"],
                    "dispute_letter_template": "duplicate_inquiry",
                    "priority": "medium"
                })
        
        return disputes
    
    def _analyze_public_records(self, public_records: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Analyze public records for dispute opportunities"""
        disputes = []
        
        for record in public_records:
            # Check for bankruptcy disputes
            if record.get("type") == "Bankruptcy" and self._is_bankruptcy_old(record):
                disputes.append({
                    "type": "bankruptcy_dispute",
                    "record_type": record.get("type"),
                    "date": record.get("date"),
                    "reason": "Bankruptcy may be past reporting limit",
                    "success_probability": 0.90,
                    "bureau_targets": ["experian", "equifax", "transunion"],
                    "evidence_needed": ["bankruptcy_discharge", "date_verification"],
                    "dispute_letter_template": "bankruptcy_removal",
                    "priority": "high"
                })
            
            # Check for tax lien disputes
            if record.get("type") == "Tax Lien" and self._is_tax_lien_paid(record):
                disputes.append({
                    "type": "tax_lien_dispute",
                    "record_type": record.get("type"),
                    "date": record.get("date"),
                    "reason": "Paid tax lien should be removed",
                    "success_probability": 0.85,
                    "bureau_targets": ["experian", "equifax", "transunion"],
                    "evidence_needed": ["lien_release", "payment_verification"],
                    "dispute_letter_template": "tax_lien_removal",
                    "priority": "high"
                })
        
        return disputes
    
    def _generate_priority_actions(self, disputes: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Generate prioritized action plan"""
        # Sort disputes by priority and success probability
        sorted_disputes = sorted(
            disputes,
            key=lambda x: (x.get("priority", "low") == "high", x.get("success_probability", 0)),
            reverse=True
        )
        
        actions = []
        for i, dispute in enumerate(sorted_disputes[:5]):  # Top 5 actions
            actions.append({
                "order": i + 1,
                "action": f"Dispute {dispute['type'].replace('_', ' ').title()}",
                "creditor": dispute.get("creditor"),
                "estimated_impact": "high" if dispute.get("success_probability", 0) > 0.7 else "medium",
                "timeline": "1-2 weeks",
                "bureau_targets": dispute.get("bureau_targets", [])
            })
        
        return actions
    
    def _calculate_success_probability(self, disputes: List[Dict[str, Any]]) -> float:
        """Calculate overall success probability"""
        if not disputes:
            return 0.0
        
        probabilities = [d.get("success_probability", 0) for d in disputes]
        return sum(probabilities) / len(probabilities)
    
    def _estimate_score_improvement(self, disputes: List[Dict[str, Any]]) -> int:
        """Estimate potential score improvement"""
        total_improvement = 0
        
        for dispute in disputes:
            if dispute.get("type") == "late_payment_dispute":
                total_improvement += 15
            elif dispute.get("type") == "balance_dispute":
                total_improvement += 10
            elif dispute.get("type") == "unauthorized_inquiry_dispute":
                total_improvement += 5
            elif dispute.get("type") == "bankruptcy_dispute":
                total_improvement += 50
            elif dispute.get("type") == "tax_lien_dispute":
                total_improvement += 30
        
        return min(total_improvement, 100)  # Cap at 100 points
    
    def _generate_dispute_strategies(self, disputes: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Generate dispute strategies for each opportunity"""
        strategies = []
        
        # Group disputes by type
        dispute_groups = {}
        for dispute in disputes:
            dispute_type = dispute.get("type")
            if dispute_type not in dispute_groups:
                dispute_groups[dispute_type] = []
            dispute_groups[dispute_type].append(dispute)
        
        # Generate strategy for each group
        for dispute_type, dispute_list in dispute_groups.items():
            strategy = {
                "type": dispute_type,
                "count": len(dispute_list),
                "approach": self._get_strategy_approach(dispute_type),
                "timeline": self._get_strategy_timeline(dispute_type),
                "bureau_order": self._get_bureau_order(dispute_type),
                "follow_up_required": dispute_type in ["late_payment_dispute", "balance_dispute"]
            }
            strategies.append(strategy)
        
        return strategies
    
    def _collect_required_evidence(self, disputes: List[Dict[str, Any]]) -> List[str]:
        """Collect all required evidence types"""
        evidence_types = set()
        
        for dispute in disputes:
            evidence_needed = dispute.get("evidence_needed", [])
            evidence_types.update(evidence_needed)
        
        return list(evidence_types)
    
    # Helper methods
    def _is_recent_late_payment(self, account: Dict[str, Any]) -> bool:
        """Check if late payment is recent and disputable"""
        # Implement logic to check if payment was actually late
        return True  # Simplified for demo
    
    def _is_balance_discrepancy(self, account: Dict[str, Any]) -> bool:
        """Check if account balance is incorrect"""
        # Implement logic to verify balance accuracy
        return True  # Simplified for demo
    
    def _should_be_open(self, account: Dict[str, Any]) -> bool:
        """Check if closed account should be open"""
        # Implement logic to verify account status
        return True  # Simplified for demo
    
    def _is_credit_limit_low(self, account: Dict[str, Any]) -> bool:
        """Check if credit limit is underreported"""
        # Implement logic to verify credit limit
        return True  # Simplified for demo
    
    def _is_unauthorized_inquiry(self, inquiry: Dict[str, Any]) -> bool:
        """Check if inquiry was unauthorized"""
        # Implement logic to verify inquiry authorization
        return True  # Simplified for demo
    
    def _is_duplicate_inquiry(self, inquiry: Dict[str, Any], all_inquiries: List[Dict[str, Any]]) -> bool:
        """Check if inquiry is duplicate"""
        # Implement logic to find duplicate inquiries
        return False  # Simplified for demo
    
    def _is_bankruptcy_old(self, record: Dict[str, Any]) -> bool:
        """Check if bankruptcy is past reporting limit"""
        # Implement logic to check bankruptcy age
        return True  # Simplified for demo
    
    def _is_tax_lien_paid(self, record: Dict[str, Any]) -> bool:
        """Check if tax lien was paid"""
        # Implement logic to verify lien payment
        return True  # Simplified for demo
    
    def _get_strategy_approach(self, dispute_type: str) -> str:
        """Get strategy approach for dispute type"""
        approaches = {
            "late_payment_dispute": "Request payment verification with supporting documentation",
            "balance_dispute": "Submit account statements showing correct balance",
            "unauthorized_inquiry_dispute": "File identity theft affidavit and fraud alert",
            "bankruptcy_dispute": "Submit discharge documentation and request removal",
            "tax_lien_dispute": "Submit lien release and payment verification"
        }
        return approaches.get(dispute_type, "Standard dispute process")
    
    def _get_strategy_timeline(self, dispute_type: str) -> str:
        """Get timeline for dispute type"""
        timelines = {
            "late_payment_dispute": "30-45 days",
            "balance_dispute": "30-45 days",
            "unauthorized_inquiry_dispute": "15-30 days",
            "bankruptcy_dispute": "45-60 days",
            "tax_lien_dispute": "30-45 days"
        }
        return timelines.get(dispute_type, "30-45 days")
    
    def _get_bureau_order(self, dispute_type: str) -> List[str]:
        """Get optimal bureau order for dispute type"""
        return ["experian", "equifax", "transunion"]
    
    def _load_dispute_patterns(self) -> Dict[str, Any]:
        """Load dispute pattern recognition data"""
        return {
            "late_payment_indicators": ["current", "30_days", "60_days", "90_days"],
            "balance_discrepancy_threshold": 0.1,  # 10% difference
            "credit_limit_threshold": 0.2,  # 20% underreported
            "inquiry_window_days": 30,
            "bankruptcy_reporting_limit_years": 10,
            "tax_lien_reporting_limit_years": 7
        }
    
    def _load_bureau_contacts(self) -> Dict[str, Any]:
        """Load bureau contact information"""
        return {
            "experian": {
                "dispute_url": "https://www.experian.com/disputes/main.html",
                "phone": "1-888-397-3742",
                "address": "P.O. Box 4500, Allen, TX 75013"
            },
            "equifax": {
                "dispute_url": "https://www.equifax.com/personal/credit-report-services/credit-dispute/",
                "phone": "1-800-685-1111",
                "address": "P.O. Box 740256, Atlanta, GA 30374-0256"
            },
            "transunion": {
                "dispute_url": "https://www.transunion.com/credit-disputes",
                "phone": "1-800-916-8800",
                "address": "P.O. Box 2000, Chester, PA 19016-2000"
            }
        }

