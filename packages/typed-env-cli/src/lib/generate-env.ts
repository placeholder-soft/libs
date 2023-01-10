import fs from 'fs';
import path from 'path';
import { ensureDirSync } from './utils/fs';
import { uniqBy } from './utils/util';
import {
  generateTypedEnvCallUsageReport,
  Report,
} from './generate-typed-env-call-usage-report';

export const generateEnvName = (arg: Report & { output: string }) => {
  const envNames = generateTypedEnvCallUsageReport(arg).envNames.reduce(
    (pre, current) => {
      return {
        ...pre,
        [current]: current,
      };
    },
    {}
  );
  const fileContent = `export const AllProjectEnvNames = ${JSON.stringify(
    envNames,
    null,
    2
  )} as const;
export type ProjectEnvName = keyof typeof AllProjectEnvNames;`;

  const folderPath = path.parse(arg.output);
  ensureDirSync(folderPath.dir);
  fs.writeFileSync(arg.output, fileContent);
};

export const generateEnv = (arg: Report & { output: string }) => {
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

  const folderPath = path.parse(arg.output);
  ensureDirSync(folderPath.dir);
  fs.writeFileSync(arg.output, envValue.join('\n'));
};
