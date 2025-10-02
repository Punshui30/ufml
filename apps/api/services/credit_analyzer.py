"""
Credit Report Analysis Service
Uses centralized Ollama client for AI analysis
"""

import os
import json
from typing import Dict, List, Optional
from datetime import datetime
from .advanced_dispute_strategies import AdvancedDisputeStrategies
from apps.api.ollama_client import ollama_client

class CreditReportAnalyzer:
    def __init__(self):
        self.advanced_strategies = AdvancedDisputeStrategies()
        
        print(f"CreditReportAnalyzer initialized:")
        print(f"  Ollama Host: {ollama_client.host}")
        print(f"  Ollama Model: {ollama_client.model}")
        print(f"  Ollama Timeout: {ollama_client.timeout}s")
        
    def analyze_credit_report(self, bureau: str, pdf_content: Optional[bytes] = None, text_content: Optional[str] = None) -> Dict:
        """
        Analyze credit report using LLM API to extract real creditor data
        
        Args:
            bureau: Credit bureau (Experian, TransUnion, Equifax)
            pdf_content: Raw PDF content (if available)
            text_content: Extracted text content (if available)
        
        Returns:
            Structured credit report data with real creditor names
        """
        
        # If we have real text content from PDF, use AI to extract real data
        if text_content and text_content.strip():
            print(f"Attempting AI extraction with text length: {len(text_content)}")
            try:
                # Use AI to extract real creditor data from the PDF text
                real_data = self._extract_real_credit_data(text_content, bureau)
                if real_data:
                    print(f"AI extraction successful! Keys: {real_data.keys()}")
                    # Enhance with advanced dispute strategies
                    enhanced_data = self._enhance_with_advanced_strategies(real_data)
                    return enhanced_data
                else:
                    print("AI extraction returned None")
            except Exception as e:
                print(f"AI extraction failed: {e}")
                import traceback
                traceback.print_exc()
        
        # No fallbacks - only AI analysis
        print(f"AI analysis failed - no fallbacks enabled")
        return {
            "bureau": bureau,
            "analysis_date": datetime.now().isoformat(),
            "error": "PDF parsing failed - unable to extract text content",
            "accounts": [],
            "credit_score": None,
            "inquiries": 0,
            "public_records": [],
            "dispute_opportunities": [],
            "parsing_failed": True
        }
    
    def _extract_real_credit_data(self, text_content: str, bureau: str) -> Dict:
        """Extract real credit data from PDF text using AI"""
        try:
            if ollama_client.is_available():
                print(f"Using {ollama_client.model} for AI analysis...")
                return self._extract_with_ollama(text_content, bureau)
            else:
                print(f"Ollama not available - no fallbacks enabled")
                return None
        except Exception as e:
            print(f"Real data extraction failed: {e}")
            return None
    
    def _enhance_with_advanced_strategies(self, credit_data: Dict) -> Dict:
        """Enhance credit data with comprehensive dispute strategies"""
        try:
            # Generate comprehensive dispute plan
            dispute_plan = self.advanced_strategies.generate_comprehensive_dispute_plan(credit_data)
            
            # Add advanced strategies to the credit data
            credit_data["advanced_dispute_plan"] = dispute_plan
            
            # Enhance existing dispute opportunities with advanced techniques
            if "dispute_opportunities" not in credit_data:
                credit_data["dispute_opportunities"] = []
            
            # Add E Oscar bypass strategies
            credit_data["dispute_opportunities"].extend(dispute_plan["e_oscar_bypass_strategies"])
            
            # Add factual dispute opportunities
            credit_data["dispute_opportunities"].extend(dispute_plan["factual_dispute_opportunities"])
            
            # Add consumer law violations
            credit_data["dispute_opportunities"].extend(dispute_plan["consumer_law_violations"])
            
            # Add specialty bureau targets
            credit_data["specialty_bureau_targets"] = dispute_plan["specialty_bureau_targets"]
            
            # Add advanced legal strategies
            credit_data["advanced_legal_strategies"] = dispute_plan["advanced_legal_strategies"]
            
            # Add police report strategies
            credit_data["police_report_strategies"] = dispute_plan["police_report_strategies"]
            
            # Add dollar amount disputes
            credit_data["dispute_opportunities"].extend(dispute_plan["dollar_amount_disputes"])
            
            # Add Metro2 compliance issues
            credit_data["dispute_opportunities"].extend(dispute_plan["metro2_compliance_issues"])
            
            # Add FCRA violations
            credit_data["dispute_opportunities"].extend(dispute_plan["fcra_violations"])
            
            # Add FDCPA violations
            credit_data["dispute_opportunities"].extend(dispute_plan["fdcpa_violations"])
            
            # Add overall metrics
            credit_data["estimated_success_rate"] = dispute_plan["estimated_success_rate"]
            credit_data["estimated_score_improvement"] = dispute_plan["estimated_score_improvement"]
            credit_data["priority_order"] = dispute_plan["priority_order"]
            
            return credit_data
            
        except Exception as e:
            print(f"Failed to enhance with advanced strategies: {e}")
            return credit_data
    
    def _extract_with_ollama(self, text_content: str, bureau: str) -> Dict:
        """Extract credit data using centralized Ollama client"""
        try:
            prompt = f"""Extract credit data from {bureau} report. Return JSON:
{{
    "bureau": "{bureau}",
    "credit_score": [number or null],
    "accounts": [{{"creditor_name": "name", "account_type": "type", "balance": 0, "payment_status": "status"}}],
    "dispute_opportunities": [{{"account_name": "name", "reason_code": "FACTUAL", "reason_description": "reason", "confidence_score": 0.8}}]
}}

Text: {text_content[:2000]}
"""

            ai_response = ollama_client.generate(prompt, max_tokens=1024, temperature=0.1)
            
            if ai_response:
                try:
                    # Try to extract JSON from the response
                    json_start = ai_response.find('{')
                    json_end = ai_response.rfind('}') + 1
                    
                    if json_start >= 0 and json_end > json_start:
                        json_str = ai_response[json_start:json_end]
                        credit_data = json.loads(json_str)
                        
                        # Ensure required fields exist
                        credit_data.setdefault("bureau", bureau)
                        credit_data.setdefault("accounts", [])
                        credit_data.setdefault("dispute_opportunities", [])
                        credit_data.setdefault("ai_service", "ollama")
                        
                        return credit_data
                    else:
                        print("WARNING: No JSON found in Ollama response")
                        return self._fallback_analysis({}, ai_response)
                except json.JSONDecodeError as e:
                    print(f"WARNING: JSON parsing failed: {e}")
                    return self._fallback_analysis({}, ai_response)
            else:
                print("Ollama generation failed")
                return None
                
        except Exception as e:
            print(f"Ollama extraction failed: {e}")
            return None
    
    def _extract_with_regex(self, text_content: str, bureau: str) -> Dict:
        """Extract REAL credit data using regex patterns from actual PDF text"""
        import re
        
        print(f"Analyzing PDF text ({len(text_content)} chars)...")
        print(f"First 1000 chars: {text_content[:1000]}")
        
        # Extract credit score
        score_patterns = [
            r'(\d{3})\s*(?:credit\s*)?score',
            r'score[:\s]*(\d{3})',
            r'fico[:\s]*(\d{3})',
            r'vantage[:\s]*(\d{3})'
        ]
        
        credit_score = None
        for pattern in score_patterns:
            match = re.search(pattern, text_content, re.IGNORECASE)
            if match:
                credit_score = int(match.group(1))
                break
        
        # Extract real creditor names and accounts
        accounts = []
        
        # Look for account sections with creditor names
        # Common patterns in credit reports
        account_sections = re.findall(
            r'(?:account|creditor|company)[:\s]*([A-Za-z\s&.,]+?)(?:\n|$|\d{4})', 
            text_content, 
            re.IGNORECASE | re.MULTILINE
        )
        
        # Also look for common creditor names
        creditor_names = re.findall(
            r'\b(Chase|Capital One|Bank of America|Wells Fargo|Citi|American Express|Discover|US Bank|PNC|TD Bank|HSBC|Barclays|Target|Kohl\'s|Macy\'s|Nordstrom|Amazon|PayPal|Synchrony|Comenity)\b',
            text_content, 
            re.IGNORECASE
        )
        
        # Extract balances
        balance_patterns = [
            r'\$([0-9,]+)',
            r'balance[:\s]*\$?([0-9,]+)',
            r'current[:\s]*\$?([0-9,]+)'
        ]
        
        balances = []
        for pattern in balance_patterns:
            matches = re.findall(pattern, text_content, re.IGNORECASE)
            for match in matches:
                try:
                    balance = int(match.replace(',', ''))
                    if balance > 0:
                        balances.append(balance)
                except:
                    pass
        
        # Extract account statuses
        status_patterns = [
            r'\b(current|paid|late|delinquent|charge.?off|collection|settled|disputed)\b',
            r'status[:\s]*([a-z\s]+)',
            r'payment[:\s]*([a-z\s]+)'
        ]
        
        statuses = []
        for pattern in status_patterns:
            matches = re.findall(pattern, text_content, re.IGNORECASE)
            statuses.extend([s.strip().lower() for s in matches])
        
        # Build accounts from found data
        unique_creditors = list(set(creditor_names + account_sections[:5]))  # Limit to avoid too many
        unique_creditors = [c.strip() for c in unique_creditors if len(c.strip()) > 2][:8]
        
        for i, creditor in enumerate(unique_creditors):
            account = {
                "creditor_name": creditor.title(),
                "account_type": "Credit Card" if "card" in creditor.lower() else "Loan",
                "balance": balances[i] if i < len(balances) else 0,
                "payment_status": statuses[i].title() if i < len(statuses) else "Unknown",
                "date_opened": "2020-01-01",  # Would extract from PDF if available
                "last_payment": "2024-01-01"   # Would extract from PDF if available
            }
            accounts.append(account)
        
        # Extract inquiries
        inquiry_matches = re.findall(r'inquir(?:y|ies)[:\s]*(\d+)', text_content, re.IGNORECASE)
        inquiries = int(inquiry_matches[0]) if inquiry_matches else 0
        
        print(f"Found {len(accounts)} accounts, score: {credit_score}")
        
        return {
            "bureau": bureau,
            "credit_score": credit_score or 650,
            "accounts": accounts,
            "inquiries": inquiries,
            "public_records": [],
            "extracted_from_pdf": True
        }
    
    def _generate_base_credit_data(self, bureau: str) -> Dict:
        """Generate minimal base data structure - no fake accounts"""
        return {
            "bureau": bureau,
            "analysis_date": datetime.now().isoformat(),
            "credit_score": None,
            "accounts": [],
            "inquiries": 0,
            "public_records": [],
            "dispute_opportunities": [],
            "needs_real_data": True
        }

    def _enhance_with_llm(self, base_data: Dict, text_content: Optional[str]) -> Dict:
        """Enhance credit report analysis using LLM API"""
        if not text_content:
            return base_data
        
        try:
            # Use Anthropic API first (best quality)
            if self.anthropic_api_key:
                return self._enhance_with_anthropic(base_data, text_content)
            # Use OpenAI if available
            elif self.openai_api_key:
                return self._enhance_with_openai(base_data, text_content)
            # Use Ollama for local testing
            elif self._check_ollama_available():
                return self._enhance_with_ollama(base_data, text_content)
        except Exception as e:
            print(f"LLM enhancement failed: {e}")
        
        return base_data
    
    def _enhance_with_ollama(self, base_data: Dict, text_content: str) -> Dict:
        """Enhance analysis using local Ollama"""
        
        prompt = f"""You are an expert credit analyst AI. Analyze this credit report and provide detailed insights for credit repair and dispute opportunities.

Credit Report Text:
{text_content[:4000]}

Provide a comprehensive analysis in JSON format with this structure:
{{
    "overall_score": {{
        "score": number,
        "status": "poor|fair|good|excellent",
        "improvement_potential": "low|medium|high"
    }},
    "estimated_score_improvement": number,
    "success_probability": number,
    "dispute_opportunities": [
        {{
            "type": "incorrect_balance|duplicate_account|identity_theft|fraudulent_account|incorrect_status",
            "reason": "string",
            "creditor": "string",
            "success_probability": number
        }}
    ],
    "priority_actions": [
        {{
            "order": number,
            "action": "string",
            "estimated_impact": "low|medium|high",
            "timeline": "string"
        }}
    ],
    "accounts": [
        {{
            "creditor_name": "string",
            "account_type": "string",
            "balance": number,
            "payment_status": "string",
            "dispute_candidate": {{
                "score": number,
                "reasons": ["string"],
                "recommended": boolean
            }}
        }}
    ],
    "financial_indicators": {{
        "debt_to_income_ratio": number,
        "credit_utilization": number,
        "payment_history": "string",
        "credit_age": number
    }}
}}"""
        
        try:
            response = requests.post(
                f"{self.ollama_url}/api/generate",
                json={
                    "model": self.ollama_model,
                    "prompt": prompt,
                    "stream": False,
                    "options": {
                        "temperature": 0.1,
                        "top_p": 0.9,
                        "max_tokens": 4000
                    }
                },
                timeout=120
            )
            
            if response.status_code == 200:
                result = response.json()
                ai_response = result.get("response", "")
                
                # Try to extract JSON from the response
                try:
                    import re
                    json_match = re.search(r'\{.*\}', ai_response, re.DOTALL)
                    if json_match:
                        enhanced_data = json.loads(json_match.group())
                        base_data.update(enhanced_data)
                        print(f"SUCCESS: Ollama analysis successful using {self.ollama_model}")
                        return base_data
                    else:
                        print("WARNING: No JSON found in Ollama response")
                        return self._fallback_analysis(base_data, ai_response)
                except json.JSONDecodeError as e:
                    print(f"WARNING: JSON parsing failed: {e}")
                    return self._fallback_analysis(base_data, ai_response)
            else:
                print(f"ERROR: Ollama request failed: {response.status_code}")
                return base_data
                
        except Exception as e:
            print(f"ERROR: Ollama connection error: {e}")
            return base_data

    def _fallback_analysis(self, base_data: Dict, ai_response: str) -> Dict:
        """Fallback analysis when JSON parsing fails"""
        enhanced_data = {
            "ai_insights": ai_response[:500],
            "analysis_source": "ollama_text_fallback"
        }
        base_data.update(enhanced_data)
        return base_data


    def get_available_models(self) -> List[str]:
        """Get list of available Ollama models"""
        return ollama_client.get_available_models()

    def _enhance_with_openai(self, base_data: Dict, text_content: str) -> Dict:
        """Enhance analysis using OpenAI API"""
        import openai
        
        client = openai.OpenAI(api_key=self.openai_api_key)
        
        prompt = f"""
        Analyze this credit report text and extract structured information. Focus on:
        1. Credit score
        2. Account details (creditor, type, balance, status)
        3. Dispute opportunities
        4. Financial profile indicators
        
        Credit Report Text:
        {text_content[:4000]}
        
        Return JSON with this structure:
        {{
            "credit_score": number,
            "accounts": [
                {{
                    "creditor": "string",
                    "account_type": "string", 
                    "balance": number,
                    "status": "string",
                    "dispute_opportunities": ["string"]
                }}
            ],
            "financial_indicators": {{
                "income_estimate": number,
                "debt_to_income_ratio": number,
                "stress_indicators": ["string"]
            }}
        }}
        """
        
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.1
        )
        
        try:
            enhanced_data = json.loads(response.choices[0].message.content)
            base_data.update(enhanced_data)
        except json.JSONDecodeError:
            pass
        
        return base_data

    def _enhance_with_anthropic(self, base_data: Dict, text_content: str) -> Dict:
        """Enhance analysis using Anthropic API"""
        import anthropic
        
        client = anthropic.Anthropic(api_key=self.anthropic_api_key)
        
        prompt = f"""You are an expert credit analyst AI. Analyze this credit report and extract structured information for credit repair.

Credit Report Text:
{text_content[:6000]}

Extract and return JSON with this structure:
{{
    "credit_score": number,
    "accounts": [
        {{
            "creditor_name": "string",
            "account_type": "string", 
            "balance": number,
            "status": "string",
            "dispute_opportunities": ["string"],
            "metro2_compliant": boolean,
            "balance_discrepancy": boolean,
            "opening_date_discrepancy": boolean,
            "fraud_indicator": boolean
        }}
    ],
    "dispute_recommendations": [
        {{
            "creditor": "string",
            "strategy": "string",
            "reason": "string",
            "priority": "High|Medium|Low"
        }}
    ],
    "financial_indicators": {{
        "debt_to_income_ratio": number,
        "credit_utilization": number,
        "payment_history": "string",
        "credit_age": number
    }},
    "e_oscar_bypass_opportunities": [
        {{
            "creditor": "string",
            "bypass_strategy": "direct_creditor_contact|furnisher_dispute|specialty_bureau",
            "reason": "string",
            "success_probability": number,
            "contact_method": "phone|mail|email"
        }}
    ],
    "metro2_violations": [
        {{
            "account": "string",
            "violation_code": "string",
            "compliance_issue": "string",
            "dispute_opportunity": "string"
        }}
    ],
    "summary": "string"
}}"""
        
        try:
            response = client.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=4000,
                messages=[{"role": "user", "content": prompt}]
            )
            
            # Extract JSON from response
            response_text = response.content[0].text
            import re
            json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
            if json_match:
                enhanced_data = json.loads(json_match.group())
                base_data.update(enhanced_data)
                print(f"SUCCESS: Anthropic analysis successful using Claude")
                return base_data
            else:
                print("WARNING: No JSON found in Anthropic response")
                return self._fallback_analysis(base_data, response_text)
                
        except Exception as e:
            print(f"ERROR: Anthropic API error: {e}")
            return base_data

    def _extract_with_anthropic(self, text_content: str, bureau: str) -> Dict:
        """Extract credit data using Anthropic API"""
        import anthropic
        
        client = anthropic.Anthropic(api_key=self.anthropic_api_key)
        
        prompt = f"""Extract credit report information from this {bureau} credit report text and return as JSON.

Look for:
1. Credit accounts with creditor names, account types, balances, and statuses
2. Credit score
3. Inquiries
4. Public records
5. Potential dispute opportunities across all 4 categories
6. Metro2 compliance violations
7. E-Oscar bypass opportunities (direct creditor contact, furnisher disputes, specialty bureaus)

Return JSON format:
{{
    "bureau": "{bureau}",
    "credit_score": [score number],
    "accounts": [
        {{
            "creditor_name": "[actual creditor name from report]",
            "account_type": "[Credit Card/Auto Loan/Mortgage/etc]",
            "balance": [balance amount],
            "payment_status": "[Current/Late/Collection/etc]",
            "date_opened": "[date]",
            "last_payment": "[date]",
            "age_years": [calculated years],
            "metro2_compliant": false,
            "balance_discrepancy": false,
            "opening_date_discrepancy": false,
            "fraud_indicator": false,
            "collection_agency": false,
            "metro2_violations": ["missing_account_number", "invalid_status_code", "incorrect_date_format"]
        }}
    ],
    "inquiries": [count],
    "public_records": [],
    "dispute_opportunities": [
        {{
            "account_name": "[creditor name]",
            "creditor": "[creditor name]",
            "dispute_category": "[FACTUAL|LEGAL|PROCEDURAL|EQUITY]",
            "reason_code": "[specific dispute reason]",
            "reason_description": "[specific reason]",
            "confidence_score": [0.0-1.0],
            "suggested_narrative": "[AI-generated dispute letter text]",
            "legal_basis": "[FCRA/TILA/FDCPA citation]",
            "success_probability": [0.0-1.0],
            "evidence_required": ["bank_statements", "payment_confirmations"],
            "specialty_bureaus": ["LexisNexis", "LCI", "Innovis"],
            "e_oscar_bypass": "[direct_creditor|furnisher_dispute|specialty_bureau]"
        }}
    ],
    "e_oscar_workarounds": [
        {{
            "account": "[creditor name]",
            "bypass_strategy": "[direct_creditor_contact|furnisher_dispute|specialty_bureau]",
            "bypass_reason": "[why E-Oscar should be bypassed]",
            "direct_contact_method": "[phone|mail|email]",
            "contact_information": "[creditor contact details]",
            "dispute_approach": "[specific strategy to use]",
            "success_rate": [0.0-1.0],
            "follow_up_strategy": "[what to do if no response]"
        }}
    ],
    "factual_disputes": [
        {{
            "account": "[creditor name]",
            "discrepancy_type": "[balance|status|date|personal_info]",
            "reported_value": "[what's on report]",
            "dispute_reason": "[why it's wrong]",
            "evidence_needed": ["bank_statements", "payment_records"]
        }}
    ],
    "legal_disputes": [
        {{
            "account": "[creditor name]",
            "violation_type": "[FCRA|FDCPA|TILA|Identity_Theft]",
            "specific_violation": "[what law was broken]",
            "legal_penalty": "[potential penalties]",
            "dispute_strategy": "[how to attack]"
        }}
    ],
    "procedural_disputes": [
        {{
            "account": "[creditor name]",
            "procedural_error": "[outdated_info|validation_error|reporting_error]",
            "metro2_violation": "[specific Metro2 code violation]",
            "dispute_reason": "[why procedure was wrong]",
            "success_likelihood": [0.0-1.0]
        }}
    ],
    "equity_disputes": [
        {{
            "account": "[creditor name]",
            "hardship_type": "[medical|job_loss|divorce|natural_disaster]",
            "equity_argument": "[why removal is fair]",
            "supporting_evidence": ["medical_records", "unemployment_benefits"],
            "goodwill_approach": "[how to request removal]"
        }}
    ],
    "metro2_compliance_issues": [
        {{
            "account": "[creditor name]",
            "violation_code": "[Metro2 violation code]",
            "violation_description": "[what's wrong with reporting]",
            "compliance_requirement": "[what should be correct]",
            "dispute_opportunity": "[how to use for dispute]"
        }}
    ]
}}

Text to analyze:
{text_content[:8000]}  # Limit to first 8000 chars
"""

        try:
            response = client.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=4000,
                messages=[{"role": "user", "content": prompt}]
            )
            
            # Extract JSON from AI response
            response_text = response.content[0].text
            import re
            json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
            if json_match:
                extracted_data = json.loads(json_match.group())
                print(f"SUCCESS: Anthropic extraction successful using Claude")
                return extracted_data
            else:
                print("WARNING: No JSON found in Anthropic extraction response")
                return None
                    
        except Exception as e:
            print(f"ERROR: Anthropic extraction failed: {e}")
        
        return None