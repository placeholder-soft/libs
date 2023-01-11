import { Command, Flags } from '@oclif/core';
import { parseEnv } from '../lib/utils/util';

export default class DiffEnv extends Command {
  static override description = 'Output diff env';

  static override examples = [`$ typed-env diff-env -a "$(env)" -p "$(env)"`];

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

    console.log(env);
  }
}
