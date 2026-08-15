import { beforeEach, describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import CButtonsSelect from './c-buttons-select.vue';

describe('CButtonsSelect', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('exposes a labelled single-choice radiogroup', () => {
    const wrapper = mount(CButtonsSelect, {
      props: {
        label: 'Output format',
        options: ['JSON', 'YAML'],
        value: 'JSON',
      },
    });

    expect(wrapper.get('[role="radiogroup"]').attributes('aria-label')).toBe('Output format');
    const radios = wrapper.findAll('[role="radio"]');
    expect(radios).toHaveLength(2);
    expect(radios[0].attributes('aria-checked')).toBe('true');
    expect(radios[0].attributes('tabindex')).toBe('0');
    expect(radios[1].attributes('aria-checked')).toBe('false');
    expect(radios[1].attributes('tabindex')).toBe('-1');
  });

  it('moves and selects with arrow keys', async () => {
    const wrapper = mount(CButtonsSelect, {
      attachTo: document.body,
      props: {
        label: 'Output format',
        options: ['JSON', 'YAML', 'TOML'],
        value: 'JSON',
      },
    });
    const radios = wrapper.findAll('[role="radio"]');

    await radios[0].trigger('keydown', { key: 'ArrowRight' });

    expect(wrapper.emitted('update:value')).toEqual([['YAML']]);
    expect(document.activeElement).toBe(radios[1].element);
    wrapper.unmount();
  });
});
