# ⚙️ Configuration Guide

Complete guide to `config.json` settings.

## File Location

```
discord-bot/
└── config.json
```

## Configuration Structure

```json
{
  "bot": { },
  "economy": { },
  "leveling": { },
  "battle": { },
  "moderation": { },
  "features": { }
}
```

---

## Bot Settings

```json
{
  "bot": {
    "name": "Advanced Bot",
    "version": "3.0.0",
    "description": "Full-featured Discord bot",
    "color": "#5865F2"
  }
}
```

- **name:** Bot display name
- **version:** Current version
- **description:** Bot description
- **color:** Default embed color (hex)

---

## Economy Settings

```json
{
  "economy": {
    "startingBalance": 1000,
    "dailyAmount": 500,
    "weeklyAmount": 3500,
    "workMin": 50,
    "workMax": 200,
    "workCooldown": 3600000,
    "dailyCooldown": 86400000,
    "weeklyCooldown": 604800000
  }
}
```

- **startingBalance:** Initial coins for new users
- **dailyAmount:** Daily reward amount
- **weeklyAmount:** Weekly reward amount
- **workMin/Max:** Work command reward range
- **Cooldowns:** In milliseconds

---

## Leveling Settings

```json
{
  "leveling": {
    "enabled": true,
    "xpPerMessage": [15, 25],
    "xpCooldown": 60000,
    "levelUpMessage": true,
    "levelFormula": "level * level * 100"
  }
}
```

- **enabled:** Enable/disable leveling
- **xpPerMessage:** [min, max] XP range
- **xpCooldown:** Cooldown between XP gains (ms)
- **levelUpMessage:** Show level-up messages
- **levelFormula:** XP calculation formula

---

## Battle Settings

```json
{
  "battle": {
    "huntCooldown": 30000,
    "pvpCooldown": 60000,
    "critChance": 0.15,
    "critMultiplier": 1.5
  }
}
```

- **huntCooldown:** Hunt command cooldown (ms)
- **pvpCooldown:** PvP battle cooldown (ms)
- **critChance:** Critical hit chance (0-1)
- **critMultiplier:** Critical damage multiplier

---

## Moderation Settings

```json
{
  "moderation": {
    "logChannel": null,
    "autoMod": {
      "enabled": false,
      "antiSpam": true,
      "antiRaid": true,
      "badWords": []
    }
  }
}
```

- **logChannel:** Mod log channel ID
- **autoMod.enabled:** Enable auto-moderation
- **antiSpam:** Spam protection
- **antiRaid:** Raid protection
- **badWords:** Filtered words array

---

## Feature Toggles

```json
{
  "features": {
    "tickets": true,
    "giveaways": true,
    "reactionRoles": true,
    "welcome": true,
    "autoRole": true,
    "starboard": true
  }
}
```

Enable/disable specific features.

---

## Customization Examples

### High XP Server
```json
{
  "leveling": {
    "xpPerMessage": [25, 50],
    "xpCooldown": 30000
  }
}
```

### Generous Economy
```json
{
  "economy": {
    "dailyAmount": 1000,
    "weeklyAmount": 7000,
    "workMax": 500
  }
}
```

### Fast-Paced Battle
```json
{
  "battle": {
    "huntCooldown": 15000,
    "pvpCooldown": 30000
  }
}
```

---

**Last Updated:** November 2025  
**Version:** 3.0
