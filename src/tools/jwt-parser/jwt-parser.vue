<script setup lang="ts">
import type { JwtAlgorithm, JwtKeys, SignatureStatus } from './jwt-parser.service';
import { CircleCheck, CircleX } from '@vicons/tabler';
import { useThemeVars } from 'naive-ui';
import { useRoute } from 'vue-router';
import { useCopy } from '@/composable/copy';
import { isNotThrowing } from '@/utils/boolean';
import { withDefaultOnError } from '@/utils/defaults';
import {
  buildShareUrl,
  decodeJwt,
  getSignatureFunctionName,
  hasUnsafeInteger,
  isSupportedAlgorithm,
  isSymmetricAlgorithm,
  JWT_ALGORITHMS,
  readSharedJwt,
  signJwt,
  verifyJwt,
} from './jwt-parser.service';

const DEFAULT_JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

const STATUS_MESSAGES: Record<SignatureStatus, string> = {
  'verified': 'Signature verified',
  'invalid': 'Invalid signature',
  'invalid-secret': 'Invalid secret',
  'invalid-public-key': 'Invalid public key',
  'missing-secret': 'Enter a secret to verify the signature',
  'missing-public-key': 'Enter a public key to verify the signature',
  'unsupported-algorithm': 'Unsupported algorithm',
};

const route = useRoute();
const themeVars = useThemeVars();
const { copy } = useCopy({ text: 'Share link copied to the clipboard' });

const rawJwt = ref('');
const algorithm = ref<JwtAlgorithm>('HS256');
const header = ref('');
const payload = ref('');
const secret = ref('your-256-bit-secret');
const isSecretBase64 = ref(false);
const publicKey = ref('');
const privateKey = ref('');
const signatureStatus = ref<SignatureStatus>('invalid');
const signingError = ref('');
const backdropRef = ref<HTMLElement>();
const tokenInputRef = ref<HTMLTextAreaElement>();

// Signing and verification are async, so a slow run must not overwrite the result of a newer edit.
// Separate counters let a public key edit re-verify without cancelling a running re-sign.
let latestSignId = 0;
let latestVerificationId = 0;

const keys = computed<JwtKeys>(() => ({
  secret: secret.value,
  isSecretBase64: isSecretBase64.value,
  publicKey: publicKey.value,
  privateKey: privateKey.value,
}));

const jwtSegments = computed(() => rawJwt.value.split('.'));
const isJwtValid = computed(() => rawJwt.value.length > 0 && isNotThrowing(() => decodeJwt({ jwt: rawJwt.value })));
const isSymmetric = computed(() => isSymmetricAlgorithm(algorithm.value));
const signatureFunctionName = computed(() => getSignatureFunctionName(algorithm.value));

const showUnsafeIntegerWarning = computed(() => hasUnsafeInteger({ jwt: rawJwt.value, payload: payload.value }));
const isVerified = computed(() => signingError.value === '' && signatureStatus.value === 'verified');
const canShare = computed(() => isJwtValid.value && signingError.value === '');
const statusMessage = computed(() => signingError.value === '' ? STATUS_MESSAGES[signatureStatus.value] : 'Token not updated');

async function updateSignatureStatus() {
  latestVerificationId += 1;
  const verificationId = latestVerificationId;
  const status = await verifyJwt({ jwt: rawJwt.value, keys: keys.value });

  if (verificationId === latestVerificationId) {
    signatureStatus.value = status;
  }
}

function syncAlgorithmFromHeader() {
  const alg = withDefaultOnError(() => JSON.parse(header.value)?.alg, undefined);

  if (isSupportedAlgorithm(alg)) {
    algorithm.value = alg;
  }
}

function onJwtChange(value: string) {
  latestSignId += 1;
  rawJwt.value = value;
  signingError.value = '';

  const decoded = withDefaultOnError(() => decodeJwt({ jwt: value }), { header: '{}', payload: '{}' });
  header.value = decoded.header;
  payload.value = decoded.payload;
  syncAlgorithmFromHeader();
  updateSignatureStatus();
}

async function signToken() {
  latestSignId += 1;
  const signId = latestSignId;

  try {
    const jwt = await signJwt({ header: header.value, payload: payload.value, keys: keys.value });

    if (signId !== latestSignId) {
      return;
    }

    rawJwt.value = jwt;
    signingError.value = '';
  }
  catch (error) {
    if (signId !== latestSignId) {
      return;
    }

    signingError.value = (error as Error).message;
  }

  await updateSignatureStatus();
}

function onHeaderChange(value: string) {
  header.value = value;
  syncAlgorithmFromHeader();
  signToken();
}

function onPayloadChange(value: string) {
  payload.value = value;
  signToken();
}

function onAlgorithmChange(value: JwtAlgorithm) {
  algorithm.value = value;

  const currentHeader = withDefaultOnError(() => JSON.parse(header.value), { typ: 'JWT' });
  header.value = JSON.stringify({ ...currentHeader, alg: value }, null, 2);
  signToken();
}

function onSecretChange(value: string) {
  secret.value = value;
  signToken();
}

function onSecretBase64Change(value: boolean) {
  isSecretBase64.value = value;
  signToken();
}

function onPrivateKeyChange(value: string) {
  privateKey.value = value;
  signToken();
}

function onPublicKeyChange(value: string) {
  publicKey.value = value;
  updateSignatureStatus();
}

function syncBackdropScroll(event: Event) {
  if (backdropRef.value) {
    backdropRef.value.scrollTop = (event.target as HTMLTextAreaElement).scrollTop;
  }
}

function share() {
  copy(buildShareUrl({ url: window.location.href, jwt: rawJwt.value }));
}

onJwtChange(readSharedJwt({ hash: route.hash }) ?? DEFAULT_JWT);

// The native autofocus attribute only applies once per document, so it misses later in-app navigations.
onMounted(() => tokenInputRef.value?.focus());

watch(() => route.hash, (hash) => {
  const sharedJwt = readSharedJwt({ hash });

  if (sharedJwt) {
    onJwtChange(sharedJwt);
  }
});
</script>

<template>
  <div class="jwt-debugger">
    <c-alert mb-4>
      <strong>Warning:</strong> JWTs are credentials, which can grant access to resources. Be careful where you paste them. All validation and debugging runs in your browser.
    </c-alert>

    <div mb-4 flex justify-center>
      <c-select
        :value="algorithm"
        :options="[...JWT_ALGORITHMS]"
        label="Algorithm"
        label-position="left"
        label-width="90px"
        w-220px
        @update:value="onAlgorithmChange"
      />
    </div>

    <div class="panels">
      <section class="panel">
        <h2 class="panel-title">
          Encoded <small>paste a token here</small>
        </h2>

        <div class="token-editor">
          <div ref="backdropRef" class="token-backdrop" aria-hidden="true">
            <template v-for="(segment, index) of jwtSegments" :key="index">
              <span v-if="index > 0">.</span><span :class="`token-segment-${index}`">{{ segment }}</span>
            </template>
          </div>
          <textarea
            ref="tokenInputRef"
            class="token-input"
            :value="rawJwt"
            aria-label="Encoded JWT"
            data-test-id="jwt-encoded"
            autocapitalize="off"
            autocomplete="off"
            autocorrect="off"
            spellcheck="false"
            @input="onJwtChange(($event.target as HTMLTextAreaElement).value)"
            @scroll="syncBackdropScroll"
          />
        </div>
        <div v-if="!isJwtValid" class="error-text" mt-2 data-test-id="jwt-invalid">
          Invalid JWT
        </div>
      </section>

      <section class="panel">
        <h2 class="panel-title">
          Decoded <small>edit the payload and secret</small>
        </h2>

        <div class="decoded">
          <div class="decoded-title">
            Header <span>Algorithm and token type</span>
          </div>
          <div class="decoded-body decoded-header">
            <c-input-text
              :value="header"
              multiline
              autosize
              monospace
              raw-text
              rows="4"
              placeholder="Header JSON"
              test-id="jwt-header"
              @update:value="onHeaderChange"
            />
          </div>

          <div class="decoded-title">
            Payload <span>Data</span>
          </div>
          <div class="decoded-body decoded-payload">
            <c-input-text
              :value="payload"
              multiline
              autosize
              monospace
              raw-text
              rows="5"
              placeholder="Payload JSON"
              test-id="jwt-payload"
              @update:value="onPayloadChange"
            />
          </div>

          <div class="decoded-title">
            Verify signature
          </div>
          <div class="decoded-body signature">
            <div>{{ signatureFunctionName }}(</div>
            <div class="signature-arguments">
              <div>base64UrlEncode(header) + "." +</div>
              <div mb-2>
                base64UrlEncode(payload),
              </div>

              <c-input-text
                v-if="isSymmetric"
                :value="secret"
                monospace
                raw-text
                placeholder="your-256-bit-secret"
                test-id="jwt-secret"
                @update:value="onSecretChange"
              />
              <template v-else>
                <c-input-text
                  :value="publicKey"
                  multiline
                  monospace
                  raw-text
                  rows="4"
                  mb-2
                  placeholder="Public key in SPKI, PKCS #1, X.509 certificate, or JWK string format."
                  test-id="jwt-public-key"
                  @update:value="onPublicKeyChange"
                />
                <c-input-text
                  :value="privateKey"
                  multiline
                  monospace
                  raw-text
                  rows="4"
                  placeholder="Private key in PKCS #8, PKCS #1, or JWK string format. The key never leaves your browser."
                  test-id="jwt-private-key"
                  @update:value="onPrivateKeyChange"
                />
              </template>
            </div>
            <div flex items-center gap-2>
              <span>)</span>
              <n-checkbox v-if="isSymmetric" :checked="isSecretBase64" data-test-id="jwt-secret-base64" @update:checked="onSecretBase64Change">
                secret base64 encoded
              </n-checkbox>
            </div>
          </div>
        </div>

        <div v-if="signingError" class="error-text" mt-2 data-test-id="jwt-signing-error">
          {{ signingError }}
        </div>
        <div v-if="showUnsafeIntegerWarning" class="warning-text" mt-2 data-test-id="jwt-unsafe-integer">
          The payload contains an integer too large for JavaScript. Re-signing rounds it, which changes its value.
        </div>
      </section>
    </div>

    <div class="panels" mt-4>
      <div class="status" :class="{ verified: isVerified }" data-test-id="jwt-status">
        <n-icon size="28" :component="isVerified ? CircleCheck : CircleX" />
        {{ statusMessage }}
      </div>
      <c-button size="large" :disabled="!canShare" data-test-id="jwt-share" @click="share">
        Share JWT
      </c-button>
    </div>
  </div>
</template>

<style lang="less" scoped>
@token-header-color: #fb015b;
@token-payload-color: #d63aff;
@token-signature-color: #00b9f1;

.jwt-debugger {
  flex: 0 0 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.panels {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 800px) {
    grid-template-columns: minmax(0, 1fr);
  }
}

.panel {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.panel-title {
  margin: 0 0 8px;
  font-size: 24px;
  font-weight: 400;

  small {
    margin-left: 8px;
    font-size: 11px;
    text-transform: uppercase;
    opacity: 0.6;
  }
}

.token-editor {
  position: relative;
  flex: 1;
  min-height: 320px;
  border: 1px solid v-bind('themeVars.borderColor');
  border-radius: 4px;
  background-color: v-bind('themeVars.cardColor');
}

.token-backdrop,
.token-input {
  position: absolute;
  inset: 0;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 16px;
  border: 0;
  overflow-y: auto;
  scrollbar-gutter: stable;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 16px;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-all;
}

.token-backdrop {
  overflow-y: hidden;
  pointer-events: none;
}

// The textarea text is transparent so that the colored backdrop shows through it.
.token-input {
  color: transparent;
  background: transparent;
  caret-color: v-bind('themeVars.textColorBase');
  outline: none;
  resize: none;

  &:focus-visible {
    outline: 1px solid v-bind('themeVars.primaryColor');
    border-radius: 4px;
  }
}

.token-segment-0 {
  color: @token-header-color;
}

.token-segment-1 {
  color: @token-payload-color;
}

.token-segment-2 {
  color: @token-signature-color;
}

.decoded {
  border: 1px solid v-bind('themeVars.borderColor');
  border-radius: 4px;
  overflow: hidden;
}

.decoded-title {
  padding: 6px 10px;
  border-bottom: 1px solid v-bind('themeVars.borderColor');
  font-size: 12px;

  span {
    opacity: 0.6;
  }
}

.decoded-body {
  padding: 10px;

  &:not(:last-child) {
    border-bottom: 1px solid v-bind('themeVars.borderColor');
  }
}

.decoded-header :deep(.c-input-text .input-wrapper > textarea.input) {
  color: @token-header-color;
}

.decoded-payload :deep(.c-input-text .input-wrapper > textarea.input) {
  color: @token-payload-color;
}

.signature {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 14px;
  color: @token-signature-color;
}

.signature-arguments {
  padding-left: 16px;
}

.error-text {
  color: v-bind('themeVars.errorColor');
}

.warning-text {
  color: v-bind('themeVars.warningColor');
}

.status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 22px;
  color: v-bind('themeVars.errorColor');

  &.verified {
    color: @token-signature-color;
  }
}
</style>
