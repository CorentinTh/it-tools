/* eslint-disable vue/one-component-per-file -- Render harnesses verify scoped field semantics. */
import { mount } from '@vue/test-utils';
import { defineComponent, h, ref } from 'vue';
import { describe, expect, it } from 'vitest';
import CSwitch from './c-switch.vue';

describe('CSwitch', () => {
  it('associates the visible label and description with the switch', () => {
    const harness = defineComponent({
      setup: () => () => h(CSwitch, {
        id: 'secure-mode',
        label: 'Secure mode',
        description: 'Applies immediately.',
      }),
    });
    const wrapper = mount(harness);
    const control = wrapper.get('[role="switch"]');

    expect(control.attributes('aria-labelledby')).toBe('secure-mode-field-label');
    expect(control.attributes('aria-describedby')).toBe('secure-mode-field-description');
    expect(wrapper.get('#secure-mode-field-label').text()).toBe('Secure mode');
  });

  it('updates through pointer and keyboard-native switch behavior', async () => {
    const value = ref(false);
    const harness = defineComponent({
      setup: () => () => h(CSwitch, {
        'label': 'Mode',
        'value': value.value,
        'onUpdate:value': checked => value.value = checked,
      }),
    });
    const wrapper = mount(harness);
    const control = wrapper.get('[role="switch"]');

    await control.trigger('click');
    expect(value.value).toBe(true);
    expect(control.attributes('aria-checked')).toBe('true');
  });
});
