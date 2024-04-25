<script setup lang="ts">
import satisfies from 'spdx-satisfies';
import { type ConditionTag, type LimitationTag, type PermissionTag, getLicenseFromId, licenses } from 'safe-license-list';
import type { VNode } from 'vue';
import { h, ref } from 'vue';
import type { SelectOption } from 'naive-ui';
import { NTooltip } from 'naive-ui';

import { Check as CheckIcon, LetterX as CrossIcon } from '@vicons/tabler';
import TextareaCopyable from '@/components/TextareaCopyable.vue';

const firstLicence = ref('GPL-3.0');
const secondLicence = ref('MIT');
const compatibility = computed(() => {
  try {
    return satisfies(firstLicence.value.split(':')[0], secondLicence.value.split(':')[0]) ? 'ok' : 'nok';
  }
  catch (e: any) {
    return e.toString();
  }
});

const permissions = [
  { key: 'commercial-use', desc: 'This software and derivatives may be used for commercial purposes.' },
  { key: 'modifications', desc: 'This software may be modified.' },
  { key: 'distribution', desc: 'This software may be distributed.' },
  { key: 'private-use', desc: 'This software may be used and modified in private.' },
  { key: 'patent-use', desc: 'This license provides an express grant of patent rights from contributors.' },
];
const permissionsInfos = permissions.map((l) => {
  return { value: l.key, label: l.key, desc: l.desc };
});

const conditions = [
  { key: 'include-copyright', desc: 'A copy of the license and copyright notice must be included with the software.' },
  { key: 'include-copyright--source', desc: 'A copy of the license and copyright notice must be included with the software in source form, but is not required for binaries.' },
  { key: 'document-changes', desc: 'Changes made to the code must be documented.' },
  { key: 'disclose-source', desc: 'Source code must be made available when the software is distributed.' },
  { key: 'network-use-disclose', desc: 'Users who interact with the software via network are given the right to receive a copy of the source code.' },
  { key: 'same-license', desc: 'Modifications must be released under the same license when distributing the software. In some cases a similar or related license may be used.' },
  { key: 'same-license--file', desc: 'Modifications of existing files must be released under the same license when distributing the software. In some cases a similar or related license may be used.' },
  { key: 'same-license--library', desc: 'Modifications must be released under the same license when distributing the software. In some cases a similar or related license may be used, or this condition may not apply to works that use the software as a library.' },
];
const conditionsInfos = conditions.map((l) => {
  return { value: l.key, label: l.key, desc: l.desc };
});
const limitations = [
  { key: 'trademark-use', desc: 'This license explicitly states that it does NOT grant trademark rights, even though licenses without such a statement probably do not grant any implicit trademark rights.' },
  { key: 'liability', desc: 'This license includes a limitation of liability.' },
  { key: 'patent-use', desc: 'This license explicitly states that it does NOT grant any rights in the patents of contributors.' },
  { key: 'warranty', desc: 'The license explicitly states that it does NOT provide any warranty.' },
];
const limitationsInfos = limitations.map((l) => {
  return { value: l.key, label: l.key, desc: l.desc };
});

function renderTooltips({ node, option }: { node: VNode; option: SelectOption }) {
  return h(NTooltip, null, {
    trigger: () => node,
    default: () => option.desc,
  });
}

const currentLicence = ref('MIT');
const currentLicenceInfo = computed(() => {
  return getLicenseFromId(currentLicence.value, true);
});
const licenceInfos = computed(() => licenses.map((l) => {
  return { value: l.id, label: `${l.id}: ${l.title}` };
}));

const filterAllowedPermissions = ref([]);
const filterDisallowedPermissions = ref([]);
const filterAllowedConditions = ref([]);
const filterDisallowedConditions = ref([]);
const filterAllowedLimitations = ref([]);
const filterDisallowedLimitations = ref([]);

function includesAll(filters: string | string[], elements: string[]) {
  return filters === '' || (filters as string[])?.every(e => elements.includes(e));
}
function includesNone(filters: string | string[], elements: string[]) {
  return filters === '' || (filters as string[])?.every(e => !elements.includes(e));
}

const filteredLicencesInfos = computed(() => licenses.filter(
  (licence) => {
    return includesAll(filterAllowedPermissions.value, licence.permissions)
    && includesNone(filterDisallowedPermissions.value, licence.permissions)
    && includesAll(filterAllowedConditions.value, licence.conditions)
    && includesNone(filterDisallowedConditions.value, licence.conditions)
    && includesAll(filterAllowedLimitations.value, licence.limitations)
    && includesNone(filterDisallowedLimitations.value, licence.limitations);
  }).map((l) => {
  return { value: l.id, label: `${l.id}: ${l.title}` };
}));

function handleLicenceFallback() {
  const fallback = filteredLicencesInfos.value && filteredLicencesInfos.value.length > 0 ? filteredLicencesInfos.value[0] : { value: '', label: '' };
  currentLicence.value = fallback.value;
  return fallback;
}
</script>

<template>
  <div style="max-width: 600px;">
    <n-card title="Software licences compatibility" mb-5>
      <n-form-item label="First License (SPDX):" label-placement="left" label-width="120">
        <n-auto-complete
          v-model:value="firstLicence"
          :options="licenceInfos"
          placeholder="Put your first licence SPDX licence..."
          raw-text
          mb-5
        />
      </n-form-item>

      <n-form-item label="Second License (SPDX):" label-placement="left" label-width="120">
        <n-auto-complete
          v-model:value="secondLicence"
          :options="licenceInfos"
          placeholder="Put your second licence SPDX licence..."
          raw-text
          mb-5
        />
      </n-form-item>

      <div v-if="firstLicence !== '' && secondLicence !== ''" flex justify-center>
        <span v-if="compatibility === 'ok'">
          <n-icon color="green">
            <CheckIcon />
          </n-icon>
          Compatible
        </span>
        <span v-if="compatibility === 'nok'">
          <n-icon color="red">
            <CrossIcon />
          </n-icon>
          Not compatible
        </span>
        <n-alert v-if="compatibility !== 'nok' && compatibility !== 'ok'" type="error">
          {{ compatibility }}
        </n-alert>
      </div>
    </n-card>

    <n-card label="Licence infos">
      <n-grid x-gap="12" :cols="2">
        <n-gi>
          <n-form-item
            label="Allowed permission(s):"
            label-placement="top"
          >
            <n-select
              v-model:value="filterAllowedPermissions"
              filterable multiple
              :options="permissionsInfos"
              :render-option="renderTooltips"
            />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item
            label="Disallowed permission(s):"
            label-placement="top"
          >
            <n-select
              v-model:value="filterDisallowedPermissions"
              multiple filterable
              :options="permissionsInfos"
              :render-option="renderTooltips"
            />
          </n-form-item>
        </n-gi>
      </n-grid>
      <n-grid x-gap="12" :cols="2">
        <n-gi>
          <n-form-item
            label="Allowed condition(s):"
            label-placement="top"
          >
            <n-select
              v-model:value="filterAllowedConditions"
              multiple filterable
              :options="conditionsInfos"
              :render-option="renderTooltips"
            />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item
            label="Disallowed condition(s):"
            label-placement="top"
          >
            <n-select
              v-model:value="filterDisallowedConditions"
              multiple filterable
              :options="conditionsInfos"
              :render-option="renderTooltips"
            />
          </n-form-item>
        </n-gi>
      </n-grid>
      <n-grid x-gap="12" :cols="2">
        <n-gi>
          <n-form-item
            label="Allowed limitation(s):"
            label-placement="top"
          >
            <n-select
              v-model:value="filterAllowedLimitations"
              multiple filterable
              :options="limitationsInfos"
              :render-option="renderTooltips"
            />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item
            label="Disallowed limitation(s):"
            label-placement="top"
          >
            <n-select
              v-model:value="filterDisallowedLimitations"
              multiple filterable
              :options="limitationsInfos"
              :render-option="renderTooltips"
            />
          </n-form-item>
        </n-gi>
      </n-grid>

      <n-divider />

      <n-select
        v-model:value="currentLicence"
        filterable
        label-position="left"
        label="Select a licence:"
        :options="filteredLicencesInfos"
        placeholder="Select a licence"
        :fallback-option="handleLicenceFallback"
      />

      <n-p text-center>
        Applicable licences: {{ filteredLicencesInfos.length }}
      </n-p>

      <n-divider />

      <div v-if="filteredLicencesInfos.length > 0">
        <n-form-item label="Id:" label-placement="left">
          <n-input
            :value="currentLicenceInfo?.id"
            readonly mb-5
          />
        </n-form-item>
        <n-form-item label="Title:" label-placement="left">
          <n-input
            :value="currentLicenceInfo?.title"
            readonly mb-5
          />
        </n-form-item>
        <n-form-item label="Description:">
          <TextareaCopyable
            :value="currentLicenceInfo?.description ?? ''"
            readonly
            word-wrap
            mb-5
          />
        </n-form-item>
        <n-form-item label="How:">
          <TextareaCopyable
            :value="currentLicenceInfo?.how ?? ''"
            word-wrap
            readonly
            mb-5
          />
        </n-form-item>
        <n-form-item label="Used by:">
          <TextareaCopyable
            :value="Object.keys(currentLicenceInfo?.using || []).join(', ')"
            mb-5
          />
        </n-form-item>

        <n-card title="Permissions" mb-5>
          <n-p v-for="{ key, desc } in permissions" :key="key" :title="desc">
            <n-icon v-if="(currentLicenceInfo?.permissions || []).includes(key as PermissionTag)" color="green">
              <CheckIcon />
            </n-icon>
            <n-icon v-else color="red">
              <CrossIcon />
            </n-icon>
            {{ key }}
          </n-p>
        </n-card>

        <n-card title="Conditions" mb-5>
          <n-p v-for="{ key, desc } in conditions" :key="key" :title="desc">
            <n-icon v-if="(currentLicenceInfo?.conditions || []).includes(key as ConditionTag)" color="green">
              <CheckIcon />
            </n-icon>
            <n-icon v-else color="red">
              <CrossIcon />
            </n-icon>
            {{ key }}
          </n-p>
        </n-card>

        <n-card title="Limitations" mb-5>
          <n-p v-for="{ key, desc } in limitations" :key="key" :title="desc">
            <n-icon v-if="(currentLicenceInfo?.limitations || []).includes(key as LimitationTag)" color="green">
              <CheckIcon />
            </n-icon>
            <n-icon v-else color="red">
              <CrossIcon />
            </n-icon>
            {{ key }}
          </n-p>
        </n-card>

        <n-form-item label="Content:">
          <TextareaCopyable
            :value="currentLicenceInfo?.body ?? ''"
            word-wrap
            readonly
            mb-5
          />
        </n-form-item>
      </div>
    </n-card>
  </div>
</template>
