import {
  getBFDmgReduction, getNimbleDmgReduction, getAfterHit, getHeadDmgModifier, getArmorDmgInfo,
} from './utils';


export const commonCalc = (options) => {
  const {
    armor,
    helm,
    hp,
    struckPartName,
    dmg,
    hasSteelBrow,
    hasNineLive,
    hasBattleForged,
    hasChop,
    hasFurPadding,
  } = options;

  const struckArmorPart = struckPartName === 'head' ? helm : armor;
  const headDmgModifier = getHeadDmgModifier(struckPartName, hasSteelBrow, hasChop);

  const bfModifier = hasBattleForged
    ? getBFDmgReduction(armor, helm)
    : 1;
  const vsAPercent = bfModifier * options.vsAPercent;
  const APRPercent = hasFurPadding && struckPartName !== 'head'
    ? options.APRPercent * 0.67
    : options.APRPercent;

  const maxDmgNoPenetrationOverkill = Math.ceil(
    ((hp / headDmgModifier) + struckArmorPart * 0.1) / ((APRPercent + 0.1 * vsAPercent)),
  );
  const maxDmg = Math.min(dmg, maxDmgNoPenetrationOverkill);

  const [armorDmg, pureArmorDmg] = getArmorDmgInfo(struckArmorPart, maxDmg, vsAPercent);
  const newArmor = struckArmorPart - armorDmg;
  const newArmorDmgReduction = Math.floor(newArmor * 0.1);

  const APRDmg = Math.floor(Math.min(maxDmg, pureArmorDmg) * APRPercent) - newArmorDmgReduction
    |> (x => Math.floor(x * headDmgModifier))
    |> (x => Math.max(x, 0));

  const armorOverkill = Math.min(
    Math.ceil((hp - APRDmg) / headDmgModifier),
    Math.max(dmg - Math.ceil(struckArmorPart / vsAPercent), 0),
  );
  const armorOverkillWithHead = Math.floor(armorOverkill * headDmgModifier);
  const newHp = hp - APRDmg - armorOverkillWithHead;

  return getAfterHit({
    struckPartName,
    armor,
    helm,
    newArmor,
    newHp,
    hasNineLive,
    dmg,
    pureArmorDmg,
    armorOverkill,
    armorOverkillWithHead,
    armorDmg,
    APRDmg,
  });
};


export const NMBL = (options) => {
  const {
    armor,
    helm,
    hp,
    struckPartName,
    dmg,
    vsAPercent,
    hasSteelBrow,
    totalFtg,
    hasNineLive,
    hasChop,
    hasFurPadding,
  } = options;

  const nimbleDmgReduction = getNimbleDmgReduction(totalFtg);
  const struckArmorPart = struckPartName === 'head' ? helm : armor;
  const headDmgModifier = getHeadDmgModifier(struckPartName, hasSteelBrow, hasChop);
  const APRPercent = hasFurPadding && struckPartName !== 'head'
    ? options.APRPercent * 0.67
    : options.APRPercent;

  const maxDmgNoPenetrationOverkill = Math.ceil(
    ((hp / headDmgModifier) + struckArmorPart * 0.1) / ((APRPercent * nimbleDmgReduction + 0.1 * vsAPercent)),
  );

  const maxDmg = Math.min(dmg, maxDmgNoPenetrationOverkill);

  const [armorDmg, pureArmorDmg] = getArmorDmgInfo(struckArmorPart, maxDmg, vsAPercent);
  const newArmor = struckArmorPart - armorDmg;
  const newArmorDmgReduction = Math.floor(newArmor * 0.1);

  const APRDmg = Math.floor(Math.min(maxDmg, pureArmorDmg) * APRPercent * nimbleDmgReduction) - newArmorDmgReduction
   |> (x => Math.floor(x * headDmgModifier))
   |> (x => Math.max(x, 0));

  const armorOverkill = Math.min(
    Math.ceil((hp - APRDmg) / (headDmgModifier * nimbleDmgReduction)),
    Math.max(dmg - Math.ceil(struckArmorPart / vsAPercent), 0),
  );
  const armorOverkillWithHead = Math.floor(armorOverkill * headDmgModifier * nimbleDmgReduction);
  const newHp = hp - APRDmg - armorOverkillWithHead;

  return getAfterHit({
    struckPartName,
    armor,
    helm,
    newArmor,
    newHp,
    hasNineLive,
    dmg,
    pureArmorDmg,
    armorOverkill,
    armorOverkillWithHead,
    armorDmg,
    APRDmg,
  });
};
