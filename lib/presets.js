const rawWeaponsList = [
  {
    name: 'Knife',
    dmg: '15-25',
    armorPiercingPercent: 0.2,
    vsArmorPercent: 0.5,
  },
  {
    name: 'Dagger',
    dmg: '15-35',
    armorPiercingPercent: 0.2,
    vsArmorPercent: 0.6,
  },
  {
    name: 'Rondel Dagger',
    dmg: '20-40',
    armorPiercingPercent: 0.2,
    vsArmorPercent: 0.7,
  },
  {
    name: 'Shortsword',
    dmg: '30-40',
    armorPiercingPercent: 0.2,
    vsArmorPercent: 0.75,
  },
  {
    name: 'Falchion',
    dmg: '35-45',
    armorPiercingPercent: 0.2,
    vsArmorPercent: 0.7,
  },
  {
    name: 'Arming Sword',
    dmg: '40-45',
    armorPiercingPercent: 0.2,
    vsArmorPercent: 0.8,
  },
  {
    name: 'Noble Sword',
    dmg: '45-50',
    armorPiercingPercent: 0.2,
    vsArmorPercent: 0.85,
  },
  {
    name: 'Ancient Sword',
    dmg: '38-43',
    armorPiercingPercent: 0.2,
    vsArmorPercent: 0.8,
  },
  {
    name: 'Warbrand',
    dmg: '50-75',
    armorPiercingPercent: 0.2,
    vsArmorPercent: 0.75,
    chanceToHitHead: 0.3,
  },
  {
    name: 'Greatsword (overhead)',
    dmg: '105-130',
    armorPiercingPercent: 0.25,
    vsArmorPercent: 1,
    chanceToHitHead: 0.3,
  },
  {
    name: 'Rhomphaia',
    dmg: '45-65',
    armorPiercingPercent: 0.2,
    vsArmorPercent: 1,
    chanceToHitHead: 0.3,
  },
  {
    name: 'Morning Star',
    dmg: '30-45',
    armorPiercingPercent: 0.4,
    vsArmorPercent: 1,
  },
  {
    name: 'Winged Mace',
    dmg: '35-55',
    armorPiercingPercent: 0.4,
    vsArmorPercent: 1.1,
  },
  {
    name: 'Two-Handed Flanged Mace',
    dmg: '75-95',
    armorPiercingPercent: 0.5,
    vsArmorPercent: 1.25,
  },
  {
    name: 'Boar Spear',
    dmg: '30-35',
    armorPiercingPercent: 0.25,
    vsArmorPercent: 0.95,
  },
  {
    name: 'Fighting Spear',
    dmg: '35-40',
    armorPiercingPercent: 0.25,
    vsArmorPercent: 1,
  },
  {
    name: 'Handaxe',
    dmg: '30-45',
    armorPiercingPercent: 0.3,
    vsArmorPercent: 1.2,
  },
  {
    name: 'Fighting Axe',
    dmg: '35-55',
    armorPiercingPercent: 0.3,
    vsArmorPercent: 1.3,
  },
  {
    name: 'Head Splitter (Orc)',
    dmg: '35-65',
    armorPiercingPercent: 0.3,
    vsArmorPercent: 1.3,
  },
  {
    name: 'Flail',
    dmg: '25-55',
    armorPiercingPercent: 0.3,
    vsArmorPercent: 1,
    chanceToHitHead: 0.35,
  },
  {
    name: 'Berserk Chain (Pound)',
    dmg: '60-120',
    armorPiercingPercent: 0.3,
    vsArmorPercent: 1.25,
    chanceToHitHead: 0.4,
  },
  {
    name: 'Scramasax',
    dmg: '30-45',
    armorPiercingPercent: 0.25,
    vsArmorPercent: 0.8,
  },
  {
    name: 'Military Cleaver',
    dmg: '40-60',
    armorPiercingPercent: 0.25,
    vsArmorPercent: 0.9,
  },
  {
    name: 'Head Chopper (Orc)',
    dmg: '40-70',
    armorPiercingPercent: 0.25,
    vsArmorPercent: 1.1,
  },
  {
    name: 'Khopesh (Ancient Dead)',
    dmg: '35-55',
    armorPiercingPercent: 0.25,
    vsArmorPercent: 1.2,
  },
  {
    name: 'Crypt Cleaver (Ancient Dead)',
    dmg: '65-85',
    armorPiercingPercent: 0.25,
    vsArmorPercent: 1.15,
  },
  {
    name: 'Military Pick',
    dmg: '20-35',
    armorPiercingPercent: 0.5,
    vsArmorPercent: 2,
  },
  {
    name: 'Warhammer',
    dmg: '30-40',
    armorPiercingPercent: 0.5,
    vsArmorPercent: 2.25,
  },
  {
    name: 'Two-Handed Hammer (Smite)',
    dmg: '80-110',
    armorPiercingPercent: 0.5,
    vsArmorPercent: 2,
  },
  {
    name: 'Pike',
    dmg: '60-80',
    armorPiercingPercent: 0.3,
    vsArmorPercent: 1,
    chanceToHitHead: 0.3,
  },
  {
    name: 'Billhook',
    dmg: '60-90',
    armorPiercingPercent: 0.3,
    vsArmorPercent: 1.5,
    chanceToHitHead: 0.3,
  },
  {
    name: 'Longaxe',
    dmg: '70-95',
    armorPiercingPercent: 0.3,
    vsArmorPercent: 1.1,
    chanceToHitHead: 0.3,
  },
  {
    name: 'Jagged Pike (Goblin)',
    dmg: '50-70',
    armorPiercingPercent: 0.25,
    vsArmorPercent: 0.9,
    chanceToHitHead: 0.3,
  },
  {
    name: 'Bladed Pike (Ancient Dead)',
    dmg: '55-80',
    armorPiercingPercent: 0.3,
    vsArmorPercent: 1.25,
    chanceToHitHead: 0.3,
  },
  {
    name: 'Bundle of Javelins',
    dmg: '30-45',
    armorPiercingPercent: 0.45,
    vsArmorPercent: 0.75,
  },
  {
    name: 'Bundle of Throwing Axes',
    dmg: '25-40',
    armorPiercingPercent: 0.25,
    vsArmorPercent: 1.1,
    chanceToHitHead: 0.3,
  },
  {
    name: 'Hunting Bow',
    dmg: '40-60',
    armorPiercingPercent: 0.35,
    vsArmorPercent: 0.65,
  },
  {
    name: 'War Bow',
    dmg: '50-70',
    armorPiercingPercent: 0.35,
    vsArmorPercent: 0.65,
  },
  {
    name: 'Reinforced Boondock Bow (Goblin)',
    dmg: '25-40',
    armorPiercingPercent: 0.35,
    vsArmorPercent: 0.65,
  },
  {
    name: 'Crossbow',
    dmg: '40-60',
    armorPiercingPercent: 0.5,
    vsArmorPercent: 0.7,
  },
  {
    name: 'Heavy Crossbow',
    dmg: '50-70',
    armorPiercingPercent: 0.5,
    vsArmorPercent: 0.75,
  },
];

const weaponsList = rawWeaponsList.map(el => ({
  ...el,
  dmgPerHit: el.dmg
    .split('-')
    .map(dmg => Number(dmg))
    .reduce((a, b) => a + b, 0)
    |> (x => Math.round(x / 2)),
  chanceToHitHead: el.chanceToHitHead
    ? el.chanceToHitHead
    : 0.25,
}));

const characterList = [
  {
    characterName: 'Heavy Bro',
    startHp: 65,
    startArmor: 320,
    startHelm: 300,
    hasSteelBrow: false,
    hasBattleForged: true,
    hasNimble: false,
  },
  {
    characterName: 'Light Bro',
    startHp: 125,
    startArmor: 30,
    startHelm: 40,
    hasSteelBrow: false,
    hasBattleForged: false,
    hasNimble: true,
  },
  {
    characterName: 'Brigand Raider',
    startHp: 75,
    startArmor: 95,
    startHelm: 110,
    hasSteelBrow: false,
    hasBattleForged: false,
    hasNimble: false,
  },
  {
    characterName: 'Ancient Legionary',
    startHp: 55,
    startArmor: 125,
    startHelm: 130,
    hasSteelBrow: true,
    hasBattleForged: false,
    hasNimble: false,
  },
  {
    characterName: 'Ancient Honor Guard',
    startHp: 70,
    startArmor: 210,
    startHelm: 180,
    hasSteelBrow: true,
    hasBattleForged: false,
    hasNimble: false,
  },
  {
    characterName: 'Orc Warrior',
    startHp: 200,
    startArmor: 300,
    startHelm: 300,
    hasSteelBrow: false,
    hasBattleForged: false,
    hasNimble: false,
  },
  {
    characterName: 'Orc Warlord',
    startHp: 300,
    startArmor: 500,
    startHelm: 300,
    hasSteelBrow: false,
    hasBattleForged: false,
    hasNimble: false,
  },
];

export {
  weaponsList,
  characterList,
};