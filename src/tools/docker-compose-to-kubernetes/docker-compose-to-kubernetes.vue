<script setup lang="ts">
import { convert as docker2kube } from 'docker2kube';
import TextareaCopyable from '@/components/TextareaCopyable.vue';

const dockerCompose = ref(
  `version: '3.3'
services:
    nginx:
        ports:
            - '80:80'
        volumes:
            - '/var/run/docker.sock:/tmp/docker.sock:ro'
        restart: always
        image: nginx`,
);

const conversionResult = computed(() => {
  try {
    return { kubeYaml: docker2kube(dockerCompose.value.trim()), errors: [] };
  }
  catch (e: any) {
    return { kubeYaml: '#see error messages', errors: e.toString().split('\n') };
  }
});

const errors = computed(() => conversionResult.value.errors);
const kubeYaml = computed(() => conversionResult.value.kubeYaml);

const MONACO_EDITOR_OPTIONS = {
  automaticLayout: true,
  formatOnType: true,
  formatOnPaste: true,
};
</script>

<template>
  <div>
    <c-label label="Paste your Docker Compose file content:">
      <div relative w-full>
        <c-monaco-editor
          v-model:value="dockerCompose"
          theme="vs-dark"
          language="yaml"
          height="250px"
          :options="MONACO_EDITOR_OPTIONS"
        />
      </div>
    </c-label>

    <div v-if="errors.length > 0">
      <n-alert title="The following errors occured" type="error" mt-5>
        <ul>
          <li v-for="(message, index) of errors" :key="index">
            {{ message }}
          </li>
        </ul>
      </n-alert>
    </div>

    <n-divider />

    <TextareaCopyable :value="kubeYaml" language="yaml" copy-placement="outside" />
  </div>
</template>
