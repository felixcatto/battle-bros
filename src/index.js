const getStatsAfterHit = (struckArmorPart, hp, dmg, APRPercent) => {
  const newArmor = Math.max(struckArmorPart - dmg, 0);
  const newArmorDmgReduction = Math.floor(newArmor * 0.1);

  const armorOverkill = Math.abs(Math.min(struckArmorPart - dmg, 0));
  const APRDmg = Math.max(Math.min(struckArmorPart, dmg) * APRPercent - newArmorDmgReduction, 0);
  const newHp = hp - (APRDmg + armorOverkill);

  if (newArmor === 0) {
    if (newHp <= 0) {
      return {
        struckArmorPart: 0,
        hp: 0,
        ehp: hp - APRDmg + struckArmorPart,
      };
    }
    return {
      struckArmorPart: 0,
      hp: newHp,
      ehp: dmg,
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
    dmgPerHit,
    armorPiercingPercent: APRPercent,
    getRandomNum = Math.random,
  } = options;

  const makeHit = (armor, helm, hp, totalEHP) => {
    const chance = getRandomNum();

    if (chance >= 0.75) {
      const afterHit = getStatsAfterHit(helm, hp, dmgPerHit, APRPercent);
      const newTotalEHP = totalEHP + afterHit.ehp;
      if (afterHit.hp === 0) {
        return newTotalEHP;
      }

      return makeHit(armor, afterHit.struckArmorPart, afterHit.hp, newTotalEHP);
    }

    if (chance < 0.75) {
      const afterHit = getStatsAfterHit(armor, hp, dmgPerHit, APRPercent);
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
  const { countOfTests = 100000 } = options;

  const sumOfEHP = [...Array(countOfTests).keys()]
    .map(() => getEHP(options))
    .reduce((acc, num) => acc + num, 0);
  return sumOfEHP / countOfTests;
};


export { getAverageEHP };
