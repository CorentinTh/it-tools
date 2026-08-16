<script setup lang="ts">
import { COMMON_LICENSES, SPDX_LIST_VERSION, assessLicenseCombination, searchCommonLicenses } from './spdx-license-guidance.service';

const query = ref('');
const selectedId = ref('MIT');
const projectId = ref('MIT');
const dependencyText = ref('Apache-2.0\nBSD-3-Clause');
const assessment = ref<ReturnType<typeof assessLicenseCombination>>([]);
const status = ref('Ready.');
const matches = computed(() => searchCommonLicenses(query.value));
const selected = computed(() => COMMON_LICENSES.find(license => license.id === selectedId.value));
const options = COMMON_LICENSES.map(license => ({ label: `${license.id} — ${license.name}`, value: license.id }));

function assess() {
  try {
    assessment.value = assessLicenseCombination(projectId.value, dependencyText.value.split(/[\s,;]+/u));
    status.value = `Produced ${assessment.value.length} conservative family-level observation(s).`;
  }
  catch (error) {
    assessment.value = [];
    status.value = error instanceof Error ? error.message : 'Unable to assess these identifiers.';
  }
}
</script>

<template>
  <div class="c-task-layout">
    <c-alert title="Identification and triage — not legal advice">
      This offline tool covers {{ COMMON_LICENSES.length }} common identifiers curated against SPDX License List {{ SPDX_LIST_VERSION }}. It is not the complete list, does not parse arbitrary SPDX expressions/exceptions, and cannot determine whether code forms a derivative or combined work. Follow the canonical SPDX link and obtain qualified legal review for distribution decisions.
    </c-alert>
    <c-card class="c-task-options" title="Common license reference">
      <c-input-text v-model:value="query" label="Filter by identifier, name, or family" :maxlength="100" clearable raw-text />
      <c-select v-model:value="selectedId" label="Selected common license" :options="options" searchable mt-3 />
      <div v-if="selected" mt-4>
        <p><strong>Family:</strong> {{ selected.family }}</p>
        <p><strong>OSI approved in SPDX metadata:</strong> {{ selected.osi ? 'yes' : 'no / not asserted here' }}</p>
        <p mt-2>
          {{ selected.summary }}
        </p>
        <ul mt-2 list-disc pl-5>
          <li v-for="obligation in selected.obligations" :key="obligation">
            {{ obligation }}
          </li>
        </ul>
        <a :href="`https://spdx.org/licenses/${selected.id}.html`" target="_blank" rel="noopener noreferrer">Open canonical SPDX entry</a>
      </div>
      <p mt-3 op-70>
        {{ matches.length }} of {{ COMMON_LICENSES.length }} common entries match the current filter.
      </p>
      <div v-if="query && matches.length" mt-3 flex flex-wrap gap-2 aria-label="Matching common licenses">
        <c-button v-for="license in matches" :key="license.id" size="small" variant="text" @click="selectedId = license.id">
          {{ license.id }}
        </c-button>
      </div>
    </c-card>
    <c-card title="Conservative combination triage">
      <c-select v-model:value="projectId" label="Declared project/distribution license" :options="options" searchable />
      <c-input-text v-model:value="dependencyText" label="Dependency SPDX identifiers (spaces, commas, or lines; maximum 100)" :rows="7" :maxlength="8192" raw-text multiline monospace mt-3 />
      <div class="c-task-actions" mt-3>
        <c-button type="primary" data-test-id="spdx-assess" @click="assess">
          Assess family-level signals
        </c-button>
      </div>
    </c-card>
    <p class="c-task-status" role="status" aria-live="polite">
      {{ status }}
    </p>
    <c-card v-if="assessment.length" title="Review signals" data-test-id="spdx-results">
      <ul flex flex-col gap-3>
        <li v-for="result in assessment" :key="result.id">
          <strong>{{ result.id }} — {{ result.level }}</strong><br>{{ result.message }}
        </li>
      </ul>
    </c-card>
  </div>
</template>
