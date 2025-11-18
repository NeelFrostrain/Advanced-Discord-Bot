import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } from 'discord.js';
import { ExtendedClient } from '../../types/index.js';
import { EmbedFactory } from '../../utils/embeds.js';
import { updateUserLevel } from '../../database/index.js';
import { calculateLevel } from '../../utils/leveling.js';

export default {
  data: new SlashCommandBuilder()
    .setName('setxp')
    .setDescription('Set a user\'s XP (Admin only)')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to modify')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName('xp')
        .setDescription('Amount of XP to set')
        .setMinValue(0)
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction: ChatInputCommandInteraction, client: ExtendedClient) {
    const target = interaction.options.getUser('user', true);
    const xp = interaction.options.getInteger('xp', true);

    try {
      const { level, currentXP, requiredXP } = calculateLevel(xp);
      
      await updateUserLevel(target.id, interaction.guildId!, {
        xp: xp,
        level: level,
        totalXP: xp
      });

      const embed = EmbedFactory.success('XP Updated')
        .setDescription(`Set ${target}'s XP to **${xp.toLocaleString()}**`)
        .addFields(
          { name: '📊 New Level', value: `${level}`, inline: true },
          { name: '⭐ Progress', value: `${currentXP}/${requiredXP}`, inline: true }
        );

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('SetXP command error:', error);
      const errorEmbed = EmbedFactory.error('Error', 'Failed to set XP. Please try again.');
      await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  }
};
