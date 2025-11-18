import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, ChannelType } from 'discord.js';
import { ExtendedClient } from '../../types/index.js';
import { EmbedFactory } from '../../utils/embeds.js';
import { inviteTracker } from '../../utils/inviteTracker.js';

export default {
  data: new SlashCommandBuilder()
    .setName('inviteconfig')
    .setDescription('Configure invite tracking (Admin only)')
    .addSubcommand(subcommand =>
      subcommand
        .setName('logchannel')
        .setDescription('Set invite log channel')
        .addChannelOption(option =>
          option.setName('channel')
            .setDescription('Channel for invite logs')
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(false)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('minaccountage')
        .setDescription('Set minimum account age (days)')
        .addIntegerOption(option =>
          option.setName('days')
            .setDescription('Minimum account age in days')
            .setMinValue(0)
            .setMaxValue(365)
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('autokick')
        .setDescription('Toggle auto-kick for fake/alt accounts')
        .addStringOption(option =>
          option.setName('type')
            .setDescription('What to auto-kick')
            .addChoices(
              { name: 'Fake Accounts', value: 'fakes' },
              { name: 'Alt Accounts', value: 'alts' },
              { name: 'Both', value: 'both' }
            )
            .setRequired(true)
        )
        .addBooleanOption(option =>
          option.setName('enabled')
            .setDescription('Enable or disable')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('view')
        .setDescription('View current configuration')
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction: ChatInputCommandInteraction, client: ExtendedClient) {
    const subcommand = interaction.options.getSubcommand();

    try {
      const config = await inviteTracker.getGuildConfig(interaction.guildId!);

      if (subcommand === 'logchannel') {
        const channel = interaction.options.getChannel('channel');

        if (channel) {
          await inviteTracker.updateGuildConfig(interaction.guildId!, {
            logChannelId: channel.id
          });

          return interaction.reply({
            embeds: [EmbedFactory.success('Log Channel Set', `Invite logs will be sent to ${channel}.`)]
          });
        } else {
          await inviteTracker.updateGuildConfig(interaction.guildId!, {
            logChannelId: undefined
          });

          return interaction.reply({
            embeds: [EmbedFactory.success('Log Channel Removed', 'Invite logging disabled.')]
          });
        }
      }

      if (subcommand === 'minaccountage') {
        const days = interaction.options.getInteger('days', true);

        await inviteTracker.updateGuildConfig(interaction.guildId!, {
          minAccountAge: days
        });

        return interaction.reply({
          embeds: [EmbedFactory.success('Account Age Updated', `Minimum account age set to ${days} days.`)]
        });
      }

      if (subcommand === 'autokick') {
        const type = interaction.options.getString('type', true);
        const enabled = interaction.options.getBoolean('enabled', true);

        const updates: any = {};
        if (type === 'fakes' || type === 'both') {
          updates.autoKickFakes = enabled;
        }
        if (type === 'alts' || type === 'both') {
          updates.autoKickAlts = enabled;
        }

        await inviteTracker.updateGuildConfig(interaction.guildId!, updates);

        return interaction.reply({
          embeds: [EmbedFactory.success(
            'Auto-Kick Updated',
            `Auto-kick for ${type} is now ${enabled ? 'enabled' : 'disabled'}.`
          )]
        });
      }

      if (subcommand === 'view') {
        const embed = EmbedFactory.leveling('⚙️ Invite Tracking Configuration')
          .addFields(
            { name: '📊 Tracking', value: config.trackingEnabled ? '✅ Enabled' : '❌ Disabled', inline: true },
            { name: '📢 Log Channel', value: config.logChannelId ? `<#${config.logChannelId}>` : 'Not set', inline: true },
            { name: '📅 Min Account Age', value: `${config.minAccountAge} days`, inline: true },
            { name: '🚫 Auto-Kick Fakes', value: config.autoKickFakes ? '✅ Enabled' : '❌ Disabled', inline: true },
            { name: '🚫 Auto-Kick Alts', value: config.autoKickAlts ? '✅ Enabled' : '❌ Disabled', inline: true },
            { name: '⚠️ Suspicious Threshold', value: config.suspiciousJoinThreshold.toString(), inline: true }
          );

        return interaction.reply({ embeds: [embed] });
      }
    } catch (error) {
      console.error('Inviteconfig command error:', error);
      await interaction.reply({
        embeds: [EmbedFactory.error('Error', 'Failed to update configuration.')],
        ephemeral: true
      });
    }
  }
};
