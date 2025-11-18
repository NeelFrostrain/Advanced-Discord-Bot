import { Client, GatewayIntentBits, Collection, Partials } from 'discord.js';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readdirSync, readFileSync } from 'fs';
import chalk from 'chalk';
import { ExtendedClient, Command, BotConfig } from './types/index.js';
import { initializeDatabase } from './database/index.js';

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.DirectMessages
  ],
  partials: [
    Partials.Channel,
    Partials.Message,
    Partials.Reaction,
    Partials.User
  ]
}) as ExtendedClient;

client.commands = new Collection<string, Command>();
client.cooldowns = new Collection<string, Collection<string, number>>();

// Load config
const configPath = join(__dirname, '../config.json');
client.config = JSON.parse(readFileSync(configPath, 'utf8')) as BotConfig;

// Initialize database
console.log(chalk.blue('\n🚀 Initializing bot...\n'));

const mongoUri = process.env.MONGODB_URI;
await initializeDatabase(mongoUri);

// Load handlers
const handlersPath = join(__dirname, 'handlers');
const handlerFiles = readdirSync(handlersPath).filter(file => file.endsWith('.js') || file.endsWith('.ts'));

for (const file of handlerFiles) {
  const handler = await import(`./handlers/${file}`);
  await handler.default(client);
  console.log(chalk.green(`✓ Loaded handler: ${file}`));
}

// Error handling
process.on('unhandledRejection', error => {
  console.error(chalk.red('Unhandled promise rejection:'), error);
});

process.on('uncaughtException', error => {
  console.error(chalk.red('Uncaught exception:'), error);
});

// Start dashboard (optional)
if (process.env.CLIENT_SECRET && process.env.DASHBOARD_PORT) {
  try {
    const { startDashboard } = await import('./dashboard/server.js');
    startDashboard();
  } catch (error) {
    console.log(chalk.yellow('⚠ Dashboard not started (optional feature)'));
  }
}

// Login
client.login(process.env.BOT_TOKEN).catch(error => {
  console.error(chalk.red('Failed to login:'), error);
  process.exit(1);
});

export default client;
