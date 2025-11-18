import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { getDatabase } from '../database/index.js';
import { getItem } from './itemService.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
let recipesCache = null;
export function loadRecipes() {
    if (recipesCache)
        return recipesCache;
    try {
        const recipesPath = join(__dirname, '../../data/recipes.json');
        const recipesData = readFileSync(recipesPath, 'utf-8');
        recipesCache = JSON.parse(recipesData);
        return recipesCache;
    }
    catch (error) {
        console.error('Failed to load recipes.json:', error);
        return {};
    }
}
export function getRecipe(recipeId) {
    const recipes = loadRecipes();
    return recipes[recipeId] || null;
}
export function getAllRecipes() {
    const recipes = loadRecipes();
    return Object.values(recipes);
}
export async function canCraft(userId, guildId, recipeId) {
    const recipe = getRecipe(recipeId);
    if (!recipe) {
        return { canCraft: false, missing: {} };
    }
    const db = getDatabase();
    const inventoryPath = `inventory.${guildId}.${userId}`;
    const inventory = await db.get(inventoryPath) || { items: [] };
    const itemCounts = {};
    inventory.items.forEach((item) => {
        const itemId = item.id || item.itemId;
        itemCounts[itemId] = (itemCounts[itemId] || 0) + 1;
    });
    const missing = {};
    let canCraft = true;
    for (const [materialId, required] of Object.entries(recipe.materials)) {
        const have = itemCounts[materialId] || 0;
        if (have < required) {
            missing[materialId] = required - have;
            canCraft = false;
        }
    }
    return { canCraft, missing };
}
export async function craftItem(userId, guildId, recipeId) {
    const recipe = getRecipe(recipeId);
    if (!recipe) {
        return { success: false, error: 'Recipe not found' };
    }
    const craftCheck = await canCraft(userId, guildId, recipeId);
    if (!craftCheck.canCraft) {
        return { success: false, error: 'Missing materials', missing: craftCheck.missing };
    }
    const db = getDatabase();
    const inventoryPath = `inventory.${guildId}.${userId}`;
    const inventory = await db.get(inventoryPath) || { items: [] };
    // Remove materials
    for (const [materialId, required] of Object.entries(recipe.materials)) {
        let removed = 0;
        inventory.items = inventory.items.filter((item) => {
            const itemId = item.id || item.itemId;
            if (itemId === materialId && removed < required) {
                removed++;
                return false;
            }
            return true;
        });
    }
    // Add crafted item
    const resultItem = getItem(recipe.result);
    if (resultItem) {
        for (let i = 0; i < recipe.resultAmount; i++) {
            inventory.items.push({
                ...resultItem,
                itemId: resultItem.id,
                uniqueId: Date.now() + i,
                acquiredAt: Date.now(),
                source: 'crafted'
            });
        }
    }
    await db.set(inventoryPath, inventory);
    // Track crafting for quests
    const statsPath = `stats.${guildId}.${userId}`;
    const stats = await db.get(statsPath) || { crafts: 0 };
    stats.crafts = (stats.crafts || 0) + 1;
    await db.set(statsPath, stats);
    return { success: true, result: resultItem };
}
export function getRecipesByLevel(level) {
    const recipes = getAllRecipes();
    return recipes.filter((recipe) => recipe.requiredLevel <= level);
}
export function formatRecipe(recipe) {
    let text = `**${recipe.name}**\n`;
    text += `📋 Materials needed:\n`;
    for (const [materialId, amount] of Object.entries(recipe.materials)) {
        const item = getItem(materialId);
        const itemName = item ? item.name : materialId;
        text += `  • ${itemName} x${amount}\n`;
    }
    text += `\n✨ Result: ${recipe.resultAmount}x ${recipe.name}`;
    if (recipe.requiredLevel > 1) {
        text += `\n📊 Required Level: ${recipe.requiredLevel}`;
    }
    return text;
}
