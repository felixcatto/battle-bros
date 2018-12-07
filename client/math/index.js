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
    getRandomNum = Math.random,
  } = options;

  const getStatsAfterHit = configureStatsAfterHit(options);
  const stats = {
    totalEHP: 0,
    totalHits: 0,
    logs: [],
  };

  const makeHit = (armor, helm, hp, totalEHP) => {
    const chance = getRandomNum();

    if (chance >= 0.75) {
      const afterHit = getStatsAfterHit({
        struckArmorPart: helm,
        oppositeArmorPart: armor,
        hp,
        struckPartName: 'head',
        dmg: dmgPerHit,
        vsAPercent: vsArmorPercent,
        APRPercent: armorPiercingPercent,
        totalFtg,
        hasSteelBrow,
      });

      stats.logs.push({
        ehp: afterHit.ehp,
        hp: afterHit.hp,
        armor,
        helm: afterHit.struckArmorPart,
        struckPartName: 'head',
      });

      const newTotalEHP = totalEHP + afterHit.ehp;
      stats.totalHits += afterHit.ehp === dmgPerHit
        ? 1
        : afterHit.ehp / dmgPerHit;

      if (afterHit.hp === 0) {
        stats.totalEHP = newTotalEHP;
        return stats;
      }

      return makeHit(armor, afterHit.struckArmorPart, afterHit.hp, newTotalEHP);
    }

    if (chance < 0.75) {
      const afterHit = getStatsAfterHit({
        struckArmorPart: armor,
        oppositeArmorPart: helm,
        hp,
        struckPartName: 'body',
        dmg: dmgPerHit,
        vsAPercent: vsArmorPercent,
        APRPercent: armorPiercingPercent,
        totalFtg,
        hasSteelBrow,
      });

      stats.logs.push({
        ehp: afterHit.ehp,
        hp: afterHit.hp,
        armor: afterHit.struckArmorPart,
        helm,
        struckPartName: 'body',
      });

      const newTotalEHP = totalEHP + afterHit.ehp;
      stats.totalHits += afterHit.ehp === dmgPerHit
        ? 1
        : afterHit.ehp / dmgPerHit;

      if (afterHit.hp === 0) {
        stats.totalEHP = newTotalEHP;
        return stats;
      }

      return makeHit(afterHit.struckArmorPart, helm, afterHit.hp, newTotalEHP);
    }
  };

  return makeHit(startArmor, startHelm, startHp, 0);
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
