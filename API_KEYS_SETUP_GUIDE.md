# 🔑 Credit Hardar API Keys Setup Guide

This guide will walk you through obtaining API keys for all the credit bureau integrations and Instagram tools to unlock the full power of Credit Hardar.

## 📋 Table of Contents

1. [Credit Bureau APIs](#credit-bureau-apis)
2. [Instagram Business API](#instagram-business-api)
3. [Annual Credit Report API](#annual-credit-report-api)
4. [Environment Variables Setup](#environment-variables-setup)
5. [Testing & Validation](#testing--validation)

---

## 🏦 Credit Bureau APIs

### 1. **Experian API**

#### **Getting Started:**
- **Website:** https://developer.experian.com/
- **Documentation:** https://developer.experian.com/products/consumer-information-solutions
- **Pricing:** Contact for enterprise pricing (typically $0.50-$2.00 per report)

#### **Steps to Get API Key:**
1. Visit [Experian Developer Portal](https://developer.experian.com/)
2. Click "Get Started" or "Sign Up"
3. Create a developer account
4. Complete business verification (requires business license, tax ID)
5. Submit application for Consumer Information Solutions API
6. Wait for approval (1-3 business days)
7. Receive your API credentials:
   - `EXPERIAN_API_KEY`
   - `EXPERIAN_API_SECRET`
   - `EXPERIAN_API_URL`

#### **Required Information:**
- Business license
- Tax ID/EIN
- Business address
- Phone number
- Website URL
- Description of use case
- Expected monthly volume

---

### 2. **Equifax API**

#### **Getting Started:**
- **Website:** https://developer.equifax.com/
- **Documentation:** https://developer.equifax.com/products/credit-report
- **Pricing:** Contact for enterprise pricing

#### **Steps to Get API Key:**
1. Visit [Equifax Developer Portal](https://developer.equifax.com/)
2. Register for a developer account
3. Complete business verification process
4. Apply for Credit Report API access
5. Submit required business documentation
6. Wait for approval (2-5 business days)
7. Receive your API credentials:
   - `EQUIFAX_API_KEY`
   - `EQUIFAX_API_SECRET`
   - `EQUIFAX_API_URL`

#### **Required Information:**
- Business registration documents
- Tax ID/EIN
- Business financial statements
- Compliance documentation (GLBA, FCRA)
- Expected usage patterns

---

### 3. **TransUnion API**

#### **Getting Started:**
- **Website:** https://developer.transunion.com/
- **Documentation:** https://developer.transunion.com/products/credit-report
- **Pricing:** Contact for enterprise pricing

#### **Steps to Get API Key:**
1. Visit [TransUnion Developer Portal](https://developer.transunion.com/)
2. Create developer account
3. Complete business verification
4. Apply for Credit Report API
5. Submit compliance documentation
6. Wait for approval (3-7 business days)
7. Receive your API credentials:
   - `TRANSUNION_API_KEY`
   - `TRANSUNION_API_SECRET`
   - `TRANSUNION_API_URL`

#### **Required Information:**
- Business license
- Tax ID/EIN
- FCRA compliance documentation
- Business insurance certificates
- Expected monthly volume

---

## 📱 Instagram Business API

### **Getting Started:**
- **Website:** https://developers.facebook.com/
- **Documentation:** https://developers.facebook.com/docs/instagram-api
- **Pricing:** Free for basic features, paid for advanced features

#### **Steps to Get API Key:**
1. Visit [Facebook Developers](https://developers.facebook.com/)
2. Create a Facebook Developer account
3. Create a new app (select "Business" type)
4. Add Instagram Basic Display product
5. Configure Instagram Basic Display:
   - Add your Instagram Business account
   - Set up OAuth redirect URLs
   - Configure permissions
6. Get your API credentials:
   - `INSTAGRAM_APP_ID`
   - `INSTAGRAM_APP_SECRET`
   - `INSTAGRAM_ACCESS_TOKEN`

#### **Required Setup:**
- Instagram Business account (not personal)
- Facebook Business Manager account
- Website domain for OAuth redirects
- Privacy policy URL
- Terms of service URL

---

## 📄 Annual Credit Report API

### **Getting Started:**
- **Website:** https://www.annualcreditreport.com/
- **Documentation:** Contact for API documentation
- **Pricing:** Free for consumers, enterprise pricing for businesses

#### **Steps to Get API Access:**
1. Contact Annual Credit Report directly
2. Submit business partnership inquiry
3. Complete compliance review
4. Sign partnership agreement
5. Receive API access:
   - `ANNUAL_CREDIT_REPORT_API_KEY`
   - `ANNUAL_CREDIT_REPORT_API_URL`

#### **Note:**
This API is primarily for consumer access. Business partnerships require special approval and compliance with FCRA regulations.

---

## ⚙️ Environment Variables Setup

### **Create/Update `.env` file:**

```bash
# Credit Bureau APIs
EXPERIAN_API_KEY=your_experian_api_key_here
EXPERIAN_API_SECRET=your_experian_api_secret_here
EXPERIAN_API_URL=https://api.experian.com

EQUIFAX_API_KEY=your_equifax_api_key_here
EQUIFAX_API_SECRET=your_equifax_api_secret_here
EQUIFAX_API_URL=https://api.equifax.com

TRANSUNION_API_KEY=your_transunion_api_key_here
TRANSUNION_API_SECRET=your_transunion_api_secret_here
TRANSUNION_API_URL=https://api.transunion.com

# Annual Credit Report API
ANNUAL_CREDIT_REPORT_API_KEY=your_annual_credit_report_api_key_here
ANNUAL_CREDIT_REPORT_API_URL=https://api.annualcreditreport.com

# Instagram Business API
INSTAGRAM_APP_ID=your_instagram_app_id_here
INSTAGRAM_APP_SECRET=your_instagram_app_secret_here
INSTAGRAM_ACCESS_TOKEN=your_instagram_access_token_here

# Additional APIs (if needed)
LOB_API_KEY=your_lob_api_key_here
CLICK2MAIL_API_KEY=your_click2mail_api_key_here
POSTGRID_API_KEY=your_postgrid_api_key_here
```

### **Security Best Practices:**
1. **Never commit `.env` files to version control**
2. **Use environment-specific files** (`.env.development`, `.env.production`)
3. **Rotate API keys regularly**
4. **Use secret management services** in production (AWS Secrets Manager, Azure Key Vault)
5. **Implement API key encryption** for sensitive data

---

## 🧪 Testing & Validation

### **Test API Connections:**

```bash
# Test Experian API
curl -X POST "https://api.experian.com/v1/test" \
  -H "Authorization: Bearer $EXPERIAN_API_KEY" \
  -H "Content-Type: application/json"

# Test Equifax API
curl -X POST "https://api.equifax.com/v1/test" \
  -H "Authorization: Bearer $EQUIFAX_API_KEY" \
  -H "Content-Type: application/json"

# Test TransUnion API
curl -X POST "https://api.transunion.com/v1/test" \
  -H "Authorization: Bearer $TRANSUNION_API_KEY" \
  -H "Content-Type: application/json"

# Test Instagram API
curl -X GET "https://graph.instagram.com/me?fields=id,username&access_token=$INSTAGRAM_ACCESS_TOKEN"
```

### **Validate in Credit Hardar:**
1. Start the application: `docker compose up`
2. Visit: http://localhost:3000/reports/free-pull
3. Check bureau status in the dashboard
4. Test credit report pulling functionality

---

## 💰 Cost Breakdown

### **Credit Bureau APIs:**
- **Experian:** $0.50 - $2.00 per report
- **Equifax:** $0.75 - $2.50 per report  
- **TransUnion:** $0.60 - $2.25 per report
- **Annual Credit Report:** Free (weekly limit)

### **Instagram Business API:**
- **Basic Features:** Free
- **Advanced Features:** $0.01 - $0.10 per action

### **Monthly Estimates (1000 reports):**
- **Experian:** $500 - $2,000
- **Equifax:** $750 - $2,500
- **TransUnion:** $600 - $2,250
- **Total:** $1,850 - $6,750/month

---

## 🚀 Quick Start Checklist

- [ ] Create Experian developer account
- [ ] Create Equifax developer account  
- [ ] Create TransUnion developer account
- [ ] Set up Instagram Business account
- [ ] Create Facebook Developer app
- [ ] Contact Annual Credit Report for partnership
- [ ] Update `.env` file with all API keys
- [ ] Test API connections
- [ ] Deploy to production with secure key management

---

## 📞 Support & Resources

### **Credit Bureau Support:**
- **Experian:** developer.support@experian.com
- **Equifax:** developer@equifax.com
- **TransUnion:** developer@transunion.com

### **Instagram/Facebook Support:**
- **Facebook Developer Support:** https://developers.facebook.com/support/
- **Instagram API Documentation:** https://developers.facebook.com/docs/instagram-api

### **Compliance Resources:**
- **FCRA Compliance Guide:** https://www.ftc.gov/tips-advice/business-center/guidance/using-consumer-reports-what-employers-need-know
- **GLBA Compliance:** https://www.ftc.gov/tips-advice/business-center/privacy-and-security/gramm-leach-bliley-act

---

## ⚠️ Important Notes

1. **Compliance Requirements:** All credit bureau APIs require FCRA compliance
2. **Business Verification:** Most APIs require business registration and verification
3. **Approval Process:** API access can take 1-7 business days for approval
4. **Rate Limits:** Each API has different rate limits and usage restrictions
5. **Data Security:** Implement proper encryption and security measures for handling sensitive data

---

**Need help with setup?** Contact our support team or refer to the individual API documentation for detailed integration guides.



