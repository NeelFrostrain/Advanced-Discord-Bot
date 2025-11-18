import { EmbedBuilder } from 'discord.js';
export class EmbedFactory {
    static defaultColor = '#5865F2';
    static success(title, description) {
        const embed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle(`✅ ${title}`)
            .setTimestamp();
        if (description) {
            embed.setDescription(description);
        }
        return embed;
    }
    static error(title, description) {
        const embed = new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle(`❌ ${title}`)
            .setTimestamp();
        if (description) {
            embed.setDescription(description);
        }
        return embed;
    }
    static warning(title, description) {
        const embed = new EmbedBuilder()
            .setColor('#FFA500')
            .setTitle(`⚠️ ${title}`)
            .setTimestamp();
        if (description) {
            embed.setDescription(description);
        }
        return embed;
    }
    static info(title, description) {
        const embed = new EmbedBuilder()
            .setColor('#5865F2')
            .setTitle(`ℹ️ ${title}`)
            .setTimestamp();
        if (description) {
            embed.setDescription(description);
        }
        return embed;
    }
    static loading(title, description) {
        const embed = new EmbedBuilder()
            .setColor('#FFD700')
            .setTitle(`⏳ ${title}`)
            .setTimestamp();
        if (description) {
            embed.setDescription(description);
        }
        return embed;
    }
    static custom(color, title, description) {
        const embed = new EmbedBuilder()
            .setColor(color)
            .setTitle(title)
            .setTimestamp();
        if (description) {
            embed.setDescription(description);
        }
        return embed;
    }
    static economy(title, description) {
        return this.custom('#FFD700', `💰 ${title}`, description);
    }
    static leveling(title, description) {
        return this.custom('#9B59B6', `⭐ ${title}`, description);
    }
    static battle(title, description) {
        return this.custom('#FF4500', `⚔️ ${title}`, description);
    }
    static moderation(title, description) {
        return this.custom('#FFA500', `🛠️ ${title}`, description);
    }
}
