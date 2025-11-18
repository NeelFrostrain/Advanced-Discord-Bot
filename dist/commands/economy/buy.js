import { SlashCommandBuilder } from 'discord.js';
import { EmbedFactory } from '../../utils/embeds.js';
import { getUser, updateUser, getDatabase } from '../../database/index.js';
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
        .setName('buy')
        .setDescription('Buy an item from the shop')
        .addStringOption(option => option.setName('item')
        .setDescription('The item ID to buy')
        .setRequired(true)
        .addChoices(...shopItems.map(item => ({ name: item.name, value: item.id }))))
        .addIntegerOption(option => option.setName('amount')
        .setDescription('Amount to buy')
        .setMinValue(1)
        .setRequired(false)),
    async execute(interaction, client) {
        const itemId = interaction.options.getString('item', true);
        const amount = interaction.options.getInteger('amount') || 1;
        const item = shopItems.find(i => i.id === itemId);
        if (!item) {
            const embed = EmbedFactory.error('Item Not Found', 'This item does not exist in the shop.');
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
        try {
            const user = await getUser(interaction.user.id, interaction.guildId);
            const totalCost = item.price * amount;
            if (user.balance < totalCost) {
                const embed = EmbedFactory.error('Insufficient Funds', `You need **${totalCost.toLocaleString()}** coins but only have **${user.balance.toLocaleString()}** coins.`);
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }
            user.balance -= totalCost;
            await updateUser(interaction.user.id, interaction.guildId, { balance: user.balance });
            const db = getDatabase();
            const inventoryPath = `inventory.${interaction.guildId}.${interaction.user.id}`;
            const inventory = await db.get(inventoryPath) || { items: [] };
            for (let i = 0; i < amount; i++) {
                inventory.items.push({ ...item, uniqueId: Date.now() + i, acquiredAt: Date.now() });
            }
            await db.set(inventoryPath, inventory);
            const embed = EmbedFactory.success('Purchase Successful!')
                .setDescription(`You bought **${amount}x ${item.name}** for **${totalCost.toLocaleString()}** coins!`)
                .addFields({ name: '💰 Remaining Balance', value: `${user.balance.toLocaleString()} coins` });
            await interaction.reply({ embeds: [embed] });
        }
        catch (error) {
            console.error('Buy command error:', error);
            const errorEmbed = EmbedFactory.error('Error', 'Failed to purchase item. Please try again.');
            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    }
};
