import {
  getAverageEHP,
} from '../src';


const getRandomFunc = () => {
  let i = 0;
  return () => {
    i += 1;
    return i % 4 === 0 ? 1 : 0; // armor armor armor helm...
  };
};


test('simple ehp test (steelbrow)', () => {
  const options = {
    startHp: 60,
    startArmor: 220,
    startHelm: 220,
    dmgPerHit: 60,
    armorPiercingPercent: 0.3,
    hasSteelBrow: true,
    getRandomNum: getRandomFunc(),
    countOfTests: 1,
  };

  const ehp = getAverageEHP(options);
  expect(ehp).toBe(302);
});


test('simple ehp test (steelbrow)', () => {
  const options = {
    startHp: 55,
    startArmor: 220,
    startHelm: 220,
    dmgPerHit: 60,
    armorPiercingPercent: 0.3,
    hasSteelBrow: true,
    getRandomNum: getRandomFunc(),
    countOfTests: 1,
  };

  const ehp = getAverageEHP(options);
  expect(ehp).toBe(297);
});


test('low hp (steelbrow)', () => {
  const options = {
    startHp: 2,
    startArmor: 220,
    startHelm: 220,
    dmgPerHit: 60,
    armorPiercingPercent: 0.3,
    hasSteelBrow: true,
    getRandomNum: getRandomFunc(),
    countOfTests: 1,
  };

  const ehp = getAverageEHP(options);
  expect(ehp).toBe(60);
});


test('low hp (steelbrow)', () => {
  const options = {
    startHp: 1,
    startArmor: 220,
    startHelm: 220,
    dmgPerHit: 60,
    armorPiercingPercent: 0.3,
    hasSteelBrow: true,
    getRandomNum: getRandomFunc(),
    countOfTests: 1,
  };

  const ehp = getAverageEHP(options);
  expect(ehp).toBe(58);
});


test('simple ehp test (noPerk)', () => {
  const options = {
    startHp: 60,
    startArmor: 220,
    startHelm: 220,
    dmgPerHit: 60,
    armorPiercingPercent: 0.3,
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
    getRandomNum: getRandomFunc(),
    countOfTests: 1,
  };

  const ehp = getAverageEHP(options);
  expect(ehp).toBe(212);
});
