import { omit } from 'lodash';
import { getRandomInRange } from './utils';
import { commonCalc } from './strategyCommon';
import { splitMan } from './strategySplitMan';
import { batter } from './strategyBatter';
import { puncture } from './strategyPuncture';
import { thflail } from './strategyTHFlail';

const configureStatsAfterHit = options => {
  const { hasTHFlail, hasPuncture, hasSplitMan, hasBatter } = options;
  if (hasSplitMan) {
    return splitMan;
  }
  if (hasBatter) {
    return batter;
  }
  if (hasPuncture) {
    return puncture;
  }
  if (hasTHFlail) {
    return thflail;
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
    chanceToHitHead,
    dmgMult = 1,
    hasSteelBrow = false,
    hasBattleForged = false,
    hasNimble = false,
    hasChop = false,
    hasFurPadding = false,
    hasHornPlate = false,
    hasNineLive: initialHasNineLive = false,
    hasBoneArmor: initialHasBoneArmor = false,
    getRandomNum = Math.random,
    shouldWriteLog = true,
  } = options;

  const getStatsAfterHit = configureStatsAfterHit(options);
  const stats = {
    hitsToKill: 0,
    endHp: null,
    logs: [],
  };

  const makeHit = (armor, helm, hp, hasNineLive, hasBoneArmor) => {
    const isHitToHead = getRandomNum() >= 1 - chanceToHitHead;
    const dmgPerHit = Math.floor(getRandomInRange(minDmg, maxDmg) * dmgMult);
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
      hasBoneArmor,
      hasBattleForged,
      hasNimble,
      hasChop,
      hasFurPadding,
      hasHornPlate,
    };

    const afterHit = getStatsAfterHit(afterHitOptions);

    if (shouldWriteLog) {
      stats.logs.push({
        struckPartName: afterHitOptions.struckPartName,
        armorDmg: afterHit.armorDmg,
        dmgToHp: afterHit.dmgToHp,
        hp: afterHit.hp,
        armor: afterHit.armor,
        helm: afterHit.helm,
      });
    }

    stats.hitsToKill += 1;
    if (afterHit.hp <= 0) {
      stats.endHp = afterHit.hp;
      return stats;
    }

    return makeHit(
      afterHit.armor,
      afterHit.helm,
      afterHit.hp,
      afterHit.hasNineLive,
      afterHit.hasBoneArmor
    );
  };

  return makeHit(startArmor, startHelm, startHp, initialHasNineLive, initialHasBoneArmor);
};

export const getAverageStats = options => {
  const countOfTests = options.countOfTests || 50000;
  const newOptions = {
    ...options,
    countOfTests,
    shouldWriteLog: false,
  };

  return (
    [...Array(countOfTests).keys()]
      .map(() => getStats(newOptions))
      .reduce(
        (acc, stats) => ({
          ...acc,
          totalHits: acc.totalHits + stats.hitsToKill,
          [stats.hitsToKill]: (acc[stats.hitsToKill] || 0) + 1,
        }),
        { totalHits: 0 }
      )
    |> (v => ({
      avgHits: v.totalHits / countOfTests,
      probability: Object.keys(omit(v, 'totalHits')).map(key => ({
        hitsToKill: key,
        chance: v[key] / countOfTests,
      })),
    }))
  );
};
