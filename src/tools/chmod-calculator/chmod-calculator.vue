<script setup lang="ts">
import { useThemeVars } from 'naive-ui';

import InputCopyable from '../../components/InputCopyable.vue';
import { computeChmodOctalRepresentation, computeChmodSymbolicRepresentation, computePermissionsFromChmodOctalRepresentation } from './chmod-calculator.service';

import type { Group, Scope } from './chmod-calculator.types';
import { useValidation } from '@/composable/validation';

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
  flags: { setuid: false, setgid: false, stickybit: false },
});

const permissionsInput = ref('000');
const permissionsInputValidation = useValidation({
  source: permissionsInput,
  rules: [
    {
      message: 'Invalid octal permission string',
      validator: (value) => {
        try {
          computePermissionsFromChmodOctalRepresentation(value.trim());
          return true;
        }
        catch {
          return false;
        }
      },
    },
  ],
});
watch(
  permissionsInput,
  (newPermissions) => {
    if (!permissionsInputValidation.isValid) {
      return;
    }
    permissions.value = computePermissionsFromChmodOctalRepresentation(newPermissions.trim());
  },
);

const octal = computed(() => computeChmodOctalRepresentation({ permissions: permissions.value }));
const symbolic = computed(() => computeChmodSymbolicRepresentation({ permissions: permissions.value }));
</script>

<template>
  <div>
    <c-input-text
      v-model:value="permissionsInput"
      placeholder="Put your octal permissions here..."
      label="Copy your octal permissions"
      :validation="permissionsInputValidation"
      mb-2
    />
    <n-divider />
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
        <tr>
          <td class="line-header">
            Flags
          </td>
          <td class="text-center">
            <n-checkbox v-model:checked="permissions.flags.setuid" size="large" />
          </td>
          <td class="text-center">
            <n-checkbox v-model:checked="permissions.flags.setgid" size="large" />
          </td>
          <td class="text-center">
            <n-checkbox v-model:checked="permissions.flags.stickybit" size="large" />
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
