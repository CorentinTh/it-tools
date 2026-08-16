<script setup lang="ts">
import { BARCODE_MAX_FILE_BYTES } from '../barcode-generator-reader/barcode-reader.service';
import {
  type ParsedOtpAuth,
  QR_CAMERA_MAX_DURATION_MS,
  QR_MAX_PAYLOAD_CHARACTERS,
  decodeQrFile,
  decodeQrVideoFrame,
  parseOtpAuthUri,
  supportsNativeQrDetector,
} from './qr-decoder-otp-import.service';
import { formatBytes } from '@/utils/convert';
import { useCopy } from '@/composable/copy';

const payload = ref('');
const parsedOtp = shallowRef<ParsedOtpAuth>();
const selectedFile = shallowRef<File>();
const detectorAvailable = ref(false);
const status = ref('Checking native QR support…');
const error = ref('');
const isReading = ref(false);
const video = ref<HTMLVideoElement>();
const stream = shallowRef<MediaStream>();
const cameraActive = computed(() => Boolean(stream.value));
const canDecodeFile = computed(() => Boolean(
  selectedFile.value?.type.startsWith('image/')
  && selectedFile.value.size > 0
  && selectedFile.value.size <= BARCODE_MAX_FILE_BYTES,
));
let cameraDeadline: ReturnType<typeof setTimeout> | undefined;

function acceptPayload(value: string): void {
  payload.value = value;
  parsedOtp.value = undefined;
  error.value = '';
  status.value = value.startsWith('otpauth://')
    ? 'OTP QR payload decoded. Select Parse OTP to inspect it.'
    : 'QR payload decoded locally.';
}

function selectFile(file: File): void {
  selectedFile.value = file;
  parsedOtp.value = undefined;
  error.value = '';
  status.value = file.type.startsWith('image/') && file.size > 0 && file.size <= BARCODE_MAX_FILE_BYTES
    ? 'Image selected. Choose Decode image to process it locally.'
    : `Select an image between 1 byte and ${formatBytes(BARCODE_MAX_FILE_BYTES)}.`;
}

async function decodeFile(): Promise<void> {
  const file = selectedFile.value;
  if (!file || isReading.value) {
    return;
  }
  isReading.value = true;
  error.value = '';
  status.value = 'Decoding the local image…';
  try {
    const results = await decodeQrFile(file);
    if (results.length === 0) {
      status.value = 'No QR code was found in this image.';
    }
    else {
      acceptPayload(results[0]);
    }
  }
  catch (caught) {
    error.value = caught instanceof Error ? caught.message : 'The QR image could not be decoded.';
    status.value = 'QR decoding failed.';
  }
  finally {
    isReading.value = false;
  }
}

function stopCamera(message = 'Camera stopped.'): void {
  if (cameraDeadline !== undefined) {
    clearTimeout(cameraDeadline);
    cameraDeadline = undefined;
  }
  stream.value?.getTracks().forEach(track => track.stop());
  stream.value = undefined;
  if (video.value) {
    video.value.srcObject = null;
  }
  status.value = message;
}

async function startCamera(): Promise<void> {
  if (!detectorAvailable.value || cameraActive.value) {
    return;
  }
  error.value = '';
  try {
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: { facingMode: { ideal: 'environment' } },
    });
    stream.value = mediaStream;
    if (!video.value) {
      throw new Error('The camera preview is unavailable.');
    }
    video.value.srcObject = mediaStream;
    await video.value.play();
    status.value = 'Camera active. Point it at a QR code, then select Decode frame.';
    cameraDeadline = setTimeout(() => stopCamera('Camera stopped after the five-minute safety limit.'), QR_CAMERA_MAX_DURATION_MS);
  }
  catch (caught) {
    stopCamera('Camera could not be started.');
    error.value = caught instanceof Error ? caught.message : 'Camera access failed.';
  }
}

async function decodeFrame(): Promise<void> {
  if (!video.value || !cameraActive.value || isReading.value) {
    return;
  }
  isReading.value = true;
  error.value = '';
  try {
    const results = await decodeQrVideoFrame(video.value);
    if (results.length === 0) {
      status.value = 'No QR code found in the current frame.';
    }
    else {
      acceptPayload(results[0]);
    }
  }
  catch (caught) {
    error.value = caught instanceof Error ? caught.message : 'The camera frame could not be decoded.';
  }
  finally {
    isReading.value = false;
  }
}

function parseOtp(): void {
  parsedOtp.value = undefined;
  error.value = '';
  try {
    parsedOtp.value = parseOtpAuthUri(payload.value);
    status.value = `${parsedOtp.value.kind.toUpperCase()} configuration parsed locally. Review the secret before copying.`;
  }
  catch (caught) {
    error.value = caught instanceof Error ? caught.message : 'The OTP URI could not be parsed.';
    status.value = 'OTP parsing failed.';
  }
}

const otpJson = computed(() => parsedOtp.value ? JSON.stringify(parsedOtp.value, null, 2) : '');
const { copy } = useCopy({ createToast: true });

onMounted(async () => {
  detectorAvailable.value = await supportsNativeQrDetector();
  status.value = detectorAvailable.value
    ? 'Native QR decoding is available. Select an image or start the camera explicitly.'
    : 'Native BarcodeDetector QR support is unavailable. You can still paste an otpauth:// payload for safe local parsing.';
});
onBeforeUnmount(() => stopCamera());
</script>

<template>
  <div class="c-tool-stack c-tool-workbench">
    <c-alert title="Local decoding with explicit camera access">
      Images, camera frames, QR payloads, and OTP secrets stay in this page and are never saved. Camera access starts only on request, stops after five minutes, and is released when you leave. Native QR support depends on the browser.
    </c-alert>

    <c-card class="c-tool-panel" title="Decode a local QR image">
      <c-file-upload accept="image/*" :disabled="isReading" title="Drop one local QR image here, or choose a file" @file-upload="selectFile" />
      <p v-if="selectedFile" mt-3 data-test-id="qr-file">
        {{ selectedFile.name }} — {{ formatBytes(selectedFile.size) }}
      </p>
      <div class="c-task-actions mt-3">
        <c-button type="primary" data-test-id="qr-decode-file" :disabled="!detectorAvailable || !canDecodeFile || isReading" @click="decodeFile">
          {{ isReading ? 'Decoding…' : 'Decode image' }}
        </c-button>
      </div>
    </c-card>

    <c-card class="c-tool-panel" title="Decode one camera frame">
      <video ref="video" data-test-id="qr-camera-preview" :muted="true" playsinline class="camera-preview" />
      <div class="c-task-actions mt-3">
        <c-button v-if="!cameraActive" type="primary" data-test-id="qr-start-camera" :disabled="!detectorAvailable" @click="startCamera">
          Start camera
        </c-button>
        <c-button v-if="cameraActive" type="primary" data-test-id="qr-decode-frame" :disabled="isReading" @click="decodeFrame">
          Decode frame
        </c-button>
        <c-button v-if="cameraActive" type="warning" data-test-id="qr-stop-camera" @click="stopCamera()">
          Stop camera
        </c-button>
      </div>
    </c-card>

    <p class="c-task-status" data-test-id="qr-status" role="status" aria-live="polite">
      {{ status }}
    </p>
    <c-alert v-if="error" title="QR or OTP error" data-test-id="qr-error">
      {{ error }}
    </c-alert>

    <c-input-text
      v-model:value="payload"
      class="c-tool-panel"
      label="Decoded or manually pasted QR payload"
      placeholder="otpauth://totp/Issuer:account?secret=…"
      test-id="qr-payload"
      raw-text monospace multiline
      :maxlength="QR_MAX_PAYLOAD_CHARACTERS"
      :rows="8"
    />
    <div class="c-task-actions">
      <c-button type="primary" data-test-id="qr-parse-otp" :disabled="!payload" @click="parseOtp">
        Parse OTP
      </c-button>
      <c-button :disabled="!payload" @click="copy(payload, { notificationMessage: 'QR payload copied' })">
        Copy payload
      </c-button>
    </div>

    <c-alert v-if="parsedOtp?.warning" title="Issuer mismatch" data-test-id="otp-warning">
      {{ parsedOtp.warning }}
    </c-alert>
    <c-card v-if="parsedOtp" class="c-tool-panel" title="Parsed OTP configuration" data-test-id="otp-result">
      <c-alert title="Sensitive secret">
        This output contains the OTP secret. Verify the issuer and account before importing or copying it.
      </c-alert>
      <pre>{{ otpJson }}</pre>
      <div class="c-task-actions mt-3">
        <c-button @click="copy(otpJson, { notificationMessage: 'OTP configuration copied' })">
          Copy JSON
        </c-button>
      </div>
    </c-card>
  </div>
</template>

<style scoped>
.camera-preview {
  width: 100%;
  min-height: 180px;
  max-height: 480px;
  border-radius: var(--ui-radius, 8px);
  background: #111;
  object-fit: contain;
}

pre {
  overflow-wrap: anywhere;
  white-space: pre-wrap;
}
</style>
