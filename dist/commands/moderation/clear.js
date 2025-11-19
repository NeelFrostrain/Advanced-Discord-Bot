import { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } from 'discord.js';
import { EmbedFactory } from '../../utils/embeds.js';
export default {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Clear messages from a channel')
        .addIntegerOption(option => option.setName('amount')
        .setDescription('Number of messages to delete (1-100)')
        .setMinValue(1)
        .setMaxValue(100)
        .setRequired(true))
        .addUserOption(option => option.setName('user')
        .setDescription('Only delete messages from this user')
        .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(interaction, client) {
        const amount = interaction.options.getInteger('amount', true);
        const targetUser = interaction.options.getUser('user');
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
        try {
            if (!interaction.channel || !interaction.channel.isTextBased() || interaction.channel.isDMBased()) {
                const embed = EmbedFactory.error('Error', 'Cannot clear messages in this channel type.');
                return interaction.editReply({ embeds: [embed] });
            }
            const messages = await interaction.channel.messages.fetch({ limit: amount });
            let toDelete = messages;
            if (targetUser) {
                toDelete = messages.filter(msg => msg.author.id === targetUser.id);
            }
            const deleted = await interaction.channel.bulkDelete(toDelete, true);
            const embed = EmbedFactory.success('Messages Cleared')
                .setDescription(`🗑️ Successfully deleted **${deleted.size}** messages${targetUser ? ` from ${targetUser}` : ''}.`);
            await interaction.editReply({ embeds: [embed] });
        }
        catch (error) {
            console.error('Clear command error:', error);
            const errorEmbed = EmbedFactory.error('Error', 'Failed to clear messages! Messages older than 14 days cannot be deleted.');
            await interaction.editReply({ embeds: [errorEmbed] });
        }
    }
};
