# Share Credit Hardar on Local Network (100% FREE)

## Perfect for: 
- Office demos
- Same WiFi network
- Quick partner meetings
- No deployment needed

## Step 1: Find Your IP Address

```powershell
# Run this command:
ipconfig

# Look for "IPv4 Address" under your network adapter
# Usually looks like: 192.168.1.100 or 10.0.0.50
```

## Step 2: Update CORS Settings

Edit your `.env` file:
```bash
# Add your IP to CORS origins
CORS_ORIGINS=http://localhost:3000,http://192.168.1.100:3000
```

## Step 3: Restart Credit Hardar

```bash
docker compose restart
```

## Step 4: Share with Partners

**Give them these URLs:**
- **Website**: http://192.168.1.100:3000
- **API Docs**: http://192.168.1.100:8000/docs

## Requirements:
- Partners must be on same WiFi/network
- Your computer must stay running during demo
- Works great for office meetings!

## Pro Tips:
- Test the URLs yourself first
- Make sure Windows Firewall allows the ports
- Consider using your computer's hostname instead of IP
