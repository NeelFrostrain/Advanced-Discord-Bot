import { SlashCommandBuilder } from 'discord.js';
import { EmbedFactory } from '../../utils/embeds.js';
import { analytics } from '../../utils/analytics.js';
export default {
    data: new SlashCommandBuilder()
        .setName('topactive')
        .setDescription('View most active members')
        .addIntegerOption(option => option.setName('limit')
        .setDescription('Number of users to show')
        .setMinValue(5)
        .setMaxValue(25)
        .setRequired(false)),
    async execute(interaction, client) {
        const limit = interaction.options.getInteger('limit') || 10;
        try {
            await interaction.deferReply();
            const topMembers = await analytics.getTopMembers(interaction.guildId, limit);
            if (topMembers.length === 0) {
                return interaction.editReply({
                    embeds: [EmbedFactory.error('No Data', 'No activity data available yet.')]
                });
            }
            let description = '';
            for (let i = 0; i < topMembers.length; i++) {
                const member = topMembers[i];
                const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `**${i + 1}.**`;
                description += `${medal} <@${member.userId}>\n`;
                description += `└ 💬 ${member.messages} msgs • 🎤 ${Math.floor(member.voiceMinutes)}m voice • ⭐ ${member.activityScore} score\n\n`;
            }
            const embed = EmbedFactory.leveling(`🏆 Top ${limit} Active Members`)
                .setDescription(description)
                .setFooter({ text: `Showing top ${topMembers.length} members` });
            await interaction.editReply({ embeds: [embed] });
        }
        catch (error) {
            console.error('Topactive command error:', error);
            await interaction.editReply({
                embeds: [EmbedFactory.error('Error', 'Failed to fetch active members.')]
            });
        }
    }
};
