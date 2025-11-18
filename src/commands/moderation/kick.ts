import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } from 'discord.js';
import { ExtendedClient } from '../../types/index.js';
import { EmbedFactory } from '../../utils/embeds.js';

export default {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a user from the server')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to kick')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for the kick')
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
  async execute(interaction: ChatInputCommandInteraction, client: ExtendedClient) {
    const target = interaction.options.getUser('user', true);
    const reason = interaction.options.getString('reason') || 'No reason provided';

    try {
      const member = await interaction.guild?.members.fetch(target.id).catch(() => null);

      if (!member) {
        const embed = EmbedFactory.error('User Not Found', 'This user is not in the server!');
        return interaction.reply({ embeds: [embed], ephemeral: true });
      }

      if (member.id === interaction.user.id) {
        const embed = EmbedFactory.error('Invalid Action', 'You cannot kick yourself!');
        return interaction.reply({ embeds: [embed], ephemeral: true });
      }

      if (!member.kickable) {
        const embed = EmbedFactory.error('Cannot Kick', 'I cannot kick this user!');
        return interaction.reply({ embeds: [embed], ephemeral: true });
      }

      await member.kick(reason);

      const embed = EmbedFactory.moderation('User Kicked')
        .addFields(
          { name: '👤 User', value: `${target.tag} (${target.id})`, inline: true },
          { name: '👮 Moderator', value: `${interaction.user.tag}`, inline: true },
          { name: '📝 Reason', value: reason }
        );

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Kick command error:', error);
      const errorEmbed = EmbedFactory.error('Error', 'Failed to kick user. Please try again.');
      await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  }
};
