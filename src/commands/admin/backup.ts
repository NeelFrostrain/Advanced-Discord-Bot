import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } from 'discord.js';
import { ExtendedClient } from '../../types/index.js';
import { EmbedFactory } from '../../utils/embeds.js';
import { forceBackup, isUsingMongoDB } from '../../database/index.js';

export default {
  data: new SlashCommandBuilder()
    .setName('backup')
    .setDescription('Force MongoDB backup to JSON (Admin only)')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction: ChatInputCommandInteraction, client: ExtendedClient) {
    await interaction.deferReply({ ephemeral: true });

    try {
      if (!isUsingMongoDB()) {
        const embed = EmbedFactory.warning(
          'Not Using MongoDB',
          'The bot is currently using JSON database. No backup needed.'
        );
        return interaction.editReply({ embeds: [embed] });
      }

      const startTime = Date.now();
      
      await forceBackup();
      
      const duration = Date.now() - startTime;

      const embed = EmbedFactory.success(
        '✅ Backup Complete',
        `MongoDB data has been backed up to JSON successfully!`
      )
        .addFields(
          { name: '⏱️ Duration', value: `${duration}ms`, inline: true },
          { name: '📁 Location', value: 'database/json/data.json', inline: true }
        )
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('Backup command error:', error);
      const errorEmbed = EmbedFactory.error(
        'Backup Failed',
        `Failed to backup database: ${error}`
      );
      await interaction.editReply({ embeds: [errorEmbed] });
    }
  }
};
