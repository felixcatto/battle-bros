import { commonCalc } from './strategyCommon';

export const splitMan = options => {
  const { struckPartName, dmg } = options;

  const afterFirstHit = commonCalc({
    ...options,
    hasNineLive: false,
  });

  const afterSecondHit = commonCalc({
    ...options,
    hp: afterFirstHit.hp,
    armor: afterFirstHit.armor,
    helm: afterFirstHit.helm,
    struckPartName: struckPartName === 'head' ? 'body' : 'head',
    dmg: Math.floor(dmg / 2),
    hasSteelBrow: true,
  });

  return {
    ...afterSecondHit,
    armorDmg: afterFirstHit.armorDmg + afterSecondHit.armorDmg,
    dmgToHp: afterFirstHit.dmgToHp + afterSecondHit.dmgToHp,
  };
};
