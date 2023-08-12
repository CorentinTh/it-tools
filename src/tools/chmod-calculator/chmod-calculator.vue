<script setup lang="ts">
import { useThemeVars } from 'naive-ui';
import { computed, ref } from 'vue';
import InputCopyable from '../../components/InputCopyable.vue';
import {
  checkSymbolicString,
  computeChmodOctalRepresentation,
  computeChmodSymbolicRepresentation,
  symbolicToOctal,
} from './chmod-calculator.service';

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

const symbolicInput = ref('');

const octal = computed(() => computeChmodOctalRepresentation({ permissions: permissions.value }));
const symbolic = computed(() => computeChmodSymbolicRepresentation({ permissions: permissions.value }));
const computedOctal = computed(() => symbolicToOctal(symbolicInput.value));
</script>

<template>
  <div>
    <c-card title="Calculate octal and symbolic permissions">
      <n-table :bordered="false" :bottom-bordered="false" single-column class="permission-table">
        <thead>
          <tr>
            <th class="text-center" scope="col" />
            <th class="text-center" scope="col">
              Owner (u)
            </th>
            <th class="text-center" scope="col">
              Group (g)
            </th>
            <th class="text-center" scope="col">
              Public (o)
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="{ scope, title } of scopes" :key="scope">
            <td class="line-header">
              {{ title }}
            </td>
            <td v-for="group of groups" :key="group" class="text-center">
              <!-- <n-switch v-model:value="permissions[group][scope]" /> -->
              <n-checkbox v-model:checked="permissions[group][scope]" size="large" />
            </td>
          </tr>
        </tbody>
      </n-table>

      <div class="octal-result">
        {{ octal }}
      </div>
      <div class="octal-result">
        {{ symbolic }}
      </div>
      <InputCopyable :value="`chmod ${octal} path`" readonly />
    </c-card>
    <c-card title="Convert symbolic permission string to octal value">
      <p>For permission strings of length 10:<br>The first character represents the file type: "-" for a regular file, "d" for a directory, "l" for a symbolic link.</p>
      <n-form-item label="Permission string" label-placement="left">
        <c-input-text v-model:value="symbolicInput" placeholder="-rw-r--r--" w-full />
      </n-form-item>
      <n-alert v-if="checkSymbolicString(symbolicInput)" style="margin-top: 25px" type="error">
        {{ checkSymbolicString(symbolicInput) }}
      </n-alert>
      <div class="octal-result">
        {{ computedOctal }}
      </div>
      <InputCopyable :value="`chmod ${computedOctal} path`" readonly />
    </c-card>
  </div>
</template>

<style lang="less" scoped>
.octal-result {
  text-align: center;
  font-size: 50px;
  font-family: monospace;
  color: v-bind('themeVars.primaryColor');
  margin: 20px 0;
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
</style>
