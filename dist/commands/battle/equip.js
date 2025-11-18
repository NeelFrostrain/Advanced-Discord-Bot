import { SlashCommandBuilder } from 'discord.js';
import { EmbedFactory } from '../../utils/embeds.js';
import { getDatabase } from '../../database/index.js';
export default {
    data: new SlashCommandBuilder()
        .setName('equip')
        .setDescription('Equip weapons or armor')
        .addStringOption(option => option.setName('item')
        .setDescription('Item ID to equip')
        .setRequired(true)),
    async execute(interaction, client) {
        const itemId = interaction.options.getString('item', true);
        const db = getDatabase();
        try {
            const inventoryPath = `inventory.${interaction.guildId}.${interaction.user.id}`;
            const inventory = await db.get(inventoryPath) || { items: [] };
            const item = inventory.items.find((i) => i.id === itemId || i.uniqueId === itemId);
            if (!item) {
                const embed = EmbedFactory.error('Item Not Found', 'This item is not in your inventory!');
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }
            if (!['weapon', 'armor'].includes(item.type)) {
                const embed = EmbedFactory.error('Cannot Equip', 'This item cannot be equipped!');
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }
            const equipmentKey = `equipment.${interaction.guildId}.${interaction.user.id}`;
            const equipment = await db.get(equipmentKey) || { weapon: null, armor: null };
            if (item.type === 'weapon') {
                equipment.weapon = item;
            }
            else if (item.type === 'armor') {
                equipment.armor = item;
            }
            await db.set(equipmentKey, equipment);
            const embed = EmbedFactory.success('Equipment Updated')
                .setDescription(`⚔️ You equipped **${item.name}**!`);
            await interaction.reply({ embeds: [embed] });
        }
        catch (error) {
            console.error('Equip command error:', error);
            const errorEmbed = EmbedFactory.error('Error', 'Failed to equip item.');
            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    }
};
