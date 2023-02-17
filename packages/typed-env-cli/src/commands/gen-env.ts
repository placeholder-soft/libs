import { Command, Flags } from '@oclif/core';
import { outputFile } from '../lib/utils/fs';
import { generateEnvByTypedEnv } from '../lib/generate-env';
import { loading } from '../utils/utils';

export default class GenEnvByTypedEnv extends Command {
  static override description = 'Generate .env by typedEnv';

  static override examples = [
    `$ typed-env gen-env -s ./src/index.ts -t ./tsconfig.json -o ./src/.env`,
  ];

  static override flags = {
    'source-file': Flags.string({
      char: 's',
      description: 'enter the file path(.ts) to check',
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
    const { flags } = await this.parse(GenEnvByTypedEnv);

    const timer = loading('Generating .env by typedEnv');

    const info = generateEnvByTypedEnv({
      sourceFilePath: flags['source-file'],
      options: { tsConfigFilePath: flags.tsconfig },
    });

    if (flags.output) {
      outputFile(flags.output, info.join('\n'));
    } else {
      console.log(info);
    }
    timer.stop();
  }
}
