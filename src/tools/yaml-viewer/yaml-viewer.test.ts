/* eslint-disable vue/one-component-per-file -- Small render-only stubs exercise async component behavior. */
import { defineComponent, h } from 'vue';
import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import YamlViewer from './yaml-viewer.vue';
import { YAML_LIVE_FORMAT_MAX_BYTES } from './yaml-viewer.worker.protocol';

const mocks = vi.hoisted(() => ({
  run: vi.fn(),
  cancel: vi.fn(),
  dispose: vi.fn(),
}));

vi.mock('./yaml-viewer.worker-client', () => ({
  YamlWorkerClient: class {
    run = mocks.run;
    cancel = mocks.cancel;
    dispose = mocks.dispose;
  },
}));

const InputStub = defineComponent({
  inheritAttrs: false,
  props: {
    value: { type: String, default: '' },
  },
  emits: ['update:value'],
  setup(props, { attrs, emit }) {
    return () => h('textarea', {
      ...attrs,
      'value': props.value,
      'data-test-id': 'yaml-input',
      'onInput': (event: Event) => emit('update:value', (event.target as HTMLTextAreaElement).value),
    });
  },
});

const ButtonStub = defineComponent({
  inheritAttrs: false,
  props: {
    disabled: { type: Boolean, default: false },
  },
  emits: ['click'],
  setup(props, { attrs, emit, slots }) {
    return () => h('button', {
      ...attrs,
      disabled: props.disabled,
      onClick: () => emit('click'),
    }, slots.default?.());
  },
});

const FormItemStub = defineComponent({
  setup(_, { slots }) {
    return () => h('div', slots.default?.());
  },
});

const OutputStub = defineComponent({
  props: {
    value: { type: String, required: true },
  },
  setup(props) {
    return () => h('pre', { 'data-test-id': 'yaml-output' }, props.value);
  },
});

function mountViewer() {
  return mount(YamlViewer, {
    global: {
      stubs: {
        CButton: ButtonStub,
        CCard: FormItemStub,
        CField: FormItemStub,
        CInputNumber: true,
        CInputText: InputStub,
        CSwitch: true,
        TextareaCopyable: OutputStub,
      },
    },
  });
}

describe('YAML viewer worker interaction', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
    mocks.run.mockReset();
    mocks.cancel.mockReset();
    mocks.dispose.mockReset();
    mocks.run.mockImplementation(async (task: { source: string }) => ({
      value: `${task.source}\n`,
      elapsedMs: 4,
    }));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('uses one wide vertical workbench for input and output', () => {
    const wrapper = mountViewer();

    expect(wrapper.get('.c-tool-workbench').classes()).toContain('c-tool-stack');
    expect(wrapper.findAll('.c-tool-panel')).toHaveLength(2);

    wrapper.unmount();
  });

  it('debounces small input and commits one worker result', async () => {
    const wrapper = mountViewer();

    await wrapper.get('[data-test-id="yaml-input"]').setValue('hello: world');
    await vi.advanceTimersByTimeAsync(299);
    expect(mocks.run).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(1);
    await flushPromises();

    expect(mocks.run).toHaveBeenCalledOnce();
    expect(mocks.run).toHaveBeenCalledWith({
      operation: 'format',
      source: 'hello: world',
      indentSize: 2,
      sortKeys: false,
    });
    expect(wrapper.get('[data-test-id="yaml-output"]').text()).toBe('hello: world');
    expect(wrapper.get('[data-test-id="yaml-format-status"]').text()).toContain('formatted in 4 ms');
    wrapper.unmount();
  });

  it('requires an explicit action above the live-format threshold', async () => {
    const wrapper = mountViewer();
    const source = 'x'.repeat(YAML_LIVE_FORMAT_MAX_BYTES + 1);

    await wrapper.get('[data-test-id="yaml-input"]').setValue(source);
    await vi.advanceTimersByTimeAsync(1_000);

    expect(mocks.run).not.toHaveBeenCalled();
    expect(wrapper.get('[data-test-id="yaml-format-status"]').text()).toContain('only on request');

    await wrapper.get('[data-test-id="yaml-format-run"]').trigger('click');
    await flushPromises();

    expect(mocks.run).toHaveBeenCalledOnce();
    expect(mocks.run.mock.calls[0][0]).toMatchObject({ source });
    wrapper.unmount();
  });

  it('cancels pending and running work and disposes the client on unmount', async () => {
    mocks.run.mockImplementation(() => new Promise(() => {}));
    const wrapper = mountViewer();

    await wrapper.get('[data-test-id="yaml-input"]').setValue('hello: world');
    await wrapper.get('[data-test-id="yaml-format-cancel"]').trigger('click');
    await vi.advanceTimersByTimeAsync(1_000);
    expect(mocks.run).not.toHaveBeenCalled();
    expect(wrapper.get('[data-test-id="yaml-format-status"]').text()).toContain('cancelled');

    await wrapper.get('[data-test-id="yaml-format-run"]').trigger('click');
    await flushPromises();
    expect(mocks.run).toHaveBeenCalledOnce();

    await wrapper.get('[data-test-id="yaml-format-cancel"]').trigger('click');
    expect(mocks.cancel).toHaveBeenCalledWith('YAML formatting cancelled.');

    wrapper.unmount();
    expect(mocks.dispose).toHaveBeenCalledOnce();
  });

  it('does not commit a result after its input becomes stale', async () => {
    let resolveFirst: ((value: { value: string; elapsedMs: number }) => void) | undefined;
    mocks.run.mockImplementationOnce(() => new Promise((resolve) => {
      resolveFirst = resolve;
    }));
    const wrapper = mountViewer();

    await wrapper.get('[data-test-id="yaml-input"]').setValue('first: value');
    await vi.advanceTimersByTimeAsync(300);
    expect(mocks.run).toHaveBeenCalledOnce();

    await wrapper.get('[data-test-id="yaml-input"]').setValue('second: value');
    resolveFirst?.({ value: 'stale: result\n', elapsedMs: 10 });
    await flushPromises();

    expect(wrapper.get('[data-test-id="yaml-output"]').text()).toBe('');
    expect(wrapper.get('[data-test-id="yaml-format-status"]').text()).toContain('Waiting');
    wrapper.unmount();
  });
});
