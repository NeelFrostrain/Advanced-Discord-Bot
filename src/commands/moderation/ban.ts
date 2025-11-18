import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } from 'discord.js';
import { ExtendedClient } from '../../types/index.js';
import { EmbedFactory } from '../../utils/embeds.js';

export default {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a user from the server')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to ban')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for the ban')
        .setRequired(false)
    )
    .addIntegerOption(option =>
      option.setName('delete_days')
        .setDescription('Days of messages to delete (0-7)')
        .setMinValue(0)
        .setMaxValue(7)
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  async execute(interaction: ChatInputCommandInteraction, client: ExtendedClient) {
    const target = interaction.options.getUser('user', true);
    const reason = interaction.options.getString('reason') || 'No reason provided';
    const deleteDays = interaction.options.getInteger('delete_days') || 0;

    try {
      const member = await interaction.guild?.members.fetch(target.id).catch(() => null);

      if (!member) {
        const embed = EmbedFactory.error('User Not Found', 'This user is not in the server!');
        return interaction.reply({ embeds: [embed], ephemeral: true });
      }

      if (member.id === interaction.user.id) {
        const embed = EmbedFactory.error('Invalid Action', 'You cannot ban yourself!');
        return interaction.reply({ embeds: [embed], ephemeral: true });
      }

      if (member.id === interaction.client.user?.id) {
        const embed = EmbedFactory.error('Invalid Action', 'I cannot ban myself!');
        return interaction.reply({ embeds: [embed], ephemeral: true });
      }

      if (!member.bannable) {
        const embed = EmbedFactory.error('Cannot Ban', 'I cannot ban this user! They may have higher permissions.');
        return interaction.reply({ embeds: [embed], ephemeral: true });
      }

      await member.ban({ deleteMessageSeconds: deleteDays * 86400, reason });

      const embed = EmbedFactory.moderation('User Banned')
        .addFields(
          { name: '👤 User', value: `${target.tag} (${target.id})`, inline: true },
          { name: '👮 Moderator', value: `${interaction.user.tag}`, inline: true },
          { name: '📝 Reason', value: reason }
        );

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Ban command error:', error);
      const errorEmbed = EmbedFactory.error('Error', 'Failed to ban user. Please try again.');
      await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  }
};
