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
    nimbleRandomFunc,
  } = options;

  const nimbleChance = Math.max(1 - totalFtg * 0.02, 0);
  const headDmgModifier = struckPartName === 'head' ? 1.5 : 1;

  if (nimbleRandomFunc() < nimbleChance) {
    const newDmg = Math.floor(dmg / 2);

    const maxAPRDmg = Math.ceil(
      (hp + struckArmorPart * 0.1) / (APRPercent * headDmgModifier + 0.1),
    );
    const armorDmg = Math.min(struckArmorPart, newDmg, maxAPRDmg);
    const newArmor = struckArmorPart - armorDmg;
    const newArmorDmgReduction = Math.floor(newArmor * 0.1);

    const APRDmg = Math.max(
      Math.floor(armorDmg * APRPercent * headDmgModifier) - newArmorDmgReduction, 0,
    );
    const armorOverkill = Math.min(
      Math.ceil((hp - APRDmg) / headDmgModifier),
      Math.max(newDmg - struckArmorPart, 0),
    );
    const newHp = hp - APRDmg - Math.floor(armorOverkill * headDmgModifier);

    if (newHp <= 0) {
      return {
        struckArmorPart: newArmor,
        hp: 0,
        ehp: (armorDmg + armorOverkill) * 2,
      };
    }

    return {
      struckArmorPart: newArmor,
      hp: newHp,
      ehp: dmg,
    };
  }

  const maxAPRDmg = Math.ceil((hp + struckArmorPart * 0.1) / (APRPercent * headDmgModifier + 0.1));
  const armorDmg = Math.min(struckArmorPart, dmg, maxAPRDmg);
  const newArmor = struckArmorPart - armorDmg;
  const newArmorDmgReduction = Math.floor(newArmor * 0.1);

  const APRDmg = Math.max(
    Math.floor(armorDmg * APRPercent * headDmgModifier) - newArmorDmgReduction,
    0,
  );
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


const NMBL_SB = (options) => {
  const {
    struckArmorPart,
    hp,
    dmg,
    APRPercent,
    totalFtg,
    nimbleRandomFunc,
  } = options;

  const nimbleChance = Math.max(1 - totalFtg * 0.02, 0);

  if (nimbleRandomFunc() < nimbleChance) {
    const newDmg = Math.floor(dmg / 2);

    const maxAPRDmg = Math.ceil((hp + struckArmorPart * 0.1) / (APRPercent + 0.1));
    const armorDmg = Math.min(struckArmorPart, newDmg, maxAPRDmg);
    const newArmor = struckArmorPart - armorDmg;
    const newArmorDmgReduction = Math.floor(newArmor * 0.1);

    const APRDmg = Math.max(Math.floor(armorDmg * APRPercent) - newArmorDmgReduction, 0);
    const armorOverkill = Math.min(Math.ceil(hp - APRDmg), Math.max(newDmg - struckArmorPart, 0));
    const newHp = hp - APRDmg - armorOverkill;

    if (newHp <= 0) {
      return {
        struckArmorPart: newArmor,
        hp: 0,
        ehp: (armorDmg + armorOverkill) * 2,
      };
    }

    return {
      struckArmorPart: newArmor,
      hp: newHp,
      ehp: dmg,
    };
  }

  const maxAPRDmg = Math.ceil((hp + struckArmorPart * 0.1) / (APRPercent + 0.1));
  const armorDmg = Math.min(struckArmorPart, dmg, maxAPRDmg);
  const newArmor = struckArmorPart - armorDmg;
  const newArmorDmgReduction = Math.floor(newArmor * 0.1);

  const APRDmg = Math.max(Math.floor(armorDmg * APRPercent) - newArmorDmgReduction, 0);
  const armorOverkill = Math.min(Math.ceil(hp - APRDmg), Math.max(dmg - struckArmorPart, 0));
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
