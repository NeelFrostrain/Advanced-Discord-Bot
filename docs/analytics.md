# 📊 Analytics Guide

Complete guide to the analytics system.

## Overview

Track member activity, voice time, reactions, and server health metrics.

---

## Features

### Member Tracking
- Messages sent
- Voice minutes
- Reactions added
- Activity score
- Engagement score
- Streaks

### Channel Analytics
- Messages per channel
- Voice activity
- Hourly patterns
- Rankings

### Server Analytics
- Total messages
- Growth rate
- Active members
- Health metrics

---

## Commands

### `/serverstats [period]`
View server analytics.
- **Periods:** 24h, 7d, 30d, 90d

### `/topactive [limit]`
View most active members.
- **Limit:** 5-25 users

### `/useractivity [user]`
View user activity details.

### `/channelstats`
View channel rankings.

---

## Scoring

### Activity Score
```
Score = (Messages × 1) + (Voice Minutes × 0.5) + (Reactions × 0.2)
```

### Engagement Score
```
Score = (Avg Messages/Day × 10) + (Avg Voice/Day × 2)
```

---

**Last Updated:** November 2025  
**Version:** 3.0
