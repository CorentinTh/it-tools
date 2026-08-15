/* eslint-disable vue/one-component-per-file -- Small render-only stubs exercise tool interactions. */
import { flushPromises, mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import RsaKeyPairGenerator from './rsa-key-pair-generator.vue';
import { type RsaKeyPair, RsaTaskError } from './rsa-key-pair-generator.worker.protocol';

const mocks = vi.hoisted(() => ({
  cancel: vi.fn(),
  dispose: vi.fn(),
  run: vi.fn(),
}));

vi.mock('./rsa-key-pair-generator.worker-client', () => ({
  RsaWorkerClient: class {
    run = mocks.run;
    cancel = mocks.cancel;
    dispose = mocks.dispose;
  },
}));

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

const ButtonsSelectStub = defineComponent({
  inheritAttrs: false,
  props: {
    disabled: { type: Boolean, default: false },
    options: { type: Array, default: () => [] },
    value: { type: Number, default: 2048 },
  },
  emits: ['update:value'],
  setup(props, { attrs, emit }) {
    return () => h('select', {
      ...attrs,
      disabled: props.disabled,
      value: props.value,
      onChange: (event: Event) => emit('update:value', Number((event.target as HTMLSelectElement).value)),
    }, (props.options as Array<{ label: string; value: number }>).map(option => (
      h('option', { value: option.value }, option.label)
    )));
  },
});

const ContainerStub = defineComponent({
  setup(_props, { attrs, slots }) {
    return () => h('div', attrs, slots.default?.());
  },
});

const TextareaCopyableStub = defineComponent({
  props: { value: { type: String, required: true } },
  setup(props) {
    return () => h('pre', props.value);
  },
});

function pair(bits: 2048 | 3072 | 4096, marker: string): RsaKeyPair {
  return {
    bits,
    publicKeyPem: `-----BEGIN PUBLIC KEY-----\n${marker}\n-----END PUBLIC KEY-----\n`,
    privateKeyPem: `-----BEGIN PRIVATE KEY-----\n${marker}\n-----END PRIVATE KEY-----\n`,
  };
}

function createDeferred<T>() {
  let resolveDeferred!: (value: T) => void;
  let rejectDeferred!: (reason: unknown) => void;
  const promise = new Promise<T>((resolve, reject) => {
    resolveDeferred = resolve;
    rejectDeferred = reject;
  });
  return { promise, reject: rejectDeferred, resolve: resolveDeferred };
}

function mountGenerator() {
  return mount(RsaKeyPairGenerator, {
    global: {
      stubs: {
        CAlert: ContainerStub,
        CButton: ButtonStub,
        CButtonsSelect: ButtonsSelectStub,
        CCard: ContainerStub,
        TextareaCopyable: TextareaCopyableStub,
      },
    },
  });
}

beforeEach(() => {
  mocks.cancel.mockReset();
  mocks.dispose.mockReset();
  mocks.run.mockReset();
  localStorage.clear();
  sessionStorage.clear();
});

describe('RSA Key Pair Generator interactions', () => {
  it('offers fixed presets and never generates before the explicit action', async () => {
    const wrapper = mountGenerator();
    const size = wrapper.get('[data-test-id="rsa-key-size"]');

    expect(size.findAll('option').map(option => option.attributes('value'))).toEqual(['2048', '3072', '4096']);
    expect(mocks.run).not.toHaveBeenCalled();
    expect(wrapper.find('[data-test-id="rsa-results"]').exists()).toBe(false);

    await size.setValue('3072');
    expect(mocks.run).not.toHaveBeenCalled();
    expect(wrapper.get('[data-test-id="rsa-status"]').text()).toContain('Ready to generate a 3,072-bit');
    wrapper.unmount();
  });

  it('runs the selected snapshot and preserves the previous pair while a replacement is pending', async () => {
    const first = pair(2048, 'FIRST');
    const second = createDeferred<{ value: RsaKeyPair; elapsedMs: number }>();
    mocks.run.mockResolvedValueOnce({ value: first, elapsedMs: 12 }).mockReturnValueOnce(second.promise);
    const wrapper = mountGenerator();

    await wrapper.get('[data-test-id="rsa-generate"]').trigger('click');
    await flushPromises();
    expect(mocks.run).toHaveBeenCalledWith({ bits: 2048 });
    expect(wrapper.get('[data-test-id="rsa-results"]').text()).toContain('FIRST');

    await wrapper.get('[data-test-id="rsa-key-size"]').setValue('4096');
    await wrapper.get('[data-test-id="rsa-generate"]').trigger('click');
    expect(wrapper.get('[data-test-id="rsa-results"]').text()).toContain('FIRST');
    expect(wrapper.get('[data-test-id="rsa-generate"]').attributes('disabled')).toBeDefined();

    second.resolve({ value: pair(4096, 'SECOND'), elapsedMs: 1_250 });
    await flushPromises();
    expect(wrapper.get('[data-test-id="rsa-results"]').text()).toContain('SECOND');
    expect(wrapper.get('[data-test-id="rsa-status"]').text()).toContain('in 1.3 s');
    expect(localStorage).toHaveLength(0);
    expect(sessionStorage).toHaveLength(0);
    wrapper.unmount();
  });

  it('cancels explicitly without clearing the previous pair', async () => {
    const pending = createDeferred<{ value: RsaKeyPair; elapsedMs: number }>();
    mocks.run
      .mockResolvedValueOnce({ value: pair(2048, 'EXISTING'), elapsedMs: 10 })
      .mockReturnValueOnce(pending.promise);
    const wrapper = mountGenerator();

    await wrapper.get('[data-test-id="rsa-generate"]').trigger('click');
    await flushPromises();
    await wrapper.get('[data-test-id="rsa-key-size"]').setValue('4096');
    await wrapper.get('[data-test-id="rsa-generate"]').trigger('click');
    await wrapper.get('[data-test-id="rsa-cancel"]').trigger('click');

    expect(mocks.cancel).toHaveBeenLastCalledWith('RSA key generation cancelled.');
    expect(wrapper.get('[data-test-id="rsa-results"]').text()).toContain('EXISTING');
    expect(wrapper.get('[data-test-id="rsa-status"]').text()).toContain('previous pair is still available');
    wrapper.unmount();
  });

  it('shows bounded failures, preserves results, and disposes active work on unmount', async () => {
    mocks.run
      .mockResolvedValueOnce({ value: pair(2048, 'SAFE'), elapsedMs: 10 })
      .mockRejectedValueOnce(new Error('raw private browser failure'));
    const wrapper = mountGenerator();

    await wrapper.get('[data-test-id="rsa-generate"]').trigger('click');
    await flushPromises();
    await wrapper.get('[data-test-id="rsa-generate"]').trigger('click');
    await flushPromises();

    expect(wrapper.get('[data-test-id="rsa-results"]').text()).toContain('SAFE');
    expect(wrapper.get('[data-test-id="rsa-status"]').text()).toBe('RSA key generation failed. Please try again.');
    expect(wrapper.text()).not.toContain('raw private browser failure');

    wrapper.unmount();
    expect(mocks.dispose).toHaveBeenCalledOnce();
  });

  it('renders timeout errors without replacing an existing pair', async () => {
    mocks.run
      .mockResolvedValueOnce({ value: pair(2048, 'SAFE'), elapsedMs: 10 })
      .mockRejectedValueOnce(new RsaTaskError('timeout', 'RSA key generation exceeded the 30-second time limit.', 30_000));
    const wrapper = mountGenerator();

    await wrapper.get('[data-test-id="rsa-generate"]').trigger('click');
    await flushPromises();
    await wrapper.get('[data-test-id="rsa-generate"]').trigger('click');
    await flushPromises();

    expect(wrapper.get('[data-test-id="rsa-results"]').text()).toContain('SAFE');
    expect(wrapper.get('[data-test-id="rsa-status"]').text()).toContain('30-second time limit');
    wrapper.unmount();
  });
});
