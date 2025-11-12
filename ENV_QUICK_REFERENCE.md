# 🔑 Environment Variables - Quick Reference

## One-Page Cheat Sheet

### 📋 Quick Commands

```bash
# Verify setup
./verify-env.sh

# Restart with cache clear (REQUIRED after .env changes)
npm start -- --clear
# or
expo start -c

# View your .env file
cat .env

# Copy template for new setup
cp .env.example .env
```

### 📝 File Overview

| File | Purpose | Commit to Git? |
|------|---------|----------------|
| `.env` | Your actual API keys | ❌ NO - Never! |
| `.env.example` | Template for team | ✅ Yes |
| `babel.config.js` | Dotenv configuration | ✅ Yes |
| `env.d.ts` | TypeScript types | ✅ Yes |

### 🔌 Using Environment Variables

```javascript
// Import at top of file
import { GROQ_API_KEY, GROQ_API_URL } from '@env';

// Use in your code
const apiKey = GROQ_API_KEY;
const url = GROQ_API_URL || 'default-url';
```

### 📊 Current Variables

```env
GROQ_API_KEY=your_groq_api_key
GROQ_API_URL=https://api.groq.com/openai/v1/chat/completions
GROQ_MODEL=llama-3.1-8b-instant
NODE_ENV=development
```

### ➕ Adding New Variables

1. Add to `.env`:
   ```
   NEW_KEY=value
   ```

2. Add to `.env.example`:
   ```
   NEW_KEY=your_value_here
   ```

3. Import in code:
   ```javascript
   import { NEW_KEY } from '@env';
   ```

4. Restart: `npm start -- --clear`

### 🐛 Common Issues & Fixes

| Problem | Solution |
|---------|----------|
| Changes not reflecting | Restart with `--clear` flag |
| "Cannot find module '@env'" | Check babel.config.js has dotenv plugin |
| Variables are undefined | Verify spelling in .env (case-sensitive) |
| API calls failing | Check API key is correct and valid |

### ⚠️ Security Checklist

- [ ] `.env` is in `.gitignore`
- [ ] Never commit `.env` file
- [ ] Never share API keys
- [ ] Use different keys for dev/prod
- [ ] Rotate keys if exposed

### 🔗 Where API Keys Are Used

- `services/aiService.js` - Groq API for AI features
- Future integrations can follow same pattern

### 📞 Get API Keys

- **Groq**: https://console.groq.com/keys

### 📚 Full Documentation

- `ENV_SETUP.md` - Complete guide
- `SETUP_COMPLETE.md` - Setup summary

---

**Remember**: Always restart your dev server with `--clear` after changing `.env`! 🔄
