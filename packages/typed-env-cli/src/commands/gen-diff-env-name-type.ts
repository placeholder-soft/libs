import { Command, Flags } from '@oclif/core';
import { parseEnv } from '../lib/utils/util';
import path from 'path';
import fs from 'fs';
import { ensureDirSync } from '../lib/utils/fs';

export default class GenDiffEnvNameType extends Command {
  static override description = 'Generate diff env name type definition';

  static override examples = [
    `$ typed-env diff-env-name -p "$(env)" -a "$(env)"`,
  ];

  static override flags = {
    'prev-env': Flags.string({
      char: 'p',
      description: 'enter current env json',
      required: true,
    }),

    'after-env': Flags.string({
      char: 'a',
      description: 'enter change env json',
      required: true,
    }),

    output: Flags.string({
      char: 'o',
      description: 'enter the output file path',
    }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(GenDiffEnvNameType);

    const prev = parseEnv(flags['prev-env']);
    const after = parseEnv(flags['after-env']);

    const envNames: { [key in string]: string } = {};
    for (const [k] of Object.entries(after)) {
      // only print changed vars
      if (prev[k] !== after[k]) {
        envNames[k] = k;
      }
    }

    const fileContent = `export const AllProjectDiffEnvNames = ${JSON.stringify(
      envNames,
      null,
      2
    )} as const;
export type ProjectDiffEnvName = keyof typeof AllProjectDiffEnvNames;`;

    if (flags.output) {
      const tempstats = fs.statSync(flags.output);

      if (tempstats.isDirectory()) {
        ensureDirSync(flags.output);
        const outputFilePath = path.join(flags.output, 'env.d.ts');
        fs.writeFileSync(outputFilePath, fileContent);

        console.log(`output file: ${outputFilePath}`);
      } else {
        const folderPath = path.parse(flags.output);
        ensureDirSync(folderPath.dir);
        fs.writeFileSync(flags.output, fileContent);

        console.log(`output file: ${flags.output}`);
      }
    } else {
      console.log(fileContent);
    }
  }
}
