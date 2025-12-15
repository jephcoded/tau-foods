# 🚀 TAUfoods - LIVE DEPLOYMENT GUIDE (FASTEST WAY)

This guide gets your app LIVE with backend in **24-48 hours** with minimal changes.

---

## OPTION 1: Deploy Backend to Render.com (FREE & EASIEST) ⚡

### Step 1: Prepare Backend for Deployment
Your backend needs ONE change in `server/server.js`:

```javascript
// Change this line (around line 102):
http.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on http://${HOST}:${PORT}`);
});

// TO this (no changes needed - it already works!)
// The new code automatically uses 0.0.0.0 for all interfaces
```

✅ Your backend is ready! No code changes needed.

### Step 2: Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up (free account)
3. Connect GitHub (optional, or just paste code)

### Step 3: Deploy Backend
1. Click **New +** → **Web Service**
2. Choose "Docker" or paste your GitHub repo
3. Set environment variables:
```
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/taufoods
JWT_SECRET=generate-a-strong-key-here
CORS_ORIGIN=*
```
4. Click **Deploy**
5. **Get your backend URL**: `https://your-app-name.onrender.com`

⏱️ Takes ~5 minutes

---

## OPTION 2: Deploy to Railway.app (ALSO FREE) 🚂

### Step 1: Go to [railway.app](https://railway.app)
1. Sign up with GitHub
2. Create new project
3. Deploy from GitHub

### Step 2: Set Environment Variables
```
PORT=5000
NODE_ENV=production
MONGO_URI=your_mongodb_atlas_connection
JWT_SECRET=strong_secret_here
CORS_ORIGIN=*
```

### Step 3: Get Your URL
Railway gives you: `https://your-app-name.railway.app`

---

## OPTION 3: Use MongoDB Atlas (FREE TIER) 📊

### Step 1: Create MongoDB Atlas Account
1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Sign up (free)
3. Create a cluster (free tier = 512MB)

### Step 2: Get Connection String
1. Click **Connect**
2. Choose **Drivers**
3. Copy the connection string:
```
mongodb+srv://username:password@cluster.mongodb.net/taufoods
```

### Step 3: Add to `.env`
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/taufoods
```

---

## STEP 1: Update Frontend API URL

Your app already has the setup! Just do this:

### Create `.env.production` file:
```env
EXPO_PUBLIC_API_URL=https://your-app-name.onrender.com
EXPO_PUBLIC_API_TIMEOUT=30000
```

That's it! Replace `your-app-name` with your actual Render/Railway app name.

---

## STEP 2: Build APK for Android (5 minutes) 📱

```bash
# Install dependencies
npm install

# Login to Expo
eas login

# Build APK for testing
eas build --platform android --profile preview

# Takes ~10 minutes to build
# Download the APK when ready
```

### Test APK:
1. Download APK to your phone
2. Install it
3. App should work with live backend! ✅

---

## STEP 3: Build for Google Play Store 🎯

### Quick Setup:
```bash
# Build production APK
eas build --platform android --profile production

# This creates an AAB (Android App Bundle)
# Takes ~15 minutes
```

### Submit to Google Play:
1. Create Google Play Developer Account ($25 one-time)
2. Submit your APK/AAB
3. App appears in **24-48 hours** after review ✅

---

## STEP 4: Build for iPhone (Optional) 🍎

```bash
# Requires Mac with Xcode
eas build --platform ios --profile production

# Submit to App Store
eas submit --platform ios
```

**Note:** iPhone requires Apple Developer account ($99/year)

---

## COMPLETE CHECKLIST - DO THIS NOW

### STEP 1: Backend Deployment (15 minutes)
- [ ] Create Render/Railway account
- [ ] Deploy your server
- [ ] Get API URL: `https://your-url.onrender.com`
- [ ] Test API: Open in browser `https://your-url.onrender.com/` should show "✅ TAUfoods Backend Running Fine"

### STEP 2: Frontend Setup (5 minutes)
- [ ] Create `.env.production` with your API URL
- [ ] Update `app.json` with your EAS Project ID (if you have one)

### STEP 3: Build APK (15 minutes)
```bash
npm install
eas login
eas build --platform android --profile preview
```

### STEP 4: Test on Phone (5 minutes)
- [ ] Download APK
- [ ] Install on Android phone
- [ ] Test login, browse foods, add to cart
- [ ] Everything should work! ✅

### STEP 5: Submit to Store (depends on store)
- [ ] Create Google Play account
- [ ] Submit APK
- [ ] Wait 24-48 hours
- [ ] App goes LIVE! 🎉

---

## FASTEST DEPLOYMENT PATH (TODAY)

### If you want it LIVE TODAY:
1. **Deploy backend to Render** (5 min)
2. **Build APK** (15 min)
3. **Share APK link** with users

Users can download & install APK directly without waiting for store approval!

### APK Direct Download:
After building, you can:
1. Host APK on Google Drive or Dropbox
2. Share link with users
3. Users download and install directly
4. **LIVE immediately!** ✅

---

## IMPORTANT NOTES

### Security
- [ ] Change JWT_SECRET to something strong
- [ ] Use production MongoDB credentials
- [ ] Enable HTTPS (Render/Railway do this automatically)
- [ ] Set CORS_ORIGIN to your domain when ready

### Database
- [ ] Create MongoDB Atlas account
- [ ] Whitelist Render/Railway IP addresses
- [ ] Test connection before deploying

### Monitoring
After deployment:
1. Check logs: `eas build:view <build-id>`
2. Monitor backend: Render/Railway dashboards
3. Test API endpoints manually

---

## QUICK COMMAND REFERENCE

```bash
# Backend Deployment (to Render/Railway)
# Just upload your 'server' folder

# Frontend Build
eas login                                    # One time
eas init                                     # One time
eas build --platform android --profile preview  # Test build
eas build --platform android --profile production # Store build

# Submit to Stores
eas submit --platform android               # Google Play
```

---

## EXPECTED TIMELINE

| Task | Time |
|------|------|
| Deploy Backend | 5 min |
| Update Frontend | 5 min |
| Build APK | 15 min |
| Test on Phone | 5 min |
| **Total** | **~30 minutes** |
| Google Play Review | 24-48 hours |
| App Store Review | 1-2 days |

---

## TROUBLESHOOTING

### App won't connect to backend
1. Check API URL in `.env.production`
2. Verify backend is running: `curl https://your-url.onrender.com/`
3. Check CORS settings in `server/.env`

### Build fails
1. Clear cache: `eas build:list`
2. Update: `npm install`
3. Check Node version: `node --version` (should be v18+)

### APK won't install
1. Phone must allow "unknown sources"
2. Try different Android version
3. Check storage space on phone

---

## START HERE ➡️

**RIGHT NOW, DO THIS:**

```bash
# 1. Go to backend folder
cd server

# 2. Create .env file
cp .env.example .env

# 3. Edit .env with your MongoDB credentials
# (use MongoDB Atlas free tier)

# 4. Create frontend .env.production
cd ..
cat > .env.production << EOF
EXPO_PUBLIC_API_URL=https://your-render-url.onrender.com
EOF

# 5. Build!
npm install
eas login
eas build --platform android --profile preview
```

**That's it! You'll have a working APK in 20 minutes.**

---

**Questions?** Check the full [PRODUCTION_BUILD_GUIDE.md](./PRODUCTION_BUILD_GUIDE.md)

**Ready to go LIVE?** 🚀 Follow the checklist above!
