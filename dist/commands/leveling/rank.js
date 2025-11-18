import { SlashCommandBuilder } from 'discord.js';
import { EmbedFactory } from '../../utils/embeds.js';
import { getUserLevel } from '../../database/index.js';
import { calculateLevel } from '../../utils/leveling.js';
export default {
    data: new SlashCommandBuilder()
        .setName('rank')
        .setDescription('Check your or another user\'s rank')
        .addUserOption(option => option.setName('user')
        .setDescription('The user to check')
        .setRequired(false)),
    async execute(interaction, client) {
        const target = interaction.options.getUser('user') || interaction.user;
        try {
            const levelData = await getUserLevel(target.id, interaction.guildId);
            const { level, currentXP, requiredXP } = calculateLevel(levelData.xp);
            // Calculate server rank
            const { getDatabase } = await import('../../database/index.js');
            const db = getDatabase();
            const allData = await db.get(`levels.${interaction.guildId}`);
            let rank = 1;
            if (allData) {
                const users = Object.values(allData);
                const sorted = users.sort((a, b) => b.xp - a.xp);
                rank = sorted.findIndex(u => u.id === target.id) + 1;
            }
            const progressBar = createProgressBar(currentXP, requiredXP);
            const progressPercent = Math.round((currentXP / requiredXP) * 100);
            const embed = EmbedFactory.leveling(`${target.username}'s Rank`)
                .setThumbnail(target.displayAvatarURL({ size: 256 }))
                .setDescription(`${progressBar} **${progressPercent}%**`)
                .addFields({ name: '🏆 Rank', value: `#${rank}`, inline: true }, { name: '📊 Level', value: `${level}`, inline: true }, { name: '⭐ XP', value: `${currentXP}/${requiredXP}`, inline: true }, { name: '💫 Total XP', value: `${levelData.xp.toLocaleString()}`, inline: true }, { name: '💬 Messages', value: `${levelData.messages || 0}`, inline: true }, { name: '📈 To Next Level', value: `${(requiredXP - currentXP).toLocaleString()} XP`, inline: true });
            // Apply custom rank card colors if set
            if (levelData.rankCard) {
                const card = levelData.rankCard;
                if (card.accentColor) {
                    embed.setColor(card.accentColor);
                }
            }
            await interaction.reply({ embeds: [embed] });
        }
        catch (error) {
            console.error('Rank command error:', error);
            const errorEmbed = EmbedFactory.error('Database Error', 'Failed to fetch rank. Please try again later.');
            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    }
};
function createProgressBar(current, max, length = 20) {
    const percentage = Math.min(current / max, 1);
    const filled = Math.round(length * percentage);
    const empty = length - filled;
    return `[${'█'.repeat(filled)}${'░'.repeat(empty)}] ${Math.round(percentage * 100)}%`;
}
