import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { getDatabase } from '../database/index.js';
import { getItem } from './itemService.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
let questsCache = null;
export function loadQuests() {
    if (questsCache)
        return questsCache;
    try {
        const questsPath = join(__dirname, '../../data/quests.json');
        const questsData = readFileSync(questsPath, 'utf-8');
        questsCache = JSON.parse(questsData);
        return questsCache;
    }
    catch (error) {
        console.error('Failed to load quests.json:', error);
        return {};
    }
}
export function getQuest(questId) {
    const quests = loadQuests();
    return quests[questId] || null;
}
export function getAllQuests() {
    const quests = loadQuests();
    return Object.values(quests);
}
export async function getActiveQuests(userId, guildId) {
    const db = getDatabase();
    const questPath = `quests.${guildId}.${userId}`;
    const questData = await db.get(questPath) || { active: [], completed: [] };
    return questData.active || [];
}
export async function getCompletedQuests(userId, guildId) {
    const db = getDatabase();
    const questPath = `quests.${guildId}.${userId}`;
    const questData = await db.get(questPath) || { active: [], completed: [] };
    return questData.completed || [];
}
export async function canStartQuest(userId, guildId, questId) {
    const quest = getQuest(questId);
    if (!quest) {
        return { canStart: false, reason: 'Quest not found' };
    }
    // Check level requirement
    const db = getDatabase();
    const levelPath = `levels.${guildId}.${userId}`;
    const levelData = await db.get(levelPath) || { level: 1 };
    if (levelData.level < quest.requiredLevel) {
        return { canStart: false, reason: `Requires level ${quest.requiredLevel}` };
    }
    // Check if already active
    const activeQuests = await getActiveQuests(userId, guildId);
    if (activeQuests.some((q) => q.questId === questId)) {
        return { canStart: false, reason: 'Quest already active' };
    }
    // Check if already completed (for non-repeatable)
    if (!quest.repeatable) {
        const completedQuests = await getCompletedQuests(userId, guildId);
        if (completedQuests.includes(questId)) {
            return { canStart: false, reason: 'Quest already completed' };
        }
    }
    // Check cooldown for repeatable quests
    if (quest.repeatable && quest.cooldown) {
        const questPath = `quests.${guildId}.${userId}`;
        const questData = await db.get(questPath) || {};
        const lastCompleted = questData.lastCompleted?.[questId];
        if (lastCompleted && Date.now() - lastCompleted < quest.cooldown) {
            const timeLeft = quest.cooldown - (Date.now() - lastCompleted);
            const hoursLeft = Math.ceil(timeLeft / (1000 * 60 * 60));
            return { canStart: false, reason: `Cooldown: ${hoursLeft}h remaining` };
        }
    }
    return { canStart: true };
}
export async function startQuest(userId, guildId, questId) {
    const { canStart, reason } = await canStartQuest(userId, guildId, questId);
    if (!canStart) {
        return { success: false, error: reason };
    }
    const quest = getQuest(questId);
    const db = getDatabase();
    const questPath = `quests.${guildId}.${userId}`;
    const questData = await db.get(questPath) || { active: [], completed: [] };
    questData.active = questData.active || [];
    questData.active.push({
        questId: questId,
        startedAt: Date.now(),
        progress: {}
    });
    await db.set(questPath, questData);
    return { success: true };
}
export async function updateQuestProgress(userId, guildId, type, amount = 1) {
    const db = getDatabase();
    const questPath = `quests.${guildId}.${userId}`;
    const questData = await db.get(questPath) || { active: [], completed: [] };
    if (!questData.active || questData.active.length === 0)
        return;
    for (const activeQuest of questData.active) {
        const quest = getQuest(activeQuest.questId);
        if (!quest || quest.type !== type)
            continue;
        const requirementKey = Object.keys(quest.requirements)[0];
        activeQuest.progress[requirementKey] = (activeQuest.progress[requirementKey] || 0) + amount;
    }
    await db.set(questPath, questData);
}
export async function checkQuestCompletion(userId, guildId) {
    const db = getDatabase();
    const questPath = `quests.${guildId}.${userId}`;
    const questData = await db.get(questPath) || { active: [], completed: [] };
    const completedQuests = [];
    if (!questData.active)
        return completedQuests;
    questData.active = questData.active.filter((activeQuest) => {
        const quest = getQuest(activeQuest.questId);
        if (!quest)
            return false;
        let isComplete = true;
        for (const [key, required] of Object.entries(quest.requirements)) {
            const progress = activeQuest.progress[key] || 0;
            if (progress < required) {
                isComplete = false;
                break;
            }
        }
        if (isComplete) {
            completedQuests.push({ quest, activeQuest });
            if (!quest.repeatable) {
                questData.completed = questData.completed || [];
                questData.completed.push(quest.id);
            }
            if (quest.repeatable && quest.cooldown) {
                questData.lastCompleted = questData.lastCompleted || {};
                questData.lastCompleted[quest.id] = Date.now();
            }
            return false;
        }
        return true;
    });
    await db.set(questPath, questData);
    return completedQuests;
}
export async function giveQuestRewards(userId, guildId, quest) {
    const db = getDatabase();
    // Give coins
    if (quest.rewards.coins) {
        const { getUser, updateUser } = await import('../database/index.js');
        const user = await getUser(userId, guildId);
        user.balance += quest.rewards.coins;
        await updateUser(userId, guildId, { balance: user.balance });
    }
    // Give XP
    if (quest.rewards.xp) {
        const { addXP } = await import('./leveling.js');
        await addXP(userId, guildId, quest.rewards.xp);
    }
    // Give items
    if (quest.rewards.items && quest.rewards.items.length > 0) {
        const inventoryPath = `inventory.${guildId}.${userId}`;
        const inventory = await db.get(inventoryPath) || { items: [] };
        for (const itemId of quest.rewards.items) {
            const item = getItem(itemId);
            if (item) {
                inventory.items.push({
                    ...item,
                    itemId: item.id,
                    uniqueId: Date.now() + Math.random(),
                    acquiredAt: Date.now(),
                    source: 'quest'
                });
            }
        }
        await db.set(inventoryPath, inventory);
    }
}
export function formatQuest(quest, progress) {
    let text = `**${quest.name}**\n`;
    text += `📖 ${quest.description}\n\n`;
    text += `📋 Requirements:\n`;
    for (const [key, value] of Object.entries(quest.requirements)) {
        const current = progress?.[key] || 0;
        text += `  • ${key}: ${current}/${value}\n`;
    }
    text += `\n🎁 Rewards:\n`;
    if (quest.rewards.coins)
        text += `  • 💰 ${quest.rewards.coins} coins\n`;
    if (quest.rewards.xp)
        text += `  • ⭐ ${quest.rewards.xp} XP\n`;
    if (quest.rewards.items) {
        quest.rewards.items.forEach((itemId) => {
            const item = getItem(itemId);
            text += `  • ${item ? item.emoji + ' ' + item.name : itemId}\n`;
        });
    }
    if (quest.requiredLevel > 1) {
        text += `\n📊 Required Level: ${quest.requiredLevel}`;
    }
    if (quest.repeatable) {
        text += `\n🔄 Repeatable`;
        if (quest.cooldown) {
            const hours = quest.cooldown / (1000 * 60 * 60);
            text += ` (${hours}h cooldown)`;
        }
    }
    return text;
}
