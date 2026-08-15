import { beforeEach, describe, expect, it } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import FormatTransformer from './FormatTransformer.vue';
import CInputText from '@/ui/c-input-text/c-input-text.vue';

describe('FormatTransformer layout contract', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('uses one wide paired workbench with a stable large input area', () => {
    const wrapper = shallowMount(FormatTransformer, {
      props: {
        inputDefault: '<root><value>1</value></root>',
        transformer: (value: string) => value,
      },
    });
    const input = wrapper.getComponent(CInputText);

    expect(wrapper.get('.c-tool-workbench').classes()).toContain('c-tool-stack');
    expect(wrapper.findAll('.c-tool-panel')).toHaveLength(2);
    expect(input.props('rows')).toBe('20');
    expect(input.props('autosize')).toBe(false);
  });
});
