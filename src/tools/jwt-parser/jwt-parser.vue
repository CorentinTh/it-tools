<template>
  <n-card>
    <n-form-item label="JWT to decode" :feedback="validation.message" :validation-status="validation.status">
      <n-input v-model:value="raw_jwt" type="textarea" placeholder="Put your token here..." rows="5" />
    </n-form-item>

    <p>Header</p>
    <ul>
      <li v-for="(value, key) in decodedJWT.header" :key="key">{{ key }}: {{ value }}</li>
    </ul>
    <p>Payload</p>
    <ul>
      <li v-for="(value, key) in decodedJWT.payload" :key="key">{{ key }}: {{ value }}</li>
    </ul>
  </n-card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import jwt_decode from 'jwt-decode';
import { useValidation } from '@/composable/validation';
import { isNotThrowing } from '@/utils/boolean';
import { safe_jwt_decode } from './jwt-parser.service';

const raw_jwt = ref(
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
);
const decodedJWT = computed(() => {
  return safe_jwt_decode(raw_jwt.value);
});
const validation = useValidation({
  source: raw_jwt,
  rules: [
    {
      validator: (value) => value.length > 0 && isNotThrowing(() => jwt_decode(value, { header: true })),
      message: 'Invalid JWT',
    },
  ],
});
</script>

<style lang="less" scoped></style>
