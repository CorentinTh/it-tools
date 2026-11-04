import {
  v1 as generateUuidV1,
  v3 as generateUuidV3,
  v4 as generateUuidV4,
  v5 as generateUuidV5,
  v6 as generateUuidV6,
  v7 as generateUuidV7,
  NIL as nilUuid,
  validate as validateUuid,
} from 'uuid';

export { generateUuids, isValidNamespace, uuidVersions };
export type { UuidVersion };

const uuidVersions = ['NIL', 'v1', 'v3', 'v4', 'v5', 'v6', 'v7'] as const;

type UuidVersion = typeof uuidVersions[number];

function isValidNamespace(namespace: string): boolean {
  return validateUuid(namespace);
}

function generateUuids({
  version,
  count,
  namespace = '',
  name = '',
}: {
  version: UuidVersion
  count: number
  namespace?: string
  name?: string
}): string[] {
  const generators: Record<UuidVersion, (index: number) => string> = {
    NIL: () => nilUuid,
    v1: index => generateUuidV1({
      clockseq: index,
      msecs: Date.now(),
      nsecs: Math.floor(Math.random() * 10000),
      node: Uint8Array.from({ length: 6 }, () => Math.floor(Math.random() * 256)),
    }),
    v3: () => generateUuidV3(name, namespace),
    v4: () => generateUuidV4(),
    v5: () => generateUuidV5(name, namespace),
    // Without options, the uuid package keeps v6 and v7 UUIDs in ascending order within a batch.
    v6: () => generateUuidV6(),
    v7: () => generateUuidV7(),
  };

  const generator = generators[version] ?? generators.NIL;

  return Array.from({ length: count }, (_ignored, index) => generator(index));
}
