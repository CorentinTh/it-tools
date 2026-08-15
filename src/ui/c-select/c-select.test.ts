import { beforeEach, describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import CSelect from './c-select.vue';

describe('CSelect', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('exposes a labelled combobox and listbox contract', async () => {
    const wrapper = mount(CSelect, {
      props: {
        label: 'Sort order',
        options: ['Alpha', 'Beta'],
        value: 'Alpha',
      },
    });
    const combobox = wrapper.get('.c-select-input');

    expect(combobox.attributes('role')).toBe('combobox');
    expect(combobox.attributes('aria-label')).toBe('Sort order');
    expect(combobox.attributes('aria-expanded')).toBe('false');
    expect(combobox.attributes('aria-controls')).toBeTruthy();

    await combobox.trigger('click');

    expect(combobox.attributes('aria-expanded')).toBe('true');
    expect(wrapper.get('.c-select-dropdown').attributes('role')).toBe('listbox');
    const options = wrapper.findAll('[role="option"]');
    expect(options).toHaveLength(2);
    expect(options[0].attributes('aria-selected')).toBe('true');
    expect(options[1].attributes('aria-selected')).toBe('false');
  });

  it('does not open or emit while disabled', async () => {
    const wrapper = mount(CSelect, {
      props: {
        disabled: true,
        label: 'Disabled select',
        options: ['Alpha', 'Beta'],
      },
    });
    const combobox = wrapper.get('.c-select-input');

    expect(combobox.attributes('aria-disabled')).toBe('true');
    expect(combobox.attributes('tabindex')).toBe('-1');

    await combobox.trigger('click');
    await combobox.trigger('keydown', { key: 'Enter' });
    await combobox.trigger('keydown', { key: 'ArrowDown' });

    expect(combobox.attributes('aria-expanded')).toBe('false');
    expect(wrapper.emitted('update:value')).toBeUndefined();
  });

  it('navigates the filtered options instead of the unfiltered collection', async () => {
    const wrapper = mount(CSelect, {
      props: {
        searchable: true,
        label: 'Environment',
        options: ['Development', 'Staging', 'Production'],
      },
    });
    const combobox = wrapper.get('.c-select-input');

    await combobox.trigger('click');
    await wrapper.get('.search-input').setValue('Production');
    await combobox.trigger('keydown', { key: 'ArrowDown' });
    await combobox.trigger('keydown', { key: 'Enter' });

    expect(wrapper.emitted('update:value')).toEqual([['Production']]);
    expect(combobox.attributes('aria-expanded')).toBe('false');
  });

  it('keeps an empty filtered result safe for keyboard activation', async () => {
    const wrapper = mount(CSelect, {
      props: {
        searchable: true,
        label: 'Environment',
        options: ['Development'],
      },
    });
    const combobox = wrapper.get('.c-select-input');

    await combobox.trigger('click');
    await wrapper.get('.search-input').setValue('missing');
    await combobox.trigger('keydown', { key: 'ArrowDown' });
    await combobox.trigger('keydown', { key: 'Enter' });

    expect(wrapper.emitted('update:value')).toBeUndefined();
    expect(combobox.attributes('aria-expanded')).toBe('true');
  });
});
