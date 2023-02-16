import { CallExpression, SyntaxKind, ts } from 'ts-morph';
import { TGetArgsFromExpression, TParseParameters } from '../types';

export function getArgsFromCall(
  args: TGetArgsFromExpression
): TParseParameters[] {
  const { source, filePath, chainCallFuncNames } = args;

  const calls = source.getDescendantsOfKind(SyntaxKind.CallExpression);

  const argsInfo: TParseParameters[] = [];

  for (const c of calls) {
    const result = getArgsFromOneCall({
      source: c,
      filePath,
      chainCallFuncNames,
    });

    result && argsInfo.push(result);
  }

  return argsInfo;
}

export function getArgsFromOneCall({
  source,
  filePath,
  chainCallFuncNames,
}: {
  source?: CallExpression<ts.CallExpression>;
  chainCallFuncNames: string[];
  filePath: string;
}): TParseParameters | undefined {
  if (!source) {
    return;
  }
  const pe = source.getExpressionIfKind(SyntaxKind.PropertyAccessExpression);

  const peName = pe?.getName();

  if (peName && chainCallFuncNames.includes(peName)) {
    return generateArgINfo({
      filePath,
      funcName: peName,
      source,
    });
  }

  const identifierText = source
    .getExpressionIfKind(SyntaxKind.Identifier)
    ?.getText();

  if (identifierText && chainCallFuncNames.includes(identifierText)) {
    return generateArgINfo({
      filePath,
      funcName: identifierText,
      source,
    });
  }
}

const generateArgINfo = ({
  filePath,
  funcName,
  source,
}: {
  filePath: string;
  funcName: string;
  source: CallExpression<ts.CallExpression>;
}) => {
  return {
    path: `${filePath}#L${source.getStartLineNumber()}#S${source.getFullStart()}`,
    pos: {
      line: source.getStartLineNumber(),
      fullStart: source.getFullStart(),
    },
    funcName,
    args: source.getArguments().map((r) => r.getText()),
  };
};
