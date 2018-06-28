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


test('simple ehp test', () => {
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
  expect(ehp).toBe(302);
});


test('simple ehp test', () => {
  const options = {
    startHp: 55,
    startArmor: 220,
    startHelm: 220,
    dmgPerHit: 60,
    armorPiercingPercent: 0.3,
    getRandomNum: getRandomFunc(),
    countOfTests: 1,
  };

  const ehp = getAverageEHP(options);
  expect(ehp).toBe(297);
});


test('low hp', () => {
  const options = {
    startHp: 2,
    startArmor: 220,
    startHelm: 220,
    dmgPerHit: 60,
    armorPiercingPercent: 0.3,
    getRandomNum: getRandomFunc(),
    countOfTests: 1,
  };

  const ehp = getAverageEHP(options);
  expect(ehp).toBe(60);
});


test('low hp', () => {
  const options = {
    startHp: 1,
    startArmor: 220,
    startHelm: 220,
    dmgPerHit: 60,
    armorPiercingPercent: 0.3,
    getRandomNum: getRandomFunc(),
    countOfTests: 1,
  };

  const ehp = getAverageEHP(options);
  expect(ehp).toBe(57);
});
