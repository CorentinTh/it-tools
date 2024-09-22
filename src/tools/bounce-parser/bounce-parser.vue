<script setup lang="ts">
import EmailBounceParse from 'email-bounce-parser-browser';

const emailContent = ref('');

const parsedBounce = computed(() => {
  try {
    return { email: new EmailBounceParse().read(emailContent.value) };
  }
  catch (e: any) {
    return { parsingError: e.toString() };
  }
});
</script>

<template>
  <div style="max-width: 600px;">
    <c-card title="Input" mb-2>
      <c-input-text
        v-model:value="emailContent"
        label="Bounce Email Textual Content"
        multiline
        placeholder="Put your email text content here..."
        rows="15"
        mb-2
      />
    </c-card>

    <c-card v-if="parsedBounce && emailContent" title="Output">
      <n-p v-if="parsedBounce.email?.bounce" style="color: green">
        This mail is a bounce email
      </n-p>
      <n-p v-if="!parsedBounce.email?.bounce" style="color: red">
        This mail is NOT a bounce email
      </n-p>
      <c-alert v-if="parsedBounce.parsingError">
        {{ parsedBounce.parsingError }}
      </c-alert>
      <input-copyable v-if="parsedBounce.email?.recipient" label="Recipient" :value="parsedBounce.email?.recipient" />
      <input-copyable v-if="parsedBounce.email?.server?.hostname" label="Server (Host)" :value="parsedBounce.email?.server?.hostname" />
      <input-copyable v-if="parsedBounce.email?.server?.ip" label="Server (IP)" :value="parsedBounce.email?.server?.ip" />
      <input-copyable v-if="parsedBounce.email?.server?.port" label="Server (Port)" :value="parsedBounce.email?.server?.port" />
      <input-copyable v-if="parsedBounce.email?.command" label="Recipient" :value="parsedBounce.email?.command" />
      <c-card v-if="parsedBounce.email?.data" title="Details" mb-2>
        <textarea-copyable :value="JSON.stringify(parsedBounce.email?.data, null, 2)" />
      </c-card>
      <c-card v-if="parsedBounce.email?.email?.error" title="Raw Error" mb-2>
        <textarea-copyable :value="parsedBounce.email?.email?.error" />
      </c-card>
    </c-card>
  </div>
</template>
