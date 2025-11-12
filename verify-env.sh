#!/bin/bash

# Environment Variables Setup Verification Script
# Run this script to verify your .env setup is correct

echo "🔍 Verifying Environment Variables Setup..."
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env file exists
if [ -f ".env" ]; then
    echo -e "${GREEN}✅ .env file exists${NC}"
else
    echo -e "${RED}❌ .env file NOT found${NC}"
    echo "   Run: cp .env.example .env"
    exit 1
fi

# Check if .env.example exists
if [ -f ".env.example" ]; then
    echo -e "${GREEN}✅ .env.example file exists${NC}"
else
    echo -e "${YELLOW}⚠️  .env.example file NOT found${NC}"
fi

# Check if babel.config.js exists
if [ -f "babel.config.js" ]; then
    echo -e "${GREEN}✅ babel.config.js exists${NC}"
    
    # Check if it contains react-native-dotenv
    if grep -q "react-native-dotenv" "babel.config.js"; then
        echo -e "${GREEN}✅ babel.config.js configured for dotenv${NC}"
    else
        echo -e "${RED}❌ babel.config.js missing dotenv plugin${NC}"
        exit 1
    fi
else
    echo -e "${RED}❌ babel.config.js NOT found${NC}"
    exit 1
fi

# Check if .gitignore includes .env
if [ -f ".gitignore" ]; then
    if grep -q "^\.env$" ".gitignore"; then
        echo -e "${GREEN}✅ .gitignore excludes .env file${NC}"
    else
        echo -e "${YELLOW}⚠️  .gitignore may not exclude .env file${NC}"
    fi
fi

# Check if GROQ_API_KEY is set in .env
if grep -q "^GROQ_API_KEY=" ".env"; then
    KEY_VALUE=$(grep "^GROQ_API_KEY=" ".env" | cut -d'=' -f2)
    if [ -n "$KEY_VALUE" ] && [ "$KEY_VALUE" != "your_groq_api_key_here" ]; then
        echo -e "${GREEN}✅ GROQ_API_KEY is set in .env${NC}"
        echo "   Key: ${KEY_VALUE:0:10}...${KEY_VALUE: -10}"
    else
        echo -e "${RED}❌ GROQ_API_KEY not properly set${NC}"
        echo "   Update your .env file with your actual API key"
        exit 1
    fi
else
    echo -e "${RED}❌ GROQ_API_KEY not found in .env${NC}"
    exit 1
fi

# Check if react-native-dotenv is installed
if [ -d "node_modules/react-native-dotenv" ]; then
    echo -e "${GREEN}✅ react-native-dotenv package installed${NC}"
else
    echo -e "${RED}❌ react-native-dotenv NOT installed${NC}"
    echo "   Run: npm install --legacy-peer-deps"
    exit 1
fi

# Check if aiService.js uses @env imports
if [ -f "services/aiService.js" ]; then
    if grep -q "from '@env'" "services/aiService.js"; then
        echo -e "${GREEN}✅ aiService.js uses environment variables${NC}"
    else
        echo -e "${YELLOW}⚠️  aiService.js may not be using @env imports${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  services/aiService.js not found${NC}"
fi

echo ""
echo -e "${GREEN}🎉 All checks passed!${NC}"
echo ""
echo "Next steps:"
echo "1. Restart your development server with: npm start -- --clear"
echo "2. Test AI features in your app"
echo "3. Check console for any environment variable errors"
echo ""
echo "📚 For more information, see:"
echo "   - ENV_SETUP.md (detailed guide)"
echo "   - SETUP_COMPLETE.md (quick reference)"
