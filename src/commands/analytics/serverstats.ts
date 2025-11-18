import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { ExtendedClient } from '../../types/index.js';
import { EmbedFactory } from '../../utils/embeds.js';
import { analytics } from '../../utils/analytics.js';

export default {
  data: new SlashCommandBuilder()
    .setName('serverstats')
    .setDescription('View server analytics and statistics')
    .addStringOption(option =>
      option.setName('period')
        .setDescription('Time period')
        .addChoices(
          { name: '24 Hours', value: '1' },
          { name: '7 Days', value: '7' },
          { name: '30 Days', value: '30' },
          { name: '90 Days', value: '90' }
        )
        .setRequired(false)
    ),
  async execute(interaction: ChatInputCommandInteraction, client: ExtendedClient) {
    const period = parseInt(interaction.options.getString('period') || '30');

    try {
      await interaction.deferReply();

      const serverAnalytics = await analytics.getServerAnalytics(interaction.guildId!, period);
      const serverHealth = await analytics.calculateServerHealth(interaction.guildId!);

      if (!serverAnalytics || !serverHealth) {
        return interaction.editReply({
          embeds: [EmbedFactory.error('No Data', 'No analytics data available yet.')]
        });
      }

      const dailyStats = Object.values(serverAnalytics.dailyStats);
      const totalMessages = dailyStats.reduce((sum: number, day: any) => sum + day.messages, 0);
      const totalJoins = dailyStats.reduce((sum: number, day: any) => sum + day.joins, 0);
      const totalLeaves = dailyStats.reduce((sum: number, day: any) => sum + day.leaves, 0);

      const embed = EmbedFactory.leveling(`📊 Server Statistics (${period}d)`)
        .addFields(
          { name: '💬 Total Messages', value: totalMessages.toLocaleString(), inline: true },
          { name: '📈 Avg Messages/Day', value: Math.floor(totalMessages / period).toLocaleString(), inline: true },
          { name: '📊 Growth Rate', value: `${serverHealth.growthRate}%`, inline: true },
          { name: '👥 Joins', value: totalJoins.toString(), inline: true },
          { name: '👋 Leaves', value: totalLeaves.toString(), inline: true },
          { name: '📈 Net Growth', value: (totalJoins - totalLeaves).toString(), inline: true },
          { name: '🎯 Activity Trend', value: serverHealth.activityTrend === 'increasing' ? '📈 Increasing' : '📉 Decreasing', inline: true },
          { name: '⏰ Total Voice Minutes', value: serverAnalytics.totalVoiceMinutes.toLocaleString(), inline: true },
          { name: '👤 Current Members', value: interaction.guild!.memberCount.toString(), inline: true }
        )
        .setFooter({ text: `Data from last ${period} days` });

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('Serverstats command error:', error);
      await interaction.editReply({
        embeds: [EmbedFactory.error('Error', 'Failed to fetch server statistics.')]
      });
    }
  }
};
