import { getBFDmgReduction, getNimbleDmgReduction, getHeadDmgMult } from './utils';

const { max, min, floor, ceil } = Math;

export const batter = options => {
  const {
    hp,
    armor,
    helm,
    struckPartName,
    dmg,
    totalFtg,
    hasSteelBrow,
    hasNineLive,
    hasBattleForged,
    hasChop,
    hasFurPadding,
    hasNimble,
  } = options;

  const struckArmorPart = struckPartName === 'head' ? helm : armor;
  const headDmgMult = getHeadDmgMult(struckPartName, hasSteelBrow, hasChop);
  const nimbleDmgMult = hasNimble ? getNimbleDmgReduction(totalFtg) : 1;

  const vsAPercent = hasBattleForged
    ? getBFDmgReduction(armor, helm) * options.vsAPercent
    : options.vsAPercent;
  const APRPercent =
    hasFurPadding && struckPartName !== 'head' ? options.APRPercent * 0.67 : options.APRPercent;

  const armorDmg = floor(dmg * vsAPercent);
  const newArmor = max(struckArmorPart - armorDmg, 0);
  const newArmorDmgReduction = floor(newArmor * 0.1);
  const APRDmg = max(floor(dmg * APRPercent * nimbleDmgMult) - newArmorDmgReduction, 0);

  const isArmorDestroyed = newArmor === 0;
  const overflowDmg = floor((dmg - struckArmorPart) * nimbleDmgMult);
  const dmgToHp =
    (isArmorDestroyed ? max(APRDmg, overflowDmg) : APRDmg) |> (v => floor(v * headDmgMult));
  // is Batter increased if hit head: no?
  // is Batter decreased if hasNimble: yes?
  const newHp = hp - max(dmgToHp, 10 * nimbleDmgMult); // Only difference between commonCalc

  const newBodyArmor = struckPartName === 'head' ? armor : newArmor;
  const newHelm = struckPartName === 'head' ? newArmor : helm;
  if (newHp <= 0 && hasNineLive) {
    return {
      hp: 8,
      armor: newBodyArmor,
      helm: newHelm,
      hasNineLive: false,
      armorDmg,
      dmgToHp,
    };
  }

  return {
    hp: newHp,
    armor: newBodyArmor,
    helm: newHelm,
    hasNineLive,
    armorDmg,
    dmgToHp,
  };
};
