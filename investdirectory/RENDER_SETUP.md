# GetTermfi Render Deployment Fix

## ❗ The Problem

Your friend was seeing a black screen because the GetTermfi site **wasn't actually deployed**! The root `render.yaml` only had your backend API and frontend tracker, not the marketing site.

## ✅ What I Fixed

Added the GetTermfi service to your Render blueprint. It will now auto-deploy from the `investdirectory` folder.

## 🚀 What You Need to Do Now

### Step 1: Check Render Dashboard

1. Go to: https://dashboard.render.com/
2. You should see a new service called **"gettermfi"** deploying
3. Wait for it to finish building (takes 3-5 minutes)
4. Check the logs for any errors

### Step 2: Get Your Render URL

Once deployed, you'll get a URL like:
```
https://gettermfi.onrender.com
```

Test this URL first to make sure the site loads properly.

### Step 3: Connect Your Custom Domain

To make `www.gettermfi.com` work:

1. In Render dashboard, click on the **"gettermfi"** service
2. Go to **Settings** > **Custom Domain**
3. Click **"Add Custom Domain"**
4. Enter: `www.gettermfi.com`
5. Render will give you DNS records to add

### Step 4: Update Your DNS

In your domain registrar (GoDaddy, Namecheap, etc.):

Add these DNS records (Render will show you the exact values):

```
Type: CNAME
Name: www
Value: gettermfi.onrender.com
TTL: 3600
```

And for root domain redirection:

```
Type: A
Name: @
Value: [Render's IP address - they'll provide this]
TTL: 3600
```

**DNS changes take 5-60 minutes to propagate.**

### Step 5: Enable HTTPS

Render automatically provides free SSL certificates. Once your domain is connected:

1. Go to **Settings** > **Custom Domain**
2. Click **"Verify DNS Configuration"**
3. Once verified, Render will automatically provision SSL
4. Enable "Redirect HTTP to HTTPS"

## 🔍 Troubleshooting

### If the site still shows a black screen:

1. **Check Browser Console** (F12):
   - Look for errors about CSS not loading
   - Check for JavaScript errors
   - Look for CORS issues

2. **Clear Browser Cache**:
   - Hard refresh: `Cmd + Shift + R` (Mac) or `Ctrl + Shift + R` (Windows)

3. **Check Render Logs**:
   - Go to your service > Logs
   - Look for build or runtime errors

4. **Verify Build Completed**:
   - Look for "Build successful" in logs
   - Make sure `npm run build` completed without errors

### Common Issues:

**Issue: "Cannot find module 'typescript'"**
- Already fixed with `NPM_CONFIG_PRODUCTION=false` (but no longer needed)

**Issue: "Port already in use"**
- Render handles this automatically

**Issue: "CSS not loading"**
- Check that `npm run build` completed successfully
- Verify `.next` folder was generated in build

**Issue: Domain not resolving**
- Wait for DNS propagation (up to 1 hour)
- Verify DNS records are correct
- Try flushing DNS cache: `ipconfig /flushdns` (Windows) or `sudo dscacheutil -flushcache` (Mac)

## 📊 What Your Friend Should See

Once everything is working, they should see:

1. **Blue gradient screen** asking "Who are you?"
2. **Three persona options**: "I'm an Investor", "I'm a GP/Fund Manager", "I'm Part of a Legal Team"
3. After selecting, the **full marketing page** with navigation

## 🔗 Service URLs

After deployment, you'll have:

- **Render URL**: `https://gettermfi.onrender.com` (works immediately)
- **Custom Domain**: `https://www.gettermfi.com` (requires DNS setup)
- **Demo App**: `https://agreement-tracker-frontend.onrender.com/` (your tracker demo)

## ⏱️ Expected Timeline

- ✅ **Now**: Code pushed to GitHub
- 🔄 **3-5 min**: Render auto-deploys the service
- ✅ **5 min**: Render URL works: `gettermfi.onrender.com`
- 🔧 **10 min**: You add custom domain in Render
- 🌐 **20-60 min**: DNS propagates, `www.gettermfi.com` works
- 🔒 **+5 min**: SSL certificate auto-provisions

---

**Total time to live site: ~1 hour** (assuming you set up DNS right away)

The black screen issue will be resolved once the service is deployed! 🎉
