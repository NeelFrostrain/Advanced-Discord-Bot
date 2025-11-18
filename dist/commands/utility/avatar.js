import { SlashCommandBuilder } from 'discord.js';
import { EmbedFactory } from '../../utils/embeds.js';
export default {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Get a user\'s avatar')
        .addUserOption(option => option.setName('user')
        .setDescription('The user to get avatar from')
        .setRequired(false)),
    async execute(interaction, client) {
        const target = interaction.options.getUser('user') || interaction.user;
        const embed = EmbedFactory.info(`${target.username}'s Avatar`)
            .setImage(target.displayAvatarURL({ size: 1024 }));
        await interaction.reply({ embeds: [embed] });
    }
};
