import { SlashCommandBuilder } from 'discord.js';
import { EmbedFactory } from '../../utils/embeds.js';
const responses = [
    'Yes', 'No', 'Maybe', 'Definitely', 'Absolutely not',
    'Ask again later', 'I don\'t think so', 'Without a doubt',
    'Very doubtful', 'Outlook good', 'Better not tell you now',
    'Cannot predict now', 'Concentrate and ask again', 'Don\'t count on it',
    'My reply is no', 'My sources say no', 'Most likely', 'Outlook not so good',
    'Signs point to yes', 'Reply hazy, try again', 'Yes definitely'
];
export default {
    data: new SlashCommandBuilder()
        .setName('8ball')
        .setDescription('Ask the magic 8ball a question')
        .addStringOption(option => option.setName('question')
        .setDescription('Your question')
        .setRequired(true)),
    async execute(interaction, client) {
        const question = interaction.options.getString('question', true);
        const response = responses[Math.floor(Math.random() * responses.length)];
        const embed = EmbedFactory.custom('#9B59B6', '🎱 Magic 8Ball')
            .addFields({ name: '❓ Question', value: question }, { name: '🔮 Answer', value: response });
        await interaction.reply({ embeds: [embed] });
    }
};
