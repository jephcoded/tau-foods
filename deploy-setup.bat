@echo off
REM TAUfoods Quick Deployment Script

echo ========================================
echo TAUfoods - LIVE DEPLOYMENT SETUP
echo ========================================
echo.

REM Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js not installed!
    echo Download from: https://nodejs.org
    pause
    exit /b 1
)

echo ✓ Node.js found

REM Install EAS CLI globally
echo.
echo Installing EAS CLI...
npm install -g eas-cli

REM Install frontend dependencies
echo.
echo Installing frontend dependencies...
npm install

REM Create production env file
echo.
echo Creating .env.production file...

if not exist ".env.production" (
    (
        echo # Production API Configuration
        echo EXPO_PUBLIC_API_URL=https://YOUR_BACKEND_URL.onrender.com
        echo EXPO_PUBLIC_API_TIMEOUT=30000
    ) > .env.production
    
    echo ✓ Created .env.production
    echo.
    echo IMPORTANT: Edit .env.production and replace YOUR_BACKEND_URL
    echo.
)

REM Setup backend
echo.
echo Setting up backend...
cd server

if not exist ".env" (
    (
        echo PORT=5000
        echo NODE_ENV=production
        echo MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/taufoods
        echo JWT_SECRET=generate_strong_key_here
        echo CORS_ORIGIN=*
    ) > .env
    
    echo ✓ Created server/.env
    echo.
    echo IMPORTANT: Edit server/.env with your MongoDB credentials
    echo.
)

npm install

cd ..

echo.
echo ========================================
echo SETUP COMPLETE!
echo ========================================
echo.
echo Next steps:
echo 1. Edit .env.production with your backend URL
echo 2. Edit server/.env with your MongoDB credentials
echo 3. Deploy backend to Render/Railway
echo 4. Run: eas login
echo 5. Run: eas build --platform android --profile preview
echo.
echo For detailed instructions, see: DEPLOY_NOW.md
echo.
pause
