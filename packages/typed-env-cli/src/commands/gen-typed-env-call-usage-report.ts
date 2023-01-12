import { Command, Flags } from '@oclif/core';
import { generateTypedEnvCallUsageReport } from '../lib/generate-typed-env-call-usage-report';
import { outputFile } from '../lib/utils/fs';

export default class GenTypedEnvCallUsageReport extends Command {
  static override description = 'Generate typed-env call usage report';

  static override examples = [
    `$ typed-env gen-typed-env-call-usage-report -s ./src/index.ts -t ./tsconfig.json -o ./src/typed-env-call-usage-report.json`,
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
    const { flags } = await this.parse(GenTypedEnvCallUsageReport);

    const info = generateTypedEnvCallUsageReport({
      sourceFilePath: flags['source-file'],
      options: { tsConfigFilePath: flags.tsconfig },
    });

    if (flags.output) {
      outputFile(flags.output, JSON.stringify(info, null, 4));
    } else {
      console.log(info);
    }
  }
}
