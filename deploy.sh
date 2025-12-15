#!/bin/bash

# TAUfoods - Automated Deployment Script
# This script deploys your app to Vercel (backend) and builds APK (frontend)

echo "================================"
echo "TAUfoods - LIVE DEPLOYMENT"
echo "================================"
echo ""

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found! Download from https://nodejs.org"
    exit 1
fi

echo "✓ Node.js found"
echo ""

# Step 1: Install dependencies
echo "Step 1: Installing dependencies..."
npm install

cd server
npm install
cd ..

echo "✓ Dependencies installed"
echo ""

# Step 2: Build frontend
echo "Step 2: Building frontend app..."
echo "Installing EAS CLI..."
npm install -g eas-cli

echo ""
echo "Logging in to Expo..."
eas login

echo ""
echo "Building APK for Android..."
eas build --platform android --profile preview

echo ""
echo "================================"
echo "BUILD COMPLETE!"
echo "================================"
echo ""
echo "Next steps:"
echo "1. Download the APK from EAS"
echo "2. Install on your Android phone"
echo "3. Test the app"
echo "4. Deploy backend to Vercel at vercel.com"
echo "5. Update API URL in app.json if needed"
echo ""
echo "To submit to Google Play Store:"
echo "  eas submit --platform android"
echo ""
