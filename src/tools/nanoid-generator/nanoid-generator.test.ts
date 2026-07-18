/* eslint-disable vue/one-component-per-file -- Small render-only stubs exercise the tool interactions. */
import { defineComponent, h } from 'vue';
import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import NanoIdGenerator from './nanoid-generator.vue';

const mocks = vi.hoisted(() => ({
  copy: vi.fn(),
  download: vi.fn(),
}));

vi.mock('@/composable/copy', () => ({
  useCopy: () => ({ copy: mocks.copy }),
}));

vi.mock('@/composable/downloadText', () => ({
  downloadTextFile: mocks.download,
}));

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string, params?: Record<string, string>) => (
      params ? `${key} ${Object.values(params).join(' ')}` : key
    ),
  }),
}));

const CardStub = defineComponent({
  inheritAttrs: false,
  setup(_, { attrs, slots }) {
    return () => h('section', attrs, slots.default?.());
  },
});

const AlertStub = defineComponent({
  inheritAttrs: false,
  props: { title: { type: String, default: '' } },
  setup(props, { attrs, slots }) {
    return () => h('aside', attrs, [h('strong', props.title), slots.default?.()]);
  },
});

const InputStub = defineComponent({
  inheritAttrs: false,
  props: {
    value: { type: String, default: '' },
    testId: { type: String, default: undefined },
    readonly: { type: Boolean, default: false },
  },
  emits: ['update:value'],
  setup(props, { attrs, emit }) {
    return () => h('textarea', {
      ...attrs,
      'value': props.value,
      'readonly': props.readonly,
      'data-test-id': props.testId,
      'onInput': (event: Event) => emit('update:value', (event.target as HTMLTextAreaElement).value),
    });
  },
});

const SwitchStub = defineComponent({
  inheritAttrs: false,
  props: { value: { type: Boolean, default: false } },
  emits: ['update:value'],
  setup(props, { attrs, emit }) {
    return () => h('input', {
      ...attrs,
      type: 'checkbox',
      checked: props.value,
      onChange: (event: Event) => emit('update:value', (event.target as HTMLInputElement).checked),
    });
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

function mountGenerator() {
  return mount(NanoIdGenerator, {
    global: {
      stubs: {
        CAlert: AlertStub,
        CButton: ButtonStub,
        CCard: CardStub,
        CInputText: InputStub,
        NSwitch: SwitchStub,
      },
    },
  });
}

describe('NanoID generator interactions', () => {
  beforeEach(() => {
    mocks.copy.mockReset();
    mocks.download.mockReset();
    localStorage.clear();
  });

  it('generates one default URL-safe NanoID on initial render without persistence', () => {
    const wrapper = mountGenerator();
    const output = wrapper.get('[data-test-id="nanoid-output"]').element as HTMLTextAreaElement;

    expect(output.value).toMatch(/^[_\-0-9a-zA-Z]{21}$/);
    expect(localStorage).toHaveLength(0);
    expect(wrapper.get('[data-test-id="nanoid-guidance"]').text()).toContain('126.00 bits');
    wrapper.unmount();
  });

  it('waits for an explicit Generate action and applies a custom alphabet', async () => {
    const wrapper = mountGenerator();
    const initialOutput = (wrapper.get('[data-test-id="nanoid-output"]').element as HTMLTextAreaElement).value;

    await wrapper.get('[data-test-id="nanoid-length"]').setValue('5');
    await wrapper.get('[data-test-id="nanoid-quantity"]').setValue('3');
    await wrapper.get('[data-test-id="nanoid-custom-alphabet"]').trigger('click');
    await wrapper.get('[data-test-id="nanoid-alphabet"]').setValue('AB');

    expect((wrapper.get('[data-test-id="nanoid-output"]').element as HTMLTextAreaElement).value).toBe(initialOutput);
    expect(wrapper.find('[data-test-id="nanoid-stale"]').exists()).toBe(true);

    await wrapper.get('[data-test-id="nanoid-generate"]').trigger('click');
    await flushPromises();

    const ids = (wrapper.get('[data-test-id="nanoid-output"]').element as HTMLTextAreaElement).value.split('\n');
    expect(ids).toHaveLength(3);
    expect(ids.every(id => id.length === 5 && /^[AB]+$/.test(id))).toBe(true);
    expect(wrapper.find('[data-test-id="nanoid-stale"]').exists()).toBe(false);
    wrapper.unmount();
  });

  it('blocks duplicate alphabets and preserves the previous output', async () => {
    const wrapper = mountGenerator();
    const initialOutput = (wrapper.get('[data-test-id="nanoid-output"]').element as HTMLTextAreaElement).value;

    await wrapper.get('[data-test-id="nanoid-custom-alphabet"]').trigger('click');
    await wrapper.get('[data-test-id="nanoid-alphabet"]').setValue('AA');

    expect(wrapper.get('[data-test-id="nanoid-validation"]').text()).toContain('unique');
    expect(wrapper.get('[data-test-id="nanoid-generate"]').attributes('disabled')).toBeDefined();
    expect((wrapper.get('[data-test-id="nanoid-output"]').element as HTMLTextAreaElement).value).toBe(initialOutput);
    wrapper.unmount();
  });

  it('copies, downloads, and clears only on explicit actions', async () => {
    const wrapper = mountGenerator();
    const output = (wrapper.get('[data-test-id="nanoid-output"]').element as HTMLTextAreaElement).value;

    await wrapper.get('[data-test-id="nanoid-copy"]').trigger('click');
    await wrapper.get('[data-test-id="nanoid-download"]').trigger('click');

    expect(mocks.copy).toHaveBeenCalledOnce();
    expect(mocks.download).toHaveBeenCalledWith({ content: output, filename: 'nanoids.txt' });

    await wrapper.get('[data-test-id="nanoid-clear"]').trigger('click');
    expect((wrapper.get('[data-test-id="nanoid-output"]').element as HTMLTextAreaElement).value).toBe('');
    expect(wrapper.get('[data-test-id="nanoid-copy"]').attributes('disabled')).toBeDefined();
    expect(wrapper.get('[data-test-id="nanoid-download"]').attributes('disabled')).toBeDefined();
    wrapper.unmount();
  });
});
