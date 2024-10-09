import { onBeforeUnmount, ref } from 'vue';

interface IMessageSender {
  error: (...messages: any[]) => void
}

export function useMicrophoneService(messageSender: IMessageSender) {
  let audioContext: AudioContext | null = null;
  let delayNode: DelayNode | null = null;
  let sourceNode: MediaStreamAudioSourceNode | null = null;
  let analyserNode: AnalyserNode | null = null;
  let stream: MediaStream | null = null;

  const isPlaying = ref(false);
  const loudnessLevel = ref(0); // Observable for loudness

  // Measure loudness and update loudness bar
  function measureLoudness() {
    const dataArray = new Uint8Array(analyserNode!.frequencyBinCount);

    const updateLoudness = () => {
      analyserNode!.getByteFrequencyData(dataArray);

      // Calculate average loudness
      let sum = 0;
      dataArray.forEach(value => sum += value);
      const average = sum / dataArray.length;

      // Update the observable loudness level
      loudnessLevel.value = average;

      if (isPlaying.value) {
        requestAnimationFrame(updateLoudness);
      }
    };
    updateLoudness();
  };

  const startMicReplay = async () => {
    if (!audioContext) {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    }
    catch (err) {
      console.error('Microphone access denied:', err);
      messageSender.error('Microphone access denied (the error is also in the console):', err);
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

  function stopMicReplay() {
    if (audioContext && stream) {
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      audioContext.close();
      audioContext = null;
      isPlaying.value = false;
      loudnessLevel.value = 0;
    }
  };

  // Cleanup on service destruction
  onBeforeUnmount(() => {
    stopMicReplay();
  });

  return {
    startMicReplay,
    stopMicReplay,
    loudnessLevel,
    isPlaying,
  };
}
