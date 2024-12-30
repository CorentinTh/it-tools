import { type MaybeRef, get } from '@vueuse/core';
import { yamlCheck } from 'composeverter';
import yaml from 'yaml';

export { formatYaml };

function formatYaml({
  rawYaml,
  sortKeys = false,
  indentSize = 2,
}: {
  rawYaml: MaybeRef<string>
  sortKeys?: MaybeRef<boolean>
  indentSize?: MaybeRef<number>
}) {
  const rawYamlString = get(rawYaml);
  yamlCheck(rawYamlString);
  const parsedYaml = yaml.parse(rawYamlString, { intAsBigInt: true });

  const formattedYAML = yaml.stringify(parsedYaml, {
    sortMapEntries: get(sortKeys),
    indent: get(indentSize),
  });

  return formattedYAML;
}
