# Deploy Credit Hardar to Heroku (FREE)

## Why Heroku?
- ✅ **Free tier** for hobby projects
- ✅ **Docker support** via Container Registry
- ✅ **Add-on ecosystem** (free PostgreSQL, Redis)
- ✅ **Easy scaling**

## Step 1: Install Heroku CLI

Download from: https://devcenter.heroku.com/articles/heroku-cli

## Step 2: Create Heroku Apps

```bash
# Login to Heroku
heroku login

# Create app for API
heroku create credit-hardar-api

# Create app for Web
heroku create credit-hardar-web

# Add free database
heroku addons:create heroku-postgresql:hobby-dev -a credit-hardar-api
heroku addons:create heroku-redis:hobby-dev -a credit-hardar-api
```

## Step 3: Deploy

```bash
# Deploy API
heroku container:push web -a credit-hardar-api
heroku container:release web -a credit-hardar-api

# Deploy Web
heroku container:push web -a credit-hardar-web  
heroku container:release web -a credit-hardar-web
```

## Step 4: Share

You'll get URLs like:
- **API**: https://credit-hardar-api.herokuapp.com/docs
- **Web**: https://credit-hardar-web.herokuapp.com
