import { SlashCommandBuilder, ChatInputCommandInteraction, ActionRowBuilder, StringSelectMenuBuilder } from 'discord.js';
import { ExtendedClient } from '../../types/index.js';
import { EmbedFactory } from '../../utils/embeds.js';

const categories: { [key: string]: { name: string; emoji: string; commands: string[] } } = {
  economy: {
    name: 'Economy',
    emoji: '💰',
    commands: [
      '`/balance` - Check your or another user\'s balance',
      '`/daily` - Claim your daily reward',
      '`/weekly` - Claim your weekly reward',
      '`/work` - Work to earn money',
      '`/shop` - View the shop',
      '`/buy` - Purchase items from the shop',
      '`/inventory` - View your inventory',
      '`/use` - Use an item from your inventory',
      '`/deposit` - Deposit coins to your bank',
      '`/withdraw` - Withdraw coins from your bank',
      '`/trade` - Trade items with another user',
      '`/craft` - Craft items using materials',
      '`/quest` - View and complete quests',
      '`/slots` - Play slots machine',
      '`/coinflip` - Flip a coin and bet',
      '`/blackjack` - Play blackjack',
      '`/roulette` - Play roulette'
    ]
  },
  leveling: {
    name: 'Leveling & XP',
    emoji: '⭐',
    commands: [
      '`/rank` - Check your or another user\'s rank',
      '`/leaderboard` - View the server leaderboard',
      '`/rankcard` - Customize your rank card',
      '`/rankcompare` - Compare ranks with another user',
      '`/rankstats` - View detailed rank statistics',
      '`/toprank` - View top ranked users',
      '`/givexp` - Give XP to a user (Admin)',
      '`/removexp` - Remove XP from a user (Admin)',
      '`/setxp` - Set a user\'s XP (Admin)',
      '`/rankreset` - Reset rank data (Admin)',
      '`/rankconfig` - Configure leveling settings (Admin)',
      '`/rankrewards` - Manage rank rewards (Admin)',
      '`/rankroles` - Manage rank roles (Admin)'
    ]
  },
  battle: {
    name: 'Battle & RPG',
    emoji: '⚔️',
    commands: [
      '`/battle` - Challenge another user to a PvP battle',
      '`/hunt` - Hunt for resources and items',
      '`/stats` - View your battle stats',
      '`/equip` - Equip weapons and armor',
      '`/inventory` - View your battle inventory',
      '`/pet` - Manage your pets'
    ]
  },
  moderation: {
    name: 'Moderation',
    emoji: '🛡️',
    commands: [
      '`/ban` - Ban a user from the server',
      '`/kick` - Kick a user from the server',
      '`/timeout` - Timeout a user',
      '`/clear` - Clear messages in a channel',
      '`/slowmode` - Set channel slowmode',
      '`/lockdown` - Lock/unlock a channel'
    ]
  },
  admin: {
    name: 'Admin',
    emoji: '👑',
    commands: [
      '`/announce` - Make an announcement',
      '`/giveaway` - Create a giveaway',
      '`/purge` - Purge messages',
      '`/reactionrole` - Setup reaction roles',
      '`/setautorole` - Set auto role for new members',
      '`/setwelcome` - Configure welcome messages'
    ]
  },
  analytics: {
    name: 'Analytics',
    emoji: '📊',
    commands: [
      '`/serverstats` - View server statistics',
      '`/channelstats` - View channel statistics',
      '`/useractivity` - View user activity',
      '`/topactive` - View most active users'
    ]
  },
  invites: {
    name: 'Invites',
    emoji: '🎫',
    commands: [
      '`/invites` - Check your invite count',
      '`/inviteleaderboard` - View invite leaderboard',
      '`/whoinvited` - See who invited a user',
      '`/fakeinvites` - Manage fake invites (Admin)',
      '`/inviteconfig` - Configure invite tracking (Admin)'
    ]
  },
  fun: {
    name: 'Fun',
    emoji: '🎮',
    commands: [
      '`/8ball` - Ask the magic 8ball a question',
      '`/dice` - Roll a dice',
      '`/flip` - Flip a coin',
      '`/joke` - Get a random joke',
      '`/meme` - Get a random meme',
      '`/quote` - Get a random quote',
      '`/rps` - Play rock paper scissors'
    ]
  },
  utility: {
    name: 'Utility',
    emoji: '🔧',
    commands: [
      '`/help` - Show this help menu',
      '`/ping` - Check bot latency',
      '`/avatar` - View a user\'s avatar',
      '`/userinfo` - View user information',
      '`/serverinfo` - View server information',
      '`/afk` - Set your AFK status',
      '`/poll` - Create a poll',
      '`/remind` - Set a reminder'
    ]
  }
};

export default {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('View all bot commands')
    .addStringOption(option =>
      option.setName('category')
        .setDescription('View commands for a specific category')
        .addChoices(
          ...Object.entries(categories).map(([key, value]) => ({
            name: `${value.emoji} ${value.name}`,
            value: key
          }))
        )
        .setRequired(false)
    ),
  async execute(interaction: ChatInputCommandInteraction, client: ExtendedClient) {
    const categoryChoice = interaction.options.getString('category');

    // If a specific category is requested, show it directly
    if (categoryChoice && categories[categoryChoice]) {
      const category = categories[categoryChoice];
      const categoryEmbed = EmbedFactory.info(`${category.emoji} ${category.name} Commands`)
        .setDescription(category.commands.join('\n'))
        .setFooter({ text: 'Use /help to see all categories' });

      return interaction.reply({ embeds: [categoryEmbed] });
    }

    // Show main help menu with dropdown
    const totalCommands = Object.values(categories).reduce((acc, cat) => acc + cat.commands.length, 0);
    
    const embed = EmbedFactory.info('📚 Help Menu')
      .setDescription(
        `Welcome to the help menu! I have **${totalCommands}** commands across **${Object.keys(categories).length}** categories.\n\n` +
        '**Quick Navigation:**\n' +
        Object.entries(categories).map(([key, cat]) => 
          `${cat.emoji} **${cat.name}** - ${cat.commands.length} commands`
        ).join('\n') +
        '\n\n*Select a category from the dropdown below to view commands!*'
      )
      .addFields(
        { 
          name: '🔗 Useful Links', 
          value: '[Dashboard](https://your-bot-dashboard.com) • [Support Server](https://discord.gg/your-invite) • [Invite Bot](https://discord.com/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=8&scope=bot%20applications.commands)',
          inline: false 
        },
        {
          name: '💡 Tips',
          value: '• Use `/help <category>` for quick access\n• Commands with (Admin) require admin permissions\n• Most commands have additional options',
          inline: false
        }
      )
      .setThumbnail(client.user?.displayAvatarURL() || null)
      .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() });

    const row = new ActionRowBuilder<StringSelectMenuBuilder>()
      .addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('help_menu')
          .setPlaceholder('📂 Select a category to view commands')
          .addOptions(
            Object.entries(categories).map(([key, value]) => ({
              label: value.name,
              value: key,
              description: `${value.commands.length} commands available`,
              emoji: value.emoji
            }))
          )
      );

    await interaction.reply({
      embeds: [embed],
      components: [row]
    });
    
    const response = await interaction.fetchReply();
    const collector = response.createMessageComponentCollector({ time: 300000 });

    collector.on('collect', async i => {
      if (i.user.id !== interaction.user.id) {
        const errorEmbed = EmbedFactory.error('Not For You', 'This help menu is not for you! Use `/help` to get your own.');
        return i.reply({ embeds: [errorEmbed], ephemeral: true });
      }

      if (i.isStringSelectMenu()) {
        const category = categories[i.values[0]];
        const categoryEmbed = EmbedFactory.info(`${category.emoji} ${category.name} Commands`)
          .setDescription(category.commands.join('\n'))
          .setFooter({ 
            text: `${category.commands.length} commands in this category • Select another category below`,
            iconURL: interaction.user.displayAvatarURL()
          })
          .setThumbnail(client.user?.displayAvatarURL() || null);

        await i.update({ embeds: [categoryEmbed], components: [row] });
      }
    });

    collector.on('end', () => {
      const timeoutEmbed = EmbedFactory.info('📚 Help Menu')
        .setDescription('This help menu has expired. Use `/help` to open a new one.')
        .setFooter({ text: 'Menu expired after 5 minutes' });
      
      interaction.editReply({ embeds: [timeoutEmbed], components: [] }).catch(() => {});
    });
  }
};
