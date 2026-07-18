/* eslint-disable vue/one-component-per-file -- The extra components are render-only test stubs. */
import { defineComponent, h } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import UrlParser from './url-parser.vue';

const CardStub = defineComponent({
  setup(_, { slots }) {
    return () => h('section', slots.default?.());
  },
});

const UrlInputStub = defineComponent({
  props: {
    value: {
      type: String,
      default: '',
    },
  },
  emits: ['update:value'],
  setup(props, { emit }) {
    return () => h('input', {
      'data-test-id': 'url-source',
      'value': props.value,
      'onInput': (event: Event) => emit('update:value', (event.target as HTMLInputElement).value),
    });
  },
});

const CopyableStub = defineComponent({
  props: {
    label: {
      type: String,
      default: undefined,
    },
    value: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    return () => h('output', { 'data-label': props.label }, props.value);
  },
});

describe('url-parser', () => {
  it('renders every repeated query value and the fragment', async () => {
    const wrapper = mount(UrlParser, {
      global: {
        stubs: {
          CCard: CardStub,
          CInputText: UrlInputStub,
          IconMdiArrowRightBottom: true,
          InputCopyable: CopyableStub,
          NDivider: true,
        },
      },
    });

    await wrapper.get('[data-test-id="url-source"]').setValue(
      'https://example.com/path?tag=first&tag=second&tag=#results',
    );

    const outputs = wrapper.findAll('output');
    const fragment = outputs.find(output => output.attributes('data-label') === 'Fragment');
    const queryValues = outputs
      .filter(output => output.attributes('data-label') === undefined)
      .map(output => output.text());

    expect(fragment?.text()).toBe('#results');
    expect(queryValues).toEqual(['tag', 'first', 'tag', 'second', 'tag', '']);
  });
});
