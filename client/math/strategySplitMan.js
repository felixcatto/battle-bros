import { commonCalc } from './strategyCommon';

export const splitMan = options => {
  const { struckPartName, dmg, hasBoneArmor, hasNineLive } = options;

  if (hasBoneArmor && struckPartName === 'body') {
    return {
      hp: options.hp,
      armor: options.armor,
      helm: options.helm,
      armorDmg: 0,
      dmgToHp: 0,
      hasNineLive,
      hasBoneArmor: false,
    };
  }

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
    hasBoneArmor: false,
  });

  return {
    ...afterSecondHit,
    hasBoneArmor,
    armorDmg: afterFirstHit.armorDmg + afterSecondHit.armorDmg,
    dmgToHp: afterFirstHit.dmgToHp + afterSecondHit.dmgToHp,
  };
};
