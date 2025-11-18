import { CommandInteraction, Collection } from 'discord.js';
import chalk from 'chalk';
import { ExtendedClient } from '../types/index.js';
import { EmbedFactory } from '../utils/embeds.js';

export default {
  name: 'interactionCreate',
  async execute(interaction: CommandInteraction, client: ExtendedClient) {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) {
      const embed = EmbedFactory.error('Command Not Found', 'This command does not exist.');
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    // Cooldown handling
    const { cooldowns } = client;

    if (!cooldowns.has(command.data.name)) {
      cooldowns.set(command.data.name, new Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.data.name)!;
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(interaction.user.id)) {
      const expirationTime = timestamps.get(interaction.user.id)! + cooldownAmount;

      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        const embed = EmbedFactory.warning(
          'Cooldown Active',
          `Please wait **${timeLeft.toFixed(1)}** more seconds before using \`${command.data.name}\` again.`
        );
        return interaction.reply({ embeds: [embed], ephemeral: true });
      }
    }

    timestamps.set(interaction.user.id, now);
    setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

    // Execute command
    try {
      await command.execute(interaction, client);
      console.log(chalk.gray(`${interaction.user.tag} used /${interaction.commandName}`));
    } catch (error) {
      console.error(chalk.red(`Error executing ${interaction.commandName}:`), error);

      const embed = EmbedFactory.error(
        'Command Error',
        'There was an error executing this command! Please try again later.'
      );

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ embeds: [embed], ephemeral: true });
      } else {
        await interaction.reply({ embeds: [embed], ephemeral: true });
      }
    }
  }
};
