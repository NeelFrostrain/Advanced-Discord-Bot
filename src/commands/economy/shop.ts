import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { ExtendedClient } from '../../types/index.js';
import { EmbedFactory } from '../../utils/embeds.js';

const shopItems = [
  { id: 'sword', name: '⚔️ Sword', price: 500, type: 'weapon', damage: 10 },
  { id: 'shield', name: '🛡️ Shield', price: 400, type: 'armor', defense: 8 },
  { id: 'potion', name: '🧪 Health Potion', price: 50, type: 'consumable', heal: 50 },
  { id: 'lootbox', name: '📦 Lootbox', price: 1000, type: 'lootbox', rarity: 'common' },
  { id: 'pet_egg', name: '🥚 Pet Egg', price: 2000, type: 'pet', rarity: 'random' },
  { id: 'xp_boost', name: '⭐ XP Boost', price: 1500, type: 'boost', multiplier: 2, duration: 3600000 }
];

export default {
  data: new SlashCommandBuilder()
    .setName('shop')
    .setDescription('View the shop'),
  async execute(interaction: ChatInputCommandInteraction, client: ExtendedClient) {
    const embed = EmbedFactory.economy('Shop')
      .setDescription('Use `/buy <item_id>` to purchase items');

    shopItems.forEach(item => {
      embed.addFields({
        name: `${item.name} (ID: ${item.id})`,
        value: `💰 Price: **${item.price}** coins\n📦 Type: ${item.type}`,
        inline: true
      });
    });

    await interaction.reply({ embeds: [embed] });
  }
};
