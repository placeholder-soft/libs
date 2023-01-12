import { Command, Flags } from '@oclif/core';
import { outputFile } from '../lib/utils/fs';
import { parseEnv } from '../lib/utils/util';

export default class DiffEnv extends Command {
  static override description = 'Output diff env';

  static override examples = [
    `
  $ typed-env diff-env -p "$(prev_env)" -a "$(env)" -o ./src/.env

  output:
       prev_env: a=1 env: a=1 b=1 -> b=1
  `,
  ];

  static override flags = {
    'prev-env': Flags.string({
      char: 'p',
      description: 'enter current env',
      required: true,
    }),

    'after-env': Flags.string({
      char: 'a',
      description: 'enter change env',
      required: true,
    }),

    output: Flags.string({
      char: 'o',
      description: 'enter the output file path',
    }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(DiffEnv);

    const prev = parseEnv(flags['prev-env']);
    const after = parseEnv(flags['after-env']);

    const env: string[] = [];

    for (const [k, v] of Object.entries(after)) {
      if (prev[k] !== after[k]) {
        env.push(`${k}=${v}`);
      }
    }

    if (flags.output) {
      outputFile(flags.output, env.join('\n'));
    } else {
      console.log(env.join('\n'));
    }
  }
}
