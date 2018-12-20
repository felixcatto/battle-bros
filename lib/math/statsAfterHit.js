export const getNimbleDmgReduction = (totalFtg) => {
  let rawNibleReduction;
  const diffFtg = Math.max(totalFtg - 15, 0);
  if (diffFtg <= 8) {
    rawNibleReduction = Math.floor(diffFtg * 1.5);
  } else if (diffFtg <= 12) {
    rawNibleReduction = Math.floor(diffFtg * 1.6);
  } else if (diffFtg <= 16) {
    rawNibleReduction = Math.floor(diffFtg * 1.69);
  } else if (diffFtg <= 20) {
    rawNibleReduction = Math.floor(diffFtg * 1.76);
  } else if (diffFtg <= 25) {
    rawNibleReduction = Math.floor(diffFtg * 1.8);
  } else if (diffFtg <= 27) {
    rawNibleReduction = Math.floor(diffFtg * 1.84);
  } else if (diffFtg <= 33) {
    rawNibleReduction = Math.floor(diffFtg * 1.89);
  } else if (diffFtg <= 35) {
    rawNibleReduction = Math.floor(diffFtg * 1.92);
  } else {
    rawNibleReduction = 67;
  }
  return (rawNibleReduction + 33) / 100;
};

export const getBFDmgReduction = (armor, help) => 1 - (armor + help) * 0.01 * 0.05;

const noPerk = (options) => {
  const {
    armor,
    helm,
    hp,
    struckPartName,
    dmg,
    APRPercent,
    vsAPercent,
    hasSteelBrow,
    hasNineLive,
  } = options;

  const struckArmorPart = struckPartName === 'head' ? helm : armor;
  const headDmgModifier = struckPartName === 'head' && !hasSteelBrow
    ? 1.5
    : 1;

  const maxDmgNoPenetrationOverkill = Math.ceil(
    (hp + struckArmorPart * 0.1) / ((APRPercent * headDmgModifier + 0.1 * vsAPercent)),
  );
  const maxDmg = Math.min(dmg, maxDmgNoPenetrationOverkill);

  const armorDmg = Math.min(struckArmorPart, Math.floor(maxDmg * vsAPercent));
  const pureArmorDmg = Math.ceil(armorDmg / vsAPercent);

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

  if (newHp <= 0) {
    if (hasNineLive) {
      return {
        armor: newBodyArmor,
        helm: newHelm,
        hp: 5,
        ehp: dmg,
        hasNineLive: false,
      };
    }

    return {
      armor: newBodyArmor,
      helm: newHelm,
      hp: 0,
      ehp: pureArmorDmg + armorOverkill,
    };
  }

  return {
    armor: newBodyArmor,
    helm: newHelm,
    hp: newHp,
    ehp: dmg,
    hasNineLive,
  };
};


const NMBL = (options) => {
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
    (hp + struckArmorPart * 0.1) / ((APRPercent * headDmgModifier * nimbleDmgReduction + 0.1 * vsAPercent)),
  );

  const maxDmg = Math.min(dmg, maxDmgNoPenetrationOverkill);

  const armorDmg = Math.min(struckArmorPart, Math.floor(maxDmg * vsAPercent));
  const pureArmorDmg = Math.ceil(armorDmg / vsAPercent);

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

  if (newHp <= 0) {
    if (hasNineLive) {
      return {
        armor: newBodyArmor,
        helm: newHelm,
        hp: 5,
        ehp: dmg,
        hasNineLive: false,
      };
    }

    return {
      armor: newBodyArmor,
      helm: newHelm,
      hp: 0,
      ehp: pureArmorDmg + armorOverkill,
    };
  }

  return {
    armor: newBodyArmor,
    helm: newHelm,
    hp: newHp,
    ehp: dmg,
    hasNineLive,
  };
};


const BF = (options) => {
  const {
    armor,
    helm,
    hp,
    struckPartName,
    dmg,
    APRPercent,
    hasSteelBrow,
    hasNineLive,
  } = options;

  const struckArmorPart = struckPartName === 'head' ? helm : armor;
  const headDmgModifier = struckPartName === 'head' && !hasSteelBrow
    ? 1.5
    : 1;

  const bfModifier = getBFDmgReduction(armor, helm);
  const vsAPercent = bfModifier * options.vsAPercent;

  const maxDmgNoPenetrationOverkill = Math.ceil(
    (hp + struckArmorPart * 0.1) / ((APRPercent * headDmgModifier + 0.1 * vsAPercent)),
  );
  const maxDmg = Math.min(dmg, maxDmgNoPenetrationOverkill);

  const armorDmg = Math.min(struckArmorPart, Math.floor(maxDmg * vsAPercent));
  const pureArmorDmg = Math.ceil(armorDmg / vsAPercent);

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

  if (newHp <= 0) {
    if (hasNineLive) {
      return {
        armor: newBodyArmor,
        helm: newHelm,
        hp: 5,
        ehp: dmg,
        hasNineLive: false,
      };
    }

    return {
      armor: newBodyArmor,
      helm: newHelm,
      hp: 0,
      ehp: pureArmorDmg + armorOverkill,
    };
  }

  return {
    armor: newBodyArmor,
    helm: newHelm,
    hp: newHp,
    ehp: dmg,
    hasNineLive,
  };
};


export default (options) => {
  const {
    hasBattleForged,
    hasNimble,
  } = options;

  if (hasBattleForged) {
    return BF;
  } if (hasNimble) {
    return NMBL;
  }

  return noPerk;
};
