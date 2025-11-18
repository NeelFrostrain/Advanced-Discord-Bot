# 🌐 Dashboard Guide

Complete guide to the web dashboard setup and usage.

## Overview

The bot includes a web dashboard for managing your bot through a browser with Discord OAuth2 authentication.

---

## Quick Setup

### 1. Get Client Secret

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Select your application
3. Go to **OAuth2** → **General**
4. Copy **Client Secret**

### 2. Add Redirect URL

In OAuth2 section:
1. Click **Add Redirect**
2. Add: `http://localhost:3000/auth/callback`
3. For production: `https://yourdomain.com/auth/callback`
4. Click **Save Changes**

### 3. Configure Environment

Add to `.env`:
```env
CLIENT_SECRET=your_client_secret_here
DASHBOARD_PORT=3000
DASHBOARD_URL=http://localhost:3000
SESSION_SECRET=random_secret_string
```

Generate session secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Start Dashboard

```bash
npm start
```

Visit: `http://localhost:3000`

---

## Features

### Authentication
- **Discord OAuth2:** Secure login
- **Session Management:** 24-hour sessions
- **Auto-Logout:** Expired sessions cleared

### Server Management
- **Server List:** View all your servers
- **Server Selection:** Click to manage
- **Permission Check:** Admin-only access

### Analytics
- **Real-Time Stats:** Live server statistics
- **Charts:** Interactive data visualization
- **Leaderboards:** Top members and inviters
- **Trends:** Activity over time

### Settings
- **Rank Configuration:** XP rates, cooldowns
- **Invite Settings:** Log channel, auto-kick
- **Feature Toggles:** Enable/disable features

---

## Pages

### Home Page (`/`)
- Bot overview
- Feature highlights
- Login button
- Statistics

### Login Page (`/login`)
- Discord OAuth2 button
- Feature list
- Back to home link

### Dashboard (`/dashboard`)
- Server selection grid
- Server icons
- Quick stats
- Feature cards

### Server Overview (`/guild/:id`)
- Server statistics
- Top active members
- Health metrics
- Quick actions

### Analytics (`/guild/:id/analytics`)
- Message activity charts
- Member growth
- Voice activity
- Channel rankings

### Economy (`/guild/:id/economy`)
- Total coins
- Richest users
- Shop items
- Economy settings

### Moderation (`/guild/:id/moderation`)
- Mod statistics
- Action logs
- Auto-mod settings
- Warning system

### Settings (`/guild/:id/settings`)
- General settings
- Leveling config
- Logging preferences
- Auto-roles

---

## API Endpoints

### Authentication
```
GET  /auth/discord          - Redirect to Discord OAuth
GET  /auth/callback         - OAuth callback
GET  /auth/logout           - Logout user
```

### Guilds
```
GET  /api/guilds            - List user's guilds
GET  /api/guild/:id/stats   - Server statistics
```

### Analytics
```
GET  /api/guild/:id/analytics       - Analytics data
GET  /api/guild/:id/leaderboard     - Top members
```

### Configuration
```
GET  /api/guild/:id/rank-config     - Get rank config
POST /api/guild/:id/rank-config     - Update rank config
GET  /api/guild/:id/invite-config   - Get invite config
POST /api/guild/:id/invite-config   - Update invite config
```

### Members
```
GET  /api/guild/:id/members         - List members
GET  /api/guild/:id/member/:userId  - Member details
```

---

## Security

### OAuth2 Scopes
- `identify` - Get user info
- `guilds` - List user's servers

### Session Security
- **Secure Cookies:** HTTP-only, secure flag
- **Session Secret:** Random 32-byte string
- **Expiration:** 24 hours
- **HTTPS:** Required in production

### Permission Checks
- **Server Admin:** Required for settings
- **Bot Presence:** Bot must be in server
- **API Authentication:** Session-based

---

## Production Deployment

### Using a Domain

1. **Update .env:**
```env
DASHBOARD_URL=https://yourdomain.com
```

2. **Add Redirect URL:**
- Discord Developer Portal
- Add: `https://yourdomain.com/auth/callback`

3. **Use HTTPS:**
- SSL certificate (Let's Encrypt)
- Reverse proxy (nginx/Apache)

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Apache Configuration

```apache
<VirtualHost *:80>
    ServerName yourdomain.com
    Redirect permanent / https://yourdomain.com/
</VirtualHost>

<VirtualHost *:443>
    ServerName yourdomain.com

    SSLEngine on
    SSLCertificateFile /path/to/cert.pem
    SSLCertificateKeyFile /path/to/key.pem

    ProxyPreserveHost On
    ProxyPass / http://localhost:3000/
    ProxyPassReverse / http://localhost:3000/
</VirtualHost>
```

---

## Customization

### Changing Port

Edit `.env`:
```env
DASHBOARD_PORT=8080
DASHBOARD_URL=http://localhost:8080
```

Update redirect URL in Discord portal.

### Changing Theme

Edit EJS files in `src/dashboard/views/`:
- Modify TailwindCSS classes
- Change colors, fonts, layouts
- Add custom CSS

### Adding Pages

1. Create route in `src/dashboard/server.ts`
2. Create view in `src/dashboard/views/`
3. Add navigation link

---

## Troubleshooting

### Dashboard Won't Start

**Solutions:**
1. Check `CLIENT_SECRET` in `.env`
2. Verify port 3000 is available
3. Check console for errors
4. Rebuild: `npm run build`

### Can't Login

**Solutions:**
1. Verify `CLIENT_SECRET` is correct
2. Check redirect URL matches
3. Clear browser cookies
4. Try incognito mode

### No Servers Showing

**Solutions:**
1. Bot must be in servers
2. User needs "Manage Server" permission
3. Check OAuth scopes include `guilds`
4. Verify API endpoint works

### Charts Not Loading

**Solutions:**
1. Check browser console
2. Verify Chart.js CDN accessible
3. Check API endpoints responding
4. Clear browser cache

---

## Development

### Running Dashboard Only

```bash
npm run dashboard
```

### Hot Reload

```bash
npm install -g nodemon
nodemon src/dashboard/server.ts
```

### Testing API

```bash
# Test guilds endpoint
curl http://localhost:3000/api/guilds

# Test stats endpoint
curl http://localhost:3000/api/guild/GUILD_ID/stats
```

---

## Best Practices

### Security
- ✅ Use strong session secret
- ✅ Enable HTTPS in production
- ✅ Keep CLIENT_SECRET private
- ✅ Validate all user input
- ✅ Use environment variables

### Performance
- ✅ Cache API responses
- ✅ Minimize database queries
- ✅ Use CDN for static assets
- ✅ Enable gzip compression
- ✅ Optimize images

### User Experience
- ✅ Clear navigation
- ✅ Responsive design
- ✅ Fast load times
- ✅ Error messages
- ✅ Loading indicators

---

## FAQ

**Q: Is the dashboard required?**  
A: No, it's optional. All features work without it.

**Q: Can I customize the dashboard?**  
A: Yes, edit EJS files and add custom CSS.

**Q: Is it mobile-friendly?**  
A: Yes, fully responsive design.

**Q: Can I add custom pages?**  
A: Yes, create routes and views.

**Q: Is it secure?**  
A: Yes, uses Discord OAuth2 and session management.

---

**Last Updated:** November 2025  
**Version:** 3.0  
**Status:** Complete
