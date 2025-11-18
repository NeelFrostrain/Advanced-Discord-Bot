import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { EmbedFactory } from '../../utils/embeds.js';
export default {
    data: new SlashCommandBuilder()
        .setName('lockdown')
        .setDescription('Lock or unlock a channel')
        .addBooleanOption(option => option.setName('lock')
        .setDescription('True to lock, false to unlock')
        .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    async execute(interaction, client) {
        const lock = interaction.options.getBoolean('lock', true);
        try {
            if (!interaction.channel || !('permissionOverwrites' in interaction.channel)) {
                const embed = EmbedFactory.error('Error', 'Cannot lock this channel type.');
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }
            await interaction.channel.permissionOverwrites.edit(interaction.guildId, {
                SendMessages: !lock
            });
            const embed = EmbedFactory.moderation(lock ? 'Channel Locked' : 'Channel Unlocked')
                .setDescription(lock ? '🔒 This channel has been locked.' : '🔓 This channel has been unlocked.');
            await interaction.reply({ embeds: [embed] });
        }
        catch (error) {
            console.error('Lockdown command error:', error);
            const errorEmbed = EmbedFactory.error('Error', 'Failed to lock/unlock channel!');
            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    }
};
