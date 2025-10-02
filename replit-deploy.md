# Deploy Credit Hardar to Replit (100% FREE)

## Why Replit?
- ✅ **Completely FREE** (no credit card ever)
- ✅ **Full-stack support** (frontend + backend)
- ✅ **Built-in database** (PostgreSQL available)
- ✅ **Instant sharing** via public URL
- ✅ **Online IDE** (edit code in browser)

## Step 1: Upload to Replit

1. Go to [replit.com](https://replit.com)
2. Sign up (free, no payment info)
3. Click "Create Repl"
4. Choose "Import from GitHub" 
5. Enter your repo URL or upload files

## Step 2: Configure for Replit

Create `.replit` file:
```toml
run = "cd apps/api && python main.py"
language = "python3"

[nix]
channel = "stable-22_11"

[deployment]
run = ["sh", "-c", "cd apps/api && python main.py"]
```

Create `replit.nix`:
```nix
{ pkgs }: {
  deps = [
    pkgs.python3
    pkgs.python3Packages.pip
    pkgs.nodejs
    pkgs.postgresql
  ];
}
```

## Step 3: Setup Environment

In Replit's "Secrets" tab, add:
```
POSTGRES_USER=replit_user
POSTGRES_PASSWORD=replit_pass
POSTGRES_DB=credithardar
JWT_SECRET=replit_jwt_secret
FERNET_KEY=ZmDfcTF7_60GrrY167zsiPd67pEvs0aGOv2oasOM1Pg=
```

## Step 4: Run and Share

1. Click "Run" in Replit
2. Replit gives you a public URL
3. Share with partners: `https://your-repl.replit.dev`

## Benefits:
- ✅ **Zero setup** for partners
- ✅ **No downloads required**
- ✅ **Works on any device**
- ✅ **Permanent URL** (doesn't change)
- ✅ **Can edit code live** during demos
