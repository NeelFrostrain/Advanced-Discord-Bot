import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { ExtendedClient } from '../../types/index.js';
import { EmbedFactory } from '../../utils/embeds.js';
import { getDatabase } from '../../database/index.js';

export default {
  data: new SlashCommandBuilder()
    .setName('equipment')
    .setDescription('View your equipped items'),
  async execute(interaction: ChatInputCommandInteraction, client: ExtendedClient) {
    const db = getDatabase();

    try {
      const equipmentKey = `equipment.${interaction.guildId}.${interaction.user.id}`;
      const equipment = await db.get(equipmentKey) || { weapon: null, armor: null };

      const embed = EmbedFactory.battle('Your Equipment')
        .setThumbnail(interaction.user.displayAvatarURL());

      if (!equipment.weapon && !equipment.armor) {
        embed.setDescription('⚔️ You have no equipment equipped!\n\nUse `/buy` to purchase items and `/equip` to equip them.');
      } else {
        let description = '';
        
        if (equipment.weapon) {
          description += `**⚔️ Weapon:** ${equipment.weapon.name}\n`;
          description += `   Damage: +${equipment.weapon.damage || 0}\n\n`;
        } else {
          description += '**⚔️ Weapon:** None\n\n';
        }

        if (equipment.armor) {
          description += `**🛡️ Armor:** ${equipment.armor.name}\n`;
          description += `   Defense: +${equipment.armor.defense || 0}\n`;
        } else {
          description += '**🛡️ Armor:** None';
        }

        embed.setDescription(description);
      }

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Equipment command error:', error);
      const errorEmbed = EmbedFactory.error('Error', 'Failed to fetch equipment.');
      await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  }
};
