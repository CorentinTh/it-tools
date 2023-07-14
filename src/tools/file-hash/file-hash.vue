<script setup lang="ts">
import { type Ref, ref, watch } from 'vue';
import type { UploadFileInfo } from 'naive-ui';
import { Upload } from '@vicons/tabler';
import CryptoJS from 'crypto-js';
import { useCopy } from '@/composable/copy';

type Hasher = 'md5' |
'sha1' |
'sha2_224' |
'sha2_256' |
'sha2_384' |
'sha2_512' |
'sha3_224' |
'sha3_256' |
'sha3_384' |
'sha3_512';
type Digest = 'base64' | 'hex';

function useFileHash(target: Ref<File>, hasher: Ref<Hasher>, digest: Ref<Digest>) {
  const hash = ref('');
  const promise = ref() as Ref<Promise<string>>;

  function execute() {
    if (typeof window === 'undefined') {
      return;
    }

    promise.value = new Promise<string>((resolve, reject) => {
      try {
        if (target.value) {
          resolve(readAndHashFile(target.value, hasher.value, digest.value));
        }
      }
      catch (error) {
        reject(error);
      }
    });

    promise.value.then(res => hash.value = res);
    return promise.value;
  }

  watch(target, execute, { immediate: true });
  watch(hasher, execute, { immediate: true });
  watch(digest, execute, { immediate: true });

  return {
    hash,
    promise,
    execute,
  };
}

function readAndHashFile(file: File, hashType: Hasher, digestType: Digest) {
  return new Promise<string>((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = (ev) => {
      const content = ev.target!.result as string;

      const hasher: Record<Hasher, typeof CryptoJS.MD5> = {
        md5: CryptoJS.MD5,
        sha1: CryptoJS.SHA1,
        sha2_224: CryptoJS.SHA224,
        sha2_256: CryptoJS.SHA256,
        sha2_384: CryptoJS.SHA384,
        sha2_512: CryptoJS.SHA512,
        sha3_224: () => CryptoJS.SHA3(content, { outputLength: 224 }),
        sha3_256: () => CryptoJS.SHA3(content, { outputLength: 256 }),
        sha3_384: () => CryptoJS.SHA3(content, { outputLength: 384 }),
        sha3_512: () => CryptoJS.SHA3(content, { outputLength: 512 }),
      };

      const digest = {
        base64: CryptoJS.enc.Base64,
        hex: CryptoJS.enc.Hex,
      };

      resolve(hasher[hashType](content).toString(digest[digestType]));
    };
    fr.onerror = reject;
    fr.readAsBinaryString(file);
  });
}

const fileList = ref();
const fileInput = ref() as Ref<File>;

const hasher = ref<Hasher>('md5');
const digest = ref<Digest>('hex');

const { hash } = useFileHash(fileInput, hasher, digest);
const { copy: copyHash } = useCopy({ source: hash, text: 'File hash copied to the clipboard' });

async function onUpload({ file: { file } }: { file: UploadFileInfo }) {
  if (file) {
    fileList.value = [];
    fileInput.value = file;
  }
}
</script>

<template>
  <c-card title="Calculate file hash">
    <n-upload v-model:file-list="fileList" :show-file-list="true" :on-before-upload="onUpload" list-type="image">
      <n-upload-dragger>
        <div mb-2>
          <n-icon size="35" :depth="3" :component="Upload" />
        </div>
        <div op-60>
          Click or drag a file to this area to upload
        </div>
      </n-upload-dragger>
    </n-upload>

    <n-form-item mt-5 label="Hash algorithm:" :show-feedback="false">
      <n-select
        v-model:value="hasher" mb-5 :options="[
          {
            label: 'MD5',
            value: 'md5',
          },
          {
            label: 'SHA1',
            value: 'sha1',
          },
          {
            label: 'SHA2-224',
            value: 'sha2_224',
          },
          {
            label: 'SHA2-256',
            value: 'sha2_256',
          },
          {
            label: 'SHA2-384',
            value: 'sha2_384',
          },
          {
            label: 'SHA2-512',
            value: 'sha2_512',
          },
          {
            label: 'SHA3-224',
            value: 'sha3_224',
          },
          {
            label: 'SHA3-256',
            value: 'sha3_256',
          },
          {
            label: 'SHA3-384',
            value: 'sha3_384',
          },
          {
            label: 'SHA3-512',
            value: 'sha3_512',
          },
        ]"
      />
    </n-form-item>

    <n-form-item label="Digest encoding:" :show-feedback="false">
      <n-select
        v-model:value="digest" mb-5 :options="[
          {
            label: 'Hexadecimal (base 16)',
            value: 'hex',
          },
          {
            label: 'Base64 (base 64)',
            value: 'base64',
          },
        ]"
      />
    </n-form-item>

    <n-form-item label="Your file's hash:" :show-feedback="false">
      <c-input-text :value="hash" multiline readonly placeholder="Result" rows="5" mb-2 />
    </n-form-item>

    <div flex justify-center>
      <c-button :disabled="!hash.length" @click="copyHash()">
        Copy
      </c-button>
    </div>
  </c-card>
</template>
