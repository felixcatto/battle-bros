export const getNimbleDmgReduction = totalFtg => {
  let rawNibleReduction;
  const diffFtg = Math.max(totalFtg - 15, 0);
  if (diffFtg <= 5) {
    rawNibleReduction = Math.floor(diffFtg * 1.49);
  } else if (diffFtg <= 8) {
    rawNibleReduction = Math.floor(diffFtg * 1.55);
  } else if (diffFtg <= 10) {
    rawNibleReduction = Math.floor(diffFtg * 1.6);
  } else if (diffFtg <= 13) {
    rawNibleReduction = Math.floor(diffFtg * 1.7);
  } else if (diffFtg <= 16) {
    rawNibleReduction = Math.floor(diffFtg * 1.75);
  } else if (diffFtg <= 20) {
    rawNibleReduction = Math.floor(diffFtg * 1.8);
  } else if (diffFtg <= 24) {
    rawNibleReduction = Math.floor(diffFtg * 1.9);
  } else if (diffFtg <= 28) {
    rawNibleReduction = Math.floor(diffFtg * 1.95);
  } else if (diffFtg <= 29) {
    rawNibleReduction = Math.floor(diffFtg * 1.99);
  } else {
    rawNibleReduction = 60;
  }
  return (rawNibleReduction + 40) / 100;
};

export const getBFDmgReduction = (armor, help) => 1 - (armor + help) * 0.01 * 0.05;

export const getHeadDmgMult = (struckPartName, hasSteelBrow, hasChop) => {
  let headDmgModifier;
  if (struckPartName === 'head' && !hasSteelBrow) {
    if (hasChop) {
      headDmgModifier = 2;
    } else {
      headDmgModifier = 1.5;
    }
  } else {
    headDmgModifier = 1;
  }
  return headDmgModifier;
};

export const getRandomInRange = (start, end) =>
  Math.floor(Math.random() * (end - start + 1) + start);
