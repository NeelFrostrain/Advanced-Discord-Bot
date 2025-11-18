import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, ChannelType } from 'discord.js';
import { ExtendedClient } from '../../types/index.js';
import { EmbedFactory } from '../../utils/embeds.js';
import { getDatabase } from '../../database/index.js';

export default {
  data: new SlashCommandBuilder()
    .setName('setwelcome')
    .setDescription('Configure welcome messages')
    .addSubcommand(subcommand =>
      subcommand
        .setName('enable')
        .setDescription('Enable welcome messages')
        .addChannelOption(option =>
          option.setName('channel')
            .setDescription('Channel to send welcome messages')
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
        .addStringOption(option =>
          option.setName('message')
            .setDescription('Welcome message (use {user}, {username}, {server}, {memberCount})')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('disable')
        .setDescription('Disable welcome messages')
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction: ChatInputCommandInteraction, client: ExtendedClient) {
    const subcommand = interaction.options.getSubcommand();
    const db = getDatabase();
    const settingsKey = `settings.${interaction.guildId}.welcome`;

    try {
      if (subcommand === 'enable') {
        const channel = interaction.options.getChannel('channel', true);
        const message = interaction.options.getString('message', true);

        await db.set(settingsKey, {
          enabled: true,
          channelId: channel.id,
          message: message
        });

        const embed = EmbedFactory.success('Welcome Messages Enabled')
          .addFields(
            { name: '📺 Channel', value: `<#${channel.id}>`, inline: true },
            { name: '💬 Message', value: message, inline: false }
          );

        await interaction.reply({ embeds: [embed] });
      } else if (subcommand === 'disable') {
        await db.set(settingsKey, { enabled: false });

        const embed = EmbedFactory.warning('Welcome Messages Disabled', 'Welcome messages have been turned off.');
        await interaction.reply({ embeds: [embed] });
      }
    } catch (error) {
      console.error('SetWelcome command error:', error);
      const errorEmbed = EmbedFactory.error('Error', 'Failed to configure welcome messages.');
      await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  }
};
