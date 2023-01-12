# typed-env

typed-env can help us better handle environment variables

## [Methods](#usage-typed-env-cli)

### [commands](#usage-typed-env-cli)

- [diff-env](#diff-env)
- [diff-env-name-type](#diff-env-name-type)
- [gen-env](#gen-env)
- [gen-env-name-type](#gen-env-name-type)
- [gen-typed-env-call-usage-report](#gen-typed-env-call-usage-report)

### [lib](#usage-typed-env)

- [`typeEnv`](#typeenv)
- [`anyEnv`](#anyenv)

## Install

`typed-env-cli`

```bash
$ npm install -g @placeholdersoft/typed-env-cli
```

`typed-env`

```bash
$ npm install @placeholdersoft/typed-env
```

## Usage typed-env-cli

### `diff-env`

```
Output diff env

USAGE
  $ typed-env diff-env -p <value> -a <value> [-o <value>]

FLAGS
  -a, --after-env=<value>  (required) enter change env json
  -o, --output=<value>     enter the output file path
  -p, --prev-env=<value>   (required) enter current env json

DESCRIPTION
  Output diff env

EXAMPLES
    $ typed-env diff-env -p "$(prev_env)" -a "$(env)"
    output:
         prev_env: {a: 1} env: {b: 1} -> {b: 1}
```

### `diff-env-name-type`

```
Output diff env name type definition

USAGE
  $ typed-env diff-env-name-type -p <value> -a <value> [-o <value>]

FLAGS
  -a, --after-env=<value>  (required) enter change env json
  -o, --output=<value>     enter the output file path
  -p, --prev-env=<value>   (required) enter current env json

DESCRIPTION
  Output diff env name type definition

EXAMPLES
  $ typed-env diff-env-name-type -p "$(prev_env)" -a "$(env)"
```

### `gen-env`

```
Generate .env

USAGE
  $ typed-env gen-env -s <value> -t <value> [-o <value>]

FLAGS
  -o, --output=<value>       enter the output file path
  -s, --source-file=<value>  (required) enter the file path to check
  -t, --tsconfig=<value>     (required) enter the tsconfig.json path

DESCRIPTION
  Generate .env

EXAMPLES
  $ typed-env gen-env -s ./src/index.ts -t ./tsconfig.json -o ./src/.env
```

### `gen-env-name-type`

```
Generate env name type definition

USAGE
  $ typed-env gen-env-name-type -s <value> -t <value> [-o <value>]

FLAGS
  -o, --output=<value>       enter the output file path
  -s, --source-file=<value>  (required) enter the file path to check
  -t, --tsconfig=<value>     (required) enter the tsconfig.json path

DESCRIPTION
  Generate env name type definition

EXAMPLES
  $ typed-env gen-env-name-type -s ./src/index.ts -t ./tsconfig.json -o ./src/env.d.ts
```

### `gen-typed-env-call-usage-report`

```
Generate typed-env call usage report

USAGE
  $ typed-env gen-typed-env-call-usage-report -s <value> -t <value> [-o <value>]

FLAGS
  -o, --output=<value>       enter the output file path
  -s, --source-file=<value>  (required) enter the file path to check
  -t, --tsconfig=<value>     (required) enter the tsconfig.json path

DESCRIPTION
  Generate typed-env call usage report

EXAMPLES
  $ typed-env gen-typed-env-call-usage-report -s ./src/index.ts -t ./tsconfig.json -o ./src/typed-env-call-usage-report.json
```

## Usage typed-env

### `typeEnv`

```typescript
// Support evn-name type check
/**
 * @param key env key
 * @returns EnvBox
 */
export declare function typedEnv<T extends string>(
  key: T
): EnvBox<NodeJS.ProcessEnv[T]>;

type EnvName = 'NODE_VERSION' | 'PORT' | 'LOG_LEVEL'

typedEnv<EnvName>('PORT').required().toInt(); // ok

typedEnv<EnvName>('DEBUG').required().toInt(); // error: env name not found
```

### `anyEnv`

```typescript
/**
 * @param key env key
 * @returns EnvBox
 */
export declare function typedEnv(key: string): EnvBox;

anyEnv('DEBUG').required().toInt(); // ok
```
