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
      您的浏览器不支持摄像头录制视频
    </c-card>

    <c-card v-else-if="!permissionGranted" text-center>
      您需要授予使用摄像头和麦克风的权限

      <c-alert v-if="permissionCannotBePrompted" mt-4 text-left>
        您的浏览器已阻止权限请求或不支持它。 您需要在浏览器设置中手动授予权限（通常是地址栏中的锁定图标）。
      </c-alert>

      <div v-else mt-4 flex justify-center>
        <c-button @click="requestPermissions">
          授予权限
        </c-button>
      </div>
    </c-card>

    <c-card v-else>
      <div flex flex-col gap-2>
        <c-select
          v-model:value="currentCamera"
          label-position="left"
          label-width="60px"
          label="视频："
          :options="cameras.map(({ deviceId, label }) => ({ value: deviceId, label }))"
          placeholder="选择相机"
        />
        <c-select
          v-if="currentMicrophone && microphones.length > 0"
          v-model:value="currentMicrophone"
          label="音频："
          label-position="left"
          label-width="60px"
          :options="microphones.map(({ deviceId, label }) => ({ value: deviceId, label }))"
          placeholder="选择麦克风"
        />
      </div>

      <div v-if="!isMediaStreamAvailable" mt-3 flex justify-center>
        <c-button type="primary" @click="start">
          启动摄像头
        </c-button>
      </div>

      <div v-else>
        <div my-2>
          <video ref="video" autoplay controls playsinline max-h-full w-full />
        </div>

        <div flex items-center justify-between gap-2>
          <c-button :disabled="!isMediaStreamAvailable" @click="takeScreenshot">
            <span mr-2> <icon-mdi-camera /></span>
            截图
          </c-button>

          <div v-if="isRecordingSupported" flex justify-center gap-2>
            <c-button v-if="recordingState === 'stopped'" @click="startRecording">
              <span mr-2> <icon-mdi-video /></span>
              开始录制
            </c-button>

            <c-button v-if="recordingState === 'recording'" @click="pauseRecording">
              <span mr-2> <icon-mdi-pause /></span>
              暂停
            </c-button>

            <c-button v-if="recordingState === 'paused'" @click="resumeRecording">
              <span mr-2> <icon-mdi-play /></span>
              继续
            </c-button>

            <c-button v-if="recordingState !== 'stopped'" type="error" @click="stopRecording">
              <span mr-2> <icon-mdi-record /></span>
              停止
            </c-button>
          </div>
          <div v-else italic op-60>
            您的浏览器不支持视频录制
          </div>
        </div>
      </div>
    </c-card>

    <div grid grid-cols-2 mt-5 gap-2>
      <c-card v-for="({ type, value, createdAt }, index) in medias" :key="index">
        <img v-if="type === 'image'" :src="value" max-h-full w-full alt="截图">

        <video v-else :src="value" controls max-h-full w-full />

        <div flex items-center justify-between>
          <div font-bold>
            {{ type === 'image' ? '截图' : '视频' }}
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
