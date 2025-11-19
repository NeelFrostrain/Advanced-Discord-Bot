import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { ExtendedClient } from '../../types/index.js';
import { EmbedFactory } from '../../utils/embeds.js';
import { getLeaderboard } from '../../utils/leveling.js';

export default {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('View the server leaderboard')
    .addStringOption(option =>
      option.setName('type')
        .setDescription('Leaderboard type')
        .addChoices(
          { name: 'Levels', value: 'levels' },
          { name: 'Economy', value: 'economy' }
        )
        .setRequired(false)
    ),
  async execute(interaction: ChatInputCommandInteraction, client: ExtendedClient) {
    const type = interaction.options.getString('type') || 'levels';

    try {
      const leaderboard = await getLeaderboard(interaction.guildId!, 10);

      const embed = EmbedFactory.leveling(`${type === 'levels' ? 'Level' : 'Economy'} Leaderboard`);

      if (leaderboard.length === 0) {
        embed.setDescription('📊 No data available yet!');
      } else {
        let description = '';
        for (let i = 0; i < leaderboard.length; i++) {
          const user = leaderboard[i];
          const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`;
          
          description += `${medal} <@${user.id}> - Level ${user.level} (${user.xp.toLocaleString()} XP)\n`;
        }
        embed.setDescription(description);
      }

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Leaderboard command error:', error);
      const errorEmbed = EmbedFactory.error('Error', 'Failed to fetch leaderboard.');
      await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  }
};
