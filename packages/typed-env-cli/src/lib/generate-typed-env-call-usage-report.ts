import { CompilerOptionsContainer, ProjectOptions, ts } from 'ts-morph';
import { generateCallUsageReport } from './function-call/generate-call-usage-report';
import { TParseParameters } from './function-call/types';
import { uniqBy } from './utils/util';

type TResult = {
  required: boolean;
  type: string;
  default?: string;
  errorMsg?: string;
};

type TFunCallArg = {
  [envKey in string]: { [path in string]: TResult };
};

export type Report = { sourceFilePath: string; options?: ProjectOptions };

/**
 * @description Get the call report of all typedEnv functions
 */
export function generateTypedEnvCallUsageReport({
  sourceFilePath,
  options,
}: Report) {
  return generateCallUsageReport({
    sourceFilePath,
    options,
    chainCallFuncNames: [
      'typedEnv',
      'default',
      'required',
      'optional',
      'toString',
      'toInt',
      'toBoolean',
    ],
    convertData: (
      data: TParseParameters[][],
      { compilerOptions }: { compilerOptions: ts.CompilerOptions }
    ) => {
      const result = parseEnvInfo(data, compilerOptions);
      const exceptionResult = exceptionReport(result);
      return {
        envNames: Object.keys(result),
        data: result,
        exceptionReport: exceptionResult,
      };
    },
  });
}

const exceptionReport = (data: TFunCallArg) => {
  const envNames = Object.keys(data);

  return envNames
    .map((r) => {
      const env = data[r];
      const paths = Object.keys(env);

      const errors = [];
      const warnings = [];

      const types = uniqBy(
        paths.map((p) => env[p].type),
        (t) => t
      );

      if (types.length > 0) {
        errors.push(`envKey: ${r} has different types: ${types.join(',')}`);
      }

      const defaultValue = uniqBy(
        paths.map((p) => env[p].default).filter((r) => r != null) as string[],
        (t) => t
      );

      if (defaultValue.length > 0) {
        warnings.push(
          `envKey: ${r} has different default value: ${defaultValue.join(',')}`
        );
      }

      const line = paths
        .map((p) => ({
          path: p,
          errors: env[p].errorMsg,
        }))
        .filter((e) => e != null);

      if (errors.length === 0 && warnings.length === 0 && line.length === 0) {
        return;
      }

      return {
        envKey: r,
        types,
        line,
        errors,
        warnings,
      };
    })
    .filter((r) => r != null);
};

const parseEnvInfo = (
  result: TParseParameters[][],
  compilerOptions: ts.CompilerOptions
) => {
  return result.reduce<TFunCallArg>((acc, cur) => {
    if (cur == null) {
      return acc;
    }
    const value = parseCallChaining(cur, compilerOptions);

    if (value == null) {
      return acc;
    }

    const secret = acc[value.envKey];

    if (secret) {
      if (secret[value.path] == null) {
        secret[value.path] = {
          required: value.required,
          type: value.type,
          ...(value.default ? { default: value.default } : {}),
        };
      }
    } else {
      acc[value.envKey] = {
        [value.path]: {
          required: value.required,
          type: value.type,
          ...(value.default ? { default: value.default } : {}),
        },
      };
    }
    return acc;
  }, {});
};

const parseCallChaining = (
  args: TParseParameters[],
  compilerOptions: ts.CompilerOptions
) => {
  const typeEnvInfo = args.find((r) => r.funcName === 'typedEnv');

  if (typeEnvInfo == null) {
    return;
  }

  const defaultInfo = args.find((r) => r.funcName === 'default');

  const optionalInfoIndex = args.findIndex((r) => r.funcName === 'optional');
  const requiredInfoIndex = args.findIndex((r) => r.funcName === 'required');

  const toStringInfo = args.find((r) => r.funcName === 'toString');
  const toInt = args.find((r) => r.funcName === 'toInt');
  const toBoolean = args.find((r) => r.funcName === 'toBoolean');

  if (
    typeEnvInfo.args[0] != null &&
    ["''", '""'].includes(typeEnvInfo.args[0])
  ) {
    // console.warn(
    //   `not support envKey is not \"\" or '' in ${typeEnvInfo.path}`
    // );

    return;
  }

  // Remove the front and back quotation marks of the string
  const envKey: string = typeEnvInfo.args[0].substring(
    1,
    typeEnvInfo.args[0].length - 1
  );

  let errorMsg = '';

  const type = toStringInfo
    ? 'string'
    : toInt
    ? 'number'
    : toBoolean
    ? 'boolean'
    : 'string';

  switch (type) {
    case 'number': {
      try {
        const toIntArg = parseInt(toInt!.args[0]);
        if (toIntArg < 2 || toIntArg > 36) {
          errorMsg = `radix must be between 2 and 36, but got ${toIntArg}`;
        }
      } catch (e) {
        errorMsg = `parseInt(${args[0]}) is not a number`;
      }
      break;
    }
    case 'boolean': {
      const toBooleanArg = toBoolean!.args[0];
      if (toBooleanArg !== 'true' && toBooleanArg !== 'false') {
        errorMsg = `toBoolean(${toBooleanArg}) is not a boolean`;
      }
      break;
    }
  }

  return {
    envKey,
    path: typeEnvInfo.path.replace(
      new RegExp(`^${compilerOptions.rootDir}`, 'g'),
      ''
    ),
    required:
      (optionalInfoIndex === -1 && requiredInfoIndex !== -1) ||
      optionalInfoIndex > requiredInfoIndex,
    type,
    ...(defaultInfo
      ? {
          default: defaultInfo.args[0],
        }
      : {}),
    ...(errorMsg.length > 0 ? { errorMsg } : {}),
  };
};
