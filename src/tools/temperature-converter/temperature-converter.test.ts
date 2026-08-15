import { shallowMount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { describe, expect, it } from 'vitest';
import TemperatureConverter from './temperature-converter.vue';
import { type TemperatureScale, temperatureBounds, temperatureScales } from './temperature-converter.models';
import CInputNumber from '@/ui/c-input-number/c-input-number.vue';

function mountTemperatureConverter() {
  const wrapper = shallowMount(TemperatureConverter, {
    global: {
      renderStubDefaultSlot: true,
    },
  });

  const inputFor = (scale: TemperatureScale) => {
    const input = wrapper
      .findAllComponents(CInputNumber)
      .find(component => component.attributes('data-testid') === `temperature-${scale}`);

    if (!input) {
      throw new Error(`Temperature input not found for ${scale}`);
    }

    return input;
  };

  return { inputFor, wrapper };
}

describe('temperature-converter component', () => {
  it('configures the physical min/max constraint for every input', () => {
    const { inputFor } = mountTemperatureConverter();

    for (const scale of temperatureScales) {
      for (const bound of ['min', 'max'] as const) {
        const expected = temperatureBounds[scale][bound];
        const actual = inputFor(scale).attributes(bound);
        if (expected === undefined) {
          expect(actual).toBeUndefined();
        }
        else {
          expect(Number(actual)).toBe(expected);
        }
      }
    }
  });

  it('shows the exact per-scale values for the initial 0 Kelvin', () => {
    const { inputFor } = mountTemperatureConverter();

    expect(inputFor('kelvin').props('value')).toBe(0);
    expect(inputFor('celsius').props('value')).toBe(-273.15);
    expect(inputFor('fahrenheit').props('value')).toBe(-459.67);
    expect(inputFor('rankine').props('value')).toBe(0);
    expect(inputFor('delisle').props('value')).toBe(559.725);
    expect(inputFor('newton').props('value')).toBe(-90.1395);
    expect(inputFor('reaumur').props('value')).toBe(-218.52);
    expect(inputFor('romer').props('value')).toBe(-135.90375);
  });

  it('updates other scales with correct rounding and ignores an invalid source', async () => {
    const { inputFor } = mountTemperatureConverter();

    inputFor('celsius').vm.$emit('update:value', 0);
    await nextTick();
    expect(inputFor('kelvin').props('value')).toBe(273.15);

    inputFor('celsius').vm.$emit('update:value', -273.16);
    await nextTick();
    expect(inputFor('kelvin').props('value')).toBe(273.15);
  });
});
