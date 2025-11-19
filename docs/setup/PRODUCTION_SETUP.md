# 🚀 Production Setup Guide

Complete guide for deploying your Discord bot to production.

---

## 📋 Pre-Deployment Checklist

- [ ] All tests passing
- [ ] Code built successfully (`npm run build`)
- [ ] Environment variables configured
- [ ] MongoDB connection tested (if using)
- [ ] Debug commands disabled
- [ ] Sensitive data removed from code
- [ ] Error handling implemented
- [ ] Logging configured
- [ ] Backup system tested

---

## 🔧 Environment Configuration

### 1. Create Production .env File

```env
# Required
TOKEN=your_production_bot_token
CLIENT_ID=your_bot_client_id
PREFIX=!

# MongoDB (Recommended for production)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/botdb

# Environment
NODE_ENV=production

# Debug Commands (IMPORTANT: Set to false in production)
ENABLE_DEBUG_COMMANDS=false

# Optional - Dashboard
CLIENT_SECRET=your_client_secret
DASHBOARD_PORT=3000
```

### 2. Environment Variables Explained

**TOKEN** (Required)
- Your Discord bot token from [Discord Developer Portal](https://discord.com/developers/applications)
- Keep this secret and never commit to git

**CLIENT_ID** (Required)
- Your bot's application ID
- Found in Discord Developer Portal

**NODE_ENV** (Important)
- Set to `production` for production deployment
- Set to `development` for local testing

**ENABLE_DEBUG_COMMANDS** (Security)
- Set to `false` in production (default)
- Set to `true` only when debugging issues
- Disables `/testdb` and `/debuglevels` commands

**MONGODB_URI** (Recommended)
- MongoDB connection string for cloud database
- Bot will use JSON fallback if not provided
- Recommended for production for better performance

---

## 🔒 Security Best Practices

### 1. Disable Debug Commands

Debug commands are automatically disabled when:
```env
NODE_ENV=production
ENABLE_DEBUG_COMMANDS=false
```

**Disabled Commands:**
- `/testdb` - Database testing
- `/debuglevels` - Level data debugging

**Why disable?**
- Prevents exposing database structure
- Reduces attack surface
- Improves performance
- Professional appearance

### 2. Protect Sensitive Data

**Never commit to git:**
- `.env` file
- Bot tokens
- Database credentials
- API keys

**Add to .gitignore:**
```
.env
.env.local
.env.production
database/json/data.json
node_modules/
dist/
*.log
```

### 3. Use Environment Variables

**Good:**
```typescript
const token = process.env.TOKEN;
const mongoUri = process.env.MONGODB_URI;
```

**Bad:**
```typescript
const token = proces.env.TOKEN;
```

---

## 🗄️ Database Configuration

### MongoDB (Recommended)

**Advantages:**
- Cloud-based, scalable
- Automatic backups
- Better performance
- Professional solution

**Setup:**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string
4. Add to `.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/botdb
```

### JSON Fallback

**Advantages:**
- No setup required
- Works offline
- Simple for small bots

**Limitations:**
- Not scalable
- Manual backups needed
- Slower for large data

**The bot automatically uses JSON if MongoDB is not configured.**

---

## 🚀 Deployment Options

### Option 1: VPS (Recommended)

**Providers:**
- DigitalOcean
- Linode
- Vultr
- AWS EC2

**Steps:**
```bash
# 1. SSH into server
ssh user@your-server-ip

# 2. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Clone repository
git clone https://github.com/your-repo/discord-bot.git
cd discord-bot

# 4. Install dependencies
npm install

# 5. Create .env file
nano .env
# Add your production environment variables

# 6. Build
npm run build

# 7. Install PM2
npm install -g pm2

# 8. Start bot
pm2 start dist/index.js --name discord-bot

# 9. Save PM2 config
pm2 save

# 10. Setup auto-restart on reboot
pm2 startup
```

### Option 2: Docker

**Dockerfile:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

CMD ["node", "dist/index.js"]
```

**docker-compose.yml:**
```yaml
version: '3.8'
services:
  bot:
    build: .
    restart: always
    env_file: .env
    volumes:
      - ./database:/app/database
```

**Deploy:**
```bash
docker-compose up -d
```

### Option 3: Heroku

**Steps:**
1. Create `Procfile`:
```
worker: node dist/index.js
```

2. Deploy:
```bash
heroku create your-bot-name
heroku config:set TOKEN=your_token
heroku config:set NODE_ENV=production
heroku config:set ENABLE_DEBUG_COMMANDS=false
git push heroku main
heroku ps:scale worker=1
```

### Option 4: Railway

**Steps:**
1. Connect GitHub repository
2. Add environment variables in dashboard
3. Deploy automatically on push

---

## 🔄 Process Management with PM2

### Basic Commands

```bash
# Start bot
pm2 start dist/index.js --name discord-bot

# Stop bot
pm2 stop discord-bot

# Restart bot
pm2 restart discord-bot

# View logs
pm2 logs discord-bot

# Monitor
pm2 monit

# List processes
pm2 list

# Delete process
pm2 delete discord-bot
```

### PM2 Ecosystem File

Create `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'discord-bot',
    script: './dist/index.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production'
    }
  }]
};
```

Start with:
```bash
pm2 start ecosystem.config.js
```

---

## 📊 Monitoring & Logging

### Console Logging

The bot logs important events:
```
✓ MongoDB connected successfully
✓ JSON backup system initialized
✓ Auto-backup enabled (every 5 minutes)
✓ Bot is ready! Logged in as BotName#1234
```

### PM2 Logs

```bash
# View all logs
pm2 logs

# View only errors
pm2 logs --err

# Clear logs
pm2 flush
```

### Custom Logging

Add to your code:
```typescript
console.log('[INFO]', 'Bot started');
console.error('[ERROR]', 'Something went wrong');
console.warn('[WARN]', 'Potential issue');
```

---

## 🔧 Maintenance

### Update Bot

```bash
# Pull latest changes
git pull origin main

# Install dependencies
npm install

# Rebuild
npm run build

# Restart
pm2 restart discord-bot
```

### Backup Database

**Automatic:**
- MongoDB: Automatic backups every 5 minutes
- JSON: Backed up to `database/json/data.json`

**Manual:**
```bash
# Backup JSON database
cp database/json/data.json database/json/data.backup.json

# Or use the bot command
/backup
```

### Database Sync

```bash
# Sync JSON to MongoDB
/syncdb direction:JSON → MongoDB

# Sync MongoDB to JSON
/syncdb direction:MongoDB → JSON
```

---

## 🐛 Troubleshooting

### Bot Not Starting

**Check:**
1. `.env` file exists and has correct values
2. `TOKEN` is valid
3. `NODE_ENV=production`
4. Dependencies installed: `npm install`
5. Code built: `npm run build`

**View logs:**
```bash
pm2 logs discord-bot
```

### Commands Not Working

**Check:**
1. Bot has proper permissions in Discord
2. Commands registered: Wait 1-2 minutes after restart
3. Bot is online in Discord

### Database Issues

**MongoDB not connecting:**
1. Check `MONGODB_URI` is correct
2. Check network access in MongoDB Atlas
3. Bot will automatically use JSON fallback

**Leaderboard empty:**
```bash
# Restart bot (auto-reads from JSON)
pm2 restart discord-bot

# Or sync manually
/syncdb direction:JSON → MongoDB
```

### Debug Commands Not Working

**This is expected in production!**

Debug commands are disabled when:
```env
NODE_ENV=production
ENABLE_DEBUG_COMMANDS=false
```

**To enable temporarily:**
```env
ENABLE_DEBUG_COMMANDS=true
```

Then restart:
```bash
pm2 restart discord-bot
```

**Remember to disable again after debugging!**

---

## 📈 Performance Optimization

### 1. Use MongoDB

MongoDB is faster than JSON for large datasets.

### 2. Enable Caching

The bot already caches data internally.

### 3. Optimize Queries

Database queries are already optimized.

### 4. Monitor Resources

```bash
pm2 monit
```

Watch for:
- High memory usage (>500MB)
- High CPU usage (>50%)
- Restart loops

### 5. Set Memory Limits

In `ecosystem.config.js`:
```javascript
max_memory_restart: '1G'
```

---

## 🔐 Security Checklist

- [ ] `NODE_ENV=production` in .env
- [ ] `ENABLE_DEBUG_COMMANDS=false` in .env
- [ ] `.env` not committed to git
- [ ] Bot token kept secret
- [ ] MongoDB credentials secure
- [ ] Server firewall configured
- [ ] SSH key authentication enabled
- [ ] Regular security updates
- [ ] Backup system working

---

## 📞 Support

### Common Issues

**Issue:** Bot offline
**Fix:** Check PM2 status: `pm2 list`

**Issue:** Commands not registering
**Fix:** Wait 1-2 minutes, or restart bot

**Issue:** Database errors
**Fix:** Check MongoDB connection or use JSON fallback

**Issue:** Memory leaks
**Fix:** Restart bot: `pm2 restart discord-bot`

### Getting Help

1. Check logs: `pm2 logs discord-bot`
2. Review this guide
3. Check [CHANGELOG.md](CHANGELOG.md)
4. Check [README.md](README.md)

---

## ✅ Production Checklist

Before going live:

- [ ] `.env` configured with production values
- [ ] `NODE_ENV=production`
- [ ] `ENABLE_DEBUG_COMMANDS=false`
- [ ] MongoDB connected (or JSON fallback ready)
- [ ] Bot tested in test server
- [ ] All commands working
- [ ] Backup system tested
- [ ] PM2 configured for auto-restart
- [ ] Monitoring setup
- [ ] Documentation reviewed

---

## 🎉 You're Ready!

Your bot is now configured for production deployment with:
- ✅ Debug commands disabled
- ✅ Secure environment variables
- ✅ Automatic backups
- ✅ Process management
- ✅ Error handling
- ✅ Monitoring

**Deploy with confidence!** 🚀

---

**Version:** 2.0.0  
**Last Updated:** November 19, 2025  
**Status:** Production Ready
