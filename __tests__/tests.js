import { getAverageStats } from '../lib/math';


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

const getAverageEHP = options => getAverageStats(options).totalEHP;


test('simple ehp test (Steelbrow)', () => {
  const options = {
    startHp: 60,
    startArmor: 220,
    startHelm: 220,
    dmgPerHit: 60,
    armorPiercingPercent: 0.3,
    vsArmorPercent: 1,
    chanceToHitHead: 0.25,
    hasSteelBrow: true,
    getRandomNum: getRandomFunc(),
    countOfTests: 1,
  };

  const ehp = getAverageEHP(options);
  expect(ehp).toBe(302);
});


test('simple ehp test (Steelbrow)', () => {
  const options = {
    startHp: 55,
    startArmor: 220,
    startHelm: 220,
    dmgPerHit: 60,
    armorPiercingPercent: 0.3,
    vsArmorPercent: 1,
    chanceToHitHead: 0.25,
    hasSteelBrow: true,
    getRandomNum: getRandomFunc(),
    countOfTests: 1,
  };

  const ehp = getAverageEHP(options);
  expect(ehp).toBe(297);
});


test('low hp (Steelbrow)', () => {
  const options = {
    startHp: 2,
    startArmor: 220,
    startHelm: 220,
    dmgPerHit: 60,
    armorPiercingPercent: 0.3,
    vsArmorPercent: 1,
    chanceToHitHead: 0.25,
    hasSteelBrow: true,
    getRandomNum: getRandomFunc(),
    countOfTests: 1,
  };

  const ehp = getAverageEHP(options);
  expect(ehp).toBe(60);
});


test('low hp (Steelbrow)', () => {
  const options = {
    startHp: 1,
    startArmor: 220,
    startHelm: 220,
    dmgPerHit: 60,
    armorPiercingPercent: 0.3,
    vsArmorPercent: 1,
    chanceToHitHead: 0.25,
    hasSteelBrow: true,
    getRandomNum: getRandomFunc(),
    countOfTests: 1,
  };

  const ehp = getAverageEHP(options);
  expect(ehp).toBe(58);
});


test('vs armor 4 (Steelbrow)', () => {
  const options = {
    startHp: 50,
    startArmor: 100,
    startHelm: 100,
    dmgPerHit: 50,
    armorPiercingPercent: 0,
    vsArmorPercent: 4,
    chanceToHitHead: 0.25,
    hasSteelBrow: true,
    getRandomNum: getRandomFunc(),
    countOfTests: 1,
  };

  const ehp = getAverageEHP(options);
  expect(ehp).toBe(75);
});


test('simple ehp test (noPerk)', () => {
  const options = {
    startHp: 60,
    startArmor: 220,
    startHelm: 220,
    dmgPerHit: 60,
    armorPiercingPercent: 0.3,
    vsArmorPercent: 1,
    chanceToHitHead: 0.25,
    getRandomNum: getRandomFunc(),
    countOfTests: 1,
  };

  const ehp = getAverageEHP(options);
  expect(ehp).toBe(293);
});


test('head test (noPerk)', () => {
  const options = {
    startHp: 60,
    startArmor: 160,
    startHelm: 160,
    dmgPerHit: 60,
    armorPiercingPercent: 0.3,
    vsArmorPercent: 1,
    chanceToHitHead: 0.25,
    getRandomNum: getRandomFunc(),
    countOfTests: 1,
  };

  const ehp = getAverageEHP(options);
  expect(ehp).toBe(221);
});


test('head overkill (noPerk)', () => {
  const options = {
    startHp: 80,
    startArmor: 160,
    startHelm: 20,
    dmgPerHit: 60,
    armorPiercingPercent: 0.3,
    vsArmorPercent: 1,
    chanceToHitHead: 0.25,
    getRandomNum: getRandomFunc(),
    countOfTests: 1,
  };

  const ehp = getAverageEHP(options);
  expect(ehp).toBe(212);
});


test('vsArmorPercent 2 (noPerk)', () => {
  const options = {
    startHp: 1,
    startArmor: 100,
    startHelm: 100,
    dmgPerHit: 50,
    armorPiercingPercent: 0,
    vsArmorPercent: 2,
    chanceToHitHead: 0.25,
    getRandomNum: getRandomFunc(),
    countOfTests: 1,
  };

  const ehp = getAverageEHP(options);
  expect(ehp).toBe(51);
});


test('dmg vs armor - cruel falchion (noPerk)', () => {
  const options = {
    startHp: 50,
    startArmor: 110,
    startHelm: 110,
    dmgPerHit: 35,
    armorPiercingPercent: 0.2,
    vsArmorPercent: 0.7,
    chanceToHitHead: 0.25,
    getRandomNum: getRandomFunc(),
    countOfTests: 1,
  };

  const ehp = getAverageEHP(options);
  expect(ehp).toBe(228);
});


test('dmg vs armor - 2h hammer (noPerk)', () => {
  const options = {
    startHp: 60,
    startArmor: 300,
    startHelm: 300,
    dmgPerHit: 95,
    armorPiercingPercent: 0.5,
    vsArmorPercent: 2,
    chanceToHitHead: 0.25,
    getRandomNum: getRandomFunc(),
    countOfTests: 1,
  };

  const ehp = getAverageEHP(options);
  expect(ehp).toBe(145);
});


test('(Battle Forged) no armor overkill', () => {
  const options = {
    startHp: 60,
    startArmor: 200,
    startHelm: 200,
    dmgPerHit: 60,
    armorPiercingPercent: 0.3,
    vsArmorPercent: 1,
    chanceToHitHead: 0.25,
    hasBattleForged: true,
    getRandomNum: getRandomFunc(),
    countOfTests: 1,
  };

  const ehp = getAverageEHP(options);
  expect(ehp).toBe(306);
});


test('(Battle Forged) cruel falchion', () => {
  const options = {
    startHp: 50,
    startArmor: 100,
    startHelm: 100,
    dmgPerHit: 35,
    armorPiercingPercent: 0.2,
    vsArmorPercent: 0.7,
    chanceToHitHead: 0.25,
    hasBattleForged: true,
    getRandomNum: getRandomFunc(),
    countOfTests: 1,
  };

  const ehp = getAverageEHP(options);
  expect(ehp).toBe(224);
});


test('(Nimble) full powered', () => {
  const options = {
    startHp: 115,
    startArmor: 95,
    startHelm: 120,
    dmgPerHit: 80,
    armorPiercingPercent: 0.3,
    vsArmorPercent: 1,
    chanceToHitHead: 0.25,
    hasNimble: true,
    totalFtg: 15,
    getRandomNum: getRandomFunc(),
    countOfTests: 1,
  };

  const ehp = getAverageEHP(options);
  expect(ehp).toBe(415);
});


test('(noPerk) chanceToHitHead 0.5', () => {
  const options = {
    startHp: 70,
    startArmor: 60,
    startHelm: 60,
    dmgPerHit: 40,
    armorPiercingPercent: 0.3,
    vsArmorPercent: 1,
    chanceToHitHead: 0.5,
    getRandomNum: getHeadRandomFunc(),
    countOfTests: 1,
  };

  const ehp = getAverageEHP(options);
  expect(ehp).toBe(146);
});


test('(Nine Live)', () => {
  const options = {
    startHp: 40,
    startArmor: 60,
    startHelm: 60,
    dmgPerHit: 40,
    armorPiercingPercent: 0.3,
    vsArmorPercent: 1,
    chanceToHitHead: 0.25,
    hasNineLive: true,
    getRandomNum: getRandomFunc(),
    countOfTests: 1,
  };

  const ehp = getAverageEHP(options);
  expect(ehp).toBe(141);
});


test('(Split Man) body kill, with fisrt part', () => {
  const options = {
    startHp: 65,
    startArmor: 200,
    startHelm: 200,
    dmgPerHit: 80,
    armorPiercingPercent: 0.3,
    vsArmorPercent: 1,
    chanceToHitHead: 0.25,
    hasSplitMan: true,
    getRandomNum: getRandomFunc(),
    countOfTests: 1,
  };

  const ehp = getAverageEHP(options);
  expect(ehp).toBe(201);
});


test('(Split Man) head kill, with fisrt part', () => {
  const options = {
    startHp: 180,
    startArmor: 200,
    startHelm: 150,
    dmgPerHit: 80,
    armorPiercingPercent: 0.3,
    vsArmorPercent: 1,
    chanceToHitHead: 0.25,
    hasSplitMan: true,
    getRandomNum: getRandomFunc(),
    countOfTests: 1,
  };

  const ehp = getAverageEHP(options);
  expect(ehp).toBe(291);
});


test('(Split Man) head kill, with second part', () => {
  const options = {
    startHp: 200,
    startArmor: 200,
    startHelm: 150,
    dmgPerHit: 80,
    armorPiercingPercent: 0.3,
    vsArmorPercent: 1,
    chanceToHitHead: 0.25,
    hasSplitMan: true,
    getRandomNum: getRandomFunc(),
    countOfTests: 1,
  };

  const ehp = getAverageEHP(options);
  expect(ehp).toBe(302);
});


test('(Chop)', () => {
  const options = {
    startHp: 100,
    startArmor: 200,
    startHelm: 200,
    dmgPerHit: 80,
    armorPiercingPercent: 0.3,
    vsArmorPercent: 1,
    chanceToHitHead: 0.5,
    hasChop: true,
    getRandomNum: getHeadRandomFunc(),
    countOfTests: 1,
  };

  const ehp = getAverageEHP(options);
  expect(ehp).toBe(303);
});


test('(Batter) no real use of it', () => {
  const options = {
    startHp: 100,
    startArmor: 180,
    startHelm: 180,
    dmgPerHit: 80,
    armorPiercingPercent: 0.3,
    vsArmorPercent: 1,
    chanceToHitHead: 0.25,
    hasBatter: true,
    getRandomNum: getRandomFunc(),
    countOfTests: 1,
  };

  const ehp = getAverageEHP(options);
  expect(ehp).toBe(238);
});


test('(Batter)', () => {
  const options = {
    startHp: 100,
    startArmor: 180,
    startHelm: 180,
    dmgPerHit: 40,
    armorPiercingPercent: 0.3,
    vsArmorPercent: 1,
    chanceToHitHead: 0.25,
    hasBatter: true,
    getRandomNum: getRandomFunc(),
    countOfTests: 1,
  };

  const ehp = getAverageEHP(options);
  expect(ehp).toBe(264);
});
