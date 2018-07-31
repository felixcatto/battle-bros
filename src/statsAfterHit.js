const noPerk = (struckArmorPart, oppositeArmorPart, hp, struckPartName, dmg, APRPercent) => {
  const headDmgModifier = struckPartName === 'head' ? 1.5 : 1;

  const maxAPRDmg = Math.ceil((hp + struckArmorPart * 0.1) / (APRPercent * headDmgModifier + 0.1));
  const armorDmg = Math.min(struckArmorPart, dmg, maxAPRDmg);
  const newArmor = struckArmorPart - armorDmg;
  const newArmorDmgReduction = Math.floor(newArmor * 0.1);

  const APRDmg = Math.max(Math.floor(armorDmg * APRPercent * headDmgModifier) - newArmorDmgReduction, 0);
  const armorOverkill = Math.min(Math.ceil((hp - APRDmg) / headDmgModifier), Math.max(dmg - struckArmorPart, 0));
  const newHp = hp - APRDmg - Math.floor(armorOverkill * headDmgModifier);

  if (newHp <= 0) {
    return {
      struckArmorPart: newArmor,
      hp: 0,
      ehp: armorDmg + armorOverkill,
    };
  }

  return {
    struckArmorPart: newArmor,
    hp: newHp,
    ehp: dmg,
  };
};


const SB_BF = (struckArmorPart, oppositeArmorPart, hp, struckPartName, dmg, APRPercent) => {
  throw new Error('not implemented');
};


const SB = (struckArmorPart, oppositeArmorPart, hp, struckPartName, dmg, APRPercent) => {
  const maxAPRDmg = Math.ceil((hp + struckArmorPart * 0.1) / (APRPercent + 0.1));
  const armorDmg = Math.min(struckArmorPart, dmg, maxAPRDmg);
  const newArmor = struckArmorPart - armorDmg;
  const newArmorDmgReduction = Math.floor(newArmor * 0.1);

  const APRDmg = Math.max(Math.floor(armorDmg * APRPercent) - newArmorDmgReduction, 0);
  const armorOverkill = Math.max(Math.min(hp - APRDmg, Math.max(dmg - struckArmorPart, 0)), 0);
  const newHp = hp - APRDmg - armorOverkill;

  if (newHp <= 0) {
    return {
      struckArmorPart: newArmor,
      hp: 0,
      ehp: armorDmg + armorOverkill,
    };
  }

  return {
    struckArmorPart: newArmor,
    hp: newHp,
    ehp: dmg,
  };
};


const BF = (struckArmorPart, oppositeArmorPart, hp, struckPartName, dmg, APRPercent) => {
  throw new Error('not implemented');
};


export default (options) => {
  const {
    hasBattleForged,
    hasSteelBrow,
  } = options;
  if (hasSteelBrow && hasBattleForged) {
    return SB_BF;
  } else if (hasSteelBrow) {
    return SB;
  } else if (hasBattleForged) {
    return BF;
  } else {
    return noPerk;
  }
};
