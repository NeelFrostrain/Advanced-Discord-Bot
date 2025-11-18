import { getDatabase } from '../database/index.js';
import { MemberActivity, ChannelAnalytics, ServerAnalytics } from '../types/database.js';

export class AnalyticsTracker {
  private static instance: AnalyticsTracker;
  private db = getDatabase();

  static getInstance(): AnalyticsTracker {
    if (!this.instance) {
      this.instance = new AnalyticsTracker();
    }
    return this.instance;
  }

  // Track message activity
  async trackMessage(userId: string, guildId: string, channelId: string): Promise<void> {
    const today = this.getDateKey();
    const hour = new Date().getHours();

    // Update member activity
    const memberPath = `analytics.members.${guildId}.${userId}`;
    let member = await this.db.get(memberPath) as MemberActivity;

    if (!member) {
      member = {
        userId,
        guildId,
        messages: 0,
        voiceMinutes: 0,
        reactions: 0,
        emojisUsed: {},
        dailyMessages: {},
        dailyVoice: {},
        lastActive: Date.now(),
        joinedAt: Date.now(),
        activityScore: 0,
        engagementScore: 0,
        streak: 0
      };
    }

    member.messages++;
    member.dailyMessages[today] = (member.dailyMessages[today] || 0) + 1;
    member.lastActive = Date.now();
    member.activityScore = this.calculateActivityScore(member);
    member.engagementScore = this.calculateEngagementScore(member);

    await this.db.set(memberPath, member);

    // Update channel analytics
    const channelPath = `analytics.channels.${guildId}.${channelId}`;
    let channel = await this.db.get(channelPath) as any;

    if (!channel) {
      channel = {
        channelId,
        guildId,
        name: '',
        type: 'text',
        messages: 0,
        voiceMinutes: 0,
        activeUsers: [],
        hourlyActivity: {},
        dailyActivity: {}
      };
    }

    channel.messages++;
    channel.hourlyActivity[hour] = (channel.hourlyActivity[hour] || 0) + 1;
    channel.dailyActivity[today] = (channel.dailyActivity[today] || 0) + 1;
    
    // Convert to array if it's not already
    if (!Array.isArray(channel.activeUsers)) {
      channel.activeUsers = [];
    }
    
    // Add user if not already in array
    if (!channel.activeUsers.includes(userId)) {
      channel.activeUsers.push(userId);
    }

    await this.db.set(channelPath, channel);

    // Update server analytics
    await this.updateServerAnalytics(guildId, 'message');
  }

  // Track voice activity
  async trackVoice(userId: string, guildId: string, channelId: string, minutes: number): Promise<void> {
    const today = this.getDateKey();

    // Update member activity
    const memberPath = `analytics.members.${guildId}.${userId}`;
    let member = await this.db.get(memberPath) as MemberActivity;

    if (member) {
      member.voiceMinutes += minutes;
      member.dailyVoice[today] = (member.dailyVoice[today] || 0) + minutes;
      member.lastActive = Date.now();
      member.activityScore = this.calculateActivityScore(member);

      await this.db.set(memberPath, member);
    }

    // Update channel analytics
    const channelPath = `analytics.channels.${guildId}.${channelId}`;
    let channel = await this.db.get(channelPath) as any;

    if (channel) {
      channel.voiceMinutes += minutes;
      
      // Convert to array if it's not already
      if (!Array.isArray(channel.activeUsers)) {
        channel.activeUsers = [];
      }
      
      // Add user if not already in array
      if (!channel.activeUsers.includes(userId)) {
        channel.activeUsers.push(userId);
      }
      
      await this.db.set(channelPath, channel);
    }

    // Update server analytics
    await this.updateServerAnalytics(guildId, 'voice', minutes);
  }

  // Track reactions
  async trackReaction(userId: string, guildId: string, emoji: string): Promise<void> {
    const memberPath = `analytics.members.${guildId}.${userId}`;
    let member = await this.db.get(memberPath) as MemberActivity;

    if (member) {
      member.reactions++;
      member.emojisUsed[emoji] = (member.emojisUsed[emoji] || 0) + 1;
      await this.db.set(memberPath, member);
    }
  }

  // Track member join
  async trackJoin(userId: string, guildId: string): Promise<void> {
    const today = this.getDateKey();
    const serverPath = `analytics.server.${guildId}`;
    let server = await this.db.get(serverPath) as ServerAnalytics;

    if (server) {
      if (!server.dailyStats[today]) {
        server.dailyStats[today] = {
          messages: 0,
          voice: 0,
          activeMembers: 0,
          joins: 0,
          leaves: 0
        };
      }
      server.dailyStats[today].joins++;
      await this.db.set(serverPath, server);
    }
  }

  // Track member leave
  async trackLeave(userId: string, guildId: string): Promise<void> {
    const today = this.getDateKey();
    const memberPath = `analytics.members.${guildId}.${userId}`;
    let member = await this.db.get(memberPath) as MemberActivity;

    if (member) {
      member.leftAt = Date.now();
      await this.db.set(memberPath, member);
    }

    const serverPath = `analytics.server.${guildId}`;
    let server = await this.db.get(serverPath) as ServerAnalytics;

    if (server) {
      if (!server.dailyStats[today]) {
        server.dailyStats[today] = {
          messages: 0,
          voice: 0,
          activeMembers: 0,
          joins: 0,
          leaves: 0
        };
      }
      server.dailyStats[today].leaves++;
      await this.db.set(serverPath, server);
    }
  }

  // Get member analytics
  async getMemberAnalytics(userId: string, guildId: string): Promise<MemberActivity | null> {
    const memberPath = `analytics.members.${guildId}.${userId}`;
    return await this.db.get(memberPath);
  }

  // Get server analytics
  async getServerAnalytics(guildId: string, days: number = 30): Promise<any> {
    const serverPath = `analytics.server.${guildId}`;
    let server = await this.db.get(serverPath) as ServerAnalytics;

    if (!server) {
      return null;
    }

    // Filter to last N days
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const filteredStats: any = {};
    for (const [date, stats] of Object.entries(server.dailyStats)) {
      const statDate = new Date(date);
      if (statDate >= cutoffDate) {
        filteredStats[date] = stats;
      }
    }

    return {
      ...server,
      dailyStats: filteredStats
    };
  }

  // Get top active members
  async getTopMembers(guildId: string, limit: number = 10): Promise<MemberActivity[]> {
    const membersPath = `analytics.members.${guildId}`;
    const members = await this.db.get(membersPath);

    if (!members) return [];

    const memberArray = Object.values(members) as MemberActivity[];
    return memberArray
      .filter(m => !m.leftAt)
      .sort((a, b) => b.activityScore - a.activityScore)
      .slice(0, limit);
  }

  // Get channel rankings
  async getChannelRankings(guildId: string): Promise<ChannelAnalytics[]> {
    const channelsPath = `analytics.channels.${guildId}`;
    const channels = await this.db.get(channelsPath);

    if (!channels) return [];

    const channelArray = Object.values(channels) as ChannelAnalytics[];
    return channelArray.sort((a, b) => b.messages - a.messages);
  }

  // Calculate activity score
  private calculateActivityScore(member: MemberActivity): number {
    const messageScore = member.messages * 1;
    const voiceScore = member.voiceMinutes * 0.5;
    const reactionScore = member.reactions * 0.2;
    
    return Math.floor(messageScore + voiceScore + reactionScore);
  }

  // Calculate engagement score
  private calculateEngagementScore(member: MemberActivity): number {
    const daysSinceJoin = (Date.now() - member.joinedAt) / (1000 * 60 * 60 * 24);
    if (daysSinceJoin < 1) return 0;

    const avgMessagesPerDay = member.messages / daysSinceJoin;
    const avgVoicePerDay = member.voiceMinutes / daysSinceJoin;

    return Math.floor((avgMessagesPerDay * 10) + (avgVoicePerDay * 2));
  }

  // Update server analytics
  private async updateServerAnalytics(guildId: string, type: 'message' | 'voice', value: number = 1): Promise<void> {
    const today = this.getDateKey();
    const serverPath = `analytics.server.${guildId}`;
    let server = await this.db.get(serverPath) as ServerAnalytics;

    if (!server) {
      server = {
        guildId,
        totalMessages: 0,
        totalVoiceMinutes: 0,
        activeMembers: 0,
        dailyStats: {},
        growthRate: 0,
        activityIndex: 0,
        peakHours: []
      };
    }

    if (!server.dailyStats[today]) {
      server.dailyStats[today] = {
        messages: 0,
        voice: 0,
        activeMembers: 0,
        joins: 0,
        leaves: 0
      };
    }

    if (type === 'message') {
      server.totalMessages++;
      server.dailyStats[today].messages++;
    } else if (type === 'voice') {
      server.totalVoiceMinutes += value;
      server.dailyStats[today].voice += value;
    }

    await this.db.set(serverPath, server);
  }

  // Get date key for daily tracking
  private getDateKey(): string {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  // Calculate server health metrics
  async calculateServerHealth(guildId: string): Promise<any> {
    const server = await this.getServerAnalytics(guildId, 30);
    if (!server) return null;

    const last7Days = Object.entries(server.dailyStats).slice(-7);
    const last30Days = Object.entries(server.dailyStats).slice(-30);

    const avgMessages7d = last7Days.reduce((sum, [, stats]: any) => sum + stats.messages, 0) / 7;
    const avgMessages30d = last30Days.reduce((sum, [, stats]: any) => sum + stats.messages, 0) / 30;

    const growthRate = ((avgMessages7d - avgMessages30d) / avgMessages30d) * 100;

    return {
      avgMessages7d: Math.floor(avgMessages7d),
      avgMessages30d: Math.floor(avgMessages30d),
      growthRate: growthRate.toFixed(2),
      totalMessages: server.totalMessages,
      totalVoiceMinutes: server.totalVoiceMinutes,
      activityTrend: growthRate > 0 ? 'increasing' : 'decreasing'
    };
  }
}

export const analytics = AnalyticsTracker.getInstance();
