# 🤝 Contributing to Advanced Discord Bot

Thank you for considering contributing to this project! This document provides guidelines for contributing.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)

## 📜 Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all.

### Our Standards

**Positive behavior includes:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community

**Unacceptable behavior includes:**
- Trolling, insulting/derogatory comments, and personal attacks
- Public or private harassment
- Publishing others' private information without permission
- Other conduct which could reasonably be considered inappropriate

## 🎯 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce**
- **Expected behavior**
- **Actual behavior**
- **Screenshots** (if applicable)
- **Environment details** (OS, Node.js version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Clear title and description**
- **Use case** - Why is this enhancement useful?
- **Possible implementation** - How could this be implemented?
- **Alternatives considered**

### Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Make your changes
4. Test thoroughly
5. Commit your changes (see [Commit Guidelines](#commit-guidelines))
6. Push to your branch (`git push origin feature/AmazingFeature`)
7. Open a Pull Request

## 🛠️ Development Setup

### Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn
- Git
- MongoDB (optional)

### Setup Steps

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/advanced-discord-bot.git
cd advanced-discord-bot

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your bot token
# BOT_TOKEN=your_token_here

# Build
npm run build

# Run in development mode
npm run dev
```

### Project Structure

```
src/
├── commands/       # Command files
├── events/         # Event handlers
├── database/       # Database adapters
├── utils/          # Utility functions
├── dashboard/      # Web dashboard
└── index.ts        # Main entry point
```

## 📝 Coding Standards

### TypeScript

- Use TypeScript for all new code
- Enable strict mode
- Provide type annotations
- Avoid `any` type when possible

### Code Style

```typescript
// ✅ Good
async function getUserBalance(userId: string, guildId: string): Promise<number> {
  const user = await getUser(userId, guildId);
  return user.balance;
}

// ❌ Bad
async function getUserBalance(userId, guildId) {
  const user = await getUser(userId, guildId);
  return user.balance;
}
```

### Naming Conventions

- **Files:** `camelCase.ts` (e.g., `userInfo.ts`)
- **Classes:** `PascalCase` (e.g., `DatabaseAdapter`)
- **Functions:** `camelCase` (e.g., `getUserBalance`)
- **Constants:** `UPPER_SNAKE_CASE` (e.g., `MAX_BALANCE`)
- **Interfaces:** `PascalCase` (e.g., `UserData`)

### Error Handling

Always handle errors gracefully:

```typescript
try {
  const user = await getUser(userId, guildId);
  // ... do something
} catch (error) {
  console.error('Error fetching user:', error);
  const errorEmbed = EmbedFactory.error('Error', 'Failed to fetch user data.');
  await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
}
```

### Comments

- Write self-documenting code
- Add comments for complex logic
- Use JSDoc for functions

```typescript
/**
 * Calculate the required XP for a specific level
 * @param level - The target level
 * @returns The total XP required
 */
function calculateRequiredXP(level: number): number {
  return level * level * 100;
}
```

## 📦 Adding New Commands

### Command Template

```typescript
import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { ExtendedClient } from '../../types/index.js';
import { EmbedFactory } from '../../utils/embeds.js';

export default {
  data: new SlashCommandBuilder()
    .setName('commandname')
    .setDescription('Command description'),
  
  async execute(interaction: ChatInputCommandInteraction, client: ExtendedClient) {
    try {
      // Command logic here
      
      const embed = EmbedFactory.success('Success', 'Command executed!');
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Command error:', error);
      const errorEmbed = EmbedFactory.error('Error', 'Something went wrong.');
      await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  }
};
```

### Command Checklist

- [ ] Command file in correct category folder
- [ ] Proper error handling
- [ ] Uses EmbedFactory for responses
- [ ] Includes cooldown if needed
- [ ] Permission checks if required
- [ ] Tested in Discord
- [ ] Documentation updated

## 🔄 Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat:** New feature
- **fix:** Bug fix
- **docs:** Documentation changes
- **style:** Code style changes (formatting, etc.)
- **refactor:** Code refactoring
- **test:** Adding or updating tests
- **chore:** Maintenance tasks

### Examples

```bash
feat(economy): add trading system

Implemented user-to-user coin trading with confirmation system.
Includes cooldown and validation checks.

Closes #123

---

fix(leveling): correct XP calculation

Fixed bug where XP was not calculating correctly for levels above 50.

---

docs(readme): update installation instructions

Added MongoDB Atlas setup instructions and troubleshooting section.
```

## 🔍 Pull Request Process

### Before Submitting

1. **Test your changes** thoroughly
2. **Update documentation** if needed
3. **Follow coding standards**
4. **Write clear commit messages**
5. **Ensure build passes** (`npm run build`)

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How has this been tested?

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tests added/updated
- [ ] Build passes
```

### Review Process

1. Maintainer reviews code
2. Feedback provided if needed
3. Changes requested or approved
4. PR merged into main branch

## 🧪 Testing

### Manual Testing

Test your changes in a real Discord server:

```bash
# Start bot in development mode
npm run dev

# Test command in Discord
/yourcommand
```

### Testing Checklist

- [ ] Command responds correctly
- [ ] Error handling works
- [ ] Permissions checked
- [ ] Cooldowns work
- [ ] Database updates correctly
- [ ] No console errors

## 📚 Documentation

### When to Update Docs

- Adding new commands
- Changing existing features
- Adding configuration options
- Fixing bugs that affect usage

### Documentation Files

- `README.md` - Main overview
- `COMMANDS.md` - Command reference
- `docs/` - Detailed guides
- Code comments - Complex logic

## 🎨 Design Principles

### Embeds

Use `EmbedFactory` for consistent styling:

```typescript
import { EmbedFactory } from '../../utils/embeds.js';

// Success
const embed = EmbedFactory.success('Title', 'Description');

// Error
const embed = EmbedFactory.error('Title', 'Description');

// Info
const embed = EmbedFactory.info('Title', 'Description');

// Economy
const embed = EmbedFactory.economy('Title', 'Description');
```

### Database

Use the database adapter for consistency:

```typescript
import { getUser, updateUser } from '../../database/index.js';

const user = await getUser(userId, guildId);
user.balance += 100;
await updateUser(userId, guildId, { balance: user.balance });
```

## 🐛 Debugging

### Enable Debug Logging

```typescript
console.log('Debug:', variable);
console.error('Error:', error);
```

### Common Issues

- **Commands not registering:** Wait 1-5 minutes or restart bot
- **Database errors:** Check connection string
- **Permission errors:** Verify bot has required permissions

## 📞 Getting Help

- Check [Documentation](docs/)
- Review existing issues
- Ask in discussions
- Contact maintainers

## 🏆 Recognition

Contributors will be:
- Listed in CHANGELOG.md
- Credited in release notes
- Mentioned in README.md (for significant contributions)

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing! 🎉
