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
  } = options;

  const headDmgModifier = struckPartName === 'head' ? 1.5 : 1;

  const maxAPRDmg = Math.ceil((hp + struckArmorPart * 0.1) / (APRPercent * headDmgModifier + 0.1));
  const armorDmg = Math.min(struckArmorPart, dmg, maxAPRDmg);
  const newArmor = struckArmorPart - armorDmg;
  const newArmorDmgReduction = Math.floor(newArmor * 0.1);

  const APRDmg = Math.floor(armorDmg * APRPercent * headDmgModifier) - newArmorDmgReduction
    |> (_ => Math.max(_, 0));

  const armorOverkill = Math.min(
    Math.ceil((hp - APRDmg) / headDmgModifier),
    Math.max(dmg - struckArmorPart, 0),
  );

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


const SB = (options) => {
  const {
    struckArmorPart,
    hp,
    dmg,
    APRPercent,
  } = options;

  const maxAPRDmg = Math.ceil((hp + struckArmorPart * 0.1) / (APRPercent + 0.1));
  const armorDmg = Math.min(struckArmorPart, dmg, maxAPRDmg);
  const newArmor = struckArmorPart - armorDmg;
  const newArmorDmgReduction = Math.floor(newArmor * 0.1);

  const APRDmg = Math.max(Math.floor(armorDmg * APRPercent) - newArmorDmgReduction, 0);
  const armorOverkill = Math.min(hp - APRDmg, Math.max(dmg - struckArmorPart, 0));
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


const NMBL = (options) => {
  const {
    struckArmorPart,
    hp,
    struckPartName,
    dmg,
    APRPercent,
    totalFtg,
  } = options;

  const nimbleDmgReduction = getNimbleDmgReduction(totalFtg);
  const headDmgModifier = struckPartName === 'head' ? 1.5 : 1;

  // eslint-disable-next-line
  const maxAPRDmg = (hp + struckArmorPart * 0.1) / (APRPercent * headDmgModifier * nimbleDmgReduction + 0.1)
    |> Math.ceil;
  const armorDmg = Math.min(struckArmorPart, dmg, maxAPRDmg);
  const newArmor = struckArmorPart - armorDmg;
  const newArmorDmgReduction = Math.floor(newArmor * 0.1);

  // eslint-disable-next-line
  const APRDmg = Math.floor(armorDmg * APRPercent * headDmgModifier * nimbleDmgReduction) - newArmorDmgReduction
    |> (_ => Math.max(_, 0));

  const armorOverkill = Math.min(
    Math.ceil((hp - APRDmg) / (headDmgModifier * nimbleDmgReduction)),
    Math.max(dmg - struckArmorPart, 0),
  );

  const newHp = hp - APRDmg - Math.floor(armorOverkill * headDmgModifier * nimbleDmgReduction);

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


const NMBL_SB = (options) => {
  const {
    struckArmorPart,
    hp,
    dmg,
    APRPercent,
    totalFtg,
  } = options;

  const nimbleDmgReduction = getNimbleDmgReduction(totalFtg);

  const maxAPRDmg = (hp + struckArmorPart * 0.1) / (APRPercent * nimbleDmgReduction + 0.1)
    |> Math.ceil;
  const armorDmg = Math.min(struckArmorPart, dmg, maxAPRDmg);
  const newArmor = struckArmorPart - armorDmg;
  const newArmorDmgReduction = Math.floor(newArmor * 0.1);

  const APRDmg = Math.floor(armorDmg * APRPercent * nimbleDmgReduction) - newArmorDmgReduction
    |> (_ => Math.max(_, 0));

  const armorOverkill = Math.min(
    Math.ceil((hp - APRDmg) / nimbleDmgReduction),
    Math.max(dmg - struckArmorPart, 0),
  );

  const newHp = hp - APRDmg - Math.floor(armorOverkill * nimbleDmgReduction);

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


const BF = (options) => {
  const {
    struckArmorPart,
    oppositeArmorPart,
    hp,
    struckPartName,
    dmg,
    APRPercent,
  } = options;

  const headDmgModifier = struckPartName === 'head' ? 1.5 : 1;
  const bfModifier = 1 - (struckArmorPart + oppositeArmorPart) * 0.01 * 0.05;

  const maxAPRDmg = Math.ceil(
    (hp + struckArmorPart * 0.1) / ((APRPercent * headDmgModifier + 0.1) * bfModifier),
  );

  const armorDmg = Math.min(struckArmorPart, Math.floor(dmg * bfModifier), maxAPRDmg);
  const armorDmgBeforeBF = Math.ceil(armorDmg / bfModifier);

  const newArmor = struckArmorPart - armorDmg;
  const newArmorDmgReduction = Math.floor(newArmor * 0.1);

  const APRDmg = Math.floor(armorDmg * APRPercent * headDmgModifier) - newArmorDmgReduction
    |> (_ => Math.max(_, 0));

  const armorOverkill = Math.min(
    Math.ceil((hp - APRDmg) / headDmgModifier),
    Math.max(dmg - Math.max(struckArmorPart, armorDmgBeforeBF), 0),
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


const SB_BF = (options) => {
  const {
    struckArmorPart,
    oppositeArmorPart,
    hp,
    dmg,
    APRPercent,
  } = options;

  const bfModifier = 1 - (struckArmorPart + oppositeArmorPart) * 0.01 * 0.05;

  const maxAPRDmg = Math.ceil(
    (hp + struckArmorPart * 0.1) / ((APRPercent + 0.1) * bfModifier),
  );

  const armorDmg = Math.min(struckArmorPart, Math.floor(dmg * bfModifier), maxAPRDmg);
  const armorDmgBeforeBF = Math.ceil(armorDmg / bfModifier);

  const newArmor = struckArmorPart - armorDmg;
  const newArmorDmgReduction = Math.floor(newArmor * 0.1);

  const APRDmg = Math.max(Math.floor(armorDmg * APRPercent) - newArmorDmgReduction, 0);
  const armorOverkill = Math.min(
    Math.ceil(hp - APRDmg),
    Math.max(dmg - Math.max(struckArmorPart, armorDmgBeforeBF), 0),
  );
  const newHp = hp - APRDmg - armorOverkill;

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
    hasSteelBrow,
    hasNimble,
  } = options;
  if (hasBattleForged && hasSteelBrow) {
    return SB_BF;
  } if (hasBattleForged) {
    return BF;
  } if (hasNimble && hasSteelBrow) {
    return NMBL_SB;
  } if (hasNimble) {
    return NMBL;
  } if (hasSteelBrow) {
    return SB;
  }
  return noPerk;
};
