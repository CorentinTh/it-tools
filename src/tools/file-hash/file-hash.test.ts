/* eslint-disable vue/one-component-per-file -- Small render-only stubs exercise tool interactions. */
import { flushPromises, mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import FileHash from './file-hash.vue';
import {
  FILE_HASH_DIGEST_BYTES,
  FILE_HASH_MAX_FILE_BYTES,
  type FileHashResult,
} from './file-hash.worker.protocol';

const mocks = vi.hoisted(() => ({
  cancel: vi.fn(),
  copy: vi.fn(),
  dispose: vi.fn(),
  run: vi.fn(),
}));

vi.mock('./file-hash.worker-client', () => ({
  FileHashWorkerClient: class {
    run = mocks.run;
    cancel = mocks.cancel;
    dispose = mocks.dispose;
  },
}));

vi.mock('@/composable/copy', () => ({
  useCopy: () => ({ copy: mocks.copy }),
}));

const FileUploadStub = defineComponent({
  inheritAttrs: false,
  emits: ['fileUpload'],
  setup(_props, { attrs, emit }) {
    return () => h('button', {
      ...attrs,
      onClick: () => emit('fileUpload', new File(['default'], 'default.bin')),
    }, 'Select file');
  },
});

const CheckboxStub = defineComponent({
  inheritAttrs: false,
  props: {
    checked: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
  },
  emits: ['update:checked'],
  setup(props, { attrs, emit, slots }) {
    return () => h('button', {
      ...attrs,
      'disabled': props.disabled,
      'aria-pressed': String(props.checked),
      'onClick': () => emit('update:checked', !props.checked),
    }, slots.default?.());
  },
});

const ButtonStub = defineComponent({
  inheritAttrs: false,
  props: { disabled: { type: Boolean, default: false } },
  emits: ['click'],
  setup(props, { attrs, emit, slots }) {
    return () => h('button', {
      ...attrs,
      disabled: props.disabled,
      onClick: () => emit('click'),
    }, slots.default?.());
  },
});

const ContainerStub = defineComponent({
  inheritAttrs: false,
  setup(_props, { attrs, slots }) {
    return () => h('div', attrs, slots.default?.());
  },
});

const ProgressStub = defineComponent({
  inheritAttrs: false,
  props: { percentage: { type: Number, default: 0 } },
  setup(props, { attrs }) {
    return () => h('progress', { ...attrs, max: 100, value: props.percentage });
  },
});

function mountFileHash() {
  return mount(FileHash, {
    global: {
      stubs: {
        CAlert: ContainerStub,
        CButton: ButtonStub,
        CCard: ContainerStub,
        CFileUpload: FileUploadStub,
        NCheckbox: CheckboxStub,
        NProgress: ProgressStub,
      },
    },
  });
}

function resultFor(file: File, algorithms: FileHashResult['digests'][number]['algorithm'][]): FileHashResult {
  return {
    fileSize: file.size,
    digests: algorithms.map(algorithm => ({
      algorithm,
      hex: 'a'.repeat(FILE_HASH_DIGEST_BYTES[algorithm] * 2),
    })),
  };
}

function createDeferred<T>() {
  let deferredResolve!: (value: T) => void;
  const promise = new Promise<T>((resolve) => {
    deferredResolve = resolve;
  });
  return { promise, resolve: deferredResolve };
}

beforeEach(() => {
  mocks.cancel.mockReset();
  mocks.copy.mockReset().mockResolvedValue(undefined);
  mocks.dispose.mockReset();
  mocks.run.mockReset();
  localStorage.clear();
  sessionStorage.clear();
});

describe('File Hash interactions', () => {
  it('offers modern hashes and clearly labels MD5 and SHA-1 as legacy', () => {
    const wrapper = mountFileHash();

    for (const algorithm of ['SHA-256', 'SHA-384', 'SHA-512', 'SHA3-256', 'BLAKE3-256']) {
      expect(wrapper.find(`[data-test-id="file-hash-algorithm-${algorithm}"]`).exists()).toBe(true);
    }
    expect(wrapper.get('[data-test-id="file-hash-legacy-SHA-1"]').text()).toBe('(legacy)');
    expect(wrapper.get('[data-test-id="file-hash-legacy-MD5"]').text()).toBe('(legacy)');
    expect(wrapper.text()).toContain('known collision attacks');

    wrapper.unmount();
  });

  it('waits for an explicit action and hashes the selected file with SHA-256 by default', async () => {
    const file = new File(['abc'], 'release-🚀.bin', { type: 'application/octet-stream' });
    mocks.run.mockResolvedValue({ value: resultFor(file, ['SHA-256']), elapsedMs: 12 });
    const wrapper = mountFileHash();

    expect(mocks.run).not.toHaveBeenCalled();
    expect(wrapper.get('[data-test-id="file-hash-run"]').attributes('disabled')).toBeDefined();

    wrapper.findComponent(FileUploadStub).vm.$emit('fileUpload', file);
    await wrapper.vm.$nextTick();

    expect(wrapper.get('[data-test-id="file-hash-name"]').text()).toBe('release-🚀.bin');
    expect(mocks.run).not.toHaveBeenCalled();
    expect(wrapper.get('[data-test-id="file-hash-run"]').attributes('disabled')).toBeUndefined();

    await wrapper.get('[data-test-id="file-hash-run"]').trigger('click');
    await flushPromises();

    expect(mocks.run).toHaveBeenCalledOnce();
    expect(mocks.run.mock.calls[0][0]).toEqual({ file, algorithms: ['SHA-256'] });
    expect(mocks.run.mock.calls[0][1]).toEqual(expect.any(Function));
    expect(wrapper.get('[data-test-id="file-hash-status"]').text()).toContain('completed in 12 ms');
    expect(wrapper.get('[data-test-id="file-hash-result-SHA-256"]').text()).toBe('a'.repeat(64));
    expect(localStorage).toHaveLength(0);
    expect(sessionStorage).toHaveLength(0);
    wrapper.unmount();
  });

  it('uses one task for the canonical selected algorithm set and exposes bounded progress', async () => {
    const file = new File([new Uint8Array(128)], 'binary.dat');
    const deferred = createDeferred<{ value: FileHashResult; elapsedMs: number }>();
    mocks.run.mockReturnValue(deferred.promise);
    const wrapper = mountFileHash();
    wrapper.findComponent(FileUploadStub).vm.$emit('fileUpload', file);
    await wrapper.vm.$nextTick();

    await wrapper.get('[data-test-id="file-hash-algorithm-SHA-512"]').trigger('click');
    await wrapper.get('[data-test-id="file-hash-algorithm-SHA-384"]').trigger('click');
    await wrapper.get('[data-test-id="file-hash-run"]').trigger('click');

    expect(mocks.run.mock.calls[0][0]).toEqual({
      file,
      algorithms: ['SHA-256', 'SHA-384', 'SHA-512'],
    });
    const onProgress = mocks.run.mock.calls[0][1] as (progress: { bytesProcessed: number; totalBytes: number }) => void;
    onProgress({ bytesProcessed: 64, totalBytes: 128 });
    await wrapper.vm.$nextTick();

    expect(wrapper.get('[data-test-id="file-hash-progress-bytes"]').text()).toBe('64 Bytes of 128 Bytes');

    deferred.resolve({
      value: resultFor(file, ['SHA-256', 'SHA-384', 'SHA-512']),
      elapsedMs: 25,
    });
    await flushPromises();
    expect(wrapper.findAll('[data-test-id^="file-hash-result-"]')).toHaveLength(3);
    wrapper.unmount();
  });

  it('cancels on file replacement and ignores the stale result', async () => {
    const firstFile = new File(['first'], 'first.bin');
    const secondFile = new File(['second'], 'second.bin');
    const first = createDeferred<{ value: FileHashResult; elapsedMs: number }>();
    mocks.run.mockReturnValue(first.promise);
    const wrapper = mountFileHash();

    wrapper.findComponent(FileUploadStub).vm.$emit('fileUpload', firstFile);
    await wrapper.vm.$nextTick();
    await wrapper.get('[data-test-id="file-hash-run"]').trigger('click');
    wrapper.findComponent(FileUploadStub).vm.$emit('fileUpload', secondFile);
    await wrapper.vm.$nextTick();

    expect(mocks.cancel).toHaveBeenLastCalledWith('File hashing cancelled because a different file was selected.');
    first.resolve({ value: resultFor(firstFile, ['SHA-256']), elapsedMs: 4 });
    await flushPromises();

    expect(wrapper.find('[data-test-id="file-hash-results"]').exists()).toBe(false);
    expect(wrapper.get('[data-test-id="file-hash-name"]').text()).toBe('second.bin');
    expect(wrapper.get('[data-test-id="file-hash-status"]').text()).toContain('File selected');
    wrapper.unmount();
  });

  it('rejects the file-size ceiling before starting a worker task', async () => {
    const file = new File(['small'], 'oversized.bin');
    Object.defineProperty(file, 'size', { configurable: true, value: FILE_HASH_MAX_FILE_BYTES + 1 });
    const wrapper = mountFileHash();

    wrapper.findComponent(FileUploadStub).vm.$emit('fileUpload', file);
    await wrapper.vm.$nextTick();

    expect(wrapper.get('[data-test-id="file-hash-status"]').text()).toContain('limit');
    expect(wrapper.get('[data-test-id="file-hash-run"]').attributes('disabled')).toBeDefined();
    expect(mocks.run).not.toHaveBeenCalled();
    wrapper.unmount();
  });

  it('copies only a digest, clears session state, and disposes on unmount', async () => {
    const file = new File(['abc'], 'private-marker.bin');
    const result = resultFor(file, ['SHA-256']);
    mocks.run.mockResolvedValue({ value: result, elapsedMs: 3 });
    const wrapper = mountFileHash();

    wrapper.findComponent(FileUploadStub).vm.$emit('fileUpload', file);
    await wrapper.vm.$nextTick();
    await wrapper.get('[data-test-id="file-hash-run"]').trigger('click');
    await flushPromises();
    await wrapper.get('[data-test-id="file-hash-copy-SHA-256"]').trigger('click');

    expect(mocks.copy).toHaveBeenCalledWith(result.digests[0].hex, {
      notificationMessage: 'SHA-256 digest copied to the clipboard',
    });
    expect(JSON.stringify(mocks.copy.mock.calls)).not.toContain(file.name);

    await wrapper.get('[data-test-id="file-hash-clear"]').trigger('click');
    expect(wrapper.find('[data-test-id="file-hash-selection"]').exists()).toBe(false);
    expect(wrapper.find('[data-test-id="file-hash-results"]').exists()).toBe(false);
    expect(mocks.cancel).toHaveBeenLastCalledWith('File hashing cancelled because the tool was cleared.');

    wrapper.unmount();
    expect(mocks.dispose).toHaveBeenCalledOnce();
  });
});
