/**
 * @vitest-environment jsdom
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mount, shallowMount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import _ from 'lodash';
import CInputText from './c-input-text.vue';
import { useValidation } from '@/composable/validation';

describe('CInputText', () => {
  beforeEach(() => {
    // Mock localStorage for VueUse's useStorage
    const localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };
    globalThis.localStorage = localStorageMock as any;

    setActivePinia(createPinia());
  });

  it('Renders a label', () => {
    const wrapper = shallowMount(CInputText, {
      props: {
        label: 'Label',
      },
    });

    expect(wrapper.get('.label').text()).toBe('Label');
  });

  it('Renders a placeholder', () => {
    const wrapper = shallowMount(CInputText, {
      props: {
        placeholder: 'Placeholder',
      },
    });

    expect(wrapper.get('.input').attributes('placeholder')).toBe('Placeholder');
  });

  it('Renders a value', () => {
    const wrapper = shallowMount(CInputText, {
      props: {
        value: 'Value',
      },
    });

    expect(wrapper.vm.value).toBe('Value');
  });

  it('Renders a provided id', () => {
    const wrapper = shallowMount(CInputText, {
      props: {
        id: 'id',
      },
    });

    expect(wrapper.get('.input').attributes('id')).toBe('id');
  });

  it('updates value on input', async () => {
    const wrapper = shallowMount(CInputText);

    await wrapper.get('input').setValue('Hello');

    expect(_.get(wrapper.emitted(), 'update:value.0.0')).toBe('Hello');
  });

  it('cannot be edited when disabled', async () => {
    const wrapper = shallowMount(CInputText, {
      props: {
        disabled: true,
      },
    });

    await wrapper.get('input').setValue('Hello');

    expect(_.get(wrapper.emitted(), 'update:value')).toBeUndefined();
  });

  it('renders a feedback message for invalid rules', async () => {
    const wrapper = shallowMount(CInputText, {
      props: { validationRules: [{ validator: () => false, message: 'Message' }] },
    });

    const feedback = wrapper.find('.feedback');
    expect(feedback.exists()).toBe(true);
    expect(feedback.text()).toBe('Message');
  });

  it('if the value become valid according to rules, the feedback disappear', async () => {
    const wrapper = shallowMount(CInputText, {
      props: {
        validationRules: [{ validator: (value: string) => value === 'Hello', message: 'Value should be Hello' }],
      },
    });

    const feedback = wrapper.find('.feedback');
    expect(feedback.exists()).toBe(true);
    expect(feedback.text()).toBe('Value should be Hello');

    await wrapper.setProps({ value: 'Hello' });

    expect(wrapper.find('.feedback').exists()).toBe(false);
  });

  it('feedback does not render for valid rules', async () => {
    const wrapper = shallowMount(CInputText, {
      props: { rules: [{ validator: () => true, message: 'Message' }] },
    });

    expect(wrapper.find('.feedback').exists()).toBe(false);
  });

  it('renders a feedback message for invalid custom validation wrapper', async () => {
    const wrapper = shallowMount(CInputText, {
      props: {
        validation: useValidation({ source: ref(), rules: [{ validator: () => false, message: 'Message' }] }),
      },
    });

    const feedback = wrapper.find('.feedback');
    expect(feedback.exists()).toBe(true);
    expect(feedback.text()).toBe('Message');
  });

  it('feedback does not render for valid custom validation wrapper', async () => {
    const wrapper = shallowMount(CInputText, {
      props: {
        validation: useValidation({ source: ref(), rules: [{ validator: () => true, message: 'Message' }] }),
      },
    });
    expect(wrapper.find('.feedback').exists()).toBe(false);
  });

  it('if the value become valid according to the custom validation wrapper, the feedback disappear', async () => {
    const source = ref('');

    const wrapper = shallowMount(CInputText, {
      props: {
        validation: useValidation({
          source,
          rules: [{ validator: (value: string) => value === 'Hello', message: 'Value should be Hello' }],
        }),
      },
    });

    const feedback = wrapper.find('.feedback');
    expect(feedback.exists()).toBe(true);
    expect(feedback.text()).toBe('Value should be Hello');

    source.value = 'Hello';

    await wrapper.vm.$nextTick();

    expect(wrapper.find('.feedback').exists()).toBe(false);
  });

  it('[prop:testId] renders a test id on the input', async () => {
    const wrapper = mount(CInputText, {
      props: {
        testId: 'TEST',
      },
    });

    expect(wrapper.get('input').attributes('data-test-id')).toBe('TEST');
  });
});
