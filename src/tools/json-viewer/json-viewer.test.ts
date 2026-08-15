/* eslint-disable vue/one-component-per-file -- Small render-only stubs exercise async component behavior. */
import { defineComponent, h } from 'vue';
import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import JsonViewer from './json-viewer.vue';
import { JSON_LIVE_FORMAT_MAX_BYTES, JsonTaskError } from './json-viewer.worker.protocol';

const mocks = vi.hoisted(() => ({
  run: vi.fn(),
  cancel: vi.fn(),
  dispose: vi.fn(),
}));

vi.mock('./json-viewer.worker-client', () => ({
  JsonWorkerClient: class {
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
      'data-test-id': 'json-input',
      'onInput': (event: Event) => emit('update:value', (event.target as HTMLTextAreaElement).value),
    });
  },
});

const SelectStub = defineComponent({
  inheritAttrs: false,
  props: {
    value: { type: String, default: '' },
    options: { type: Array, default: () => [] },
  },
  emits: ['update:value'],
  setup(props, { attrs, emit }) {
    return () => h('select', {
      'data-test-id': attrs['data-test-id'],
      'value': props.value,
      'onChange': (event: Event) => emit('update:value', (event.target as HTMLSelectElement).value),
    }, (props.options as Array<{ label: string; value: string }>).map(option =>
      h('option', { value: option.value }, option.label),
    ));
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
    return () => h('pre', { 'data-test-id': 'json-output' }, props.value);
  },
});

function mountViewer() {
  return mount(JsonViewer, {
    global: {
      stubs: {
        CButton: ButtonStub,
        CCard: FormItemStub,
        CField: FormItemStub,
        CInputNumber: true,
        CInputText: InputStub,
        CSelect: SelectStub,
        CSwitch: true,
        TextareaCopyable: OutputStub,
      },
    },
  });
}

describe('JSON viewer worker interaction', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
    mocks.run.mockReset();
    mocks.cancel.mockReset();
    mocks.dispose.mockReset();
    mocks.run.mockImplementation(async (task: { source: string }) => ({
      value: task.source,
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

  it('debounces small strict input and commits one worker result', async () => {
    const wrapper = mountViewer();

    await wrapper.get('[data-test-id="json-input"]').setValue('{"large":17478252242305210114}');
    await vi.advanceTimersByTimeAsync(299);
    expect(mocks.run).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(1);
    await flushPromises();

    expect(mocks.run).toHaveBeenCalledOnce();
    expect(mocks.run).toHaveBeenCalledWith({
      operation: 'format',
      source: '{"large":17478252242305210114}',
      indentSize: 3,
      sortKeys: true,
      mode: 'strict',
    });
    expect(wrapper.get('[data-test-id="json-output"]').text()).toContain('17478252242305210114');
    expect(wrapper.get('[data-test-id="json-format-status"]').text()).toContain('formatted in 4 ms');
    wrapper.unmount();
  });

  it('requires an explicit action above the live-format threshold', async () => {
    const wrapper = mountViewer();
    const source = `{"payload":"${'x'.repeat(JSON_LIVE_FORMAT_MAX_BYTES)}"}`;

    await wrapper.get('[data-test-id="json-input"]').setValue(source);
    await vi.advanceTimersByTimeAsync(1_000);

    expect(mocks.run).not.toHaveBeenCalled();
    expect(wrapper.get('[data-test-id="json-format-status"]').text()).toContain('only on request');

    await wrapper.get('[data-test-id="json-format-run"]').trigger('click');
    await flushPromises();

    expect(mocks.run).toHaveBeenCalledOnce();
    expect(mocks.run.mock.calls[0][0]).toMatchObject({ source, mode: 'strict' });
    wrapper.unmount();
  });

  it('makes JSON5 an explicit mode and displays its precision warning', async () => {
    const wrapper = mountViewer();

    expect(wrapper.find('[data-test-id="json-compatibility-warning"]').exists()).toBe(false);
    await wrapper.get('[data-test-id="json-format-mode"]').setValue('json5');
    expect(wrapper.get('[data-test-id="json-compatibility-warning"]').text()).toContain('rejects unsafe integers');
    expect(wrapper.get('[data-test-id="json-compatibility-warning"]').text()).toContain('Decimal and exponent');

    await wrapper.get('[data-test-id="json-input"]').setValue('{unquoted: true}');
    await vi.advanceTimersByTimeAsync(300);
    await flushPromises();

    expect(mocks.run).toHaveBeenCalledOnce();
    expect(mocks.run).toHaveBeenCalledWith(expect.objectContaining({
      source: '{unquoted: true}',
      mode: 'json5',
    }));
    wrapper.unmount();
  });

  it('cancels pending and running work and disposes the client on unmount', async () => {
    mocks.run.mockImplementation(() => new Promise(() => {}));
    const wrapper = mountViewer();

    await wrapper.get('[data-test-id="json-input"]').setValue('{"hello":"world"}');
    await wrapper.get('[data-test-id="json-format-cancel"]').trigger('click');
    await vi.advanceTimersByTimeAsync(1_000);
    expect(mocks.run).not.toHaveBeenCalled();
    expect(wrapper.get('[data-test-id="json-format-status"]').text()).toContain('cancelled');

    await wrapper.get('[data-test-id="json-format-run"]').trigger('click');
    await flushPromises();
    expect(mocks.run).toHaveBeenCalledOnce();

    await wrapper.get('[data-test-id="json-format-cancel"]').trigger('click');
    expect(mocks.cancel).toHaveBeenCalledWith('JSON formatting cancelled.');

    wrapper.unmount();
    expect(mocks.dispose).toHaveBeenCalledOnce();
  });

  it('does not commit a result after its input becomes stale', async () => {
    let resolveFirst: ((value: { value: string; elapsedMs: number }) => void) | undefined;
    mocks.run.mockImplementationOnce(() => new Promise((resolve) => {
      resolveFirst = resolve;
    }));
    const wrapper = mountViewer();

    await wrapper.get('[data-test-id="json-input"]').setValue('{"first":true}');
    await vi.advanceTimersByTimeAsync(300);
    expect(mocks.run).toHaveBeenCalledOnce();

    await wrapper.get('[data-test-id="json-input"]').setValue('{"second":true}');
    resolveFirst?.({ value: '{"stale":true}', elapsedMs: 10 });
    await flushPromises();

    expect(wrapper.get('[data-test-id="json-output"]').text()).toBe('');
    expect(wrapper.get('[data-test-id="json-format-status"]').text()).toContain('Waiting');
    wrapper.unmount();
  });

  it('shows structured worker errors without retaining stale output', async () => {
    mocks.run.mockRejectedValueOnce(new JsonTaskError('syntax', 'Provided JSON is not valid.'));
    const wrapper = mountViewer();

    await wrapper.get('[data-test-id="json-input"]').setValue('{invalid}');
    await vi.advanceTimersByTimeAsync(300);
    await flushPromises();

    expect(wrapper.get('[data-test-id="json-format-status"]').text()).toBe('Provided JSON is not valid.');
    expect(wrapper.get('[data-test-id="json-output"]').text()).toBe('');
    wrapper.unmount();
  });
});
