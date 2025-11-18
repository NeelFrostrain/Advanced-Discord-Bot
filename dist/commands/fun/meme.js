import { SlashCommandBuilder } from 'discord.js';
import { EmbedFactory } from '../../utils/embeds.js';
import axios from 'axios';
export default {
    data: new SlashCommandBuilder()
        .setName('meme')
        .setDescription('Get a random meme'),
    async execute(interaction, client) {
        try {
            const response = await axios.get('https://meme-api.com/gimme');
            const meme = response.data;
            const embed = EmbedFactory.custom('#FF4500', meme.title)
                .setImage(meme.url)
                .setFooter({ text: `👍 ${meme.ups} | r/${meme.subreddit}` });
            await interaction.reply({ embeds: [embed] });
        }
        catch (error) {
            console.error('Meme command error:', error);
            const errorEmbed = EmbedFactory.error('Error', 'Failed to fetch meme!');
            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    }
};
