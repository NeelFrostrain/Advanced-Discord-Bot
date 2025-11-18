import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } from 'discord.js';
import { ExtendedClient } from '../../types/index.js';
import { EmbedFactory } from '../../utils/embeds.js';

export default {
  data: new SlashCommandBuilder()
    .setName('slowmode')
    .setDescription('Set channel slowmode')
    .addIntegerOption(option =>
      option.setName('seconds')
        .setDescription('Slowmode duration in seconds (0 to disable)')
        .setMinValue(0)
        .setMaxValue(21600)
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  async execute(interaction: ChatInputCommandInteraction, client: ExtendedClient) {
    const seconds = interaction.options.getInteger('seconds', true);

    try {
      if (!interaction.channel || !('setRateLimitPerUser' in interaction.channel)) {
        const embed = EmbedFactory.error('Error', 'Cannot set slowmode in this channel type.');
        return interaction.reply({ embeds: [embed], ephemeral: true });
      }

      await (interaction.channel as any).setRateLimitPerUser(seconds);

      const embed = EmbedFactory.moderation('Slowmode Updated')
        .setDescription(seconds === 0 ? '⏱️ Slowmode disabled' : `⏱️ Slowmode set to **${seconds}** seconds`);

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Slowmode command error:', error);
      const errorEmbed = EmbedFactory.error('Error', 'Failed to set slowmode!');
      await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  }
};
