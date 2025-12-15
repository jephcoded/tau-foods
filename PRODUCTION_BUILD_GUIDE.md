# TAUfoods - Production Build Guide

This document provides step-by-step instructions to build and deploy your TAUfoods application from Expo Go to production builds.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Frontend Setup](#frontend-setup)
3. [Backend Setup](#backend-setup)
4. [Building for Android](#building-for-android)
5. [Building for iOS](#building-for-ios)
6. [Deploying to Stores](#deploying-to-stores)
7. [Production Environment](#production-environment)

---

## Prerequisites

### Required Tools
- **Node.js** (v18 or higher) - Download from [nodejs.org](https://nodejs.org)
- **npm** or **yarn** - Comes with Node.js
- **Expo CLI** - Install with: `npm install -g eas-cli`
- **Android**: Android Studio and Android SDK
- **iOS**: Xcode (Mac only)

### Accounts Required
- **Expo Account** - Create at [expo.dev](https://expo.dev)
- **Google Play Developer Account** ($25 one-time fee for Android)
- **Apple Developer Account** ($99/year for iOS)

---

## Frontend Setup

### 1. Install Dependencies
```bash
cd c:\Users\DELL\TAUfoods
npm install
```

### 2. Login to Expo
```bash
eas login
```
Enter your Expo credentials when prompted.

### 3. Initialize EAS (First Time Only)
```bash
eas init
```
This will set up your project with Expo Application Services. Make sure to:
- Create a new project or link to existing
- Note your Project ID (update in app.json under `extra.eas.projectId`)

### 4. Update API Configuration
Edit `.env.local` for development or `.env.production` for production:

```env
# Production
EXPO_PUBLIC_API_URL=https://api.yourdomain.com
EXPO_PUBLIC_API_TIMEOUT=30000
```

For local development:
```env
EXPO_PUBLIC_API_URL=http://localhost:5000
```

---

## Backend Setup

### 1. Install Server Dependencies
```bash
cd server
npm install
```

### 2. Create Environment File
Copy `.env.example` to `.env` and configure:

```bash
# Development
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/taufoods
JWT_SECRET=your-secret-key-here-generate-a-strong-one
CORS_ORIGIN=*
```

For production:
```bash
# Production
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/taufoods
JWT_SECRET=your-strong-production-secret
CORS_ORIGIN=https://yourdomain.com
```

### 3. Database Setup
- **Development**: Install MongoDB locally or use MongoDB Atlas
- **Production**: Use MongoDB Atlas (https://www.mongodb.com/cloud/atlas)

### 4. Run Server

Development:
```bash
npm run dev
```

Production:
```bash
npm start
```

---

## Building for Android

### Prerequisites
- Android Studio installed
- API Level 33+ SDK installed

### Step 1: Build APK
```bash
eas build --platform android --profile preview
```

### Step 2: Test
- Download the APK when ready
- Install on Android device to test
- Use `adb install -r app.apk` to install

### Step 3: Production Build
```bash
eas build --platform android --profile production
```

This creates an AAB (Android App Bundle) for Google Play.

---

## Building for iOS

### Prerequisites
- macOS with Xcode installed
- Apple Developer Account
- Provisioning profiles set up in Apple Developer Portal

### Step 1: Build for iOS
```bash
eas build --platform ios --profile preview
```

### Step 2: Test on Simulator
- Install Xcode simulators if needed
- Test the build on simulator

### Step 3: Production Build
```bash
eas build --platform ios --profile production
```

---

## Deploying to Stores

### Google Play Store (Android)

#### Prerequisites
- Google Play Developer Account
- Signing key configuration (first time)

#### Steps
1. Create signed AAB:
```bash
eas build --platform android --profile production
```

2. Submit to Google Play:
```bash
eas submit --platform android
```

3. Login to [Google Play Console](https://play.google.com/console)
4. Review app details, screenshots, privacy policy
5. Submit for review (usually 2-3 hours for review)

### Apple App Store (iOS)

#### Prerequisites
- Apple Developer Account
- App ID created in Apple Developer Portal
- Signing certificates configured

#### Steps
1. Create signed build:
```bash
eas build --platform ios --profile production
```

2. Submit to App Store:
```bash
eas submit --platform ios
```

3. Login to [App Store Connect](https://appstoreconnect.apple.com)
4. Add app information, screenshots, privacy policy
5. Submit for review (usually 1-2 days for review)

---

## Production Environment

### 1. Secure Your Secrets
**Never commit `.env` files with sensitive data!**

Environment variables to keep secure:
- `JWT_SECRET` - Generate strong secret: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- `MONGO_URI` - Use MongoDB Atlas with IP whitelisting
- Firebase keys - Use Firebase security rules

### 2. Database Configuration
```javascript
// Verify MongoDB Atlas is set up with:
- IP whitelist for your server
- Database user with strong password
- Proper indexing on frequently queried fields
```

### 3. CORS Configuration
Update in `.env`:
```
CORS_ORIGIN=https://yourdomain.com
```

This restricts API access to your domain only.

### 4. SSL/HTTPS
- Use Let's Encrypt for free SSL certificates
- Configure your server to redirect HTTP → HTTPS
- Update API_URL to https://yourdomain.com

### 5. File Upload Security
- Limit file sizes (currently 5MB, configurable in `.env`)
- Validate file types on backend
- Store uploads outside web root
- Consider cloud storage (AWS S3, Google Cloud Storage)

### 6. Monitoring
- Set up logging: Winston or Morgan
- Monitor errors: Sentry or LogRocket
- Performance monitoring: New Relic or Datadog

---

## Troubleshooting

### Build Fails
- Clear cache: `eas build:list` and check previous builds
- Update Expo SDK: `expo upgrade`
- Check Node version: `node --version` (should be v18+)

### App Won't Connect to Server
- Verify API_URL is correct
- Check CORS settings in backend
- Test API manually: `curl https://api.yourdomain.com/health`
- Check server logs

### iOS Build Issues
- Ensure Xcode is up to date
- Run `sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer`
- Check provisioning profiles in Apple Developer Portal

### Android Build Issues
- Verify Android SDK is installed correctly
- Check ANDROID_HOME environment variable
- Update Java/JDK if needed

---

## Environment Variables Reference

### Frontend (.env)
```env
EXPO_PUBLIC_API_URL=https://api.yourdomain.com
EXPO_PUBLIC_API_TIMEOUT=30000
EXPO_PUBLIC_FIREBASE_API_KEY=your_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project
EXPO_PUBLIC_APP_VERSION=1.0.0
```

### Backend (.env)
```env
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/taufoods
JWT_SECRET=your_strong_secret_here
CORS_ORIGIN=https://yourdomain.com
MAX_FILE_SIZE=5242880
UPLOAD_DIR=./uploads
```

---

## Quick Reference Commands

```bash
# Frontend
npm run build                  # Build for all platforms
npm run build:android        # Build Android APK
npm run build:ios           # Build iOS app
npm run preview             # Preview build (internal testing)
npm run submit:android      # Submit to Google Play
npm run submit:ios          # Submit to App Store

# Backend
npm run dev                  # Development with auto-reload
npm start                    # Production mode
```

---

## Support & Resources
- [Expo Documentation](https://docs.expo.dev)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [Firebase Setup](https://firebase.google.com)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

---

## Checklist Before Submission

### Android
- [ ] App has internet permission in AndroidManifest.xml
- [ ] Content providers configured for file uploads
- [ ] Privacy policy URL added
- [ ] Screenshots uploaded (minimum 2)
- [ ] App description and keywords added
- [ ] Target API Level 33+

### iOS
- [ ] Privacy policy URL added
- [ ] Screenshots uploaded (minimum 2)
- [ ] App description added
- [ ] Age rating completed
- [ ] Minimum iOS version set to 14.0+
- [ ] Category selected

---

**Good luck with your production release! 🚀**
