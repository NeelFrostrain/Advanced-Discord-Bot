import { SlashCommandBuilder } from 'discord.js';
import { EmbedFactory } from '../../utils/embeds.js';
import { getGuildRankConfig } from '../../database/index.js';
export default {
    data: new SlashCommandBuilder()
        .setName('rankrewards')
        .setDescription('View all available rank rewards'),
    async execute(interaction, client) {
        try {
            const config = await getGuildRankConfig(interaction.guildId);
            if (!config.rankRoles || config.rankRoles.length === 0) {
                const embed = EmbedFactory.leveling('Rank Rewards')
                    .setDescription('No rank rewards have been configured yet.\n\nAdmins can add rewards using `/rankroles add`');
                return interaction.reply({ embeds: [embed] });
            }
            let description = '🎁 **Level up to unlock these rewards!**\n\n';
            for (const reward of config.rankRoles) {
                description += `**Level ${reward.level}** → <@&${reward.roleId}>\n`;
            }
            const embed = EmbedFactory.leveling('Rank Rewards')
                .setDescription(description)
                .setFooter({ text: `${config.rankRoles.length} reward${config.rankRoles.length !== 1 ? 's' : ''} available` });
            await interaction.reply({ embeds: [embed] });
        }
        catch (error) {
            console.error('Rankrewards command error:', error);
            const errorEmbed = EmbedFactory.error('Error', 'Failed to fetch rank rewards.');
            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    }
};
