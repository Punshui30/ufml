# Credit Hardar Mail Services Setup Guide

Credit Hardar supports multiple mail service providers for sending certified mail and tracking dispute letters. Here's how to configure each service:

## 🏢 Supported Mail Services

### 1. **Lob.com** (Recommended)
**Best for:** High-volume agencies, API integration, tracking

**Setup Steps:**
1. Sign up at [lob.com](https://lob.com)
2. Get your API key from the dashboard
3. Update your `.env` file:
```bash
LOB_API_KEY=live_your_actual_lob_api_key_here
LOB_ENVIRONMENT=live  # or 'test' for testing
```

**Features:**
- ✅ Certified mail with tracking
- ✅ Address verification
- ✅ Postcard and letter sending
- ✅ Delivery confirmation
- ✅ Bulk sending capabilities

### 2. **Click2Mail**
**Best for:** Small to medium agencies, cost-effective

**Setup Steps:**
1. Sign up at [click2mail.com](https://click2mail.com)
2. Get your username and password
3. Update your `.env` file:
```bash
CLICK2MAIL_USERNAME=your_username
CLICK2MAIL_PASSWORD=your_password
CLICK2MAIL_ENVIRONMENT=production  # or 'test'
```

**Features:**
- ✅ USPS certified mail
- ✅ Return receipt options
- ✅ Address validation
- ✅ Cost-effective pricing
- ✅ Tracking numbers

### 3. **PostGrid** (Enterprise)
**Best for:** Large enterprises, international mail

**Setup Steps:**
1. Sign up at [postgrid.com](https://postgrid.com)
2. Get your API key
3. Update your `.env` file:
```bash
POSTGRID_API_KEY=your_postgrid_api_key
POSTGRID_ENVIRONMENT=live  # or 'test'
```

## 🔧 Configuration

### Environment Variables (.env file)
```bash
# Choose your primary mail service
MAIL_SERVICE=lob  # Options: lob, click2mail, postgrid

# Lob Configuration
LOB_API_KEY=live_your_lob_key_here
LOB_ENVIRONMENT=live

# Click2Mail Configuration  
CLICK2MAIL_USERNAME=your_username
CLICK2MAIL_PASSWORD=your_password
CLICK2MAIL_ENVIRONMENT=production

# PostGrid Configuration
POSTGRID_API_KEY=your_postgrid_key
POSTGRID_ENVIRONMENT=live

# Mail Settings
MAIL_FROM_NAME=Credit Hardar Agency
MAIL_FROM_ADDRESS=123 Business St, City, State 12345
MAIL_RETURN_ADDRESS=123 Business St, City, State 12345

# Webhook Settings (for delivery notifications)
MAIL_WEBHOOK_SECRET=your_secure_webhook_secret_here
MAIL_WEBHOOK_URL=https://yourdomain.com/mail/webhook
```

## 📝 API Usage Examples

### Send a Dispute Letter
```javascript
// POST /mail/send-dispute
{
  "recipient": {
    "name": "Experian Consumer Services",
    "address": "P.O. Box 4500, Allen, TX 75013"
  },
  "letter_type": "dispute",
  "dispute_id": "uuid-here",
  "send_certified": true,
  "return_receipt": true
}
```

### Track a Letter
```javascript
// GET /mail/track/{tracking_number}
{
  "tracking_number": "1234567890",
  "status": "delivered",
  "delivered_at": "2024-01-15T10:30:00Z",
  "delivery_confirmation": "signature_received"
}
```

## 🔄 Webhook Setup

### Configure Webhooks for Delivery Notifications

**1. Set your webhook URL in the mail service dashboard:**
- **Lob**: Dashboard → Webhooks → Add endpoint
- **Click2Mail**: Account → API Settings → Webhooks
- **PostGrid**: Dashboard → Settings → Webhooks

**2. Use this endpoint:**
```
https://yourdomain.com/mail/webhook
```

**3. Webhook payload example:**
```json
{
  "event": "letter.delivered",
  "tracking_number": "1234567890",
  "dispute_id": "uuid-here",
  "delivered_at": "2024-01-15T10:30:00Z",
  "recipient_signature": "signature_url"
}
```

## 💰 Pricing Comparison

| Service | Certified Mail | Tracking | Return Receipt | Monthly Fee |
|---------|---------------|----------|----------------|-------------|
| **Lob** | $1.45 | ✅ Free | $2.85 | $0 |
| **Click2Mail** | $1.35 | ✅ Free | $2.75 | $0 |
| **PostGrid** | $1.50 | ✅ Free | $2.90 | $0 |

*Prices as of 2024 - check current pricing on provider websites*

## 🧪 Testing Mode

### Test Your Setup
```bash
# Test Lob
curl -X POST http://localhost:8000/mail/test \
  -H "Content-Type: application/json" \
  -d '{"service": "lob"}'

# Test Click2Mail  
curl -X POST http://localhost:8000/mail/test \
  -H "Content-Type: application/json" \
  -d '{"service": "click2mail"}'
```

## 🔒 Security Best Practices

1. **API Keys**: Store in environment variables, never in code
2. **Webhooks**: Use HMAC verification for webhook security
3. **SSL**: Always use HTTPS for API calls
4. **Rate Limits**: Respect provider rate limits
5. **Logging**: Log all mail transactions for compliance

## 📋 Compliance Requirements

### CROA Compliance
- ✅ Store delivery confirmations for 3+ years
- ✅ Track all dispute letters sent
- ✅ Maintain audit trail of mail activities
- ✅ Provide client access to tracking information

### FCRA Compliance
- ✅ Use certified mail for bureau disputes
- ✅ Maintain delivery receipts
- ✅ Track 30-day response periods
- ✅ Document all correspondence

## 🚀 Quick Start

1. **Choose a service** (we recommend Lob for most agencies)
2. **Sign up and get API credentials**
3. **Update your `.env` file** with the credentials
4. **Restart Credit Hardar**: `docker compose restart`
5. **Test the integration** using the API endpoints
6. **Configure webhooks** for delivery tracking

## 📞 Support

- **Lob Support**: [help.lob.com](https://help.lob.com)
- **Click2Mail Support**: [click2mail.com/support](https://click2mail.com/support)
- **PostGrid Support**: [help.postgrid.com](https://help.postgrid.com)

---

**Need help?** Check the Credit Hardar API docs at `http://localhost:8000/docs` for detailed endpoint documentation.
