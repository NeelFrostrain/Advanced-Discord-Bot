import { inviteTracker } from '../utils/inviteTracker.js';
import { analytics } from '../utils/analytics.js';
import { EmbedFactory } from '../utils/embeds.js';
export default {
    name: 'guildMemberRemove',
    async execute(member, client) {
        try {
            // Track leave in analytics
            await analytics.trackLeave(member.id, member.guild.id);
            // Track invite leave
            await inviteTracker.trackLeave(member);
            // Get guild config
            const config = await inviteTracker.getGuildConfig(member.guild.id);
            // Send leave log if channel is configured
            if (config.logChannelId) {
                const logChannel = member.guild.channels.cache.get(config.logChannelId);
                if (logChannel?.isTextBased()) {
                    const embed = EmbedFactory.error('Member Left', '')
                        .setThumbnail(member.user.displayAvatarURL())
                        .addFields({ name: '👤 User', value: `${member.user.tag}\n<@${member.id}>`, inline: true }, { name: '👥 Member Count', value: `${member.guild.memberCount}`, inline: true })
                        .setFooter({ text: `User ID: ${member.id}` })
                        .setTimestamp();
                    await logChannel.send({ embeds: [embed] });
                }
            }
        }
        catch (error) {
            console.error('Error in guildMemberRemove:', error);
        }
    }
};
