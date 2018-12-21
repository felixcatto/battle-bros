export const getNimbleDmgReduction = (totalFtg) => {
  let rawNibleReduction;
  const diffFtg = Math.max(totalFtg - 15, 0);
  if (diffFtg <= 8) {
    rawNibleReduction = Math.floor(diffFtg * 1.5);
  } else if (diffFtg <= 12) {
    rawNibleReduction = Math.floor(diffFtg * 1.6);
  } else if (diffFtg <= 16) {
    rawNibleReduction = Math.floor(diffFtg * 1.69);
  } else if (diffFtg <= 20) {
    rawNibleReduction = Math.floor(diffFtg * 1.76);
  } else if (diffFtg <= 25) {
    rawNibleReduction = Math.floor(diffFtg * 1.8);
  } else if (diffFtg <= 27) {
    rawNibleReduction = Math.floor(diffFtg * 1.84);
  } else if (diffFtg <= 33) {
    rawNibleReduction = Math.floor(diffFtg * 1.89);
  } else if (diffFtg <= 35) {
    rawNibleReduction = Math.floor(diffFtg * 1.92);
  } else {
    rawNibleReduction = 67;
  }
  return (rawNibleReduction + 33) / 100;
};


export const getBFDmgReduction = (armor, help) => 1 - (armor + help) * 0.01 * 0.05;
