# 🔌 API Reference

Dashboard API endpoints reference.

## Authentication

All API endpoints require authentication via session cookies.

---

## Endpoints

### Guilds

#### `GET /api/guilds`
List user's guilds.

**Response:**
```json
{
  "guilds": [
    {
      "id": "123456789",
      "name": "Server Name",
      "icon": "icon_hash",
      "owner": false,
      "permissions": "8"
    }
  ]
}
```

#### `GET /api/guild/:id/stats`
Get server statistics.

**Response:**
```json
{
  "success": true,
  "analytics": {
    "totalMessages": 10000,
    "totalVoiceMinutes": 5000
  },
  "health": {
    "growthRate": "5.2%"
  }
}
```

---

## Error Responses

```json
{
  "success": false,
  "error": "Error message"
}
```

---

**Last Updated:** November 2025  
**Version:** 3.0
