# 📁 Project Structure

Complete guide to the project folder and file organization.

## Root Directory

```
discord-bot/
├── src/                    # Source code (TypeScript)
├── dist/                   # Compiled code (JavaScript)
├── data/                   # JSON database files
├── docs/                   # Documentation
├── logs/                   # Log files
├── node_modules/           # Dependencies
├── .env                    # Environment variables
├── .env.example            # Environment template
├── .gitignore              # Git ignore rules
├── config.json             # Bot configuration
├── ecosystem.config.cjs    # PM2 configuration
├── package.json            # Project metadata
├── tsconfig.json           # TypeScript configuration
├── README.md               # Main documentation
├── COMMANDS.md             # Command reference
├── CONTRIBUTING.md         # Contribution guide
├── CHANGELOG.md            # Version history
└── LICENSE                 # MIT License
```

---

## Source Code (`src/`)

```
src/
├── commands/               # Command files
│   ├── admin/             # Admin commands (6)
│   ├── analytics/         # Analytics commands (4)
│   ├── battle/            # Battle commands (6)
│   ├── economy/           # Economy commands (17)
│   ├── fun/               # Fun commands (7)
│   ├── invites/           # Invite commands (5)
│   ├── leveling/          # Leveling commands (13)
│   ├── moderation/        # Moderation commands (6)
│   └── utility/           # Utility commands (9)
│
├── events/                # Event handlers
│   ├── ready.ts           # Bot ready event
│   ├── messageCreate.ts   # Message events
│   ├── interactionCreate.ts  # Slash commands
│   ├── guildMemberAdd.ts  # Member join
│   ├── guildMemberRemove.ts  # Member leave
│   ├── messageReactionAdd.ts # Reactions
│   └── voiceStateUpdate.ts   # Voice activity
│
├── database/              # Database system
│   ├── DatabaseAdapter.ts # Interface
│   ├── MongoDBAdapter.ts  # MongoDB implementation
│   ├── JsonAdapter.ts     # JSON implementation
│   └── index.ts           # Database exports
│
├── utils/                 # Utility functions
│   ├── embeds.ts          # Embed factory
│   ├── leveling.ts        # Leveling utilities
│   ├── analytics.ts       # Analytics tracker
│   ├── inviteTracker.ts   # Invite tracking
│   ├── itemService.ts     # Item management
│   ├── craftingService.ts # Crafting system
│   ├── questService.ts    # Quest system
│   └── useItem.ts         # Item usage
│
├── dashboard/             # Web dashboard
│   ├── server.ts          # Express server
│   ├── views/             # EJS templates
│   └── public/            # Static assets
│
├── handlers/              # Loaders
│   ├── commandHandler.ts  # Load commands
│   └── eventHandler.ts    # Load events
│
├── types/                 # TypeScript types
│   ├── index.ts           # Main types
│   └── database.ts        # Database types
│
└── index.ts               # Main entry point
```

---

## Commands Structure

Each command file follows this pattern:

```typescript
// src/commands/category/commandname.ts
import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { ExtendedClient } from '../../types/index.js';
import { EmbedFactory } from '../../utils/embeds.js';

export default {
  data: new SlashCommandBuilder()
    .setName('commandname')
    .setDescription('Command description'),
  
  async execute(interaction: ChatInputCommandInteraction, client: ExtendedClient) {
    // Command logic
  }
};
```

---

## Data Files (`data/`)

```
data/
├── battles.json           # Battle data
├── cooldowns.json         # Command cooldowns
├── economy.json           # User balances
├── inventory.json         # User inventories
├── items.json             # Item definitions
├── levels.json            # User XP/levels
├── logs.json              # Activity logs
├── pets.json              # User pets
├── quests.json            # Quest definitions
├── recipes.json           # Crafting recipes
├── settings.json          # Server settings
└── shop.json              # Shop items
```

---

## Documentation (`docs/`)

```
docs/
├── README.md              # Documentation index
├── setup.md               # Setup guide
├── features.md            # Features overview
├── database.md            # Database guide
├── dashboard.md           # Dashboard guide
├── analytics.md           # Analytics guide
├── moderation.md          # Moderation guide
├── config.md              # Configuration guide
├── structure.md           # This file
├── api.md                 # API reference
├── items.md               # Items & crafting
├── battles.md             # Battle system
└── development.md         # Developer guide
```

---

## Configuration Files

### `package.json`
- Project metadata
- Dependencies
- Scripts
- Engine requirements

### `tsconfig.json`
- TypeScript compiler options
- Module resolution
- Output directory

### `config.json`
- Bot configuration
- Economy settings
- Leveling settings
- Feature toggles

### `.env`
- Environment variables
- Sensitive data
- API keys
- Database URIs

### `ecosystem.config.cjs`
- PM2 configuration
- Process management
- Environment variables

---

## Build Output (`dist/`)

Mirrors `src/` structure with compiled JavaScript:

```
dist/
├── commands/
├── events/
├── database/
├── utils/
├── dashboard/
├── handlers/
├── types/
└── index.js
```

---

## File Naming Conventions

- **Commands:** `commandname.ts` (lowercase)
- **Events:** `eventName.ts` (camelCase)
- **Utils:** `utilityName.ts` (camelCase)
- **Types:** `TypeName.ts` (PascalCase)
- **Config:** `config.json` (lowercase)

---

## Import Paths

```typescript
// Relative imports
import { EmbedFactory } from '../../utils/embeds.js';

// Database imports
import { getUser, updateUser } from '../../database/index.js';

// Type imports
import { ExtendedClient } from '../../types/index.js';
```

**Note:** Always use `.js` extension in imports (TypeScript requirement for ES modules).

---

## Adding New Files

### New Command
1. Create file in `src/commands/category/`
2. Follow command template
3. Export default object
4. Rebuild: `npm run build`

### New Event
1. Create file in `src/events/`
2. Export name and execute function
3. Rebuild: `npm run build`

### New Utility
1. Create file in `src/utils/`
2. Export functions/classes
3. Import where needed
4. Rebuild: `npm run build`

---

**Last Updated:** November 2025  
**Version:** 3.0
