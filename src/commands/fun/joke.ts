import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { ExtendedClient } from '../../types/index.js';
import { EmbedFactory } from '../../utils/embeds.js';
import axios from 'axios';

export default {
  data: new SlashCommandBuilder()
    .setName('joke')
    .setDescription('Get a random joke'),
  async execute(interaction: ChatInputCommandInteraction, client: ExtendedClient) {
    try {
      const response = await axios.get('https://official-joke-api.appspot.com/random_joke');
      const joke = response.data;

      const embed = EmbedFactory.custom('#FF69B4', '😂 Random Joke')
        .addFields(
          { name: 'Setup', value: joke.setup },
          { name: 'Punchline', value: joke.punchline }
        );

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      const jokes = [
        { setup: 'Why do programmers prefer dark mode?', punchline: 'Because light attracts bugs!' },
        { setup: 'Why did the developer go broke?', punchline: 'Because he used up all his cache!' },
        { setup: 'What do you call a programmer from Finland?', punchline: 'Nerdic!' }
      ];
      const joke = jokes[Math.floor(Math.random() * jokes.length)];

      const embed = EmbedFactory.custom('#FF69B4', '😂 Random Joke')
        .addFields(
          { name: 'Setup', value: joke.setup },
          { name: 'Punchline', value: joke.punchline }
        );

      await interaction.reply({ embeds: [embed] });
    }
  }
};
