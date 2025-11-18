# 🤖 Advanced Discord Bot

> A complete, production-ready Discord bot with 70+ commands, analytics, economy, leveling, RPG systems, and web dashboard.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![Discord.js](https://img.shields.io/badge/Discord.js-14.14-blue)](https://discord.js.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

## ✨ Features

### 💰 Economy System (17 commands)
Complete economy with wallet/bank, shop, inventory, trading, crafting, quests, and 4 gambling games (slots, blackjack, coinflip, roulette).

### ⭐ Advanced Leveling (13 commands)
Custom rank cards, role rewards, XP multipliers, detailed statistics, leaderboards, and comparison system.

### ⚔️ Battle & RPG (6 commands)
Hunt monsters, PvP battles, pet system, equipment, and stats tracking.

### 📊 Analytics System (4 commands)
Track member activity, voice time, reactions, channel stats, and server health metrics.

### 🎫 Invite Tracker (5 commands)
Complete invite tracking with fake/alt detection, quality scoring, and auto-kick system.

### 🛡️ Moderation (6 commands)
Ban, kick, timeout, message clearing, slowmode, and channel lockdown.

### 👑 Admin Tools (6 commands)
Giveaways, reaction roles, welcome messages, auto-roles, and announcements.

### 📦 Utility (9 commands)
Info commands, polls, reminders, AFK system, and more.

### 🎮 Fun (7 commands)
8ball, memes, dice, jokes, quotes, and games.

### 🌐 Web Dashboard
OAuth2 authentication, server management, analytics viewing, and settings configuration.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your bot token

# Build and start
npm run build
npm start
```

## 📚 Documentation

- **[Setup Guide](docs/setup.md)** - Installation and configuration
- **[Features](docs/features.md)** - All bot features explained
- **[Commands](docs/commands.md)** - Complete command reference
- **[Dashboard](docs/dashboard.md)** - Web dashboard setup
- **[Database](docs/database.md)** - MongoDB + JSON fallback
- **[Development](docs/development.md)** - For developers

## 🗄️ Database System

**Dual Database Architecture:**
- **MongoDB** (Primary) - Scalable cloud database
- **JSON** (Fallback) - Automatic fallback, no external dependencies

The bot automatically switches to JSON if MongoDB fails, ensuring it never crashes.

## 🎯 Key Highlights

- ✅ **70+ Commands** across 9 categories
- ✅ **TypeScript** with full type safety
- ✅ **MongoDB + JSON** fallback system
- ✅ **Never Crashes** with comprehensive error handling
- ✅ **Production Ready** with PM2 support
- ✅ **Web Dashboard** with OAuth2
- ✅ **Complete Documentation** for everything

## 📊 Project Structure

```
discord-bot/
├── src/
│   ├── commands/       # 70+ commands
│   ├── events/         # Event handlers
│   ├── database/       # Database adapters
│   ├── utils/          # Utility functions
│   ├── dashboard/      # Web dashboard
│   └── index.ts        # Main entry point
├── docs/               # Documentation
├── data/               # JSON database
├── config.json         # Bot configuration
└── package.json        # Dependencies
```

## 🔧 Configuration

Edit `config.json` to customize:
- Economy settings (daily rewards, work amounts)
- Leveling system (XP rates, cooldowns)
- Battle system (hunt cooldown, crit chance)
- Feature toggles

## 🌐 Dashboard

Access your bot through a web browser:

1. Get Client Secret from Discord Developer Portal
2. Add to `.env`: `CLIENT_SECRET=your_secret`
3. Add redirect URL: `http://localhost:3000/auth/callback`
4. Start bot: `npm start`
5. Visit: `http://localhost:3000`

See [Dashboard Guide](docs/dashboard.md) for details.

## 📝 Commands Overview

| Category | Commands | Description |
|----------|----------|-------------|
| Economy | 17 | Balance, shop, trading, gambling |
| Leveling | 13 | Ranks, XP, leaderboards, rewards |
| Battle | 6 | Hunting, PvP, pets, equipment |
| Analytics | 4 | Activity tracking, statistics |
| Invites | 5 | Invite tracking, anti-alt |
| Moderation | 6 | Ban, kick, timeout, clear |
| Admin | 6 | Giveaways, roles, welcome |
| Utility | 9 | Info, polls, reminders |
| Fun | 7 | Games, jokes, memes |

See [Commands Reference](docs/commands.md) for complete list.

## 🚀 Deployment

### Using PM2 (Recommended)
```bash
npm install -g pm2
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

### Using Docker
```bash
docker-compose up -d
```

See [Setup Guide](docs/setup.md) for detailed deployment instructions.

## 🤝 Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) for details.

## 🔗 Links

- [Documentation](docs/)
- [Discord.js Guide](https://discord.js.org)
- [MongoDB Docs](https://docs.mongodb.com)

---

**Built with ❤️ using TypeScript & Discord.js v14**
