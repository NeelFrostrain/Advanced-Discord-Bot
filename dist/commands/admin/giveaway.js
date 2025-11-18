import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { EmbedFactory } from '../../utils/embeds.js';
import ms from 'ms';
export default {
    data: new SlashCommandBuilder()
        .setName('giveaway')
        .setDescription('Start a giveaway')
        .addStringOption(option => option.setName('duration')
        .setDescription('Duration (e.g., 1h, 1d, 1w)')
        .setRequired(true))
        .addStringOption(option => option.setName('prize')
        .setDescription('Prize for the giveaway')
        .setRequired(true))
        .addIntegerOption(option => option.setName('winners')
        .setDescription('Number of winners')
        .setMinValue(1)
        .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction, client) {
        const duration = interaction.options.getString('duration', true);
        const prize = interaction.options.getString('prize', true);
        const winnerCount = interaction.options.getInteger('winners') || 1;
        const time = ms(duration);
        if (!time || time > 2592000000) {
            const embed = EmbedFactory.error('Invalid Duration', 'Max duration is 30 days.');
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
        const endTime = Date.now() + time;
        const embed = EmbedFactory.custom('#FFD700', '🎉 GIVEAWAY 🎉')
            .setDescription(`**Prize:** ${prize}\n**Winners:** ${winnerCount}\n**Ends:** <t:${Math.floor(endTime / 1000)}:R>`)
            .setFooter({ text: 'React with 🎉 to enter!' });
        const message = await interaction.channel?.send({ embeds: [embed] });
        if (message)
            await message.react('🎉');
        const successEmbed = EmbedFactory.success('Giveaway Started!', 'Users can now enter by reacting.');
        await interaction.reply({ embeds: [successEmbed], ephemeral: true });
        setTimeout(async () => {
            try {
                const fetchedMessage = await interaction.channel?.messages.fetch(message.id);
                const reaction = fetchedMessage?.reactions.cache.get('🎉');
                if (!reaction) {
                    return interaction.channel?.send('❌ No one entered the giveaway!');
                }
                const users = await reaction.users.fetch();
                const entries = users.filter((u) => !u.bot);
                if (entries.size === 0) {
                    return interaction.channel?.send('❌ No valid entries for the giveaway!');
                }
                const winners = [];
                const entriesArray = Array.from(entries.values());
                for (let i = 0; i < Math.min(winnerCount, entriesArray.length); i++) {
                    const winner = entriesArray[Math.floor(Math.random() * entriesArray.length)];
                    if (!winners.includes(winner)) {
                        winners.push(winner);
                    }
                }
                const winnerEmbed = EmbedFactory.success('🎉 Giveaway Ended! 🎉')
                    .setDescription(`**Prize:** ${prize}\n\n**Winner(s):** ${winners.map(w => `<@${w.id}>`).join(', ')}`);
                await interaction.channel?.send({ embeds: [winnerEmbed] });
            }
            catch (error) {
                console.error('Giveaway error:', error);
            }
        }, time);
    }
};
