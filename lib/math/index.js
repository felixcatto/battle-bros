import { getRandomInRange } from './utils';
import { commonCalc } from './strategyCommon';
import { splitMan } from './strategySplitMan';
import { batter } from './strategyBatter';

const configureStatsAfterHit = options => {
  const { hasNimble, hasSplitMan, hasBatter } = options;

  if (hasSplitMan) {
    return splitMan;
  }

  if (hasBatter) {
    return batter;
  }

  return commonCalc;
};

export const getStats = options => {
  const {
    startHp,
    startArmor,
    startHelm,
    minDmg,
    maxDmg,
    vsArmorPercent,
    armorPiercingPercent,
    totalFtg,
    hasSteelBrow,
    chanceToHitHead,
    hasBattleForged,
    hasNimble,
    hasChop,
    hasFurPadding,
    getRandomNum = Math.random,
  } = options;

  const getStatsAfterHit = configureStatsAfterHit(options);
  const stats = {
    hitsToKill: 0,
    endHp: null,
    logs: [],
  };

  const makeHit = (armor, helm, hp, hasNineLive) => {
    const isHitToHead = getRandomNum() >= 1 - chanceToHitHead;
    const dmgPerHit = getRandomInRange(minDmg, maxDmg);
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
      hasFurPadding,
    };

    const afterHit = getStatsAfterHit(afterHitOptions);

    stats.logs.push({
      hp: afterHit.hp,
      armor: afterHit.armor,
      helm: afterHit.helm,
      struckPartName: afterHitOptions.struckPartName,
      armorDmg: afterHit.armorDmg,
      dmgToHp: afterHit.dmgToHp,
    });

    stats.hitsToKill += 1;
    if (afterHit.hp <= 0) {
      stats.endHp = afterHit.hp;
      return stats;
    }

    return makeHit(afterHit.armor, afterHit.helm, afterHit.hp, afterHit.hasNineLive);
  };

  return makeHit(startArmor, startHelm, startHp, options.hasNineLive);
};

export const getAverageStats = options => {
  const { countOfTests = 50000 } = options;

  return (
    [...Array(countOfTests).keys()]
      .map(() => getEHPStats(options))
      .reduce(
        ({ totalHits = 0 }, stats) => ({
          totalHits: totalHits + stats.totalHits,
        }),
        {}
      )
    |> (x => ({
      totalHits: x.totalHits / countOfTests,
    }))
  );
};
