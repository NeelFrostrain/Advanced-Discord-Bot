import { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, ComponentType } from 'discord.js';
import { EmbedFactory } from '../../utils/embeds.js';
import { shopItems, getItemsByType, getItemsByRarity, getRarityEmoji } from '../../data/shopItems.js';
export default {
    data: new SlashCommandBuilder()
        .setName('shop')
        .setDescription('View the shop')
        .addStringOption(option => option.setName('filter')
        .setDescription('Filter items by type or rarity')
        .setRequired(false)
        .addChoices({ name: '🗡️ Weapons', value: 'weapon' }, { name: '🛡️ Armor', value: 'armor' }, { name: '🧪 Consumables', value: 'consumable' }, { name: '🐾 Pets', value: 'pet' }, { name: '⭐ Boosts', value: 'boost' }, { name: '📦 Lootboxes', value: 'lootbox' }, { name: '🔧 Materials', value: 'material' }, { name: '💍 Accessories', value: 'accessory' }, { name: '⚪ Common', value: 'rarity:common' }, { name: '🟢 Uncommon', value: 'rarity:uncommon' }, { name: '🔵 Rare', value: 'rarity:rare' }, { name: '🟣 Epic', value: 'rarity:epic' }, { name: '🟠 Legendary', value: 'rarity:legendary' }, { name: '🔴 Mythic', value: 'rarity:mythic' }))
        .addIntegerOption(option => option.setName('page')
        .setDescription('Page number')
        .setRequired(false)
        .setMinValue(1)),
    async execute(interaction, client) {
        const filter = interaction.options.getString('filter');
        const page = interaction.options.getInteger('page') || 1;
        const itemsPerPage = 10;
        let filteredItems = shopItems;
        // Apply filters
        if (filter) {
            if (filter.startsWith('rarity:')) {
                const rarity = filter.split(':')[1];
                filteredItems = getItemsByRarity(rarity);
            }
            else {
                filteredItems = getItemsByType(filter);
            }
        }
        // Pagination
        const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageItems = filteredItems.slice(startIndex, endIndex);
        // Create embed
        const filterText = filter
            ? filter.startsWith('rarity:')
                ? `${getRarityEmoji(filter.split(':')[1])} ${filter.split(':')[1].charAt(0).toUpperCase() + filter.split(':')[1].slice(1)} Items`
                : `${filter.charAt(0).toUpperCase() + filter.slice(1)}s`
            : 'All Items';
        const embed = EmbedFactory.economy(`🏪 Shop - ${filterText}`)
            .setDescription(`**Total Items:** ${filteredItems.length}\n**Page ${page}/${totalPages}**\n\nUse \`/buy <item_id>\` to purchase items\nUse \`/shop filter:<type>\` to filter items`)
            .setFooter({ text: `Showing ${startIndex + 1}-${Math.min(endIndex, filteredItems.length)} of ${filteredItems.length} items` });
        // Add items to embed
        pageItems.forEach(item => {
            const rarityEmoji = getRarityEmoji(item.rarity);
            let stats = '';
            if (item.damage)
                stats += `⚔️ ${item.damage} DMG `;
            if (item.defense)
                stats += `🛡️ ${item.defense} DEF `;
            if (item.heal)
                stats += `❤️ ${item.heal} HP `;
            if (item.multiplier)
                stats += `✨ ${item.multiplier}x `;
            embed.addFields({
                name: `${rarityEmoji} ${item.name}`,
                value: `**ID:** \`${item.id}\`\n💰 **${item.price.toLocaleString()}** coins\n${stats}\n${item.description || ''}`,
                inline: true
            });
        });
        // Create navigation menu
        const row = new ActionRowBuilder()
            .addComponents(new StringSelectMenuBuilder()
            .setCustomId('shop_filter')
            .setPlaceholder('Filter by category or rarity')
            .addOptions([
            { label: 'All Items', value: 'all', emoji: '🏪' },
            { label: 'Weapons', value: 'weapon', emoji: '⚔️' },
            { label: 'Armor', value: 'armor', emoji: '🛡️' },
            { label: 'Consumables', value: 'consumable', emoji: '🧪' },
            { label: 'Pets', value: 'pet', emoji: '🐾' },
            { label: 'Boosts', value: 'boost', emoji: '⭐' },
            { label: 'Lootboxes', value: 'lootbox', emoji: '📦' },
            { label: 'Materials', value: 'material', emoji: '🔧' },
            { label: 'Accessories', value: 'accessory', emoji: '💍' },
            { label: 'Common', value: 'rarity:common', emoji: '⚪' },
            { label: 'Uncommon', value: 'rarity:uncommon', emoji: '🟢' },
            { label: 'Rare', value: 'rarity:rare', emoji: '🔵' },
            { label: 'Epic', value: 'rarity:epic', emoji: '🟣' },
            { label: 'Legendary', value: 'rarity:legendary', emoji: '🟠' },
            { label: 'Mythic', value: 'rarity:mythic', emoji: '🔴' },
        ]));
        const response = await interaction.reply({
            embeds: [embed],
            components: [row]
        });
        // Handle menu interactions
        const collector = response.createMessageComponentCollector({
            componentType: ComponentType.StringSelect,
            time: 300000 // 5 minutes
        });
        collector.on('collect', async (i) => {
            if (i.user.id !== interaction.user.id) {
                await i.reply({ content: 'This menu is not for you!', ephemeral: true });
                return;
            }
            const selectedFilter = i.values[0];
            // Reconstruct command with new filter
            let newFilteredItems = shopItems;
            let newFilterText = 'All Items';
            if (selectedFilter !== 'all') {
                if (selectedFilter.startsWith('rarity:')) {
                    const rarity = selectedFilter.split(':')[1];
                    newFilteredItems = getItemsByRarity(rarity);
                    newFilterText = `${getRarityEmoji(rarity)} ${rarity.charAt(0).toUpperCase() + rarity.slice(1)} Items`;
                }
                else {
                    newFilteredItems = getItemsByType(selectedFilter);
                    newFilterText = `${selectedFilter.charAt(0).toUpperCase() + selectedFilter.slice(1)}s`;
                }
            }
            const newTotalPages = Math.ceil(newFilteredItems.length / itemsPerPage);
            const newPageItems = newFilteredItems.slice(0, itemsPerPage);
            const newEmbed = EmbedFactory.economy(`🏪 Shop - ${newFilterText}`)
                .setDescription(`**Total Items:** ${newFilteredItems.length}\n**Page 1/${newTotalPages}**\n\nUse \`/buy <item_id>\` to purchase items\nUse \`/shop filter:<type>\` to filter items`)
                .setFooter({ text: `Showing 1-${Math.min(itemsPerPage, newFilteredItems.length)} of ${newFilteredItems.length} items` });
            newPageItems.forEach(item => {
                const rarityEmoji = getRarityEmoji(item.rarity);
                let stats = '';
                if (item.damage)
                    stats += `⚔️ ${item.damage} DMG `;
                if (item.defense)
                    stats += `🛡️ ${item.defense} DEF `;
                if (item.heal)
                    stats += `❤️ ${item.heal} HP `;
                if (item.multiplier)
                    stats += `✨ ${item.multiplier}x `;
                newEmbed.addFields({
                    name: `${rarityEmoji} ${item.name}`,
                    value: `**ID:** \`${item.id}\`\n💰 **${item.price.toLocaleString()}** coins\n${stats}\n${item.description || ''}`,
                    inline: true
                });
            });
            await i.update({ embeds: [newEmbed], components: [row] });
        });
    }
};
