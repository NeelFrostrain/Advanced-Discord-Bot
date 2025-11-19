# 🤖 Advanced Discord Bot

> A complete, production-ready Discord bot with 70+ commands, analytics, economy, leveling, RPG systems, and MongoDB/JSON database.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![Discord.js](https://img.shields.io/badge/Discord.js-14.14-blue)](https://discord.js.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

---

## ✨ Features

### 💰 Economy System
- **Balance Management** - Wallet & bank system
- **Daily/Weekly Rewards** - Claim coins regularly
- **Work System** - Earn coins by working
- **Shop & Inventory** - Buy and manage items
- **Trading** - Trade coins with other users
- **Gambling Games** - Coinflip, Blackjack, Slots, Roulette

### ⭐ Advanced Leveling
- **XP & Levels** - Gain XP from chatting
- **Custom Rank Cards** - Personalized rank displays
- **Leaderboards** - Server-wide rankings (levels & economy)
- **Role Rewards** - Auto-assign roles at specific levels
- **XP Multipliers** - Role-based XP boosts
- **Rank Comparison** - Compare stats with others

### ⚔️ Battle & RPG
- **Monster Hunting** - Hunt for coins and XP
- **PvP Battles** - Challenge other users
- **Pet System** - Summon and collect pets
- **Equipment** - Weapons and armor
- **Battle Stats** - Track your combat power

### 📊 Analytics System
- **Member Activity** - Track messages, voice, reactions
- **Channel Statistics** - Most active channels
- **Server Health** - Growth rate, engagement metrics
- **Activity Scores** - Measure user engagement
- **Leaderboards** - Top active members

### 🎫 Invite Tracker
- **Invite Tracking** - Track who invited whom
- **Fake Detection** - Auto-detect suspicious accounts
- **Quality Scoring** - Rate invite quality
- **Invite Leaderboard** - Top inviters
- **Auto-Kick** - Remove fake accounts automatically

### 🛡️ Moderation
- **Ban/Kick** - Remove problematic users
- **Timeout** - Temporarily mute users
- **Message Clear** - Bulk delete messages
- **Slowmode** - Rate limit channels
- **Channel Lockdown** - Lock/unlock channels

### 👑 Admin Tools
- **Giveaways** - Create and manage giveaways
- **Announcements** - Send formatted announcements
- **Auto-Roles** - Assign roles on join
- **Welcome Messages** - Greet new members
- **Database Management** - Sync, backup, debug tools

### 📦 Utility
- **User Info** - View user details
- **Server Info** - View server statistics
- **Avatar** - Display user avatars
- **Polls** - Create polls with reactions
- **Reminders** - Set reminders
- **AFK System** - Auto-respond when AFK

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or higher
- MongoDB (optional - JSON fallback available)
- Discord Bot Token

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd discord-bot

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your bot token and settings

# Build TypeScript
npm run build

# Start the bot
npm start
```

### Environment Variables

Create a `.env` file:

```env
# Required
TOKEN=your_discord_bot_token
CLIENT_ID=your_bot_client_id
PREFIX=!

# Optional - MongoDB (will use JSON if not provided)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/

# Optional - Dashboard
CLIENT_SECRET=your_client_secret
DASHBOARD_PORT=3000
```

---

## 🗄️ Database System

### Dual Database Architecture

**MongoDB (Primary)**
- Cloud-based scalable database
- Automatic backups every 5 minutes
- Best for production use

**JSON (Fallback)**
- Local file-based storage
- Zero configuration needed
- Automatic fallback if MongoDB fails

### Key Features
- ✅ **Auto-Sync** - MongoDB ↔ JSON every 5 minutes
- ✅ **Auto-Fallback** - Seamlessly switches to JSON if MongoDB fails
- ✅ **Manual Sync** - `/syncdb` command for manual synchronization
- ✅ **Zero Downtime** - Bot never crashes due to database issues

### Admin Commands
```
/syncdb direction:JSON → MongoDB    # Sync JSON to MongoDB
/syncdb direction:MongoDB → JSON    # Sync MongoDB to JSON
/backup                             # Force immediate backup
/testdb                             # Test database access
/debuglevels                        # Debug database structure
```

---

## 📊 Command Categories

### Economy Commands (17)
```
/balance [user]          # Check balance
/daily                   # Claim daily reward
/weekly                  # Claim weekly reward
/work                    # Work for coins
/shop                    # View shop items
/buy <item>              # Buy an item
/inventory [user]        # View inventory
/trade <user> <amount>   # Trade coins
/coinflip <bet>          # Flip a coin
/blackjack <bet>         # Play blackjack
/slots <bet>             # Play slots
/roulette <bet>          # Play roulette
```

### Leveling Commands (13)
```
/rank [user]             # View rank card
/rankstats [user]        # Detailed rank statistics
/rankcompare <user>      # Compare ranks
/leaderboard [type]      # Server leaderboard
/toprank [limit]         # Top ranked users
/rankrewards             # View rank rewards
/rankconfig              # Configure leveling (Admin)
/rankroles               # Manage rank roles (Admin)
/givexp <user> <amount>  # Give XP (Admin)
/removexp <user> <amount># Remove XP (Admin)
/setxp <user> <amount>   # Set XP (Admin)
/rankreset <user>        # Reset rank (Admin)
```

### Battle & RPG Commands (6)
```
/hunt                    # Hunt monsters
/battle <user> [wager]   # PvP battle
/stats [user]            # View battle stats
/pet view                # View your pets
/pet summon              # Summon a pet
/equip <item>            # Equip weapon/armor
```

### Analytics Commands (4)
```
/useractivity [user]     # User activity stats
/topactive [period]      # Most active members
/channelstats            # Channel statistics
/serverstats [period]    # Server statistics
```

### Invite Commands (5)
```
/invites [user]          # View invite stats
/whoinvited <user>       # Check who invited
/inviteleaderboard       # Top inviters
/fakeinvites             # View suspicious joins
/addinvites <user> <amt> # Add bonus invites (Admin)
```

### Moderation Commands (6)
```
/ban <user> [reason]     # Ban a user
/kick <user> [reason]    # Kick a user
/timeout <user> <time>   # Timeout a user
/clear <amount> [user]   # Clear messages
/slowmode <seconds>      # Set slowmode
/lockdown [lock]         # Lock/unlock channel
```

### Admin Commands (6)
```
/giveaway                # Create giveaway
/announce                # Send announcement
/autorole                # Configure auto-roles
/welcome                 # Configure welcome messages
/syncdb                  # Sync databases
/backup                  # Backup database
```

### Utility Commands (9)
```
/userinfo [user]         # User information
/serverinfo              # Server information
/avatar [user]           # User avatar
/poll <question>         # Create a poll
/remind <time> <msg>     # Set a reminder
/afk [reason]            # Set AFK status
/ping                    # Check bot latency
/help [command]          # Help menu
```

---

## 🎯 Key Highlights

### Version 2.0 Updates

✅ **User Mention System** - Proper Discord notifications (19 commands fixed)  
✅ **Leaderboard Fix** - Accurate rankings and data retrieval  
✅ **Database Sync** - MongoDB ↔ JSON automatic backup system  
✅ **Level-Up Notifications** - Enhanced with proper formatting  
✅ **Rank Calculation** - Unified XP formula across all systems  
✅ **Admin Tools** - 4 new database management commands  
✅ **Auto-Fallback** - Seamless JSON fallback if MongoDB fails  

See [CHANGELOG.md](CHANGELOG.md) for complete details.

### Production Features

- ✅ **70+ Commands** across 9 categories
- ✅ **TypeScript** with full type safety
- ✅ **Dual Database** - MongoDB + JSON fallback
- ✅ **Never Crashes** - Comprehensive error handling
- ✅ **Auto-Backup** - Every 5 minutes
- ✅ **Slash Commands** - Modern Discord interactions
- ✅ **Prefix Support** - Legacy command support

---

## 📁 Project Structure

```
discord-bot/
├── src/
│   ├── commands/           # All bot commands
│   │   ├── admin/          # Admin commands
│   │   ├── analytics/      # Analytics commands
│   │   ├── battle/         # Battle/RPG commands
│   │   ├── economy/        # Economy commands
│   │   ├── invites/        # Invite tracking
│   │   ├── leveling/       # Leveling commands
│   │   ├── moderation/     # Moderation commands
│   │   └── utility/        # Utility commands
│   ├── events/             # Discord event handlers
│   ├── database/           # Database adapters
│   │   ├── MongoDBAdapter.ts
│   │   ├── JsonAdapter.ts
│   │   └── index.ts
│   ├── utils/              # Utility functions
│   │   ├── leveling.ts     # XP & level calculations
│   │   ├── embeds.ts       # Embed factory
│   │   ├── analytics.ts    # Analytics tracking
│   │   └── inviteTracker.ts
│   ├── types/              # TypeScript types
│   └── index.ts            # Main entry point
├── database/
│   └── json/
│       └── data.json       # JSON database
├── config.json             # Bot configuration
├── .env                    # Environment variables
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript config
├── CHANGELOG.md            # Version 2.0 changes
└── README.md               # This file
```

---

## 🔧 Configuration

### Bot Settings (`config.json`)

```json
{
  "economy": {
    "dailyAmount": 1000,
    "weeklyAmount": 5000,
    "workMin": 100,
    "workMax": 500,
    "dailyCooldown": 86400000,
    "workCooldown": 3600000
  },
  "leveling": {
    "xpPerMessage": 15,
    "xpCooldown": 60000,
    "levelUpChannel": null
  },
  "battle": {
    "huntCooldown": 30000,
    "critChance": 0.15
  }
}
```

### Leveling System

**XP Formula:**
```
level = floor(sqrt(totalXP / 100))
```

**XP Requirements:**
- Level 1: 0-99 XP
- Level 2: 100-399 XP
- Level 3: 400-899 XP
- Level 5: 1,600-2,499 XP
- Level 10: 10,000 XP
- Level 20: 40,000 XP

---

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

### Using PM2 (Recommended)
```bash
npm install -g pm2
pm2 start dist/index.js --name discord-bot
pm2 save
pm2 startup
```

### Using Docker
```bash
docker-compose up -d
```

---

## 🔍 Troubleshooting

### Leaderboard Shows "No Data"
**Solution:** Restart bot or run `/syncdb direction:JSON → MongoDB`

### Rank Shows "Unranked"
**Solution:** Same as above - the bot will auto-read from JSON after restart

### MongoDB Connection Failed
**Solution:** Bot automatically uses JSON fallback - no action needed

### Commands Not Registering
**Solution:** 
```bash
npm run build
npm start
```
Wait 1-2 minutes for Discord to update commands globally.

---

## 📚 Documentation

- **[CHANGELOG.md](CHANGELOG.md)** - Version 2.0 complete changes
- **[Setup Guide](#quick-start)** - Installation instructions
- **[Commands](#command-categories)** - All available commands
- **[Database](#database-system)** - Database architecture
- **[Configuration](#configuration)** - Bot settings

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🔗 Resources

- [Discord.js Documentation](https://discord.js.org)
- [Discord Developer Portal](https://discord.com/developers)
- [MongoDB Documentation](https://docs.mongodb.com)
- [TypeScript Documentation](https://www.typescriptlang.org)

---

## 💡 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check [CHANGELOG.md](CHANGELOG.md) for recent updates
- Review troubleshooting section above

---

**Built with ❤️ using TypeScript & Discord.js v14**

**Version 2.0** - Complete overhaul with enhanced user mentions, fixed leaderboards, MongoDB/JSON sync system, and 4 new admin commands.
