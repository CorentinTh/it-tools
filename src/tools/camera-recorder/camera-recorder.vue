<script setup lang="ts">
import {
  type CameraMedia,
  MAX_RETAINED_SCREENSHOTS,
  MAX_RETAINED_VIDEOS,
  createCameraMediaCollection,
} from './camera-recorder.model';
import {
  MAX_CAMERA_RECORDING_BYTES,
  MAX_CAMERA_RECORDING_DURATION_MS,
  MAX_CAMERA_SCREENSHOT_BYTES,
  MAX_CAMERA_SCREENSHOT_PIXELS,
  MAX_CAMERA_SCREENSHOT_RAW_BYTES,
  MAX_RETAINED_CAMERA_MEDIA_BYTES,
} from './camera-recorder.limits';
import { useMediaRecorder } from './useMediaRecorder';

const {
  videoInputs: cameras,
  audioInputs: microphones,
  permissionGranted,
  isSupported,
  ensurePermissions,
} = useDevicesList({
  // Permission requests must stay behind the visible Grant permission action.
  // VueUse does not await/catch its automatic request, so a denied or
  // unsupported request would otherwise surface as an unhandled page error.
  requestPermissions: false,
  constraints: { video: true, audio: true },
  onUpdated() {
    refreshCurrentDevices();
  },
});

const video = ref<HTMLVideoElement>();
const currentCamera = ref(cameras.value[0]?.deviceId);
const currentMicrophone = ref(microphones.value[0]?.deviceId);
const permissionCannotBePrompted = ref(false);
const captureStatus = ref('');
const screenshotInFlight = ref(false);
let screenshotAttempt = 0;
const mediaCollection = createCameraMediaCollection();
const { medias, retainedBytes, addImage, addVideo, remove: removeMedia } = mediaCollection;

const {
  stream,
  start,
  stop,
  enabled: isMediaStreamAvailable,
} = useUserMedia({
  constraints: computed(() => ({
    video: { deviceId: currentCamera.value },
    ...(currentMicrophone.value ? { audio: { deviceId: currentMicrophone.value } } : {}),
  })),
  autoSwitch: true,
});

const {
  isRecordingSupported,
  onRecordAvailable,
  startRecording,
  stopRecording,
  pauseRecording,
  recordingState,
  recordingStatus,
  resumeRecording,
  dispose: disposeMediaRecorder,
} = useMediaRecorder({
  stream,
});

const recordingStatusMessage = computed(() => {
  switch (recordingStatus.value) {
    case 'completed':
      return 'Recording completed.';
    case 'duration-limit':
      return `The ${formatDuration(MAX_CAMERA_RECORDING_DURATION_MS)} recording limit was reached. Recording stopped automatically.`;
    case 'size-limit':
      return `The recording exceeded ${formatBytes(MAX_CAMERA_RECORDING_BYTES)} and was discarded.`;
    case 'error':
      return 'The recording could not be completed.';
    default:
      return '';
  }
});
const cameraStatusMessage = computed(() => (
  [recordingStatusMessage.value, captureStatus.value].filter(Boolean).join(' ')
));

onRecordAvailable((blob) => {
  captureStatus.value = addVideo(blob)
    ? ''
    : 'The video exceeded a retention limit and was not kept.';
});

function formatBytes(bytes: number) {
  const mebibytes = bytes / (1024 * 1024);
  return `${Number.isInteger(mebibytes) ? mebibytes : mebibytes.toFixed(1)} MiB`;
}

function formatDuration(milliseconds: number) {
  const minutes = milliseconds / 60_000;
  return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
}

function formatMegapixels(pixels: number) {
  return `${(pixels / 1_000_000).toFixed(1)} megapixels`;
}

function refreshCurrentDevices() {
  if (!currentCamera.value || !cameras.value.find(i => i.deviceId === currentCamera.value)) {
    currentCamera.value = cameras.value[0]?.deviceId;
  }

  if (!currentMicrophone.value || !microphones.value.find(i => i.deviceId === currentMicrophone.value)) {
    currentMicrophone.value = microphones.value[0]?.deviceId;
  }
}

function takeScreenshot() {
  if (!video.value || screenshotInFlight.value) {
    return;
  }

  const width = video.value.videoWidth;
  const height = video.value.videoHeight;
  if (!Number.isInteger(width) || !Number.isInteger(height) || width <= 0 || height <= 0) {
    captureStatus.value = 'The camera frame is not ready for a screenshot.';
    return;
  }
  if (width > Math.floor(MAX_CAMERA_SCREENSHOT_PIXELS / height)) {
    captureStatus.value = `The screenshot frame exceeded ${formatMegapixels(MAX_CAMERA_SCREENSHOT_PIXELS)} (${formatBytes(MAX_CAMERA_SCREENSHOT_RAW_BYTES)} raw) and was not captured.`;
    return;
  }

  screenshotInFlight.value = true;
  const attempt = ++screenshotAttempt;
  try {
    const canvas = document.createElement('canvas');
    // Reset both default dimensions before applying the frame dimensions so a
    // very wide or tall (but still bounded) frame cannot cause a larger
    // transient backing-store allocation while the other default is 150/300.
    canvas.width = 1;
    canvas.height = 1;
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    if (!context) {
      captureStatus.value = 'The browser could not create a screenshot canvas.';
      screenshotInFlight.value = false;
      return;
    }

    context.drawImage(video.value, 0, 0);
    canvas.toBlob((image) => {
      if (attempt !== screenshotAttempt || !screenshotInFlight.value) {
        return;
      }

      screenshotInFlight.value = false;
      if (!image) {
        captureStatus.value = 'The browser could not encode the screenshot.';
        return;
      }

      captureStatus.value = addImage(image)
        ? ''
        : `The screenshot exceeded ${formatBytes(MAX_CAMERA_SCREENSHOT_BYTES)} and was not kept.`;
    }, 'image/png');
  }
  catch {
    if (attempt === screenshotAttempt) {
      screenshotInFlight.value = false;
      captureStatus.value = 'The browser could not capture the screenshot.';
    }
  }
}

watchEffect((onCleanup) => {
  const videoElement = video.value;
  const activeStream = stream.value;

  if (videoElement && activeStream) {
    videoElement.srcObject = activeStream;
    onCleanup(() => {
      if (videoElement.srcObject === activeStream) {
        videoElement.srcObject = null;
      }
    });
  }
});

onBeforeUnmount(() => {
  ++screenshotAttempt;
  screenshotInFlight.value = false;
  disposeMediaRecorder();
  mediaCollection.dispose();

  if (video.value) {
    video.value.srcObject = null;
  }

  stop();
});

async function requestPermissions() {
  try {
    await ensurePermissions();
  }
  catch (e) {
    permissionCannotBePrompted.value = true;
  }
}

function downloadMedia({ type, value, createdAt }: Pick<CameraMedia, 'type' | 'value' | 'createdAt'>) {
  const link = document.createElement('a');
  link.href = value;
  link.download = `${type}-${createdAt.getTime()}.${type === 'image' ? 'png' : 'webm'}`;
  link.click();
}
</script>

<template>
  <div class="c-task-layout">
    <c-card v-if="!isSupported">
      Your browser does not support recording video from camera
    </c-card>

    <c-card v-else-if="!permissionGranted" text-center>
      You need to grant permission to use your camera and microphone

      <c-alert v-if="permissionCannotBePrompted" mt-4 text-left>
        Your browser has blocked permission request or does not support it. You need to grant permission manually in
        your browser settings (usually the lock icon in the address bar).
      </c-alert>

      <div v-else mt-4 flex justify-center>
        <c-button @click="requestPermissions">
          Grant permission
        </c-button>
      </div>
    </c-card>

    <c-card v-else>
      <div flex flex-col gap-2>
        <c-select
          v-model:value="currentCamera"
          label="Video"
          :options="cameras.map(({ deviceId, label }) => ({ value: deviceId, label }))"
          placeholder="Select camera"
        />
        <c-select
          v-if="currentMicrophone && microphones.length > 0"
          v-model:value="currentMicrophone"
          label="Audio"
          :options="microphones.map(({ deviceId, label }) => ({ value: deviceId, label }))"
          placeholder="Select microphone"
        />
      </div>

      <div v-if="!isMediaStreamAvailable" mt-3 flex justify-center>
        <c-button type="primary" @click="start">
          Start webcam
        </c-button>
      </div>

      <div v-else>
        <div my-2>
          <video ref="video" autoplay controls playsinline max-h-full w-full />
        </div>

        <div flex items-center justify-between gap-2>
          <c-button
            data-test-id="camera-screenshot"
            :disabled="!isMediaStreamAvailable || screenshotInFlight"
            @click="takeScreenshot"
          >
            <span mr-2> <icon-mdi-camera /></span>
            {{ screenshotInFlight ? 'Capturing screenshot…' : 'Take screenshot' }}
          </c-button>

          <div v-if="isRecordingSupported" flex justify-center gap-2>
            <c-button v-if="recordingState === 'stopped'" @click="startRecording">
              <span mr-2> <icon-mdi-video /></span>
              Start recording
            </c-button>

            <c-button v-if="recordingState === 'recording'" @click="pauseRecording">
              <span mr-2> <icon-mdi-pause /></span>
              Pause
            </c-button>

            <c-button v-if="recordingState === 'paused'" @click="resumeRecording">
              <span mr-2> <icon-mdi-play /></span>
              Resume
            </c-button>

            <c-button v-if="recordingState === 'recording' || recordingState === 'paused'" type="error" @click="stopRecording">
              <span mr-2> <icon-mdi-record /></span>
              Stop
            </c-button>

            <c-button v-if="recordingState === 'stopping'" disabled>
              Finishing recording…
            </c-button>
          </div>
          <div v-else italic op-60>
            Video recording is not supported in your browser
          </div>
        </div>
      </div>

      <div
        v-if="cameraStatusMessage"
        mt-3
        text-sm
        role="status"
        aria-live="polite"
        data-test-id="camera-status"
      >
        {{ cameraStatusMessage }}
      </div>
    </c-card>

    <div mt-5 text-sm op-60>
      This tab keeps up to {{ MAX_RETAINED_SCREENSHOTS }} screenshots and {{ MAX_RETAINED_VIDEOS }} videos.
      Screenshot frames are limited to {{ formatMegapixels(MAX_CAMERA_SCREENSHOT_PIXELS) }}
      ({{ formatBytes(MAX_CAMERA_SCREENSHOT_RAW_BYTES) }} raw) before encoding. Each retained screenshot is limited to
      {{ formatBytes(MAX_CAMERA_SCREENSHOT_BYTES) }}, each video to
      {{ formatBytes(MAX_CAMERA_RECORDING_BYTES) }}, and all captures together to
      {{ formatBytes(MAX_RETAINED_CAMERA_MEDIA_BYTES) }} (currently {{ formatBytes(retainedBytes) }}).
      Recordings stop after {{ formatDuration(MAX_CAMERA_RECORDING_DURATION_MS) }}; recordings over the byte limit are
      discarded. Older captures are removed automatically.
    </div>

    <div grid grid-cols-2 mt-2 gap-2>
      <c-card v-for="({ id, type, value, createdAt }) in medias" :key="id" :data-media-id="id">
        <img v-if="type === 'image'" :src="value" max-h-full w-full alt="screenshot">

        <video v-else :src="value" controls max-h-full w-full />

        <div flex items-center justify-between>
          <div font-bold>
            {{ type === 'image' ? 'Screenshot' : 'Video' }}
          </div>

          <div flex gap-2>
            <c-button
              :aria-label="`Download ${type}`"
              :title="`Download ${type}`"
              @click="downloadMedia({ type, value, createdAt })"
            >
              <icon-mdi-download />
            </c-button>

            <c-button :aria-label="`Delete ${type}`" :title="`Delete ${type}`" @click="removeMedia(id)">
              <icon-mdi-delete-outline />
            </c-button>
          </div>
        </div>
      </c-card>
    </div>
  </div>
</template>
