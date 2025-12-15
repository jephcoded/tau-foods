# Quick Start - From Expo Go to Production Build

## What Changed?

Your project has been converted from **Expo Go** (development-only) to **Expo Build** (production-ready). Here's what was updated:

### Frontend Changes
✅ Added environment variable support for API URLs  
✅ Updated all hardcoded `192.168.0.101:5000` to use `EXPO_PUBLIC_API_URL`  
✅ Added EAS configuration (`eas.json`)  
✅ Added build scripts to `package.json`  
✅ Updated `app.json` with production metadata  

### Backend Changes
✅ Made CORS configurable via `CORS_ORIGIN` environment variable  
✅ Updated server to listen on `0.0.0.0` (all interfaces) instead of specific IP  
✅ Added production server startup scripts  
✅ Enhanced error logging  

### Configuration Files Added
✅ `.env.example` - Frontend environment template  
✅ `.env.local` - Frontend development settings  
✅ `server/.env.example` - Backend environment template  
✅ `server/.env.development` - Backend development settings  
✅ `eas.json` - EAS Build configuration  
✅ `PRODUCTION_BUILD_GUIDE.md` - Comprehensive guide  

---

## Getting Started in 5 Steps

### Step 1: Install EAS CLI
```bash
npm install -g eas-cli
eas login
```

### Step 2: Configure Environment
Frontend setup:
```bash
cp .env.local .env  # For development
# OR
cp .env.example .env  # For production - update with your domain
```

Backend setup:
```bash
cd server
cp .env.development .env  # For development
# OR
cp .env.example .env  # For production - update credentials
```

### Step 3: Update API URLs
Edit your `.env` file:

**Development** (local testing):
```env
EXPO_PUBLIC_API_URL=http://localhost:5000
```

**Production** (deployed app):
```env
EXPO_PUBLIC_API_URL=https://api.yourdomain.com
```

### Step 4: Initialize EAS Project
```bash
eas init
```

Update `app.json` with your EAS Project ID:
```json
{
  "expo": {
    "extra": {
      "eas": {
        "projectId": "your-project-id-from-eas-init"
      }
    }
  }
}
```

### Step 5: Build!
```bash
# Development build (for testing)
npm run preview

# Production build for Android
npm run build:android

# Production build for iOS
npm run build:ios
```

---

## API URL Configuration Explained

Your app now uses **three levels** of API URL detection (in order of priority):

1. **Constants from app.json** (EAS Build variables)
2. **Environment Variables** (`EXPO_PUBLIC_API_URL`)
3. **Fallback** (`http://localhost:5000`)

This means:
- During development, use `.env.local` with `http://localhost:5000`
- During production, EAS will use your configured API URL
- Changes take effect during the build process, not at runtime

---

## Running Locally

### Backend
```bash
cd server
npm install
npm run dev  # Runs on http://localhost:5000
```

### Frontend
```bash
npm install
npm start

# In Expo Go app:
# iOS: Press 'i' for iOS simulator
# Android: Press 'a' for Android emulator
# Web: Press 'w' for web browser
```

---

## Common Tasks

### Update API URL
1. Edit `.env` file
2. For local testing: restart your app
3. For production: create a new EAS build

### Submit to App Stores
```bash
# Google Play Store
npm run submit:android

# Apple App Store  
npm run submit:ios
```

### Check Build Status
```bash
eas build:list
```

### View Build Logs
```bash
eas build:list  # Get build ID
eas build:view <build-id>
```

---

## Important Security Notes

⚠️ **Never commit `.env` file with real secrets!**
- `.env` is listed in `.gitignore`
- Keep `JWT_SECRET`, database credentials, API keys private
- Regenerate secrets before production deployment

---

## Next Steps

1. **Read** the [PRODUCTION_BUILD_GUIDE.md](./PRODUCTION_BUILD_GUIDE.md) for detailed instructions
2. **Test** your app locally with the new environment variables
3. **Build** your first production build: `eas build --platform android`
4. **Submit** to app stores when ready
5. **Monitor** your app in production

---

## Helpful Commands

```bash
# Frontend
npm run lint               # Check code quality
npm run build             # Build for all platforms
npm run build:android     # Android only
npm run build:ios         # iOS only

# Backend
npm run dev               # Development server
npm start                 # Production server

# EAS
eas build:list           # View all builds
eas submit:android       # Submit to Play Store
eas submit:ios           # Submit to App Store
```

---

**Need help?** Check the [PRODUCTION_BUILD_GUIDE.md](./PRODUCTION_BUILD_GUIDE.md) file for detailed troubleshooting!
