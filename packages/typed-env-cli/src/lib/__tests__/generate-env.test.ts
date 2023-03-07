import path from 'path';
import {
  generateEnvByTypedEnv,
  generateEnvNameByTypedEnv,
} from '../generate-env';

describe('call chaining', () => {
  const kSourceFilePath = path.resolve(
    __dirname,
    '../__fixtures__/usage-typed-env.ts'
  );
  const kTsconfigPath = path.resolve(
    __dirname,
    '../__fixtures__/tsconfig.t.json'
  );

  test('generate env name', () => {
    const envNames = generateEnvNameByTypedEnv({
      sourceFilePath: kSourceFilePath,
      options: {
        tsConfigFilePath: kTsconfigPath,
      },
    });
    expect(envNames).toMatchSnapshot();
  });

  test('generate env', () => {
    const env = generateEnvByTypedEnv({
      sourceFilePath: kSourceFilePath,
      options: {
        tsConfigFilePath: kTsconfigPath,
      },
    });
    expect(env).toMatchSnapshot();
  });
});

describe('assignment', () => {
  const kSourceFilePath = path.resolve(
    __dirname,
    '../__fixtures__/assignment-typed-env.ts'
  );
  const kTsconfigPath = path.resolve(
    __dirname,
    '../__fixtures__/tsconfig.t.json'
  );
  test('generate env name', () => {
    const envNames = generateEnvNameByTypedEnv({
      sourceFilePath: kSourceFilePath,
      options: {
        tsConfigFilePath: kTsconfigPath,
      },
    });
    expect(envNames).toMatchSnapshot();
  });

  test('generate env', () => {
    const env = generateEnvByTypedEnv({
      sourceFilePath: kSourceFilePath,
      options: {
        tsConfigFilePath: kTsconfigPath,
      },
    });
    expect(env).toMatchSnapshot();
  });
});
