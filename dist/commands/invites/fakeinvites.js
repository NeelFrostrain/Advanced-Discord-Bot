import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { EmbedFactory } from '../../utils/embeds.js';
import { inviteTracker } from '../../utils/inviteTracker.js';
export default {
    data: new SlashCommandBuilder()
        .setName('fakeinvites')
        .setDescription('View suspicious/fake joins (Admin only)')
        .addIntegerOption(option => option.setName('days')
        .setDescription('Days to look back')
        .setMinValue(1)
        .setMaxValue(30)
        .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction, client) {
        const days = interaction.options.getInteger('days') || 7;
        try {
            await interaction.deferReply({ ephemeral: true });
            const suspicious = await inviteTracker.getSuspiciousJoins(interaction.guildId, days);
            if (suspicious.length === 0) {
                return interaction.editReply({
                    embeds: [EmbedFactory.success('No Suspicious Joins', `No suspicious joins in the last ${days} days.`)]
                });
            }
            let description = `**🚨 Suspicious Joins (Last ${days} days)**\n\n`;
            for (const detection of suspicious.slice(0, 10)) {
                const member = await interaction.guild?.members.fetch(detection.userId).catch(() => null);
                const status = member ? '✅ Still here' : '❌ Left';
                description += `<@${detection.userId}> ${status}\n`;
                description += `└ 📊 Quality: ${detection.qualityScore}/100\n`;
                description += `└ ⚠️ ${detection.suspicionReasons.join(', ')}\n\n`;
            }
            if (suspicious.length > 10) {
                description += `\n*...and ${suspicious.length - 10} more*`;
            }
            const embed = EmbedFactory.error('🚨 Suspicious Joins', description)
                .setFooter({ text: `Total: ${suspicious.length} suspicious joins` });
            await interaction.editReply({ embeds: [embed] });
        }
        catch (error) {
            console.error('Fakeinvites command error:', error);
            await interaction.editReply({
                embeds: [EmbedFactory.error('Error', 'Failed to fetch suspicious joins.')]
            });
        }
    }
};
