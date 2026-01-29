# Quick Deploy to Render - InvestDirectory

Your app is ready to deploy! Here's the fastest way to get it on Render.

## ✅ Build Tested Successfully

The production build works perfectly. All files are configured and ready.

## 🚀 Deploy Now (3 Simple Steps)

### Step 1: Push to GitHub

Your investdirectory folder is already in the agreementtracker git repo. Add and commit it:

```bash
cd /Users/noehorowitz/Documents/GitHub/agreementtracker
git add investdirectory/
git commit -m "Add InvestDirectory Next.js app"
git push origin main
```

### Step 2: Create Web Service on Render

1. Go to **https://dashboard.render.com/**
2. Click **"New +"** → **"Web Service"**
3. Connect your **agreementtracker** GitHub repository

### Step 3: Configure the Service

Fill in these settings:

- **Name:** `investdirectory`
- **Region:** Oregon (US West)
- **Branch:** `main`
- **Root Directory:** `investdirectory` ← **IMPORTANT!**
- **Runtime:** Node
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`
- **Plan:** Free

Click **"Create Web Service"** and you're done!

## 🎯 Your App Will Be Live At:

`https://investdirectory.onrender.com` (or similar)

## 📋 View Contact Form Submissions

After deployment, view logs in Render Dashboard:

1. Go to your service
2. Click **"Logs"** tab
3. Contact submissions will appear formatted:

```
================================================================================
📧 NEW CONTACT FORM SUBMISSION
================================================================================
📅 Timestamp: 2026-01-29T...
👤 Name:      John Doe
📧 Email:     john@example.com
🏢 Company:   Acme Capital
================================================================================
```

## ⚡ Free Tier Notes

- App spins down after 15 min of inactivity
- First request after spin-down takes ~30 seconds
- 750 hours/month runtime included

## 🔄 Auto-Deploy

Every time you push to GitHub, Render will automatically:
1. Pull the latest code
2. Rebuild the app
3. Deploy the updates

## Alternative: Separate Repository

If you prefer a standalone repo for investdirectory:

```bash
cd /Users/noehorowitz/Documents/GitHub/agreementtracker/investdirectory
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_NEW_REPO_URL
git push -u origin main
```

Then deploy without needing the "Root Directory" setting.

---

**That's it!** Your InvestDirectory app is deployment-ready. 🎉
