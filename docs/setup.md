# 🚀 Setup Guide

Complete installation and configuration guide for the Advanced Discord Bot.

## Prerequisites

- **Node.js** 18.0.0 or higher
- **npm** or **yarn**
- **Discord Bot Token** from [Discord Developer Portal](https://discord.com/developers/applications)
- **MongoDB** (optional - will use JSON fallback if not available)

## Quick Setup (5 Minutes)

### 1. Install Dependencies

```bash
npm install
```

### 2. Get Bot Token

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and give it a name
3. Go to "Bot" tab → Click "Add Bot"
4. **Enable these intents:**
   - ✅ Presence Intent
   - ✅ Server Members Intent
   - ✅ Message Content Intent
5. Click "Reset Token" and copy your bot token
6. Go to "OAuth2" → "General" and copy Client ID

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` file:

```env
# Required
BOT_TOKEN=your_bot_token_here
CLIENT_ID=your_client_id_here

# Optional - Dashboard
CLIENT_SECRET=your_client_secret_here
DASHBOARD_PORT=3000
DASHBOARD_URL=http://localhost:3000
SESSION_SECRET=random_secret_string

# Optional - MongoDB
MONGODB_URI=mongodb://localhost:27017/discord-bot

# Optional
OWNER_ID=your_discord_user_id
```

### 4. Build and Start

```bash
# Build TypeScript
npm run build

# Start bot
npm start
```

### 5. Invite Bot to Server

1. Go to Discord Developer Portal → OAuth2 → URL Generator
2. Select scopes: `bot` + `applications.commands`
3. Select permissions: `Administrator` (or specific permissions)
4. Copy URL and open in browser
5. Select your server and authorize

### 6. Test Commands

In Discord, try:
```
/help
/ping
/rank
/balance
```

## Database Options

### Option 1: JSON (Default - No Setup Required)

Leave `MONGODB_URI` empty or remove it. The bot will automatically use JSON files in the `data/` folder.

**Pros:**
- ✅ No setup required
- ✅ Works immediately
- ✅ Perfect for small/medium servers

**Cons:**
- ❌ Less scalable for very large servers
- ❌ Slower for complex queries

### Option 2: MongoDB (Recommended for Large Servers)

**Local MongoDB:**
```env
MONGODB_URI=mongodb://localhost:27017/discord-bot
```

**MongoDB Atlas (Cloud):**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/discord-bot
```

**Pros:**
- ✅ Highly scalable
- ✅ Better performance for large datasets
- ✅ Cloud hosting available

**Cons:**
- ❌ Requires setup
- ❌ May need paid plan for cloud

**Note:** Bot automatically falls back to JSON if MongoDB connection fails.

## Dashboard Setup (Optional)

### 1. Get Client Secret

1. Go to Discord Developer Portal
2. Select your application
3. Go to OAuth2 → General
4. Copy "Client Secret"

### 2. Add Redirect URL

In OAuth2 section:
1. Click "Add Redirect"
2. Add: `http://localhost:3000/auth/callback`
3. For production, also add: `https://yourdomain.com/auth/callback`
4. Click "Save Changes"

### 3. Configure .env

```env
CLIENT_SECRET=your_client_secret_here
DASHBOARD_PORT=3000
DASHBOARD_URL=http://localhost:3000
SESSION_SECRET=your_random_secret_here
```

Generate a random session secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Start Dashboard

```bash
npm start
```

Visit: `http://localhost:3000`

See [Dashboard Guide](dashboard.md) for more details.

## Configuration

### Basic Configuration

Edit `config.json`:

```json
{
  "economy": {
    "startingBalance": 1000,
    "dailyAmount": 500,
    "workMin": 50,
    "workMax": 200
  },
  "leveling": {
    "xpPerMessage": [15, 25],
    "xpCooldown": 60000
  }
}
```

See [Configuration Guide](config.md) for all options.

### In-Discord Configuration

```bash
# Rank System
/rankconfig xp amount:15
/rankconfig cooldown seconds:60
/rankroles add level:10 role:@Regular

# Invite Tracker
/inviteconfig logchannel channel:#logs
/inviteconfig minaccountage days:7
```

## Deployment

### Development

```bash
npm run dev
```

### Production with PM2

```bash
# Install PM2
npm install -g pm2

# Start bot
pm2 start ecosystem.config.cjs

# Save configuration
pm2 save

# Auto-start on boot
pm2 startup
```

### Docker

```bash
docker-compose up -d
```

## Verification

### Expected Console Output

```
🚀 Initializing bot...

✓ Using JSON as primary database
✓ Loaded 70 commands
✓ Loaded 8 events

✓ Bot is ready! Logged in as YourBot#1234
  Servers: 1
  Users: 10

✓ Successfully registered slash commands
```

### Test Checklist

- [ ] Bot shows online in Discord
- [ ] `/help` command works
- [ ] `/ping` shows latency
- [ ] `/rank` displays rank card
- [ ] Commands have styled embeds
- [ ] No errors in console

## Troubleshooting

### Bot Won't Start

**Issue:** Bot doesn't start or crashes immediately

**Solutions:**
1. Check `BOT_TOKEN` is correct in `.env`
2. Verify all intents are enabled in Developer Portal
3. Run `npm install` again
4. Check Node.js version: `node --version` (must be 18+)

### Commands Not Showing

**Issue:** Slash commands don't appear in Discord

**Solutions:**
1. Wait 1-5 minutes for Discord to register commands
2. Check bot has `applications.commands` scope
3. Kick and re-invite bot with correct permissions
4. Check console for registration errors

### Database Errors

**Issue:** Database connection errors

**Solutions:**
1. Bot automatically falls back to JSON
2. Check `MONGODB_URI` format if using MongoDB
3. Verify MongoDB is running: `mongod --version`
4. Check `data/` folder has write permissions

### Permission Errors

**Issue:** Bot can't perform actions

**Solutions:**
1. Verify bot has required permissions
2. Check bot's role is above target roles
3. Ensure bot has admin or specific permissions
4. Re-invite bot with correct permission integer

### TypeScript Errors

**Issue:** Build fails with TypeScript errors

**Solutions:**
```bash
# Clean build
rm -rf dist
npm run build

# Check for syntax errors
npm run build
```

## Next Steps

1. ✅ Bot is running
2. Configure rank system: [Features Guide](features.md#leveling-system)
3. Set up invite tracking: [Analytics Guide](analytics.md)
4. Customize settings: [Configuration Guide](config.md)
5. Explore all commands: [Commands Reference](commands.md)

## Support

- Check [Documentation](README.md)
- Review console logs
- Verify bot permissions
- Check Discord.js documentation

---

**Setup complete!** Your bot is ready to use. 🎉
