# Deploy InvestDirectory to Render

This guide will walk you through deploying your InvestDirectory Next.js app to Render as a web service.

## Prerequisites

- A [Render account](https://render.com/) (free tier works fine)
- Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)

## Option 1: Deploy via Render Dashboard (Recommended)

### Step 1: Push to Git

If you haven't already pushed this project to GitHub:

```bash
cd /Users/noehorowitz/Documents/GitHub/agreementtracker/investdirectory
git init
git add .
git commit -m "Initial commit - InvestDirectory Next.js app"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### Step 2: Connect to Render

1. Go to [https://dashboard.render.com/](https://dashboard.render.com/)
2. Click **"New +"** and select **"Web Service"**
3. Connect your GitHub/GitLab account if you haven't already
4. Select your **investdirectory** repository

### Step 3: Configure the Service

Render will automatically detect your `render.yaml` configuration, but you can also configure manually:

**Manual Configuration:**
- **Name:** investdirectory
- **Region:** Oregon (US West)
- **Branch:** main
- **Root Directory:** (leave empty or set to investdirectory if in monorepo)
- **Runtime:** Node
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`
- **Plan:** Free

### Step 4: Deploy

Click **"Create Web Service"** and Render will:
1. Clone your repository
2. Install dependencies
3. Build your Next.js app
4. Deploy it to a public URL

Your app will be available at: `https://investdirectory.onrender.com` (or similar)

## Option 2: Deploy via Blueprint (render.yaml)

The `render.yaml` file is already configured. Simply:

1. Push your code to GitHub
2. In Render Dashboard, click **"New +"** → **"Blueprint"**
3. Select your repository
4. Render will read the `render.yaml` and deploy automatically

## Option 3: Deploy via Render CLI

```bash
# Install Render CLI
npm install -g @render/cli

# Login to Render
render login

# Deploy from the investdirectory folder
cd /Users/noehorowitz/Documents/GitHub/agreementtracker/investdirectory
render deploy
```

## Environment Variables

The app doesn't require any environment variables by default, but if you want to add any:

1. Go to your service in Render Dashboard
2. Click **"Environment"** tab
3. Add variables as needed

## Checking Logs

To view form submissions and other logs:

1. Go to your service in Render Dashboard
2. Click **"Logs"** tab
3. You'll see the contact form submissions logged here:

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

## Custom Domain (Optional)

To add a custom domain:

1. Go to your service settings
2. Click **"Settings"** → **"Custom Domain"**
3. Add your domain and configure DNS

## Build Cache & Performance

For faster builds, Render automatically caches:
- `node_modules`
- `.next` build output

## Troubleshooting

### Build Fails
- Check that Node version is 20.x (specified in `.node-version`)
- Verify all dependencies are in `package.json`
- Check build logs in Render Dashboard

### App Not Loading
- Verify the Start Command is `npm start`
- Check that the build completed successfully
- Review runtime logs for errors

### Contact Form Not Working
- Check API logs in Render Dashboard
- Verify the `/api/contact` route is deployed
- Test the endpoint directly

## Free Tier Limitations

Render's free tier includes:
- 750 hours/month of runtime
- Apps spin down after 15 minutes of inactivity
- First request after spin-down takes ~30 seconds

To keep it always-on, upgrade to a paid plan ($7/month).

## Update Deployment

To deploy updates:

1. Make your changes locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update app"
   git push
   ```
3. Render auto-deploys on every push (if auto-deploy is enabled)

Or manually trigger a deploy from the Render Dashboard.

## Support

- [Render Documentation](https://render.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- Check logs in Render Dashboard for detailed error messages

---

Your InvestDirectory app is now ready to deploy! 🚀
