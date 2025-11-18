import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } from 'discord.js';
import { ExtendedClient } from '../../types/index.js';
import { EmbedFactory } from '../../utils/embeds.js';
import { getGuildRankConfig, updateGuildRankConfig } from '../../database/index.js';

export default {
  data: new SlashCommandBuilder()
    .setName('rankroles')
    .setDescription('Manage rank roles (Admin only)')
    .addSubcommand(subcommand =>
      subcommand
        .setName('add')
        .setDescription('Add a rank role reward')
        .addIntegerOption(option =>
          option.setName('level')
            .setDescription('Level required')
            .setRequired(true)
            .setMinValue(1)
        )
        .addRoleOption(option =>
          option.setName('role')
            .setDescription('Role to give')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('remove')
        .setDescription('Remove a rank role reward')
        .addIntegerOption(option =>
          option.setName('level')
            .setDescription('Level to remove')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('list')
        .setDescription('List all rank role rewards')
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction: ChatInputCommandInteraction, client: ExtendedClient) {
    const subcommand = interaction.options.getSubcommand();

    try {
      const config = await getGuildRankConfig(interaction.guildId!);

      if (subcommand === 'add') {
        const level = interaction.options.getInteger('level', true);
        const role = interaction.options.getRole('role', true);

        // Check if level already has a role
        const existing = config.rankRoles.find((r: any) => r.level === level);
        if (existing) {
          return interaction.reply({
            embeds: [EmbedFactory.error('Error', `Level ${level} already has a role assigned. Remove it first.`)],
            ephemeral: true
          });
        }

        config.rankRoles.push({
          level: level,
          roleId: role.id,
          roleName: role.name
        });

        config.rankRoles.sort((a: any, b: any) => a.level - b.level);
        await updateGuildRankConfig(interaction.guildId!, config);

        const embed = EmbedFactory.success(
          'Rank Role Added',
          `Users will now receive ${role.name} at level ${level}!`
        );

        await interaction.reply({ embeds: [embed] });

      } else if (subcommand === 'remove') {
        const level = interaction.options.getInteger('level', true);

        const index = config.rankRoles.findIndex((r: any) => r.level === level);
        if (index === -1) {
          return interaction.reply({
            embeds: [EmbedFactory.error('Error', `No rank role found for level ${level}.`)],
            ephemeral: true
          });
        }

        const removed = config.rankRoles.splice(index, 1)[0];
        await updateGuildRankConfig(interaction.guildId!, config);

        const embed = EmbedFactory.success(
          'Rank Role Removed',
          `Removed ${removed.roleName} from level ${level}.`
        );

        await interaction.reply({ embeds: [embed] });

      } else if (subcommand === 'list') {
        if (config.rankRoles.length === 0) {
          return interaction.reply({
            embeds: [EmbedFactory.leveling('Rank Roles').setDescription('No rank roles configured yet.')]
          });
        }

        let description = '';
        for (const rankRole of config.rankRoles) {
          description += `**Level ${rankRole.level}** → <@&${rankRole.roleId}>\n`;
        }

        const embed = EmbedFactory.leveling('Rank Roles')
          .setDescription(description);

        await interaction.reply({ embeds: [embed] });
      }
    } catch (error) {
      console.error('Rankroles command error:', error);
      const errorEmbed = EmbedFactory.error('Error', 'Failed to manage rank roles.');
      await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  }
};
