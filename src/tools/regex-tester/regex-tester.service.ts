interface RegExpGroupIndices {
  [name: string]: [number, number]
}
interface RegExpIndices extends Array<[number, number]> {
  groups: RegExpGroupIndices
}
interface RegExpExecArrayWithIndices extends RegExpExecArray {
  indices: RegExpIndices
}
interface GroupCapture {
  name: string
  value: string
  start: number
  end: number
};

export function matchRegex(regex: string, text: string, flags: string) {
  // if (regex === '' || text === '') {
  //   return [];
  // }

  let lastIndex = -1;
  const re = new RegExp(regex, flags);
  const results = [];
  let match = re.exec(text) as RegExpExecArrayWithIndices;
  while (match !== null) {
    if (re.lastIndex === lastIndex || match[0] === '') {
      break;
    }
    const indices = match.indices;
    const captures: Array<GroupCapture> = [];
    Object.entries(match).forEach(([captureName, captureValue]) => {
      if (captureName !== '0' && captureName.match(/\d+/)) {
        captures.push({
          name: captureName,
          value: captureValue,
          start: indices[Number(captureName)][0],
          end: indices[Number(captureName)][1],
        });
      }
    });
    const groups: Array<GroupCapture> = [];
    Object.entries(match.groups || {}).forEach(([groupName, groupValue]) => {
      groups.push({
        name: groupName,
        value: groupValue,
        start: indices.groups[groupName][0],
        end: indices.groups[groupName][1],
      });
    });
    results.push({
      index: match.index,
      value: match[0],
      captures,
      groups,
    });
    lastIndex = re.lastIndex;
    match = re.exec(text) as RegExpExecArrayWithIndices;
  }
  return results;
}
