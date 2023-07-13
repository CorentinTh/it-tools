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
      <n-select mb-5 v-model:value="hasher" :options="[
        {
          label: 'MD5',
          value: 'md5',
        },
        {
          label: 'SHA-1',
          value: 'sha1',
        },
        {
          label: 'SHA-256',
          value: 'sha256',
        },
        {
          label: 'SHA-512',
          value: 'sha512',
        },
        {
          label: 'SHA-3',
          value: 'sha3',
        },
      ]" />
    </n-form-item>

    <n-form-item label="Digest encoding:" :show-feedback="false">
      <n-select mb-5 v-model:value="digest" :options="[
        {
          label: 'Hexadecimal (base 16)',
          value: 'hex',
        },
        {
          label: 'Base64 (base 64)',
          value: 'base64',
        },
      ]" />
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

<script setup lang="ts">
import { type Ref, ref, isRef, watch } from 'vue';
import { useCopy } from '@/composable/copy';
import type { UploadFileInfo } from 'naive-ui';
import { Upload } from '@vicons/tabler';
import CryptoJS from "crypto-js";

type Hasher = "md5";
type Digest = "base64" | "hex";

function useFileHash(target: Ref<File>, hasher: Ref<Hasher>, digest: Ref<Digest>) {
  const hash = ref('');
  const promise = ref() as Ref<Promise<string>>

  function execute() {
    if (typeof window === "undefined") {
      return
    }

    promise.value = new Promise<string>((resolve, reject) => {
      try {
        if (target.value) {
          resolve(readAndHashFile(target.value, hasher.value, digest.value));
        }
      } catch (error) {
        reject(error);
      }
    });

    promise.value.then(res => hash.value = res)
    return promise.value;
  }

  watch(target, execute, { immediate: true });
  watch(hasher, execute, { immediate: true });
  watch(digest, execute, { immediate: true });

  return {
    hash,
    promise,
    execute,
  }
}

function readAndHashFile(file: File, hashType: Hasher, digestType: Digest) {
  return new Promise<string>((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = (ev) => {
      const content = ev.target!.result as string;

      const hasher = {
        md5: CryptoJS.MD5,
        sha1: CryptoJS.SHA1,
        sha256: CryptoJS.SHA256,
        sha512: CryptoJS.SHA512,
        sha3: CryptoJS.SHA3,
      }

      const digest = {
        base64: CryptoJS.enc.Base64,
        hex: CryptoJS.enc.Hex
      };

      resolve(hasher[hashType](content).toString(digest[digestType]));
    };
    fr.onerror = reject;
    fr.readAsBinaryString(file);
  })
}

const fileList = ref();
const fileInput = ref() as Ref<File>;

const hasher = ref<Hasher>("md5");
const digest = ref<Digest>("hex");

const { hash } = useFileHash(fileInput, hasher, digest);
const { copy: copyHash } = useCopy({ source: hash, text: 'File hash copied to the clipboard' });

async function onUpload({ file: { file } }: { file: UploadFileInfo }) {
  if (file) {
    fileList.value = [];
    fileInput.value = file;
  }
}
</script>
