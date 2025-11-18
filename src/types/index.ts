import { Client, Collection, SlashCommandBuilder } from 'discord.js';

export interface BotConfig {
  bot: {
    name: string;
    version: string;
    description: string;
    color: string;
  };
  economy: {
    startingBalance: number;
    dailyAmount: number;
    weeklyAmount: number;
    workMin: number;
    workMax: number;
    workCooldown: number;
    dailyCooldown: number;
    weeklyCooldown: number;
  };
  leveling: {
    enabled: boolean;
    xpPerMessage: [number, number];
    xpCooldown: number;
    levelUpMessage: boolean;
    levelFormula: string;
  };
  battle: {
    huntCooldown: number;
    pvpCooldown: number;
    critChance: number;
    critMultiplier: number;
  };
  moderation: {
    logChannel: string | null;
    autoMod: {
      enabled: boolean;
      antiSpam: boolean;
      antiRaid: boolean;
      badWords: string[];
    };
  };
  features: {
    tickets: boolean;
    giveaways: boolean;
    reactionRoles: boolean;
    welcome: boolean;
    autoRole: boolean;
    starboard: boolean;
  };
}

export interface Command {
  data: SlashCommandBuilder | any;
  cooldown?: number;
  execute: (interaction: any, client: ExtendedClient) => Promise<void>;
}

export interface ExtendedClient extends Client {
  commands: Collection<string, Command>;
  cooldowns: Collection<string, Collection<string, number>>;
  config: BotConfig;
}

export interface DatabaseAdapter {
  get(path: string): Promise<any>;
  set(path: string, value: any): Promise<void>;
  push?(path: string, value: any): Promise<void>;
  delete(path: string): Promise<void>;
  has(path: string): Promise<boolean>;
  all?(): Promise<any>;
}

export * from './database.js';
