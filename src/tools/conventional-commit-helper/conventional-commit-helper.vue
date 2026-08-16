<script setup lang="ts">
import { CONVENTIONAL_COMMIT_TYPES, buildConventionalCommit } from './conventional-commit-helper.service';
import { useCopy } from '@/composable/copy';

const type = ref('feat');
const scope = ref('auth');
const description = ref('add passkey login');
const body = ref('');
const footers = ref('');
const breaking = ref(false);
const breakingDescription = ref('');
const output = ref('');
const warnings = ref<string[]>([]);
const error = ref('');
const completedSignature = ref('');
const signature = computed(() => [type.value, scope.value, description.value, body.value, footers.value, breaking.value, breakingDescription.value].join('\0'));
const stale = computed(() => Boolean(output.value && completedSignature.value !== signature.value));
const options = CONVENTIONAL_COMMIT_TYPES.map(item => ({ label: item.label, value: item.value }));
const { copy } = useCopy({ source: output, text: 'Commit message copied' });

function build() {
  error.value = '';
  try {
    const result = buildConventionalCommit({ type: type.value, scope: scope.value, description: description.value, body: body.value, footers: footers.value, breaking: breaking.value, breakingDescription: breakingDescription.value });
    output.value = result.message;
    warnings.value = result.warnings;
    completedSignature.value = signature.value;
  }
  catch (caught) {
    error.value = caught instanceof Error ? caught.message : 'Commit message generation failed.';
  }
}
build();
</script>

<template>
  <div class="c-form-layout">
    <c-alert title="Authoring helper, not repository automation">
      This tool only builds plain text in the browser. It never runs Git commands, reads a repository, or persists the commit message. Repository-specific lint rules may differ.
    </c-alert>
    <c-card title="Commit fields">
      <div grid grid-cols-1 gap-3 md:grid-cols-2>
        <c-select v-model:value="type" label="Type" :options="options" searchable />
        <c-input-text v-model:value="scope" label="Optional scope" placeholder="api" :maxlength="50" raw-text />
      </div>
      <c-input-text v-model:value="description" label="Short description" placeholder="add passkey login" :maxlength="100" raw-text mt-3 />
      <c-input-text v-model:value="body" label="Optional body" placeholder="Explain motivation or behavior…" :maxlength="4096" raw-text multiline mt-3 :rows="6" />
      <c-switch v-model:value="breaking" label="Breaking change" mt-3 />
      <c-input-text v-if="breaking" v-model:value="breakingDescription" label="Breaking change description" :maxlength="500" raw-text multiline mt-3 :rows="3" />
      <c-input-text v-model:value="footers" label="Optional footers" placeholder="Refs: #42" :maxlength="2048" raw-text multiline mt-3 :rows="4" />
    </c-card>
    <div class="c-form-actions">
      <c-button type="primary" data-test-id="commit-build" @click="build">
        Build commit message
      </c-button>
    </div>
    <c-alert v-if="error" title="Invalid commit fields" data-test-id="commit-error">
      {{ error }}
    </c-alert>
    <c-alert v-if="stale" title="Message uses previous fields">
      Build again to apply the current fields.
    </c-alert>
    <c-card v-if="warnings.length" title="Style guidance">
      <ul list-disc pl-5>
        <li v-for="warning in warnings" :key="warning">
          {{ warning }}
        </li>
      </ul>
    </c-card>
    <c-input-text :value="output" label="Conventional Commit message" data-test-id="commit-output" raw-text multiline readonly monospace :rows="10" />
    <div class="c-form-actions">
      <c-button :disabled="!output" @click="copy()">
        Copy
      </c-button>
    </div>
    <c-card title="Quick reference">
      <dl grid grid-cols-1 gap-3 md:grid-cols-2>
        <div>
          <dt font-600>
            Header
          </dt><dd><code>type(scope)!: description</code></dd>
        </div>
        <div>
          <dt font-600>
            Breaking change
          </dt><dd>Use <code>!</code> and a <code>BREAKING CHANGE:</code> footer.</dd>
        </div>
        <div>
          <dt font-600>
            Issue references
          </dt><dd>Put <code>Refs: #123</code> or <code>Closes: #123</code> in footers.</dd>
        </div>
        <div>
          <dt font-600>
            Project policy
          </dt><dd>Prefer the repository’s own allowed types, scopes, and header length.</dd>
        </div>
      </dl>
    </c-card>
  </div>
</template>
