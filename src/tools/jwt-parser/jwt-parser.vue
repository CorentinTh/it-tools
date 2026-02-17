<script setup lang="ts">
import { HmacMD5, HmacSHA1, HmacSHA224, HmacSHA256, HmacSHA384, HmacSHA512, enc } from 'crypto-js';
import type { lib } from 'crypto-js';
import { decodeJwt } from './jwt-parser.service';
import { useValidation } from '@/composable/validation';
import { isNotThrowing } from '@/utils/boolean';
import { withDefaultOnError } from '@/utils/defaults';

const rawJwt = ref(
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
);

const decodedJWT = computed(() =>
  withDefaultOnError(() => decodeJwt({ jwt: rawJwt.value }), { header: [], payload: [] }),
);

const showAsJson = ref(false);
const signatureSecret = ref('');

// Create editable versions of header and payload
const editableHeader = ref<Record<string, any>>({});
const editablePayload = ref<Record<string, any>>({});

// Editable JSON string
const editableJson = ref('');

// Track the original key being edited (stable reference)
const editingKeys = ref<Record<string, string>>({});

// Map of supported HMAC algorithms
const hmacAlgorithms: Record<string, (message: string, key: string) => lib.WordArray> = {
  HS256: HmacSHA256,
  HS384: HmacSHA384,
  HS512: HmacSHA512,
  HS224: HmacSHA224,
  HS1: HmacSHA1,
  MD5: HmacMD5,
};

// Recommended minimum secret lengths for each algorithm (in bytes)
const minimumSecretLengths: Record<string, number> = {
  HS256: 32, // 256 bits
  HS384: 48, // 384 bits
  HS512: 64, // 512 bits
  HS224: 28, // 224 bits
  HS1: 20, // 160 bits
  MD5: 16, // 128 bits
};

// Get the algorithm from the header
const algorithm = computed(() => {
  return editableHeader.value.alg || 'HS256';
});

// Check if the algorithm is supported
const isAlgorithmSupported = computed(() => {
  return algorithm.value in hmacAlgorithms;
});

// Calculate secret length in bytes
const secretLength = computed(() => {
  if (!signatureSecret.value) {
    return 0;
  }
  return new TextEncoder().encode(signatureSecret.value).byteLength;
});

// Get minimum required length for current algorithm
const minimumSecretLength = computed(() => {
  return minimumSecretLengths[algorithm.value] || 32;
});

// Check if secret meets minimum length requirement
const isSecretLengthValid = computed(() => {
  if (!signatureSecret.value || !isAlgorithmSupported.value) {
    return true; // Don't show error if no secret or unsupported algorithm
  }

  return secretLength.value >= minimumSecretLength.value;
});

// Get the required secret length message
const secretLengthMessage = computed(() => {
  if (!signatureSecret.value) {
    return '';
  }

  if (!isAlgorithmSupported.value) {
    return '';
  }

  return `${secretLength.value}/${minimumSecretLength.value} bytes`;
});

// Validation for signature secret
const secretValidation = useValidation({
  source: signatureSecret,
  rules: [
    {
      validator: () => {
        if (!signatureSecret.value) {
          return true;
        }
        return isSecretLengthValid.value;
      },
      message: computed(() => {
        if (!isAlgorithmSupported.value) {
          return '';
        }
        return `Secret must be at least ${minimumSecretLength.value} bytes for ${algorithm.value}`;
      }).value,
    },
  ],
  watch: [algorithm],
});

// Extract and display signature
const currentSignature = computed(() => {
  const parts = rawJwt.value.split('.');
  return parts[2] || '';
});

// Calculate the expected signature based on secret and algorithm
const expectedSignature = computed(() => {
  if (!signatureSecret.value || !isSecretLengthValid.value) {
    return '';
  }

  if (!isAlgorithmSupported.value) {
    return '';
  }

  try {
    const parts = rawJwt.value.split('.');
    const headerPayload = `${parts[0]}.${parts[1]}`;

    // Sign using the algorithm specified in the header
    const hmacFunction = hmacAlgorithms[algorithm.value];
    const signature = hmacFunction(headerPayload, signatureSecret.value);

    // Convert to base64url (JWT standard)
    return signature.toString(enc.Base64).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  }
  catch (error) {
    console.error('Failed to calculate signature:', error);
    return '';
  }
});

// Check if the signature is valid
const isSignatureValid = computed(() => {
  if (!signatureSecret.value || !currentSignature.value || !isSecretLengthValid.value) {
    return null;
  }

  if (!isAlgorithmSupported.value) {
    return null;
  }

  return currentSignature.value === expectedSignature.value;
});

// Function to update the signature with the expected one
function updateSignature() {
  if (!expectedSignature.value || !isSecretLengthValid.value) {
    return;
  }

  const parts = rawJwt.value.split('.');
  rawJwt.value = `${parts[0]}.${parts[1]}.${expectedSignature.value}`;
}

// Sync decoded values to editable state when JWT changes
watch(
  decodedJWT,
  (decoded) => {
    // Only update if we're not actively editing keys
    const hasEditingKeys = Object.keys(editingKeys.value).length > 0;

    if (!hasEditingKeys) {
      editableHeader.value = decoded.header.reduce(
        (acc, { claim, value }) => {
          acc[claim] = value;
          return acc;
        },
        {} as Record<string, any>,
      );

      editablePayload.value = decoded.payload.reduce(
        (acc, { claim, value }) => {
          acc[claim] = value;
          return acc;
        },
        {} as Record<string, any>,
      );
    }

    // Update JSON representation
    updateJsonFromObjects();
  },
  { immediate: true },
);

// Computed table rows with stable keys
const tableRows = computed(() => {
  return {
    header: Object.keys(editableHeader.value).map((key, index) => {
      const original = decodedJWT.value.header.find(item => item.claim === key);
      const stableId = `header-${index}`;
      return {
        stableId,
        claim: key,
        value: editableHeader.value[key],
        claimDescription: original?.claimDescription,
        friendlyValue: original?.friendlyValue,
      };
    }),
    payload: Object.keys(editablePayload.value).map((key, index) => {
      const original = decodedJWT.value.payload.find(item => item.claim === key);
      const stableId = `payload-${index}`;
      return {
        stableId,
        claim: key,
        value: editablePayload.value[key],
        claimDescription: original?.claimDescription,
        friendlyValue: original?.friendlyValue,
      };
    }),
  };
});

// Update JSON string from objects
function updateJsonFromObjects() {
  editableJson.value = JSON.stringify(
    {
      header: editableHeader.value,
      payload: editablePayload.value,
    },
    null,
    2,
  );
}

// Update objects from JSON string
function updateObjectsFromJson() {
  try {
    const parsed = JSON.parse(editableJson.value);

    if (parsed.header && typeof parsed.header === 'object') {
      editableHeader.value = parsed.header;
    }

    if (parsed.payload && typeof parsed.payload === 'object') {
      editablePayload.value = parsed.payload;
    }

    updateJWT();
  }
  catch (error) {
    // Invalid JSON, don't update
    console.error('Invalid JSON:', error);
  }
}

// Validation for JSON
const jsonValidation = useValidation({
  source: editableJson,
  rules: [
    {
      validator: (value) => {
        try {
          const parsed = JSON.parse(value);
          return parsed.header && parsed.payload;
        }
        catch {
          return false;
        }
      },
      message: 'Invalid JSON format. Must contain "header" and "payload" properties.',
    },
  ],
});

// Function to re-encode JWT when values are edited (without updating signature)
function updateJWT() {
  try {
    const headerBase64 = toBase64Url(JSON.stringify(editableHeader.value))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
    const payloadBase64 = toBase64Url(JSON.stringify(editablePayload.value))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    // Keep the existing signature
    const signature = currentSignature.value;

    rawJwt.value = `${headerBase64}.${payloadBase64}.${signature}`;
  }
  catch (error) {
    console.error('Failed to encode JWT:', error);
  }
}

function toBase64Url(input: string): string {
  const bytes = new TextEncoder().encode(input);
  let binary = '';
  bytes.forEach(b => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

// Start editing a key
function startEditingKey(stableId: string, currentKey: string) {
  editingKeys.value[stableId] = currentKey;
}

// Update key while editing
function updateEditingKey(section: 'header' | 'payload', stableId: string, newValue: string) {
  const originalKey = editingKeys.value[stableId];
  if (!originalKey || !newValue.trim()) {
    return;
  }

  const data = section === 'header' ? editableHeader.value : editablePayload.value;

  // Create a new object with the updated key
  const newData: Record<string, any> = {};
  Object.keys(data).forEach((key) => {
    if (key === originalKey) {
      newData[newValue] = data[key];
    }
    else {
      newData[key] = data[key];
    }
  });

  if (section === 'header') {
    editableHeader.value = newData;
  }
  else {
    editablePayload.value = newData;
  }

  // Update the original key reference
  editingKeys.value[stableId] = newValue;

  updateJWT();
  updateJsonFromObjects();
}

// Stop editing a key
function stopEditingKey(stableId: string) {
  delete editingKeys.value[stableId];
}

// Handle table value changes
function handleTableValueChange() {
  updateJWT();
  updateJsonFromObjects();
}

const sections = [
  { key: 'header' as const, title: 'Header', editableData: editableHeader },
  { key: 'payload' as const, title: 'Payload', editableData: editablePayload },
];

const validation = useValidation({
  source: rawJwt,
  rules: [
    {
      validator: value => value.length > 0 && isNotThrowing(() => decodeJwt({ jwt: rawJwt.value })),
      message: 'Invalid JWT',
    },
  ],
});
</script>

<template>
  <c-card>
    <c-input-text
      v-model:value="rawJwt"
      label="JWT to decode"
      :validation="validation"
      placeholder="Put your token here..."
      rows="5"
      multiline
      raw-text
      autofocus
      mb-3
    />

    <c-input-text
      v-model:value="signatureSecret"
      :label="signatureSecret ? `Signature secret (optional) - ${secretLengthMessage}` : 'Signature secret (optional)'"
      :validation="secretValidation"
      placeholder="Enter secret to verify/sign JWT..."
      raw-text
      clearable
      mb-3
    />

    <div v-if="validation.isValid" class="mb-3">
      <div class="mb-2 flex items-center gap-2">
        <span class="font-bold">Algorithm:</span>
        <span class="text-sm font-mono">{{ algorithm }}</span>
        <span v-if="!isAlgorithmSupported" class="text-sm text-orange-600 dark:text-orange-400">
          (Unsupported - only HMAC algorithms are supported)
        </span>
      </div>

      <div class="mb-2 flex items-center gap-2">
        <span class="font-bold">Signature:</span>
        <span class="break-all text-sm font-mono">{{ currentSignature || '(no signature)' }}</span>
      </div>

      <div class="flex items-center gap-2">
        <span class="font-bold">Signature Status:</span>
        <!-- Secret too short -->
        <span v-if="signatureSecret && !isSecretLengthValid" class="text-red-600 dark:text-red-400"> ✗ Secret too short </span>
        <!-- No signature but has valid secret -->
        <div v-else-if="!currentSignature && signatureSecret && isSecretLengthValid" class="flex items-center gap-2">
          <span class="text-yellow-600 dark:text-yellow-400"> ⚠ Unverified (no signature) </span>
          <c-button size="small" @click="updateSignature">
            Add Signature
          </c-button>
        </div>
        <!-- Has signature but no secret -->
        <span v-else-if="!signatureSecret && currentSignature" class="text-yellow-600 dark:text-yellow-400">
          ⚠ Unverified (enter secret to verify)
        </span>
        <!-- Valid signature -->
        <div v-else-if="isSignatureValid === true" class="flex items-center gap-2">
          <span class="text-green-600 dark:text-green-400"> ✓ Valid </span>
        </div>
        <!-- Invalid signature -->
        <div v-else-if="isSignatureValid === false" class="flex items-center gap-2">
          <span class="text-red-600 dark:text-red-400"> ✗ Invalid </span>
          <c-button size="small" @click="updateSignature">
            Update Signature
          </c-button>
        </div>
        <!-- No signature and no secret -->
        <span v-else-if="!currentSignature" class="op-50"> No signature </span>
        <!-- Other cases -->
        <span v-else class="op-50">
          {{ isAlgorithmSupported ? 'Enter secret to verify' : 'Algorithm not supported' }}
        </span>
      </div>
    </div>

    <br>
    <hr style="height: 1px; border: 0; border-top: 1px solid #353535">
    <br>

    <div v-if="validation.isValid" class="mb-3 flex items-center gap-2">
      <span>Display as JSON:</span>
      <n-switch v-model:value="showAsJson" />
    </div>

    <c-input-text
      v-if="validation.isValid && showAsJson"
      v-model:value="editableJson"
      :validation="jsonValidation"
      label="Decoded JWT (JSON)"
      placeholder="Edit JSON here..."
      rows="15"
      multiline
      raw-text
      @update:value="updateObjectsFromJson"
    />

    <n-table v-if="validation.isValid && !showAsJson">
      <tbody>
        <template v-for="section of sections" :key="section.key">
          <th colspan="2" class="table-header">
            {{ section.title }}
          </th>
          <tr v-for="row in tableRows[section.key]" :key="row.stableId">
            <td class="claims" style="vertical-align: top; width: 30%">
              <div>
                <n-input
                  :value="row.claim"
                  size="small"
                  style="font-weight: bold"
                  @focus="() => startEditingKey(row.stableId, row.claim)"
                  @input="(value) => updateEditingKey(section.key, row.stableId, value)"
                  @blur="() => stopEditingKey(row.stableId)"
                />
                <div v-if="row.claimDescription" class="ml-2 mt-1 text-sm op-70">
                  ({{ row.claimDescription }})
                </div>
              </div>
            </td>
            <td style="word-wrap: break-word; word-break: break-all; vertical-align: top">
              <div>
                <n-input
                  v-model:value="section.editableData.value[row.claim]"
                  size="small"
                  @input="handleTableValueChange"
                />
                <div v-if="row.friendlyValue" class="ml-2 mt-1 text-sm op-70">
                  ({{ row.friendlyValue }})
                </div>
              </div>
            </td>
          </tr>
        </template>
      </tbody>
    </n-table>
  </c-card>
</template>

<style lang="less" scoped>
.table-header {
  text-align: center;
}
</style>
