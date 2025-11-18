# Discord Bot Dashboard

A modern, professional web dashboard for managing your Discord bot with beautiful UI and real-time features.

## Features

### 🎨 Modern UI
- **TailwindCSS** - Beautiful, responsive design
- **Gradient backgrounds** - Eye-catching color schemes
- **Smooth animations** - Professional transitions and hover effects
- **Mobile-responsive** - Works perfectly on all devices

### 📊 Pages

#### 1. Home (`/`)
- Landing page with bot features
- Quick stats overview
- Login/Dashboard access

#### 2. Login (`/login`)
- Discord OAuth2 authentication
- Feature highlights
- Secure session management

#### 3. Dashboard (`/dashboard`)
- Server selection grid
- Quick stats (servers, commands, systems)
- Feature showcase
- Quick links

#### 4. Server Overview (`/guild/:guildId`)
- Real-time server statistics
- Member count, messages, growth rate
- Top active members table
- Server health metrics

#### 5. Analytics (`/guild/:guildId/analytics`)
- Interactive charts (Chart.js)
- Message activity over time
- Member growth tracking
- Channel activity breakdown
- Hourly activity patterns
- Time period filters (7d, 30d, 90d)

#### 6. Economy (`/guild/:guildId/economy`)
- Total coins in circulation
- Average balance statistics
- Richest users leaderboard
- Shop items with rarity system
- Economy settings configuration

#### 7. Moderation (`/guild/:guildId/moderation`)
- Moderation statistics
- Mod action logs
- Auto-moderation settings:
  - Spam protection
  - Link filtering
  - Bad words filter
  - Caps lock filter
- Warning system

#### 8. Settings (`/guild/:guildId/settings`)
- General server settings
- Leveling system configuration
- Logging preferences
- Auto-roles setup
- Welcome/leave messages

## API Endpoints

### Authentication
- `GET /auth/discord` - Initiate Discord OAuth
- `GET /auth/callback` - OAuth callback
- `GET /logout` - Logout user

### Guild Management
- `GET /api/guilds` - Get user's guilds
- `GET /api/guild/:guildId/stats` - Server statistics
- `GET /api/guild/:guildId/economy` - Economy data
- `GET /api/guild/:guildId/leaderboard` - XP/Coins leaderboard
- `GET /api/guild/:guildId/members` - Member list
- `GET /api/guild/:guildId/rank-config` - Rank configuration
- `POST /api/guild/:guildId/rank-config` - Update rank config

### Bot Data
- `GET /api/items` - Shop items
- `GET /api/quests` - Available quests
- `GET /api/bot/info` - Bot information

## Tech Stack

- **Backend**: Express.js + TypeScript
- **Frontend**: EJS templates + TailwindCSS
- **Authentication**: Passport.js (Discord OAuth2)
- **Charts**: Chart.js
- **Icons**: Font Awesome 6
- **Session**: express-session

## Setup

1. **Environment Variables**
```env
CLIENT_ID=your_discord_client_id
CLIENT_SECRET=your_discord_client_secret
DASHBOARD_PORT=3000
DASHBOARD_URL=http://localhost:3000
SESSION_SECRET=your_secret_key
```

2. **Discord Developer Portal**
- Add redirect URI: `http://localhost:3000/auth/callback`
- Enable OAuth2 scopes: `identify`, `guilds`

3. **Start Dashboard**
```bash
npm run dashboard
# or
node src/dashboard/server.js
```

4. **Access**
- Open browser: `http://localhost:3000`
- Login with Discord
- Select a server to manage

## File Structure

```
src/dashboard/
├── server.ts              # Main server file
├── views/
│   ├── index.ejs         # Landing page
│   ├── login.ejs         # Login page
│   ├── dashboard.ejs     # Server selection
│   ├── guild-dashboard.ejs  # Server overview
│   ├── analytics.ejs     # Analytics page
│   ├── economy.ejs       # Economy management
│   ├── moderation.ejs    # Moderation tools
│   ├── settings.ejs      # Server settings
│   └── partials/
│       ├── navbar.ejs    # Top navigation
│       └── sidebar.ejs   # Side navigation
├── public/               # Static assets
└── README.md            # This file
```

## Features Highlights

### 🎯 Real-time Data
- Live server statistics
- Dynamic charts and graphs
- Instant updates

### 🔒 Security
- OAuth2 authentication
- Session management
- Permission checks
- CSRF protection

### 📱 Responsive Design
- Mobile-first approach
- Tablet optimized
- Desktop enhanced
- Touch-friendly

### 🎨 Beautiful UI
- Modern gradients
- Smooth animations
- Intuitive navigation
- Professional design

## Development

### Adding New Pages
1. Create EJS file in `views/`
2. Add route in `server.ts`
3. Include navbar and sidebar partials
4. Use TailwindCSS classes

### Adding API Endpoints
1. Add route in `server.ts`
2. Implement logic
3. Return JSON response
4. Handle errors

### Customization
- Modify TailwindCSS classes for styling
- Update partials for consistent changes
- Add new features in respective pages

## Production Deployment

1. **Environment**
```env
NODE_ENV=production
DASHBOARD_URL=https://yourdomain.com
```

2. **Security**
- Use HTTPS
- Set secure session cookies
- Enable CORS properly
- Rate limiting

3. **Performance**
- Enable compression
- Cache static assets
- Optimize images
- Minify assets

## Support

For issues or questions:
- Check bot logs
- Verify environment variables
- Ensure Discord OAuth is configured
- Check database connection

## Version

Dashboard v3.0 - Production Ready
