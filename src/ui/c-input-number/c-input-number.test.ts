import { mount } from '@vue/test-utils';
import { defineComponent, h, ref } from 'vue';
import { describe, expect, it, vi } from 'vitest';
import CInputNumber from './c-input-number.vue';

describe('CInputNumber', () => {
  it('puts identity and accessible state on the native input', async () => {
    // eslint-disable-next-line vue/one-component-per-file
    const harness = defineComponent({
      setup: () => () => h(CInputNumber, {
        id: 'quantity',
        testId: 'quantity-control',
        ariaLabel: 'Quantity',
        ariaDescribedby: 'quantity-help',
        ariaInvalid: true,
        min: 1,
        max: 100,
        value: 12,
      }),
    });
    const wrapper = mount(harness);
    await wrapper.vm.$nextTick();

    const input = wrapper.get('input');
    expect(input.attributes('id')).toBe('quantity');
    expect(input.attributes('aria-label')).toBe('Quantity');
    expect(input.attributes('aria-describedby')).toBe('quantity-help');
    expect(input.attributes('aria-invalid')).toBe('true');
    expect(input.attributes('role')).toBe('spinbutton');
    expect(input.attributes('aria-valuemin')).toBe('1');
    expect(input.attributes('aria-valuemax')).toBe('100');
    expect(input.attributes('aria-valuenow')).toBe('12');
    expect(wrapper.attributes('data-test-id')).toBe('quantity-control');
    const [decreaseButton, increaseButton] = wrapper.findAll('button');
    expect(decreaseButton.attributes('aria-label')).toBe('Decrease Quantity');
    expect(increaseButton.attributes('aria-label')).toBe('Increase Quantity');
  });

  it('emits numeric updates while typing without waiting for blur', async () => {
    const onUpdate = vi.fn();
    // eslint-disable-next-line vue/one-component-per-file
    const harness = defineComponent({
      setup: () => () => h(CInputNumber, {
        'value': 1,
        'onUpdate:value': onUpdate,
      }),
    });
    const wrapper = mount(harness);

    await wrapper.get('input').setValue('12');

    expect(onUpdate).toHaveBeenLastCalledWith(12);
  });

  it('exposes focus for dynamic numeric collections', async () => {
    const control = ref<{ focus: () => void }>();
    // eslint-disable-next-line vue/one-component-per-file
    const harness = defineComponent({
      setup: () => () => h(CInputNumber, { ref: control }),
    });
    const wrapper = mount(harness, { attachTo: document.body });
    await wrapper.vm.$nextTick();

    control.value?.focus();
    expect(document.activeElement).toBe(wrapper.get('input').element);
    wrapper.unmount();
  });
});
