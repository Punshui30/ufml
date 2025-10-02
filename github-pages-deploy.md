# Deploy Credit Hardar Frontend to GitHub Pages (100% FREE)

## Step 1: Create Static Build

```bash
# From apps/web directory
npm run build
npm run export  # Creates static files
```

## Step 2: Push to GitHub

```bash
# From project root
git init
git add .
git commit -m "Credit Hardar - Static Build"
git remote add origin https://github.com/yourusername/credit-hardar
git push -u origin main
```

## Step 3: Enable GitHub Pages

1. Go to your GitHub repo
2. Settings → Pages
3. Source: Deploy from branch
4. Branch: main
5. Folder: /apps/web/out

## Step 4: Share Frontend

You'll get: `https://yourusername.github.io/credit-hardar`

## For Backend Demo:

**Option A: Keep Local + ngrok**
- Use ngrok for API: `ngrok http 8000`
- Update frontend to point to ngrok API URL

**Option B: Replit (Free Backend)**
- Upload API code to replit.com
- Get free backend URL
- Update frontend to use Replit API

## Benefits:
- ✅ **Completely free**
- ✅ **No credit card required**
- ✅ **Professional GitHub Pages URL**
- ✅ **Fast global CDN**
