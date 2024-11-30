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

    <c-card v-if="parsedBounce && emailContent" title="Output" mb-2>
      <n-p v-if="parsedBounce.email?.email?.error" style="color: green" mb-2>
        This mail is a bounce email
      </n-p>
      <n-p v-if="!parsedBounce.email?.email?.error" style="color: red" mb-2>
        This mail is NOT a bounce email
      </n-p>
      <c-alert v-if="parsedBounce.parsingError" mb-2>
        {{ parsedBounce.parsingError }}
      </c-alert>
      <input-copyable v-if="parsedBounce.email?.data?.recipient" label="Recipient" :value="parsedBounce.email?.data?.recipient" mb-2 />
      <div v-if="parsedBounce.email?.email?.error">
        <c-card title="Error" mb-2>
          <input-copyable v-if="parsedBounce.email?.data?.command" label="Command" :value="parsedBounce.email?.data?.command" />
          <input-copyable v-if="parsedBounce.email?.data?.error?.code?.basic || parsedBounce.email?.data?.error?.code?.enhanced" label="Code" :value="`${parsedBounce.email?.data?.error?.code?.basic}/${parsedBounce.email?.data?.error?.code?.enhanced}`" />
          <input-copyable v-if="parsedBounce.email?.data?.error?.label" label="Label" :value="parsedBounce.email?.data?.error?.label" />
          <input-copyable v-if="parsedBounce.email?.data?.error?.type" label="Type" :value="parsedBounce.email?.data?.error?.type" />
          <input-copyable v-if="parsedBounce.email?.data?.error?.temporary" label="Temporary" :value="parsedBounce.email?.data?.error?.temporary" />
          <input-copyable v-if="parsedBounce.email?.data?.error?.permanent" label="Permanent" :value="parsedBounce.email?.data?.error?.permanent" />
          <input-copyable v-if="parsedBounce.email?.data?.error?.data?.type" label="Subtype" :value="parsedBounce.email?.data?.error?.data?.type" />
          <input-copyable v-if="parsedBounce.email?.data?.error?.data?.blocked" label="Blocked" :value="parsedBounce.email?.data?.error?.data?.blocked" />
          <input-copyable v-if="parsedBounce.email?.data?.error?.data?.spam" label="Spam" :value="parsedBounce.email?.data?.error?.data?.spam" />
        </c-card>
        <c-card v-if="parsedBounce.email?.data?.server?.hostname || parsedBounce.email?.data?.server?.ip" title="Server" mb-2>
          <input-copyable v-if="parsedBounce.email?.data?.server?.hostname" label="Host" :value="parsedBounce.email?.data?.server?.hostname" />
          <input-copyable v-if="parsedBounce.email?.data?.server?.ip" label="IP" :value="parsedBounce.email?.data?.server?.ip" />
          <input-copyable v-if="parsedBounce.email?.data?.server?.port" label="Port" :value="parsedBounce.email?.data?.server?.port" />
        </c-card>
        <c-card title="Details" mb-2>
          <textarea-copyable :value="JSON.stringify(parsedBounce.email?.data, null, 2)" />
        </c-card>
        <c-card title="Raw Error" mb-2>
          <textarea-copyable :value="parsedBounce.email?.email?.error" word-wrap />
        </c-card>
      </div>
    </c-card>
  </div>
</template>
