import { beforeEach, describe, expect, it } from 'vitest';
import { mount, shallowMount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import _ from 'lodash';
import CInputText from './c-input-text.vue';
import { useValidation } from '@/composable/validation';

describe('CInputText', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('Renders a label', () => {
    const wrapper = shallowMount(CInputText, {
      props: {
        label: 'Label',
      },
    });

    expect(wrapper.get('.label').text()).to.equal('Label');
  });

  it('Renders a placeholder', () => {
    const wrapper = shallowMount(CInputText, {
      props: {
        placeholder: 'Placeholder',
      },
    });

    expect(wrapper.get('.input').attributes('placeholder')).to.equal('Placeholder');
  });

  it.each([false, true])('forwards an accessible name to the native control when multiline is %s', (multiline) => {
    const wrapper = shallowMount(CInputText, {
      props: {
        ariaLabel: 'Generated value',
        multiline,
      },
    });

    expect(wrapper.get(multiline ? 'textarea' : 'input').attributes('aria-label')).toBe('Generated value');
  });

  it('Renders a value', () => {
    const wrapper = shallowMount(CInputText, {
      props: {
        value: 'Value',
      },
    });

    expect(wrapper.vm.value).to.equal('Value');
  });

  it('uses the intended native input size without treating it as a visual utility', () => {
    const wrapper = shallowMount(CInputText);

    expect(wrapper.get('input').attributes('size')).to.equal('1');
  });

  it.each([false, true])('forwards native text-entry bounds when multiline is %s', (multiline) => {
    const wrapper = shallowMount(CInputText, {
      props: {
        inputmode: 'numeric',
        maxlength: 5,
        multiline,
      },
    });
    const input = wrapper.get(multiline ? 'textarea' : 'input');

    expect(input.attributes('inputmode')).toBe('numeric');
    expect(input.attributes('maxlength')).toBe('5');
  });

  it('Renders a provided id', () => {
    const wrapper = shallowMount(CInputText, {
      props: {
        id: 'id',
      },
    });

    expect(wrapper.get('.input').attributes('id')).to.equal('id');
  });

  it('updates value on input', async () => {
    const wrapper = shallowMount(CInputText);

    await wrapper.get('input').setValue('Hello');

    expect(_.get(wrapper.emitted(), 'update:value.0.0')).to.equal('Hello');
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
    expect(feedback.exists()).to.equal(true);
    expect(feedback.text()).to.equal('Message');
  });

  it('associates invalid feedback with the native control', () => {
    const wrapper = mount(CInputText, {
      props: {
        id: 'validated-input',
        validationRules: [{ validator: () => false, message: 'Invalid value' }],
      },
    });
    const input = wrapper.get('input');
    const feedback = wrapper.get('.feedback');

    expect(input.attributes('aria-invalid')).toBe('true');
    expect(input.attributes('aria-describedby')).toBe('validated-input-feedback');
    expect(feedback.attributes('id')).toBe('validated-input-feedback');
    expect(feedback.attributes('role')).toBe('alert');
  });

  it('labels clear and password actions and keeps disabled values immutable', async () => {
    const wrapper = mount(CInputText, {
      props: {
        value: 'secret',
        type: 'password',
        clearable: true,
        disabled: true,
      },
    });
    const [clearButton, passwordButton] = wrapper.findAll('button');

    expect(clearButton.attributes('aria-label')).toBe('Clear input');
    expect(passwordButton.attributes('aria-label')).toBe('Show password');
    expect(passwordButton.attributes('aria-pressed')).toBe('false');
    expect(clearButton.attributes('disabled')).toBeDefined();
    expect(passwordButton.attributes('disabled')).toBeDefined();

    await clearButton.trigger('click');
    await passwordButton.trigger('click');

    expect(wrapper.emitted('update:value')).toBeUndefined();
    expect(wrapper.get('input').attributes('type')).toBe('password');
  });

  it('announces the active password visibility state', async () => {
    const wrapper = mount(CInputText, {
      props: { value: 'secret', type: 'password' },
    });
    const passwordButton = wrapper.get('button');

    await passwordButton.trigger('click');

    expect(passwordButton.attributes('aria-label')).toBe('Hide password');
    expect(passwordButton.attributes('aria-pressed')).toBe('true');
    expect(wrapper.get('input').attributes('type')).toBe('text');
  });

  it('if the value become valid according to rules, the feedback disappear', async () => {
    const wrapper = shallowMount(CInputText, {
      props: {
        validationRules: [{ validator: (value: string) => value === 'Hello', message: 'Value should be Hello' }],
      },
    });

    const feedback = wrapper.find('.feedback');
    expect(feedback.exists()).to.equal(true);
    expect(feedback.text()).to.equal('Value should be Hello');

    await wrapper.setProps({ value: 'Hello' });

    expect(wrapper.find('.feedback').exists()).to.equal(false);
  });

  it('feedback does not render for valid rules', async () => {
    const wrapper = shallowMount(CInputText, {
      props: { rules: [{ validator: () => true, message: 'Message' }] },
    });

    expect(wrapper.find('.feedback').exists()).to.equal(false);
  });

  it('renders a feedback message for invalid custom validation wrapper', async () => {
    const wrapper = shallowMount(CInputText, {
      props: {
        validation: useValidation({ source: ref(), rules: [{ validator: () => false, message: 'Message' }] }),
      },
    });

    const feedback = wrapper.find('.feedback');
    expect(feedback.exists()).to.equal(true);
    expect(feedback.text()).to.equal('Message');
  });

  it('feedback does not render for valid custom validation wrapper', async () => {
    const wrapper = shallowMount(CInputText, {
      props: {
        validation: useValidation({ source: ref(), rules: [{ validator: () => true, message: 'Message' }] }),
      },
    });
    expect(wrapper.find('.feedback').exists()).to.equal(false);
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
    expect(feedback.exists()).to.equal(true);
    expect(feedback.text()).to.equal('Value should be Hello');

    source.value = 'Hello';

    await wrapper.vm.$nextTick();

    expect(wrapper.find('.feedback').exists()).to.equal(false);
  });

  it('[prop:testId] renders a test id on the input', async () => {
    const wrapper = mount(CInputText, {
      props: {
        testId: 'TEST',
      },
    });

    expect(wrapper.get('input').attributes('data-test-id')).to.equal('TEST');
  });
});
