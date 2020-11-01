import { getBFDmgReduction, getNimbleDmgReduction, getHeadDmgMult } from './utils';

const { max, floor } = Math;

export const commonCalc = options => {
  const {
    hp,
    armor,
    helm,
    struckPartName,
    totalFtg,
    hasSteelBrow,
    hasNineLive,
    hasBattleForged,
    hasNimble,
    hasChop,
    hasBoneArmor,
    hasFurPadding,
    hasHornPlate,
  } = options;

  const dmg =
    hasHornPlate && struckPartName === 'body' ? Math.floor(options.dmg * 0.9) : options.dmg;
  const struckArmorPart = struckPartName === 'head' ? helm : armor;
  const headDmgMult = getHeadDmgMult(struckPartName, hasSteelBrow, hasChop);
  const nimbleDmgMult = hasNimble ? getNimbleDmgReduction(totalFtg) : 1;

  const vsAPercent = hasBattleForged
    ? getBFDmgReduction(armor, helm) * options.vsAPercent
    : options.vsAPercent;
  const APRPercent =
    hasFurPadding && struckPartName === 'body' ? options.APRPercent * 0.66 : options.APRPercent;

  const armorDmg = floor(dmg * vsAPercent);
  const newArmor = max(struckArmorPart - armorDmg, 0);
  const newArmorDmgReduction = floor(newArmor * 0.1);

  const isArmorDestroyed = newArmor === 0;
  if (!isArmorDestroyed && hasBoneArmor && struckPartName === 'body') {
    return {
      hp,
      armor,
      helm,
      armorDmg: 0,
      dmgToHp: 0,
      hasNineLive,
      hasBoneArmor: false,
    };
  }

  const APRDmg = max(floor(dmg * APRPercent * nimbleDmgMult) - newArmorDmgReduction, 0);
  const overflowDmg = floor((dmg - struckArmorPart) * nimbleDmgMult);
  const dmgToHp =
    (isArmorDestroyed ? max(APRDmg, overflowDmg) : APRDmg) |> (v => floor(v * headDmgMult));
  const newHp = hp - dmgToHp;

  const newBodyArmor = struckPartName === 'head' ? armor : newArmor;
  const newHelm = struckPartName === 'head' ? newArmor : helm;
  if (newHp <= 0 && hasNineLive) {
    return {
      hp: 8,
      armor: newBodyArmor,
      helm: newHelm,
      armorDmg,
      dmgToHp,
      hasNineLive: false,
      hasBoneArmor,
    };
  }

  return {
    hp: newHp,
    armor: newBodyArmor,
    helm: newHelm,
    armorDmg,
    dmgToHp,
    hasNineLive,
    hasBoneArmor,
  };
};
