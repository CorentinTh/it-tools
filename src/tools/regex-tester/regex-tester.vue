<script setup lang="ts">
import RandExp from 'randexp';
import { useValidation } from '@/composable/validation';
import { useQueryParamOrStorage } from '@/composable/queryParams';

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

const regex = useQueryParamOrStorage({ name: 'regex', storageName: 'regex-tester:regex', defaultValue: '' });
const text = ref('');
const global = ref(true);
const ignoreCase = ref(false);
const multiline = ref(false);
const dotAll = ref(true);
const unicode = ref(true);
const unicodeSets = ref(false);

const regexValidation = useValidation({
  source: regex,
  rules: [
    {
      message: 'Invalid regex: {0}',
      validator: value => new RegExp(value),
      getErrorMessage: (value) => {
        const _ = new RegExp(value);
        return '';
      },
    },
  ],
});
const results = computed(() => {
  if (regex.value === '' || text.value === '') {
    return [];
  }

  let flags = 'd';
  if (global.value) {
    flags += 'g';
  }
  if (ignoreCase.value) {
    flags += 'i';
  }
  if (multiline.value) {
    flags += 'm';
  }
  if (dotAll.value) {
    flags += 's';
  }
  if (unicode.value) {
    flags += 'u';
  }
  else if (unicodeSets.value) {
    flags += 'v';
  }

  try {
    const re = new RegExp(regex.value, flags);
    const results = [];
    let match = re.exec(text.value) as RegExpExecArrayWithIndices;
    while (match !== null) {
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
      match = re.exec(text.value) as RegExpExecArrayWithIndices;
    }
    return results;
  }
  catch (_) {
    return [];
  }
});

const sample = computed(() => {
  try {
    const randexp = new RandExp(new RegExp(regex.value.replace(/\(\?\<[^\>]*\>/g, '(?:')));
    return randexp.gen();
  }
  catch (_) {
    return '';
  }
});
</script>

<template>
  <div max-w-600px>
    <c-card title="Regex" mb-1>
      <c-input-text
        v-model:value="regex"
        label="Regex to test:"
        placeholder="Put the regex to test"
        multiline
        rows="3"
        :validation="regexValidation"
      />
      <n-a target="_blank" href="https://www.regular-expressions.info/javascript.html" mb-1 mt-1>
        See documentation on <code>regular-expressions.info</code>
      </n-a>
      <n-space>
        <n-checkbox v-model:checked="global">
          <span title="Global search">Global search. (<code>g</code>)</span>
        </n-checkbox>
        <n-checkbox v-model:checked="ignoreCase">
          <span title="Case-insensitive search">Case-insensitive search. (<code>i</code>)</span>
        </n-checkbox>
        <n-checkbox v-model:checked="multiline">
          <span title="Allows ^ and $ to match next to newline characters.">Multiline(<code>m</code>)</span>
        </n-checkbox>
        <n-checkbox v-model:checked="dotAll">
          <span title="Allows . to match newline characters.">Singleline(<code>s</code>)</span>
        </n-checkbox>
        <n-checkbox v-model:checked="unicode">
          <span title="Unicode; treat a pattern as a sequence of Unicode code points.">Unicode(<code>u</code>)</span>
        </n-checkbox>
        <n-checkbox v-model:checked="unicodeSets">
          <span title="An upgrade to the u mode with more Unicode features.">Unicode Sets (<code>v</code>)</span>
        </n-checkbox>
      </n-space>

      <n-divider />

      <c-input-text
        v-model:value="text"
        label="Text to match:"
        placeholder="Put the text to match"
        multiline
        rows="5"
      />
    </c-card>

    <c-card title="Matches" mb-1>
      <n-table v-if="results?.length > 0">
        <thead>
          <tr>
            <th scope="col">
              Index in text
            </th>
            <th scope="col">
              Value
            </th>
            <th scope="col">
              Captures
            </th>
            <th scope="col">
              Groups
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="match of results" :key="match.index">
            <td>{{ match.index }}</td>
            <td>{{ match.value }}</td>
            <td>
              <ul>
                <li v-for="capture in match.captures" :key="capture.name">
                  "{{ capture.name }}" = {{ capture.value }} [{{ capture.start }} - {{ capture.end }}]
                </li>
              </ul>
            </td>
            <td>
              <ul>
                <li v-for="group in match.groups" :key="group.name">
                  "{{ group.name }}" = {{ group.value }} [{{ group.start }} - {{ group.end }}]
                </li>
              </ul>
            </td>
          </tr>
        </tbody>
      </n-table>
      <c-alert v-else>
        No match
      </c-alert>
    </c-card>

    <c-card title="Sample matching text">
      <pre style="white-space: pre-wrap">{{ sample }}</pre>
    </c-card>
  </div>
</template>
