import { VoiceChannel, ChannelType, PermissionFlagsBits, Guild, GuildMember, CategoryChannel } from 'discord.js';
import { getDatabase } from '../database/index.js';
import { TempVoiceChannel, TempVoiceConfig } from '../types/database.js';

export class TempVoiceManager {
  private static instance: TempVoiceManager;
  private db = getDatabase();
  private activeChannels = new Map<string, TempVoiceChannel>();
  private deleteTimers = new Map<string, NodeJS.Timeout>();

  static getInstance(): TempVoiceManager {
    if (!this.instance) {
      this.instance = new TempVoiceManager();
    }
    return this.instance;
  }

  async initialize() {
    // Load active channels from database
    const channels = await this.db.get('tempvoice.channels');
    if (channels) {
      for (const [channelId, data] of Object.entries(channels)) {
        this.activeChannels.set(channelId, data as TempVoiceChannel);
      }
    }
  }

  // Get guild configuration
  async getConfig(guildId: string): Promise<TempVoiceConfig | null> {
    return await this.db.get(`tempvoice.config.${guildId}`);
  }

  // Save guild configuration
  async saveConfig(config: TempVoiceConfig): Promise<void> {
    await this.db.set(`tempvoice.config.${config.guildId}`, config);
  }

  // Check if channel is a join-to-create channel
  async isJoinToCreateChannel(channelId: string, guildId: string): Promise<boolean> {
    const config = await this.getConfig(guildId);
    return config?.enabled && config.joinToCreateChannels.includes(channelId) || false;
  }

  // Create temporary voice channel
  async createTempChannel(member: GuildMember, guild: Guild): Promise<VoiceChannel | null> {
    try {
      const config = await this.getConfig(guild.id);
      if (!config || !config.enabled) return null;

      // Get category
      const category = guild.channels.cache.get(config.category) as CategoryChannel;
      if (!category) return null;

      // Format channel name
      const channelName = this.formatChannelName(config.template, member);

      // Create channel
      const channel = await guild.channels.create({
        name: channelName,
        type: ChannelType.GuildVoice,
        parent: category.id,
        bitrate: config.defaultSettings.bitrate,
        userLimit: config.defaultSettings.userLimit,
        permissionOverwrites: [
          {
            id: guild.id,
            allow: config.defaultSettings.visibility === 'public' 
              ? [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.Connect]
              : [],
            deny: config.defaultSettings.visibility === 'hidden'
              ? [PermissionFlagsBits.ViewChannel]
              : []
          },
          {
            id: member.id,
            allow: [
              PermissionFlagsBits.ViewChannel,
              PermissionFlagsBits.Connect,
              PermissionFlagsBits.ManageChannels,
              PermissionFlagsBits.MoveMembers,
              PermissionFlagsBits.MuteMembers,
              PermissionFlagsBits.DeafenMembers
            ]
          }
        ]
      });

      // Store channel data
      const tempChannel: TempVoiceChannel = {
        channelId: channel.id,
        ownerId: member.id,
        guildId: guild.id,
        createdAt: Date.now(),
        settings: {
          name: channelName,
          limit: config.defaultSettings.userLimit,
          locked: false,
          hidden: config.defaultSettings.visibility === 'hidden',
          bitrate: config.defaultSettings.bitrate
        },
        permissions: {
          permitted: [],
          rejected: []
        }
      };

      this.activeChannels.set(channel.id, tempChannel);
      await this.db.set(`tempvoice.channels.${channel.id}`, tempChannel);

      // Move user to channel
      await member.voice.setChannel(channel);

      // Log creation
      if (config.logChannel) {
        await this.logAction(guild, config.logChannel, 'created', member, channel);
      }

      return channel;
    } catch (error) {
      console.error('Error creating temp voice channel:', error);
      return null;
    }
  }

  // Delete temporary voice channel
  async deleteTempChannel(channelId: string, guild: Guild): Promise<void> {
    try {
      const tempChannel = this.activeChannels.get(channelId);
      if (!tempChannel) return;

      const channel = guild.channels.cache.get(channelId);
      if (channel) {
        await channel.delete('Temporary voice channel cleanup');
      }

      // Remove from storage
      this.activeChannels.delete(channelId);
      await this.db.delete(`tempvoice.channels.${channelId}`);

      // Clear delete timer
      const timer = this.deleteTimers.get(channelId);
      if (timer) {
        clearTimeout(timer);
        this.deleteTimers.delete(channelId);
      }

      // Log deletion
      const config = await this.getConfig(guild.id);
      if (config?.logChannel) {
        await this.logAction(guild, config.logChannel, 'deleted', null, channel);
      }
    } catch (error) {
      console.error('Error deleting temp voice channel:', error);
    }
  }

  // Handle voice state update
  async handleVoiceStateUpdate(oldState: any, newState: any): Promise<void> {
    const guild = newState.guild;
    const member = newState.member;

    // User joined a channel
    if (!oldState.channelId && newState.channelId) {
      // Check if it's a join-to-create channel
      if (await this.isJoinToCreateChannel(newState.channelId, guild.id)) {
        await this.createTempChannel(member, guild);
      }
    }

    // User left a channel
    if (oldState.channelId && !newState.channelId) {
      await this.checkAndCleanupChannel(oldState.channelId, guild);
    }

    // User switched channels
    if (oldState.channelId && newState.channelId && oldState.channelId !== newState.channelId) {
      await this.checkAndCleanupChannel(oldState.channelId, guild);
      
      // Check if joined join-to-create
      if (await this.isJoinToCreateChannel(newState.channelId, guild.id)) {
        await this.createTempChannel(member, guild);
      }
    }
  }

  // Check if channel should be deleted
  async checkAndCleanupChannel(channelId: string, guild: Guild): Promise<void> {
    const tempChannel = this.activeChannels.get(channelId);
    if (!tempChannel) return;

    const channel = guild.channels.cache.get(channelId) as VoiceChannel;
    if (!channel) {
      await this.deleteTempChannel(channelId, guild);
      return;
    }

    // Check if empty
    if (channel.members.size === 0) {
      const config = await this.getConfig(guild.id);
      const timeout = config?.defaultSettings.autoDeleteTimeout || 0;

      if (timeout > 0) {
        // Set delete timer
        const timer = setTimeout(() => {
          this.deleteTempChannel(channelId, guild);
        }, timeout);
        this.deleteTimers.set(channelId, timer);
      } else {
        // Delete immediately
        await this.deleteTempChannel(channelId, guild);
      }
    }
  }

  // Get channel owner
  getChannelOwner(channelId: string): string | null {
    return this.activeChannels.get(channelId)?.ownerId || null;
  }

  // Check if user is channel owner
  isChannelOwner(channelId: string, userId: string): boolean {
    return this.activeChannels.get(channelId)?.ownerId === userId;
  }

  // Transfer ownership
  async transferOwnership(channelId: string, newOwnerId: string, guild: Guild): Promise<boolean> {
    try {
      const tempChannel = this.activeChannels.get(channelId);
      if (!tempChannel) return false;

      const channel = guild.channels.cache.get(channelId) as VoiceChannel;
      if (!channel) return false;

      const oldOwnerId = tempChannel.ownerId;
      tempChannel.ownerId = newOwnerId;

      // Update permissions
      await channel.permissionOverwrites.edit(oldOwnerId, {
        ManageChannels: false,
        MoveMembers: false
      });

      await channel.permissionOverwrites.edit(newOwnerId, {
        ViewChannel: true,
        Connect: true,
        ManageChannels: true,
        MoveMembers: true,
        MuteMembers: true,
        DeafenMembers: true
      });

      // Save changes
      this.activeChannels.set(channelId, tempChannel);
      await this.db.set(`tempvoice.channels.${channelId}`, tempChannel);

      // Log transfer
      const config = await this.getConfig(guild.id);
      if (config?.logChannel) {
        await this.logAction(guild, config.logChannel, 'transferred', null, channel, `<@${oldOwnerId}> → <@${newOwnerId}>`);
      }

      return true;
    } catch (error) {
      console.error('Error transferring ownership:', error);
      return false;
    }
  }

  // Rename channel
  async renameChannel(channelId: string, newName: string, guild: Guild): Promise<boolean> {
    try {
      const tempChannel = this.activeChannels.get(channelId);
      if (!tempChannel) return false;

      const channel = guild.channels.cache.get(channelId) as VoiceChannel;
      if (!channel) return false;

      await channel.setName(newName);
      tempChannel.settings.name = newName;

      this.activeChannels.set(channelId, tempChannel);
      await this.db.set(`tempvoice.channels.${channelId}`, tempChannel);

      return true;
    } catch (error) {
      console.error('Error renaming channel:', error);
      return false;
    }
  }

  // Set user limit
  async setUserLimit(channelId: string, limit: number, guild: Guild): Promise<boolean> {
    try {
      const tempChannel = this.activeChannels.get(channelId);
      if (!tempChannel) return false;

      const channel = guild.channels.cache.get(channelId) as VoiceChannel;
      if (!channel) return false;

      await channel.setUserLimit(limit);
      tempChannel.settings.limit = limit;

      this.activeChannels.set(channelId, tempChannel);
      await this.db.set(`tempvoice.channels.${channelId}`, tempChannel);

      return true;
    } catch (error) {
      console.error('Error setting user limit:', error);
      return false;
    }
  }

  // Lock/Unlock channel
  async setLocked(channelId: string, locked: boolean, guild: Guild): Promise<boolean> {
    try {
      const tempChannel = this.activeChannels.get(channelId);
      if (!tempChannel) return false;

      const channel = guild.channels.cache.get(channelId) as VoiceChannel;
      if (!channel) return false;

      await channel.permissionOverwrites.edit(guild.id, {
        Connect: !locked
      });

      tempChannel.settings.locked = locked;
      this.activeChannels.set(channelId, tempChannel);
      await this.db.set(`tempvoice.channels.${channelId}`, tempChannel);

      return true;
    } catch (error) {
      console.error('Error locking/unlocking channel:', error);
      return false;
    }
  }

  // Hide/Show channel
  async setHidden(channelId: string, hidden: boolean, guild: Guild): Promise<boolean> {
    try {
      const tempChannel = this.activeChannels.get(channelId);
      if (!tempChannel) return false;

      const channel = guild.channels.cache.get(channelId) as VoiceChannel;
      if (!channel) return false;

      await channel.permissionOverwrites.edit(guild.id, {
        ViewChannel: !hidden
      });

      tempChannel.settings.hidden = hidden;
      this.activeChannels.set(channelId, tempChannel);
      await this.db.set(`tempvoice.channels.${channelId}`, tempChannel);

      return true;
    } catch (error) {
      console.error('Error hiding/showing channel:', error);
      return false;
    }
  }

  // Permit user
  async permitUser(channelId: string, userId: string, guild: Guild): Promise<boolean> {
    try {
      const tempChannel = this.activeChannels.get(channelId);
      if (!tempChannel) return false;

      const channel = guild.channels.cache.get(channelId) as VoiceChannel;
      if (!channel) return false;

      await channel.permissionOverwrites.edit(userId, {
        ViewChannel: true,
        Connect: true
      });

      if (!tempChannel.permissions.permitted.includes(userId)) {
        tempChannel.permissions.permitted.push(userId);
      }

      // Remove from rejected if present
      tempChannel.permissions.rejected = tempChannel.permissions.rejected.filter(id => id !== userId);

      this.activeChannels.set(channelId, tempChannel);
      await this.db.set(`tempvoice.channels.${channelId}`, tempChannel);

      return true;
    } catch (error) {
      console.error('Error permitting user:', error);
      return false;
    }
  }

  // Reject user
  async rejectUser(channelId: string, userId: string, guild: Guild): Promise<boolean> {
    try {
      const tempChannel = this.activeChannels.get(channelId);
      if (!tempChannel) return false;

      const channel = guild.channels.cache.get(channelId) as VoiceChannel;
      if (!channel) return false;

      await channel.permissionOverwrites.edit(userId, {
        ViewChannel: false,
        Connect: false
      });

      if (!tempChannel.permissions.rejected.includes(userId)) {
        tempChannel.permissions.rejected.push(userId);
      }

      // Remove from permitted if present
      tempChannel.permissions.permitted = tempChannel.permissions.permitted.filter(id => id !== userId);

      // Kick user if in channel
      const member = channel.members.get(userId);
      if (member) {
        await member.voice.disconnect();
      }

      this.activeChannels.set(channelId, tempChannel);
      await this.db.set(`tempvoice.channels.${channelId}`, tempChannel);

      return true;
    } catch (error) {
      console.error('Error rejecting user:', error);
      return false;
    }
  }

  // Format channel name
  private formatChannelName(template: string, member: GuildMember): string {
    return template
      .replace('{user}', member.user.username)
      .replace('{username}', member.user.username)
      .replace('{tag}', member.user.tag)
      .replace('{number}', Math.floor(Math.random() * 1000).toString());
  }

  // Log action
  private async logAction(guild: Guild, logChannelId: string, action: string, member: GuildMember | null, channel: any, extra?: string): Promise<void> {
    try {
      const logChannel = guild.channels.cache.get(logChannelId);
      if (!logChannel || !logChannel.isTextBased()) return;

      const { EmbedFactory } = await import('./embeds.js');
      
      let description = '';
      switch (action) {
        case 'created':
          description = `${member} created temporary voice channel ${channel}`;
          break;
        case 'deleted':
          description = `Temporary voice channel deleted`;
          break;
        case 'transferred':
          description = `Channel ownership transferred: ${extra}`;
          break;
        default:
          description = `TempVoice action: ${action}`;
      }

      const embed = EmbedFactory.info('🎙️ TempVoice', description)
        .setTimestamp();

      await logChannel.send({ embeds: [embed] });
    } catch (error) {
      console.error('Error logging tempvoice action:', error);
    }
  }
}

export const tempVoiceManager = TempVoiceManager.getInstance();
