import { ActivityType, REST, Routes } from 'discord.js';
import chalk from 'chalk';
import { inviteTracker } from '../utils/inviteTracker.js';
export default {
    name: 'clientReady',
    once: true,
    async execute(client) {
        console.log(chalk.green(`\n✓ Bot is ready! Logged in as ${client.user?.tag}`));
        console.log(chalk.cyan(`  Servers: ${client.guilds.cache.size}`));
        console.log(chalk.cyan(`  Users: ${client.users.cache.size}`));
        // Initialize invite tracking for all guilds
        console.log(chalk.yellow('⟳ Initializing invite tracking...'));
        for (const [, guild] of client.guilds.cache) {
            await inviteTracker.initGuild(guild);
        }
        console.log(chalk.green('✓ Invite tracking initialized'));
        // Set bot status
        client.user?.setPresence({
            activities: [{ name: '/help | Deb Bot', type: ActivityType.Playing }],
            status: 'online'
        });
        // Register slash commands
        const commands = [];
        client.commands.forEach(cmd => {
            if (cmd.data)
                commands.push(cmd.data.toJSON());
        });
        const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);
        try {
            console.log(chalk.yellow(`\n⟳ Registering ${commands.length} slash commands...`));
            await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
            console.log(chalk.green(`✓ Successfully registered slash commands\n`));
        }
        catch (error) {
            console.error(chalk.red('Failed to register slash commands:'), error);
        }
    }
};
