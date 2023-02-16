import { SyntaxKind } from 'ts-morph';
import {
  TGetArgsFromExpression,
  TParseParameters,
  TSource,
  TStatement,
} from '../types';
import { getArgsFromCall, getArgsFromOneCall } from './call';

type StatementResult = TParseParameters[][];

export function getCallUsageArgsFromStatement(
  args: TGetArgsFromExpression
): StatementResult {
  return reduceOfGetArgs(args)(allSingleStatment(args.source), [
    ...variableStatement(args),
    ...ifStatement(args),
    ...switchStatement(args),
    ...doStatement(args),
  ]);
}

function allSingleStatment(source: TSource): TStatement[] {
  return [
    ...source.getDescendantsOfKind(SyntaxKind.EmptyStatement),
    // ...source.getDescendantsOfKind(SyntaxKind.VariableStatement),
    ...source.getDescendantsOfKind(SyntaxKind.ExpressionStatement),
    // ...source.getDescendantsOfKind(SyntaxKind.IfStatement),
    // ...source.getDescendantsOfKind(SyntaxKind.DoStatement),
    ...source.getDescendantsOfKind(SyntaxKind.WhileStatement),
    ...source.getDescendantsOfKind(SyntaxKind.ForStatement),
    ...source.getDescendantsOfKind(SyntaxKind.ForInStatement),
    ...source.getDescendantsOfKind(SyntaxKind.ForOfStatement),
    ...source.getDescendantsOfKind(SyntaxKind.ContinueStatement),
    ...source.getDescendantsOfKind(SyntaxKind.BreakStatement),
    ...source.getDescendantsOfKind(SyntaxKind.ReturnStatement),
    ...source.getDescendantsOfKind(SyntaxKind.WithStatement),
    // ...source.getDescendantsOfKind(SyntaxKind.SwitchStatement),
    ...source.getDescendantsOfKind(SyntaxKind.LabeledStatement),
    ...source.getDescendantsOfKind(SyntaxKind.ThrowStatement),
    ...source.getDescendantsOfKind(SyntaxKind.TryStatement),
    ...source.getDescendantsOfKind(SyntaxKind.DebuggerStatement),
    ...source.getDescendantsOfKind(SyntaxKind.FunctionDeclaration),
  ];
}

function variableStatement(args: TGetArgsFromExpression) {
  const statements = args.source.getDescendantsOfKind(
    SyntaxKind.VariableStatement
  );

  return statements.reduce<StatementResult>((acc, cur) => {
    return [
      ...acc,
      ...reduceOfGetArgs(args)(
        cur.getDescendantsOfKind(SyntaxKind.TemplateSpan)
      ),
    ];
  }, []);
}

function doStatement(args: TGetArgsFromExpression) {
  const statements = args.source.getDescendantsOfKind(SyntaxKind.DoStatement);
  return statements.reduce<StatementResult>((acc, cur) => {
    const result = getArgsFromOneCall({
      source: cur.getExpressionIfKind(SyntaxKind.CallExpression),
      filePath: args.filePath,
      chainCallFuncNames: args.chainCallFuncNames,
    });

    return [
      ...acc,
      ...reduceOfGetArgs(args)(cur.getDescendantsOfKind(SyntaxKind.Block)),
      ...[result ? [result] : []],
    ];
  }, []);
}

function ifStatement(args: TGetArgsFromExpression) {
  const { filePath, chainCallFuncNames } = args;
  const statements = args.source.getDescendantsOfKind(SyntaxKind.IfStatement);

  return statements.reduce<StatementResult>((acc, cur) => {
    const subIf = cur.getDescendantsOfKind(SyntaxKind.IfStatement);

    let subResult: StatementResult = [];
    if (subIf.length > 0) {
      subResult = ifStatement({
        source: cur,
        filePath,
        chainCallFuncNames,
      });
    }

    const result = getArgsFromCall({
      source: cur,
      filePath,
      chainCallFuncNames,
    });

    return [...acc, result, ...subResult];
  }, []);
}

function switchStatement(args: TGetArgsFromExpression) {
  const { filePath, chainCallFuncNames } = args;
  const statements = args.source.getDescendantsOfKind(
    SyntaxKind.SwitchStatement
  );

  return statements.reduce<StatementResult>((acc, cur) => {
    const caseBlock = cur.getDescendantsOfKind(SyntaxKind.CaseBlock);

    const caseBlockResult = caseBlock.reduce<StatementResult>((acc, cur) => {
      return [
        ...acc,
        ...reduceOfGetArgs(args)(
          cur.getDescendantsOfKind(SyntaxKind.CaseClause)
        ),
        ...reduceOfGetArgs(args)(
          cur.getDescendantsOfKind(SyntaxKind.DefaultClause)
        ),
      ];
    }, []);

    const result = getArgsFromCall({
      source: cur,
      filePath,
      chainCallFuncNames,
    });

    return [...acc, result, ...caseBlockResult];
  }, []);
}

function reduceOfGetArgs(args: TGetArgsFromExpression) {
  return (source: TSource[], initValue?: StatementResult) =>
    source.reduce(getArgs(args), initValue ?? []);
}

function getArgs(args: TGetArgsFromExpression) {
  const { filePath, chainCallFuncNames } = args;
  return (acc: StatementResult, cur: TSource) => {
    const result = getArgsFromCall({
      source: cur,
      filePath,
      chainCallFuncNames,
    });

    return [...acc, result];
  };
}
