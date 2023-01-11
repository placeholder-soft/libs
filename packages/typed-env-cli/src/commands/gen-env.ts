import { Command, Flags } from '@oclif/core';
import path from 'path';
import fs from 'fs';
import { ensureDirSync } from '../lib/utils/fs';
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
      const tempstats = fs.statSync(flags.output);

      if (tempstats.isDirectory()) {
        ensureDirSync(flags.output);
        const outputFilePath = path.join(flags.output, '.env');
        fs.writeFileSync(outputFilePath, info.join('\n'));

        console.log(`output file: ${outputFilePath}`);
      } else {
        const folderPath = path.parse(flags.output);
        ensureDirSync(folderPath.dir);
        fs.writeFileSync(flags.output, info.join('\n'));

        console.log(`output file: ${flags.output}`);
      }
    } else {
      console.log(info);
    }
  }
}
