# 🔒 Debug Commands - Production Security

## ✅ What Was Done

Debug commands are now **automatically disabled in production** for security.

---

## 🛡️ Disabled Commands

### `/testdb`
- **Purpose:** Test database access and structure
- **Status:** ❌ Disabled in production
- **Reason:** Exposes database structure

### `/debuglevels`
- **Purpose:** View raw level data structure
- **Status:** ❌ Disabled in production
- **Reason:** Exposes sensitive data

---

## 🔧 How It Works

### Automatic Detection

Commands check environment variables:
```typescript
if (process.env.NODE_ENV === 'production' && 
    process.env.ENABLE_DEBUG_COMMANDS !== 'true') {
  // Command disabled
}
```

### Configuration (.env)

**Production (Secure):**
```env
NODE_ENV=production
ENABLE_DEBUG_COMMANDS=false
```

**Development (Testing):**
```env
NODE_ENV=development
ENABLE_DEBUG_COMMANDS=true
```

---

## 🎯 When Users Try Debug Commands

**In Production:**
```
❌ Command Disabled

This debug command is disabled in production mode.

To enable, set ENABLE_DEBUG_COMMANDS=true in your .env file.
```

**In Development:**
```
✅ Command works normally
Shows database information
```

---

## 🔓 Temporarily Enable (Emergency Only)

If you need to debug in production:

### 1. Edit .env
```env
ENABLE_DEBUG_COMMANDS=true
```

### 2. Restart Bot
```bash
pm2 restart discord-bot
```

### 3. Use Debug Commands
```
/testdb
/debuglevels
```

### 4. Disable Again
```env
ENABLE_DEBUG_COMMANDS=false
```

### 5. Restart Bot
```bash
pm2 restart discord-bot
```

---

## 🚀 Production Commands (Always Available)

These admin commands work in production:

### Database Management
- ✅ `/syncdb` - Sync databases
- ✅ `/backup` - Force backup

### Leveling Management
- ✅ `/givexp` - Give XP to users
- ✅ `/removexp` - Remove XP from users
- ✅ `/rankreset` - Reset user rank
- ✅ `/rankconfig` - Configure leveling

### Server Management
- ✅ `/giveaway` - Create giveaways
- ✅ `/announce` - Send announcements
- ✅ `/setautorole` - Configure auto-roles
- ✅ `/setwelcome` - Configure welcome messages

### Moderation
- ✅ `/ban` - Ban users
- ✅ `/kick` - Kick users
- ✅ `/timeout` - Timeout users
- ✅ `/clear` - Clear messages
- ✅ `/slowmode` - Set slowmode
- ✅ `/lockdown` - Lock channels

---

## 📊 Security Benefits

### Before
- ❌ Anyone with admin could see database structure
- ❌ Potential data exposure
- ❌ Security risk

### After
- ✅ Debug commands disabled by default
- ✅ Database structure protected
- ✅ Production-ready security
- ✅ Can enable only when needed

---

## 📁 Files Modified

### Commands Updated
- `src/commands/admin/testdb.ts`
- `src/commands/admin/debuglevels.ts`

### Configuration Files
- `.env.example` - Added debug settings
- `PRODUCTION_SETUP.md` - Complete production guide

---

## 🎯 Quick Reference

### Check Current Status

**View environment:**
```bash
cat .env | grep NODE_ENV
cat .env | grep ENABLE_DEBUG_COMMANDS
```

**Expected in production:**
```
NODE_ENV=production
ENABLE_DEBUG_COMMANDS=false
```

### Test Debug Commands

**Try command:**
```
/testdb
```

**Expected response in production:**
```
❌ Command Disabled
This debug command is disabled in production mode.
```

**Expected response in development:**
```
✅ Database Test Results
[Shows database information]
```

---

## ✅ Deployment Checklist

Before deploying to production:

- [ ] Set `NODE_ENV=production` in .env
- [ ] Set `ENABLE_DEBUG_COMMANDS=false` in .env
- [ ] Test that debug commands are disabled
- [ ] Verify other admin commands still work
- [ ] Test backup and sync commands
- [ ] Review PRODUCTION_SETUP.md

---

## 🔍 Troubleshooting

### Debug Commands Not Working

**This is expected in production!**

If you need them:
1. Set `ENABLE_DEBUG_COMMANDS=true`
2. Restart bot
3. Use commands
4. Set back to `false`
5. Restart bot

### All Commands Not Working

Check:
1. Bot is online
2. Bot has permissions
3. Commands registered (wait 1-2 minutes)

### Need to Debug Database

**Option 1:** Enable debug commands temporarily

**Option 2:** Use production-safe commands:
```
/syncdb direction:MongoDB → JSON
/backup
```

Then check `database/json/data.json` file directly.

---

## 📚 Related Documentation

- [PRODUCTION_SETUP.md](PRODUCTION_SETUP.md) - Complete production guide
- [README.md](README.md) - Main documentation
- [CHANGELOG.md](CHANGELOG.md) - Version 2.0 changes

---

**Version:** 2.0.0  
**Security Level:** ✅ Production Ready  
**Debug Commands:** 🔒 Disabled by Default

**Your bot is now secure for production deployment!** 🚀
