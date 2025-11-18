# ✨ Features Guide

Complete guide to all bot features and systems.

## 📋 Table of Contents

- [Economy System](#economy-system)
- [Leveling System](#leveling-system)
- [Battle & RPG](#battle--rpg)
- [Analytics System](#analytics-system)
- [Invite Tracker](#invite-tracker)
- [Moderation Tools](#moderation-tools)
- [Admin Features](#admin-features)
- [Utility Commands](#utility-commands)
- [Fun Commands](#fun-commands)
- [Web Dashboard](#web-dashboard)

---

## 💰 Economy System

### Overview
Complete economy system with wallet/bank, shop, trading, crafting, quests, and gambling.

### Features

#### Wallet & Bank
- **Wallet:** Active balance for spending
- **Bank:** Safe storage (protected from gambling losses)
- **Transfer:** Deposit and withdraw between wallet and bank

#### Earning Money
- **Daily Reward:** 500 coins every 24 hours
- **Weekly Reward:** 3500 coins every 7 days
- **Work:** Earn 50-200 coins per hour
- **Quests:** Complete tasks for rewards
- **Gambling:** Win big (or lose it all)

#### Shopping
- **Shop:** 25+ items across 6 categories
- **Inventory:** Store and manage items
- **Crafting:** Create items from materials
- **Trading:** Exchange coins with other users

#### Gambling Games
1. **Slots** - Spin for jackpot (10x bet)
2. **Blackjack** - Beat the dealer (1.5x bet)
3. **Coinflip** - Heads or tails (2x bet)
4. **Roulette** - Red, black, or green (2-35x bet)

### Commands
See [Commands Reference](../COMMANDS.md#economy-commands)

---

## ⭐ Leveling System

### Overview
Advanced XP and ranking system with custom rank cards, role rewards, and multipliers.

### Features

#### XP Gain
- **Messages:** Earn 15-25 XP per message (configurable)
- **Cooldown:** 60 seconds between XP gains (configurable)
- **Multipliers:** Boost XP for specific roles (1x-5x)
- **Formula:** Level² × 100 XP required

#### Rank Cards
- **Custom Colors:** Set background, progress bar, text, accent colors
- **Statistics:** Level, XP, rank, messages, progress bar
- **Comparison:** Compare your rank with friends

#### Role Rewards
- **Auto-Assignment:** Roles given at specific levels
- **Multiple Rewards:** Set rewards every 5-10 levels
- **Customizable:** Admins configure all rewards

#### Leaderboards
- **Server Ranking:** Top 10-25 users
- **Statistics:** Level, XP, messages, rank position
- **Filters:** Levels or economy leaderboards

### Configuration

```bash
# Set XP per message
/rankconfig xp amount:15

# Set cooldown
/rankconfig cooldown seconds:60

# Add role reward
/rankroles add level:10 role:@Regular

# Set XP multiplier
/rankconfig multiplier role:@Booster multiplier:1.5
```

### Commands
See [Commands Reference](../COMMANDS.md#leveling-commands)

---

## ⚔️ Battle & RPG

### Overview
Hunt monsters, battle other players, collect pets, and equip gear.

### Features

#### Monster Hunting
- **5 Monster Types:** Slime, Goblin, Wolf, Orc, Dragon
- **Rewards:** Coins + XP based on difficulty
- **Cooldown:** 30 seconds between hunts

#### PvP Battles
- **Turn-Based Combat:** Strategic battle system
- **Wagering:** Bet coins on battle outcome
- **Stats:** Attack, defense, HP tracked

#### Pet System
- **5 Pet Types:** Dog, Cat, Eagle, Lion, Phoenix
- **Rarities:** Common, Uncommon, Rare, Legendary
- **Summoning:** 2000 coins per pet egg

#### Equipment
- **Weapons:** Increase attack power
- **Armor:** Increase defense
- **Slots:** Weapon, helmet, chest, boots

### Commands
See [Commands Reference](../COMMANDS.md#battle-commands)

---

## 📊 Analytics System

### Overview
Track member activity, voice time, reactions, and server health metrics.

### Features

#### Member Tracking
- **Messages:** Count per user
- **Voice Time:** Minutes in voice channels
- **Reactions:** Emoji usage statistics
- **Activity Score:** Calculated from all activities
- **Engagement Score:** Average activity per day
- **Streaks:** Consecutive active days

#### Channel Analytics
- **Messages per Channel:** Track most active channels
- **Voice Activity:** Minutes per voice channel
- **Hourly Patterns:** Peak activity hours
- **Rankings:** Top 10 channels

#### Server Analytics
- **Total Messages:** All-time count
- **Growth Rate:** Percentage change
- **Active Members:** Daily/weekly active users
- **Health Metrics:** Server activity trends
- **Join/Leave Stats:** Member turnover

### Time Periods
- **24 hours:** Recent activity
- **7 days:** Weekly trends
- **30 days:** Monthly overview
- **90 days:** Quarterly analysis

### Commands
See [Commands Reference](../COMMANDS.md#analytics-commands)

---

## 🎫 Invite Tracker

### Overview
Complete invite tracking with fake/alt detection and auto-kick system.

### Features

#### Invite Tracking
- **Normal Invites:** Standard invite links
- **Vanity URL:** Custom server URLs
- **OAuth Joins:** Bot/widget joins
- **Unknown Methods:** Untracked joins

#### Statistics
- **Total Invites:** All invites by user
- **Real Invites:** Valid accounts
- **Fake Invites:** Suspicious accounts
- **Left Invites:** Members who left
- **Bonus Invites:** Manual additions

#### Fake/Alt Detection
- **Account Age:** Flag accounts < 7 days old
- **Quality Score:** 0-100 rating
- **Suspicion Reasons:** Detailed analysis
- **Auto-Kick:** Automatic removal option

#### Quality Scoring
```
Base Score: 100
- Account age < 7 days: -10 per day
- Account age < 1 day: -30
- No avatar: -20
- Suspicious username: -10
- Multiple flags: -30

Final Score: 0-100
```

### Configuration

```bash
# Set log channel
/inviteconfig logchannel channel:#logs

# Set minimum account age
/inviteconfig minaccountage days:7

# Enable auto-kick
/inviteconfig autokick type:fakes enabled:true
```

### Commands
See [Commands Reference](../COMMANDS.md#invite-commands)

---

## 🛡️ Moderation Tools

### Overview
Comprehensive moderation tools for server management.

### Features

#### User Actions
- **Ban:** Permanently remove users
- **Kick:** Remove users (can rejoin)
- **Timeout:** Temporarily mute users
- **Message History:** Delete 0-7 days of messages

#### Channel Management
- **Clear Messages:** Bulk delete 1-100 messages
- **Slowmode:** Set message cooldown (0-21600 seconds)
- **Lockdown:** Lock/unlock channels

#### Logging
- **Mod Actions:** Track all moderation actions
- **Reasons:** Required for accountability
- **Timestamps:** When actions occurred

### Permissions
- **Ban Members:** Required for /ban
- **Kick Members:** Required for /kick
- **Moderate Members:** Required for /timeout
- **Manage Messages:** Required for /clear
- **Manage Channels:** Required for /slowmode, /lockdown

### Commands
See [Commands Reference](../COMMANDS.md#moderation-commands)

---

## 👑 Admin Features

### Overview
Server administration and configuration tools.

### Features

#### Giveaways
- **Duration:** 1h to 30 days
- **Winners:** 1-10 winners
- **Reaction Entry:** React with 🎉 to enter
- **Auto-Selection:** Random winner selection

#### Reaction Roles
- **Self-Assign:** Users react to get roles
- **Multiple Roles:** Up to 20 roles per message
- **Custom Emojis:** Use server emojis

#### Welcome System
- **Custom Messages:** Personalized welcome
- **Variables:** {user}, {username}, {server}, {memberCount}
- **Channel Selection:** Choose welcome channel

#### Auto-Role
- **New Members:** Automatically assign role
- **Single Role:** One role per server
- **Instant:** Applied on join

#### Announcements
- **Styled Embeds:** Professional announcements
- **Color Options:** Blue, Green, Red, Gold, Purple
- **Channel Selection:** Send to any channel

### Commands
See [Commands Reference](../COMMANDS.md#admin-commands)

---

## 📦 Utility Commands

### Overview
Helpful utility commands for information and tools.

### Features

#### Information
- **User Info:** Avatar, ID, join date, roles
- **Server Info:** Name, owner, members, channels
- **Avatar:** High-resolution user avatars

#### Tools
- **Polls:** Create polls with up to 4 options
- **Reminders:** Set reminders (10m to 30 days)
- **AFK Status:** Auto-notify when mentioned
- **QR Codes:** Generate QR codes from text

#### Bot Info
- **Ping:** Check bot and API latency
- **Help:** Interactive command menu

### Commands
See [Commands Reference](../COMMANDS.md#utility-commands)

---

## 🎮 Fun Commands

### Overview
Entertainment and game commands.

### Features

#### Games
- **8Ball:** Ask yes/no questions (21 responses)
- **Dice:** Roll dice (2-100 sides)
- **Coin Flip:** Heads or tails
- **Rock Paper Scissors:** Play against bot

#### Content
- **Memes:** Random memes from Reddit
- **Jokes:** Random jokes from API
- **Quotes:** Inspirational quotes

### Commands
See [Commands Reference](../COMMANDS.md#fun-commands)

---

## 🌐 Web Dashboard

### Overview
Web interface for bot management and analytics viewing.

### Features

#### Authentication
- **Discord OAuth2:** Secure login
- **Session Management:** 24-hour sessions
- **Permission Checks:** Admin-only features

#### Server Management
- **Server Selection:** View all your servers
- **Statistics:** Real-time analytics
- **Settings:** Configure bot features

#### Analytics Viewing
- **Charts:** Interactive data visualization
- **Leaderboards:** Top members and inviters
- **Trends:** Activity over time

#### API Access
- **REST API:** Programmatic access
- **JSON Responses:** Easy integration
- **Authentication:** Secure endpoints

### Setup
See [Dashboard Guide](dashboard.md)

---

## 🎯 Feature Comparison

| Feature | Free | Premium |
|---------|------|---------|
| Economy | ✅ | ✅ |
| Leveling | ✅ | ✅ |
| Battle/RPG | ✅ | ✅ |
| Analytics | ✅ | ✅ |
| Invites | ✅ | ✅ |
| Moderation | ✅ | ✅ |
| Dashboard | ✅ | ✅ |
| Custom Features | ❌ | ✅ |
| Priority Support | ❌ | ✅ |

---

## 📊 Statistics

- **Total Features:** 10+ major systems
- **Total Commands:** 70+
- **Database:** MongoDB + JSON fallback
- **Uptime:** 99.9% (with PM2)
- **Response Time:** < 1 second

---

**Last Updated:** November 2025  
**Version:** 3.0  
**Status:** Complete
