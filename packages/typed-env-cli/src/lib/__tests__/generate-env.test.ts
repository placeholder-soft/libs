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
  const envNames = generateEnvName({
    sourceFilePath: kSourceFilePath,
    options: {
      tsConfigFilePath: kTsconfigPath,
    },
  });
  console.log(envNames);
});

test('generate env', () => {
  const env = generateEnv({
    sourceFilePath: kSourceFilePath,
    options: {
      tsConfigFilePath: kTsconfigPath,
    },
  });
  console.log(env);
});
