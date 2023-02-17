export const loading = (str: string) => {
  const P = ['\\', '|', '/', '-'];
  let x = 0;
  const timer = setInterval(() => {
    process.stdout.write(`\r${str} ${P[x++]}`);
    x &= 3;
  }, 250);

  return {
    stop: () => {
      clearInterval(timer);
      process.stdout.write('\r');
    },
  };
};
