const outputStats = (armor, helm, canShowLogs) => {
  if (!canShowLogs) return;
  console.log(`armor: ${armor}`);
  console.log(`helm: ${helm}`);
};


const getHitsToDie = (options) => {
  const {
    startHp,
    startArmor,
    startHelm,
    dmgPerHit,
    getRandomNum = Math.random,
    canShowLogs,
  } = options;

  const makeHit = (armor, helm, numOfHit) => {
    const chance = getRandomNum();

    if (chance >= 0.75) {
      const newHelm = helm - dmgPerHit;
      if (newHelm <= 0) {
        outputStats(armor, newHelm, canShowLogs);
        return numOfHit;
      }
      return makeHit(armor, newHelm, numOfHit + 1);
    }

    const newArmor = armor - dmgPerHit;
    if (newArmor <= 0) {
      outputStats(newArmor, helm, canShowLogs);
      return numOfHit;
    }
    return makeHit(newArmor, helm, numOfHit + 1);
  };

  return makeHit(startArmor, startHelm, 1);
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
