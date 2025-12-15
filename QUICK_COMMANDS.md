# 🚀 TAUfoods - Quick Command Reference

## 📋 Deployment Checklist

```bash
# 1. Deploy Backend (Choose ONE)
# Option A: Vercel (Fastest)
vercel --prod --token $VERCEL_TOKEN

# Option B: Heroku
git push heroku main

# Option C: Railway
# → Use web interface at railway.app

# Option D: Docker
docker-compose up -d

# 2. Get Backend URL
# → From deployment platform (e.g., https://app.vercel.app)

# 3. Update Frontend
# Edit: .env
# Set: EXPO_PUBLIC_API_URL=YOUR_BACKEND_URL

# 4. Build Android APK
eas login
eas build --platform android --profile preview

# 5. Test
# → Install APK on phone
# → Test all features

# 6. Submit to Play Store
eas submit --platform android

# 7. Wait for approval (24-48 hours)
# → App appears in Play Store! 🎉
```

---

## 🔧 Development Commands

```bash
# Install dependencies
npm install
cd server && npm install && cd ..

# Run backend locally
cd server
npm run dev      # Development (auto-reload)
npm start        # Production mode

# Run frontend locally
npm start        # Start Expo
# Press 'i' for iOS simulator
# Press 'a' for Android emulator
# Press 'w' for web browser

# Run full stack with Docker
docker-compose up -d
# Backend: http://localhost:5000
# MongoDB: http://localhost:27017

# Stop Docker
docker-compose down
```

---

## 🏗️ Build Commands

```bash
# Setup
eas login
eas init

# Build for Testing
eas build --platform android --profile preview

# Build for Production
eas build --platform android --profile production
eas build --platform ios --profile production

# Check Build Status
eas build:list
eas build:view <build-id>

# Submit to Stores
eas submit --platform android     # Google Play
eas submit --platform ios         # Apple App Store

# View Submission Status
eas submit:list
```

---

## 📁 File Management

```bash
# View file structure
tree -L 2
# or on Windows:
tree /F

# Create .env from example
cp .env.example .env              # Mac/Linux
copy .env.example .env            # Windows

# Create backend .env
cp server/.env.example server/.env

# Check environment variables
echo $EXPO_PUBLIC_API_URL         # Mac/Linux
echo %EXPO_PUBLIC_API_URL%        # Windows

# List all deployment files
ls -la *.json *.yml *.md          # Mac/Linux
dir *.json *.yml *.md             # Windows
```

---

## 🧪 Testing Commands

```bash
# Test backend API (locally)
curl http://localhost:5000

# Test backend API (production)
curl https://your-api-url.com

# Test database connection
mongo "mongodb+srv://user:pass@cluster/taufoods"

# Lint code
npm run lint

# Check for errors
npm run build
```

---

## 🔒 Security Commands

```bash
# Generate strong JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Check environment variables are not in code
grep -r "192.168.0.101" ./app
grep -r "localhost:5000" ./app

# Verify .env files are in .gitignore
cat .gitignore | grep ".env"

# Ensure no API keys in git history
git log -p | grep "MONGO_URI"
```

---

## 📊 Monitoring Commands

```bash
# View backend logs (Vercel)
vercel logs

# View backend logs (Heroku)
heroku logs --tail

# View Docker logs
docker logs <container-id>
docker-compose logs -f

# Monitor database
mongo "mongodb+srv://user:pass@cluster/taufoods"

# View app size
du -sh ./app
du -sh ./server

# Check all dependencies
npm list --depth=0
cd server && npm list --depth=0
```

---

## 🔄 Updates & Maintenance

```bash
# Update packages
npm update
npm update -g eas-cli

# Check for outdated packages
npm outdated

# Clean cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Reset Expo project
npm run reset-project
```

---

## 🐛 Troubleshooting Commands

```bash
# Clear Metro bundler cache
watchman watch-del-all

# Clear Expo cache
expo export --clear

# Clear Node cache
npm cache clean --force

# Reset permissions
sudo chown -R $USER ~/.npm

# Check port in use
lsof -i :5000               # Mac/Linux
netstat -ano | findstr :5000 # Windows

# Kill process on port
kill -9 <PID>               # Mac/Linux
taskkill /PID <PID> /F      # Windows
```

---

## 📝 Git Commands

```bash
# Add files
git add .

# Commit
git commit -m "Deploy production build"

# Push to GitHub
git push origin main

# Push to Heroku
git push heroku main

# View commit history
git log --oneline

# Undo last commit
git reset --soft HEAD~1

# Check status
git status
```

---

## 🚨 Emergency Commands

```bash
# Stop all Docker containers
docker stop $(docker ps -q)

# Remove all stopped containers
docker container prune -f

# Hard reset project
git reset --hard HEAD~1

# Rebuild from scratch
rm -rf node_modules .expo dist build
npm install
eas build --platform android --profile preview --no-cache

# Check disk space
df -h                       # Mac/Linux
wmic logicaldisk get size,freespace # Windows
```

---

## 📞 Help Commands

```bash
# Expo help
eas --help
eas build --help

# NPM help
npm help
npm run                     # List all scripts

# Node version
node --version

# NPM version
npm --version

# Check if tools installed
command -v node npm eas    # Mac/Linux
where node npm eas         # Windows
```

---

## 🎯 One-Line Deploy Scripts

```bash
# Complete setup and build (Windows)
npm install && cd server && npm install && cd .. && eas login && eas build --platform android --profile preview

# Complete setup and build (Mac/Linux)
npm install && cd server && npm install && cd .. && eas login && eas build --platform android --profile preview

# Deploy backend + build app (Vercel)
vercel --prod && npm install && eas build --platform android

# Full Docker deployment
docker-compose up -d && docker-compose logs -f

# Setup + Deploy + Build
npm install && cd server && npm install && cd .. && npm start & npm run build:android
```

---

## 📌 Important URLs

```
# EAS
https://eas.expo.dev

# Vercel
https://vercel.com

# Heroku
https://www.heroku.com

# Railway
https://railway.app

# MongoDB Atlas
https://www.mongodb.com/cloud/atlas

# Google Play Console
https://play.google.com/console

# Apple App Store Connect
https://appstoreconnect.apple.com

# Expo Docs
https://docs.expo.dev

# Firebase Console
https://console.firebase.google.com
```

---

## 🔑 Environment Variables Quick Set

```bash
# Add to .env
EXPO_PUBLIC_API_URL=https://your-backend.vercel.app
EXPO_PUBLIC_API_TIMEOUT=30000

# Add to server/.env
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb+srv://user:pass@cluster/taufoods
JWT_SECRET=your_strong_key_here
CORS_ORIGIN=*
```

---

## ✅ Pre-Deployment Checklist

```bash
# Run these before deploying
npm run lint                    # Check code quality
npm list                        # Check dependencies
git status                      # Check uncommitted changes
npm test                        # Run tests (if available)
curl http://localhost:5000      # Test local backend
cat .env | grep MONGO_URI       # Verify config
```

---

## 🎉 Success Commands

```bash
# After app is live
echo "🎉 TAUfoods is now live!"
echo "Check Google Play: https://play.google.com/store"

# View live app URL
echo $EXPO_PUBLIC_API_URL

# Monitor live app
docker-compose logs -f
vercel logs --follow
```

---

**Quick Tip:** Save these commands as aliases in `.bashrc` or `.zshrc`:

```bash
alias deploy='npm install && eas build --platform android'
alias logs='docker-compose logs -f'
alias dev='npm start & cd server && npm run dev'
alias prod='npm run build:android && eas submit'
```

---

**Need help?** Open `00_START_HERE.md` for full instructions! 📖
