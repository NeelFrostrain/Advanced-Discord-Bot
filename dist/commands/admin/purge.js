import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { EmbedFactory } from '../../utils/embeds.js';
export default {
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription('Purge messages (alias for clear)')
        .addIntegerOption(option => option.setName('amount')
        .setDescription('Number of messages to delete (1-100)')
        .setMinValue(1)
        .setMaxValue(100)
        .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(interaction, client) {
        const amount = interaction.options.getInteger('amount', true);
        await interaction.deferReply({ ephemeral: true });
        try {
            if (!interaction.channel || !interaction.channel.isTextBased() || interaction.channel.isDMBased()) {
                const embed = EmbedFactory.error('Error', 'Cannot purge messages in this channel type.');
                return interaction.editReply({ embeds: [embed] });
            }
            const messages = await interaction.channel.messages.fetch({ limit: amount });
            const deleted = await interaction.channel.bulkDelete(messages, true);
            const embed = EmbedFactory.success('Messages Purged')
                .setDescription(`🗑️ Successfully deleted **${deleted.size}** messages.`);
            await interaction.editReply({ embeds: [embed] });
        }
        catch (error) {
            console.error('Purge command error:', error);
            const errorEmbed = EmbedFactory.error('Error', 'Failed to purge messages!');
            await interaction.editReply({ embeds: [errorEmbed] });
        }
    }
};
