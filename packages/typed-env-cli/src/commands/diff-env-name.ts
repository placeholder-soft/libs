import { Command, Flags } from '@oclif/core';
import { parseEnv } from '../lib/utils/util';

export default class DiffEnvName extends Command {
  static override description = 'Output diff env name';

  static override examples = [
    `$ typed-env diff-env-name -a "$(env)" -p "$(env)"`,
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
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(DiffEnvName);

    const prev = parseEnv(flags['prev-env']);
    const after = parseEnv(flags['after-env']);

    const names: { [key in string]: string } = {};
    for (const [k] of Object.entries(after)) {
      // only print changed vars
      if (prev[k] !== after[k]) {
        names[k] = k;
      }
    }

    console.log(names);
  }
}
