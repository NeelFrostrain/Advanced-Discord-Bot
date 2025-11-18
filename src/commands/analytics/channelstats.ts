import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { ExtendedClient } from '../../types/index.js';
import { EmbedFactory } from '../../utils/embeds.js';
import { analytics } from '../../utils/analytics.js';

export default {
  data: new SlashCommandBuilder()
    .setName('channelstats')
    .setDescription('View channel activity rankings'),
  async execute(interaction: ChatInputCommandInteraction, client: ExtendedClient) {
    try {
      await interaction.deferReply();

      const channels = await analytics.getChannelRankings(interaction.guildId!);

      if (channels.length === 0) {
        return interaction.editReply({
          embeds: [EmbedFactory.error('No Data', 'No channel data available yet.')]
        });
      }

      let description = '**📊 Most Active Channels**\n\n';
      
      const topChannels = channels.slice(0, 10);
      for (let i = 0; i < topChannels.length; i++) {
        const channel = topChannels[i];
        const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`;
        
        description += `${medal} <#${channel.channelId}>\n`;
        description += `└ 💬 ${channel.messages.toLocaleString()} messages`;
        
        if (channel.voiceMinutes > 0) {
          description += ` • 🎤 ${Math.floor(channel.voiceMinutes)}m voice`;
        }
        
        description += `\n\n`;
      }

      const embed = EmbedFactory.leveling('📊 Channel Statistics')
        .setDescription(description)
        .setFooter({ text: `Showing top ${topChannels.length} channels` });

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('Channelstats command error:', error);
      await interaction.editReply({
        embeds: [EmbedFactory.error('Error', 'Failed to fetch channel statistics.')]
      });
    }
  }
};
