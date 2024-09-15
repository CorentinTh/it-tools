<script setup lang="ts">
import { Buffer } from 'node:buffer';
import MsgReader, { type FieldsData } from '@kenjiuno/msgreader';
import { getProps } from '@kenjiuno/msgreader/lib/Defs.js';
import { deEncapsulateSync } from 'rtf-stream-parser';
import { decompressRTF } from '@kenjiuno/decompressrtf';
import iconv from 'iconv-lite';

const fileInput = ref() as Ref<File | null>;
const error = ref('');

function getPropertyName(tag: string | undefined) {
  if (!tag) {
    return '';
  }
  const tagLower = tag.toLocaleLowerCase();
  const prop = getProps().find(p => p.key?.toLocaleLowerCase() === tagLower);
  if (!prop) {
    return tag;
  }
  return `${prop.name} (${prop.area})`;
}

const parsedEmailRaw = computedAsync(async () => {
  const file = fileInput.value;
  error.value = '';
  if (file == null) {
    return null;
  }
  try {
    const msg = new MsgReader(await file.arrayBuffer());
    msg.parserConfig = {
      includeRawProps: true,
    };
    return msg;
  }
  catch (e: any) {
    error.value = e.toString();
    return null;
  }
});
const parsedEmail = computed(() => parsedEmailRaw.value?.getFileData());
const parsedRtf = computed(() => {
  if (!parsedEmail.value?.compressedRtf) {
    return { rtf: '', html: '' };
  }
  try {
    const rtfBlob = decompressRTF(Array.from(parsedEmail.value?.compressedRtf));
    const rtfText = iconv.decode(
      Buffer.from(rtfBlob),
      'latin1',
    );
    try {
      return { rtf: rtfText, html: deEncapsulateSync(rtfText, { decode: iconv.decode })?.text };
    }
    catch (dex: any) {
      return { rtf: rtfText, html: dex.toString() };
    }
  }
  catch (ex: any) {
    return { rtf: ex.toString(), html: '' };
  }
});

function downloadFile(attachment: FieldsData) {
  const attachmentData = parsedEmailRaw.value?.getAttachment(attachment);
  if (!attachmentData) {
    return;
  }
  const blob = new Blob([attachmentData.content], { type: 'application/octet-stream' });
  const downloadUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = attachmentData.fileName;
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
      <c-file-upload
        title="Drag and drop MSG file here, or click to select a file"
        @file-upload="onUpload"
      />
    </c-card>

    <c-alert v-if="error">
      {{ error }}
    </c-alert>

    <c-card v-if="!error && parsedEmail" title="Output">
      <input-copyable v-if="fileInput?.name" label="File Name" :value="fileInput?.name" />
      <input-copyable v-if="parsedEmail.creationTime" label="Creation Date" :value="parsedEmail.creationTime" />
      <input-copyable v-if="parsedEmail.clientSubmitTime" label="Submit Date" :value="parsedEmail.clientSubmitTime" />
      <input-copyable v-if="parsedEmail.messageDeliveryTime" label="Delivery Date" :value="parsedEmail.messageDeliveryTime" />
      <input-copyable v-if="parsedEmail.lastModificationTime" label="Last Mod. Date" :value="parsedEmail.lastModificationTime" />
      <c-card title="Recipients" mt-2>
        <input-copyable
          v-for="(h, index) in parsedEmail.recipients || []"
          :key="index"
          :label="h.recipType || 'unk'"
          :value="`${h.name}/${h.email}`"
        />
      </c-card>
      <input-copyable v-if="parsedEmail.subject" label="Subject" :value="parsedEmail.subject" />
      <c-card v-if="parsedEmail.body" title="Plain Content" mb-2>
        <details>
          <summary>See content</summary>
          <textarea-copyable :value="parsedEmail.body" />
        </details>
      </c-card>
      <c-card v-if="parsedEmail.bodyHtml" title="Html Content" mb-2>
        <details>
          <summary>See content</summary>
          <textarea-copyable :value="parsedEmail.bodyHtml" word-wrap />
        </details>
      </c-card>
      <c-card v-if="parsedRtf.rtf || parsedRtf.html" title="RTF Content" mb-2>
        <details>
          <summary>See Raw RTF</summary>
          <textarea-copyable :value="parsedRtf.rtf" word-wrap />
        </details>
        <details>
          <summary>See RTF converted HTML</summary>
          <textarea-copyable :value="parsedRtf.html" word-wrap />
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
                {{ `${h.fileName || h.fileNameShort || 'noname'}` }}
              </td>
              <td>
                <c-button @click="downloadFile(h)">
                  Download
                </c-button>
              </td>
            </tr>
          </tbody>
        </n-table>
      </c-card>

      <input-copyable v-if="parsedEmail.messageId" label="Message Id" :value="parsedEmail.messageId" />
      <input-copyable v-if="parsedEmail.senderName" label="Sender (name)" :value="parsedEmail.senderName" />
      <input-copyable v-if="parsedEmail.senderEmail" label="Sender (email)" :value="parsedEmail.senderEmail" />

      <c-card v-if="parsedEmail.headers" title="All Headers" mt-2>
        <textarea-copyable :value="parsedEmail.headers" />
      </c-card>

      <c-card title="All RawProps" mt-2>
        <input-copyable
          v-for="(h, index) in parsedEmail.rawProps || []"
          :key="index"
          :label="h.propertyName || getPropertyName(h.propertyTag)"
          :value="h.value"
        />
      </c-card>
    </c-card>
  </div>
</template>
