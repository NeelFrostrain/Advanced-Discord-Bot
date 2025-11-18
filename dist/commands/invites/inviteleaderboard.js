import { SlashCommandBuilder } from 'discord.js';
import { EmbedFactory } from '../../utils/embeds.js';
import { inviteTracker } from '../../utils/inviteTracker.js';
export default {
    data: new SlashCommandBuilder()
        .setName('inviteleaderboard')
        .setDescription('View top inviters')
        .addIntegerOption(option => option.setName('limit')
        .setDescription('Number of users to show')
        .setMinValue(5)
        .setMaxValue(25)
        .setRequired(false)),
    async execute(interaction, client) {
        const limit = interaction.options.getInteger('limit') || 10;
        try {
            await interaction.deferReply();
            const leaderboard = await inviteTracker.getLeaderboard(interaction.guildId, limit);
            if (leaderboard.length === 0) {
                return interaction.editReply({
                    embeds: [EmbedFactory.error('No Data', 'No invite data available yet.')]
                });
            }
            let description = '';
            for (let i = 0; i < leaderboard.length; i++) {
                const inviter = leaderboard[i];
                const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `**${i + 1}.**`;
                const totalValid = inviter.realInvites - inviter.leftInvites;
                description += `${medal} <@${inviter.userId}>\n`;
                description += `└ ✅ ${inviter.totalInvites} total • 👥 ${inviter.realInvites} real • 💎 ${totalValid} valid\n\n`;
            }
            const embed = EmbedFactory.leveling(`🏆 Top ${limit} Inviters`)
                .setDescription(description)
                .setFooter({ text: `Showing top ${leaderboard.length} inviters` });
            await interaction.editReply({ embeds: [embed] });
        }
        catch (error) {
            console.error('Inviteleaderboard command error:', error);
            await interaction.editReply({
                embeds: [EmbedFactory.error('Error', 'Failed to fetch invite leaderboard.')]
            });
        }
    }
};
