import { SyntaxKind } from 'ts-morph';
import {
  TGetArgsFromExpression,
  TParseParameters,
  TSource,
  TStatement,
} from '../types';
import { getArgsFromCall } from './call';

export function getCallUsageArgsFromStatement(
  args: TGetArgsFromExpression
): TParseParameters[][] {
  const { source, filePath, chainCallFuncNames } = args;

  return getAllStatment(source).reduce<TParseParameters[][]>((acc, cur) => {
    const result = getArgsFromCall({
      source: cur,
      filePath,
      chainCallFuncNames,
    });

    result && acc.push(result);

    return acc;
  }, []);
}

function getAllStatment(source: TSource): TStatement[] {
  return [
    ...source.getDescendantsOfKind(SyntaxKind.EmptyStatement),
    ...source.getDescendantsOfKind(SyntaxKind.VariableStatement),
    ...source.getDescendantsOfKind(SyntaxKind.ExpressionStatement),
    ...source.getDescendantsOfKind(SyntaxKind.IfStatement),
    ...source.getDescendantsOfKind(SyntaxKind.DoStatement),
    ...source.getDescendantsOfKind(SyntaxKind.WhileStatement),
    ...source.getDescendantsOfKind(SyntaxKind.ForStatement),
    ...source.getDescendantsOfKind(SyntaxKind.ForInStatement),
    ...source.getDescendantsOfKind(SyntaxKind.ForOfStatement),
    ...source.getDescendantsOfKind(SyntaxKind.ContinueStatement),
    ...source.getDescendantsOfKind(SyntaxKind.BreakStatement),
    ...source.getDescendantsOfKind(SyntaxKind.ReturnStatement),
    ...source.getDescendantsOfKind(SyntaxKind.WithStatement),
    ...source.getDescendantsOfKind(SyntaxKind.SwitchStatement),
    ...source.getDescendantsOfKind(SyntaxKind.LabeledStatement),
    ...source.getDescendantsOfKind(SyntaxKind.ThrowStatement),
    ...source.getDescendantsOfKind(SyntaxKind.TryStatement),
    ...source.getDescendantsOfKind(SyntaxKind.DebuggerStatement),
  ];
}
