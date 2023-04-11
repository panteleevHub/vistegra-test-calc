import { MILLIMETERS_IN_METER, LAST_PIPE } from './const.js';

export const getGapBetweenPipes = (sideLength, pipeWidth, maxGap) => {
  const side = sideLength * MILLIMETERS_IN_METER;
  let gap = maxGap * MILLIMETERS_IN_METER;

  const isEqualParts = () => {
    const length = side - pipeWidth;
    const part = gap + pipeWidth;
    const parts = length / part;
    const partsWithFixedDigit = Number(parts.toFixed(2));

    return Number.isInteger(partsWithFixedDigit);
  };

  while (!isEqualParts()) {
    gap -= 1;

    if (gap < 0) {
      gap = 0;
      break;
    }
  }

  return gap / MILLIMETERS_IN_METER;
};

export const getPipesAlongSide = (sideLength, pipeWidth, gap) => {
  const pipe = pipeWidth / MILLIMETERS_IN_METER;
  return (sideLength - pipe) / (gap + pipe) + LAST_PIPE;
};
