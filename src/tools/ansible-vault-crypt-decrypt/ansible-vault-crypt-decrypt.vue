<script setup lang="ts">
import { Vault } from 'ansible-vault';
import TextareaCopyable from '@/components/TextareaCopyable.vue';

const decryptedInput = ref('');
const encryptPassword = ref('');
const encryptId = ref('');
const cryptedOutput = computedAsync(
  async () => {
    try {
      const v = new Vault({ password: encryptPassword.value });
      return await v.encrypt(decryptedInput.value, encryptId.value);
    }
    catch (e: any) {
      return e.toString();
    }
  },
);

const cryptedInput = ref('');
const decryptPassword = ref('');
const decryptedOutput = computedAsync(
  async () => {
    try {
      const v = new Vault({ password: decryptPassword.value });
      // handle mac \r
      return (await v.decrypt(cryptedInput.value?.replace(/\r(?!\n)/, '\n'), undefined)) ?? '';
    }
    catch (e: any) {
      return e.toString();
    }
  },
);
</script>

<template>
  <c-card title="Encrypt Ansible Vault Secret">
    <c-input-text
      v-model:value="decryptedInput"
      placeholder="Put your string to encrypt..."
      label="String to encrypt"
      raw-text
      mb-5
    />

    <n-space>
      <c-input-text
        v-model:value="encryptPassword"
        placeholder="Encryption password"
        label="Encryption password"
        raw-text
        mb-5
      />
      <c-input-text
        v-model:value="encryptId"
        placeholder="Encryption Id"
        label="Encryption Id"
        raw-text
        mb-5
      />
    </n-space>

    <n-divider />

    <TextareaCopyable
      label="Encrypted string"
      :value="cryptedOutput"
      multiline
      readonly
      rows="5"
      mb-5
    />
  </c-card>

  <c-card title="Decrypt Ansible Vault Secret">
    <c-input-text
      v-model:value="cryptedInput"
      placeholder="Put your encrypted string here..."
      label="String to decrypt"
      raw-text multiline mb-5
      rows="5"
    />

    <c-input-text
      v-model:value="decryptPassword"
      placeholder="Decryption password"
      label="Decryption password"
      raw-text
      mb-5
    />

    <n-divider />

    <TextareaCopyable
      label="Decrypted string"
      :value="decryptedOutput"
      multiline
      readonly
      rows="5"
      mb-5
    />
  </c-card>
</template>
