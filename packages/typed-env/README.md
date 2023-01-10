# typed-env

typed-env can help us better handle environment variables

## [Methods](#use-typed-env-lib)

- [typeEnv](#typeEnv-lib)
- [anyEnv](#anyEnv-lib)

## Install

```bash
npm install typed-env
```

## <span id="use-typed-env-lib">Use typed-env</span>

### <span id="typeEnv-lib">typeEnv</span>

```typescript
/**
 * @param key env key
 * @returns EnvBox
 */
export declare function typedEnv<T extends string>(
  key: T
): EnvBox<NodeJS.ProcessEnv[T]>;

typedEnv<T>('TEST').required().toInt();
```

### <span id="anyEnv-lib">anyEnv</span>

```typescript
/**
 * @param key env key
 * @returns EnvBox
 */
function anyEnv(key) {
  return env_box_1.EnvBox.of(key);
}
anyEnv('TEST').required().toInt();
```
