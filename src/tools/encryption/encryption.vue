<script setup lang="ts">
// Import cryptographic algorithms from crypto-js and Vue composition API
import { AES, RC4, Rabbit, TripleDES, enc } from 'crypto-js';
import { ref, watch } from 'vue';

// Available modes for AES
const aesModes = [
  { label: 'CBC (CryptoJS)', value: 'CBC' },
  { label: 'GCM (WebCrypto)', value: 'GCM' },
];

// Detect if Web Crypto API is available and supports AES-GCM
const canUseWebCrypto = typeof window !== 'undefined'
  && window.crypto?.subtle
  && typeof window.crypto.subtle.encrypt === 'function';

// Functions for AES-GCM using Web Crypto API
async function webCryptoEncrypt(algo: 'AES-GCM', text: string, secret: string, ivHex?: string) {
  if (!canUseWebCrypto) {
    throw new Error('Web Crypto API not available');
  }
  // Encode the plaintext and secret key
  const encText = new TextEncoder().encode(text);
  const encSecret = new TextEncoder().encode(secret.padEnd(32, ' ')).slice(0, 32);
  let iv: Uint8Array;
  // If IV is provided and valid, use it; otherwise, generate a random IV
  if (ivHex && /^[0-9a-fA-F]{24}$/.test(ivHex)) {
    iv = new Uint8Array(ivHex.match(/.{2}/g)!.map(h => Number.parseInt(h, 16)));
  }
  else {
    iv = crypto.getRandomValues(new Uint8Array(12));
  }
  // Import the secret key for AES-GCM
  const key = await crypto.subtle.importKey(
    'raw',
    encSecret,
    { name: algo, length: 256 },
    false,
    ['encrypt'],
  );
  const params: AesGcmParams = {
    name: algo,
    iv,
    tagLength: 128,
  };
  // Encrypt the plaintext using AES-GCM
  const ciphertext = await crypto.subtle.encrypt(params, key, encText);
  // Concatenate IV and ciphertext for easier decryption
  const result = btoa(String.fromCharCode(...iv, ...new Uint8Array(ciphertext)));
  return { result, iv: Array.from(iv).map(b => b.toString(16).padStart(2, '0')).join('') };
};

async function webCryptoDecrypt(algo: 'AES-GCM', b64: string, secret: string) {
  if (!canUseWebCrypto) {
    throw new Error('Web Crypto API not available');
  }
  try {
    // Decode base64 and extract IV and ciphertext
    const data = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
    const iv = data.slice(0, 12); // IV is embedded in the encrypted text
    const ciphertext = data.slice(12);
    // Prepare the secret key
    const encSecret = new TextEncoder().encode(secret.padEnd(32, ' ')).slice(0, 32);
    const key = await crypto.subtle.importKey(
      'raw',
      encSecret,
      { name: algo, length: 256 },
      false,
      ['decrypt'],
    );
    const params: AesGcmParams = {
      name: algo,
      iv,
      tagLength: 128,
    };
    // Decrypt the ciphertext
    const plain = await crypto.subtle.decrypt(params, key, ciphertext);
    return new TextDecoder().decode(plain);
  }
  catch {
    throw new Error('Unable to decrypt your text');
  }
};

// Available algorithms (AES unified)
const algos = {
  AES: {
    modes: ['CBC', ...(canUseWebCrypto ? ['GCM'] : [])],
    encrypt: (mode: string, text: string, secret: string) => {
      // AES-CBC encryption using CryptoJS
      if (mode === 'CBC') {
        return {
          toString: () => AES.encrypt(text, secret).toString(),
        };
      }
      // AES-GCM encryption using Web Crypto API
      if (mode === 'GCM' && canUseWebCrypto) {
        return {
          toString: () => '',
          _async: () => webCryptoEncrypt('AES-GCM', text, secret),
        };
      }
      return { toString: () => '' };
    },
    decrypt: (mode: string, b64: string, secret: string) => {
      // AES-CBC decryption using CryptoJS
      if (mode === 'CBC') {
        return {
          toString: (encoding: any) => AES.decrypt(b64, secret).toString(encoding),
        };
      }
      // AES-GCM decryption using Web Crypto API
      if (mode === 'GCM' && canUseWebCrypto) {
        return {
          toString: () => '',
          _async: () => webCryptoDecrypt('AES-GCM', b64, secret),
        };
      }
      return { toString: () => '' };
    },
  },
  TripleDES,
  Rabbit,
  RC4,
};

// Reactive state for encryption inputs and outputs
const cypherInput = ref('Lorem ipsum dolor sit amet');
const cypherAlgo = ref<keyof typeof algos>('AES');
const cypherAesMode = ref('CBC');
const cypherSecret = ref('my secret key');
const cypherOutput = ref('');
const cypherIV = ref<string>(generateRandomIVHex(12)); // Default random IV

// Reactive state for decryption inputs and outputs
const decryptInput = ref('U2FsdGVkX1/EC3+6P5dbbkZ3e1kQ5o2yzuU0NHTjmrKnLBEwreV489Kr0DIB+uBs');
const decryptAlgo = ref<keyof typeof algos>('AES');
const decryptAesMode = ref('CBC');
const decryptSecret = ref('my secret key');
const decryptOutput = ref('');
const decryptError = ref('');

// Utility to generate random IV in hex format
function generateRandomIVHex(length = 12) {
  return Array.from(crypto.getRandomValues(new Uint8Array(length)))
    .map(b => b.toString(16).padStart(2, '0')).join('');
}

// Watchers to handle both sync and async algorithms for encryption
watch([cypherInput, cypherSecret, cypherAlgo, cypherAesMode, cypherIV], async () => {
  // If AES is selected, handle modes
  if (cypherAlgo.value === 'AES') {
    const mode = cypherAesMode.value;
    const algo = algos.AES;
    if (mode === 'GCM') {
      cypherOutput.value = 'Encrypting...';
      try {
        const ivHex = cypherIV.value;
        // Validate IV for GCM mode
        if (!/^[0-9a-fA-F]{24}$/.test(ivHex)) {
          cypherOutput.value = 'IV must be 24 hex characters (12 bytes)';
          return;
        }
        // Pass IV to webCryptoEncrypt
        const encResult = await webCryptoEncrypt('AES-GCM', cypherInput.value, cypherSecret.value, ivHex);
        if (typeof encResult === 'object' && encResult.result && encResult.iv) {
          cypherOutput.value = encResult.result;
        }
        else if (typeof encResult === 'string') {
          cypherOutput.value = encResult;
        }
      }
      catch {
        cypherOutput.value = 'Encryption error';
      }
    }
    else {
      // AES-CBC encryption
      cypherOutput.value = algo.encrypt(mode, cypherInput.value, cypherSecret.value).toString();
    }
  }
  else {
    // Non-AES algorithms
    const algo = algos[cypherAlgo.value];
    cypherOutput.value = algo.encrypt(cypherInput.value, cypherSecret.value).toString();
  }
}, { immediate: true });

// Watcher to generate a new IV if switching to GCM mode and IV is invalid
watch([cypherAesMode, cypherAlgo], () => {
  if (
    cypherAlgo.value === 'AES'
    && cypherAesMode.value === 'GCM'
    && (!/^[0-9a-fA-F]{24}$/.test(cypherIV.value))
  ) {
    cypherIV.value = generateRandomIVHex(12);
  }
});

// Watchers to handle both sync and async algorithms for decryption
watch([decryptInput, decryptSecret, decryptAlgo, decryptAesMode], async () => {
  decryptError.value = '';
  if (decryptAlgo.value === 'AES') {
    const mode = decryptAesMode.value;
    const algo = algos.AES;
    if (mode === 'GCM') {
      decryptOutput.value = 'Decrypting...';
      try {
        const decryptionResult = algo.decrypt(mode, decryptInput.value, decryptSecret.value);
        if (decryptionResult && typeof decryptionResult._async === 'function') {
          decryptOutput.value = await decryptionResult._async();
        }
        else {
          throw new Error('Invalid decryption result or unsupported mode.');
        }
      }
      catch (e: any) {
        decryptOutput.value = '';
        decryptError.value = e?.message || 'Unable to decrypt your text';
      }
    }
    else {
      try {
        decryptOutput.value = algo.decrypt(mode, decryptInput.value, decryptSecret.value).toString(enc.Utf8);
      }
      catch {
        decryptOutput.value = '';
        decryptError.value = 'Unable to decrypt your text';
      }
    }
  }
  else {
    const algo = algos[decryptAlgo.value];
    try {
      decryptOutput.value = algo.decrypt(decryptInput.value, decryptSecret.value).toString(enc.Utf8);
    }
    catch {
      decryptOutput.value = '';
      decryptError.value = 'Unable to decrypt your text';
    }
  }
}, { immediate: true });
</script>

<template>
  <!-- Encryption card UI -->
  <c-card title="Encrypt">
    <div flex gap-3>
      <c-input-text
        v-model:value="cypherInput"
        label="Your text:"
        placeholder="The string to cypher"
        rows="4"
        multiline raw-text monospace autosize flex-1
      />
      <div flex flex-1 flex-col gap-2>
        <c-input-text v-model:value="cypherSecret" label="Your secret key:" clearable raw-text />
        <c-select
          v-model:value="cypherAlgo"
          label="Encryption algorithm:"
          :options="Object.keys(algos).map((label) => ({ label, value: label }))"
        />
        <!-- Show modes only if AES is selected -->
        <c-select
          v-if="cypherAlgo === 'AES'"
          v-model:value="cypherAesMode"
          label="AES mode:"
          :options="aesModes"
        />
        <!-- Editable IV only for GCM, below the mode selector -->
        <c-input-text
          v-if="cypherAlgo === 'AES' && cypherAesMode === 'GCM'"
          v-model:value="cypherIV"
          label="IV (hex):"
          maxlength="24"
          monospace
          clearable
          placeholder="24 hex chars"
          suffix-icon="i-carbon-renew"
          @click-suffix="cypherIV = generateRandomIVHex(12)"
        />
      </div>
    </div>
    <c-input-text
      label="Your text encrypted:"
      :value="cypherOutput"
      rows="3"
      placeholder="Your string hash"
      multiline monospace readonly autosize mt-5
    />
  </c-card>
  <!-- Decryption card UI -->
  <c-card title="Decrypt">
    <div flex gap-3>
      <c-input-text
        v-model:value="decryptInput"
        label="Your encrypted text:"
        placeholder="The string to cypher"
        rows="4"
        multiline raw-text monospace autosize flex-1
      />
      <div flex flex-1 flex-col gap-2>
        <c-input-text v-model:value="decryptSecret" label="Your secret key:" clearable raw-text />
        <c-select
          v-model:value="decryptAlgo"
          label="Encryption algorithm:"
          :options="Object.keys(algos).map((label) => ({ label, value: label }))"
        />
        <!-- Show modes only if AES is selected -->
        <c-select
          v-if="decryptAlgo === 'AES'"
          v-model:value="decryptAesMode"
          label="AES mode:"
          :options="aesModes"
        />
      </div>
    </div>
    <c-alert v-if="decryptError" type="error" mt-12 title="Error while decrypting">
      {{ decryptError }}
    </c-alert>
    <c-input-text
      v-else
      label="Your decrypted text:"
      :value="decryptOutput"
      placeholder="Your string hash"
      rows="3"
      multiline monospace readonly autosize mt-5
    />
  </c-card>
</template>
