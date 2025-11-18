import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { Strategy as DiscordStrategy } from 'passport-discord';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import chalk from 'chalk';
import { getDatabase, initializeDatabase } from '../database/index.js';

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.DASHBOARD_PORT || 3000;
const DASHBOARD_URL = process.env.DASHBOARD_URL || `http://localhost:${PORT}`;

// Passport setup
passport.serializeUser((user: any, done) => done(null, user));
passport.deserializeUser((obj: any, done) => done(null, obj));

if (process.env.CLIENT_SECRET) {
  passport.use(new DiscordStrategy({
    clientID: process.env.CLIENT_ID!,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: `${DASHBOARD_URL}/auth/callback`,
    scope: ['identify', 'guilds']
  }, (accessToken: string, refreshToken: string, profile: any, done: any) => {
    profile.accessToken = accessToken;
    return done(null, profile);
  }));
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', join(__dirname, 'views'));

app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-this',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60000 * 60 * 24 }
}));

app.use(passport.initialize());
app.use(passport.session());

// Auth middleware
function checkAuth(req: any, res: any, next: any) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
}

// Routes
app.get('/', (req, res) => {
  res.render('index', { user: req.user });
});

app.get('/login', (req, res) => {
  if (req.isAuthenticated()) return res.redirect('/dashboard');
  res.render('login', { dashboardUrl: DASHBOARD_URL });
});

app.get('/auth/discord', passport.authenticate('discord'));

app.get('/auth/callback',
  passport.authenticate('discord', { failureRedirect: '/login' }),
  (req, res) => res.redirect('/dashboard')
);

app.get('/logout', (req: any, res) => {
  req.logout(() => res.redirect('/'));
});

app.get('/dashboard', checkAuth, (req, res) => {
  res.render('dashboard', { user: req.user });
});

// API Routes
app.get('/api/guilds', checkAuth, async (req: any, res) => {
  try {
    const guilds = req.user.guilds || [];
    res.json({ success: true, guilds });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch guilds' });
  }
});

app.get('/api/guild/:guildId/stats', checkAuth, async (req, res) => {
  try {
    const { guildId } = req.params;
    const { analytics } = await import('../utils/analytics.js');
    
    const serverAnalytics = await analytics.getServerAnalytics(guildId, 30);
    const serverHealth = await analytics.calculateServerHealth(guildId);
    const topMembers = await analytics.getTopMembers(guildId, 10);
    
    res.json({
      success: true,
      analytics: serverAnalytics,
      health: serverHealth,
      topMembers
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch stats' });
  }
});

app.get('/api/guild/:guildId/invites', checkAuth, async (req, res) => {
  try {
    const { guildId } = req.params;
    const { inviteTracker } = await import('../utils/inviteTracker.js');
    
    const leaderboard = await inviteTracker.getLeaderboard(guildId, 10);
    const config = await inviteTracker.getGuildConfig(guildId);
    
    res.json({
      success: true,
      leaderboard,
      config
    });
  } catch (error) {
    console.error('Invites error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch invites' });
  }
});

app.get('/api/guild/:guildId/rank-config', checkAuth, async (req, res) => {
  try {
    const { guildId } = req.params;
    const db = getDatabase();
    const config = await db.get(`rankConfig.${guildId}`);
    
    res.json({
      success: true,
      config: config || {
        xpPerMessage: 15,
        xpCooldown: 60000,
        rankRoles: []
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch rank config' });
  }
});

app.post('/api/guild/:guildId/rank-config', checkAuth, async (req, res) => {
  try {
    const { guildId } = req.params;
    const { xpPerMessage, xpCooldown } = req.body;
    
    const db = getDatabase();
    let config = await db.get(`rankConfig.${guildId}`) || {};
    
    if (xpPerMessage) config.xpPerMessage = parseInt(xpPerMessage);
    if (xpCooldown) config.xpCooldown = parseInt(xpCooldown) * 1000;
    
    await db.set(`rankConfig.${guildId}`, config);
    
    res.json({ success: true, config });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update config' });
  }
});

app.get('/api/guild/:guildId/members', checkAuth, async (req, res) => {
  try {
    const { guildId } = req.params;
    const db = getDatabase();
    const levels = await db.get(`levels.${guildId}`) || {};
    
    const members = Object.values(levels).slice(0, 50);
    
    res.json({ success: true, members });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch members' });
  }
});

// Economy API
app.get('/api/guild/:guildId/economy', checkAuth, async (req, res) => {
  try {
    const { guildId } = req.params;
    const db = getDatabase();
    const users = await db.get(`users.${guildId}`) || {};
    
    const economyData = Object.values(users).map((user: any) => ({
      id: user.id,
      balance: user.balance,
      bank: user.bank,
      total: user.balance + user.bank
    }));
    
    const totalCoins = economyData.reduce((sum, u) => sum + u.total, 0);
    const avgBalance = economyData.length > 0 ? totalCoins / economyData.length : 0;
    
    res.json({
      success: true,
      totalCoins,
      avgBalance,
      richest: economyData.sort((a, b) => b.total - a.total).slice(0, 10)
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch economy data' });
  }
});

// Leaderboard API
app.get('/api/guild/:guildId/leaderboard', checkAuth, async (req, res) => {
  try {
    const { guildId } = req.params;
    const type = req.query.type || 'xp';
    const db = getDatabase();
    
    if (type === 'xp') {
      const levels = await db.get(`levels.${guildId}`) || {};
      const sorted = Object.values(levels)
        .sort((a: any, b: any) => b.xp - a.xp)
        .slice(0, 25);
      res.json({ success: true, leaderboard: sorted, type: 'xp' });
    } else if (type === 'coins') {
      const users = await db.get(`users.${guildId}`) || {};
      const sorted = Object.values(users)
        .map((u: any) => ({ ...u, total: u.balance + u.bank }))
        .sort((a: any, b: any) => b.total - a.total)
        .slice(0, 25);
      res.json({ success: true, leaderboard: sorted, type: 'coins' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch leaderboard' });
  }
});

// Items API
app.get('/api/items', checkAuth, async (req, res) => {
  try {
    const { getAllItems } = await import('../utils/itemService.js');
    const items = getAllItems();
    res.json({ success: true, items });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch items' });
  }
});

// Quests API
app.get('/api/quests', checkAuth, async (req, res) => {
  try {
    const { getAllQuests } = await import('../utils/questService.js');
    const quests = getAllQuests();
    res.json({ success: true, quests });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch quests' });
  }
});

// Bot info API
app.get('/api/bot/info', checkAuth, async (req, res) => {
  try {
    res.json({
      success: true,
      version: '3.1',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      commands: 73
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch bot info' });
  }
});

// Dashboard pages
app.get('/guild/:guildId', checkAuth, (req, res) => {
  res.render('guild-dashboard', { user: req.user, guildId: req.params.guildId });
});

app.get('/guild/:guildId/analytics', checkAuth, (req, res) => {
  res.render('analytics', { user: req.user, guildId: req.params.guildId });
});

app.get('/guild/:guildId/economy', checkAuth, (req, res) => {
  res.render('economy', { user: req.user, guildId: req.params.guildId });
});

app.get('/guild/:guildId/moderation', checkAuth, (req, res) => {
  res.render('moderation', { user: req.user, guildId: req.params.guildId });
});

app.get('/guild/:guildId/settings', checkAuth, (req, res) => {
  res.render('settings', { user: req.user, guildId: req.params.guildId });
});

// Error handling
app.use((err: any, req: any, res: any, next: any) => {
  console.error('Dashboard error:', err);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

// Start server
export async function startDashboard() {
  // Initialize database first
  try {
    const mongoUri = process.env.MONGODB_URI;
    await initializeDatabase(mongoUri);
  } catch (error) {
    console.log(chalk.yellow('⚠ Dashboard using JSON database'));
  }
  
  app.listen(PORT, () => {
    console.log(chalk.green(`\n✓ Dashboard running on ${DASHBOARD_URL}`));
    console.log(chalk.cyan(`  Visit: http://localhost:${PORT}\n`));
  });
}

// For standalone dashboard
if (import.meta.url === `file://${process.argv[1]}`) {
  startDashboard();
}

export default app;
