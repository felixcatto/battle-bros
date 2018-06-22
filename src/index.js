const outputStats = (armor, helm, hp, canShowLogs) => {
  if (!canShowLogs) return;
  console.log(`armor: ${armor}`);
  console.log(`helm: ${helm}`);
  console.log(`hp: ${hp}`);
};


const getRandomInRange = (start, end) => Math.floor(Math.random() * (end - start + 1) + start);


const getHitsToDie = (options) => {
  const {
    startHp,
    startArmor,
    startHelm,
    dmgPerHit,
    getRandomNum = Math.random,
    canShowLogs,
  } = options;

  const makeHit = (armor, helm, hp, numOfHit) => {
    const chance = getRandomNum();

    if (chance >= 0.75) {
      if (helm === 0) {
        const newHp = hp - dmgPerHit;
        if (newHp <= 0) {
          outputStats(armor, helm, newHp, canShowLogs);
          return numOfHit;
        }
        return makeHit(armor, helm, newHp, numOfHit + 1);
      }

      const newHelm = helm - dmgPerHit;
      if (newHelm <= 0) {
        const newHp = hp + newHelm;
        if (newHp <= 0) {
          outputStats(armor, 0, newHp, canShowLogs);
          return numOfHit;
        }
        return makeHit(armor, 0, newHp, numOfHit + 1);
      }

      return makeHit(armor, newHelm, hp, numOfHit + 1);
    }

    if (chance < 0.75) {
      if (armor === 0) {
        const newHp = hp - dmgPerHit;
        if (newHp <= 0) {
          outputStats(armor, helm, newHp, canShowLogs);
          return numOfHit;
        }
        return makeHit(armor, helm, newHp, numOfHit + 1);
      }

      const newArmor = armor - dmgPerHit;
      if (newArmor <= 0) {
        const newHp = hp + newArmor;
        if (newHp <= 0) {
          outputStats(0, helm, newHp, canShowLogs);
          return numOfHit;
        }
        return makeHit(0, helm, newHp, numOfHit + 1);
      }

      return makeHit(newArmor, helm, hp, numOfHit + 1);
    }

    throw new Error('impossible');
  };

  return makeHit(startArmor, startHelm, startHp, 1);
};


const getEHP = (options) => {
  const {
    countOfTests = 100000,
    dmgPerHit = 60,
  } = options;

  const sumOfHits = [...Array(countOfTests).keys()]
    .map(() => getHitsToDie(options))
    .reduce((acc, num) => acc + num, 0);
  return (sumOfHits / countOfTests) * dmgPerHit;
};


export { getHitsToDie, getEHP };
