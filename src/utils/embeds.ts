import { EmbedBuilder, ColorResolvable } from 'discord.js';

export class EmbedFactory {
  private static defaultColor: ColorResolvable = '#5865F2';

  static success(title: string, description?: string): EmbedBuilder {
    const embed = new EmbedBuilder()
      .setColor('#00FF00')
      .setTitle(`✅ ${title}`)
      .setTimestamp();

    if (description) {
      embed.setDescription(description);
    }

    return embed;
  }

  static error(title: string, description?: string): EmbedBuilder {
    const embed = new EmbedBuilder()
      .setColor('#FF0000')
      .setTitle(`❌ ${title}`)
      .setTimestamp();

    if (description) {
      embed.setDescription(description);
    }

    return embed;
  }

  static warning(title: string, description?: string): EmbedBuilder {
    const embed = new EmbedBuilder()
      .setColor('#FFA500')
      .setTitle(`⚠️ ${title}`)
      .setTimestamp();

    if (description) {
      embed.setDescription(description);
    }

    return embed;
  }

  static info(title: string, description?: string): EmbedBuilder {
    const embed = new EmbedBuilder()
      .setColor('#5865F2')
      .setTitle(`ℹ️ ${title}`)
      .setTimestamp();

    if (description) {
      embed.setDescription(description);
    }

    return embed;
  }

  static loading(title: string, description?: string): EmbedBuilder {
    const embed = new EmbedBuilder()
      .setColor('#FFD700')
      .setTitle(`⏳ ${title}`)
      .setTimestamp();

    if (description) {
      embed.setDescription(description);
    }

    return embed;
  }

  static custom(color: ColorResolvable, title: string, description?: string): EmbedBuilder {
    const embed = new EmbedBuilder()
      .setColor(color)
      .setTitle(title)
      .setTimestamp();

    if (description) {
      embed.setDescription(description);
    }

    return embed;
  }

  static economy(title: string, description?: string): EmbedBuilder {
    return this.custom('#FFD700', `💰 ${title}`, description);
  }

  static leveling(title: string, description?: string): EmbedBuilder {
    return this.custom('#9B59B6', `⭐ ${title}`, description);
  }

  static battle(title: string, description?: string): EmbedBuilder {
    return this.custom('#FF4500', `⚔️ ${title}`, description);
  }

  static moderation(title: string, description?: string): EmbedBuilder {
    return this.custom('#FFA500', `🛠️ ${title}`, description);
  }
}
