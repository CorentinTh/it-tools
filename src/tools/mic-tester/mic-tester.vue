<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useMessage } from 'naive-ui';
import { useMicrophoneService } from './mic-tester.service';

const message = useMessage();

const { t } = useI18n();
const { startMicReplay, stopMicReplay, loudnessLevel, isPlaying } = useMicrophoneService(message);
</script>

<template>
  <div>
    <c-card>
      <div class="control-buttons">
        <c-button :disabled="isPlaying" @click="startMicReplay">
          {{ t('tools.mic-tester.start-button-text') }}
        </c-button>
        <c-button :disabled="!isPlaying" @click="stopMicReplay">
          {{ t('tools.mic-tester.stop-button-text') }}
        </c-button>
      </div>

      <!-- Loudness Meter -->
      <div id="loudnessMeter">
        <div id="loudnessBar" :style="{ width: `${loudnessLevel}%` }" />
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
