<script setup lang="ts">
import { useThemeVars } from 'naive-ui';

import InputCopyable from '../../components/InputCopyable.vue';
import { computeChmodOctalRepresentation, computeChmodSymbolicRepresentation } from './chmod-calculator.service';

import type { Group, Scope } from './chmod-calculator.types';

const themeVars = useThemeVars();

const scopes: { scope: Scope; title: string }[] = [
  { scope: 'read', title: 'Read (4)' },
  { scope: 'write', title: 'Write (2)' },
  { scope: 'execute', title: 'Execute (1)' },
];
const groups: Group[] = ['owner', 'group', 'public'];

const permissions = ref({
  owner: { read: false, write: false, execute: false },
  group: { read: false, write: false, execute: false },
  public: { read: false, write: false, execute: false },
});

const octal = computed(() => computeChmodOctalRepresentation({ permissions: permissions.value }));
const symbolic = computed(() => computeChmodSymbolicRepresentation({ permissions: permissions.value }));
</script>

<template>
  <div class="c-form-layout">
    <c-card title="Permissions">
      <n-table :bordered="false" :bottom-bordered="false" single-column class="permission-table">
        <thead>
          <tr>
            <th class="text-center" scope="col" />
            <th v-for="group of groups" :key="group" class="text-center" scope="col">
              {{ group === 'public' ? 'Public (o)' : `${group[0].toUpperCase()}${group.slice(1)} (${group === 'owner' ? 'u' : 'g'})` }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="{ scope, title } of scopes" :key="scope">
            <th class="line-header" scope="row">
              {{ title }}
            </th>
            <td v-for="group of groups" :key="group" class="text-center">
              <CCheckbox
                v-model:checked="permissions[group][scope]"
                :aria-label="`${group} ${scope}`"
              />
            </td>
          </tr>
        </tbody>
      </n-table>
    </c-card>

    <c-card title="Calculated permission">
      <div class="result-grid">
        <c-field label="Octal">
          <output class="permission-result" data-test-id="chmod-octal">{{ octal }}</output>
        </c-field>
        <c-field label="Symbolic">
          <output class="permission-result" data-test-id="chmod-symbolic">{{ symbolic }}</output>
        </c-field>
      </div>

      <InputCopyable :value="`chmod ${octal} path`" label="Command" readonly monospace />
    </c-card>
  </div>
</template>

<style lang="less" scoped>
.result-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--ui-space-3);
  margin-bottom: var(--ui-space-4);
}

.permission-result {
  display: block;
  min-width: 0;
  padding: var(--ui-space-3);
  border: 1px solid v-bind('themeVars.borderColor');
  border-radius: var(--ui-radius-control);
  text-align: center;
  font-size: clamp(1.75rem, 5vw, 3rem);
  font-family: monospace;
  color: v-bind('themeVars.primaryColor');
}
.permission-table {
  td,
  th {
    padding: 15px;

    @media screen and (max-width: 600px) {
      padding: 5px;
    }
  }
}
.line-header {
  font-weight: bold;
  text-align: right;
  max-width: 80px;
}
.text-center {
  text-align: center;
}

@media screen and (max-width: 600px) {
  .result-grid {
    grid-template-columns: 1fr;
  }
}
</style>
