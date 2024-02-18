<script setup lang="ts">
import { convert as docker2kube } from 'docker2kube';
import composerize from 'composerize';
import TextareaCopyable from '@/components/TextareaCopyable.vue';

const dockerRuns = ref(
  'docker run -p 80:80 -v /var/run/docker.sock:/tmp/docker.sock:ro --restart always nginx',
);

const conversionResult = computed(() => {
  try {
    return { yaml: docker2kube(composerize(dockerRuns.value.trim())), errors: [] };
  }
  catch (e: any) {
    return { yaml: '#see error messages', errors: e.toString().split('\n') };
  }
});

const kuebYaml = computed(() => conversionResult.value.yaml);
const errors = computed(() => conversionResult.value.errors);
</script>

<template>
  <div>
    <c-input-text
      v-model:value="dockerRuns"
      label="Your docker run command(s):"
      style="font-family: monospace"
      multiline
      raw-text
      monospace
      placeholder="Your docker run command(s) to convert..."
      rows="4"
    />

    <n-divider />

    <TextareaCopyable :value="kuebYaml" language="yaml" />

    <div v-if="errors.length > 0">
      <n-alert title="The following errors occured" type="error" mt-5>
        <ul>
          <li v-for="(message, index) of errors" :key="index">
            {{ message }}
          </li>
        </ul>
      </n-alert>
    </div>
  </div>
</template>
