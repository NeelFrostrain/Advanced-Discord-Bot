import { Guild, GuildMember, Invite, Collection } from 'discord.js';
import { getDatabase } from '../database/index.js';
import { InviteData, InviteUse, InviterStats, GuildInviteConfig, AltDetection } from '../types/database.js';

export class InviteTracker {
  private static instance: InviteTracker;
  private db = getDatabase();
  private inviteCache: Map<string, Collection<string, Invite>> = new Map();

  static getInstance(): InviteTracker {
    if (!this.instance) {
      this.instance = new InviteTracker();
    }
    return this.instance;
  }

  // Initialize invite tracking for a guild
  async initGuild(guild: Guild): Promise<void> {
    try {
      const invites = await guild.invites.fetch();
      this.inviteCache.set(guild.id, invites);

      // Store invites in database
      for (const [code, invite] of invites) {
        await this.saveInvite(invite);
      }
    } catch (error) {
      console.error(`Failed to init invites for ${guild.name}:`, error);
    }
  }

  // Save invite to database
  private async saveInvite(invite: Invite): Promise<void> {
    if (!invite.guild) return;

    const inviteData: InviteData = {
      code: invite.code,
      guildId: invite.guild.id,
      inviterId: invite.inviter?.id || 'unknown',
      inviterTag: invite.inviter?.tag || 'Unknown',
      uses: invite.uses || 0,
      maxUses: invite.maxUses || 0,
      maxAge: invite.maxAge || 0,
      temporary: invite.temporary || false,
      createdAt: invite.createdTimestamp || Date.now(),
      expiresAt: invite.expiresTimestamp || undefined,
      isVanity: invite.code === invite.guild.vanityURLCode,
      channel: invite.channel?.id
    };

    const path = `invites.${invite.guild.id}.${invite.code}`;
    await this.db.set(path, inviteData);
  }

  // Track member join and find which invite was used
  async trackJoin(member: GuildMember): Promise<InviteUse | null> {
    try {
      const guild = member.guild;
      const newInvites = await guild.invites.fetch();
      const oldInvites = this.inviteCache.get(guild.id);

      if (!oldInvites) {
        this.inviteCache.set(guild.id, newInvites);
        return null;
      }

      // Find the invite that was used
      let usedInvite: Invite | null = null;
      for (const [code, newInvite] of newInvites) {
        const oldInvite = oldInvites.get(code);
        if (oldInvite && newInvite.uses! > oldInvite.uses!) {
          usedInvite = newInvite;
          break;
        }
      }

      // Check for vanity URL
      if (!usedInvite && guild.vanityURLCode) {
        const vanityInvite = newInvites.find(inv => inv.code === guild.vanityURLCode);
        if (vanityInvite) {
          usedInvite = vanityInvite;
        }
      }

      // Update cache
      this.inviteCache.set(guild.id, newInvites);

      if (!usedInvite) {
        // Unknown join method (OAuth, widget, etc.)
        return await this.createInviteUse(member, null, 'unknown');
      }

      // Save the invite use
      await this.saveInvite(usedInvite);
      return await this.createInviteUse(member, usedInvite, 'normal');

    } catch (error) {
      console.error('Error tracking join:', error);
      return null;
    }
  }

  // Create invite use record
  private async createInviteUse(
    member: GuildMember,
    invite: Invite | null,
    joinMethod: 'normal' | 'vanity' | 'oauth' | 'unknown'
  ): Promise<InviteUse> {
    const accountAge = Date.now() - member.user.createdTimestamp;
    const accountAgeDays = accountAge / (1000 * 60 * 60 * 24);

    // Detect if account is suspicious
    const config = await this.getGuildConfig(member.guild.id);
    const isSuspicious = accountAgeDays < config.minAccountAge;
    const isFake = isSuspicious && accountAgeDays < 7;

    const inviteUse: InviteUse = {
      guildId: member.guild.id,
      userId: member.id,
      userTag: member.user.tag,
      inviteCode: invite?.code || 'unknown',
      inviterId: invite?.inviter?.id || 'unknown',
      inviterTag: invite?.inviter?.tag || 'Unknown',
      joinedAt: Date.now(),
      accountAge: accountAgeDays,
      isReal: !isFake,
      isFake: isFake,
      joinMethod: invite?.code === member.guild.vanityURLCode ? 'vanity' : joinMethod
    };

    // Save invite use
    const path = `inviteUses.${member.guild.id}.${member.id}`;
    await this.db.set(path, inviteUse);

    // Update inviter stats
    if (invite?.inviter) {
      await this.updateInviterStats(invite.inviter.id, member.guild.id, isFake);
    }

    // Perform alt detection
    await this.detectAlt(member, accountAgeDays);

    return inviteUse;
  }

  // Update inviter statistics
  private async updateInviterStats(inviterId: string, guildId: string, isFake: boolean): Promise<void> {
    const path = `inviterStats.${guildId}.${inviterId}`;
    let stats = await this.db.get(path) as InviterStats;

    if (!stats) {
      stats = {
        userId: inviterId,
        guildId: guildId,
        totalInvites: 0,
        realInvites: 0,
        fakeInvites: 0,
        leftInvites: 0,
        bonusInvites: 0,
        rank: 0
      };
    }

    stats.totalInvites++;
    if (isFake) {
      stats.fakeInvites++;
    } else {
      stats.realInvites++;
    }

    await this.db.set(path, stats);
  }

  // Track member leave
  async trackLeave(member: GuildMember): Promise<void> {
    const usePath = `inviteUses.${member.guild.id}.${member.id}`;
    const inviteUse = await this.db.get(usePath) as InviteUse;

    if (inviteUse) {
      inviteUse.leftAt = Date.now();
      await this.db.set(usePath, inviteUse);

      // Update inviter stats
      if (inviteUse.inviterId !== 'unknown') {
        const statsPath = `inviterStats.${member.guild.id}.${inviteUse.inviterId}`;
        let stats = await this.db.get(statsPath) as InviterStats;

        if (stats) {
          stats.leftInvites++;
          if (!inviteUse.isFake) {
            stats.realInvites--;
          }
          await this.db.set(statsPath, stats);
        }
      }
    }
  }

  // Get inviter leaderboard
  async getLeaderboard(guildId: string, limit: number = 10): Promise<InviterStats[]> {
    const statsPath = `inviterStats.${guildId}`;
    const allStats = await this.db.get(statsPath);

    if (!allStats) return [];

    const statsArray = Object.values(allStats) as InviterStats[];
    return statsArray
      .sort((a, b) => b.realInvites - a.realInvites)
      .slice(0, limit)
      .map((stat, index) => ({ ...stat, rank: index + 1 }));
  }

  // Get invite uses for a user
  async getUserInvites(userId: string, guildId: string): Promise<InviterStats | null> {
    const path = `inviterStats.${guildId}.${userId}`;
    return await this.db.get(path);
  }

  // Get guild invite config
  async getGuildConfig(guildId: string): Promise<GuildInviteConfig> {
    const path = `inviteConfig.${guildId}`;
    let config = await this.db.get(path) as GuildInviteConfig;

    if (!config) {
      config = {
        guildId,
        trackingEnabled: true,
        minAccountAge: 7,
        autoKickFakes: false,
        autoKickAlts: false,
        suspiciousJoinThreshold: 5
      };
      await this.db.set(path, config);
    }

    return config;
  }

  // Update guild config
  async updateGuildConfig(guildId: string, updates: Partial<GuildInviteConfig>): Promise<void> {
    const config = await this.getGuildConfig(guildId);
    const updated = { ...config, ...updates };
    const path = `inviteConfig.${guildId}`;
    await this.db.set(path, updated);
  }

  // Alt detection
  private async detectAlt(member: GuildMember, accountAgeDays: number): Promise<AltDetection> {
    const suspicionReasons: string[] = [];
    let isSuspicious = false;

    // Check account age
    if (accountAgeDays < 7) {
      suspicionReasons.push('Account less than 7 days old');
      isSuspicious = true;
    }

    if (accountAgeDays < 1) {
      suspicionReasons.push('Account less than 1 day old');
      isSuspicious = true;
    }

    // Check default avatar
    if (!member.user.avatar) {
      suspicionReasons.push('Using default avatar');
      isSuspicious = true;
    }

    // Check username patterns
    if (/^[a-z]+[0-9]{4,}$/.test(member.user.username)) {
      suspicionReasons.push('Suspicious username pattern');
      isSuspicious = true;
    }

    // Calculate quality score
    let qualityScore = 100;
    qualityScore -= Math.max(0, (7 - accountAgeDays) * 10);
    if (!member.user.avatar) qualityScore -= 20;
    if (suspicionReasons.length > 2) qualityScore -= 30;

    const altDetection: AltDetection = {
      userId: member.id,
      guildId: member.guild.id,
      accountAge: accountAgeDays,
      isSuspicious,
      suspicionReasons,
      joinedAt: Date.now(),
      similarAccounts: [],
      qualityScore: Math.max(0, qualityScore)
    };

    // Save alt detection
    const path = `altDetection.${member.guild.id}.${member.id}`;
    await this.db.set(path, altDetection);

    return altDetection;
  }

  // Get alt detection data
  async getAltDetection(userId: string, guildId: string): Promise<AltDetection | null> {
    const path = `altDetection.${guildId}.${userId}`;
    return await this.db.get(path);
  }

  // Get all suspicious joins
  async getSuspiciousJoins(guildId: string, days: number = 7): Promise<AltDetection[]> {
    const path = `altDetection.${guildId}`;
    const allDetections = await this.db.get(path);

    if (!allDetections) return [];

    const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
    const detections = Object.values(allDetections) as AltDetection[];

    return detections
      .filter(d => d.isSuspicious && d.joinedAt > cutoff)
      .sort((a, b) => b.joinedAt - a.joinedAt);
  }
}

export const inviteTracker = InviteTracker.getInstance();
