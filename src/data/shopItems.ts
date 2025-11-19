// Shop Items Database with Rarity System
// Rarity: Common, Uncommon, Rare, Epic, Legendary, Mythic

export interface ShopItem {
  id: string;
  name: string;
  price: number;
  type: 'weapon' | 'armor' | 'consumable' | 'lootbox' | 'pet' | 'boost' | 'material' | 'accessory';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';
  description?: string;
  damage?: number;
  defense?: number;
  heal?: number;
  multiplier?: number;
  duration?: number;
  level?: number;
}

export const shopItems: ShopItem[] = [
  // ========== WEAPONS ==========
  
  // Common Weapons
  { id: 'wooden_sword', name: '🗡️ Wooden Sword', price: 100, type: 'weapon', rarity: 'common', damage: 5, description: 'A basic wooden training sword' },
  { id: 'rusty_dagger', name: '🔪 Rusty Dagger', price: 150, type: 'weapon', rarity: 'common', damage: 7, description: 'An old, worn dagger' },
  { id: 'wooden_staff', name: '🪄 Wooden Staff', price: 120, type: 'weapon', rarity: 'common', damage: 6, description: 'A simple wooden staff' },
  { id: 'slingshot', name: '🎯 Slingshot', price: 80, type: 'weapon', rarity: 'common', damage: 4, description: 'A child\'s toy weapon' },
  
  // Uncommon Weapons
  { id: 'iron_sword', name: '⚔️ Iron Sword', price: 500, type: 'weapon', rarity: 'uncommon', damage: 15, description: 'A sturdy iron blade' },
  { id: 'steel_dagger', name: '🗡️ Steel Dagger', price: 600, type: 'weapon', rarity: 'uncommon', damage: 18, description: 'A sharp steel dagger' },
  { id: 'battle_axe', name: '🪓 Battle Axe', price: 700, type: 'weapon', rarity: 'uncommon', damage: 20, description: 'A heavy battle axe' },
  { id: 'longbow', name: '🏹 Longbow', price: 550, type: 'weapon', rarity: 'uncommon', damage: 16, description: 'A reliable longbow' },
  { id: 'war_hammer', name: '🔨 War Hammer', price: 650, type: 'weapon', rarity: 'uncommon', damage: 19, description: 'A crushing war hammer' },
  
  // Rare Weapons
  { id: 'enchanted_sword', name: '⚔️ Enchanted Sword', price: 2000, type: 'weapon', rarity: 'rare', damage: 35, description: 'A magically enhanced blade' },
  { id: 'crystal_staff', name: '🔮 Crystal Staff', price: 2200, type: 'weapon', rarity: 'rare', damage: 38, description: 'A staff with a glowing crystal' },
  { id: 'dual_blades', name: '⚔️ Dual Blades', price: 2500, type: 'weapon', rarity: 'rare', damage: 40, description: 'Twin blades for swift attacks' },
  { id: 'crossbow', name: '🏹 Crossbow', price: 1800, type: 'weapon', rarity: 'rare', damage: 33, description: 'A powerful crossbow' },
  { id: 'mace', name: '🔨 Mace', price: 1900, type: 'weapon', rarity: 'rare', damage: 34, description: 'A spiked mace' },
  
  // Epic Weapons
  { id: 'flame_sword', name: '🔥 Flame Sword', price: 8000, type: 'weapon', rarity: 'epic', damage: 65, description: 'A sword wreathed in flames' },
  { id: 'ice_spear', name: '❄️ Ice Spear', price: 8500, type: 'weapon', rarity: 'epic', damage: 68, description: 'A spear of frozen ice' },
  { id: 'thunder_hammer', name: '⚡ Thunder Hammer', price: 9000, type: 'weapon', rarity: 'epic', damage: 70, description: 'A hammer crackling with lightning' },
  { id: 'shadow_blade', name: '🌑 Shadow Blade', price: 8200, type: 'weapon', rarity: 'epic', damage: 66, description: 'A blade forged in darkness' },
  { id: 'holy_mace', name: '✨ Holy Mace', price: 8800, type: 'weapon', rarity: 'epic', damage: 69, description: 'A blessed weapon of light' },
  
  // Legendary Weapons
  { id: 'dragon_slayer', name: '🐉 Dragon Slayer', price: 25000, type: 'weapon', rarity: 'legendary', damage: 120, description: 'A legendary blade that slays dragons' },
  { id: 'excalibur', name: '👑 Excalibur', price: 30000, type: 'weapon', rarity: 'legendary', damage: 130, description: 'The legendary sword of kings' },
  { id: 'mjolnir', name: '⚡ Mjolnir', price: 28000, type: 'weapon', rarity: 'legendary', damage: 125, description: 'The hammer of thunder gods' },
  { id: 'soul_reaper', name: '💀 Soul Reaper', price: 27000, type: 'weapon', rarity: 'legendary', damage: 122, description: 'A scythe that harvests souls' },
  
  // Mythic Weapons
  { id: 'infinity_blade', name: '♾️ Infinity Blade', price: 100000, type: 'weapon', rarity: 'mythic', damage: 250, description: 'A weapon of infinite power' },
  { id: 'cosmic_staff', name: '🌌 Cosmic Staff', price: 120000, type: 'weapon', rarity: 'mythic', damage: 280, description: 'A staff containing the power of stars' },
  { id: 'void_reaver', name: '🌀 Void Reaver', price: 150000, type: 'weapon', rarity: 'mythic', damage: 300, description: 'A blade that tears through reality' },
  
  // ========== ARMOR ==========
  
  // Common Armor
  { id: 'cloth_armor', name: '👕 Cloth Armor', price: 80, type: 'armor', rarity: 'common', defense: 3, description: 'Basic cloth protection' },
  { id: 'leather_vest', name: '🦺 Leather Vest', price: 120, type: 'armor', rarity: 'common', defense: 5, description: 'Simple leather vest' },
  { id: 'wooden_shield', name: '🛡️ Wooden Shield', price: 100, type: 'armor', rarity: 'common', defense: 4, description: 'A basic wooden shield' },
  
  // Uncommon Armor
  { id: 'iron_armor', name: '🛡️ Iron Armor', price: 400, type: 'armor', rarity: 'uncommon', defense: 12, description: 'Sturdy iron protection' },
  { id: 'chainmail', name: '⛓️ Chainmail', price: 500, type: 'armor', rarity: 'uncommon', defense: 14, description: 'Flexible chain armor' },
  { id: 'steel_shield', name: '🛡️ Steel Shield', price: 450, type: 'armor', rarity: 'uncommon', defense: 13, description: 'A reliable steel shield' },
  { id: 'leather_armor', name: '🦺 Leather Armor', price: 380, type: 'armor', rarity: 'uncommon', defense: 11, description: 'Reinforced leather armor' },
  
  // Rare Armor
  { id: 'knight_armor', name: '🛡️ Knight Armor', price: 1800, type: 'armor', rarity: 'rare', defense: 28, description: 'Full plate armor of a knight' },
  { id: 'mage_robes', name: '🧙 Mage Robes', price: 1600, type: 'armor', rarity: 'rare', defense: 22, description: 'Enchanted robes for mages' },
  { id: 'dragon_scale', name: '🐲 Dragon Scale Armor', price: 2000, type: 'armor', rarity: 'rare', defense: 30, description: 'Armor made from dragon scales' },
  { id: 'tower_shield', name: '🛡️ Tower Shield', price: 1700, type: 'armor', rarity: 'rare', defense: 25, description: 'A massive defensive shield' },
  
  // Epic Armor
  { id: 'paladin_armor', name: '✨ Paladin Armor', price: 7000, type: 'armor', rarity: 'epic', defense: 55, description: 'Holy armor blessed by light' },
  { id: 'shadow_cloak', name: '🌑 Shadow Cloak', price: 6500, type: 'armor', rarity: 'epic', defense: 50, description: 'A cloak that bends shadows' },
  { id: 'crystal_armor', name: '💎 Crystal Armor', price: 7500, type: 'armor', rarity: 'epic', defense: 58, description: 'Armor made of pure crystal' },
  { id: 'demon_plate', name: '😈 Demon Plate', price: 7200, type: 'armor', rarity: 'epic', defense: 56, description: 'Armor forged in hellfire' },
  
  // Legendary Armor
  { id: 'titan_armor', name: '⚡ Titan Armor', price: 22000, type: 'armor', rarity: 'legendary', defense: 100, description: 'Armor of the ancient titans' },
  { id: 'phoenix_mail', name: '🔥 Phoenix Mail', price: 24000, type: 'armor', rarity: 'legendary', defense: 105, description: 'Armor that rises from ashes' },
  { id: 'celestial_guard', name: '🌟 Celestial Guard', price: 26000, type: 'armor', rarity: 'legendary', defense: 110, description: 'Protection from the heavens' },
  
  // Mythic Armor
  { id: 'god_armor', name: '👑 God Armor', price: 90000, type: 'armor', rarity: 'mythic', defense: 200, description: 'Armor worn by gods' },
  { id: 'void_plate', name: '🌀 Void Plate', price: 110000, type: 'armor', rarity: 'mythic', defense: 230, description: 'Armor from the void itself' },
  
  // ========== CONSUMABLES ==========
  
  // Common Consumables
  { id: 'small_potion', name: '🧪 Small Potion', price: 30, type: 'consumable', rarity: 'common', heal: 25, description: 'Restores 25 HP' },
  { id: 'bread', name: '🍞 Bread', price: 10, type: 'consumable', rarity: 'common', heal: 10, description: 'Basic food' },
  { id: 'water', name: '💧 Water', price: 5, type: 'consumable', rarity: 'common', heal: 5, description: 'Refreshing water' },
  
  // Uncommon Consumables
  { id: 'health_potion', name: '🧪 Health Potion', price: 100, type: 'consumable', rarity: 'uncommon', heal: 50, description: 'Restores 50 HP' },
  { id: 'mana_potion', name: '💙 Mana Potion', price: 120, type: 'consumable', rarity: 'uncommon', heal: 60, description: 'Restores mana' },
  { id: 'stamina_drink', name: '⚡ Stamina Drink', price: 90, type: 'consumable', rarity: 'uncommon', heal: 45, description: 'Restores stamina' },
  
  // Rare Consumables
  { id: 'greater_potion', name: '🧪 Greater Potion', price: 500, type: 'consumable', rarity: 'rare', heal: 100, description: 'Restores 100 HP' },
  { id: 'elixir', name: '⚗️ Elixir', price: 600, type: 'consumable', rarity: 'rare', heal: 120, description: 'Powerful healing elixir' },
  { id: 'phoenix_down', name: '🔥 Phoenix Down', price: 800, type: 'consumable', rarity: 'rare', heal: 150, description: 'Revives and heals' },
  
  // Epic Consumables
  { id: 'mega_potion', name: '🧪 Mega Potion', price: 2000, type: 'consumable', rarity: 'epic', heal: 250, description: 'Restores 250 HP' },
  { id: 'divine_nectar', name: '✨ Divine Nectar', price: 2500, type: 'consumable', rarity: 'epic', heal: 300, description: 'Blessed healing drink' },
  
  // Legendary Consumables
  { id: 'full_restore', name: '💫 Full Restore', price: 10000, type: 'consumable', rarity: 'legendary', heal: 999, description: 'Fully restores HP' },
  { id: 'immortality_potion', name: '♾️ Immortality Potion', price: 15000, type: 'consumable', rarity: 'legendary', heal: 1000, description: 'Grants temporary immortality' },
  
  // ========== ACCESSORIES ==========
  
  // Common Accessories
  { id: 'copper_ring', name: '💍 Copper Ring', price: 50, type: 'accessory', rarity: 'common', description: 'A simple copper ring' },
  { id: 'leather_gloves', name: '🧤 Leather Gloves', price: 60, type: 'accessory', rarity: 'common', description: 'Basic leather gloves' },
  
  // Uncommon Accessories
  { id: 'silver_ring', name: '💍 Silver Ring', price: 300, type: 'accessory', rarity: 'uncommon', description: 'A silver ring' },
  { id: 'amulet', name: '📿 Amulet', price: 350, type: 'accessory', rarity: 'uncommon', description: 'A protective amulet' },
  { id: 'belt', name: '🎗️ Belt', price: 280, type: 'accessory', rarity: 'uncommon', description: 'A sturdy belt' },
  
  // Rare Accessories
  { id: 'gold_ring', name: '💍 Gold Ring', price: 1500, type: 'accessory', rarity: 'rare', description: 'A valuable gold ring' },
  { id: 'magic_amulet', name: '🔮 Magic Amulet', price: 1800, type: 'accessory', rarity: 'rare', description: 'An enchanted amulet' },
  { id: 'power_gloves', name: '🧤 Power Gloves', price: 1600, type: 'accessory', rarity: 'rare', description: 'Gloves that boost strength' },
  
  // Epic Accessories
  { id: 'dragon_ring', name: '🐉 Dragon Ring', price: 6000, type: 'accessory', rarity: 'epic', description: 'Ring with dragon power' },
  { id: 'phoenix_pendant', name: '🔥 Phoenix Pendant', price: 6500, type: 'accessory', rarity: 'epic', description: 'Pendant of rebirth' },
  { id: 'titan_belt', name: '⚡ Titan Belt', price: 5800, type: 'accessory', rarity: 'epic', description: 'Belt of titan strength' },
  
  // Legendary Accessories
  { id: 'infinity_ring', name: '♾️ Infinity Ring', price: 20000, type: 'accessory', rarity: 'legendary', description: 'Ring of infinite power' },
  { id: 'celestial_crown', name: '👑 Celestial Crown', price: 25000, type: 'accessory', rarity: 'legendary', description: 'Crown of the heavens' },
  
  // Mythic Accessories
  { id: 'god_ring', name: '👑 God Ring', price: 80000, type: 'accessory', rarity: 'mythic', description: 'Ring worn by gods' },
  
  // ========== MATERIALS ==========
  
  // Common Materials
  { id: 'wood', name: '🪵 Wood', price: 5, type: 'material', rarity: 'common', description: 'Basic crafting material' },
  { id: 'stone', name: '🪨 Stone', price: 8, type: 'material', rarity: 'common', description: 'Common stone' },
  { id: 'iron_ore', name: '⛏️ Iron Ore', price: 15, type: 'material', rarity: 'common', description: 'Raw iron ore' },
  { id: 'leather', name: '🦴 Leather', price: 12, type: 'material', rarity: 'common', description: 'Animal leather' },
  
  // Uncommon Materials
  { id: 'steel_ingot', name: '⚙️ Steel Ingot', price: 80, type: 'material', rarity: 'uncommon', description: 'Refined steel' },
  { id: 'silver_ore', name: '💎 Silver Ore', price: 100, type: 'material', rarity: 'uncommon', description: 'Silver ore' },
  { id: 'crystal_shard', name: '💠 Crystal Shard', price: 120, type: 'material', rarity: 'uncommon', description: 'Magical crystal' },
  
  // Rare Materials
  { id: 'gold_ore', name: '🏆 Gold Ore', price: 500, type: 'material', rarity: 'rare', description: 'Precious gold ore' },
  { id: 'mithril', name: '✨ Mithril', price: 800, type: 'material', rarity: 'rare', description: 'Legendary metal' },
  { id: 'dragon_scale_mat', name: '🐲 Dragon Scale', price: 1000, type: 'material', rarity: 'rare', description: 'Scale from a dragon' },
  
  // Epic Materials
  { id: 'adamantite', name: '💎 Adamantite', price: 3000, type: 'material', rarity: 'epic', description: 'Unbreakable ore' },
  { id: 'phoenix_feather', name: '🔥 Phoenix Feather', price: 3500, type: 'material', rarity: 'epic', description: 'Feather of rebirth' },
  { id: 'demon_horn', name: '😈 Demon Horn', price: 3200, type: 'material', rarity: 'epic', description: 'Horn from a demon' },
  
  // Legendary Materials
  { id: 'celestial_ore', name: '🌟 Celestial Ore', price: 10000, type: 'material', rarity: 'legendary', description: 'Ore from the heavens' },
  { id: 'void_crystal', name: '🌀 Void Crystal', price: 12000, type: 'material', rarity: 'legendary', description: 'Crystal from the void' },
  
  // Mythic Materials
  { id: 'god_essence', name: '👑 God Essence', price: 50000, type: 'material', rarity: 'mythic', description: 'Essence of divinity' },
  
  // ========== PETS ==========
  
  // Common Pets
  { id: 'pet_cat', name: '🐱 Cat', price: 500, type: 'pet', rarity: 'common', description: 'A friendly cat' },
  { id: 'pet_dog', name: '🐕 Dog', price: 500, type: 'pet', rarity: 'common', description: 'A loyal dog' },
  { id: 'pet_rabbit', name: '🐰 Rabbit', price: 400, type: 'pet', rarity: 'common', description: 'A cute rabbit' },
  
  // Uncommon Pets
  { id: 'pet_wolf', name: '🐺 Wolf', price: 1500, type: 'pet', rarity: 'uncommon', description: 'A fierce wolf' },
  { id: 'pet_fox', name: '🦊 Fox', price: 1400, type: 'pet', rarity: 'uncommon', description: 'A clever fox' },
  { id: 'pet_owl', name: '🦉 Owl', price: 1600, type: 'pet', rarity: 'uncommon', description: 'A wise owl' },
  
  // Rare Pets
  { id: 'pet_tiger', name: '🐯 Tiger', price: 5000, type: 'pet', rarity: 'rare', description: 'A powerful tiger' },
  { id: 'pet_eagle', name: '🦅 Eagle', price: 4800, type: 'pet', rarity: 'rare', description: 'A majestic eagle' },
  { id: 'pet_bear', name: '🐻 Bear', price: 5200, type: 'pet', rarity: 'rare', description: 'A strong bear' },
  
  // Epic Pets
  { id: 'pet_griffin', name: '🦅 Griffin', price: 15000, type: 'pet', rarity: 'epic', description: 'A mythical griffin' },
  { id: 'pet_unicorn', name: '🦄 Unicorn', price: 16000, type: 'pet', rarity: 'epic', description: 'A magical unicorn' },
  { id: 'pet_phoenix', name: '🔥 Phoenix', price: 18000, type: 'pet', rarity: 'epic', description: 'A legendary phoenix' },
  
  // Legendary Pets
  { id: 'pet_dragon', name: '🐉 Dragon', price: 50000, type: 'pet', rarity: 'legendary', description: 'A mighty dragon' },
  { id: 'pet_hydra', name: '🐲 Hydra', price: 55000, type: 'pet', rarity: 'legendary', description: 'A multi-headed hydra' },
  
  // Mythic Pets
  { id: 'pet_celestial', name: '🌟 Celestial Beast', price: 150000, type: 'pet', rarity: 'mythic', description: 'A divine creature' },
  
  // ========== BOOSTS ==========
  
  // Common Boosts
  { id: 'xp_boost_small', name: '⭐ Small XP Boost', price: 500, type: 'boost', rarity: 'common', multiplier: 1.5, duration: 1800000, description: '1.5x XP for 30 min' },
  { id: 'coin_boost_small', name: '💰 Small Coin Boost', price: 600, type: 'boost', rarity: 'common', multiplier: 1.5, duration: 1800000, description: '1.5x coins for 30 min' },
  
  // Uncommon Boosts
  { id: 'xp_boost', name: '⭐ XP Boost', price: 1500, type: 'boost', rarity: 'uncommon', multiplier: 2, duration: 3600000, description: '2x XP for 1 hour' },
  { id: 'coin_boost', name: '💰 Coin Boost', price: 1800, type: 'boost', rarity: 'uncommon', multiplier: 2, duration: 3600000, description: '2x coins for 1 hour' },
  
  // Rare Boosts
  { id: 'xp_boost_mega', name: '⭐ Mega XP Boost', price: 5000, type: 'boost', rarity: 'rare', multiplier: 3, duration: 7200000, description: '3x XP for 2 hours' },
  { id: 'coin_boost_mega', name: '💰 Mega Coin Boost', price: 6000, type: 'boost', rarity: 'rare', multiplier: 3, duration: 7200000, description: '3x coins for 2 hours' },
  
  // Epic Boosts
  { id: 'xp_boost_ultra', name: '⭐ Ultra XP Boost', price: 15000, type: 'boost', rarity: 'epic', multiplier: 5, duration: 14400000, description: '5x XP for 4 hours' },
  { id: 'coin_boost_ultra', name: '💰 Ultra Coin Boost', price: 18000, type: 'boost', rarity: 'epic', multiplier: 5, duration: 14400000, description: '5x coins for 4 hours' },
  
  // Legendary Boosts
  { id: 'xp_boost_legendary', name: '⭐ Legendary XP Boost', price: 50000, type: 'boost', rarity: 'legendary', multiplier: 10, duration: 86400000, description: '10x XP for 24 hours' },
  { id: 'coin_boost_legendary', name: '💰 Legendary Coin Boost', price: 60000, type: 'boost', rarity: 'legendary', multiplier: 10, duration: 86400000, description: '10x coins for 24 hours' },
  
  // ========== LOOTBOXES ==========
  
  { id: 'common_box', name: '📦 Common Lootbox', price: 500, type: 'lootbox', rarity: 'common', description: 'Contains common items' },
  { id: 'uncommon_box', name: '📦 Uncommon Lootbox', price: 1500, type: 'lootbox', rarity: 'uncommon', description: 'Contains uncommon items' },
  { id: 'rare_box', name: '📦 Rare Lootbox', price: 5000, type: 'lootbox', rarity: 'rare', description: 'Contains rare items' },
  { id: 'epic_box', name: '📦 Epic Lootbox', price: 15000, type: 'lootbox', rarity: 'epic', description: 'Contains epic items' },
  { id: 'legendary_box', name: '📦 Legendary Lootbox', price: 50000, type: 'lootbox', rarity: 'legendary', description: 'Contains legendary items' },
  { id: 'mythic_box', name: '📦 Mythic Lootbox', price: 150000, type: 'lootbox', rarity: 'mythic', description: 'Contains mythic items' },
];

// Helper functions
export function getItemById(id: string): ShopItem | undefined {
  return shopItems.find(item => item.id === id);
}

export function getItemsByType(type: ShopItem['type']): ShopItem[] {
  return shopItems.filter(item => item.type === type);
}

export function getItemsByRarity(rarity: ShopItem['rarity']): ShopItem[] {
  return shopItems.filter(item => item.rarity === rarity);
}

export function getRarityColor(rarity: ShopItem['rarity']): number {
  const colors = {
    common: 0x9E9E9E,    // Gray
    uncommon: 0x4CAF50,  // Green
    rare: 0x2196F3,      // Blue
    epic: 0x9C27B0,      // Purple
    legendary: 0xFF9800, // Orange
    mythic: 0xFF0000     // Red
  };
  return colors[rarity];
}

export function getRarityEmoji(rarity: ShopItem['rarity']): string {
  const emojis = {
    common: '⚪',
    uncommon: '🟢',
    rare: '🔵',
    epic: '🟣',
    legendary: '🟠',
    mythic: '🔴'
  };
  return emojis[rarity];
}
