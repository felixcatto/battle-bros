const outputStats = (armor, helm, hp, canShowLogs) => {
  if (!canShowLogs) return;
  console.log(`armor: ${armor}`);
  console.log(`helm: ${helm}`);
  console.log(`hp: ${hp}`);
};


const getRandomInRange = (start, end) => Math.floor(Math.random() * (end - start + 1) + start);


const getStatsAfterHit = (struckArmorPart, hp, dmg) => {
  if (struckArmorPart === 0) {
    const newHp = hp - dmg;
    if (newHp <= 0) {
      return {
        struckArmorPart: 0,
        hp: 0,
        ehp: hp,
      };
    }
    return {
      struckArmorPart: 0,
      hp: newHp,
      ehp: dmg,
    };
  }

  const newArmor = struckArmorPart - dmg;
  if (newArmor <= 0) {
    const newHp = hp - Math.abs(newArmor);
    if (newHp <= 0) {
      return {
        struckArmorPart: 0,
        hp: 0,
        ehp: hp + struckArmorPart,
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
    hp,
    ehp: dmg,
  };
};


const getEHP = (options) => {
  const {
    startHp,
    startArmor,
    startHelm,
    dmgPerHit,
    getRandomNum = Math.random,
    canShowLogs,
  } = options;

  const makeHit = (armor, helm, hp, totalEHP) => {
    const chance = getRandomNum();

    if (chance >= 0.75) {
      const afterHit = getStatsAfterHit(helm, hp, dmgPerHit);
      const newTotalEHP = totalEHP + afterHit.ehp;
      if (afterHit.hp === 0) {
        return newTotalEHP;
      }

      return makeHit(armor, afterHit.struckArmorPart, afterHit.hp, newTotalEHP);
    }

    if (chance < 0.75) {
      const afterHit = getStatsAfterHit(armor, hp, dmgPerHit);
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
