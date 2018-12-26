import { getBFDmgReduction, getNimbleDmgReduction } from './utils';


const getStatsAfterHitCommon = (options) => {
  const {
    armor,
    helm,
    hp,
    struckPartName,
    dmg,
    APRPercent,
    hasSteelBrow,
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
    (hp + struckArmorPart * 0.1) / ((APRPercent * headDmgModifier + 0.1 * vsAPercent)),
  );
  const maxDmg = Math.min(dmg, maxDmgNoPenetrationOverkill);

  let armorDmg;
  let pureArmorDmg;
  if (struckArmorPart < Math.floor(maxDmg * vsAPercent))  {
    armorDmg = struckArmorPart;
    pureArmorDmg = Math.ceil(struckArmorPart / vsAPercent);
  } else {
    armorDmg = Math.floor(maxDmg * vsAPercent);
    pureArmorDmg = maxDmg;
  }

  const newArmor = struckArmorPart - armorDmg;
  const newArmorDmgReduction = Math.floor(newArmor * 0.1);

  const APRDmg = Math.floor(Math.min(maxDmg, pureArmorDmg) * APRPercent * headDmgModifier) - newArmorDmgReduction
    |> (x => Math.max(x, 0));

  const armorOverkill = Math.min(
    Math.ceil((hp - APRDmg) / headDmgModifier),
    Math.max(dmg - Math.ceil(struckArmorPart / vsAPercent), 0),
  );
  const newHp = hp - APRDmg - Math.floor(armorOverkill * headDmgModifier);

  const newBodyArmor = struckPartName === 'head' ? armor : newArmor;
  const newHelm = struckPartName === 'head' ? newArmor : helm;

  return {
    newHp,
    newBodyArmor,
    newHelm,
    pureArmorDmg,
    armorOverkill,
  };
};


const getStatsAfterHitNimble = (options) => {
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
  } = options;

  const nimbleDmgReduction = getNimbleDmgReduction(totalFtg);
  const struckArmorPart = struckPartName === 'head' ? helm : armor;
  const headDmgModifier = struckPartName === 'head' && !hasSteelBrow
    ? 1.5
    : 1;

  const maxDmgNoPenetrationOverkill = Math.ceil(
    (hp + struckArmorPart * 0.1) / ((APRPercent * headDmgModifier * nimbleDmgReduction + 0.1 * vsAPercent)),
  );

  const maxDmg = Math.min(dmg, maxDmgNoPenetrationOverkill);

  let armorDmg;
  let pureArmorDmg;
  if (struckArmorPart < Math.floor(maxDmg * vsAPercent))  {
    armorDmg = struckArmorPart;
    pureArmorDmg = Math.ceil(struckArmorPart / vsAPercent);
  } else {
    armorDmg = Math.floor(maxDmg * vsAPercent);
    pureArmorDmg = maxDmg;
  }

  const newArmor = struckArmorPart - armorDmg;
  const newArmorDmgReduction = Math.floor(newArmor * 0.1);

  const APRDmg = Math.floor(Math.min(maxDmg, pureArmorDmg) * APRPercent * headDmgModifier * nimbleDmgReduction) - newArmorDmgReduction
    |> (x => Math.max(x, 0));

  const armorOverkill = Math.min(
    Math.ceil((hp - APRDmg) / (headDmgModifier * nimbleDmgReduction)),
    Math.max(dmg - Math.ceil(struckArmorPart / vsAPercent), 0),
  );
  const newHp = hp - APRDmg - Math.floor(armorOverkill * headDmgModifier * nimbleDmgReduction);

  const newBodyArmor = struckPartName === 'head' ? armor : newArmor;
  const newHelm = struckPartName === 'head' ? newArmor : helm;

  return {
    newHp,
    newBodyArmor,
    newHelm,
    pureArmorDmg,
    armorOverkill,
  };
};


export const splitMan = (options) => {
  const getStatsAfterHit = options.hasNimble
    ? getStatsAfterHitNimble
    : getStatsAfterHitCommon;

  const afterFirstHit = getStatsAfterHit(options);

  if (afterFirstHit.newHp <= 0) {
    if (options.hasNineLive) {
      return {
        armor: afterFirstHit.newBodyArmor,
        helm: afterFirstHit.newHelm,
        hp: 5,
        usedDmg: options.dmg,
        hasNineLive: false,
      };
    }

    return {
      armor: afterFirstHit.newBodyArmor,
      helm: afterFirstHit.newHelm,
      hp: 0,
      usedDmg: Math.ceil((afterFirstHit.pureArmorDmg + afterFirstHit.armorOverkill) / 1.5),
    };
  }

  const afterSecondHit = getStatsAfterHit({
    ...options,
    armor: afterFirstHit.newBodyArmor,
    helm: afterFirstHit.newHelm,
    hp: afterFirstHit.newHp,
    hasSteelBrow: true,
    struckPartName: options.struckPartName === 'head' ? 'body' : 'head',
    dmg: Math.ceil(options.dmg / 2),
  });

  if (afterSecondHit.newHp <= 0) {
    if (options.hasNineLive) {
      return {
        armor: afterSecondHit.newBodyArmor,
        helm: afterSecondHit.newHelm,
        hp: 5,
        usedDmg: options.dmg,
        hasNineLive: false,
      };
    }

    const usedWeaponDmg = options.dmg + afterSecondHit.pureArmorDmg + afterSecondHit.armorOverkill;
    return {
      armor: afterSecondHit.newBodyArmor,
      helm: afterSecondHit.newHelm,
      hp: 0,
      usedDmg: Math.ceil(usedWeaponDmg / 1.5),
    };
  }

  return {
    armor: afterSecondHit.newBodyArmor,
    helm: afterSecondHit.newHelm,
    hp: afterSecondHit.newHp,
    usedDmg: options.dmg,
    hasNineLive: options.hasNineLive,
  };
};
