import { getDatabase } from '../database/index.js';
import { getItem, getItemEffect } from './itemService.js';

export interface ItemUseResult {
  success: boolean;
  effect?: any;
  message?: string;
  error?: string;
}

export async function useItem(userId: string, guildId: string, itemId: string, context: 'battle' | 'general' = 'general'): Promise<ItemUseResult> {
  const item = getItem(itemId);
  
  if (!item) {
    return { success: false, error: 'Item not found' };
  }
  
  if (!item.consumable && !item.usableInBattle) {
    return { success: false, error: 'This item cannot be used' };
  }
  
  if (context === 'battle' && !item.usableInBattle) {
    return { success: false, error: 'This item cannot be used in battle' };
  }
  
  // Check if user has the item
  const db = getDatabase();
  const inventoryPath = `inventory.${guildId}.${userId}`;
  const inventory = await db.get(inventoryPath) || { items: [] };
  
  const itemIndex = inventory.items.findIndex((i: any) => {
    const iId = i.id || i.itemId;
    return iId === itemId;
  });
  
  if (itemIndex === -1) {
    return { success: false, error: 'You don\'t have this item' };
  }
  
  // Remove item if consumable
  if (item.consumable) {
    inventory.items.splice(itemIndex, 1);
    await db.set(inventoryPath, inventory);
  }
  
  // Apply item effect
  const effect = getItemEffect(itemId);
  if (!effect) {
    return { success: true, message: `Used ${item.name}` };
  }
  
  return {
    success: true,
    effect: effect,
    message: `Used ${item.name}!`
  };
}

export function applyItemEffect(effect: any, battleState: any): any {
  if (!effect || !battleState) return battleState;
  
  const newState = { ...battleState };
  
  switch (effect.type) {
    case 'heal':
      newState.playerHp = Math.min(
        newState.playerMaxHp || 100,
        (newState.playerHp || 100) + effect.value
      );
      break;
      
    case 'buff_attack':
      newState.playerBuffs = newState.playerBuffs || {};
      newState.playerBuffs.attack = {
        value: effect.value,
        duration: effect.duration || 3
      };
      break;
      
    case 'buff_defense':
      newState.playerBuffs = newState.playerBuffs || {};
      newState.playerBuffs.defense = {
        value: effect.value,
        duration: effect.duration || 3
      };
      break;
      
    case 'buff_luck':
      newState.playerBuffs = newState.playerBuffs || {};
      newState.playerBuffs.luck = {
        value: effect.value,
        duration: effect.duration || 3
      };
      break;
      
    case 'damage':
      newState.enemyHp = Math.max(0, (newState.enemyHp || 100) - effect.value);
      break;
      
    case 'stun':
      newState.enemyStunned = effect.duration || 1;
      break;
      
    default:
      break;
  }
  
  return newState;
}

export function updateBuffDurations(battleState: any): any {
  if (!battleState.playerBuffs) return battleState;
  
  const newState = { ...battleState };
  
  for (const [buffType, buff] of Object.entries(newState.playerBuffs)) {
    if (typeof buff === 'object' && buff !== null && 'duration' in buff) {
      (buff as any).duration--;
      if ((buff as any).duration <= 0) {
        delete newState.playerBuffs[buffType];
      }
    }
  }
  
  return newState;
}

export function calculateBuffedStats(baseStats: any, buffs: any): any {
  const buffed = { ...baseStats };
  
  if (!buffs) return buffed;
  
  if (buffs.attack) {
    buffed.attack = (buffed.attack || 0) + buffs.attack.value;
  }
  
  if (buffs.defense) {
    buffed.defense = (buffed.defense || 0) + buffs.defense.value;
  }
  
  if (buffs.luck) {
    buffed.luck = (buffed.luck || 0) + buffs.luck.value;
  }
  
  return buffed;
}

export async function getUsableItems(userId: string, guildId: string, context: 'battle' | 'general' = 'general'): Promise<any[]> {
  const db = getDatabase();
  const inventoryPath = `inventory.${guildId}.${userId}`;
  const inventory = await db.get(inventoryPath) || { items: [] };
  
  const usableItems: any[] = [];
  const itemCounts: { [key: string]: number } = {};
  
  for (const invItem of inventory.items) {
    const itemId = invItem.id || invItem.itemId;
    const item = getItem(itemId);
    
    if (!item) continue;
    
    if (context === 'battle' && !item.usableInBattle) continue;
    if (context === 'general' && !item.consumable && !item.usableInBattle) continue;
    
    if (!itemCounts[itemId]) {
      itemCounts[itemId] = 0;
      usableItems.push(item);
    }
    itemCounts[itemId]++;
  }
  
  return usableItems.map(item => ({
    ...item,
    quantity: itemCounts[item.id]
  }));
}

export function formatItemEffect(effect: any): string {
  if (!effect) return 'No effect';
  
  switch (effect.type) {
    case 'heal':
      return `Restores ${effect.value} HP`;
    case 'buff_attack':
      return `+${effect.value} Attack for ${effect.duration} turns`;
    case 'buff_defense':
      return `+${effect.value} Defense for ${effect.duration} turns`;
    case 'buff_luck':
      return `+${effect.value} Luck for ${effect.duration} turns`;
    case 'damage':
      return `Deals ${effect.value} damage`;
    case 'stun':
      return `Stuns enemy for ${effect.duration} turn(s)`;
    case 'xp_multiplier':
      return `${effect.value}x XP for ${Math.floor(effect.duration / 60)} minutes`;
    case 'coin_multiplier':
      return `${effect.value}x Coins for ${Math.floor(effect.duration / 60)} minutes`;
    default:
      return 'Unknown effect';
  }
}
