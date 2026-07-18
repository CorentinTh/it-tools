import RandExp from 'randexp';
import {
  REGEX_MAX_SAMPLE_CHARACTERS,
  REGEX_MAX_SAMPLE_REPETITION,
  type RegexSampleTask,
  RegexTaskError,
} from './regex-tester.worker.protocol';

const RET_ROOT = 0;
const RET_GROUP = 1;
const RET_POSITION = 2;
const RET_SET = 3;
const RET_RANGE = 4;
const RET_REPETITION = 5;
const RET_REFERENCE = 6;
const RET_CHAR = 7;
const REGEX_MAX_SAMPLE_AST_NODES = 4_096;
const REGEX_MAX_SAMPLE_AST_DEPTH = 128;
const REGEX_MAX_SAMPLE_CAPTURE_GROUPS = 32;
const EXCEEDED_SAMPLE_LENGTH = REGEX_MAX_SAMPLE_CHARACTERS + 1;

interface ProjectionContext {
  captureBounds: readonly number[]
  visitedNodes: number
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function invalidRandExpTree(): never {
  throw new RegexTaskError('operation', 'The regular expression generator produced invalid internal metadata.');
}

function getToken(value: unknown): Record<string, unknown> {
  if (!isRecord(value) || !Number.isSafeInteger(value.type)) {
    return invalidRandExpTree();
  }

  return value;
}

function getSequence(value: unknown): unknown[] {
  if (!Array.isArray(value)) {
    return invalidRandExpTree();
  }

  return value;
}

function getGroupSequences(token: Record<string, unknown>): unknown[][] {
  if (token.options !== undefined) {
    return getSequence(token.options).map(getSequence);
  }

  return [getSequence(token.stack)];
}

function addBounded(left: number, right: number): number {
  if (left >= EXCEEDED_SAMPLE_LENGTH || right >= EXCEEDED_SAMPLE_LENGTH) {
    return EXCEEDED_SAMPLE_LENGTH;
  }

  const sum = left + right;
  return sum > REGEX_MAX_SAMPLE_CHARACTERS ? EXCEEDED_SAMPLE_LENGTH : sum;
}

function multiplyBounded(value: number, multiplier: number): number {
  if (value === 0 || multiplier === 0) {
    return 0;
  }
  if (value >= EXCEEDED_SAMPLE_LENGTH || multiplier > Math.floor(REGEX_MAX_SAMPLE_CHARACTERS / value)) {
    return EXCEEDED_SAMPLE_LENGTH;
  }

  return value * multiplier;
}

function assertProjectionDepth(depth: number): void {
  if (depth > REGEX_MAX_SAMPLE_AST_DEPTH) {
    throw new RegexTaskError(
      'limit',
      `Sample generation is limited to ${REGEX_MAX_SAMPLE_AST_DEPTH} nested expression levels.`,
    );
  }
}

function visitProjectionNode(context: ProjectionContext): void {
  context.visitedNodes += 1;
  if (context.visitedNodes > REGEX_MAX_SAMPLE_AST_NODES) {
    throw new RegexTaskError(
      'limit',
      `Sample generation is limited to ${REGEX_MAX_SAMPLE_AST_NODES.toLocaleString()} expression nodes.`,
    );
  }
}

function projectSequenceLength(
  sequence: readonly unknown[],
  context: ProjectionContext,
  depth: number,
): number {
  let length = 0;

  for (const child of sequence) {
    length = addBounded(length, projectTokenLength(child, context, depth));
    if (length >= EXCEEDED_SAMPLE_LENGTH) {
      return EXCEEDED_SAMPLE_LENGTH;
    }
  }

  return length;
}

function projectTokenLength(value: unknown, context: ProjectionContext, depth = 0): number {
  assertProjectionDepth(depth);
  visitProjectionNode(context);

  const token = getToken(value);
  const type = token.type;

  if (type === RET_ROOT || type === RET_GROUP) {
    if (token.followedBy === true || token.notFollowedBy === true) {
      return 0;
    }

    return getGroupSequences(token).reduce(
      (maximum, sequence) => Math.max(maximum, projectSequenceLength(sequence, context, depth + 1)),
      0,
    );
  }

  if (type === RET_POSITION) {
    return 0;
  }

  if (type === RET_SET || type === RET_RANGE || type === RET_CHAR) {
    return 1;
  }

  if (type === RET_REPETITION) {
    const minimum = token.min;
    const maximum = token.max;

    if (typeof minimum !== 'number' || !Number.isSafeInteger(minimum) || minimum < 0) {
      return invalidRandExpTree();
    }
    if (minimum > REGEX_MAX_SAMPLE_REPETITION) {
      throw new RegexTaskError(
        'limit',
        `A generated repetition exceeds the practical limit of ${REGEX_MAX_SAMPLE_REPETITION}.`,
      );
    }
    if (
      maximum !== Number.POSITIVE_INFINITY
      && (typeof maximum !== 'number' || !Number.isSafeInteger(maximum) || maximum < minimum)
    ) {
      return invalidRandExpTree();
    }

    const effectiveMaximum = maximum === Number.POSITIVE_INFINITY
      ? REGEX_MAX_SAMPLE_REPETITION
      : Math.min(maximum, REGEX_MAX_SAMPLE_REPETITION);
    return multiplyBounded(
      projectTokenLength(token.value, context, depth + 1),
      effectiveMaximum,
    );
  }

  if (type === RET_REFERENCE) {
    const reference = token.value;
    if (typeof reference !== 'number' || !Number.isSafeInteger(reference) || reference < 1) {
      return invalidRandExpTree();
    }

    return context.captureBounds[reference - 1] ?? 0;
  }

  return invalidRandExpTree();
}

function collectCaptureTokens(
  value: unknown,
  captures: Record<string, unknown>[],
  state: { visitedNodes: number },
  depth = 0,
): void {
  assertProjectionDepth(depth);
  state.visitedNodes += 1;
  if (state.visitedNodes > REGEX_MAX_SAMPLE_AST_NODES) {
    throw new RegexTaskError(
      'limit',
      `Sample generation is limited to ${REGEX_MAX_SAMPLE_AST_NODES.toLocaleString()} expression nodes.`,
    );
  }

  const token = getToken(value);

  if (token.type === RET_GROUP && token.remember === true) {
    captures.push(token);
    if (captures.length > REGEX_MAX_SAMPLE_CAPTURE_GROUPS) {
      throw new RegexTaskError(
        'limit',
        `Sample generation is limited to ${REGEX_MAX_SAMPLE_CAPTURE_GROUPS} capture groups.`,
      );
    }
  }

  if (token.type === RET_ROOT || token.type === RET_GROUP) {
    for (const sequence of getGroupSequences(token)) {
      for (const child of sequence) {
        collectCaptureTokens(child, captures, state, depth + 1);
      }
    }
  }
  else if (token.type === RET_REPETITION) {
    collectCaptureTokens(token.value, captures, state, depth + 1);
  }
}

function projectMaximumSampleLength(tokens: unknown): number {
  const captureTokens: Record<string, unknown>[] = [];
  collectCaptureTokens(tokens, captureTokens, { visitedNodes: 0 });

  // RandExp assigns capture numbers only when a group is visited during
  // generation. That differs from RegExp's lexical numbering for captures in
  // skipped repetitions, lookaheads and unselected alternatives, and can make
  // a later backreference reuse the wrong (much larger) group. Pin the parsed
  // tree to native RegExp numbering before both projection and generation.
  captureTokens.forEach((token, groupNumber) => {
    token.groupNumber = groupNumber;
  });

  let captureBounds = captureTokens.map(() => 0);
  let stable = captureTokens.length === 0;

  for (let iteration = 0; iteration <= captureTokens.length && !stable; iteration += 1) {
    const nextBounds = captureTokens.map(token => projectTokenLength(token, {
      captureBounds,
      visitedNodes: 0,
    }));
    stable = nextBounds.every((bound, index) => bound === captureBounds[index]);
    captureBounds = nextBounds;
  }

  if (!stable) {
    throw new RegexTaskError('limit', 'Recursive sample references exceed the bounded generation policy.');
  }

  return projectTokenLength(tokens, { captureBounds, visitedNodes: 0 });
}

export function generateRegexSample(task: RegexSampleTask): string {
  // RandExp 0.5 does not parse named-capture syntax, but a non-capturing group
  // preserves the existing tool's generation behaviour for those patterns.
  const randexpPattern = task.pattern.replace(/\(\?<([A-Za-z_$][A-Za-z0-9_$]*)>/g, '(?:');
  const regexp = new RegExp(randexpPattern, task.flags);
  const randexp = new RandExp(regexp);
  randexp.max = REGEX_MAX_SAMPLE_REPETITION;
  randexp.randInt = (from, to) => {
    if (!Number.isSafeInteger(from) || !Number.isSafeInteger(to) || from < 0 || from > REGEX_MAX_SAMPLE_REPETITION) {
      throw new RegexTaskError(
        'limit',
        `A generated repetition exceeds the practical limit of ${REGEX_MAX_SAMPLE_REPETITION}.`,
      );
    }

    const boundedTo = Math.min(to, REGEX_MAX_SAMPLE_REPETITION);
    return from + Math.floor(Math.random() * (boundedTo - from + 1));
  };

  const projectedLength = projectMaximumSampleLength(Reflect.get(randexp, 'tokens'));
  if (projectedLength > REGEX_MAX_SAMPLE_CHARACTERS) {
    throw new RegexTaskError(
      'limit',
      `Generated sample could exceed the ${REGEX_MAX_SAMPLE_CHARACTERS.toLocaleString()}-character limit.`,
    );
  }

  const sample = randexp.gen();
  if (sample.length > REGEX_MAX_SAMPLE_CHARACTERS) {
    throw new RegexTaskError(
      'limit',
      `Generated sample exceeds the ${REGEX_MAX_SAMPLE_CHARACTERS.toLocaleString()}-character limit.`,
    );
  }

  const verificationFlags = task.flags.replace(/[gy]/g, '');
  if (!new RegExp(task.pattern, verificationFlags).test(sample)) {
    throw new RegexTaskError('operation', 'A reliable matching sample could not be generated for this pattern.');
  }

  return sample;
}
