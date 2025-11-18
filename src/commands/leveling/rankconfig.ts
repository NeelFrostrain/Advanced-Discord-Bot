import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, ChannelType } from 'discord.js';
import { ExtendedClient } from '../../types/index.js';
import { EmbedFactory } from '../../utils/embeds.js';
import { getGuildRankConfig, updateGuildRankConfig } from '../../database/index.js';

export default {
  data: new SlashCommandBuilder()
    .setName('rankconfig')
    .setDescription('Configure rank system settings (Admin only)')
    .addSubcommand(subcommand =>
      subcommand
        .setName('xp')
        .setDescription('Set XP per message')
        .addIntegerOption(option =>
          option.setName('amount')
            .setDescription('XP amount (default: 15)')
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(100)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('cooldown')
        .setDescription('Set XP gain cooldown')
        .addIntegerOption(option =>
          option.setName('seconds')
            .setDescription('Cooldown in seconds (default: 60)')
            .setRequired(true)
            .setMinValue(0)
            .setMaxValue(300)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('levelupchannel')
        .setDescription('Set level up announcement channel')
        .addChannelOption(option =>
          option.setName('channel')
            .setDescription('Channel for level up messages')
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(false)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('multiplier')
        .setDescription('Set XP multiplier for a role')
        .addRoleOption(option =>
          option.setName('role')
            .setDescription('Role to apply multiplier')
            .setRequired(true)
        )
        .addNumberOption(option =>
          option.setName('multiplier')
            .setDescription('Multiplier (e.g., 1.5 for 50% bonus, 0 to remove)')
            .setRequired(true)
            .setMinValue(0)
            .setMaxValue(5)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('view')
        .setDescription('View current rank configuration')
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction: ChatInputCommandInteraction, client: ExtendedClient) {
    const subcommand = interaction.options.getSubcommand();

    try {
      const config = await getGuildRankConfig(interaction.guildId!);

      if (subcommand === 'xp') {
        const amount = interaction.options.getInteger('amount', true);
        config.xpPerMessage = amount;
        await updateGuildRankConfig(interaction.guildId!, config);

        const embed = EmbedFactory.success(
          'XP Updated',
          `Users will now gain ${amount} XP per message.`
        );
        await interaction.reply({ embeds: [embed] });

      } else if (subcommand === 'cooldown') {
        const seconds = interaction.options.getInteger('seconds', true);
        config.xpCooldown = seconds * 1000;
        await updateGuildRankConfig(interaction.guildId!, config);

        const embed = EmbedFactory.success(
          'Cooldown Updated',
          `XP cooldown set to ${seconds} seconds.`
        );
        await interaction.reply({ embeds: [embed] });

      } else if (subcommand === 'levelupchannel') {
        const channel = interaction.options.getChannel('channel');
        
        if (channel) {
          config.levelUpChannel = channel.id;
          await updateGuildRankConfig(interaction.guildId!, config);

          const embed = EmbedFactory.success(
            'Level Up Channel Set',
            `Level up messages will be sent to ${channel}.`
          );
          await interaction.reply({ embeds: [embed] });
        } else {
          config.levelUpChannel = undefined;
          await updateGuildRankConfig(interaction.guildId!, config);

          const embed = EmbedFactory.success(
            'Level Up Channel Removed',
            'Level up messages will be sent in the same channel.'
          );
          await interaction.reply({ embeds: [embed] });
        }

      } else if (subcommand === 'multiplier') {
        const role = interaction.options.getRole('role', true);
        const multiplier = interaction.options.getNumber('multiplier', true);

        if (!config.multipliers) config.multipliers = {};

        if (multiplier === 0) {
          delete config.multipliers[role.id];
          await updateGuildRankConfig(interaction.guildId!, config);

          const embed = EmbedFactory.success(
            'Multiplier Removed',
            `Removed XP multiplier for ${role.name}.`
          );
          await interaction.reply({ embeds: [embed] });
        } else {
          config.multipliers[role.id] = multiplier;
          await updateGuildRankConfig(interaction.guildId!, config);

          const embed = EmbedFactory.success(
            'Multiplier Set',
            `${role.name} now has ${multiplier}x XP multiplier!`
          );
          await interaction.reply({ embeds: [embed] });
        }

      } else if (subcommand === 'view') {
        const embed = EmbedFactory.leveling('Rank Configuration')
          .addFields(
            { name: '⭐ XP Per Message', value: `${config.xpPerMessage}`, inline: true },
            { name: '⏱️ Cooldown', value: `${config.xpCooldown / 1000}s`, inline: true },
            { name: '📢 Level Up Channel', value: config.levelUpChannel ? `<#${config.levelUpChannel}>` : 'Same channel', inline: true }
          );

        if (config.multipliers && Object.keys(config.multipliers).length > 0) {
          let multiplierText = '';
          for (const [roleId, mult] of Object.entries(config.multipliers)) {
            multiplierText += `<@&${roleId}>: ${mult}x\n`;
          }
          embed.addFields({ name: '✨ Role Multipliers', value: multiplierText });
        }

        await interaction.reply({ embeds: [embed] });
      }
    } catch (error) {
      console.error('Rankconfig command error:', error);
      const errorEmbed = EmbedFactory.error('Error', 'Failed to update configuration.');
      await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  }
};
