import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { describe, expect, it } from 'vitest';
import CField from './c-field.vue';

describe('CField', () => {
  it('associates its label and exposes description/error ids to the control', () => {
    // eslint-disable-next-line vue/one-component-per-file
    const harness = defineComponent({
      setup: () => () => h(CField, {
        id: 'email-field',
        label: 'Email',
        labelFor: 'email',
        description: 'Used only for this operation.',
        feedback: 'Enter a valid email.',
        status: 'error',
        required: true,
      }, {
        default: ({ describedBy, invalid }: { describedBy?: string; invalid: boolean }) => h('input', {
          'id': 'email',
          'aria-describedby': describedBy,
          'aria-invalid': String(invalid),
        }),
      }),
    });
    const wrapper = mount(harness);

    expect(wrapper.get('label').attributes('for')).toBe('email');
    expect(wrapper.get('label').attributes('id')).toBe('email-field-label');
    expect(wrapper.get('input').attributes('aria-describedby'))
      .toBe('email-field-description email-field-feedback');
    expect(wrapper.get('input').attributes('aria-invalid')).toBe('true');
    expect(wrapper.get('#email-field-feedback').attributes('role')).toBe('alert');
    expect(wrapper.get('.sr-only').text()).toBe('required');
  });

  it('supports optional, disabled, responsive-left, and reserved feedback states', () => {
    // eslint-disable-next-line vue/one-component-per-file
    const harness = defineComponent({
      setup: () => () => h(CField, {
        label: 'Alias',
        optional: true,
        disabled: true,
        reserveFeedback: true,
        labelPosition: 'left',
        labelWidth: '120px',
      }, { default: () => h('input') }),
    });
    const wrapper = mount(harness);

    expect(wrapper.classes()).toContain('c-field--left');
    expect(wrapper.attributes('aria-disabled')).toBe('true');
    expect(wrapper.attributes('style')).toContain('--c-field-label-width: 120px');
    expect(wrapper.get('.c-field__optional').text()).toBe('(optional)');
    expect(wrapper.get('.c-field__feedback').classes()).toContain('c-field__feedback--reserved');
  });
});
