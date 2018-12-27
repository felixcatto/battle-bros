import {
  getBFDmgReduction, getNimbleDmgReduction, getHeadDmgModifier, getArmorDmgInfo,
} from './utils';


const getStatsAfterHitCommon = (options) => {
  const {
    armor,
    helm,
    hp,
    struckPartName,
    dmg,
    hasSteelBrow,
    hasBattleForged,
    hasFurPadding,
  } = options;

  const struckArmorPart = struckPartName === 'head' ? helm : armor;
  const headDmgModifier = getHeadDmgModifier(struckPartName, hasSteelBrow, false);

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

  const newBodyArmor = struckPartName === 'head' ? armor : newArmor;
  const newHelm = struckPartName === 'head' ? newArmor : helm;

  return {
    newHp,
    newBodyArmor,
    newHelm,
    pureArmorDmg,
    armorOverkill,
    armorOverkillWithHead,
    armorDmg,
    APRDmg,
  };
};


const getStatsAfterHitNimble = (options) => {
  const {
    armor,
    helm,
    hp,
    struckPartName,
    dmg,
    vsAPercent,
    hasSteelBrow,
    totalFtg,
    hasFurPadding,
  } = options;

  const nimbleDmgReduction = getNimbleDmgReduction(totalFtg);
  const struckArmorPart = struckPartName === 'head' ? helm : armor;
  const headDmgModifier = getHeadDmgModifier(struckPartName, hasSteelBrow, false);
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

  const newBodyArmor = struckPartName === 'head' ? armor : newArmor;
  const newHelm = struckPartName === 'head' ? newArmor : helm;

  return {
    newHp,
    newBodyArmor,
    newHelm,
    pureArmorDmg,
    armorOverkill,
    armorOverkillWithHead,
    armorDmg,
    APRDmg,
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
        armorOverkillWithHead: null,
        armorDmg: null,
        APRDmg: null,
      };
    }

    return {
      armor: afterFirstHit.newBodyArmor,
      helm: afterFirstHit.newHelm,
      hp: 0,
      usedDmg: Math.ceil((afterFirstHit.pureArmorDmg + afterFirstHit.armorOverkill) / 1.5),
      armorOverkillWithHead: null,
      armorDmg: null,
      APRDmg: null,
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
        armorOverkillWithHead: null,
        armorDmg: null,
        APRDmg: null,
      };
    }

    const usedWeaponDmg = options.dmg + afterSecondHit.pureArmorDmg + afterSecondHit.armorOverkill;
    return {
      armor: afterSecondHit.newBodyArmor,
      helm: afterSecondHit.newHelm,
      hp: 0,
      usedDmg: Math.ceil(usedWeaponDmg / 1.5),
      armorOverkillWithHead: null,
      armorDmg: null,
      APRDmg: null,
    };
  }

  return {
    armor: afterSecondHit.newBodyArmor,
    helm: afterSecondHit.newHelm,
    hp: afterSecondHit.newHp,
    usedDmg: options.dmg,
    hasNineLive: options.hasNineLive,
    armorOverkillWithHead: null,
    armorDmg: null,
    APRDmg: null,
  };
};
