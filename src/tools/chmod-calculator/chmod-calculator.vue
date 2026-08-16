<script setup lang="ts">
import { useThemeVars } from 'naive-ui';

import InputCopyable from '../../components/InputCopyable.vue';
import { applyUmask, computeChmodOctalRepresentation, computeChmodSymbolicRepresentation, parseChmodMode } from './chmod-calculator.service';

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
const special = ref({ setuid: false, setgid: false, sticky: false });
const modeInput = ref('0755');
const modeError = ref('');
const requestedCreationMode = ref<'0666' | '0777'>('0666');
const umask = ref('0022');
const umaskResult = computed(() => {
  try {
    return applyUmask(requestedCreationMode.value, umask.value);
  }
  catch {
    return '';
  }
});

const octal = computed(() => computeChmodOctalRepresentation({ permissions: permissions.value, special: special.value }));
const symbolic = computed(() => computeChmodSymbolicRepresentation({ permissions: permissions.value, special: special.value }));

function applyMode() {
  try {
    const parsed = parseChmodMode(modeInput.value);
    permissions.value = parsed.permissions;
    special.value = parsed.special;
    modeError.value = '';
  }
  catch (error) {
    modeError.value = error instanceof Error ? error.message : 'Invalid permission mode.';
  }
}
</script>

<template>
  <div class="c-form-layout">
    <c-alert title="Permission model, not filesystem execution">
      This calculator never runs chmod or reads a filesystem. It covers the nine rwx bits plus setuid, setgid, and sticky. The umask section models default creation permissions only: a process may remove additional bits, and umask does not describe a later explicit chmod.
    </c-alert>
    <c-card title="Parse a mode">
      <c-input-text v-model:value="modeInput" label="Octal or exact symbolic mode" placeholder="0755 or rwxr-xr-x" :maxlength="9" raw-text monospace data-test-id="chmod-mode-input" />
      <div class="c-task-actions" mt-3>
        <c-button type="primary" data-test-id="chmod-apply-mode" @click="applyMode">
          Apply mode
        </c-button>
      </div>
      <c-alert v-if="modeError" mt-3 title="Invalid mode" data-test-id="chmod-mode-error">
        {{ modeError }}
      </c-alert>
    </c-card>
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
      <div grid grid-cols-1 mt-4 gap-3 md:grid-cols-3>
        <CCheckbox v-model:checked="special.setuid" aria-label="Set user ID special bit">
          setuid (4)
        </CCheckbox>
        <CCheckbox v-model:checked="special.setgid" aria-label="Set group ID special bit">
          setgid (2)
        </CCheckbox>
        <CCheckbox v-model:checked="special.sticky" aria-label="Sticky special bit">
          sticky (1)
        </CCheckbox>
      </div>
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

      <InputCopyable :value="`chmod ${octal} path`" label="Command" monospace readonly />
    </c-card>
    <c-card title="Creation umask guidance">
      <div grid grid-cols-1 gap-3 md:grid-cols-2>
        <c-select v-model:value="requestedCreationMode" label="Requested creation mode" :options="[{ label: 'Regular file — 0666', value: '0666' }, { label: 'Directory/executable — 0777', value: '0777' }]" />
        <c-input-text v-model:value="umask" label="Process umask" placeholder="0022" :maxlength="4" raw-text monospace />
      </div>
      <InputCopyable :value="umaskResult" label="Effective base permission" readonly monospace mt-3 />
      <p mt-2 op-75>
        Computed as requested bits AND NOT umask. ACLs, default ACLs, application behavior, mount options, and filesystem policy may change the final result.
      </p>
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
