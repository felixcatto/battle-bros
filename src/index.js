import configureStatsAfterHit from './statsAfterHit';


const getEHP = (options) => {
  const {
    startHp,
    startArmor,
    startHelm,
    getRandomNum = Math.random,
    dmgPerHit,
    armorPiercingPercent,
  } = options;

  const getStatsAfterHit = configureStatsAfterHit(options);

  const makeHit = (armor, helm, hp, totalEHP) => {
    const chance = getRandomNum();

    if (chance >= 0.75) {
      const afterHit = getStatsAfterHit(helm, armor, hp, 'head', dmgPerHit, armorPiercingPercent);
      const newTotalEHP = totalEHP + afterHit.ehp;
      if (afterHit.hp === 0) {
        return newTotalEHP;
      }

      return makeHit(armor, afterHit.struckArmorPart, afterHit.hp, newTotalEHP);
    }

    if (chance < 0.75) {
      const afterHit = getStatsAfterHit(armor, helm, hp, 'body', dmgPerHit, armorPiercingPercent);
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
