import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import CSlider from './c-slider.vue';

describe('CSlider', () => {
  it('publishes an accessible single-value slider handle', async () => {
    const wrapper = mount(CSlider, {
      props: {
        id: 'paragraphs',
        label: 'Paragraphs',
        value: 4,
        min: 1,
        max: 20,
        testId: 'paragraphs-slider',
      },
    });
    await wrapper.vm.$nextTick();

    const handle = wrapper.get('[role="slider"]');
    expect(handle.attributes('aria-labelledby')).toBe('paragraphs-field-label');
    expect(handle.attributes('aria-valuemin')).toBe('1');
    expect(handle.attributes('aria-valuemax')).toBe('20');
    expect(handle.attributes('aria-valuenow')).toBe('4');
    expect(handle.attributes('data-test-id')).toBe('paragraphs-slider');
  });

  it('distinguishes the minimum and maximum range handles', async () => {
    const wrapper = mount(CSlider, {
      props: {
        id: 'sentence-range',
        label: 'Sentences per paragraph',
        value: [3, 8],
        min: 1,
        max: 50,
        range: true,
      },
    });
    await wrapper.vm.$nextTick();

    const handles = wrapper.findAll('[role="slider"]');
    expect(handles).toHaveLength(2);
    expect(handles[0].attributes('aria-valuetext')).toBe('Minimum 3');
    expect(handles[1].attributes('aria-valuetext')).toBe('Maximum 8');
  });
});
