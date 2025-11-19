export interface UserEconomy {
  id: string;
  guildId: string;
  balance: number;
  bank: number;
  inventory: any[];
  bio: string;
  achievements: string[];
  createdAt: number;
}

export interface UserLevel {
  id: string;
  guildId: string;
  xp: number;
  level: number;
  totalXP: number;
  messages: number;
  lastXPGain?: number;
  rank?: number;
  rankCard?: RankCard;
}

export interface RankCard {
  backgroundColor?: string;
  progressBarColor?: string;
  textColor?: string;
  accentColor?: string;
  customBadge?: string;
}

export interface RankRole {
  level: number;
  roleId: string;
  roleName: string;
}

export interface GuildRankConfig {
  guildId: string;
  xpPerMessage: number;
  xpCooldown: number;
  levelUpChannel?: string;
  rankRoles: RankRole[];
  enabledChannels?: string[];
  disabledChannels?: string[];
  multipliers?: {
    [roleId: string]: number;
  };
}

export interface Monster {
  id: string;
  name: string;
  hp: number;
  damage: number;
  xp: number;
  coins: [number, number];
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
}

export interface Pet {
  id: string;
  name: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  damage: number;
  hp: number;
}

export interface ShopItem {
  id: string;
  name: string;
  price: number;
  type: string;
  [key: string]: any;
}

// Analytics Types
export interface MemberActivity {
  userId: string;
  guildId: string;
  messages: number;
  voiceMinutes: number;
  reactions: number;
  emojisUsed: { [emoji: string]: number };
  dailyMessages: { [date: string]: number };
  dailyVoice: { [date: string]: number };
  lastActive: number;
  joinedAt: number;
  leftAt?: number;
  activityScore: number;
  engagementScore: number;
  streak: number;
}

export interface ChannelAnalytics {
  channelId: string;
  guildId: string;
  name: string;
  type: 'text' | 'voice';
  messages: number;
  voiceMinutes: number;
  activeUsers: Set<string>;
  hourlyActivity: { [hour: string]: number };
  dailyActivity: { [date: string]: number };
}

export interface ServerAnalytics {
  guildId: string;
  totalMessages: number;
  totalVoiceMinutes: number;
  activeMembers: number;
  dailyStats: {
    [date: string]: {
      messages: number;
      voice: number;
      activeMembers: number;
      joins: number;
      leaves: number;
    };
  };
  growthRate: number;
  activityIndex: number;
  peakHours: number[];
}

// Invite Tracker Types
export interface InviteData {
  code: string;
  guildId: string;
  inviterId: string;
  inviterTag: string;
  uses: number;
  maxUses: number;
  maxAge: number;
  temporary: boolean;
  createdAt: number;
  expiresAt?: number;
  isVanity: boolean;
  channel?: string;
}

export interface InviteUse {
  guildId: string;
  userId: string;
  userTag: string;
  inviteCode: string;
  inviterId: string;
  inviterTag: string;
  joinedAt: number;
  accountAge: number;
  isReal: boolean;
  isFake: boolean;
  leftAt?: number;
  joinMethod: 'normal' | 'vanity' | 'oauth' | 'unknown';
}

export interface InviterStats {
  userId: string;
  guildId: string;
  totalInvites: number;
  realInvites: number;
  fakeInvites: number;
  leftInvites: number;
  bonusInvites: number;
  rank: number;
}

export interface GuildInviteConfig {
  guildId: string;
  trackingEnabled: boolean;
  logChannelId?: string;
  minAccountAge: number; // days
  autoKickFakes: boolean;
  autoKickAlts: boolean;
  suspiciousJoinThreshold: number;
}

// Anti-Alt Types
export interface AltDetection {
  userId: string;
  guildId: string;
  accountAge: number;
  isSuspicious: boolean;
  suspicionReasons: string[];
  joinedAt: number;
  ipHash?: string;
  similarAccounts: string[];
  qualityScore: number;
}

export interface JoinQualityMetrics {
  userId: string;
  guildId: string;
  accountAge: number;
  messagesSent: number;
  voiceMinutes: number;
  engagementScore: number;
  leftServer: boolean;
  daysInServer: number;
  qualityScore: number;
}

// TempVoice System
export interface TempVoiceChannel {
  channelId: string;
  ownerId: string;
  guildId: string;
  createdAt: number;
  settings: {
    name?: string;
    limit?: number;
    locked?: boolean;
    hidden?: boolean;
    bitrate?: number;
  };
  permissions: {
    permitted: string[];
    rejected: string[];
  };
}

export interface TempVoiceConfig {
  guildId: string;
  enabled: boolean;
  joinToCreateChannels: string[];
  category: string;
  template: string;
  defaultSettings: {
    bitrate: number;
    userLimit: number;
    autoDeleteTimeout: number;
    visibility: 'public' | 'hidden';
  };
  logChannel?: string;
}

export interface TempVoiceTemplate {
  id: string;
  name: string;
  format: string;
  defaultBitrate: number;
  defaultLimit: number;
  category: string;
}
