import { getStats } from '../lib/math';

const getRandomFunc = () => {
  let i = 0;
  return () => {
    i += 1;
    return i % 4 === 0 ? 1 : 0; // armor armor armor helm...
  };
};

const getHeadRandomFunc = () => {
  let i = 0;
  return () => {
    i += 1;
    return i % 2 === 0 ? 1 : 0; // armor helm armor helm...
  };
};

test('Body kill', () => {
  const options = {
    startHp: 60,
    startArmor: 120,
    startHelm: 120,
    minDmg: 100,
    maxDmg: 100,
    armorPiercingPercent: 0.3,
    vsArmorPercent: 1,
    chanceToHitHead: 0.25,
    getRandomNum: getRandomFunc(),
  };

  const stats = getStats(options);
  expect(stats.hitsToKill).toBe(2);
  expect(stats.endHp).toBe(-48);
});

test('Head kill', () => {
  const options = {
    startHp: 60,
    startArmor: 120,
    startHelm: 120,
    minDmg: 50,
    maxDmg: 50,
    armorPiercingPercent: 0.3,
    vsArmorPercent: 1,
    chanceToHitHead: 0.25,
    getRandomNum: getRandomFunc(),
  };

  const stats = getStats(options);
  expect(stats.hitsToKill).toBe(4);
  expect(stats.endHp).toBe(-3);
});

test('Lots of armor', () => {
  const options = {
    startHp: 50,
    startArmor: 300,
    startHelm: 200,
    minDmg: 100,
    maxDmg: 100,
    armorPiercingPercent: 0.1,
    vsArmorPercent: 1,
    chanceToHitHead: 0.25,
    getRandomNum: getRandomFunc(),
  };

  const stats = getStats(options);
  expect(stats.hitsToKill).toBe(5);
  expect(stats.endHp).toBe(-60);
});

test('hasNineLive', () => {
  const options = {
    startHp: 60,
    startArmor: 120,
    startHelm: 120,
    minDmg: 100,
    maxDmg: 100,
    armorPiercingPercent: 0.3,
    vsArmorPercent: 1,
    chanceToHitHead: 0.25,
    hasNineLive: true,
    getRandomNum: getRandomFunc(),
  };

  const stats = getStats(options);
  expect(stats.hitsToKill).toBe(3);
  expect(stats.endHp).toBe(-92);
});

test('hasFurPadding', () => {
  const options = {
    startHp: 60,
    startArmor: 120,
    startHelm: 120,
    minDmg: 100,
    maxDmg: 100,
    armorPiercingPercent: 0.3,
    vsArmorPercent: 1,
    chanceToHitHead: 0.25,
    hasFurPadding: true,
    getRandomNum: getRandomFunc(),
  };

  const stats = getStats(options);
  expect(stats.hitsToKill).toBe(2);
  expect(stats.endHp).toBe(-38);
});

test('chanceToHitHead 0.5', () => {
  const options = {
    startHp: 60,
    startArmor: 120,
    startHelm: 120,
    minDmg: 100,
    maxDmg: 100,
    armorPiercingPercent: 0.3,
    vsArmorPercent: 1,
    chanceToHitHead: 0.5,
    getRandomNum: getHeadRandomFunc(),
  };

  const stats = getStats(options);
  expect(stats.hitsToKill).toBe(2);
  expect(stats.endHp).toBe(-10);
});

test('hasChop', () => {
  const options = {
    startHp: 60,
    startArmor: 120,
    startHelm: 120,
    minDmg: 100,
    maxDmg: 100,
    armorPiercingPercent: 0.3,
    vsArmorPercent: 1,
    chanceToHitHead: 0.5,
    hasChop: true,
    getRandomNum: getHeadRandomFunc(),
  };

  const stats = getStats(options);
  expect(stats.hitsToKill).toBe(2);
  expect(stats.endHp).toBe(-24);
});

test('hasSteelBrow', () => {
  const options = {
    startHp: 60,
    startArmor: 120,
    startHelm: 120,
    minDmg: 50,
    maxDmg: 50,
    armorPiercingPercent: 0.3,
    vsArmorPercent: 1,
    chanceToHitHead: 0.25,
    hasSteelBrow: true,
    getRandomNum: getRandomFunc(),
  };

  const stats = getStats(options);
  expect(stats.hitsToKill).toBe(5);
  expect(stats.endHp).toBe(-49);
});

test('vsArmorPercent 4', () => {
  const options = {
    startHp: 60,
    startArmor: 120,
    startHelm: 120,
    minDmg: 50,
    maxDmg: 50,
    armorPiercingPercent: 0.3,
    vsArmorPercent: 4,
    chanceToHitHead: 0.25,
    getRandomNum: getRandomFunc(),
  };

  const stats = getStats(options);
  expect(stats.hitsToKill).toBe(2);
  expect(stats.endHp).toBe(-5);
});

test('vsArmorPercent 0.5', () => {
  const options = {
    startHp: 60,
    startArmor: 100,
    startHelm: 100,
    minDmg: 50,
    maxDmg: 50,
    armorPiercingPercent: 0.3,
    vsArmorPercent: 0.5,
    chanceToHitHead: 0.25,
    getRandomNum: getRandomFunc(),
  };

  const stats = getStats(options);
  expect(stats.hitsToKill).toBe(5);
  expect(stats.endHp).toBe(-8);
});

test('hasBattleForged', () => {
  const options = {
    startHp: 100,
    startArmor: 250,
    startHelm: 100,
    minDmg: 100,
    maxDmg: 100,
    armorPiercingPercent: 0.3,
    vsArmorPercent: 1,
    chanceToHitHead: 0.25,
    hasBattleForged: true,
    getRandomNum: getRandomFunc(),
  };

  const stats = getStats(options);
  expect(stats.hitsToKill).toBe(4);
  expect(stats.endHp).toBe(-11);
});

test('hasNimble', () => {
  const options = {
    startHp: 100,
    startArmor: 120,
    startHelm: 120,
    minDmg: 100,
    maxDmg: 100,
    armorPiercingPercent: 0.3,
    vsArmorPercent: 1,
    chanceToHitHead: 0.25,
    hasNimble: true,
    totalFtg: 15,
    getRandomNum: getRandomFunc(),
  };

  const stats = getStats(options);
  expect(stats.hitsToKill).toBe(5);
  expect(stats.endHp).toBe(-37);
});

test('hasBatter', () => {
  const options = {
    startHp: 50,
    startArmor: 160,
    startHelm: 120,
    minDmg: 50,
    maxDmg: 50,
    armorPiercingPercent: 0.3,
    vsArmorPercent: 1,
    chanceToHitHead: 0.25,
    hasBatter: true,
    getRandomNum: getRandomFunc(),
  };

  const stats = getStats(options);
  expect(stats.hitsToKill).toBe(5);
  expect(stats.endHp).toBe(-36);
});

test('hasSplitMan', () => {
  const options = {
    startHp: 70,
    startArmor: 200,
    startHelm: 200,
    minDmg: 80,
    maxDmg: 80,
    armorPiercingPercent: 0.3,
    vsArmorPercent: 1,
    chanceToHitHead: 0.25,
    hasSplitMan: true,
    getRandomNum: getRandomFunc(),
  };

  const stats = getStats(options);
  expect(stats.hitsToKill).toBe(3);
  expect(stats.endHp).toBe(-6);
});

test('hasSplitMan chanceToHitHead 0.5', () => {
  const options = {
    startHp: 70,
    startArmor: 200,
    startHelm: 200,
    minDmg: 80,
    maxDmg: 80,
    armorPiercingPercent: 0.3,
    vsArmorPercent: 1,
    chanceToHitHead: 0.5,
    hasSplitMan: true,
    getRandomNum: getHeadRandomFunc(),
  };

  const stats = getStats(options);
  expect(stats.hitsToKill).toBe(3);
  expect(stats.endHp).toBe(-2);
});

test('hasSplitMan hasNineLive', () => {
  const options = {
    startHp: 70,
    startArmor: 80,
    startHelm: 130,
    minDmg: 100,
    maxDmg: 100,
    armorPiercingPercent: 0.3,
    vsArmorPercent: 1,
    chanceToHitHead: 0.25,
    hasSplitMan: true,
    hasNineLive: true,
    getRandomNum: getRandomFunc(),
  };

  const stats = getStats(options);
  expect(stats.hitsToKill).toBe(3);
  expect(stats.endHp).toBe(-112);
});
