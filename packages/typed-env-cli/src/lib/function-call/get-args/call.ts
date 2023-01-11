import { CallExpression, SyntaxKind, ts } from 'ts-morph';
import { TGetArgsFromExpression, TParseParameters } from '../types';

export function getArgsFromCall(
  args: TGetArgsFromExpression
): TParseParameters[] | undefined {
  const { source, filePath, chainCallFuncNames } = args;

  const calls = source.getDescendantsOfKind(SyntaxKind.CallExpression);

  const argsInfo: TParseParameters[] = [];

  for (const c of calls) {
    const pe = c.getExpressionIfKind(SyntaxKind.PropertyAccessExpression);

    const peName = pe?.getName();

    if (peName && chainCallFuncNames.includes(peName)) {
      argsInfo.push(
        generateArgINfo({
          filePath,
          funcName: peName,
          source: c,
        })
      );
      continue;
    }

    const identifierText = c
      .getExpressionIfKind(SyntaxKind.Identifier)
      ?.getText();

    if (identifierText && chainCallFuncNames.includes(identifierText)) {
      argsInfo.push(
        generateArgINfo({
          filePath,
          funcName: identifierText,
          source: c,
        })
      );
    }
  }

  if (argsInfo.length > 0) {
    return argsInfo;
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
