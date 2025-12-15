@echo off
REM TAUfoods - Quick Deploy Script for Windows

echo ================================
echo TAUfoods - LIVE DEPLOYMENT
echo ================================
echo.

REM Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js not installed!
    echo Download from: https://nodejs.org
    pause
    exit /b 1
)

echo OK - Node.js found
echo.

REM Step 1: Install dependencies
echo Step 1: Installing dependencies...
call npm install

cd server
call npm install
cd ..

echo OK - Dependencies installed
echo.

REM Step 2: Install EAS CLI
echo Step 2: Installing EAS CLI...
call npm install -g eas-cli

echo.
echo ================================
echo READY TO BUILD!
echo ================================
echo.
echo Run these commands:
echo.
echo   eas login
echo   eas build --platform android --profile preview
echo.
echo Then download the APK and test it on your phone!
echo.
pause
