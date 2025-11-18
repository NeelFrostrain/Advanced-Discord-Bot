import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } from 'discord.js';
import { ExtendedClient } from '../../types/index.js';
import { EmbedFactory } from '../../utils/embeds.js';
import ms from 'ms';

export default {
  data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Timeout a user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to timeout')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('duration')
        .setDescription('Duration (e.g., 10m, 1h, 1d)')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for the timeout')
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction: ChatInputCommandInteraction, client: ExtendedClient) {
    const target = interaction.options.getUser('user', true);
    const duration = interaction.options.getString('duration', true);
    const reason = interaction.options.getString('reason') || 'No reason provided';

    try {
      const member = await interaction.guild?.members.fetch(target.id).catch(() => null);

      if (!member) {
        const embed = EmbedFactory.error('User Not Found', 'This user is not in the server!');
        return interaction.reply({ embeds: [embed], ephemeral: true });
      }

      const timeMs = ms(duration);
      if (!timeMs || timeMs > 2419200000) {
        const embed = EmbedFactory.error('Invalid Duration', 'Invalid duration! Max is 28 days.');
        return interaction.reply({ embeds: [embed], ephemeral: true });
      }

      await member.timeout(timeMs, reason);

      const embed = EmbedFactory.moderation('User Timed Out')
        .addFields(
          { name: '👤 User', value: `${target.tag}`, inline: true },
          { name: '⏰ Duration', value: duration, inline: true },
          { name: '👮 Moderator', value: `${interaction.user.tag}`, inline: true },
          { name: '📝 Reason', value: reason }
        );

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Timeout command error:', error);
      const errorEmbed = EmbedFactory.error('Error', 'Failed to timeout user!');
      await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  }
};
