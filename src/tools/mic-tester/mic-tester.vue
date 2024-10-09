<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue';
import { useI18n } from 'vue-i18n';
import { Microphone } from '@vicons/tabler';
const { t } = useI18n();

// Audio-related variables
let audioContext: AudioContext | null = null;
let delayNode: DelayNode | null = null;
let sourceNode: MediaStreamAudioSourceNode | null = null;
let analyserNode: AnalyserNode | null = null;
let stream: MediaStream | null = null;

const isPlaying = ref(false);
const loudnessBarWidth = ref(0);

const startMicReplayAndLoudMeter = async () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }

  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  } catch (err) {
    console.error('Microphone access denied:', err);
    alert('Microphone access denied (the error is also in the console):', err);
    return;
  }

  sourceNode = audioContext.createMediaStreamSource(stream);
  delayNode = audioContext.createDelay(1.0);
  delayNode.delayTime.value = 1.0;

  analyserNode = audioContext.createAnalyser();
  analyserNode.fftSize = 256;

  // Connect nodes: mic -> delay -> speakers
  sourceNode.connect(delayNode);
  delayNode.connect(audioContext.destination);
  sourceNode.connect(analyserNode);

  isPlaying.value = true;
  measureLoudness();
};

const stopMicReplayAndLoudMeter = () => {
  if (audioContext && stream) {
    const tracks = stream.getTracks();
    tracks.forEach(track => track.stop());
    audioContext.close();
    audioContext = null;
    isPlaying.value = false;
    loudnessBarWidth.value = 0;
  }
};

// Measure loudness and update loudness bar
const measureLoudness = () => {
  const dataArray = new Uint8Array(analyserNode!.frequencyBinCount);

  const updateLoudness = () => {
    analyserNode!.getByteFrequencyData(dataArray);

    // Calculate average loudness
    let sum = 0;
    dataArray.forEach(value => sum += value);
    const average = sum / dataArray.length;

    // Update loudness bar width based on loudness level
    loudnessBarWidth.value = average;

    if (isPlaying.value) {
      requestAnimationFrame(updateLoudness);
    }
  };

  updateLoudness();
};

// Cleanup on component unmount
onBeforeUnmount(() => {
  stopMicReplay();
});
</script>

<template>
  <div>
    <c-card>
      <div class="control-buttons">
        <c-button @click="startMicReplayAndLoudMeter" :disabled="isPlaying">{{ t('tools.mic-tester.start-button-text') }}</c-button>
        <c-button @click="stopMicReplayAndLoudMeter" :disabled="!isPlaying">{{ t('tools.mic-tester.stop-button-text') }}</c-button>
      </div>

      <!-- Loudness Meter -->
      <div id="loudnessMeter">
        <div id="loudnessBar" :style="{ width: loudnessBarWidth + '%' }"></div>
      </div>
    </c-card>
  </div>
</template>

<style scoped>
#loudnessMeter {
  width: 100%;
  height: 30px;
  background-color: rgba(46, 51, 56, 0.05);
  margin-top: 20px;
  position: relative;
}
#loudnessBar {
  height: 100%;
  background: linear-gradient(48deg, rgba(37, 99, 108, 1) 0%, rgba(59, 149, 111, 1) 60%, rgba(20, 160, 88, 1) 100%);
}
.control-buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  justify-content: space-between;
}
</style>

