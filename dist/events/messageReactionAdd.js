import { analytics } from '../utils/analytics.js';
export default {
    name: 'messageReactionAdd',
    async execute(reaction, user, client) {
        if (user.bot)
            return;
        if (!reaction.message.guild)
            return;
        try {
            // Fetch partial data if needed
            if (reaction.partial) {
                await reaction.fetch();
            }
            if (user.partial) {
                await user.fetch();
            }
            // Track reaction in analytics
            const emoji = reaction.emoji.name || reaction.emoji.id || 'unknown';
            await analytics.trackReaction(user.id, reaction.message.guild.id, emoji);
        }
        catch (error) {
            console.error('Error tracking reaction:', error);
        }
    }
};
