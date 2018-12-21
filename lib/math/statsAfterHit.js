import { commonCalc, NMBL } from './strategyCommon';
import { splitMan } from './strategySplitMan';


export default (options) => {
  const {
    hasNimble,
    hasSplitMan,
  } = options;

  if (hasSplitMan) {
    return splitMan;
  }

  if (hasNimble) {
    return NMBL;
  }

  return commonCalc;
};
