# 📁 Project Structure - Version 1.5

## Directory Layout

```
discord-bot/
├── src/                    # Source code
│   ├── commands/           # Bot commands (78 total)
│   │   ├── admin/          # 10 admin commands
│   │   ├── analytics/      # 4 analytics commands
│   │   ├── battle/         # 6 battle/RPG commands
│   │   ├── economy/        # 17 economy commands
│   │   ├── fun/            # 8 fun commands (NEW: AI chat)
│   │   ├── invites/        # 5 invite tracking commands
│   │   ├── leveling/       # 13 leveling commands
│   │   ├── moderation/     # 6 moderation commands
│   │   └── utility/        # 9 utility commands
│   ├── events/             # Event handlers
│   │   ├── aiBestFriend.ts # AI chat handler (NEW)
│   │   ├── messageCreate.ts
│   │   ├── interactionCreate.ts
│   │   └── ...
│   ├── data/               # Data files
│   │   └── shopItems.ts    # 130+ shop items (NEW)
│   ├── database/           # Database layer
│   │   ├── MongoDBAdapter.ts
│   │   ├── JsonAdapter.ts
│   │   └── index.ts
│   ├── utils/              # Utility functions
│   │   ├── embeds.ts
│   │   ├── leveling.ts
│   │   └── ...
│   ├── types/              # TypeScript types
│   └── index.ts            # Main entry point
├── docs/                   # Documentation (NEW)
│   ├── setup/              # Setup guides
│   │   ├── AI_BEST_FRIEND_SETUP.md
│   │   ├── GET_GOOGLE_API_KEY.md
│   │   └── PRODUCTION_SETUP.md
│   ├── features/           # Feature docs
│   │   ├── AI_BEST_FRIEND_FEATURE.md
│   │   ├── DEBUG_COMMANDS_DISABLED.md
│   │   └── SHOP_ITEMS_UPDATE.md
│   ├── guides/             # User guides
│   ├── COMMANDS.md         # Command reference
│   ├── VERSION_1.5.md      # Version summary
│   └── PROJECT_STRUCTURE.md # This file
├── database/               # Database storage
│   └── json/
│       └── data.json       # JSON database
├── dist/                   # Compiled JavaScript
├── node_modules/           # Dependencies
├── .env                    # Environment variables
├── .env.example            # Environment template
├── .gitignore              # Git ignore rules
├── CHANGELOG.md            # Version history
├── COMMIT.txt              # Git commit instructions
├── config.json             # Bot configuration
├── LICENSE                 # MIT License
├── package.json            # Dependencies & scripts
├── README.md               # Main documentation
└── tsconfig.json           # TypeScript config
```

## Key Files

### Configuration
- `.env` - Environment variables (API keys, tokens)
- `config.json` - Bot settings (economy, leveling, etc.)
- `tsconfig.json` - TypeScript compiler settings

### Documentation
- `README.md` - Main project documentation
- `CHANGELOG.md` - Version history
- `COMMIT.txt` - Git commit instructions
- `docs/` - Organized documentation

### Source Code
- `src/index.ts` - Bot entry point
- `src/commands/` - All bot commands
- `src/events/` - Event handlers
- `src/data/` - Data files (shop items, etc.)
- `src/database/` - Database adapters
- `src/utils/` - Helper functions

## Command Categories

| Category | Count | Description |
|----------|-------|-------------|
| Admin | 10 | Server management, database tools |
| Analytics | 4 | Server statistics, activity tracking |
| Battle | 6 | PvP, hunting, pets, equipment |
| Economy | 17 | Balance, shop, gambling, trading |
| Fun | 8 | AI chat, 8ball, memes, games |
| Invites | 5 | Invite tracking, leaderboards |
| Leveling | 13 | Ranks, XP, leaderboards, rewards |
| Moderation | 6 | Ban, kick, timeout, clear |
| Utility | 9 | User info, server info, polls |
| **Total** | **78** | |

## New in Version 1.5

### Added
- `src/commands/fun/chat.ts` - AI chat command
- `src/events/aiBestFriend.ts` - AI event handler
- `src/data/shopItems.ts` - 130+ shop items
- `docs/` - Organized documentation folder

### Updated
- `src/commands/economy/shop.ts` - Enhanced with filtering
- `src/commands/economy/buy.ts` - Updated for new items
- `src/commands/admin/testdb.ts` - Production security
- `src/commands/admin/debuglevels.ts` - Production security

### Removed
- Test scripts (list-models.js, test-gemini-api.js)
- Old documentation files (moved to docs/)

## Database Structure

### MongoDB/JSON Paths
```
levels.{guildId}.{userId}     # User XP and levels
users.{guildId}.{userId}      # User economy data
rankConfig.{guildId}          # Server rank settings
inventory.{guildId}.{userId}  # User inventory
analytics.{guildId}           # Server analytics
invites.{guildId}             # Invite tracking
```

## Environment Variables

Required:
- `TOKEN` - Discord bot token
- `CLIENT_ID` - Bot application ID

Optional:
- `MONGODB_URI` - MongoDB connection (fallback to JSON)
- `GOOGLE_API_KEY` - For AI chat feature
- `NODE_ENV` - Environment (development/production)
- `ENABLE_DEBUG_COMMANDS` - Enable debug commands

## Scripts

```bash
npm run build      # Compile TypeScript
npm start          # Build and start bot
npm run dev        # Development mode with watch
```

## Documentation

All documentation is organized in `docs/`:
- **Setup guides** - Installation and configuration
- **Feature docs** - Detailed feature explanations
- **User guides** - How-to guides
- **Command reference** - All 78 commands

---

**Version:** 1.5  
**Last Updated:** November 19, 2025  
**Status:** Production Ready
