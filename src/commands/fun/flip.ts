import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { ExtendedClient } from '../../types/index.js';
import { EmbedFactory } from '../../utils/embeds.js';

export default {
  data: new SlashCommandBuilder()
    .setName('flip')
    .setDescription('Flip a coin'),
  async execute(interaction: ChatInputCommandInteraction, client: ExtendedClient) {
    const result = Math.random() < 0.5 ? 'Heads' : 'Tails';
    const emoji = result === 'Heads' ? '🪙' : '🎯';

    const embed = EmbedFactory.custom('#FFD700', 'Coin Flip')
      .setDescription(`${emoji} The coin landed on **${result}**!`);

    await interaction.reply({ embeds: [embed] });
  }
};
