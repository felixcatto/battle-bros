const rawWeaponsList = [
  {
    name: 'Dagger',
    dmg: '15-35',
    armorPiercingPercent: 0.2,
    vsArmorPercent: 0.6,
    hasPuncture: true,
    attacksPerRound: 3,
  },
  {
    name: 'Notched Blade',
    dmg: '20-30',
    armorPiercingPercent: 0.2,
    vsArmorPercent: 0.6,
    hasPuncture: true,
    attacksPerRound: 3,
  },
  {
    name: 'Rondel Dagger',
    dmg: '20-40',
    armorPiercingPercent: 0.2,
    vsArmorPercent: 0.7,
    hasPuncture: true,
    attacksPerRound: 3,
  },
  {
    name: 'Qatal Dagger',
    dmg: '30-45',
    armorPiercingPercent: 0.2,
    vsArmorPercent: 0.7,
    isIncludedToAllCalc: true,
    useDoubleGrip: true,
    attacksPerRound: 3,
  },
  {
    name: 'Shortsword',
    dmg: '30-40',
    armorPiercingPercent: 0.2,
    vsArmorPercent: 0.75,
    attacksPerRound: 2,
  },
  {
    name: 'Saif',
    dmg: '35-40',
    armorPiercingPercent: 0.2,
    vsArmorPercent: 0.65,
    attacksPerRound: 2,
  },
  {
    name: 'Falchion',
    dmg: '35-45',
    armorPiercingPercent: 0.2,
    vsArmorPercent: 0.7,
    attacksPerRound: 2,
  },
  {
    name: 'Ancient Sword (Ancient Dead)',
    dmg: '38-43',
    armorPiercingPercent: 0.2,
    vsArmorPercent: 0.8,
    attacksPerRound: 2,
  },
  {
    name: 'Arming Sword',
    dmg: '40-45',
    armorPiercingPercent: 0.2,
    vsArmorPercent: 0.8,
    attacksPerRound: 2,
  },
  {
    name: 'Shamshir',
    dmg: '45-50',
    armorPiercingPercent: 0.2,
    vsArmorPercent: 0.75,
    attacksPerRound: 2,
  },
  {
    name: 'Noble Sword',
    dmg: '45-50',
    armorPiercingPercent: 0.2,
    vsArmorPercent: 0.85,
    attacksPerRound: 2,
    isIncludedToAllCalc: true,
    useDoubleGrip: true,
  },
  {
    name: 'Fencing Sword',
    dmg: '35-50',
    armorPiercingPercent: 0.2,
    vsArmorPercent: 0.75,
    attacksPerRound: 2,
  },
  {
    name: 'Warbrand',
    dmg: '50-75',
    armorPiercingPercent: 0.2,
    vsArmorPercent: 0.75,
    chanceToHitHead: 0.3,
    attacksPerRound: 2,
  },
  {
    name: 'Rhomphaia',
    dmg: '45-65',
    armorPiercingPercent: 0.2,
    vsArmorPercent: 1,
    chanceToHitHead: 0.3,
    attacksPerRound: 2,
  },
  {
    name: 'Longsword (overhead)',
    dmg: '85-105',
    armorPiercingPercent: 0.25,
    vsArmorPercent: 1,
    chanceToHitHead: 0.3,
  },
  {
    name: 'Greatsword (overhead)',
    dmg: '105-120',
    armorPiercingPercent: 0.25,
    vsArmorPercent: 1,
    chanceToHitHead: 0.3,
    isIncludedToAllCalc: true,
  },
  {
    name: 'Greatsword (split)',
    dmg: '85-100',
    armorPiercingPercent: 0.3,
    vsArmorPercent: 1,
    chanceToHitHead: 0.3,
  },
  {
    name: 'Greatsword (swing)',
    dmg: '85-100',
    armorPiercingPercent: 0.25,
    vsArmorPercent: 1,
    chanceToHitHead: 0.3,
  },
  {
    name: 'Claw Club',
    dmg: '20-30',
    armorPiercingPercent: 0.5,
    vsArmorPercent: 0.75,
    attacksPerRound: 2,
  },
  {
    name: 'Bludgeon',
    dmg: '20-35',
    armorPiercingPercent: 0.4,
    vsArmorPercent: 0.75,
    attacksPerRound: 2,
  },
  {
    name: 'Nomad Mace',
    dmg: '25-35',
    armorPiercingPercent: 0.4,
    vsArmorPercent: 0.9,
    attacksPerRound: 2,
  },
  {
    name: 'Light Southern Mace',
    dmg: '30-40',
    armorPiercingPercent: 0.4,
    vsArmorPercent: 1.1,
    attacksPerRound: 2,
  },
  {
    name: 'Morning Star',
    dmg: '30-45',
    armorPiercingPercent: 0.4,
    vsArmorPercent: 1,
    attacksPerRound: 2,
  },
  {
    name: 'Heavy Southern Mace',
    dmg: '35-50',
    armorPiercingPercent: 0.4,
    vsArmorPercent: 1.2,
    attacksPerRound: 2,
  },
  {
    name: 'Winged Mace',
    dmg: '35-55',
    armorPiercingPercent: 0.4,
    vsArmorPercent: 1.1,
    attacksPerRound: 2,
    isIncludedToAllCalc: true,
    useDoubleGrip: true,
  },
  {
    name: 'Two-handed Mace',
    dmg: '70-95',
    armorPiercingPercent: 0.5,
    vsArmorPercent: 1.15,
  },
  {
    name: 'Two-Handed Flanged Mace',
    dmg: '95-115',
    armorPiercingPercent: 0.5,
    vsArmorPercent: 1.25,
    isIncludedToAllCalc: true,
  },
  {
    name: 'Militia Spear',
    dmg: '25-30',
    armorPiercingPercent: 0.25,
    vsArmorPercent: 0.9,
    attacksPerRound: 2,
  },
  {
    name: 'Boar Spear',
    dmg: '30-35',
    armorPiercingPercent: 0.25,
    vsArmorPercent: 0.95,
    attacksPerRound: 2,
  },
  {
    name: 'Fire Lance',
    dmg: '30-35',
    armorPiercingPercent: 0.25,
    vsArmorPercent: 1.1,
    attacksPerRound: 2,
  },
  {
    name: 'Fighting Spear',
    dmg: '35-40',
    armorPiercingPercent: 0.25,
    vsArmorPercent: 1,
    attacksPerRound: 2,
  },
  {
    name: 'Goedendag',
    dmg: '45-75',
    armorPiercingPercent: 0.25,
    vsArmorPercent: 1,
  },
  {
    name: 'Spetum',
    dmg: '55-75',
    armorPiercingPercent: 0.25,
    vsArmorPercent: 1,
    chanceToHitHead: 0.3,
  },
  {
    name: 'Hatchet',
    dmg: '25-40',
    armorPiercingPercent: 0.3,
    vsArmorPercent: 1.1,
    attacksPerRound: 2,
    hasChop: true,
  },
  {
    name: 'Crude Axe (barb)',
    dmg: '30-40',
    armorPiercingPercent: 0.4,
    vsArmorPercent: 1.2,
    attacksPerRound: 2,
    hasChop: true,
  },
  {
    name: 'Handaxe',
    dmg: '30-45',
    armorPiercingPercent: 0.3,
    vsArmorPercent: 1.2,
    attacksPerRound: 2,
    hasChop: true,
  },
  {
    name: 'Axehammer (barb)',
    dmg: '20-30',
    armorPiercingPercent: 0.6,
    vsArmorPercent: 2,
    attacksPerRound: 2,
    hasBatter: true,
  },
  {
    name: 'Fighting Axe',
    dmg: '35-55',
    armorPiercingPercent: 0.3,
    vsArmorPercent: 1.3,
    attacksPerRound: 2,
    hasChop: true,
    isIncludedToAllCalc: true,
    useDoubleGrip: true,
  },
  {
    name: 'Head Splitter (Orc)',
    dmg: '35-65',
    armorPiercingPercent: 0.3,
    vsArmorPercent: 1.3,
    attacksPerRound: 2,
    hasChop: true,
  },
  {
    name: "Woodcutter's Axe",
    dmg: '35-70',
    armorPiercingPercent: 0.4,
    vsArmorPercent: 1.25,
    hasSplitMan: true,
  },
  {
    name: 'Bardiche',
    dmg: '75-95',
    armorPiercingPercent: 0.4,
    vsArmorPercent: 1.3,
    hasSplitMan: true,
  },
  {
    name: 'Bardiche (split)',
    dmg: '75-95',
    armorPiercingPercent: 0.3,
    vsArmorPercent: 1.3,
  },
  {
    name: 'Heavy Rusty Axe (barb)',
    dmg: '75-90',
    armorPiercingPercent: 0.5,
    vsArmorPercent: 1.5,
    hasSplitMan: true,
  },
  {
    name: 'Greataxe',
    dmg: '80-100',
    armorPiercingPercent: 0.4,
    vsArmorPercent: 1.5,
    hasSplitMan: true,
    isIncludedToAllCalc: true,
  },
  {
    name: 'Man Splitter (Orc)',
    dmg: '90-120',
    armorPiercingPercent: 0.4,
    vsArmorPercent: 1.6,
    hasSplitMan: true,
  },
  {
    name: 'Flail',
    dmg: '25-55',
    armorPiercingPercent: 0.3,
    vsArmorPercent: 1,
    chanceToHitHead: 0.35,
    attacksPerRound: 2,
  },
  {
    name: 'Three-Headed Flail',
    dmg: '30-75',
    armorPiercingPercent: 0.3,
    vsArmorPercent: 1,
    chanceToHitHead: 0.35,
    attacksPerRound: 2,
    hasTHFlail: true,
    isIncludedToAllCalc: true,
    useDoubleGrip: true,
  },
  {
    name: 'Two-handed Flail',
    dmg: '60-100',
    armorPiercingPercent: 0.4,
    vsArmorPercent: 1.1,
    chanceToHitHead: 0.4,
  },
  {
    name: 'Berserk Chain (Pound)',
    dmg: '60-120',
    armorPiercingPercent: 0.4,
    vsArmorPercent: 1.25,
    chanceToHitHead: 0.4,
  },
  {
    name: 'Blunt Cleaver (barb)',
    dmg: '30-40',
    armorPiercingPercent: 0.35,
    vsArmorPercent: 0.8,
    attacksPerRound: 2,
  },
  {
    name: 'Scramasax',
    dmg: '30-45',
    armorPiercingPercent: 0.25,
    vsArmorPercent: 0.8,
    attacksPerRound: 2,
  },
  {
    name: 'Military Cleaver',
    dmg: '40-60',
    armorPiercingPercent: 0.25,
    vsArmorPercent: 0.9,
    attacksPerRound: 2,
    isIncludedToAllCalc: true,
    useDoubleGrip: true,
  },
  {
    name: 'Head Chopper (Orc)',
    dmg: '40-70',
    armorPiercingPercent: 0.25,
    vsArmorPercent: 1.1,
    attacksPerRound: 2,
  },
  {
    name: 'Khopesh (Ancient Dead)',
    dmg: '35-55',
    armorPiercingPercent: 0.25,
    vsArmorPercent: 1.2,
    attacksPerRound: 2,
  },
  {
    name: 'Crypt Cleaver (Ancient Dead)',
    dmg: '60-80',
    armorPiercingPercent: 0.25,
    vsArmorPercent: 1.2,
    attacksPerRound: 2,
    isIncludedToAllCalc: true,
  },
  {
    name: 'Rusty Warblade (barb)',
    dmg: '60-80',
    armorPiercingPercent: 0.35,
    vsArmorPercent: 1.1,
    attacksPerRound: 2,
  },
  {
    name: 'Two-Handed Scimitar',
    dmg: '65-85',
    armorPiercingPercent: 0.25,
    vsArmorPercent: 1.1,
    attacksPerRound: 2,
  },
  {
    name: 'Military Pick',
    dmg: '20-35',
    armorPiercingPercent: 0.5,
    vsArmorPercent: 2,
    attacksPerRound: 2,
    hasBatter: true,
  },
  {
    name: 'Warhammer',
    dmg: '30-40',
    armorPiercingPercent: 0.5,
    vsArmorPercent: 2.25,
    attacksPerRound: 2,
    hasBatter: true,
    isIncludedToAllCalc: true,
    useDoubleGrip: true,
  },
  {
    name: 'Two-Handed Hammer (Smite)',
    dmg: '80-110',
    armorPiercingPercent: 0.5,
    vsArmorPercent: 2,
    isIncludedToAllCalc: true,
  },
  {
    name: 'Two-Handed Hammer (Shatter3)',
    dmg: '60-90',
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
    dmg: '55-85',
    armorPiercingPercent: 0.3,
    vsArmorPercent: 1.4,
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
    name: 'Polehammer',
    dmg: '50-75',
    armorPiercingPercent: 0.5,
    vsArmorPercent: 1.85,
    chanceToHitHead: 0.3,
    hasBatter: true,
  },
  {
    name: 'Polemace',
    dmg: '60-75',
    armorPiercingPercent: 0.4,
    vsArmorPercent: 1.2,
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
    name: 'Warscythe (Ancient Dead)',
    dmg: '55-80',
    armorPiercingPercent: 0.3,
    vsArmorPercent: 1.05,
  },
  {
    name: 'Swordlance',
    dmg: '60-80',
    armorPiercingPercent: 0.3,
    vsArmorPercent: 0.9,
  },
  {
    name: 'Bundle of Javelins',
    dmg: '30-45',
    armorPiercingPercent: 0.45,
    vsArmorPercent: 0.75,
    attacksPerRound: 2,
  },
  {
    name: 'Bundle of Heavy Javelins (barb)',
    dmg: '35-50',
    armorPiercingPercent: 0.45,
    vsArmorPercent: 0.8,
    attacksPerRound: 2,
  },
  {
    name: 'Bundle of Throwing Axes',
    dmg: '25-40',
    armorPiercingPercent: 0.25,
    vsArmorPercent: 1.1,
    chanceToHitHead: 0.3,
    attacksPerRound: 2,
  },
  {
    name: 'Bundle of Heavy Axes (barb)',
    dmg: '30-50',
    armorPiercingPercent: 0.25,
    vsArmorPercent: 1.15,
    chanceToHitHead: 0.3,
    attacksPerRound: 2,
  },
  {
    name: 'Nomad Sling',
    dmg: '35-50',
    armorPiercingPercent: 0.35,
    vsArmorPercent: 0.6,
    attacksPerRound: 2,
  },
  {
    name: 'Reinforced Boondock Bow (Goblin)',
    dmg: '30-50',
    armorPiercingPercent: 0.35,
    vsArmorPercent: 0.6,
    attacksPerRound: 2,
  },
  {
    name: 'Hunting Bow',
    dmg: '40-60',
    armorPiercingPercent: 0.35,
    vsArmorPercent: 0.55,
    attacksPerRound: 2,
  },
  {
    name: 'Composite Bow',
    dmg: '40-55',
    armorPiercingPercent: 0.35,
    vsArmorPercent: 0.7,
    attacksPerRound: 2,
  },
  {
    name: 'War Bow',
    dmg: '50-70',
    armorPiercingPercent: 0.35,
    vsArmorPercent: 0.6,
    attacksPerRound: 2,
  },
  {
    name: 'Crossbow',
    dmg: '40-60',
    armorPiercingPercent: 0.7,
    vsArmorPercent: 0.7,
    hasCrossbowMastery: true,
  },
  {
    name: 'Heavy Crossbow',
    dmg: '50-70',
    armorPiercingPercent: 0.7,
    vsArmorPercent: 0.75,
    hasCrossbowMastery: true,
  },
  {
    name: 'Handgonne',
    dmg: '35-75',
    armorPiercingPercent: 0.25,
    vsArmorPercent: 1,
  },
  {
    name: 'Direwolf (bite)',
    dmg: '30-50',
    armorPiercingPercent: 0.2,
    vsArmorPercent: 0.7,
    attacksPerRound: 3,
  },
  {
    name: 'Frenzied Direwolf (bite)',
    dmg: '30-50',
    armorPiercingPercent: 0.2,
    vsArmorPercent: 0.7,
    dmgMult: 1.25,
    attacksPerRound: 3,
  },
  {
    name: 'Hyena (bite)',
    dmg: '20-35',
    armorPiercingPercent: 0.35,
    vsArmorPercent: 1,
    attacksPerRound: 3,
  },
  {
    name: 'Frenzied Hyena (bite)',
    dmg: '20-35',
    armorPiercingPercent: 0.35,
    vsArmorPercent: 1,
    dmgMult: 1.25,
    attacksPerRound: 3,
  },
  {
    name: 'Serpent (bite)',
    dmg: '50-70',
    armorPiercingPercent: 0.3,
    vsArmorPercent: 0.75,
  },
  {
    name: 'Unhold (Sweep)',
    dmg: '40-80',
    armorPiercingPercent: 0.4,
    vsArmorPercent: 0.8,
    dmgMult: 1.1,
  },
  {
    name: 'Schrat (Uproot)',
    dmg: '70-100',
    armorPiercingPercent: 0.5,
    vsArmorPercent: 0.85,
  },
  {
    name: 'Lindwurm (Gorge)',
    dmg: '80-140',
    armorPiercingPercent: 0.4,
    vsArmorPercent: 1.5,
  },
  {
    name: 'Lindwurm (Tail Slam)',
    dmg: '60-120',
    armorPiercingPercent: 0.5,
    vsArmorPercent: 1.5,
  },
];

const weaponsList = rawWeaponsList.map(el => ({
  ...el,
  minDmg: Number(el.dmg.split('-')[0]),
  maxDmg: Number(el.dmg.split('-')[1]),
  chanceToHitHead: el.chanceToHitHead ? el.chanceToHitHead : 0.25,
  dmgMult: el.dmgMult ? el.dmgMult : 1,
  attacksPerRound: el.attacksPerRound ? el.attacksPerRound : 1,
  hasSplitMan: Boolean(el.hasSplitMan),
  hasCrossbowMastery: Boolean(el.hasCrossbowMastery),
  hasChop: Boolean(el.hasChop),
  hasBatter: Boolean(el.hasBatter),
  hasPuncture: Boolean(el.hasPuncture),
  hasTHFlail: Boolean(el.hasTHFlail),
  isIncludedToAllCalc: Boolean(el.isIncludedToAllCalc),
  useDoubleGrip: Boolean(el.useDoubleGrip),
}));

const rawCharacterList = [
  {
    characterName: 'Heavy Bro',
    startHp: 70,
    startArmor: 320,
    startHelm: 300,
    hasBattleForged: true,
  },
  {
    characterName: 'Light Bro',
    startHp: 100,
    startArmor: 110,
    startHelm: 120,
    hasNimble: true,
    totalFtg: 15,
  },
  {
    characterName: 'Brigand Raider',
    startHp: 75,
    startArmor: 95,
    startHelm: 110,
  },
  {
    characterName: 'Barbarian Chosen',
    startHp: 130,
    startArmor: 230,
    startHelm: 160,
  },
  {
    characterName: 'Ancient Legionary',
    startHp: 55,
    startArmor: 125,
    startHelm: 130,
    hasSteelBrow: true,
  },
  {
    characterName: 'Ancient Honor Guard',
    startHp: 65,
    startArmor: 210,
    startHelm: 180,
    hasSteelBrow: true,
  },
  {
    characterName: 'Goblin Skirmisher (max armor)',
    startHp: 40,
    startArmor: 90,
    startHelm: 90,
  },
  {
    characterName: 'Goblin Ambusher',
    startHp: 40,
    startArmor: 35,
    startHelm: 25,
  },
  {
    characterName: 'Goblin Wolfrider (max armor)',
    startHp: 60,
    startArmor: 90,
    startHelm: 90,
  },
  {
    characterName: 'Orc Young',
    startHp: 125,
    startArmor: 80,
    startHelm: 60,
  },
  {
    characterName: 'Orc Warrior',
    startHp: 200,
    startArmor: 300,
    startHelm: 300,
  },
  {
    characterName: 'Orc Warlord',
    startHp: 300,
    startArmor: 500,
    startHelm: 300,
  },
  {
    characterName: 'Webknecht',
    startHp: 60,
    startArmor: 20,
    startHelm: 20,
  },
  {
    characterName: 'Serpent',
    startHp: 130,
    startArmor: 40,
    startHelm: 40,
  },
  {
    characterName: 'Ifrit Small',
    startHp: 110,
    startArmor: 110,
    startHelm: 0,
  },
  {
    characterName: 'Ifrit Medium',
    startHp: 220,
    startArmor: 220,
    startHelm: 0,
  },
  {
    characterName: 'Ifrit Large',
    startHp: 440,
    startArmor: 440,
    startHelm: 0,
  },
  {
    characterName: 'Unhold',
    startHp: 500,
    startArmor: 0,
    startHelm: 0,
    hasSteelBrow: true,
  },
  {
    characterName: 'Schrat',
    startHp: 600,
    startArmor: 0,
    startHelm: 0,
    hasSteelBrow: true,
  },
  {
    characterName: 'Armored Frost Unhold',
    startHp: 600,
    startArmor: 490,
    startHelm: 490,
    hasSteelBrow: true,
  },
  {
    characterName: 'Lindwyrm',
    startHp: 900,
    startArmor: 400,
    startHelm: 200,
  },
];

const characterList = rawCharacterList.map(el => ({
  ...el,
  hasSteelBrow: Boolean(el.hasSteelBrow),
  hasBattleForged: Boolean(el.hasBattleForged),
  hasNimble: Boolean(el.hasNimble),
  hasColossus: Boolean(el.hasColossus),
  totalFtg: el.totalFtg ? el.totalFtg : 0,
  hasLindwurmCloak: false,
  hasFurPadding: false,
  hasBoneArmor: false,
}));

const dmgMultiplierList = [
  {
    label: 'Killing Frenzy',
    value: 1.25,
  },
  {
    label: 'Throwing Mastery R2',
    value: 1.4,
  },
  {
    label: 'Throwing Mastery R3',
    value: 1.2,
  },
  {
    label: 'Indomitable',
    value: 0.5,
  },
  {
    label: 'Huge',
    value: 1.1,
  },
  {
    label: 'Orc Warrior',
    value: 1.15,
  },
];

export { weaponsList, characterList, dmgMultiplierList };
