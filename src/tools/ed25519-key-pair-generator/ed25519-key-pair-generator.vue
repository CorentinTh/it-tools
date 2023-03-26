<template>
  <div>
    <h3>Public key</h3>
    <textarea-copyable :value="certs.publicKeyPem" />
  </div>

  <div>
    <h3>Private key</h3>
    <textarea-copyable :value="certs.privateKeyPem" />
  </div>
</template>

<script setup lang="ts">
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import { withDefaultOnErrorAsync } from '@/utils/defaults';
import { computed } from 'vue';
import { generateKeyPair } from './ed25519-key-pair-generator.service';

const emptyCerts = { publicKeyPem: '', privateKeyPem: '' };

const certs = computed(() => generateKeyPair());
</script>

<style lang="less" scoped></style>
