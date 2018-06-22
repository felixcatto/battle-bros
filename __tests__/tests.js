import {
  getHitsToDie,
  getEHP,
} from '../src';


// test('count of hits are match', () => {
//   const getRandomFunc = () => {
//     let i = 0;
//     return () => {
//       i += 1;
//       return i === 1 ? 1 : 0;
//     };
//   };

//   const options = {
//     startHp: 55,
//     startArmor: 300,
//     startHelm: 300,
//     dmgPerHit: 60,
//     canShowLogs: true,
//     getRandomNum: getRandomFunc(),
//   };

//   const hitsToDie = getHitsToDie(options);
//   expect(hitsToDie).toBe(6);
// });


test('ehp are match', () => {
  const getRandomFunc = () => {
    let i = 0;
    return () => {
      i += 1;
      return i % 4 === 0 ? 1 : 0; // 0 0 0 1...
    };
  };

  const options = {
    startHp: 55,
    startArmor: 300,
    startHelm: 300,
    dmgPerHit: 60,
    getRandomNum: getRandomFunc(),
    countOfTests: 1,
    canShowLogs: true,
  };

  const ehp = getEHP(options);
  console.log(ehp);
  // 5 hits -> armor
  // 1 hit -> helm
  // 1 hit -> hp
  expect(ehp).toBe(420); // 7 hits * 60 dmgPerHit
  // expect(1).toBe(1);
});
