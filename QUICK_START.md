# ⚡ Quick Start - Version 1.2

## 🎯 For Existing Users

### Your Bot Just Got Better!

**What Changed:**
- ✅ User mentions now work properly
- ✅ Leaderboards fixed and enhanced
- ✅ Automatic database backup system
- ✅ Better level-up notifications

### What To Do:

**Option 1: Just Restart (Easiest)**
```bash
npm run dev
```
Everything works automatically!

**Option 2: Sync to MongoDB (Recommended)**
```
/syncdb direction:JSON → MongoDB
```
Then restart the bot.

### Verify It Works:
```
/rank          # Should show your rank position
/leaderboard   # Should show all users
/testdb        # Verify database access
```

---

## 🆕 For New Users

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Create .env file
cp .env.example .env

# 3. Add your bot token to .env
TOKEN=your_discord_bot_token
CLIENT_ID=your_bot_client_id

# 4. (Optional) Add MongoDB
MONGODB_URI=mongodb+srv://...

# 5. Build and start
npm run build
npm start
```

### First Commands

```
/help          # See all commands
/rank          # Check your rank
/leaderboard   # View leaderboard
/balance       # Check your balance
```

---

## 🎮 New Admin Commands

```
/syncdb        # Sync MongoDB ↔ JSON
/backup        # Force backup
/testdb        # Test database
/debuglevels   # Debug data
```

---

## 📚 Documentation

- **[README.md](README.md)** - Complete documentation
- **[CHANGELOG.md](CHANGELOG.md)** - All changes explained
- **[RELEASE_NOTES.md](RELEASE_NOTES.md)** - Version 2.0 details
- **[GIT_COMMANDS.md](GIT_COMMANDS.md)** - Git workflow

---

## 🐛 Troubleshooting

**Leaderboard empty?**
→ Restart bot or run `/syncdb`

**Rank shows "Unranked"?**
→ Same as above

**MongoDB not connecting?**
→ Bot auto-uses JSON, no problem!

---

## ✅ That's It!

Your bot is now running Version 1.2 with all the improvements!

**Enjoy your enhanced Discord bot!** 🎉
