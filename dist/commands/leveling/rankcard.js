import { SlashCommandBuilder } from 'discord.js';
import { EmbedFactory } from '../../utils/embeds.js';
import { getUserLevel, updateUserLevel } from '../../database/index.js';
export default {
    data: new SlashCommandBuilder()
        .setName('rankcard')
        .setDescription('Customize your rank card appearance')
        .addStringOption(option => option.setName('background')
        .setDescription('Background color (hex code, e.g., #2b2d31)')
        .setRequired(false))
        .addStringOption(option => option.setName('progressbar')
        .setDescription('Progress bar color (hex code)')
        .setRequired(false))
        .addStringOption(option => option.setName('text')
        .setDescription('Text color (hex code)')
        .setRequired(false))
        .addStringOption(option => option.setName('accent')
        .setDescription('Accent color (hex code)')
        .setRequired(false)),
    async execute(interaction, client) {
        const background = interaction.options.getString('background');
        const progressbar = interaction.options.getString('progressbar');
        const text = interaction.options.getString('text');
        const accent = interaction.options.getString('accent');
        if (!background && !progressbar && !text && !accent) {
            const levelData = await getUserLevel(interaction.user.id, interaction.guildId);
            const card = levelData.rankCard || {};
            const embed = EmbedFactory.leveling('Your Rank Card Settings')
                .addFields({ name: '🎨 Background', value: card.backgroundColor || '#2b2d31', inline: true }, { name: '📊 Progress Bar', value: card.progressBarColor || '#5865f2', inline: true }, { name: '📝 Text', value: card.textColor || '#ffffff', inline: true }, { name: '✨ Accent', value: card.accentColor || '#5865f2', inline: true })
                .setDescription('Use `/rankcard` with options to customize your card!');
            return interaction.reply({ embeds: [embed] });
        }
        const hexRegex = /^#[0-9A-F]{6}$/i;
        const updates = {};
        if (background) {
            if (!hexRegex.test(background)) {
                return interaction.reply({
                    embeds: [EmbedFactory.error('Invalid Color', 'Background must be a valid hex code (e.g., #2b2d31)')],
                    ephemeral: true
                });
            }
            updates['rankCard.backgroundColor'] = background;
        }
        if (progressbar) {
            if (!hexRegex.test(progressbar)) {
                return interaction.reply({
                    embeds: [EmbedFactory.error('Invalid Color', 'Progress bar must be a valid hex code')],
                    ephemeral: true
                });
            }
            updates['rankCard.progressBarColor'] = progressbar;
        }
        if (text) {
            if (!hexRegex.test(text)) {
                return interaction.reply({
                    embeds: [EmbedFactory.error('Invalid Color', 'Text must be a valid hex code')],
                    ephemeral: true
                });
            }
            updates['rankCard.textColor'] = text;
        }
        if (accent) {
            if (!hexRegex.test(accent)) {
                return interaction.reply({
                    embeds: [EmbedFactory.error('Invalid Color', 'Accent must be a valid hex code')],
                    ephemeral: true
                });
            }
            updates['rankCard.accentColor'] = accent;
        }
        try {
            const levelData = await getUserLevel(interaction.user.id, interaction.guildId);
            levelData.rankCard = { ...levelData.rankCard, ...updates };
            await updateUserLevel(interaction.user.id, interaction.guildId, levelData);
            const embed = EmbedFactory.success('Rank Card Updated!', 'Your rank card has been customized successfully.');
            await interaction.reply({ embeds: [embed] });
        }
        catch (error) {
            console.error('Rankcard command error:', error);
            const errorEmbed = EmbedFactory.error('Error', 'Failed to update rank card.');
            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    }
};
