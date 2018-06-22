import {
  getHitsToDie,
  getEHP,
} from '../src';


test('count of hits are match', () => {
  const getRandomFunc = () => {
    let i = 0;
    return () => {
      i += 1;
      return i === 1 ? 1 : 0;
    };
  };

  const options = {
    startHp: 55,
    startArmor: 300,
    startHelm: 300,
    dmgPerHit: 60,
    canShowLogs: true,
    getRandomNum: getRandomFunc(),
  };

  const hitsToDie = getHitsToDie(options);
  expect(hitsToDie).toBe(6);
});


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
//     // getRandomNum: getRandomFunc(),
//   };

//   console.log(getEHP(options));
//   const hitsToDie = getHitsToDie(options);
//   expect(hitsToDie).toBe(6);
// });
