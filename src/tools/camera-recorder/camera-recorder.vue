<script setup lang="ts">
import _ from 'lodash';

import { useMediaRecorder } from './useMediaRecorder';

interface Media { type: 'image' | 'video'; value: string; createdAt: Date }

const {
  videoInputs: cameras,
  audioInputs: microphones,
  permissionGranted,
  isSupported,
  ensurePermissions,
} = useDevicesList({
  requestPermissions: true,
  constraints: { video: true, audio: true },
  onUpdated() {
    refreshCurrentDevices();
  },
});

const video = ref<HTMLVideoElement>();
const medias = ref<Media[]>([]);
const currentCamera = ref(cameras.value[0]?.deviceId);
const currentMicrophone = ref(microphones.value[0]?.deviceId);
const permissionCannotBePrompted = ref(false);

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
  resumeRecording,
} = useMediaRecorder({
  stream,
});

onRecordAvailable((value) => {
  medias.value.unshift({ type: 'video', value, createdAt: new Date() });
});

function refreshCurrentDevices() {
  if (_.isNil(currentCamera) || !cameras.value.find(i => i.deviceId === currentCamera.value)) {
    currentCamera.value = cameras.value[0]?.deviceId;
  }

  if (_.isNil(microphones) || !microphones.value.find(i => i.deviceId === currentMicrophone.value)) {
    currentMicrophone.value = microphones.value[0]?.deviceId;
  }
}

function takeScreenshot() {
  if (!video.value) {
    return;
  }

  const canvas = document.createElement('canvas');
  canvas.width = video.value.videoWidth;
  canvas.height = video.value.videoHeight;
  canvas.getContext('2d')?.drawImage(video.value, 0, 0);
  const image = canvas.toDataURL('image/png');

  medias.value.unshift({ type: 'image', value: image, createdAt: new Date() });
}

watchEffect(() => {
  if (video.value && stream.value) {
    video.value.srcObject = stream.value;
  }
});

onBeforeUnmount(() => stop());

async function requestPermissions() {
  try {
    await ensurePermissions();
  }
  catch (e) {
    permissionCannotBePrompted.value = true;
  }
}

function downloadMedia({ type, value, createdAt }: Media) {
  const link = document.createElement('a');
  link.href = value;
  link.download = `${type}-${createdAt.getTime()}.${type === 'image' ? 'png' : 'webm'}`;
  link.click();
}
</script>

<template>
  <div>
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
          label-position="left"
          label-width="60px"
          label="Video:"
          :options="cameras.map(({ deviceId, label }) => ({ value: deviceId, label }))"
          placeholder="Select camera"
        />
        <c-select
          v-if="currentMicrophone && microphones.length > 0"
          v-model:value="currentMicrophone"
          label="Audio:"
          label-position="left"
          label-width="60px"
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
          <c-button :disabled="!isMediaStreamAvailable" @click="takeScreenshot">
            <span mr-2> <icon-mdi-camera /></span>
            Take screenshot
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

            <c-button v-if="recordingState !== 'stopped'" type="error" @click="stopRecording">
              <span mr-2> <icon-mdi-record /></span>
              Stop
            </c-button>
          </div>
          <div v-else italic op-60>
            Video recording is not supported in your browser
          </div>
        </div>
      </div>
    </c-card>

    <div grid grid-cols-2 mt-5 gap-2>
      <c-card v-for="({ type, value, createdAt }, index) in medias" :key="index">
        <img v-if="type === 'image'" :src="value" max-h-full w-full alt="screenshot">

        <video v-else :src="value" controls max-h-full w-full />

        <div flex items-center justify-between>
          <div font-bold>
            {{ type === 'image' ? 'Screenshot' : 'Video' }}
          </div>

          <div flex gap-2>
            <c-button @click="downloadMedia({ type, value, createdAt })">
              <icon-mdi-download />
            </c-button>

            <c-button @click="medias = medias.filter((_ignored, i) => i !== index)">
              <icon-mdi-delete-outline />
            </c-button>
          </div>
        </div>
      </c-card>
    </div>
  </div>
</template>
