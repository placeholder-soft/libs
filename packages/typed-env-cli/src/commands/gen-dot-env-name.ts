import { Command, Flags } from '@oclif/core';
import { generateDotEnvName } from '../lib/generate-env';
import { outputFile } from '../lib/utils/fs';
import { loading } from '../utils/utils';

export default class GenDotEnvName extends Command {
  static override description = 'Generate .env name type definition';

  static override examples = [
    `$ typed-env gen-dot-env-name -s .env -o ./src/env.d.ts`,
  ];

  static override flags = {
    'source-file': Flags.string({
      char: 's',
      description: 'enter the file path to check',
      required: true,
    }),

    output: Flags.string({
      char: 'o',
      description: 'enter the output file path',
    }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(GenDotEnvName);

    const timer = loading('Generating .env name type definition');

    const envNames = generateDotEnvName(flags['source-file']);

    const fileContent = `export const AllProjectEnvNames = ${JSON.stringify(
      envNames,
      null,
      2
    )} as const;
export type ProjectEnvName = keyof typeof AllProjectEnvNames;`;

    if (flags.output) {
      outputFile(flags.output, fileContent);
    } else {
      console.log(fileContent);
    }

    timer.stop();
  }
}
