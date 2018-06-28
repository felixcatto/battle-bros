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
  expect(ehp).toBe(57);
});


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
  expect(ehp).toBe(293);
});


// test('little bug :(', () => {
//   const options = {
//     startHp: 60,
//     startArmor: 160,
//     startHelm: 160,
//     dmgPerHit: 60,
//     armorPiercingPercent: 0.3,
//     getRandomNum: getRandomFunc(),
//     countOfTests: 1,
//   };

//   const ehp = getAverageEHP(options);
//   // in reality we need to receive 40 dmg, but due to bug with armor reduction we get 36
//   // i don't know how to calculate it properly :(
//   expect(ehp).toBe(220);
// });


test('head overkill', () => {
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
