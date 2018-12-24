import { commonCalc, NMBL } from './strategyCommon';
import { splitMan } from './strategySplitMan';
import { batter, batterNimble } from './strategyBatter';


export default (options) => {
  const {
    hasNimble,
    hasSplitMan,
    hasBatter,
  } = options;

  if (hasSplitMan) {
    return splitMan;
  }

  if (hasBatter) {
    if (hasNimble) {
      return batterNimble;
    }
    return batter;
  }

  if (hasNimble) {
    return NMBL;
  }

  return commonCalc;
};
