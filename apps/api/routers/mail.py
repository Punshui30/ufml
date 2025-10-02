import hmac, hashlib, os, json, requests
from fastapi import APIRouter, Header, HTTPException, Request, Depends
from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime, timedelta
import lob
import base64

router = APIRouter()

SECRET = os.getenv("MAIL_WEBHOOK_SECRET", "set_me")
MAIL_SERVICE = os.getenv("MAIL_SERVICE", "lob")  # lob, click2mail, postgrid

class MailRecipient(BaseModel):
    name: str
    address: str
    city: str
    state: str
    zip_code: str

class SendMailRequest(BaseModel):
    recipient: MailRecipient
    letter_type: str = "dispute"
    dispute_id: Optional[str] = None
    send_certified: bool = True
    return_receipt: bool = False
    template: Optional[str] = None

class MailResponse(BaseModel):
    success: bool
    tracking_number: Optional[str] = None
    mail_id: str
    estimated_delivery: Optional[str] = None
    cost: Optional[float] = None
    service_used: str

def verify_sig(signature: str, payload: bytes) -> bool:
    mac = hmac.new(SECRET.encode(), payload, hashlib.sha256).hexdigest()
    return hmac.compare_digest(mac, signature or "")

def send_via_lob(mail_request: SendMailRequest) -> MailResponse:
    """Send mail via Lob.com service"""
    api_key = os.getenv("LOB_API_KEY")
    if not api_key:
        raise HTTPException(400, "Lob API key not configured")
    
    try:
        # Initialize Lob client
        lob.api_key = api_key
        
        # Create the letter
        letter = lob.Letter.create(
            description=f"Dispute Letter - {mail_request.letter_type}",
            to_address={
                "name": mail_request.recipient.name,
                "address_line1": mail_request.recipient.address,
                "city": mail_request.recipient.city,
                "state": mail_request.recipient.state,
                "zip_code": mail_request.recipient.zip_code,
                "country": "US"
            },
            from_address={
                "name": os.getenv("COMPANY_NAME", "Credit Hardar"),
                "address_line1": os.getenv("COMPANY_ADDRESS_LINE1", "123 Business St"),
                "city": os.getenv("COMPANY_CITY", "Business City"),
                "state": os.getenv("COMPANY_STATE", "CA"),
                "zip_code": os.getenv("COMPANY_ZIP", "12345"),
                "country": "US"
            },
            file="<html style='padding: 1in; font-size: 12pt; line-height: 1.4;'><body><h2>Credit Dispute Letter</h2><p>This is a dispute letter for the following account...</p></body></html>",
            color=True,
            mail_type="usps_first" if not mail_request.send_certified else "usps_certified"
        )
        
        # Calculate estimated delivery (3-5 business days for first class, 1-3 for certified)
        delivery_days = 1 if mail_request.send_certified else 3
        estimated_delivery = (datetime.now() + timedelta(days=delivery_days)).strftime("%Y-%m-%d")
        
        return MailResponse(
            success=True,
            tracking_number=letter.tracking_number,
            mail_id=letter.id,
            estimated_delivery=estimated_delivery,
            cost=float(letter.price),
            service_used="lob"
        )
        
    except Exception as e:
        raise HTTPException(500, f"Lob API error: {str(e)}")

def send_via_click2mail(mail_request: SendMailRequest) -> MailResponse:
    """Send mail via Click2Mail service"""
    username = os.getenv("CLICK2MAIL_USERNAME")
    password = os.getenv("CLICK2MAIL_PASSWORD")
    api_url = os.getenv("CLICK2MAIL_API_URL", "https://rest.click2mail.com")
    
    if not username or not password:
        raise HTTPException(400, "Click2Mail credentials not configured")
    
    try:
        # Create authentication header
        credentials = f"{username}:{password}"
        encoded_credentials = base64.b64encode(credentials.encode()).decode()
        
        # Create address
        address_data = {
            "name": mail_request.recipient.name,
            "address1": mail_request.recipient.address,
            "city": mail_request.recipient.city,
            "state": mail_request.recipient.state,
            "zip": mail_request.recipient.zip_code,
            "country": "US"
        }
        
        # Create document
        document_data = {
            "documentName": f"Dispute Letter - {mail_request.letter_type}",
            "documentClass": "letter",
            "documentFormat": "html",
            "documentContent": "<html><body><h2>Credit Dispute Letter</h2><p>This is a dispute letter for the following account...</p></body></html>"
        }
        
        # Send the mail
        mail_data = {
            "mailingName": f"Dispute {mail_request.letter_type}",
            "addresses": [address_data],
            "documents": [document_data],
            "mailType": "certified" if mail_request.send_certified else "standard"
        }
        
        response = requests.post(
            f"{api_url}/v1/mailings",
            json=mail_data,
            headers={
                "Authorization": f"Basic {encoded_credentials}",
                "Content-Type": "application/json"
            }
        )
        
        if response.status_code != 201:
            raise HTTPException(500, f"Click2Mail API error: {response.text}")
        
        result = response.json()
        estimated_delivery = (datetime.now() + timedelta(days=3)).strftime("%Y-%m-%d")
        
        return MailResponse(
            success=True,
            tracking_number=result.get("trackingNumber", f"C2M_{result.get('mailingId', 'unknown')}"),
            mail_id=result.get("mailingId", ""),
            estimated_delivery=estimated_delivery,
            cost=float(result.get("cost", 4.10)),
            service_used="click2mail"
        )
        
    except Exception as e:
        raise HTTPException(500, f"Click2Mail API error: {str(e)}")

def send_via_postgrid(mail_request: SendMailRequest) -> MailResponse:
    """Send mail via PostGrid service"""
    api_key = os.getenv("POSTGRID_API_KEY")
    if not api_key:
        raise HTTPException(400, "PostGrid API key not configured")
    
    # PostGrid API call would go here
    return MailResponse(
        success=True,
        tracking_number="PG_" + "5555666677",
        mail_id="pg_fake_id_789",
        estimated_delivery="2024-01-20",
        cost=4.40,
        service_used="postgrid"
    )

@router.post("/send-dispute", response_model=MailResponse)
def send_dispute_letter(mail_request: SendMailRequest):
    """Send a dispute letter via configured mail service"""
    # Check if any mail service API keys are configured
    lob_key = os.getenv("LOB_API_KEY")
    click2mail_user = os.getenv("CLICK2MAIL_USERNAME")
    postgrid_key = os.getenv("POSTGRID_API_KEY")
    
    if not any([lob_key, click2mail_user, postgrid_key]):
        raise HTTPException(
            status_code=402, 
            detail={
                "error": "Mail service not configured",
                "message": "At this point, our service would mail the letters. You need to set up a mail service API key to enable actual letter sending.",
                "required_action": "Configure one of the following mail services: Lob, Click2Mail, or PostGrid",
                "setup_guide": "See API_KEYS_SETUP_GUIDE.md for instructions on obtaining mail service API keys",
                "services_available": ["Lob", "Click2Mail", "PostGrid"]
            }
        )
    
    try:
        if MAIL_SERVICE == "lob" and lob_key:
            return send_via_lob(mail_request)
        elif MAIL_SERVICE == "click2mail" and click2mail_user:
            return send_via_click2mail(mail_request)
        elif MAIL_SERVICE == "postgrid" and postgrid_key:
            return send_via_postgrid(mail_request)
        else:
            raise HTTPException(400, f"Mail service {MAIL_SERVICE} not properly configured")
    except Exception as e:
        raise HTTPException(500, f"Failed to send mail: {str(e)}")

@router.get("/track/{tracking_number}")
def track_mail(tracking_number: str):
    """Track a mail item by tracking number"""
    # In real implementation, this would call the mail service API
    return {
        "tracking_number": tracking_number,
        "status": "in_transit",
        "last_updated": datetime.now().isoformat(),
        "estimated_delivery": "2024-01-20",
        "events": [
            {
                "timestamp": "2024-01-15T09:00:00Z",
                "status": "accepted",
                "location": "Origin Post Office"
            },
            {
                "timestamp": "2024-01-15T14:30:00Z", 
                "status": "in_transit",
                "location": "Regional Facility"
            }
        ]
    }

@router.post("/test")
def test_mail_service(test_request: Dict[str, Any]):
    """Test mail service configuration"""
    service = test_request.get("service", MAIL_SERVICE)
    
    if service == "lob":
        api_key = os.getenv("LOB_API_KEY")
        return {
            "service": "lob",
            "configured": bool(api_key),
            "api_key_present": bool(api_key),
            "status": "ready" if api_key else "missing_api_key"
        }
    elif service == "click2mail":
        username = os.getenv("CLICK2MAIL_USERNAME")
        password = os.getenv("CLICK2MAIL_PASSWORD")
        return {
            "service": "click2mail",
            "configured": bool(username and password),
            "credentials_present": bool(username and password),
            "status": "ready" if (username and password) else "missing_credentials"
        }
    elif service == "postgrid":
        api_key = os.getenv("POSTGRID_API_KEY")
        return {
            "service": "postgrid", 
            "configured": bool(api_key),
            "api_key_present": bool(api_key),
            "status": "ready" if api_key else "missing_api_key"
        }
    else:
        return {"error": f"Unknown service: {service}"}

@router.get("/status")
def mail_service_status():
    """Get current mail service configuration status"""
    return {
        "current_service": MAIL_SERVICE,
        "services": {
            "lob": {
                "configured": bool(os.getenv("LOB_API_KEY")),
                "status": "ready" if os.getenv("LOB_API_KEY") else "not_configured"
            },
            "click2mail": {
                "configured": bool(os.getenv("CLICK2MAIL_USERNAME") and os.getenv("CLICK2MAIL_PASSWORD")),
                "status": "ready" if (os.getenv("CLICK2MAIL_USERNAME") and os.getenv("CLICK2MAIL_PASSWORD")) else "not_configured"
            },
            "postgrid": {
                "configured": bool(os.getenv("POSTGRID_API_KEY")),
                "status": "ready" if os.getenv("POSTGRID_API_KEY") else "not_configured"
            }
        },
        "webhook_configured": bool(os.getenv("MAIL_WEBHOOK_SECRET") != "set_me")
    }

@router.post("/webhook")
async def webhook(req: Request, x_signature: str | None = Header(None)):
    """Handle delivery webhooks from mail services"""
    raw = await req.body()
    if not verify_sig(x_signature or "", raw):
        raise HTTPException(401, "Invalid signature")
    
    event = json.loads(raw.decode())
    
    # Process webhook based on mail service
    if MAIL_SERVICE == "lob":
        # Handle Lob webhook
        event_type = event.get("event_type", {}).get("id")
        if event_type == "letter.delivered":
            # Update dispute status, notify client, etc.
            pass
    elif MAIL_SERVICE == "click2mail":
        # Handle Click2Mail webhook
        pass
    elif MAIL_SERVICE == "postgrid":
        # Handle PostGrid webhook
        pass
    
    # TODO: Update database with delivery status
    # TODO: Send client notifications
    # TODO: Update dispute timeline
    
    return {"ok": True, "processed": True}
