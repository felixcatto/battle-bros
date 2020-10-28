import { commonCalc } from './strategyCommon';

export const splitMan = options => {
  const { struckPartName, dmg, hasBoneArmor, hasNineLive } = options;

  const afterFirstHit = commonCalc({
    ...options,
    hasNineLive: false,
    hasBoneArmor: false,
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

  const isArmorDestroyed =
    (struckPartName === 'head' && afterSecondHit.helm === 0) ||
    (struckPartName === 'body' && afterSecondHit.armor === 0);
  if (!isArmorDestroyed && hasBoneArmor) {
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

  return {
    ...afterSecondHit,
    armorDmg: afterFirstHit.armorDmg + afterSecondHit.armorDmg,
    dmgToHp: afterFirstHit.dmgToHp + afterSecondHit.dmgToHp,
  };
};
