import { getBFDmgReduction, getNimbleDmgReduction } from './utils';


const getAfterHit = (options) => {
  const {
    struckPartName,
    armor,
    helm,
    newArmor,
    newHp,
    hasNineLive,
    dmg,
    pureArmorDmg,
    armorOverkill,
  } = options;

  const newBodyArmor = struckPartName === 'head' ? armor : newArmor;
  const newHelm = struckPartName === 'head' ? newArmor : helm;

  if (newHp <= 0) {
    if (hasNineLive) {
      return {
        armor: newBodyArmor,
        helm: newHelm,
        hp: 5,
        usedDmg: dmg,
        hasNineLive: false,
      };
    }

    return {
      armor: newBodyArmor,
      helm: newHelm,
      hp: 0,
      usedDmg: pureArmorDmg + armorOverkill,
    };
  }

  return {
    armor: newBodyArmor,
    helm: newHelm,
    hp: newHp,
    usedDmg: dmg,
    hasNineLive,
  };
};


export const commonCalc = (options) => {
  const {
    armor,
    helm,
    hp,
    struckPartName,
    dmg,
    APRPercent,
    hasSteelBrow,
    hasNineLive,
    hasBattleForged,
    hasChop,
  } = options;

  const struckArmorPart = struckPartName === 'head' ? helm : armor;

  let headDmgModifier;
  if (struckPartName === 'head' && !hasSteelBrow) {
    if (hasChop) {
      headDmgModifier = 2;
    } else {
      headDmgModifier = 1.5;
    }
  } else {
    headDmgModifier = 1;
  }

  const bfModifier = hasBattleForged
    ? getBFDmgReduction(armor, helm)
    : 1;
  const vsAPercent = bfModifier * options.vsAPercent;

  const maxDmgNoPenetrationOverkill = Math.ceil(
    ((hp / headDmgModifier) + struckArmorPart * 0.1) / ((APRPercent + 0.1 * vsAPercent)),
  );
  const maxDmg = Math.min(dmg, maxDmgNoPenetrationOverkill);

  let armorDmg;
  let pureArmorDmg;
  if (struckArmorPart < Math.floor(maxDmg * vsAPercent)) {
    armorDmg = struckArmorPart;
    pureArmorDmg = Math.ceil(struckArmorPart / vsAPercent);
  } else {
    armorDmg = Math.floor(maxDmg * vsAPercent);
    pureArmorDmg = maxDmg;
  }

  const newArmor = struckArmorPart - armorDmg;
  const newArmorDmgReduction = Math.floor(newArmor * 0.1);

  const APRDmg = Math.floor(Math.min(maxDmg, pureArmorDmg) * APRPercent) - newArmorDmgReduction
    |> (x => Math.floor(x * headDmgModifier))
    |> (x => Math.max(x, 0));

  const armorOverkill = Math.min(
    Math.ceil((hp - APRDmg) / headDmgModifier),
    Math.max(dmg - Math.ceil(struckArmorPart / vsAPercent), 0),
  );
  const newHp = hp - APRDmg - Math.floor(armorOverkill * headDmgModifier);

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
  });
};


export const NMBL = (options) => {
  const {
    armor,
    helm,
    hp,
    struckPartName,
    dmg,
    APRPercent,
    vsAPercent,
    hasSteelBrow,
    totalFtg,
    hasNineLive,
    hasChop,
  } = options;

  const nimbleDmgReduction = getNimbleDmgReduction(totalFtg);
  const struckArmorPart = struckPartName === 'head' ? helm : armor;

  let headDmgModifier;
  if (struckPartName === 'head' && !hasSteelBrow) {
    if (hasChop) {
      headDmgModifier = 2;
    } else {
      headDmgModifier = 1.5;
    }
  } else {
    headDmgModifier = 1;
  }

  const maxDmgNoPenetrationOverkill = Math.ceil(
    ((hp / headDmgModifier) + struckArmorPart * 0.1) / ((APRPercent * nimbleDmgReduction + 0.1 * vsAPercent)),
  );

  const maxDmg = Math.min(dmg, maxDmgNoPenetrationOverkill);

  let armorDmg;
  let pureArmorDmg;
  if (struckArmorPart < Math.floor(maxDmg * vsAPercent)) {
    armorDmg = struckArmorPart;
    pureArmorDmg = Math.ceil(struckArmorPart / vsAPercent);
  } else {
    armorDmg = Math.floor(maxDmg * vsAPercent);
    pureArmorDmg = maxDmg;
  }

  const newArmor = struckArmorPart - armorDmg;
  const newArmorDmgReduction = Math.floor(newArmor * 0.1);

  const APRDmg = Math.floor(Math.min(maxDmg, pureArmorDmg) * APRPercent * nimbleDmgReduction) - newArmorDmgReduction
   |> (x => Math.floor(x * headDmgModifier))
   |> (x => Math.max(x, 0));

  const armorOverkill = Math.min(
    Math.ceil((hp - APRDmg) / (headDmgModifier * nimbleDmgReduction)),
    Math.max(dmg - Math.ceil(struckArmorPart / vsAPercent), 0),
  );
  const newHp = hp - APRDmg - Math.floor(armorOverkill * headDmgModifier * nimbleDmgReduction);

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
  });
};
