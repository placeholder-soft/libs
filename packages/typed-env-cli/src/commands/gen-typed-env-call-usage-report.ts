import { Command, Flags } from '@oclif/core';
import path from 'path';
import fs from 'fs';
import { generateTypedEnvCallUsageReport } from '../lib/generate-typed-env-call-usage-report';
import { ensureDirSync } from '../lib/utils/fs';

export default class GenTypedEnvCallUsageReport extends Command {
  static override description = 'Generate typed-env call usage report';

  static override examples = [
    `$ typed-env gen-typed-env-call-usage-report -s ./src/index.ts -t ./tsconfig.json -o ./src/typed-env-call-usage-report.json`,
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
    const { flags } = await this.parse(GenTypedEnvCallUsageReport);

    const info = generateTypedEnvCallUsageReport({
      sourceFilePath: flags['source-file'],
      options: { tsConfigFilePath: flags.tsconfig },
    });

    if (flags.output) {
      const tempstats = fs.statSync(flags.output);

      if (tempstats.isDirectory()) {
        ensureDirSync(flags.output);
        const outputFilePath = path.join(
          flags.output,
          'typed-env-call-usage-report.json'
        );
        fs.writeFileSync(outputFilePath, JSON.stringify(info));

        console.log(`output file: ${outputFilePath}`);
      } else {
        const folderPath = path.parse(flags.output);
        ensureDirSync(folderPath.dir);
        fs.writeFileSync(flags.output, JSON.stringify(info));

        console.log(`output file: ${flags.output}`);
      }
    } else {
      console.log(info);
    }
  }
}
