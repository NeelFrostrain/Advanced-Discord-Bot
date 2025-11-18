import { GuildMember } from 'discord.js';
import { ExtendedClient } from '../types/index.js';
import { inviteTracker } from '../utils/inviteTracker.js';
import { analytics } from '../utils/analytics.js';
import { EmbedFactory } from '../utils/embeds.js';

export default {
  name: 'guildMemberAdd',
  async execute(member: GuildMember, client: ExtendedClient) {
    try {
      // Track join in analytics
      await analytics.trackJoin(member.id, member.guild.id);

      // Track invite usage
      const inviteUse = await inviteTracker.trackJoin(member);

      if (!inviteUse) return;

      // Get guild config
      const config = await inviteTracker.getGuildConfig(member.guild.id);

      // Auto-kick if configured
      if (config.autoKickFakes && inviteUse.isFake) {
        try {
          await member.kick('Fake/Alt account detected');
          console.log(`Auto-kicked fake account: ${member.user.tag}`);
        } catch (error) {
          console.error('Failed to auto-kick:', error);
        }
      }

      // Send join log if channel is configured
      if (config.logChannelId) {
        const logChannel = member.guild.channels.cache.get(config.logChannelId);
        if (logChannel?.isTextBased()) {
          const accountAgeDays = Math.floor(inviteUse.accountAge);
          const accountAgeText = accountAgeDays < 1 
            ? `${Math.floor(inviteUse.accountAge * 24)} hours`
            : `${accountAgeDays} days`;

          const embed = EmbedFactory.success('Member Joined', '')
            .setThumbnail(member.user.displayAvatarURL())
            .addFields(
              { name: '👤 User', value: `${member.user.tag}\n<@${member.id}>`, inline: true },
              { name: '🎫 Invited By', value: inviteUse.inviterId !== 'unknown' ? `<@${inviteUse.inviterId}>` : 'Unknown', inline: true },
              { name: '📅 Account Age', value: accountAgeText, inline: true },
              { name: '🔗 Invite Code', value: inviteUse.inviteCode, inline: true },
              { name: '📊 Join Method', value: inviteUse.joinMethod, inline: true },
              { name: '👥 Member Count', value: `${member.guild.memberCount}`, inline: true }
            )
            .setFooter({ text: `User ID: ${member.id}` })
            .setTimestamp();

          // Add warning if suspicious
          if (inviteUse.isFake) {
            embed.setColor('#ff0000');
            embed.addFields({ name: '⚠️ Warning', value: 'This account is flagged as suspicious/fake!' });
          }

          // Get alt detection data
          const altData = await inviteTracker.getAltDetection(member.id, member.guild.id);
          if (altData && altData.isSuspicious) {
            embed.addFields({ 
              name: '🚨 Suspicion Reasons', 
              value: altData.suspicionReasons.join('\n') 
            });
            embed.addFields({ 
              name: '📊 Quality Score', 
              value: `${altData.qualityScore}/100` 
            });
          }

          await logChannel.send({ embeds: [embed] });
        }
      }
    } catch (error) {
      console.error('Error in guildMemberAdd:', error);
    }
  }
};
