# 🗄️ Database System

Complete guide to the dual database architecture.

## Overview

The bot uses a **dual database system** with automatic fallback:
- **MongoDB** (Primary) - Scalable cloud database
- **JSON** (Fallback) - File-based storage

The bot automatically switches to JSON if MongoDB fails, ensuring it **never crashes**.

---

## Architecture

### Database Adapter Pattern

```typescript
interface DatabaseAdapter {
  get(path: string): Promise<any>;
  set(path: string, value: any): Promise<void>;
  push?(path: string, value: any): Promise<void>;
  delete(path: string): Promise<void>;
}
```

All database operations use this unified interface, making it easy to switch between MongoDB and JSON.

---

## MongoDB Setup

### Local MongoDB

```env
MONGODB_URI=mongodb://localhost:27017/discord-bot
```

**Installation:**
```bash
# Windows (with Chocolatey)
choco install mongodb

# macOS (with Homebrew)
brew install mongodb-community

# Linux (Ubuntu/Debian)
sudo apt-get install mongodb
```

### MongoDB Atlas (Cloud)

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/discord-bot
```

**Setup:**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create cluster
4. Create database user
5. Whitelist IP (0.0.0.0/0 for all)
6. Get connection string
7. Add to `.env`

---

## JSON Fallback

### Automatic Fallback

If MongoDB connection fails, the bot automatically uses JSON:

```
🚀 Initializing bot...

Attempting to connect to MongoDB...
⚠ MongoDB connection failed — switching to JSON mode
✓ Using JSON as primary database
```

### File Structure

```
data/
├── battles.json
├── cooldowns.json
├── economy.json
├── inventory.json
├── items.json
├── levels.json
├── logs.json
├── pets.json
├── quests.json
├── recipes.json
├── settings.json
└── shop.json
```

### Advantages
- ✅ No external dependencies
- ✅ Easy to backup (copy files)
- ✅ Human-readable
- ✅ Works immediately

### Disadvantages
- ❌ Slower for large datasets
- ❌ Less scalable
- ❌ File locking issues (rare)

---

## Data Structure

### User Data

```json
{
  "users": {
    "guildId": {
      "userId": {
        "balance": 1000,
        "bank": 5000,
        "xp": 1500,
        "level": 5,
        "messages": 150,
        "inventory": [],
        "pets": [],
        "equipment": {}
      }
    }
  }
}
```

### Analytics Data

```json
{
  "analytics": {
    "members": {
      "guildId": {
        "userId": {
          "messages": 500,
          "voiceMinutes": 120,
          "reactions": 50,
          "activityScore": 650,
          "lastActive": 1234567890
        }
      }
    },
    "channels": {
      "guildId": {
        "channelId": {
          "messages": 1000,
          "voiceMinutes": 500,
          "activeUsers": ["userId1", "userId2"]
        }
      }
    }
  }
}
```

### Invite Data

```json
{
  "invites": {
    "guildId": {
      "userId": {
        "total": 10,
        "real": 8,
        "fake": 2,
        "left": 1,
        "bonus": 0
      }
    }
  }
}
```

---

## Database Operations

### Reading Data

```typescript
import { getUser } from '../database/index.js';

const user = await getUser(userId, guildId);
console.log(user.balance); // 1000
```

### Writing Data

```typescript
import { updateUser } from '../database/index.js';

await updateUser(userId, guildId, {
  balance: 1500,
  xp: 2000
});
```

### Deleting Data

```typescript
import { getDatabase } from '../database/index.js';

const db = getDatabase();
await db.delete(`users.${guildId}.${userId}`);
```

---

## Performance

### MongoDB
- **Read:** ~10ms
- **Write:** ~20ms
- **Query:** ~50ms
- **Scalability:** Excellent

### JSON
- **Read:** ~5ms (cached)
- **Write:** ~50ms (file I/O)
- **Query:** ~100ms (in-memory)
- **Scalability:** Good (< 1000 users)

---

## Backup System

### Automatic Backups

The bot includes an automatic backup system:

```bash
npm run backup
```

Creates backup in `backups/` folder with timestamp.

### Manual Backup

**MongoDB:**
```bash
mongodump --uri="mongodb://localhost:27017/discord-bot" --out=backup
```

**JSON:**
```bash
cp -r data/ backup/
```

### Restore

**MongoDB:**
```bash
mongorestore --uri="mongodb://localhost:27017/discord-bot" backup/
```

**JSON:**
```bash
cp -r backup/ data/
```

---

## Migration

### JSON to MongoDB

```typescript
// Migration script (example)
import { getDatabase } from './database/index.js';
import fs from 'fs';

const jsonData = JSON.parse(fs.readFileSync('data/economy.json', 'utf8'));
const db = getDatabase();

for (const [guildId, users] of Object.entries(jsonData)) {
  for (const [userId, data] of Object.entries(users)) {
    await db.set(`users.${guildId}.${userId}`, data);
  }
}
```

### MongoDB to JSON

```typescript
// Export script (example)
import { getDatabase } from './database/index.js';
import fs from 'fs';

const db = getDatabase();
const data = await db.get('users');

fs.writeFileSync('export.json', JSON.stringify(data, null, 2));
```

---

## Best Practices

### Do's
- ✅ Use database adapter methods
- ✅ Handle errors gracefully
- ✅ Backup regularly
- ✅ Use MongoDB for large servers
- ✅ Monitor database size

### Don'ts
- ❌ Direct file manipulation
- ❌ Storing sensitive data
- ❌ Ignoring errors
- ❌ Skipping backups
- ❌ Hardcoding database paths

---

## Troubleshooting

### MongoDB Connection Failed

**Issue:** Cannot connect to MongoDB

**Solutions:**
1. Check `MONGODB_URI` format
2. Verify MongoDB is running
3. Check network connectivity
4. Whitelist IP in Atlas
5. Bot will use JSON fallback

### JSON File Locked

**Issue:** Cannot write to JSON file

**Solutions:**
1. Close other programs using file
2. Check file permissions
3. Restart bot
4. Delete lock file (if exists)

### Data Corruption

**Issue:** Invalid data in database

**Solutions:**
1. Restore from backup
2. Clear corrupted data
3. Rebuild from logs
4. Contact support

---

## Monitoring

### Database Size

**MongoDB:**
```bash
mongo discord-bot --eval "db.stats()"
```

**JSON:**
```bash
du -sh data/
```

### Performance

Check console logs for slow queries:
```
⚠ Slow query: users.123.456 (150ms)
```

---

## Security

### MongoDB
- ✅ Use authentication
- ✅ Whitelist IPs
- ✅ Use SSL/TLS
- ✅ Regular updates
- ✅ Strong passwords

### JSON
- ✅ File permissions (600)
- ✅ Backup encryption
- ✅ Access control
- ✅ Regular audits

---

## FAQ

**Q: Which database should I use?**  
A: MongoDB for large servers (1000+ members), JSON for small/medium servers.

**Q: Can I switch databases later?**  
A: Yes, use migration scripts to transfer data.

**Q: What happens if both fail?**  
A: Bot continues running with in-memory cache, but data won't persist.

**Q: How often should I backup?**  
A: Daily for active servers, weekly for small servers.

**Q: Can I use PostgreSQL/MySQL?**  
A: Not currently, but you can create a custom adapter.

---

**Last Updated:** November 2025  
**Version:** 3.0  
**Status:** Complete
