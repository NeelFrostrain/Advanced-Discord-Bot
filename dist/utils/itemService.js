import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
let itemsCache = null;
export function loadItems() {
    if (itemsCache)
        return itemsCache;
    try {
        const itemsPath = join(__dirname, '../../data/items.json');
        const itemsData = readFileSync(itemsPath, 'utf-8');
        itemsCache = JSON.parse(itemsData);
        return itemsCache;
    }
    catch (error) {
        console.error('Failed to load items.json:', error);
        return {};
    }
}
export function getItem(itemId) {
    const items = loadItems();
    for (const category in items) {
        if (items[category][itemId]) {
            return items[category][itemId];
        }
    }
    return null;
}
export function getAllItems() {
    const items = loadItems();
    const allItems = [];
    for (const category in items) {
        for (const itemId in items[category]) {
            allItems.push(items[category][itemId]);
        }
    }
    return allItems;
}
export function getItemsByCategory(category) {
    const items = loadItems();
    return items[category] || {};
}
export function getItemsByType(type) {
    const allItems = getAllItems();
    return allItems.filter(item => item.type === type);
}
export function getItemsByRarity(rarity) {
    const allItems = getAllItems();
    return allItems.filter(item => item.rarity === rarity);
}
export function canUseInBattle(itemId) {
    const item = getItem(itemId);
    return item ? item.usableInBattle === true : false;
}
export function isStackable(itemId) {
    const item = getItem(itemId);
    return item ? item.stackable === true : false;
}
export function getItemEffect(itemId) {
    const item = getItem(itemId);
    return item?.effect || null;
}
export function getItemStats(itemId) {
    const item = getItem(itemId);
    return item?.stats || { attack: 0, defense: 0, luck: 0 };
}
export function formatItemDisplay(item, quantity = 1) {
    const rarityColors = {
        common: '⚪',
        uncommon: '🟢',
        rare: '🔵',
        epic: '🟣',
        legendary: '🟠',
        mythic: '🔴',
        godly: '⭐',
        divine: '✨'
    };
    const rarityIcon = rarityColors[item.rarity] || '⚪';
    const quantityText = quantity > 1 ? ` x${quantity}` : '';
    return `${item.emoji} ${rarityIcon} **${item.name}**${quantityText}`;
}
export function getShopItems() {
    const allItems = getAllItems();
    return allItems.filter(item => item.buyPrice && item.buyPrice > 0);
}
export function searchItems(query) {
    const allItems = getAllItems();
    const lowerQuery = query.toLowerCase();
    return allItems.filter(item => item.name.toLowerCase().includes(lowerQuery) ||
        item.id.toLowerCase().includes(lowerQuery) ||
        item.description.toLowerCase().includes(lowerQuery));
}
