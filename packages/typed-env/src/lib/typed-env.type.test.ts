import { expectType } from 'tsd';
import { typedEnv } from './typed-env';

test('string', () => {
  process.env['TEST'] = 'abc';
  expectType<string>(typedEnv('TEST').required().toString());
  expectType<string | undefined>(typedEnv('TEST').optional().toString());
});

test('number', () => {
  process.env['TEST'] = '1';
  expectType<number>(typedEnv('TEST').required().toInt());
  expectType<number | undefined>(typedEnv('TEST').optional().toInt());
  expectType<number>(typedEnv('TEST').required().optional().toInt());
  expectType<number>(typedEnv('TEST').optional().required().toInt());
});

test('boolean', () => {
  process.env['TEST'] = 'true';
  expectType<boolean>(typedEnv('TEST').required().toBoolean());
  expectType<boolean | undefined>(typedEnv('TEST').optional().toBoolean());
  expectType<boolean | undefined>(typedEnv('TEST').toBoolean());
  expectType<boolean>(typedEnv('TEST').required().optional().toBoolean());
  expectType<boolean>(typedEnv('TEST').optional().required().toBoolean());
});

test('default', () => {
  expectType<string>(typedEnv('TEST_DEFAAULT').default('abc').toString());
  expectType<string>(
    typedEnv('TEST_DEFAAULT').default('abc').optional().toString()
  );
  expectType<string>(
    typedEnv('TEST_DEFAAULT').default('abc').required().toString()
  );
  expectType<number>(typedEnv('TEST_DEFAAULT').default('1').toInt());
  expectType<boolean>(typedEnv('TEST_DEFAAULT').default('true').toBoolean());
});
