import { SlashCommandBuilder } from 'discord.js';
import { EmbedFactory } from '../../utils/embeds.js';
export default {
    data: new SlashCommandBuilder()
        .setName('rps')
        .setDescription('Play Rock Paper Scissors')
        .addStringOption(option => option.setName('choice')
        .setDescription('Your choice')
        .setRequired(true)
        .addChoices({ name: '🪨 Rock', value: 'rock' }, { name: '📄 Paper', value: 'paper' }, { name: '✂️ Scissors', value: 'scissors' })),
    async execute(interaction, client) {
        const userChoice = interaction.options.getString('choice', true);
        const choices = ['rock', 'paper', 'scissors'];
        const botChoice = choices[Math.floor(Math.random() * choices.length)];
        const emojis = {
            rock: '🪨',
            paper: '📄',
            scissors: '✂️'
        };
        let result = '';
        let color = '#FFD700';
        if (userChoice === botChoice) {
            result = "It's a tie!";
            color = '#FFD700';
        }
        else if ((userChoice === 'rock' && botChoice === 'scissors') ||
            (userChoice === 'paper' && botChoice === 'rock') ||
            (userChoice === 'scissors' && botChoice === 'paper')) {
            result = 'You win! 🎉';
            color = '#00FF00';
        }
        else {
            result = 'You lose! 😢';
            color = '#FF0000';
        }
        const embed = EmbedFactory.custom(color, 'Rock Paper Scissors')
            .addFields({ name: 'Your Choice', value: `${emojis[userChoice]} ${userChoice}`, inline: true }, { name: 'Bot Choice', value: `${emojis[botChoice]} ${botChoice}`, inline: true }, { name: 'Result', value: result, inline: false });
        await interaction.reply({ embeds: [embed] });
    }
};
