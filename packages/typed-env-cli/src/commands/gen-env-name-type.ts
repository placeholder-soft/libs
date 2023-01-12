import { Command, Flags } from '@oclif/core';
import { outputFile } from '../lib/utils/fs';
import { generateEnvName } from '../lib/generate-env';

export default class GenEnvNameType extends Command {
  static override description = 'Generate env name type definition';

  static override examples = [
    `$ typed-env gen-env-name-type -s ./src/index.ts -t ./tsconfig.json -o ./src/env.d.ts`,
  ];

  static override flags = {
    'source-file': Flags.string({
      char: 's',
      description: 'enter the file path to check',
      required: true,
    }),

    tsconfig: Flags.string({
      char: 't',
      description: 'enter the tsconfig.json path',
      required: true,
    }),

    output: Flags.string({
      char: 'o',
      description: 'enter the output file path',
    }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(GenEnvNameType);

    const envNames = generateEnvName({
      sourceFilePath: flags['source-file'],
      options: { tsConfigFilePath: flags.tsconfig },
    });

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
  }
}
