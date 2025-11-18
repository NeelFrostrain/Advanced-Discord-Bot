import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { ExtendedClient } from '../../types/index.js';
import { EmbedFactory } from '../../utils/embeds.js';
import { getDatabase } from '../../database/index.js';

export default {
  data: new SlashCommandBuilder()
    .setName('afk')
    .setDescription('Set your AFK status')
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for being AFK')
        .setRequired(false)
    ),
  async execute(interaction: ChatInputCommandInteraction, client: ExtendedClient) {
    const reason = interaction.options.getString('reason') || 'AFK';
    const db = getDatabase();
    const key = `afk.${interaction.guildId}.${interaction.user.id}`;

    try {
      await db.set(key, {
        reason: reason,
        timestamp: Date.now()
      });

      const embed = EmbedFactory.warning('AFK Status Set')
        .setDescription(`💤 You are now AFK: **${reason}**`);

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('AFK command error:', error);
      const errorEmbed = EmbedFactory.error('Error', 'Failed to set AFK status.');
      await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  }
};
