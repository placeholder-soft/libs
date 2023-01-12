import { Command, Flags } from '@oclif/core';
import { outputFile } from '../lib/utils/fs';
import { generateEnv } from '../lib/generate-env';

export default class GenEnv extends Command {
  static override description = 'Generate .env';

  static override examples = [
    `$ typed-env gen-env -s ./src/index.ts -t ./tsconfig.json -o ./src/.env`,
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
    const { flags } = await this.parse(GenEnv);

    const info = generateEnv({
      sourceFilePath: flags['source-file'],
      options: { tsConfigFilePath: flags.tsconfig },
    });

    if (flags.output) {
      outputFile(flags.output, info.join('\n'));
    } else {
      console.log(info);
    }
  }
}
