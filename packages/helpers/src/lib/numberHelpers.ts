export const randomNumber = (
  countBeforeDot: number,
  countAfterDot = 0
): number => {
  return Number((Math.random() * 10 ** countBeforeDot).toFixed(countAfterDot));
};

export const randomIntegerInRange = (max: number, min = 0): number => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
