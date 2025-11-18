import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { ExtendedClient } from '../../types/index.js';
import { EmbedFactory } from '../../utils/embeds.js';

export default {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check bot latency'),
  async execute(interaction: ChatInputCommandInteraction, client: ExtendedClient) {
    const loadingEmbed = EmbedFactory.loading('Pinging...', 'Calculating latency...');
    const sent = await interaction.reply({ embeds: [loadingEmbed] }).then(() => interaction.fetchReply());
    
    const latency = sent.createdTimestamp - interaction.createdTimestamp;
    const apiLatency = Math.round(client.ws.ping);

    const embed = EmbedFactory.success('🏓 Pong!')
      .addFields(
        { name: '📡 Latency', value: `${latency}ms`, inline: true },
        { name: '💓 API Latency', value: `${apiLatency}ms`, inline: true }
      );

    await interaction.editReply({ embeds: [embed] });
  }
};
