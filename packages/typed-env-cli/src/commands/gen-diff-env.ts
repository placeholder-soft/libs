import { Command, Flags } from '@oclif/core';
import { parseEnv } from '../lib/utils/util';
import path from 'path';
import fs from 'fs';
import { ensureDirSync } from '../lib/utils/fs';

export default class GenDiffEnv extends Command {
  static override description = 'Generate diff env';

  static override examples = [`$ typed-env diff-env -p "$(env)" -a "$(env)"`];

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
    const { flags } = await this.parse(GenDiffEnv);

    const prev = parseEnv(flags['prev-env']);
    const after = parseEnv(flags['after-env']);

    const env: string[] = [];

    for (const [k, v] of Object.entries(after)) {
      if (prev[k] !== after[k]) {
        env.push(`${k}=${v}`);
      }
    }

    if (flags.output) {
      const tempstats = fs.statSync(flags.output);

      if (tempstats.isDirectory()) {
        ensureDirSync(flags.output);
        const outputFilePath = path.join(flags.output, '.env');
        fs.writeFileSync(outputFilePath, env.join('\n'));

        console.log(`output file: ${outputFilePath}`);
      } else {
        const folderPath = path.parse(flags.output);
        ensureDirSync(folderPath.dir);
        fs.writeFileSync(flags.output, env.join('\n'));

        console.log(`output file: ${flags.output}`);
      }
    } else {
      console.log(env.join('\n'));
    }
  }
}
