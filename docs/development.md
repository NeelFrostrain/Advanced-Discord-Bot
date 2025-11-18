# 🛠️ Development Guide

Guide for developers extending the bot.

## Getting Started

### Prerequisites
- Node.js 18+
- TypeScript knowledge
- Discord.js v14 knowledge
- Git

### Setup
```bash
git clone <repository>
cd discord-bot
npm install
cp .env.example .env
# Edit .env
npm run dev
```

---

## Creating Commands

### Command Template
```typescript
import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { ExtendedClient } from '../../types/index.js';
import { EmbedFactory } from '../../utils/embeds.js';

export default {
  data: new SlashCommandBuilder()
    .setName('commandname')
    .setDescription('Description'),
  
  async execute(interaction: ChatInputCommandInteraction, client: ExtendedClient) {
    try {
      // Your code here
      const embed = EmbedFactory.success('Title', 'Description');
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error:', error);
      const errorEmbed = EmbedFactory.error('Error', 'Something went wrong');
      await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  }
};
```

### Adding Options
```typescript
.addStringOption(option =>
  option.setName('name')
    .setDescription('Description')
    .setRequired(true)
)
.addUserOption(option =>
  option.setName('user')
    .setDescription('User')
    .setRequired(false)
)
```

---

## Database Operations

### Reading Data
```typescript
import { getUser } from '../../database/index.js';

const user = await getUser(userId, guildId);
```

### Writing Data
```typescript
import { updateUser } from '../../database/index.js';

await updateUser(userId, guildId, { balance: 1000 });
```

### Custom Queries
```typescript
import { getDatabase } from '../../database/index.js';

const db = getDatabase();
const data = await db.get('path.to.data');
await db.set('path.to.data', value);
```

---

## Using Embeds

```typescript
import { EmbedFactory } from '../../utils/embeds.js';

// Success (green)
const embed = EmbedFactory.success('Title', 'Description');

// Error (red)
const embed = EmbedFactory.error('Title', 'Description');

// Info (blue)
const embed = EmbedFactory.info('Title', 'Description');

// Warning (orange)
const embed = EmbedFactory.warning('Title', 'Description');

// Economy (gold)
const embed = EmbedFactory.economy('Title', 'Description');

// Leveling (purple)
const embed = EmbedFactory.leveling('Title', 'Description');
```

---

## Error Handling

Always wrap command logic in try-catch:

```typescript
try {
  // Command logic
} catch (error) {
  console.error('Command error:', error);
  const errorEmbed = EmbedFactory.error('Error', 'Failed to execute command');
  await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
}
```

---

## Testing

### Manual Testing
```bash
npm run dev
# Test in Discord
```

### Build Testing
```bash
npm run build
npm start
```

---

## Best Practices

- ✅ Use TypeScript types
- ✅ Handle all errors
- ✅ Use EmbedFactory
- ✅ Add cooldowns
- ✅ Check permissions
- ✅ Validate input
- ✅ Comment complex code
- ✅ Follow naming conventions

---

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

---

**Last Updated:** November 2025  
**Version:** 3.0
