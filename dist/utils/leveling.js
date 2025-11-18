import { getUserLevel, updateUserLevel } from '../database/index.js';
import { getDatabase } from '../database/index.js';
export function calculateLevel(xp) {
    let level = 1;
    let requiredXP = 100;
    let totalXP = 0;
    while (xp >= totalXP + requiredXP) {
        totalXP += requiredXP;
        level++;
        requiredXP = level * level * 100;
    }
    return { level, currentXP: xp - totalXP, requiredXP };
}
export async function addXP(userId, guildId, amount, multiplier = 1) {
    const levelData = await getUserLevel(userId, guildId);
    const oldLevel = levelData.level;
    const finalAmount = Math.floor(amount * multiplier);
    levelData.xp += finalAmount;
    levelData.totalXP += finalAmount;
    levelData.messages = (levelData.messages || 0) + 1;
    const { level, currentXP, requiredXP } = calculateLevel(levelData.xp);
    levelData.level = level;
    await updateUserLevel(userId, guildId, levelData);
    return {
        xp: levelData.xp,
        level: level,
        currentXP: currentXP,
        requiredXP: requiredXP,
        leveledUp: level > oldLevel,
        newLevel: level,
        xpGained: finalAmount
    };
}
export async function getLeaderboard(guildId, limit = 10) {
    const db = getDatabase();
    const allData = await db.get(`levels.${guildId}`);
    if (!allData)
        return [];
    const users = Object.values(allData);
    return users
        .sort((a, b) => b.xp - a.xp)
        .slice(0, limit);
}
export async function setXP(userId, guildId, xp) {
    const { level, currentXP, requiredXP } = calculateLevel(xp);
    await updateUserLevel(userId, guildId, {
        xp: xp,
        level: level,
        totalXP: xp
    });
    return { level, currentXP, requiredXP };
}
