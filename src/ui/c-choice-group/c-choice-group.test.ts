/* eslint-disable vue/one-component-per-file -- Render harnesses verify scoped group behavior. */
import { mount } from '@vue/test-utils';
import { defineComponent, h, ref } from 'vue';
import { describe, expect, it } from 'vitest';
import CCheckbox from './c-checkbox.vue';
import CChoiceGroup from './c-choice-group.vue';

describe('choice controls', () => {
  it('exposes a labelled, described checkbox group', () => {
    const harness = defineComponent({
      setup: () => () => h(CChoiceGroup, {
        id: 'flags',
        label: 'Flags',
        description: 'Select independent matching modes.',
      }, {
        default: () => h(CCheckbox, { id: 'global', ariaLabel: 'Global search override' }, () => 'Global search'),
      }),
    });
    const wrapper = mount(harness);

    expect(wrapper.get('legend').text()).toBe('Flags');
    expect(wrapper.get('fieldset').attributes('aria-describedby')).toBe('flags-description');
    expect(wrapper.get('#flags-description').text()).toBe('Select independent matching modes.');
    expect(wrapper.get('[role="checkbox"]').attributes('aria-labelledby')).toBeTruthy();
    expect(wrapper.get('[role="checkbox"]').attributes('aria-label')).toBe('Global search override');
  });

  it('updates checked state and inherits disabled state from the group', async () => {
    const checked = ref(false);
    const harness = defineComponent({
      setup: () => () => h(CChoiceGroup, {
        label: 'Options',
        disabled: true,
      }, {
        default: () => h(CCheckbox, {
          'checked': checked.value,
          'onUpdate:checked': value => checked.value = value,
        }, () => 'Option'),
      }),
    });
    const wrapper = mount(harness);
    const checkbox = wrapper.get('[role="checkbox"]');

    expect(checkbox.attributes('aria-disabled')).toBe('true');
    expect(checkbox.attributes('tabindex')).toBeUndefined();
    await checkbox.trigger('click');
    expect(checked.value).toBe(false);
  });
});
