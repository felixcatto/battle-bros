import { commonCalc } from './strategyCommon';

export const puncture = options => {
  const afterHit = commonCalc({
    ...options,
    hp: options.hp,
    armor: 0,
    helm: 0,
    hasSteelBrow: true,
  });

  return {
    ...afterHit,
    armorDmg: 0,
    armor: options.armor,
    helm: options.helm,
  };
};
