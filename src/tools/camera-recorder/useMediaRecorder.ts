import { createEventHook } from '@vueuse/core';
import { type Ref, computed, onScopeDispose, ref } from 'vue';
import {
  CAMERA_RECORDING_CHUNK_INTERVAL_MS,
  MAX_CAMERA_RECORDING_BYTES,
  MAX_CAMERA_RECORDING_DURATION_MS,
} from './camera-recorder.limits';

export type RecordingState = 'stopped' | 'recording' | 'paused' | 'stopping';
export type RecordingStatus = 'idle' | 'completed' | 'duration-limit' | 'size-limit' | 'error';

export interface MediaRecorderControls {
  isRecordingSupported: Ref<boolean>
  recordingState: Ref<RecordingState>
  recordingStatus: Ref<RecordingStatus>
  startRecording: () => void
  stopRecording: () => void
  pauseRecording: () => void
  resumeRecording: () => void
  dispose: () => void
  onRecordAvailable: (cb: (blob: Blob) => void) => void
}

export function useMediaRecorder({ stream }: { stream: Ref<MediaStream | undefined> }): MediaRecorderControls {
  const isRecordingSupported = computed(() => (
    typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported('video/webm')
  ));
  const mediaRecorder = ref<MediaRecorder | null>(null);
  const recordAvailable = createEventHook<Blob>();
  const recordingState = ref<RecordingState>('stopped');
  const recordingStatus = ref<RecordingStatus>('idle');
  let disposed = false;
  let currentSession = 0;
  let recordingDeadline: ReturnType<typeof setTimeout> | undefined;

  function clearRecordingDeadline() {
    if (recordingDeadline !== undefined) {
      clearTimeout(recordingDeadline);
      recordingDeadline = undefined;
    }
  }

  function detachRecorder(recorder: MediaRecorder) {
    clearRecordingDeadline();
    recorder.ondataavailable = null;
    recorder.onstop = null;

    if (mediaRecorder.value === recorder) {
      mediaRecorder.value = null;
    }
  }

  function startRecording() {
    if (disposed || !isRecordingSupported.value || !stream.value || recordingState.value !== 'stopped') {
      return;
    }

    let recorder: MediaRecorder;

    try {
      recorder = new MediaRecorder(stream.value, { mimeType: 'video/webm' });
    }
    catch {
      recordingStatus.value = 'error';
      return;
    }

    if (recorder.state !== 'inactive') {
      recordingStatus.value = 'error';
      return;
    }

    const session = ++currentSession;
    const recordedChunks: Blob[] = [];
    let recordedBytes = 0;
    let discardRecording = false;
    let stopReason: 'manual' | 'duration-limit' | 'size-limit' = 'manual';
    mediaRecorder.value = recorder;
    recordingStatus.value = 'idle';

    function requestStop(reason: typeof stopReason) {
      if (disposed || session !== currentSession) {
        return;
      }

      stopReason = reason;
      clearRecordingDeadline();

      if (reason === 'duration-limit') {
        recordingStatus.value = 'duration-limit';
      }
      else if (reason === 'size-limit') {
        recordingStatus.value = 'size-limit';
      }

      if (!['recording', 'paused'].includes(recordingState.value)) {
        return;
      }

      recordingState.value = 'stopping';

      if (recorder.state === 'inactive') {
        return;
      }

      try {
        recorder.stop();
      }
      catch {
        currentSession += 1;
        recordedChunks.length = 0;
        detachRecorder(recorder);
        recordingState.value = 'stopped';
        recordingStatus.value = 'error';
      }
    }

    recorder.ondataavailable = (event) => {
      if (disposed || session !== currentSession || discardRecording || event.data.size <= 0) {
        return;
      }

      if (event.data.size > MAX_CAMERA_RECORDING_BYTES - recordedBytes) {
        discardRecording = true;
        recordedBytes = 0;
        recordedChunks.length = 0;
        requestStop('size-limit');
        return;
      }

      recordedBytes += event.data.size;
      recordedChunks.push(event.data);
    };

    recorder.onstop = () => {
      detachRecorder(recorder);
      recordingState.value = 'stopped';

      if (disposed || session !== currentSession) {
        recordedChunks.length = 0;
        return;
      }

      if (discardRecording || stopReason === 'size-limit') {
        recordedChunks.length = 0;
        recordingStatus.value = 'size-limit';
        return;
      }

      let blob: Blob;

      try {
        blob = new Blob(recordedChunks, { type: 'video/webm' });
      }
      catch {
        recordedChunks.length = 0;
        recordingStatus.value = 'error';
        return;
      }

      recordedChunks.length = 0;

      if (blob.size > 0) {
        recordAvailable.trigger(blob);
      }

      recordingStatus.value = stopReason === 'duration-limit' ? 'duration-limit' : 'completed';
    };

    try {
      recorder.start(CAMERA_RECORDING_CHUNK_INTERVAL_MS);
      recordingState.value = 'recording';
      recordingDeadline = setTimeout(() => {
        requestStop('duration-limit');
      }, MAX_CAMERA_RECORDING_DURATION_MS);
    }
    catch {
      currentSession += 1;
      detachRecorder(recorder);
      recordedChunks.length = 0;
      recordingState.value = 'stopped';
      recordingStatus.value = 'error';
    }
  }

  function stopRecording() {
    const recorder = mediaRecorder.value;

    if (disposed || !recorder || !['recording', 'paused'].includes(recordingState.value)) {
      return;
    }

    if (recorder.state === 'inactive') {
      currentSession += 1;
      detachRecorder(recorder);
      recordingState.value = 'stopped';
      recordingStatus.value = 'error';
      return;
    }

    clearRecordingDeadline();
    recordingState.value = 'stopping';

    try {
      recorder.stop();
    }
    catch {
      currentSession += 1;
      detachRecorder(recorder);
      recordingState.value = 'stopped';
      recordingStatus.value = 'error';
    }
  }

  function pauseRecording() {
    const recorder = mediaRecorder.value;

    if (disposed || !recorder || recordingState.value !== 'recording' || recorder.state !== 'recording') {
      return;
    }

    recorder.pause();
    recordingState.value = 'paused';
  }

  function resumeRecording() {
    const recorder = mediaRecorder.value;

    if (disposed || !recorder || recordingState.value !== 'paused' || recorder.state !== 'paused') {
      return;
    }

    recorder.resume();
    recordingState.value = 'recording';
  }

  function dispose() {
    if (disposed) {
      return;
    }

    disposed = true;
    currentSession += 1;

    const recorder = mediaRecorder.value;

    if (recorder) {
      detachRecorder(recorder);

      if (recorder.state !== 'inactive') {
        try {
          recorder.stop();
        }
        catch {
          // The recorder may already be transitioning to inactive. Its event
          // handlers are detached and the session has been invalidated.
        }
      }
    }

    recordingState.value = 'stopped';
  }

  onScopeDispose(dispose);

  return {
    isRecordingSupported,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    recordingState,
    recordingStatus,
    dispose,
    onRecordAvailable: recordAvailable.on,
  };
}
