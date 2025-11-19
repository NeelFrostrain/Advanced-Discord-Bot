# 📋 Commands Reference

Complete reference for all 70+ bot commands.

## Command Categories

- [Economy (17)](#economy-commands)
- [Leveling (13)](#leveling-commands)
- [Battle (6)](#battle-commands)
- [Analytics (4)](#analytics-commands)
- [Invites (5)](#invite-commands)
- [Moderation (6)](#moderation-commands)
- [Admin (10)](#admin-commands)
- [Utility (8)](#utility-commands)
- [Fun (7)](#fun-commands)

---

## Economy Commands

### `/balance [user]`
Check your or another user's balance.
- Shows wallet, bank, and total coins
- **Cooldown:** None

### `/daily`
Claim your daily reward.
- **Reward:** 1000 coins (configurable)
- **Cooldown:** 24 hours

### `/weekly`
Claim your weekly reward.
- **Reward:** 5000 coins (configurable)
- **Cooldown:** 7 days

### `/work`
Work to earn money.
- **Reward:** 100-500 coins (random, configurable)
- **Cooldown:** 1 hour

### `/deposit <amount>`
Deposit coins to your bank.
- Keeps coins safe from gambling losses
- **Cooldown:** None

### `/withdraw <amount>`
Withdraw coins from your bank.
- Move coins to wallet for spending
- **Cooldown:** None

### `/shop`
View all items in the shop.
- Displays weapons, armor, potions, pets, boosts
- **Cooldown:** None

### `/buy <item> [amount]`
Buy items from the shop.
- Items go to your inventory
- **Cooldown:** None

### `/inventory [user]`
View your or another user's inventory.
- Shows all owned items
- **Cooldown:** None

### `/trade <user> <amount>`
Trade coins with another user.
- Requires confirmation from recipient
- **Cooldown:** None

### `/craft list|recipe|make`
Crafting system commands.
- `list` - View all recipes
- `recipe <item>` - View recipe details
- `make <item>` - Craft an item
- **Cooldown:** None

### `/quest list|active|start|claim`
Quest system commands.
- `list` - View available quests
- `active` - View active quests
- `start <quest>` - Start a quest
- `claim` - Claim completed rewards
- **Cooldown:** None

### `/use <item>`
Use an item from inventory.
- Consumables, potions, boosts
- **Cooldown:** None

### `/slots <bet>`
Play the slot machine.
- **Min bet:** 10 coins
- **Jackpot:** 10x bet (7️⃣7️⃣7️⃣)
- **Cooldown:** 5 seconds

### `/coinflip <choice> <bet>`
Flip a coin and bet on the outcome.
- **Choices:** Heads or Tails
- **Win:** 2x bet
- **Cooldown:** 3 seconds

### `/blackjack <bet>`
Play blackjack against the dealer.
- Full game with hit/stand mechanics
- **Blackjack:** 1.5x bet
- **Cooldown:** 3 seconds

### `/roulette <type> <amount>`
Play roulette.
- **Types:** Red, Black, Green, Odd, Even
- **Green win:** 35x bet
- **Color/Odd/Even win:** 2x bet
- **Cooldown:** 5 seconds

---

## Leveling Commands

### `/rank [user]`
Check your or another user's rank card.
- Shows server rank, level, XP, progress
- **Fixed in v2.0:** Proper user mentions and notifications
- **Cooldown:** None

### `/rankstats [user]`
View detailed ranking statistics.
- Comprehensive XP breakdown
- **Fixed in v2.0:** Proper user mentions
- **Cooldown:** None

### `/rankcard [colors]`
Customize your rank card appearance.
- Set custom colors (hex codes)
- **Cooldown:** None

### `/rankcompare <user>`
Compare your rank with another user.
- Side-by-side comparison
- **Fixed in v2.0:** Proper user mentions
- **Cooldown:** None

### `/leaderboard [type]`
View server leaderboard.
- **Types:** Levels, Economy
- Shows top 10 users per page
- **Fixed in v2.0:** Accurate data retrieval, proper sorting, pagination
- **Cooldown:** None

### `/toprank [limit]`
View extended leaderboard.
- Configurable limit (5-25 users)
- **Fixed in v2.0:** Proper user mentions
- **Cooldown:** None

### `/rankrewards`
View all available rank role rewards.
- List of level milestones
- **Cooldown:** None

### `/rankconfig <subcommand>` (Admin)
Configure rank system settings.
- `xp` - Set XP per message
- `cooldown` - Set XP cooldown
- `levelupchannel` - Set announcement channel
- `multiplier` - Set role XP boost
- `view` - View configuration
- **Permission:** Administrator

### `/rankroles <subcommand>` (Admin)
Manage rank role rewards.
- `add` - Add role reward
- `remove` - Remove role reward
- `list` - List all rank roles
- **Permission:** Administrator

### `/givexp <user> <amount>` (Admin)
Give XP to a user.
- **Fixed in v2.0:** Proper user mentions
- **Permission:** Administrator

### `/removexp <user> <amount>` (Admin)
Remove XP from a user.
- **Fixed in v2.0:** Proper user mentions
- **Permission:** Administrator

### `/rankreset <user>` (Admin)
Reset a user's rank and XP.
- **Fixed in v2.0:** Proper user mentions
- **Permission:** Administrator

### `/setxp <user> <xp>` (Admin)
Set a user's exact XP amount.
- **Permission:** Administrator

---

## Battle Commands

### `/hunt`
Hunt monsters for rewards.
- **Monsters:** Slime, Goblin, Wolf, Orc, Dragon
- **Rewards:** Coins + XP
- **Fixed in v2.0:** Proper user mentions
- **Cooldown:** 30 seconds

### `/battle <user> [wager]`
Challenge another user to PvP battle.
- Turn-based combat
- Optional coin wager
- **Fixed in v2.0:** Proper user mentions
- **Cooldown:** 60 seconds

### `/pet view|summon`
Pet system commands.
- `view` - View your pets
- `summon` - Summon a random pet (2000 coins)
- **Fixed in v2.0:** Proper user mentions
- **Cooldown:** None

### `/equip <item>`
Equip weapons or armor.
- Increases attack/defense stats
- **Cooldown:** None

### `/equipment`
View your equipped items.
- Shows weapon and armor
- **Cooldown:** None

### `/stats [user]`
View battle stats.
- Attack power, defense, level, pets, HP
- **Fixed in v2.0:** Proper user mentions
- **Cooldown:** None

---

## Analytics Commands

### `/serverstats [period]`
View server analytics and statistics.
- **Periods:** 24h, 7d, 30d, 90d
- Shows messages, growth rate, joins/leaves
- **Cooldown:** None

### `/topactive [limit]`
View most active members.
- Shows messages, voice minutes, activity score
- **Limit:** 5-25 users (default: 10)
- **Cooldown:** None

### `/useractivity [user]`
View detailed user activity statistics.
- Messages, voice, reactions, emojis
- Activity & engagement scores
- **Fixed in v2.0:** Proper user mentions
- **Cooldown:** None

### `/channelstats`
View channel activity rankings.
- Top 10 most active channels
- Messages and voice minutes per channel
- **Cooldown:** None

---

## Invite Commands

### `/invites [user]`
Check invite statistics.
- Total, real, fake, left invites
- **Fixed in v2.0:** Proper user mentions
- **Cooldown:** None

### `/inviteleaderboard [limit]`
View top inviters.
- Ranked by real invites
- **Limit:** 5-25 users (default: 10)
- **Cooldown:** None

### `/whoinvited <user>`
Check who invited a user.
- Inviter information, account age, join method
- **Fixed in v2.0:** Proper user mentions
- **Cooldown:** None

### `/fakeinvites [days]` (Admin)
View suspicious/fake joins.
- Shows quality scores and reasons
- **Days:** 1-30 (default: 7)
- **Permission:** Administrator

### `/inviteconfig <subcommand>` (Admin)
Configure invite tracking.
- `logchannel` - Set log channel
- `minaccountage` - Set minimum age
- `autokick` - Enable/disable auto-kick
- `view` - View configuration
- **Permission:** Administrator

---

## Moderation Commands

### `/ban <user> [reason] [delete_days]`
Ban a user from the server.
- **Permission:** Ban Members
- **Delete days:** 0-7 (message history)

### `/kick <user> [reason]`
Kick a user from the server.
- **Permission:** Kick Members

### `/timeout <user> <duration> [reason]`
Timeout a user.
- **Permission:** Moderate Members
- **Duration:** e.g., 10m, 1h, 1d (max 28 days)

### `/clear <amount> [user]`
Clear messages from a channel.
- **Permission:** Manage Messages
- **Amount:** 1-100 messages

### `/slowmode <seconds>`
Set channel slowmode.
- **Permission:** Manage Channels
- **Range:** 0-21600 seconds

### `/lockdown <lock>`
Lock or unlock a channel.
- **Permission:** Manage Channels
- **Lock:** true/false

---

## Admin Commands

### `/giveaway <duration> <prize> [winners]`
Start a giveaway.
- **Permission:** Administrator
- **Duration:** e.g., 1h, 1d, 1w

### `/reactionrole <message> <emoji> <role>`
Create a reaction role message.
- **Permission:** Administrator

### `/setwelcome enable|disable`
Configure welcome messages.
- **Permission:** Administrator
- **Variables:** {user}, {username}, {server}

### `/setautorole enable|disable`
Configure auto-role for new members.
- **Permission:** Administrator

### `/announce <channel> <title> <message>`
Send an announcement.
- **Permission:** Administrator

### `/purge <amount>`
Purge messages (alias for clear).
- **Permission:** Manage Messages

### `/syncdb <direction>` (Admin)
**NEW in v2.0:** Sync data between MongoDB and JSON.
- **Directions:** "JSON → MongoDB" or "MongoDB → JSON"
- **Permission:** Administrator
- **Use:** Manual database synchronization

### `/backup` (Admin)
**NEW in v2.0:** Force immediate MongoDB → JSON backup.
- **Permission:** Administrator
- **Use:** Create instant backup of all data

### `/testdb` (Admin)
**NEW in v2.0:** Test database access and verify data.
- **Permission:** Administrator
- **Use:** Diagnose database issues

### `/debuglevels` (Admin)
**NEW in v2.0:** Show raw database structure for debugging.
- **Permission:** Administrator
- **Use:** Debug leaderboard and rank issues

---

## Utility Commands

### `/ping`
Check bot latency.
- Shows bot and API latency

### `/help [category]`
View all bot commands.
- Interactive dropdown menu
- Optional category parameter

### `/avatar [user]`
Get a user's avatar.
- High resolution (1024x1024)
- **Fixed in v2.0:** Proper user mentions

### `/userinfo [user]`
Get information about a user.
- Username, ID, account age, join date, roles
- **Fixed in v2.0:** Proper user mentions

### `/serverinfo`
Get information about the server.
- Server name, ID, owner, members, channels

### `/poll <question> <options>`
Create a poll.
- Up to 4 options
- Automatic reactions

### `/remind <time> <message>`
Set a reminder.
- **Time:** e.g., 10m, 1h, 1d (max 30 days)

### `/afk [reason]`
Set your AFK status.
- Bot notifies others when you're mentioned

---

## Fun Commands

### `/8ball <question>`
Ask the magic 8ball a question.
- 21 different responses

### `/meme`
Get a random meme from Reddit.
- Fetches from meme API

### `/dice [sides]`
Roll a dice.
- **Sides:** 2-100 (default: 6)

### `/flip`
Flip a coin.
- Results: Heads or Tails

### `/joke`
Get a random joke.
- Fetches from joke API

### `/rps <choice>`
Play Rock Paper Scissors.
- **Choices:** Rock, Paper, Scissors

### `/quote`
Get an inspirational quote.
- Random motivational quotes

---

## Command Statistics

- **Total Commands:** 76
- **User Commands:** 56
- **Admin Commands:** 10
- **Moderation Commands:** 6
- **New in v2.0:** 4 database management commands

### Breakdown by Category
- **Economy:** 17 commands
- **Leveling:** 13 commands
- **Battle:** 6 commands
- **Analytics:** 4 commands
- **Invites:** 5 commands
- **Moderation:** 6 commands
- **Admin:** 10 commands
- **Utility:** 8 commands
- **Fun:** 7 commands

## Permission Levels

### Everyone
Most commands available to all users with cooldowns to prevent spam.

### Moderators
- Ban, Kick, Timeout
- Clear, Slowmode, Lockdown

### Administrators
- All moderation commands
- Rank configuration
- Invite configuration
- Giveaways, roles, welcome messages
- Database management (NEW in v2.0)

---

## Version 2.0 Command Improvements

### Fixed User Mentions (19 Commands)
All commands now properly mention users outside embeds for notifications:
- Leveling: `/rank`, `/rankstats`, `/rankcompare`, `/givexp`, `/removexp`, `/rankreset`, `/leaderboard`, `/toprank`
- Economy: `/balance`, `/inventory`, `/trade`
- Battle: `/stats`, `/battle`, `/hunt`, `/pet`
- Utility: `/userinfo`, `/avatar`
- Invites: `/invites`, `/whoinvited`
- Analytics: `/useractivity`

### Enhanced Leaderboard
- Fixed "No data available" bug
- Accurate ranking and sorting
- Pagination support
- Medal emojis for top 3

### New Database Commands
- `/syncdb` - Manual database sync
- `/backup` - Force backup
- `/testdb` - Test database
- `/debuglevels` - Debug structure

---

**Last Updated:** November 19, 2025  
**Version:** 2.0.0  
**Status:** Production Ready
