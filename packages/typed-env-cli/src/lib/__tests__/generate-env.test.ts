import { existsSync } from 'fs';
import path from 'path';
import { generateEnv, generateEnvName } from '../generate-env';

const kSourceFilePath = path.resolve(
  __dirname,
  '../__fixtures__/usage-typed-env.ts'
);
const kTsconfigPath = path.resolve(
  __dirname,
  '../__fixtures__/tsconfig.t.json'
);

test('generate env name', () => {
  const kOutputPath = path.resolve(__dirname, '../__fixtures__/env-name.ts');
  generateEnvName({
    sourceFilePath: kSourceFilePath,
    options: {
      tsConfigFilePath: kTsconfigPath,
    },
    output: kOutputPath,
  });
  expect(existsSync(kOutputPath)).toBe(true);
});

test('generate env', () => {
  const kOutputPath = path.resolve(__dirname, '../__fixtures__/.env');
  generateEnv({
    sourceFilePath: kSourceFilePath,
    options: {
      tsConfigFilePath: kTsconfigPath,
    },
    output: kOutputPath,
  });
  expect(existsSync(kOutputPath)).toBe(true);
});
