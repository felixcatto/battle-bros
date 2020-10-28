import { commonCalc } from './strategyCommon';

export const thflail = options => {
  const { dmg } = options;
  const flailDmg = Math.floor(dmg / 3);

  const afterFirstHit = commonCalc({
    ...options,
    dmg: flailDmg,
  });

  const afterSecondHit = commonCalc({
    ...options,
    hp: afterFirstHit.hp,
    armor: afterFirstHit.armor,
    helm: afterFirstHit.helm,
    hasNineLive: afterFirstHit.hasNineLive,
    dmg: flailDmg,
  });

  const afterThirdHit = commonCalc({
    ...options,
    hp: afterSecondHit.hp,
    armor: afterSecondHit.armor,
    helm: afterSecondHit.helm,
    hasNineLive: afterSecondHit.hasNineLive,
    dmg: flailDmg,
  });

  return {
    ...afterThirdHit,
    armorDmg: afterFirstHit.armorDmg + afterSecondHit.armorDmg + afterThirdHit.armorDmg,
    dmgToHp: afterFirstHit.dmgToHp + afterSecondHit.dmgToHp + afterThirdHit.dmgToHp,
  };
};
