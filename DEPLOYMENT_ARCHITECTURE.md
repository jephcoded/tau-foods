# TAUfoods Deployment Architecture

## Current Setup (Before)
```
Your Phone (Expo Go)
     ↓
  Expo Go App
     ↓
  Your Local Backend (192.168.0.101:5000)
```

❌ Problems:
- Only works on your WiFi
- Can't share with others
- No production app

---

## New Setup (After - What You're Getting)
```
┌─────────────────────────────────────────────────────────┐
│                    USERS' PHONES                        │
│  (Downloaded from Google Play Store / Direct APK)       │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ↓ (HTTPS)
        ┌──────────────────────────────┐
        │   TAUfoods Production App     │
        │  (Your built APK/IPA)        │
        └──────────────┬───────────────┘
                       │
                       ↓ (API Calls)
        ┌──────────────────────────────────────┐
        │   Backend Server (Cloud)              │
        │   - Render.com or Railway.app         │
        │   - URL: https://app-name.onrender.com
        └──────────────┬───────────────────────┘
                       │
                       ↓ (Database)
        ┌──────────────────────────────────────┐
        │   MongoDB Atlas (Cloud Database)      │
        │   - Free tier (512MB)                 │
        │   - Automatically backed up           │
        └──────────────────────────────────────┘
```

✅ Benefits:
- Works everywhere (not just WiFi)
- Multiple users can use simultaneously
- App store ready
- Automatic backups
- Scalable

---

## Deployment Timeline

### TODAY (30 minutes)
1. **Render/Railway Deploy Backend** (5 min)
   - Upload your `server/` folder
   - Get URL like: `https://taufoods-api.onrender.com`

2. **Update Frontend** (5 min)
   - Edit `.env.production`
   - Set `EXPO_PUBLIC_API_URL=https://taufoods-api.onrender.com`

3. **Build APK** (15 min)
   - Run: `eas build --platform android --profile preview`
   - Download APK file

4. **Test** (5 min)
   - Install APK on your phone
   - Test login, foods, cart, etc.

### Result: APP WORKS LIVE ✅

---

### TOMORROW (5-30 minutes additional)
1. **Create Google Play Account** ($25 one-time)
2. **Submit APK to Google Play** (immediate)
3. **Wait for Review** (24-48 hours)

### Result: APP IN PLAY STORE 🎉

---

## Cost Breakdown

| Component | Cost | Notes |
|-----------|------|-------|
| Backend (Render) | $0/month | Free tier, then $7+ |
| Database (MongoDB) | $0/month | Free tier: 512MB, then $57+ |
| Google Play Store | $25 | One-time payment |
| Apple App Store | $99/year | If you want iOS (optional) |
| **TOTAL** | **$25+** | One-time to launch |

---

## Folder Structure for Deployment

```
TAUfoods/
├── server/                    ← Deploy this to Render/Railway
│   ├── server.js
│   ├── package.json
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   └── .env                   ← Add MongoDB credentials here
│
├── app/                       ← Build this into APK
├── components/
├── assets/
├── .env.production            ← Add backend URL here
├── app.json
└── package.json
```

---

## Command Quick Reference

```bash
# 1. Deploy Backend
cd server
npm install
npm start
# (then deploy folder to Render/Railway)

# 2. Build App
npm install
eas login
eas build --platform android --profile preview

# 3. Submit to Store
eas submit --platform android
```

---

## What Happens When User Downloads from Play Store

```
┌─────────────────────────────────────────┐
│  User Opens Google Play Store           │
└────────────────┬────────────────────────┘
                 │
    ┌────────────▼────────────┐
    │  Finds "TAUfoods" App   │
    │  (Your app!)            │
    └────────────┬────────────┘
                 │
    ┌────────────▼────────────┐
    │  Clicks "Install"       │
    └────────────┬────────────┘
                 │
    ┌────────────▼──────────────────┐
    │  Downloads APK (~50-100MB)    │
    └────────────┬──────────────────┘
                 │
    ┌────────────▼─────────────────┐
    │  Installs on Phone            │
    └────────────┬─────────────────┘
                 │
    ┌────────────▼──────────────────────┐
    │  App Opens & Connects to Backend  │
    │  - Loads food items              │
    │  - Enables login                 │
    │  - All features work!            │
    └───────────────────────────────────┘
```

---

## Environment Variables Explained

### `.env.production` (Frontend)
```env
EXPO_PUBLIC_API_URL=https://app-name.onrender.com
```
**This tells your app WHERE the backend is**

### `server/.env` (Backend)
```env
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/taufoods
JWT_SECRET=strong_key
CORS_ORIGIN=*
```
**These tell the backend HOW to connect to database**

---

## Key Steps Summary

| Step | Action | Time | Notes |
|------|--------|------|-------|
| 1 | Deploy backend to Render | 5 min | Get API URL |
| 2 | Update `.env.production` | 2 min | Add API URL |
| 3 | Build APK | 15 min | `eas build --platform android` |
| 4 | Test APK | 5 min | Install & test on phone |
| 5 | Submit to Play Store | 5 min | Wait 24-48 hours |
| **Total** | **LIVE** | **32 min** | **App works everywhere!** |

---

## Security Checklist

Before going live:
- [ ] JWT_SECRET is random/strong (not "test123")
- [ ] MongoDB password is strong (not default)
- [ ] API credentials not in code (use .env files)
- [ ] CORS_ORIGIN is set correctly
- [ ] HTTPS is enabled (Render/Railway do this)
- [ ] Database IP whitelist updated

---

## After Launch Support

### Monitor Your App
- Check Render/Railway logs for errors
- Monitor MongoDB usage (512MB free limit)
- Track user feedback

### Scale as Needed
- Add more backend resources on Render
- Upgrade MongoDB if approaching limit
- Add more servers if traffic increases

---

## Emergency Contacts

If something breaks:
1. **App won't connect** → Check backend is running on Render
2. **Slow loading** → Check MongoDB connection
3. **Crashes** → Check logs on Render/Railway dashboard
4. **Users can't login** → Check JWT_SECRET matches both sides

---

**READY? Let's launch! 🚀**

See [DEPLOY_NOW.md](./DEPLOY_NOW.md) for step-by-step instructions.
