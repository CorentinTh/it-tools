<script setup lang="ts">
import { verifyJwtWithPublicKey } from './jwt-asymmetric.service';
import type { JsonRecord, JwtWorkspaceAlgorithm } from './jwt-parser.service';
import { describeTemporalClaims, parseJwtCompact, signJwt, verifyJwt } from './jwt-parser.service';
import { useCopy } from '@/composable/copy';

type Mode = 'decode' | 'verify-hmac' | 'verify-public' | 'author' | 'sign';
const mode = ref<Mode>('decode');
const algorithm = ref<Exclude<JwtWorkspaceAlgorithm, 'none'>>('HS256');
const token = ref('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c');
const secret = ref('');
const publicKey = ref('');
const headerJson = ref('{\n  "typ": "JWT"\n}');
const payloadJson = ref(`{\n  "sub": "1234567890",\n  "name": "John Doe",\n  "iat": ${Math.floor(Date.now() / 1000)}\n}`);
const outputToken = ref('');
const decodedHeader = ref('');
const decodedPayload = ref('');
const status = ref('Ready. Choose decode or verification explicitly.');
const error = ref('');
const warnings = ref<string[]>([]);
const isRunning = ref(false);
const { copy } = useCopy({ source: outputToken, text: 'JWT copied' });

const needsInputToken = computed(() => mode.value === 'decode' || mode.value === 'verify-hmac' || mode.value === 'verify-public');
const needsSecret = computed(() => mode.value === 'verify-hmac' || mode.value === 'sign');
const actionLabel = computed(() => ({
  'author': 'Create unsigned JWT',
  'decode': 'Decode without verification',
  'sign': 'Sign JWT locally',
  'verify-hmac': 'Verify HMAC signature',
  'verify-public': 'Verify with local public key',
})[mode.value]);

function publishParsed(header: JsonRecord, payload: JsonRecord) {
  decodedHeader.value = JSON.stringify(header, null, 2);
  decodedPayload.value = JSON.stringify(payload, null, 2);
  warnings.value = describeTemporalClaims(payload);
}

async function run() {
  isRunning.value = true;
  error.value = '';
  warnings.value = [];
  try {
    if (mode.value === 'decode') {
      const parsed = parseJwtCompact(token.value);
      publishParsed(parsed.header, parsed.payload);
      outputToken.value = '';
      status.value = 'Decoded locally. The signature was not verified.';
    }
    else if (mode.value === 'verify-hmac') {
      const verified = await verifyJwt({ token: token.value, secret: secret.value });
      publishParsed(verified.header, verified.payload);
      outputToken.value = '';
      status.value = verified.unsigned ? 'Unsigned token: there is no signature to verify.' : verified.verified ? `${verified.algorithm} signature is valid for this exact token and secret.` : `${verified.algorithm} signature is invalid.`;
    }
    else if (mode.value === 'verify-public') {
      const verified = await verifyJwtWithPublicKey({ token: token.value, publicKey: publicKey.value });
      publishParsed(verified.header, verified.payload);
      outputToken.value = '';
      const selectedKey = verified.keyId ? `kid "${verified.keyId}"` : `${verified.keySource.toUpperCase()} key`;
      status.value = verified.verified
        ? `${verified.algorithm} signature is valid for this exact token and local ${selectedKey}.`
        : `${verified.algorithm} signature is invalid for this exact token and local ${selectedKey}.`;
    }
    else {
      outputToken.value = await signJwt({
        headerJson: headerJson.value,
        payloadJson: payloadJson.value,
        algorithm: mode.value === 'author' ? 'none' : algorithm.value,
        secret: secret.value,
      });
      const parsed = parseJwtCompact(outputToken.value);
      publishParsed(parsed.header, parsed.payload);
      status.value = mode.value === 'author' ? 'Created an unsigned JWT. It provides no authenticity.' : `Created a locally signed ${algorithm.value} JWT.`;
    }
  }
  catch (caught) {
    error.value = caught instanceof Error ? caught.message : 'JWT task failed.';
    status.value = 'Task failed.';
  }
  finally {
    isRunning.value = false;
  }
}

function clearSensitiveData() {
  secret.value = '';
  publicKey.value = '';
  token.value = '';
  outputToken.value = '';
  decodedHeader.value = '';
  decodedPayload.value = '';
  error.value = '';
  warnings.value = [];
  status.value = 'Sensitive fields cleared.';
}

onBeforeUnmount(() => {
  secret.value = '';
  publicKey.value = '';
  token.value = '';
  outputToken.value = '';
});
</script>

<template>
  <div class="c-task-layout">
    <c-alert title="Decoding is not verification">
      JWT header and payload are untrusted input until a supported signature is verified. This local workspace supports HMAC plus local RSA, RSA-PSS, ECDSA, and Ed25519 public keys. It does not validate issuer, audience, authorization, key rotation, revocation, or server policy. It never downloads jku/x5u keys. Secrets, keys, and tokens are never persisted or sent.
    </c-alert>
    <c-card class="c-task-options" title="Explicit JWT operation">
      <div grid grid-cols-1 gap-3 md:grid-cols-2>
        <c-select v-model:value="mode" label="Operation" :options="[{ label: 'Decode only — no verification', value: 'decode' }, { label: 'Verify HMAC signature', value: 'verify-hmac' }, { label: 'Verify with JWK / JWKS / public PEM', value: 'verify-public' }, { label: 'Author unsigned token', value: 'author' }, { label: 'Sign with HMAC', value: 'sign' }]" />
        <c-select v-if="mode === 'sign'" v-model:value="algorithm" label="Signing algorithm" :options="[{ label: 'HS256', value: 'HS256' }, { label: 'HS384', value: 'HS384' }, { label: 'HS512', value: 'HS512' }]" />
      </div>
      <c-input-text v-if="needsSecret" v-model:value="secret" label="HMAC secret (HS256: 32+, HS384: 48+, HS512: 64+ UTF-8 bytes)" type="password" :maxlength="1024" raw-text mt-3 data-test-id="jwt-secret" />
    </c-card>

    <c-input-text v-if="needsInputToken" v-model:value="token" label="JWT compact token (maximum 256 KiB)" raw-text multiline monospace :rows="9" data-test-id="jwt-token-input" />
    <c-input-text
      v-if="mode === 'verify-public'"
      v-model:value="publicKey"
      label="Local public JWK, JWKS, or SPKI PEM (maximum 256 KiB)"
      placeholder="Paste a public JWK, a JWKS object with keys, or one -----BEGIN PUBLIC KEY----- block"
      raw-text
      multiline
      monospace
      :rows="12"
      data-test-id="jwt-public-key"
    />
    <template v-else>
      <c-input-text v-model:value="headerJson" label="Header JSON object (alg is set by the selected operation)" multiline monospace raw-text :rows="7" />
      <c-input-text v-model:value="payloadJson" label="Payload JSON object" multiline monospace raw-text :rows="12" />
    </template>

    <div class="c-task-actions">
      <c-button type="primary" :disabled="isRunning" data-test-id="jwt-run" @click="run">
        {{ isRunning ? 'Working…' : actionLabel }}
      </c-button>
      <c-button @click="clearSensitiveData">
        Clear sensitive data
      </c-button>
    </div>
    <p class="c-task-status" data-test-id="jwt-status" role="status" aria-live="polite">
      {{ status }}
    </p>
    <c-alert v-if="error" title="JWT task error" data-test-id="jwt-error">
      {{ error }}
    </c-alert>
    <c-alert v-if="warnings.length" title="NumericDate observations">
      <ul list-disc pl-5>
        <li v-for="warning in warnings" :key="warning">
          {{ warning }}
        </li>
      </ul>
    </c-alert>

    <template v-if="decodedHeader || decodedPayload">
      <c-input-text :value="decodedHeader" label="Decoded untrusted header" multiline monospace raw-text readonly :rows="8" />
      <c-input-text :value="decodedPayload" label="Decoded untrusted payload" multiline monospace raw-text readonly :rows="12" />
    </template>
    <template v-if="outputToken">
      <c-input-text :value="outputToken" :label="mode === 'author' ? 'Unsigned compact JWT' : 'Signed compact JWT'" multiline monospace raw-text readonly :rows="9" data-test-id="jwt-output" />
      <div class="c-task-actions">
        <c-button @click="copy()">
          Copy
        </c-button>
      </div>
    </template>
  </div>
</template>
