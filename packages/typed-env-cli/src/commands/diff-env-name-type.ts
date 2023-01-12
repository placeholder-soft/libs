import { Command, Flags } from '@oclif/core';
import { outputFile } from '../lib/utils/fs';
import { parseEnv } from '../lib/utils/util';

export default class DiffEnvNameType extends Command {
  static override description = 'Output diff env name type definition';

  static override examples = [
    `$ typed-env diff-env-name-type -p "$(prev_env)" -a "$(env)" -o ./src/env.d.ts`,
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
    const { flags } = await this.parse(DiffEnvNameType);

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
      outputFile(flags.output, fileContent);
    } else {
      console.log(fileContent);
    }
  }
}
