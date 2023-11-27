import { type MaybeRef, get } from '@vueuse/core';
import yaml from "js-yaml";

export { formatYaml };

function formatYaml({
                        rawYaml,
                        sortKeys = false,
                        indentSize = 2,
                    }: {
    rawYaml: MaybeRef<string>
    sortKeys?: MaybeRef<boolean>
    stripComments?: MaybeRef<boolean>
    indentSize?: MaybeRef<number>
}) {
    const parsedYaml = yaml.load(get(rawYaml));

    const formattedYAML = yaml.dump(parsedYaml, {
        indent: get(indentSize),
        sortKeys: get(sortKeys)
    });

    return formattedYAML
}
