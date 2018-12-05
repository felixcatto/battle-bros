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
      if (afterHit.hp === 0) {
        stats.totalEHP = newTotalEHP;
        return stats;
      }

      return makeHit(afterHit.struckArmorPart, helm, afterHit.hp, newTotalEHP);
    }
  };

  return makeHit(startArmor, startHelm, startHp, 0);
};


const getAverageEHP = (options) => {
  const { countOfTests = 50000 } = options;

  const sumOfEHP = [...Array(countOfTests).keys()]
    .map(() => getEHPStats(options).totalEHP)
    .reduce((acc, num) => acc + num, 0);
  return sumOfEHP / countOfTests;
};


export { getAverageEHP };
