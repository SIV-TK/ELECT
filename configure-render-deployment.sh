#!/bin/bash

# Render Deployment Configuration Script
# This script helps configure the ELECT platform for Render deployment

echo "🚀 ELECT Platform - Render Deployment Configuration"
echo "=================================================="

# Check if we're in the correct directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: This script must be run from the project root directory"
    exit 1
fi

# Check for required files
echo "📁 Checking required files..."
REQUIRED_FILES=(
    "package.json"
    "next.config.js"
    "src/middleware.ts"
    "src/app/api/health/route.ts"
    "src/lib/production-ai.ts"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file is missing"
        exit 1
    fi
done

# Check environment variables
echo ""
echo "🔧 Environment Variables Check..."
echo "================================"

# Check if .env.local exists
if [ -f ".env.local" ]; then
    echo "✅ .env.local file exists"
    
    # Check for required environment variables
    REQUIRED_VARS=(
        "DEEPSEEK_API_KEY"
        "NEXT_PUBLIC_FIREBASE_API_KEY"
        "NEXT_PUBLIC_FIREBASE_PROJECT_ID"
        "FIREBASE_ADMIN_PRIVATE_KEY"
    )
    
    for var in "${REQUIRED_VARS[@]}"; do
        if grep -q "^$var=" .env.local; then
            echo "✅ $var is configured"
        else
            echo "⚠️  $var is missing from .env.local"
        fi
    done
else
    echo "⚠️  .env.local file not found"
fi

# Display Render environment configuration
echo ""
echo "📋 Render Environment Variables Configuration"
echo "============================================="
echo "Copy the following environment variables to your Render dashboard:"
echo ""

cat render-env-config.txt

echo ""
echo "🔗 Render Dashboard Configuration Steps:"
echo "========================================"
echo "1. Go to https://dashboard.render.com"
echo "2. Select your ELECT service"
echo "3. Go to 'Environment' tab"
echo "4. Add each environment variable from the list above"
echo "5. Make sure to replace placeholder values with actual keys"
echo "6. Deploy the service"

echo ""
echo "🧪 Testing Commands (after deployment):"
echo "======================================="
echo "# Test health endpoint:"
echo "curl https://elect-1.onrender.com/api/health"
echo ""
echo "# Test AI sentiment analysis:"
echo "curl -X POST https://elect-1.onrender.com/api/analyze-sentiment \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{\"text\": \"The political situation is improving\"}'"
echo ""
echo "# Test authentication:"
echo "curl https://elect-1.onrender.com/api/auth/verify"
echo ""
echo "# Test public page:"
echo "curl https://elect-1.onrender.com/about"

echo ""
echo "🔍 Troubleshooting:"
echo "==================="
echo "If AI features are not working:"
echo "1. Check that DEEPSEEK_API_KEY is correctly set in Render environment"
echo "2. Verify the API key is valid and has sufficient credits"
echo "3. Check the health endpoint: /api/health"
echo "4. Review Render logs for specific error messages"
echo ""
echo "If authentication is not working:"
echo "1. Ensure all Firebase environment variables are set"
echo "2. Check that Firebase project is configured correctly"
echo "3. Verify NEXTAUTH_SECRET is set to a secure random string"
echo ""
echo "If web scraping is blocked:"
echo "1. Set DISABLE_SCRAPING=true to disable scraping temporarily"
echo "2. The system will use fallback data when scraping is disabled"
echo "3. Consider using cached data or alternative data sources"

echo ""
echo "✅ Configuration check complete!"
echo "Next steps:"
echo "1. Configure environment variables in Render dashboard"
echo "2. Deploy the service"
echo "3. Test the endpoints listed above"
echo "4. Monitor Render logs for any issues"
