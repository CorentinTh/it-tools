import { mount } from '@vue/test-utils';
import { nextTick, ref } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import CameraRecorder from './camera-recorder.vue';

const mocks = vi.hoisted(() => ({
  disposeRecorder: vi.fn(),
  onRecordAvailable: undefined as ((blob: Blob) => void) | undefined,
  recordingStatus: undefined as { value: string } | undefined,
  stopStream: vi.fn(),
  useDevicesList: vi.fn(),
  useMediaRecorder: vi.fn(),
  useUserMedia: vi.fn(),
}));

vi.mock('@vueuse/core', async () => ({
  ...await vi.importActual<typeof import('@vueuse/core')>('@vueuse/core'),
  useDevicesList: mocks.useDevicesList,
  useUserMedia: mocks.useUserMedia,
}));

vi.mock('./useMediaRecorder', () => ({
  useMediaRecorder: mocks.useMediaRecorder,
}));

function mountCameraRecorder() {
  return mount(CameraRecorder, {
    global: {
      stubs: {
        'c-alert': { template: '<aside><slot /></aside>' },
        'c-button': { props: ['disabled'], template: '<button :disabled="disabled"><slot /></button>' },
        'c-card': { template: '<article><slot /></article>' },
        'c-select': true,
        'icon-mdi-camera': true,
        'icon-mdi-delete-outline': true,
        'icon-mdi-download': true,
        'icon-mdi-pause': true,
        'icon-mdi-play': true,
        'icon-mdi-record': true,
        'icon-mdi-video': true,
      },
    },
  });
}

describe('camera recorder component', () => {
  beforeEach(() => {
    mocks.disposeRecorder.mockReset();
    mocks.stopStream.mockReset();
    mocks.onRecordAvailable = undefined;
    mocks.recordingStatus = ref('idle');
    mocks.useDevicesList.mockReset();
    mocks.useMediaRecorder.mockReset();
    mocks.useUserMedia.mockReset();

    mocks.useDevicesList.mockReturnValue({
      videoInputs: ref([{ deviceId: 'camera-1', label: 'Camera' }]),
      audioInputs: ref([{ deviceId: 'microphone-1', label: 'Microphone' }]),
      permissionGranted: ref(true),
      isSupported: ref(true),
      ensurePermissions: vi.fn(),
    });
    mocks.useUserMedia.mockReturnValue({
      stream: ref({} as MediaStream),
      start: vi.fn(),
      stop: mocks.stopStream,
      enabled: ref(true),
    });
    mocks.useMediaRecorder.mockReturnValue({
      isRecordingSupported: ref(true),
      onRecordAvailable: (callback: (blob: Blob) => void) => {
        mocks.onRecordAvailable = callback;
      },
      startRecording: vi.fn(),
      stopRecording: vi.fn(),
      pauseRecording: vi.fn(),
      recordingState: ref('stopped'),
      recordingStatus: mocks.recordingStatus,
      resumeRecording: vi.fn(),
      dispose: mocks.disposeRecorder,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('does not request camera or microphone permission during route mount', () => {
    const wrapper = mountCameraRecorder();

    expect(mocks.useDevicesList).toHaveBeenCalledWith(expect.objectContaining({
      requestPermissions: false,
    }));

    wrapper.unmount();
  });

  it('keeps keyed media nodes stable and releases retained video URLs on unmount', async () => {
    let nextUrl = 0;
    const createObjectURL = vi.spyOn(URL, 'createObjectURL')
      .mockImplementation(() => `blob:component-${nextUrl++}`);
    const revokeObjectURL = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
    const wrapper = mountCameraRecorder();

    mocks.onRecordAvailable?.(new Blob(['first']));
    await nextTick();
    const firstMediaVideo = wrapper.get('[data-media-id="camera-media-0"] video').element;
    expect(wrapper.get('[data-media-id="camera-media-0"] [aria-label="Download video"]').attributes('title')).toBe('Download video');
    expect(wrapper.get('[data-media-id="camera-media-0"] [aria-label="Delete video"]').attributes('title')).toBe('Delete video');

    mocks.onRecordAvailable?.(new Blob(['second']));
    await nextTick();
    expect(wrapper.get('[data-media-id="camera-media-0"] video').element).toBe(firstMediaVideo);

    for (const value of ['third', 'fourth', 'fifth']) {
      mocks.onRecordAvailable?.(new Blob([value]));
    }
    await nextTick();

    expect(wrapper.findAll('[data-media-id]')).toHaveLength(4);
    expect(createObjectURL).toHaveBeenCalledTimes(5);
    expect(revokeObjectURL).toHaveBeenCalledOnce();
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:component-0');

    wrapper.unmount();

    expect(mocks.disposeRecorder).toHaveBeenCalledOnce();
    expect(mocks.stopStream).toHaveBeenCalledOnce();
    expect(revokeObjectURL).toHaveBeenCalledTimes(5);
    expect(revokeObjectURL.mock.calls.flat()).toEqual(expect.arrayContaining([
      'blob:component-0',
      'blob:component-1',
      'blob:component-2',
      'blob:component-3',
      'blob:component-4',
    ]));

    mocks.onRecordAvailable?.(new Blob(['late recorder callback']));
    expect(createObjectURL).toHaveBeenCalledTimes(5);
  });

  it('discloses recording and retention bounds and announces a discarded oversized recording', async () => {
    const wrapper = mountCameraRecorder();

    expect(wrapper.text()).toContain('Screenshot frames are limited to 16.8 megapixels (64 MiB raw)');
    expect(wrapper.text()).toContain('Each retained screenshot is limited to 16 MiB');
    expect(wrapper.text()).toContain('each video to 64 MiB');
    expect(wrapper.text()).toContain('all captures together to 128 MiB');
    expect(wrapper.text()).toContain('Recordings stop after 5 minutes');

    mocks.recordingStatus!.value = 'size-limit';
    await nextTick();

    const status = wrapper.get('[data-test-id="camera-status"]');
    expect(status.attributes('role')).toBe('status');
    expect(status.attributes('aria-live')).toBe('polite');
    expect(status.text()).toBe('The recording exceeded 64 MiB and was discarded.');

    wrapper.unmount();
  });

  it('rejects an oversized raw frame before allocating a canvas', async () => {
    const wrapper = mountCameraRecorder();
    const video = wrapper.get('video').element as HTMLVideoElement;
    Object.defineProperty(video, 'videoWidth', { configurable: true, value: 8_192 });
    Object.defineProperty(video, 'videoHeight', { configurable: true, value: 8_192 });
    const createElement = vi.spyOn(document, 'createElement');

    await wrapper.get('[data-test-id="camera-screenshot"]').trigger('click');

    expect(createElement.mock.calls.some(([tagName]) => tagName === 'canvas')).toBe(false);
    expect(wrapper.get('[data-test-id="camera-status"]').text()).toContain('16.8 megapixels (64 MiB raw)');
    wrapper.unmount();
  });

  it('keeps screenshot encoding single-flight and ignores callbacks after unmount', async () => {
    const wrapper = mountCameraRecorder();
    const video = wrapper.get('video').element as HTMLVideoElement;
    Object.defineProperty(video, 'videoWidth', { configurable: true, value: 1_920 });
    Object.defineProperty(video, 'videoHeight', { configurable: true, value: 1_080 });

    const callbacks: BlobCallback[] = [];
    const drawImage = vi.fn();
    const canvas = {
      width: 0,
      height: 0,
      getContext: vi.fn(() => ({ drawImage })),
      toBlob: vi.fn((callback: BlobCallback) => callbacks.push(callback)),
    } as unknown as HTMLCanvasElement;
    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tagName, options) => (
      tagName === 'canvas' ? canvas : originalCreateElement(tagName, options)
    ));
    const createObjectURL = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:screenshot');
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
    const screenshotButton = wrapper.get('[data-test-id="camera-screenshot"]');

    await screenshotButton.trigger('click');
    await screenshotButton.trigger('click');

    expect(canvas.toBlob).toHaveBeenCalledOnce();
    expect(drawImage).toHaveBeenCalledOnce();
    expect(screenshotButton.attributes('disabled')).toBeDefined();

    callbacks[0]?.(new Blob(['first'], { type: 'image/png' }));
    await nextTick();
    expect(createObjectURL).toHaveBeenCalledOnce();
    expect(screenshotButton.attributes('disabled')).toBeUndefined();

    await screenshotButton.trigger('click');
    expect(canvas.toBlob).toHaveBeenCalledTimes(2);

    wrapper.unmount();
    callbacks[1]?.(new Blob(['late'], { type: 'image/png' }));
    expect(createObjectURL).toHaveBeenCalledOnce();
  });
});
