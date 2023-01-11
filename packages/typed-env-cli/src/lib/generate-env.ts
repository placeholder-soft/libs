import { uniqBy } from './utils/util';
import {
  generateTypedEnvCallUsageReport,
  Report,
} from './generate-typed-env-call-usage-report';

export const generateEnvName = (arg: Report) => {
  const envNames = generateTypedEnvCallUsageReport(arg).envNames.reduce(
    (pre, current) => {
      return {
        ...pre,
        [current]: current,
      };
    },
    {}
  );

  return envNames;
};

export const generateEnv = (arg: Report) => {
  const report = generateTypedEnvCallUsageReport(arg);

  const envValue = report.envNames.reduce<string[]>((acc, cur) => {
    const envInfo = report.data[cur];
    const paths = Object.keys(envInfo);

    const values = uniqBy(
      paths.map((p) => envInfo[p].default).filter((r) => r != null) as string[],
      (t) => t
    );

    if (values.length > 1) {
      acc.push(`// default=[${values.join(',')}]`);
      acc.push(`${cur}=${values[0]}`);
    } else if (values.length === 1 && values[0].length > 0) {
      if (["''", '""'].includes(values[0])) {
        acc.push(`// default=[${values.join(',')}]`);
      }
      acc.push(`${cur}=`);
    } else {
      acc.push(`${cur}=`);
    }

    return acc;
  }, []);

  return envValue;
};
