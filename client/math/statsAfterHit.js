const getNimbleDmgReduction = (totalFtg) => {
  let rawNibleReduction;
  if (totalFtg <= 5) {
    rawNibleReduction = totalFtg;
  } else if (totalFtg <= 13) {
    rawNibleReduction = Math.floor(totalFtg * 1.25);
  } else if (totalFtg <= 25) {
    rawNibleReduction = Math.floor(totalFtg * 1.3);
  } else if (totalFtg <= 35) {
    rawNibleReduction = Math.floor(totalFtg * 1.4);
  } else if (totalFtg <= 50) {
    rawNibleReduction = Math.floor(totalFtg * 1.46);
  } else {
    rawNibleReduction = 75;
  }
  return (rawNibleReduction + 25) / 100;
};

const noPerk = (options) => {
  const {
    struckArmorPart,
    hp,
    struckPartName,
    dmg,
    APRPercent,
    vsAPercent,
    hasSteelBrow,
  } = options;

  const headDmgModifier = struckPartName === 'head' && !hasSteelBrow
    ? 1.5
    : 1;

  const maxDmgNoPenetrationOverkill = Math.ceil(
    (hp + struckArmorPart * 0.1) / ((APRPercent * headDmgModifier + 0.1 * vsAPercent)),
  );
  const maxDmg = Math.min(dmg, maxDmgNoPenetrationOverkill);

  const armorDmg = Math.min(struckArmorPart, Math.floor(maxDmg * vsAPercent));
  const armorDmgBeforeBF = Math.ceil(armorDmg / vsAPercent);

  const newArmor = struckArmorPart - armorDmg;
  const newArmorDmgReduction = Math.floor(newArmor * 0.1);

  const APRDmg = Math.floor(Math.min(maxDmg, armorDmgBeforeBF) * APRPercent * headDmgModifier) - newArmorDmgReduction
    |> (x => Math.max(x, 0));

  const armorOverkill = Math.min(
    Math.ceil((hp - APRDmg) / headDmgModifier),
    Math.max(dmg - Math.ceil(struckArmorPart / vsAPercent), 0),
  );
  const newHp = hp - APRDmg - Math.floor(armorOverkill * headDmgModifier);

  if (newHp <= 0) {
    return {
      struckArmorPart: newArmor,
      hp: 0,
      ehp: armorDmgBeforeBF + armorOverkill,
    };
  }

  return {
    struckArmorPart: newArmor,
    hp: newHp,
    ehp: dmg,
  };
};


const NMBL = (options) => {
  const {
    struckArmorPart,
    hp,
    struckPartName,
    dmg,
    APRPercent,
    vsAPercent,
    hasSteelBrow,
    totalFtg,
  } = options;

  const nimbleDmgReduction = getNimbleDmgReduction(totalFtg);
  const headDmgModifier = struckPartName === 'head' && !hasSteelBrow
    ? 1.5
    : 1;

  const maxDmgNoPenetrationOverkill = Math.ceil(
    (hp + struckArmorPart * 0.1) / ((APRPercent * headDmgModifier * nimbleDmgReduction + 0.1 * vsAPercent)),
  );

  const maxDmg = Math.min(dmg, maxDmgNoPenetrationOverkill);

  const armorDmg = Math.min(struckArmorPart, Math.floor(maxDmg * vsAPercent));
  const armorDmgBeforeBF = Math.ceil(armorDmg / vsAPercent);

  const newArmor = struckArmorPart - armorDmg;
  const newArmorDmgReduction = Math.floor(newArmor * 0.1);

  const APRDmg = Math.floor(Math.min(maxDmg, armorDmgBeforeBF) * APRPercent * headDmgModifier * nimbleDmgReduction) - newArmorDmgReduction
    |> (x => Math.max(x, 0));

  const armorOverkill = Math.min(
    Math.ceil((hp - APRDmg) / (headDmgModifier * nimbleDmgReduction)),
    Math.max(dmg - Math.ceil(struckArmorPart / vsAPercent), 0),
  );
  const newHp = hp - APRDmg - Math.floor(armorOverkill * headDmgModifier * nimbleDmgReduction);

  if (newHp <= 0) {
    return {
      struckArmorPart: newArmor,
      hp: 0,
      ehp: armorDmgBeforeBF + armorOverkill,
    };
  }

  return {
    struckArmorPart: newArmor,
    hp: newHp,
    ehp: dmg,
  };
};


const BF = (options) => {
  const {
    struckArmorPart,
    oppositeArmorPart,
    hp,
    struckPartName,
    dmg,
    APRPercent,
    hasSteelBrow,
  } = options;

  const headDmgModifier = struckPartName === 'head' && !hasSteelBrow
    ? 1.5
    : 1;

  const bfModifier = 1 - (struckArmorPart + oppositeArmorPart) * 0.01 * 0.05;
  const vsAPercent = bfModifier * options.vsAPercent;

  const maxDmgNoPenetrationOverkill = Math.ceil(
    (hp + struckArmorPart * 0.1) / ((APRPercent * headDmgModifier + 0.1 * vsAPercent)),
  );
  const maxDmg = Math.min(dmg, maxDmgNoPenetrationOverkill);

  const armorDmg = Math.min(struckArmorPart, Math.floor(maxDmg * vsAPercent));
  const armorDmgBeforeBF = Math.ceil(armorDmg / vsAPercent);

  const newArmor = struckArmorPart - armorDmg;
  const newArmorDmgReduction = Math.floor(newArmor * 0.1);

  const APRDmg = Math.floor(Math.min(maxDmg, armorDmgBeforeBF) * APRPercent * headDmgModifier) - newArmorDmgReduction
    |> (x => Math.max(x, 0));

  const armorOverkill = Math.min(
    Math.ceil((hp - APRDmg) / headDmgModifier),
    Math.max(dmg - Math.ceil(struckArmorPart / vsAPercent), 0),
  );
  const newHp = hp - APRDmg - Math.floor(armorOverkill * headDmgModifier);

  if (newHp <= 0) {
    return {
      struckArmorPart: newArmor,
      hp: 0,
      ehp: armorDmgBeforeBF + armorOverkill,
    };
  }

  return {
    struckArmorPart: newArmor,
    hp: newHp,
    ehp: dmg,
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
