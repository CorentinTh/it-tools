import {
  REGEX_MAX_CAPTURES_PER_MATCH,
  REGEX_MAX_CAPTURE_ENTRIES,
  REGEX_MAX_MATCHES,
  REGEX_MAX_RESULT_CHARACTERS,
} from './regex-tester.worker.protocol';

interface LocalRegExpGroupIndices {
  [name: string]: [number, number] | undefined
}

interface LocalRegExpIndices extends Array<[number, number] | undefined> {
  groups?: LocalRegExpGroupIndices
}

type RegExpExecArrayWithIndices = RegExpExecArray & {
  indices: LocalRegExpIndices
};

export interface GroupCapture {
  name: string
  value: string | undefined
  start: number | undefined
  end: number | undefined
}

export interface RegexMatchResult {
  index: number
  value: string
  captures: GroupCapture[]
  groups: GroupCapture[]
}

export interface RegexMatchExecutionResult {
  matches: RegexMatchResult[]
  truncated: boolean
}

export interface RegexMatchLimits {
  maxMatches: number
  maxCapturesPerMatch: number
  maxCaptureEntries: number
  maxResultCharacters: number
}

export const DEFAULT_REGEX_MATCH_LIMITS: RegexMatchLimits = {
  maxMatches: REGEX_MAX_MATCHES,
  maxCapturesPerMatch: REGEX_MAX_CAPTURES_PER_MATCH,
  maxCaptureEntries: REGEX_MAX_CAPTURE_ENTRIES,
  maxResultCharacters: REGEX_MAX_RESULT_CHARACTERS,
};

function hasIndices(match: RegExpExecArray): match is RegExpExecArrayWithIndices {
  return Array.isArray(Reflect.get(match, 'indices'));
}

function createGroupCapture(
  name: string,
  value: string | undefined,
  indices: [number, number] | undefined,
): GroupCapture {
  return {
    name,
    value,
    start: indices?.[0],
    end: indices?.[1],
  };
}

function advanceStringIndex(value: string, index: number, unicode: boolean): number {
  if (!unicode || index + 1 >= value.length) {
    return index + 1;
  }

  const firstCodeUnit = value.charCodeAt(index);
  if (firstCodeUnit < 0xD800 || firstCodeUnit > 0xDBFF) {
    return index + 1;
  }

  const secondCodeUnit = value.charCodeAt(index + 1);
  return secondCodeUnit >= 0xDC00 && secondCodeUnit <= 0xDFFF ? index + 2 : index + 1;
}

export function matchRegexBounded(
  regex: string,
  text: string,
  flags: string,
  limits: RegexMatchLimits = DEFAULT_REGEX_MATCH_LIMITS,
): RegexMatchExecutionResult {
  const flagsWithIndices = flags.includes('d') ? flags : `${flags}d`;
  const re = new RegExp(regex, flagsWithIndices);
  const matches: RegexMatchResult[] = [];
  let captureEntries = 0;
  let resultCharacters = 0;
  let truncated = false;
  let match = re.exec(text);

  while (match !== null) {
    if (!hasIndices(match)) {
      throw new Error('The regular expression engine did not return match indices');
    }
    const indices = match.indices;
    const allCaptures = match.slice(1).map((captureValue, captureIndex) => createGroupCapture(
      String(captureIndex + 1),
      captureValue,
      indices[captureIndex + 1],
    ));
    const allGroups = Object.entries(match.groups ?? {}).map(([groupName, groupValue]) => createGroupCapture(
      groupName,
      groupValue,
      indices.groups?.[groupName],
    ));
    const captures = allCaptures.slice(0, limits.maxCapturesPerMatch);
    const groups = allGroups.slice(0, limits.maxCapturesPerMatch);
    const nextCaptureEntries = captures.length + groups.length;
    const nextResultCharacters = match[0].length + [...captures, ...groups]
      .reduce((total, capture) => total + capture.name.length + (capture.value?.length ?? 0), 0);

    if (
      matches.length >= limits.maxMatches
      || captureEntries + nextCaptureEntries > limits.maxCaptureEntries
      || resultCharacters + nextResultCharacters > limits.maxResultCharacters
    ) {
      truncated = true;
      break;
    }

    if (captures.length !== allCaptures.length || groups.length !== allGroups.length) {
      truncated = true;
    }

    matches.push({
      index: match.index,
      value: match[0],
      captures,
      groups,
    });
    captureEntries += nextCaptureEntries;
    resultCharacters += nextResultCharacters;

    if (!re.global) {
      break;
    }

    if (match[0] === '') {
      re.lastIndex = advanceStringIndex(text, re.lastIndex, re.unicode || re.flags.includes('v'));
    }

    match = re.exec(text);
  }

  return { matches, truncated };
}

export function matchRegex(regex: string, text: string, flags: string): RegexMatchResult[] {
  return matchRegexBounded(regex, text, flags).matches;
}
