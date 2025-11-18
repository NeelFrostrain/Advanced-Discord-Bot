import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { ExtendedClient } from '../../types/index.js';
import { EmbedFactory } from '../../utils/embeds.js';

export default {
  data: new SlashCommandBuilder()
    .setName('dice')
    .setDescription('Roll a dice')
    .addIntegerOption(option =>
      option.setName('sides')
        .setDescription('Number of sides (default: 6)')
        .setMinValue(2)
        .setMaxValue(100)
        .setRequired(false)
    ),
  async execute(interaction: ChatInputCommandInteraction, client: ExtendedClient) {
    const sides = interaction.options.getInteger('sides') || 6;
    const result = Math.floor(Math.random() * sides) + 1;

    const embed = EmbedFactory.custom('#9B59B6', '🎲 Dice Roll')
      .setDescription(`You rolled a **${result}** on a ${sides}-sided dice!`);

    await interaction.reply({ embeds: [embed] });
  }
};
