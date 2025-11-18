import { SlashCommandBuilder } from 'discord.js';
import { EmbedFactory } from '../../utils/embeds.js';
export default {
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Get information about the server'),
    async execute(interaction, client) {
        const { guild } = interaction;
        if (!guild) {
            const errorEmbed = EmbedFactory.error('Error', 'This command can only be used in a server.');
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
        const embed = EmbedFactory.info(`${guild.name} Information`)
            .setThumbnail(guild.iconURL({ size: 256 }) || '')
            .addFields({ name: '🆔 Server ID', value: guild.id, inline: true }, { name: '👑 Owner', value: `<@${guild.ownerId}>`, inline: true }, { name: '📅 Created', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`, inline: true }, { name: '👥 Members', value: `${guild.memberCount}`, inline: true }, { name: '📺 Channels', value: `${guild.channels.cache.size}`, inline: true }, { name: '🎭 Roles', value: `${guild.roles.cache.size}`, inline: true }, { name: '⭐ Boost Level', value: `${guild.premiumTier}`, inline: true }, { name: '💎 Boosts', value: `${guild.premiumSubscriptionCount || 0}`, inline: true });
        if (guild.description) {
            embed.setDescription(guild.description);
        }
        await interaction.reply({ embeds: [embed] });
    }
};
