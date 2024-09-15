<script setup lang="ts">
import PostalMime from 'postal-mime';

const inputType = ref<'file' | 'content'>('file');
const emailContent = ref('');
const fileInput = ref() as Ref<File | null>;
const error = ref('');

const parsedEmail = computedAsync(async () => {
  const emailContentValue = emailContent.value;
  const file = fileInput.value;
  error.value = '';
  try {
    if (inputType.value === 'file' && file) {
      return await PostalMime.parse(await file.arrayBuffer());
    } else if (inputType.value === 'content' && emailContentValue) {
      return await PostalMime.parse(emailContentValue);
    } else {
      return null;
    }
  }
  catch (e: any) {
    error.value = e.toString();
    return null;
  }
});

function downloadFile(data: ArrayBuffer, fileName: string, fileType: string) {
  const blob = new Blob([data], { type: fileType || 'application/octet-stream' });
  const downloadUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  URL.revokeObjectURL(downloadUrl);
}

function onUpload(file: File) {
  if (file) {
    fileInput.value = file;
  }
}
</script>

<template>
  <div style="max-width: 600px;">
    <c-card title="Input" mb-2>
      <n-radio-group v-model:value="inputType" name="radiogroup" mb-2 flex justify-center>
        <n-space>
          <n-radio
            value="file"
            label="File"
          />
          <n-radio
            value="content"
            label="Content"
          />
        </n-space>
      </n-radio-group>

      <c-file-upload
        v-if="inputType === 'file'"
        title="Drag and drop EML file here, or click to select a file"
        @file-upload="onUpload"
      />

      <c-input-text
        v-if="inputType === 'content'"
        v-model:value="emailContent"
        label="Email Content"
        multiline
        placeholder="Put your eml/email content here..."
        rows="15"
        mb-2
      />
    </c-card>

    <c-alert v-if="error">
      {{ error }}
    </c-alert>

    <c-card v-if="!error && parsedEmail" title="Output">
      <input-copyable v-if="fileInput?.name" label="File Name" :value="fileInput?.name" />
      <input-copyable v-if="parsedEmail.date" label="Date" :value="parsedEmail.date" />
      <input-copyable v-if="parsedEmail.from?.name" label="From (name)" :value="parsedEmail.from?.name" />
      <input-copyable v-if="parsedEmail.from" label="From (address)" :value="parsedEmail.from?.address || parsedEmail.from" />
      <input-copyable v-if="parsedEmail.to" label="To" :value="JSON.stringify(parsedEmail.to)" />
      <input-copyable v-if="parsedEmail.cc" label="Cc" :value="JSON.stringify(parsedEmail.cc)" />
      <input-copyable v-if="parsedEmail.bcc" label="Bcc" :value="JSON.stringify(parsedEmail.bcc)" />
      <input-copyable v-if="parsedEmail.replyTo" label="Reply-To" :value="JSON.stringify(parsedEmail.replyTo)" />
      <input-copyable v-if="parsedEmail.subject" label="Subject" :value="parsedEmail.subject" />
      <c-card v-if="parsedEmail.text" title="Plain Content" mb-2>
        <details>
          <summary>See content</summary>
          <textarea-copyable :value="parsedEmail.text" word-wrap />
        </details>
      </c-card>
      <c-card v-if="parsedEmail.html" title="Html Content" mb-2>
        <details>
          <summary>See content</summary>
          <textarea-copyable :value="parsedEmail.html" word-wrap />
        </details>
      </c-card>
      <c-card v-if="parsedEmail?.attachments?.length" title="Attachments" mb-2>
        <n-table>
          <thead>
            <tr>
              <th scope="col">
                Attachment
              </th><th scope="col" />
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(h, index) in parsedEmail.attachments || []"
              :key="index"
            >
              <td>
                {{ `${h.filename || h.contentId || 'noname'} (${h.mimeType}) / ${h.disposition}` }}
              </td>
              <td>
                <c-button @click="downloadFile(h.content, h.filename || h.contentId || 'noname', h.mimeType)">
                  Download
                </c-button>
              </td>
            </tr>
          </tbody>
        </n-table>
      </c-card>

      <input-copyable v-if="parsedEmail.messageId" label="Message Id" :value="parsedEmail.messageId" />
      <input-copyable v-if="parsedEmail.inReplyTo" label="In Reply To" :value="parsedEmail.inReplyTo" />
      <input-copyable v-if="parsedEmail.references" label="References" :value="parsedEmail.references" />
      <input-copyable v-if="parsedEmail.deliveredTo" label="Delivered To" :value="parsedEmail.deliveredTo" />
      <input-copyable v-if="parsedEmail.returnPath" label="Return Path" :value="parsedEmail.returnPath" />
      <input-copyable v-if="parsedEmail.sender?.name" label="Sender (name)" :value="parsedEmail.sender?.name" />
      <input-copyable v-if="parsedEmail.sender" label="Sender (address)" :value="parsedEmail.sender?.address || parsedEmail.sender" />

      <c-card title="All Headers" mt-2>
        <input-copyable
          v-for="(h, index) in parsedEmail.headers || []"
          :key="index"
          :label="h.key"
          :value="h.value"
        />
      </c-card>
    </c-card>
  </div>
</template>
