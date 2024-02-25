<script setup lang="ts">
import { hashSync } from 'bcryptjs';
import md5 from 'apache-md5';
import TextareaCopyable from '@/components/TextareaCopyable.vue';

const username = ref('');
const password = ref('');
const hashMethod = ref('bcrypt');

const htpasswd = computed(() => {
  if (username.value === '' || password.value === '') {
    return '# username and password must not be empty';
  }
  let hash;
  if (hashMethod.value === 'md5') {
    hash = md5(password.value);
  }
  else {
    hash = hashSync(password.value, 10);
  }
  return `${username.value}:${hash}`;
});
</script>

<template>
  <div>
    <c-input-text
      v-model:value="username"
      label="Username"
      placeholder="Your username..."
      clearable raw-text mb-5
    />
    <c-input-text
      v-model:value="password"
      label="Password"
      placeholder="Your password..."
      clearable
      raw-text
      mb-2
      type="password"
    />

    <c-select
      v-model:value="hashMethod"
      label="Hash method:"
      :options="['bcrypt', 'md5']"
    />

    <n-divider />

    <n-form-item label="htpasswd content:">
      <TextareaCopyable :value="htpasswd" />
    </n-form-item>
  </div>
</template>
