import configureStatsAfterHit from './statsAfterHit';


export const getEHPStats = (options) => {
  const {
    startHp,
    startArmor,
    startHelm,
    dmgPerHit,
    vsArmorPercent,
    armorPiercingPercent,
    totalFtg,
    hasSteelBrow,
    chanceToHitHead,
    hasBattleForged,
    hasNimble,
    hasChop,
    getRandomNum = Math.random,
  } = options;

  const getStatsAfterHit = configureStatsAfterHit(options);
  const stats = {
    totalEHP: 0,
    totalHits: 0,
    logs: [],
  };

  const makeHit = (armor, helm, hp, totalEHP, hasNineLive) => {
    const isHitToHead = getRandomNum() >= 1 - chanceToHitHead;
    const afterHitOptions = {
      helm,
      armor,
      hp,
      struckPartName: isHitToHead ? 'head' : 'body',
      dmg: dmgPerHit,
      vsAPercent: vsArmorPercent,
      APRPercent: armorPiercingPercent,
      totalFtg,
      hasSteelBrow,
      hasNineLive,
      hasBattleForged,
      hasNimble,
      hasChop,
    };

    const afterHit = getStatsAfterHit(afterHitOptions);

    stats.logs.push({
      usedDmg: afterHit.usedDmg,
      hp: afterHit.hp,
      armor: afterHit.armor,
      helm: afterHit.helm,
      struckPartName: afterHitOptions.struckPartName,
    });

    const newTotalEHP = totalEHP + afterHit.usedDmg;
    stats.totalHits += afterHit.usedDmg === dmgPerHit
      ? 1
      : afterHit.usedDmg / dmgPerHit;

    if (afterHit.hp === 0) {
      stats.totalEHP = newTotalEHP;
      return stats;
    }

    return makeHit(afterHit.armor, afterHit.helm, afterHit.hp, newTotalEHP, afterHit.hasNineLive);
  };

  return makeHit(startArmor, startHelm, startHp, 0, options.hasNineLive);
};


export const getAverageStats = (options) => {
  const { countOfTests = 50000 } = options;

  return [...Array(countOfTests).keys()]
    .map(() => getEHPStats(options))
    .reduce(({ totalEHP = 0, totalHits = 0 }, stats) => ({
      totalEHP: totalEHP + stats.totalEHP,
      totalHits: totalHits + stats.totalHits,
    }), {})
    |> (x => ({
      totalEHP: x.totalEHP / countOfTests,
      totalHits: x.totalHits / countOfTests,
    }));
};
