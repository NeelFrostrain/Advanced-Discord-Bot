import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, ChannelType } from 'discord.js';
import { ExtendedClient } from '../../types/index.js';
import { EmbedFactory } from '../../utils/embeds.js';

export default {
  data: new SlashCommandBuilder()
    .setName('announce')
    .setDescription('Send an announcement')
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('Channel to send announcement')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('title')
        .setDescription('Announcement title')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('message')
        .setDescription('Announcement message')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('color')
        .setDescription('Embed color')
        .addChoices(
          { name: 'Blue', value: '#5865F2' },
          { name: 'Green', value: '#00FF00' },
          { name: 'Red', value: '#FF0000' },
          { name: 'Gold', value: '#FFD700' },
          { name: 'Purple', value: '#9B59B6' }
        )
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction: ChatInputCommandInteraction, client: ExtendedClient) {
    const channel = interaction.options.getChannel('channel', true);
    const title = interaction.options.getString('title', true);
    const message = interaction.options.getString('message', true);
    const color = interaction.options.getString('color') || '#5865F2';

    try {
      const embed = EmbedFactory.custom(color as any, `📢 ${title}`)
        .setDescription(message)
        .setFooter({ text: `Announced by ${interaction.user.username}` });

      await (channel as any).send({ embeds: [embed] });

      const successEmbed = EmbedFactory.success('Announcement Sent!', `Announcement sent to ${channel}`);
      await interaction.reply({ embeds: [successEmbed], ephemeral: true });
    } catch (error) {
      console.error('Announce command error:', error);
      const errorEmbed = EmbedFactory.error('Error', 'Failed to send announcement.');
      await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  }
};
