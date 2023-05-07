import { describe, expect, it, beforeEach } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import { setActivePinia, createPinia } from 'pinia';
import _ from 'lodash';
import CInputText from './c-input-text.vue';

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

  it('Renders a value', () => {
    const wrapper = shallowMount(CInputText, {
      props: {
        value: 'Value',
      },
    });

    expect(wrapper.vm.value).to.equal('Value');
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
      props: { rules: [{ validator: () => false, message: 'Message' }] },
    });

    expect(wrapper.get('.feedback').text()).to.equal('Message');
  });

  it('feedback does not render for valid rules', async () => {
    const wrapper = shallowMount(CInputText, {
      props: { rules: [{ validator: () => true, message: 'Message' }] },
    });

    expect(wrapper.find('.feedback').exists()).to.equal(false);
  });
});
