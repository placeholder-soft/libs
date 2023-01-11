import { Project } from 'ts-morph';
import { getCallUsageArgsFromStatement } from './get-args/statement';
import {
  hasConvertData,
  TCallUsageArgs,
  TGenerateCallUsageReport,
  TGenerateCallUsageReportBase,
  TParseParameters,
} from './types';

function callUsageArgs<T>(args: TCallUsageArgs): TParseParameters[][] {
  const {
    sourceFile,
    chainCallFuncNames,
    analysisPathIgnorePatterns = true,
  } = args;

  const filePath = sourceFile.getFilePath();
  if (analysisPathIgnorePatterns) {
    if (filePath.includes('node_modules')) {
      return [];
    }
  }
  const result = [];

  result.push(
    ...getCallUsageArgsFromStatement({
      source: sourceFile,
      filePath,
      chainCallFuncNames,
    })
  );

  const files = sourceFile.getReferencedSourceFiles();
  if (files.length > 0) {
    for (const f of files) {
      result.push(
        ...callUsageArgs<T>({
          sourceFile: f,
          chainCallFuncNames,
          analysisPathIgnorePatterns,
        })
      );
    }
  }

  return result;
}

/**
 * @description Get the call report of the function
 */
export function generateCallUsageReport<T>(
  arg: TGenerateCallUsageReportBase
): TParseParameters[][];
export function generateCallUsageReport<T>(
  args: TGenerateCallUsageReport<T>
): T;

export function generateCallUsageReport<T>(
  args: TGenerateCallUsageReportBase | TGenerateCallUsageReport<T>
) {
  const {
    sourceFilePath,
    chainCallFuncNames,
    analysisPathIgnorePatterns,
    options,
  } = args;

  const convertData = hasConvertData<TGenerateCallUsageReport<T>>(args)
    ? args.convertData
    : undefined;

  const project = new Project(options);
  const result = callUsageArgs({
    sourceFile: project.getSourceFileOrThrow(sourceFilePath),
    chainCallFuncNames,
    analysisPathIgnorePatterns,
  });

  return convertData ? convertData(result) : result;
}
