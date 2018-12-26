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
    armorOverkillWithHead,
    armorDmg,
    APRDmg,
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
        armorOverkillWithHead,
        armorDmg,
        APRDmg,
      };
    }

    return {
      armor: newBodyArmor,
      helm: newHelm,
      hp: 0,
      usedDmg: pureArmorDmg + armorOverkill,
      armorOverkillWithHead,
      armorDmg,
      APRDmg,
    };
  }

  return {
    armor: newBodyArmor,
    helm: newHelm,
    hp: newHp,
    usedDmg: dmg,
    hasNineLive,
    armorOverkillWithHead,
    armorDmg,
    APRDmg,
  };
};


export const batter = (options) => {
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
  } = options;

  const struckArmorPart = struckPartName === 'head' ? helm : armor;
  const headDmgModifier = struckPartName === 'head' && !hasSteelBrow
    ? 1.5
    : 1;

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
  const armorOverkillWithHead = Math.floor(armorOverkill * headDmgModifier);
  const newHp = hp - Math.max(APRDmg + armorOverkillWithHead, 10);

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


export const batterNimble = (options) => {
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
  } = options;

  const nimbleDmgReduction = getNimbleDmgReduction(totalFtg);
  const struckArmorPart = struckPartName === 'head' ? helm : armor;
  const headDmgModifier = struckPartName === 'head' && !hasSteelBrow
    ? 1.5
    : 1;

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

  const armorOverkillWithHead = Math.floor(armorOverkill * headDmgModifier * nimbleDmgReduction);
  const dmgToHp = Math.max(APRDmg + armorOverkillWithHead, Math.floor(10 * nimbleDmgReduction));
  const newHp = hp - dmgToHp;

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
