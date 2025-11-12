# Environment Variables Setup Guide

## Overview

This app uses environment variables to securely store API keys and configuration settings. This guide explains how to set up and manage these variables.

## 🔐 Security Best Practices

- **NEVER** commit the `.env` file to version control (it's already in `.gitignore`)
- **NEVER** share your API keys publicly or in screenshots
- **ALWAYS** use the `.env.example` file as a template for other developers
- Rotate your API keys regularly and if they're ever exposed

## 📁 Files

### `.env` (Your local configuration)
Contains your actual API keys and secrets. This file is **never** committed to Git.

### `.env.example` (Template)
A template file showing what environment variables are needed. This file **is** committed to Git to help other developers set up their own `.env` file.

## 🚀 Quick Setup

### 1. Install Dependencies

The required package `react-native-dotenv` is already installed. If you need to reinstall:

```bash
npm install --legacy-peer-deps
```

### 2. Create Your .env File

If the `.env` file doesn't exist, copy the template:

```bash
cp .env.example .env
```

### 3. Add Your API Keys

Edit the `.env` file and replace the placeholder values with your actual API keys:

```env
# Groq API Key for AI-powered features
GROQ_API_KEY=your_actual_groq_api_key_here
```

### 4. Get Your Groq API Key

1. Visit [Groq Console](https://console.groq.com/keys)
2. Sign up or log in
3. Create a new API key
4. Copy the key and paste it into your `.env` file

### 5. Restart Your Development Server

After updating `.env`, you **must** restart your Expo development server:

```bash
# Stop the current server (Ctrl+C)
# Clear cache and restart
npm start -- --clear
```

## 📝 Available Environment Variables

### Current Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `GROQ_API_KEY` | Groq API key for AI features | Yes | None |
| `GROQ_API_URL` | Groq API endpoint URL | No | https://api.groq.com/openai/v1/chat/completions |
| `GROQ_MODEL` | AI model to use | No | llama-3.1-8b-instant |
| `NODE_ENV` | Environment type | No | development |

### Adding New Variables

To add a new environment variable:

1. Add it to `.env`:
   ```env
   NEW_API_KEY=your_new_key_here
   ```

2. Add it to `.env.example` (with placeholder):
   ```env
   NEW_API_KEY=your_new_key_here
   ```

3. Import it in your code:
   ```javascript
   import { NEW_API_KEY } from '@env';
   ```

4. Restart your dev server with cache clear:
   ```bash
   npm start -- --clear
   ```

## 🔧 Usage in Code

### Importing Environment Variables

```javascript
// Import specific variables
import { GROQ_API_KEY, GROQ_API_URL } from '@env';

// Use them in your code
const apiKey = GROQ_API_KEY;
const apiUrl = GROQ_API_URL || 'https://default-url.com';
```

### Example: AI Service

```javascript
// services/aiService.js
import { GROQ_API_KEY, GROQ_API_URL, GROQ_MODEL } from '@env';

const API_URL = GROQ_API_URL || 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = GROQ_MODEL || 'llama-3.1-8b-instant';
const DEFAULT_API_KEY = GROQ_API_KEY;
```

## 🐛 Troubleshooting

### Issue: Changes to .env not reflecting

**Solution:** Clear cache and restart:
```bash
npm start -- --clear
```

### Issue: "Cannot find module '@env'"

**Solution:** 
1. Ensure `react-native-dotenv` is installed
2. Check that `babel.config.js` includes the dotenv plugin
3. Restart Metro bundler with cache clear

### Issue: Environment variables are undefined

**Solution:**
1. Verify the variable exists in `.env`
2. Check spelling matches exactly (case-sensitive)
3. Ensure no spaces around `=` in `.env`
4. Restart with cache clear
5. Try rebuilding: `expo start -c`

### Issue: API key not working

**Solution:**
1. Verify you copied the entire key (no extra spaces)
2. Check if the key is still valid in the API console
3. Ensure you're using the correct key for the environment

## 📱 Platform-Specific Notes

### Expo Go
Environment variables work out-of-the-box with Expo Go after installing `react-native-dotenv`.

### Development Builds
For development builds, environment variables are bundled at build time. Rebuild after changing `.env`:

```bash
expo run:android
# or
expo run:ios
```

### Production Builds
For production:
1. Use different `.env` files for different environments (`.env.production`)
2. Configure your CI/CD to inject environment variables
3. Never include production keys in the `.env` file committed to the repo

## 🔄 Different Environments

You can create multiple environment files:

- `.env` - Default (development)
- `.env.local` - Local overrides (gitignored)
- `.env.production` - Production values (never commit!)
- `.env.staging` - Staging environment

Load specific environment:
```bash
APP_ENV=production npm start
```

## 📚 Additional Resources

- [react-native-dotenv Documentation](https://github.com/goatandsheep/react-native-dotenv)
- [Groq API Documentation](https://console.groq.com/docs)
- [Expo Environment Variables](https://docs.expo.dev/guides/environment-variables/)

## ✅ Checklist for New Developers

- [ ] Copy `.env.example` to `.env`
- [ ] Get Groq API key from console.groq.com
- [ ] Add API key to `.env` file
- [ ] Verify `.env` is in `.gitignore`
- [ ] Restart dev server with `npm start -- --clear`
- [ ] Test AI features work correctly

## 🆘 Support

If you encounter issues:
1. Check this guide's troubleshooting section
2. Verify all steps were followed correctly
3. Check Expo and react-native-dotenv documentation
4. Clear all caches and restart

---

**Remember: Never commit your `.env` file or share your API keys!** 🔒
