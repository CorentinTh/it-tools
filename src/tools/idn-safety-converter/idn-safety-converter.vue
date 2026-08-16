<script setup lang="ts">
import { inspectIdn } from './idn-safety-converter.service';
import { useCopy } from '@/composable/copy';

const input = ref('münich.example');
const ascii = ref('');
const unicode = ref('');
const warnings = ref<string[]>([]);
const error = ref('');
const completedInput = ref('');
const stale = computed(() => Boolean(ascii.value && completedInput.value !== input.value));
const { copy: copyAscii } = useCopy({ source: ascii, text: 'ASCII domain copied' });
const { copy: copyUnicode } = useCopy({ source: unicode, text: 'Unicode domain copied' });

function inspect() {
  error.value = '';
  try {
    const result = inspectIdn(input.value);
    ascii.value = result.ascii;
    unicode.value = result.unicode;
    warnings.value = result.warnings;
    completedInput.value = input.value;
  }
  catch (caught) {
    error.value = caught instanceof Error ? caught.message : 'IDN conversion failed.';
  }
}
inspect();
</script>

<template>
  <div class="c-task-layout">
    <c-alert title="Punycode transport, not a trust verdict">
      Conversion is local and follows the RFC 3492 encoding algorithm. The warnings are heuristics, not complete UTS #46, registry eligibility, phishing detection, or proof that a domain is safe.
    </c-alert>
    <c-input-text v-model:value="input" label="Domain name" placeholder="münich.example" :maxlength="1024" raw-text monospace clearable />
    <div class="c-task-actions">
      <c-button type="primary" data-test-id="idn-inspect" @click="inspect">
        Convert and inspect
      </c-button>
    </div>
    <c-alert v-if="error" title="Invalid domain" data-test-id="idn-error">
      {{ error }}
    </c-alert>
    <c-alert v-if="stale" title="Results use the previous input">
      Convert again to refresh the result.
    </c-alert>
    <c-card v-if="warnings.length" title="Safety warnings" data-test-id="idn-warnings">
      <ul list-disc pl-5>
        <li v-for="warning in warnings" :key="warning">
          {{ warning }}
        </li>
      </ul>
    </c-card>
    <c-input-text :value="ascii" label="ASCII / ACE domain" data-test-id="idn-ascii" raw-text monospace readonly />
    <div class="c-task-actions">
      <c-button :disabled="!ascii" @click="copyAscii()">
        Copy ASCII
      </c-button>
    </div>
    <c-input-text :value="unicode" label="Unicode domain" data-test-id="idn-unicode" raw-text monospace readonly />
    <div class="c-task-actions">
      <c-button :disabled="!unicode" @click="copyUnicode()">
        Copy Unicode
      </c-button>
    </div>
  </div>
</template>
