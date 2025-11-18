import { VoiceState } from 'discord.js';
import { ExtendedClient } from '../types/index.js';
import { analytics } from '../utils/analytics.js';

// Track voice session start times
const voiceSessions = new Map<string, number>();

export default {
  name: 'voiceStateUpdate',
  async execute(oldState: VoiceState, newState: VoiceState, client: ExtendedClient) {
    if (!newState.member || newState.member.user.bot) return;

    const userId = newState.member.id;
    const guildId = newState.guild.id;
    const sessionKey = `${guildId}-${userId}`;

    try {
      // User joined a voice channel
      if (!oldState.channel && newState.channel) {
        voiceSessions.set(sessionKey, Date.now());
      }

      // User left a voice channel
      if (oldState.channel && !newState.channel) {
        const startTime = voiceSessions.get(sessionKey);
        if (startTime) {
          const duration = Date.now() - startTime;
          const minutes = Math.floor(duration / (1000 * 60));

          if (minutes > 0) {
            await analytics.trackVoice(userId, guildId, oldState.channel.id, minutes);
          }

          voiceSessions.delete(sessionKey);
        }
      }

      // User switched channels
      if (oldState.channel && newState.channel && oldState.channel.id !== newState.channel.id) {
        const startTime = voiceSessions.get(sessionKey);
        if (startTime) {
          const duration = Date.now() - startTime;
          const minutes = Math.floor(duration / (1000 * 60));

          if (minutes > 0) {
            await analytics.trackVoice(userId, guildId, oldState.channel.id, minutes);
          }

          // Reset session for new channel
          voiceSessions.set(sessionKey, Date.now());
        }
      }
    } catch (error) {
      console.error('Error tracking voice state:', error);
    }
  }
};
