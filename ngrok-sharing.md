# Share Credit Hardar with ngrok (FREE)

## What is ngrok?
Creates secure tunnels to your local server - instant public URLs!

## Step 1: Install ngrok
1. Go to [ngrok.com](https://ngrok.com)
2. Sign up (free)
3. Download and install

## Step 2: Expose Credit Hardar

```bash
# In one terminal, keep Credit Hardar running:
docker compose up

# In another terminal, expose the web app:
ngrok http 3000

# In a third terminal, expose the API:
ngrok http 8000
```

## Step 3: Share Public URLs

ngrok gives you URLs like:
- **Web**: https://abc123.ngrok.io
- **API**: https://def456.ngrok.io/docs

## Benefits:
- ✅ **Instant public URLs**
- ✅ **HTTPS automatically**
- ✅ **Works from anywhere**
- ✅ **Free tier available**
- ✅ **No code changes needed**

## Limitations (Free Tier):
- ⚠️ URLs change each time you restart
- ⚠️ 2-hour session limit
- ⚠️ ngrok branding on pages

## Perfect for:
- Quick demos
- Partner meetings
- Testing with remote users
- Showing work in progress
