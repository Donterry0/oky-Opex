#!/bin/bash

# Firebase Setup Helper Script for oky-Opex
# This script helps you configure Firebase for the project

echo "🔥 OKY-OPEX Firebase Setup Helper"
echo "=================================="
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📋 Creating .env.local from .env.example..."
    cp .env.example .env.local
    echo "✓ Created .env.local"
    echo ""
fi

echo "📖 Firebase Setup Instructions:"
echo "================================"
echo ""
echo "1. Go to: https://console.firebase.google.com/"
echo "2. Create a new project called 'oky-opex'"
echo "3. Get your Web App credentials from Project Settings → Your Apps"
echo "4. Get your Admin SDK credentials from Project Settings → Service Accounts"
echo ""

echo "📝 Next Steps:"
echo "1. Edit .env.local with your Firebase credentials"
echo "2. Run: npm run dev"
echo "3. Visit: http://localhost:3000"
echo ""

echo "Need help? Read FIREBASE_SETUP.md for detailed instructions"
echo ""
