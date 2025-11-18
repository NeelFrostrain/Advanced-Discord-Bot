import { Message } from 'discord.js';
import { ExtendedClient } from '../types/index.js';
import { addXP } from '../utils/leveling.js';
import { EmbedFactory } from '../utils/embeds.js';
import { getGuildRankConfig, getUserLevel } from '../database/index.js';
import { analytics } from '../utils/analytics.js';

const xpCooldowns = new Map<string, number>();

export default {
  name: 'messageCreate',
  async execute(message: Message, client: ExtendedClient) {
    if (message.author.bot || !message.guild) return;

    // Track message in analytics
    try {
      await analytics.trackMessage(message.author.id, message.guild.id, message.channel.id);
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }

    // XP System with Rank Configuration
    const cooldownKey = `${message.guild.id}-${message.author.id}`;
    const now = Date.now();

    try {
      const config = await getGuildRankConfig(message.guild.id);
      const cooldownAmount = config.xpCooldown || 60000;

      // Check if channel is disabled
      if (config.disabledChannels?.includes(message.channel.id)) return;
      
      // Check if only enabled channels are set and this isn't one
      if (config.enabledChannels && config.enabledChannels.length > 0 && !config.enabledChannels.includes(message.channel.id)) {
        return;
      }

      const lastXP = xpCooldowns.get(cooldownKey) || 0;
      if (now - lastXP < cooldownAmount) return;

      xpCooldowns.set(cooldownKey, now);

      // Calculate XP multiplier based on roles
      let multiplier = 1;
      if (config.multipliers && message.member) {
        for (const [roleId, mult] of Object.entries(config.multipliers)) {
          if (message.member.roles.cache.has(roleId)) {
            multiplier = Math.max(multiplier, mult as number);
          }
        }
      }

      const xpAmount = config.xpPerMessage || 15;
      const randomXP = Math.floor(Math.random() * 10) + xpAmount;
      
      const result = await addXP(message.author.id, message.guild.id, randomXP, multiplier);
      
      if (result.leveledUp) {
        // Check for rank role rewards
        const rankRole = config.rankRoles?.find((r: any) => r.level === result.newLevel);
        if (rankRole && message.member) {
          try {
            await message.member.roles.add(rankRole.roleId);
          } catch (err) {
            console.error('Failed to add rank role:', err);
          }
        }

        // Send level up message
        const embed = EmbedFactory.leveling('Level Up! 🎉')
          .setDescription(`Congratulations ${message.author}! You've reached **Level ${result.newLevel}**!`)
          .addFields(
            { name: '⭐ XP Gained', value: `+${result.xpGained}`, inline: true },
            { name: '💫 Total XP', value: `${result.xp.toLocaleString()}`, inline: true }
          );

        if (rankRole) {
          embed.addFields({ name: '🎁 Reward Unlocked', value: `<@&${rankRole.roleId}>` });
        }

        // Send to configured channel or reply
        if (config.levelUpChannel) {
          const channel = message.guild.channels.cache.get(config.levelUpChannel);
          if (channel?.isTextBased()) {
            channel.send({ embeds: [embed] }).catch(() => {});
          }
        } else {
          message.reply({ embeds: [embed] }).catch(() => {});
        }
      }
    } catch (error) {
      console.error('XP system error:', error);
    }

    // Prefix commands (optional)
    const prefix = process.env.PREFIX || '!';
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift()?.toLowerCase();

    // Handle prefix commands here if needed
  }
};
