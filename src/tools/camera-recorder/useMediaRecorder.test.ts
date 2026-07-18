import { effectScope, ref } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  CAMERA_RECORDING_CHUNK_INTERVAL_MS,
  MAX_CAMERA_RECORDING_BYTES,
  MAX_CAMERA_RECORDING_DURATION_MS,
} from './camera-recorder.limits';
import { type MediaRecorderControls, useMediaRecorder } from './useMediaRecorder';

class FakeMediaRecorder {
  static instances: FakeMediaRecorder[] = [];
  static isTypeSupported = vi.fn(() => true);

  state: RecordingState = 'inactive';
  ondataavailable: ((event: BlobEvent) => void) | null = null;
  onstop: (() => void) | null = null;
  start = vi.fn(() => {
    this.state = 'recording';
  });

  stop = vi.fn(() => {
    this.state = 'inactive';
  });

  pause = vi.fn(() => {
    this.state = 'paused';
  });

  resume = vi.fn(() => {
    this.state = 'recording';
  });

  constructor(_stream: MediaStream, _options?: MediaRecorderOptions) {
    FakeMediaRecorder.instances.push(this);
  }

  emitData(blob: Blob) {
    this.ondataavailable?.({ data: blob } as BlobEvent);
  }

  emitStop() {
    this.onstop?.();
  }
}

function setupRecorder() {
  const scope = effectScope();
  let controls: MediaRecorderControls | undefined;

  scope.run(() => {
    controls = useMediaRecorder({ stream: ref({} as MediaStream) });
  });

  return { controls: controls!, scope };
}

describe('useMediaRecorder', () => {
  beforeEach(() => {
    FakeMediaRecorder.instances = [];
    FakeMediaRecorder.isTypeSupported.mockClear();
    vi.stubGlobal('MediaRecorder', FakeMediaRecorder as unknown as typeof MediaRecorder);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('emits one Blob only after the asynchronous stop event', () => {
    const { controls, scope } = setupRecorder();
    const onRecordAvailable = vi.fn();
    controls.onRecordAvailable(onRecordAvailable);

    controls.startRecording();
    const recorder = FakeMediaRecorder.instances[0]!;
    expect(recorder.start).toHaveBeenCalledWith(CAMERA_RECORDING_CHUNK_INTERVAL_MS);
    recorder.emitData(new Blob(['recorded data']));
    controls.stopRecording();

    expect(controls.recordingState.value).toBe('stopping');
    expect(onRecordAvailable).not.toHaveBeenCalled();

    recorder.emitStop();

    expect(controls.recordingState.value).toBe('stopped');
    expect(controls.recordingStatus.value).toBe('completed');
    expect(onRecordAvailable).toHaveBeenCalledOnce();
    expect(onRecordAvailable.mock.calls[0]?.[0]).toBeInstanceOf(Blob);
    expect(onRecordAvailable.mock.calls[0]?.[0]).toMatchObject({ size: 13, type: 'video/webm' });
    scope.stop();
  });

  it('stops an active recorder and ignores an already queued stop callback on scope disposal', () => {
    const { controls, scope } = setupRecorder();
    const onRecordAvailable = vi.fn();
    controls.onRecordAvailable(onRecordAvailable);
    controls.startRecording();

    const recorder = FakeMediaRecorder.instances[0]!;
    recorder.emitData(new Blob(['must be discarded']));
    const queuedStopCallback = recorder.onstop;

    scope.stop();

    expect(recorder.stop).toHaveBeenCalledOnce();
    expect(recorder.ondataavailable).toBeNull();
    expect(recorder.onstop).toBeNull();
    expect(controls.recordingState.value).toBe('stopped');

    queuedStopCallback?.();
    expect(onRecordAvailable).not.toHaveBeenCalled();
  });

  it('does not allow a second recording while the first one is stopping', () => {
    const { controls, scope } = setupRecorder();

    controls.startRecording();
    controls.stopRecording();
    controls.startRecording();

    expect(FakeMediaRecorder.instances).toHaveLength(1);
    scope.stop();
  });

  it('supports pause and resume only in matching recorder states', () => {
    const { controls, scope } = setupRecorder();
    controls.startRecording();
    const recorder = FakeMediaRecorder.instances[0]!;

    controls.pauseRecording();
    expect(recorder.pause).toHaveBeenCalledOnce();
    expect(controls.recordingState.value).toBe('paused');

    controls.pauseRecording();
    controls.resumeRecording();
    expect(recorder.pause).toHaveBeenCalledOnce();
    expect(recorder.resume).toHaveBeenCalledOnce();
    expect(controls.recordingState.value).toBe('recording');
    scope.stop();
  });

  it('automatically stops at the duration limit and retains bounded chunks', () => {
    vi.useFakeTimers();
    const { controls, scope } = setupRecorder();
    const onRecordAvailable = vi.fn();
    controls.onRecordAvailable(onRecordAvailable);
    controls.startRecording();

    const recorder = FakeMediaRecorder.instances[0]!;
    recorder.emitData(new Blob(['bounded recording']));
    vi.advanceTimersByTime(MAX_CAMERA_RECORDING_DURATION_MS);

    expect(recorder.stop).toHaveBeenCalledOnce();
    expect(controls.recordingState.value).toBe('stopping');
    expect(controls.recordingStatus.value).toBe('duration-limit');

    recorder.emitStop();

    expect(onRecordAvailable).toHaveBeenCalledOnce();
    expect(controls.recordingState.value).toBe('stopped');
    expect(controls.recordingStatus.value).toBe('duration-limit');
    scope.stop();
  });

  it('stops and discards the whole recording before accumulated chunks exceed the byte limit', () => {
    const { controls, scope } = setupRecorder();
    const onRecordAvailable = vi.fn();
    controls.onRecordAvailable(onRecordAvailable);
    controls.startRecording();

    const recorder = FakeMediaRecorder.instances[0]!;
    const firstChunk = new Blob(['first']);
    const overflowingChunk = new Blob(['overflow']);
    Object.defineProperty(firstChunk, 'size', { value: MAX_CAMERA_RECORDING_BYTES - 4 });
    Object.defineProperty(overflowingChunk, 'size', { value: 5 });

    recorder.emitData(firstChunk);
    recorder.emitData(overflowingChunk);

    expect(recorder.stop).toHaveBeenCalledOnce();
    expect(controls.recordingState.value).toBe('stopping');
    expect(controls.recordingStatus.value).toBe('size-limit');

    recorder.emitData(new Blob(['queued final chunk']));
    recorder.emitStop();

    expect(onRecordAvailable).not.toHaveBeenCalled();
    expect(controls.recordingState.value).toBe('stopped');
    expect(controls.recordingStatus.value).toBe('size-limit');
    scope.stop();
  });
});
