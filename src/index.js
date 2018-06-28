const getStatsAfterHit = (struckArmorPart, oppositeArmorPart, hp, struckPartName, options) => {
  const {
    dmgPerHit: dmg,
    armorPiercingPercent: APRPercent,
    hasBattleForged,
    hasSteelBrow,
  } = options;

  if (hasBattleForged) {
    const BFPercent = (struckArmorPart + oppositeArmorPart) * 0.05 * 0.01;
    console.log(BFPercent);
  }

  const headDmgModifier = struckPartName === 'head' && !hasSteelBrow
    ? 1.5
    : 1;

  const maxArmorDmg = Math.min(struckArmorPart, dmg);
  const newArmor = struckArmorPart - maxArmorDmg;
  const newArmorDmgReduction = Math.floor(newArmor * 0.1);

  const armorDmg = Math.min(maxArmorDmg, Math.ceil((hp + newArmorDmgReduction) / (APRPercent * headDmgModifier)));
  const APRDmg = Math.max(Math.floor(armorDmg * APRPercent * headDmgModifier) - newArmorDmgReduction, 0);
  const armorOverkill = Math.min(Math.ceil((hp - APRDmg) / headDmgModifier), Math.max(dmg - struckArmorPart, 0));
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


const getEHP = (options) => {
  const {
    startHp,
    startArmor,
    startHelm,
    getRandomNum = Math.random,
  } = options;

  const makeHit = (armor, helm, hp, totalEHP) => {
    const chance = getRandomNum();

    if (chance >= 0.75) {
      const afterHit = getStatsAfterHit(helm, armor, hp, 'head', options);
      const newTotalEHP = totalEHP + afterHit.ehp;
      if (afterHit.hp === 0) {
        return newTotalEHP;
      }

      return makeHit(armor, afterHit.struckArmorPart, afterHit.hp, newTotalEHP);
    }

    if (chance < 0.75) {
      const afterHit = getStatsAfterHit(armor, helm, hp, 'body', options);
      const newTotalEHP = totalEHP + afterHit.ehp;
      if (afterHit.hp === 0) {
        return newTotalEHP;
      }

      return makeHit(afterHit.struckArmorPart, helm, afterHit.hp, newTotalEHP);
    }
  };

  return makeHit(startArmor, startHelm, startHp, 0);
};


const getAverageEHP = (options) => {
  const { countOfTests = 50000 } = options;

  const sumOfEHP = [...Array(countOfTests).keys()]
    .map(() => getEHP(options))
    .reduce((acc, num) => acc + num, 0);
  return sumOfEHP / countOfTests;
};


export { getAverageEHP };
