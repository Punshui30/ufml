import os
import json
import requests
from typing import Dict, Any, List, Optional
from datetime import datetime
import logging
from urllib.parse import urlencode, parse_qs

logger = logging.getLogger(__name__)

class PortalIntegrationService:
    """Service for integrating with credit monitoring portals via OAuth/iframe"""
    
    def __init__(self):
        self.portal_configs = {
            "credit_karma": {
                "name": "Credit Karma",
                "oauth_url": "https://www.creditkarma.com/auth/oauth/authorize",
                "token_url": "https://www.creditkarma.com/auth/oauth/token",
                "api_base": "https://www.creditkarma.com/api/v1",
                "scopes": ["credit_report", "credit_score", "account_info"],
                "client_id": os.getenv("CREDIT_KARMA_CLIENT_ID"),
                "redirect_uri": f"{os.getenv('BASE_URL')}/api/auth/credit-karma/callback"
            },
            "experian": {
                "name": "Experian",
                "oauth_url": "https://www.experian.com/oauth/authorize",
                "token_url": "https://www.experian.com/oauth/token",
                "api_base": "https://www.experian.com/api/v1",
                "scopes": ["credit_report", "credit_score"],
                "client_id": os.getenv("EXPERIAN_CLIENT_ID"),
                "redirect_uri": f"{os.getenv('BASE_URL')}/api/auth/experian/callback"
            },
            "myfico": {
                "name": "MyFico",
                "oauth_url": "https://www.myfico.com/oauth/authorize",
                "token_url": "https://www.myfico.com/oauth/token",
                "api_base": "https://www.myfico.com/api/v1",
                "scopes": ["credit_report", "fico_score"],
                "client_id": os.getenv("MYFICO_CLIENT_ID"),
                "redirect_uri": f"{os.getenv('BASE_URL')}/api/auth/myfico/callback"
            },
            "annual_credit_report": {
                "name": "Annual Credit Report",
                "iframe_url": "https://www.annualcreditreport.com",
                "extraction_script": "extract_annual_credit_data",
                "type": "iframe"
            }
        }
    
    async def get_available_portals(self) -> List[Dict[str, Any]]:
        """Get list of available credit portals for integration"""
        portals = []
        
        for portal_id, config in self.portal_configs.items():
            portal_info = {
                "id": portal_id,
                "name": config["name"],
                "type": config.get("type", "oauth"),
                "available": True,
                "features": config.get("scopes", ["credit_report"]),
                "auth_url": self._get_auth_url(portal_id) if config.get("type") != "iframe" else None,
                "iframe_url": config.get("iframe_url") if config.get("type") == "iframe" else None
            }
            portals.append(portal_info)
        
        return portals
    
    def _get_auth_url(self, portal_id: str) -> str:
        """Generate OAuth authorization URL for portal"""
        config = self.portal_configs.get(portal_id)
        if not config:
            raise ValueError(f"Portal {portal_id} not configured")
        
        params = {
            "client_id": config["client_id"],
            "redirect_uri": config["redirect_uri"],
            "response_type": "code",
            "scope": " ".join(config["scopes"]),
            "state": f"{portal_id}_{datetime.now().timestamp()}"
        }
        
        return f"{config['oauth_url']}?{urlencode(params)}"
    
    async def handle_oauth_callback(self, portal_id: str, code: str, state: str) -> Dict[str, Any]:
        """Handle OAuth callback and exchange code for access token"""
        config = self.portal_configs.get(portal_id)
        if not config:
            raise ValueError(f"Portal {portal_id} not configured")
        
        try:
            # Exchange authorization code for access token
            token_data = {
                "grant_type": "authorization_code",
                "code": code,
                "redirect_uri": config["redirect_uri"],
                "client_id": config["client_id"],
                "client_secret": os.getenv(f"{portal_id.upper()}_CLIENT_SECRET")
            }
            
            response = requests.post(config["token_url"], data=token_data, timeout=30)
            
            if response.status_code == 200:
                token_info = response.json()
                access_token = token_info.get("access_token")
                
                # Use access token to fetch credit data
                credit_data = await self._fetch_portal_data(portal_id, access_token)
                
                return {
                    "success": True,
                    "portal": portal_id,
                    "access_token": access_token,
                    "credit_data": credit_data,
                    "timestamp": datetime.now().isoformat()
                }
            else:
                raise Exception(f"Token exchange failed: {response.status_code}")
                
        except Exception as e:
            logger.error(f"OAuth callback error for {portal_id}: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "portal": portal_id
            }
    
    async def _fetch_portal_data(self, portal_id: str, access_token: str) -> Dict[str, Any]:
        """Fetch credit data from portal using access token"""
        config = self.portal_configs[portal_id]
        
        try:
            headers = {
                "Authorization": f"Bearer {access_token}",
                "Content-Type": "application/json"
            }
            
            # Fetch credit report
            report_response = requests.get(
                f"{config['api_base']}/credit-report",
                headers=headers,
                timeout=30
            )
            
            if report_response.status_code == 200:
                report_data = report_response.json()
                
                # Fetch credit scores
                scores_response = requests.get(
                    f"{config['api_base']}/credit-scores",
                    headers=headers,
                    timeout=30
                )
                
                scores_data = scores_response.json() if scores_response.status_code == 200 else {}
                
                return self._parse_portal_data(portal_id, report_data, scores_data)
            else:
                raise Exception(f"Failed to fetch data: {report_response.status_code}")
                
        except Exception as e:
            logger.error(f"Error fetching data from {portal_id}: {str(e)}")
            raise
    
    def _parse_portal_data(self, portal_id: str, report_data: Dict, scores_data: Dict) -> Dict[str, Any]:
        """Parse credit data from different portals into standardized format"""
        
        if portal_id == "credit_karma":
            return self._parse_credit_karma_data(report_data, scores_data)
        elif portal_id == "experian":
            return self._parse_experian_data(report_data, scores_data)
        elif portal_id == "myfico":
            return self._parse_myfico_data(report_data, scores_data)
        else:
            return self._parse_generic_data(report_data, scores_data)
    
    def _parse_credit_karma_data(self, report_data: Dict, scores_data: Dict) -> Dict[str, Any]:
        """Parse Credit Karma specific data format"""
        accounts = []
        for account in report_data.get("accounts", []):
            accounts.append({
                "creditor_name": account.get("creditorName", ""),
                "account_type": account.get("accountType", ""),
                "balance": float(account.get("balance", 0)),
                "credit_limit": float(account.get("creditLimit", 0)),
                "payment_status": account.get("paymentStatus", ""),
                "date_opened": account.get("dateOpened", ""),
                "last_payment": account.get("lastPayment", ""),
                "dispute_candidate": self._assess_dispute_potential(account)
            })
        
        return {
            "source": "credit_karma",
            "credit_scores": {
                "transunion": scores_data.get("transunion", {}).get("score"),
                "equifax": scores_data.get("equifax", {}).get("score")
            },
            "accounts": accounts,
            "inquiries": report_data.get("inquiries", []),
            "public_records": report_data.get("publicRecords", []),
            "dispute_opportunities": self._identify_dispute_opportunities(accounts)
        }
    
    def _parse_experian_data(self, report_data: Dict, scores_data: Dict) -> Dict[str, Any]:
        """Parse Experian specific data format"""
        accounts = []
        for account in report_data.get("tradelines", []):
            accounts.append({
                "creditor_name": account.get("creditorName", ""),
                "account_type": account.get("accountType", ""),
                "balance": float(account.get("currentBalance", 0)),
                "credit_limit": float(account.get("creditLimit", 0)),
                "payment_status": account.get("paymentStatus", ""),
                "date_opened": account.get("dateOpened", ""),
                "last_payment": account.get("lastPaymentDate", ""),
                "dispute_candidate": self._assess_dispute_potential(account)
            })
        
        return {
            "source": "experian",
            "credit_scores": {
                "experian": scores_data.get("experian", {}).get("score")
            },
            "accounts": accounts,
            "inquiries": report_data.get("inquiries", []),
            "public_records": report_data.get("publicRecords", []),
            "dispute_opportunities": self._identify_dispute_opportunities(accounts)
        }
    
    def _parse_myfico_data(self, report_data: Dict, scores_data: Dict) -> Dict[str, Any]:
        """Parse MyFico specific data format"""
        accounts = []
        for account in report_data.get("creditAccounts", []):
            accounts.append({
                "creditor_name": account.get("creditorName", ""),
                "account_type": account.get("accountType", ""),
                "balance": float(account.get("balance", 0)),
                "credit_limit": float(account.get("creditLimit", 0)),
                "payment_status": account.get("status", ""),
                "date_opened": account.get("openDate", ""),
                "last_payment": account.get("lastPaymentDate", ""),
                "dispute_candidate": self._assess_dispute_potential(account)
            })
        
        return {
            "source": "myfico",
            "credit_scores": {
                "fico_8": scores_data.get("fico8", {}).get("score"),
                "fico_9": scores_data.get("fico9", {}).get("score")
            },
            "accounts": accounts,
            "inquiries": report_data.get("inquiries", []),
            "public_records": report_data.get("publicRecords", []),
            "dispute_opportunities": self._identify_dispute_opportunities(accounts)
        }
    
    def _parse_generic_data(self, report_data: Dict, scores_data: Dict) -> Dict[str, Any]:
        """Parse generic credit data format"""
        return {
            "source": "generic_portal",
            "credit_scores": scores_data,
            "accounts": report_data.get("accounts", []),
            "inquiries": report_data.get("inquiries", []),
            "public_records": report_data.get("publicRecords", []),
            "dispute_opportunities": []
        }
    
    def _assess_dispute_potential(self, account: Dict) -> Dict[str, Any]:
        """Assess if an account is a good candidate for dispute"""
        dispute_score = 0
        reasons = []
        
        # Check for common dispute indicators
        if account.get("paymentStatus") in ["Late", "Collection", "Charge-off"]:
            dispute_score += 3
            reasons.append("Negative payment status")
        
        if account.get("balance", 0) > account.get("creditLimit", 0) * 0.9:
            dispute_score += 2
            reasons.append("High utilization")
        
        if "collection" in account.get("creditorName", "").lower():
            dispute_score += 4
            reasons.append("Collection account")
        
        return {
            "score": dispute_score,
            "reasons": reasons,
            "recommended": dispute_score >= 3
        }
    
    def _identify_dispute_opportunities(self, accounts: List[Dict]) -> List[Dict[str, Any]]:
        """Identify accounts that are good candidates for disputes"""
        opportunities = []
        
        for account in accounts:
            if account.get("dispute_candidate", {}).get("recommended"):
                opportunities.append({
                    "account": account.get("creditor_name"),
                    "type": account.get("account_type"),
                    "dispute_reasons": account.get("dispute_candidate", {}).get("reasons", []),
                    "success_probability": min(0.9, 0.5 + (account.get("dispute_candidate", {}).get("score", 0) * 0.1)),
                    "estimated_impact": "High" if account.get("dispute_candidate", {}).get("score", 0) >= 4 else "Medium"
                })
        
        return opportunities

    async def handle_iframe_integration(self, portal_id: str, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """Handle iframe-based portal integration (like Annual Credit Report)"""
        if portal_id == "annual_credit_report":
            return await self._handle_annual_credit_report(user_data)
        
        return {"success": False, "error": f"Iframe integration not supported for {portal_id}"}
    
    async def _handle_annual_credit_report(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """Handle Annual Credit Report iframe integration"""
        return {
            "success": True,
            "portal": "annual_credit_report",
            "iframe_url": "https://www.annualcreditreport.com",
            "instructions": {
                "step1": "Enter your personal information on the Annual Credit Report site",
                "step2": "Download your free credit reports from all three bureaus",
                "step3": "Upload the PDF reports to Credit Hardar for AI analysis"
            },
            "extraction_ready": True
        }

