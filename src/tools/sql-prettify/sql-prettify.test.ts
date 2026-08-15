import { shallowMount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it } from 'vitest';
import SqlPrettify from './sql-prettify.vue';

describe('SQL prettify layout contract', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('keeps the formatter options compact and stacks two wide editor panels', () => {
    const wrapper = shallowMount(SqlPrettify);

    expect(wrapper.get('.c-tool-workbench').classes()).toContain('c-tool-stack');
    expect(wrapper.get('section').attributes('aria-label')).toBe('Formatting options');
    expect(wrapper.findAll('.c-tool-panel')).toHaveLength(2);
  });
});
