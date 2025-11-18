import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { ExtendedClient } from '../../types/index.js';
import { EmbedFactory } from '../../utils/embeds.js';

const quotes = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
  { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" },
  { text: "Be yourself; everyone else is already taken.", author: "Oscar Wilde" },
  { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
  { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" }
];

export default {
  data: new SlashCommandBuilder()
    .setName('quote')
    .setDescription('Get an inspirational quote'),
  async execute(interaction: ChatInputCommandInteraction, client: ExtendedClient) {
    const quote = quotes[Math.floor(Math.random() * quotes.length)];

    const embed = EmbedFactory.custom('#9B59B6', '💭 Inspirational Quote')
      .setDescription(`*"${quote.text}"*`)
      .setFooter({ text: `— ${quote.author}` });

    await interaction.reply({ embeds: [embed] });
  }
};
