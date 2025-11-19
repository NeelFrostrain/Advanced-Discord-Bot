# 🔑 Get Your Free Google API Key (2 Minutes)

## Step-by-Step Guide

### 1. Go to Google AI Studio
**Link:** https://makersuite.google.com/app/apikey

or

**Alternative:** https://aistudio.google.com/app/apikey

### 2. Sign In
- Click "Sign in with Google"
- Use any Google account (Gmail)
- It's 100% FREE! No credit card needed! 🎉

### 3. Create API Key
1. Click the **"Create API Key"** button
2. You'll see a popup asking to select a project
3. Choose **"Create API key in new project"** (easiest option)
4. Wait a few seconds...
5. Your API key will appear! 🎊

### 4. Copy Your Key
- Click the **Copy** button
- Your key looks like: `AIzaSyD...` (39 characters)
- Keep it safe! Don't share it publicly!

### 5. Add to Your Bot

**Open your `.env` file and add:**
```env
GOOGLE_API_KEY=AIzaSyD_your_actual_key_here
```

**Example:**
```env
GOOGLE_API_KEY=AIzaSyDXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### 6. Restart Your Bot
```bash
npm run build
npm start
```

or with PM2:
```bash
pm2 restart discord-bot
```

### 7. Test It!
```
/chat message:Hey! Are you working?
```

or

```
@YourBot hello!
```

**Done!** 🎉

---

## 🆓 Free Tier Limits

**What you get for FREE:**
- ✅ 60 requests per minute
- ✅ 1,500 requests per day
- ✅ No credit card required
- ✅ No expiration
- ✅ Perfect for Discord bots!

**More than enough for most servers!** 😊

---

## 🔒 Security Tips

### ✅ Do's
- Keep your API key in `.env` file
- Add `.env` to `.gitignore`
- Never commit API keys to GitHub
- Regenerate if accidentally exposed

### ❌ Don'ts
- Don't share your API key publicly
- Don't hardcode it in your code
- Don't commit it to version control
- Don't post it in Discord

---

## 🐛 Troubleshooting

### "API Key Missing" Error
**Fix:** Add `GOOGLE_API_KEY=your_key` to `.env` and restart bot

### "API Error: 400" Error
**Causes:**
1. API key is invalid
2. API key is missing
3. API key has wrong format

**Fix:**
1. Check your API key is correct
2. Make sure there are no spaces
3. Regenerate key if needed

### "API Error: 429" Error
**Cause:** Rate limit exceeded (60 requests/minute)

**Fix:**
1. Wait 1 minute
2. Add cooldowns to commands
3. Upgrade to paid tier (optional)

### Key Not Working
**Try:**
1. Regenerate the API key
2. Create a new project
3. Check you copied the full key
4. Remove any spaces or quotes

---

## 📊 Check Your Usage

**View your API usage:**
https://aistudio.google.com/app/apikey

You can see:
- Requests made today
- Remaining quota
- Error rates

---

## 🔄 Regenerate Key

**If you need a new key:**
1. Go to https://aistudio.google.com/app/apikey
2. Click the **trash icon** next to old key
3. Click **"Create API Key"** again
4. Update your `.env` file
5. Restart bot

---

## 💡 Pro Tips

### Tip 1: Test First
Test your key with a simple request before using in bot:
```bash
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_KEY" \
  -H 'Content-Type: application/json' \
  -d '{"contents":[{"parts":[{"text":"Hello"}]}]}'
```

### Tip 2: Multiple Keys
You can create multiple API keys for different projects!

### Tip 3: Monitor Usage
Check your usage regularly to avoid hitting limits.

### Tip 4: Add Cooldowns
Add cooldowns to prevent spam:
```typescript
// In your command
.setCooldown(3000) // 3 seconds
```

---

## 🎯 Quick Reference

**Get Key:** https://makersuite.google.com/app/apikey  
**Add to:** `.env` file  
**Format:** `GOOGLE_API_KEY=AIzaSy...`  
**Restart:** `npm run build && npm start`  
**Test:** `/chat message:test`

---

## ✅ Checklist

- [ ] Went to Google AI Studio
- [ ] Signed in with Google
- [ ] Created API key
- [ ] Copied the key
- [ ] Added to `.env` file
- [ ] Restarted bot
- [ ] Tested with `/chat` command
- [ ] Bot responded successfully!

---

## 🎊 You're Done!

Your bot can now chat with users! 🤖💬

**Try it:**
```
/chat message:Hey! What's up?
```

**Have fun!** 😊✨

---

**Need Help?**
- Check `AI_BEST_FRIEND_SETUP.md` for full guide
- Check `AI_BEST_FRIEND_FEATURE.md` for features
- Test your API key at Google AI Studio

**Version:** 2.1.0  
**Cost:** $0.00 (Free!)  
**Time:** 2 minutes  
**Difficulty:** Easy 🟢
