<template>
  <n-card title="Hash">
    <n-form label-width="120">
      <n-form-item label="Your string: " label-placement="left">
        <n-input
          v-model:value="input"
          placeholder="Your string to bcrypt..."
          autocomplete="off"
          autocorrect="off"
          autocapitalize="off"
          spellcheck="false"
          :input-props="{
            'data-test-id': 'input',
          }"
        />
      </n-form-item>
      <n-form-item label="Iteration: " label-placement="left">
        <n-input-number v-model:value="iterations" placeholder="Iterations..." min="0" w-full />
      </n-form-item>
      <n-form-item label="Memory size: " label-placement="left">
        <n-input-number v-model:value="memorySize" placeholder="Memory size..." min="0" w-full />
      </n-form-item>
      <n-input
        :value="hashed"
        readonly
        style="text-align: center"
        placeholder="Set a string to hash above..."
        :input-props="{
          'data-test-id': 'hash',
        }"
      />
    </n-form>
    <br />
    <n-space justify="center">
      <n-button secondary @click="copy"> Copy hash </n-button>
    </n-space>
  </n-card>

  <n-card title="Compare string with hash">
    <n-form label-width="120">
      <n-form-item label="Your string: " label-placement="left">
        <n-input
          v-model:value="compareString"
          placeholder="Your string to compare..."
          autocomplete="off"
          autocorrect="off"
          autocapitalize="off"
          spellcheck="false"
          :input-props="{
            'data-test-id': 'compare-string',
          }"
        />
      </n-form-item>
      <n-form-item label="Your hash: " label-placement="left">
        <n-input
          v-model:value="compareHash"
          placeholder="Your hash to compare..."
          autocomplete="off"
          autocorrect="off"
          autocapitalize="off"
          spellcheck="false"
          :input-props="{
            'data-test-id': 'compare-hash',
          }"
        />
      </n-form-item>
      <n-form-item label="Do they match ? " label-placement="left" :show-feedback="false">
        <span data-test-id="do-they-match">
          <n-tag v-if="compareMatch" :bordered="false" type="success" round>Yes</n-tag>
          <n-tag v-else :bordered="false" type="error" round>No</n-tag>
        </span>
      </n-form-item>
    </n-form>
  </n-card>
</template>

<script setup lang="ts">
import { useCopy } from '@/composable/copy';
import { argon2id, argon2Verify } from 'hash-wasm';

const input = ref('');
const iterations = ref(32);
const memorySize = ref(512);
const hashLength = ref(32);

const hashed = computedAsync(
  async () =>
    argon2id({
      password: input.value,
      salt: window.crypto.getRandomValues(new Uint8Array(16)),
      parallelism: 1,
      iterations: iterations.value,
      memorySize: memorySize.value,
      hashLength: hashLength.value,
      outputType: 'encoded',
    }),
  '',
);
const { copy } = useCopy({ source: hashed, text: 'Hashed string copied to the clipboard' });

const compareString = ref('');
const compareHash = ref('');
const compareMatch = computedAsync(
  () => argon2Verify({ password: compareString.value, hash: compareHash.value }),
  false,
);
</script>
