import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import CColorPicker from './c-color-picker.vue';

describe('CColorPicker', () => {
  it('labels the keyboard-focusable trigger and emits changes', async () => {
    const onUpdate = vi.fn();
    const wrapper = mount(CColorPicker, {
      props: {
        'id': 'foreground',
        'ariaLabel': 'Foreground color',
        'testId': 'foreground-picker',
        'value': '#112233ff',
        'onUpdate:value': onUpdate,
      },
    });
    await wrapper.vm.$nextTick();

    const trigger = wrapper.get('.n-color-picker-trigger');
    expect(trigger.attributes('id')).toBe('foreground');
    expect(trigger.attributes('aria-label')).toBe('Foreground color');
    expect(trigger.attributes('role')).toBe('button');
    expect(trigger.attributes('aria-haspopup')).toBe('dialog');
    expect(trigger.attributes('tabindex')).toBe('0');
    expect(wrapper.attributes('data-test-id')).toBe('foreground-picker');

    wrapper.findComponent({ name: 'ColorPicker' }).vm.$emit('update:value', '#445566ff');
    expect(onUpdate).toHaveBeenCalledWith('#445566ff');

    const click = vi.spyOn(trigger.element as HTMLElement, 'click');
    await trigger.trigger('keydown', { key: 'Enter' });
    expect(click).toHaveBeenCalledOnce();
  });
});
