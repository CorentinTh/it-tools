/* eslint-disable vue/one-component-per-file -- Small render-only stubs keep the DOM-count assertions precise. */
import { defineComponent, h } from 'vue';
import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { EMOJI_PAGE_SIZE } from './emoji-picker.model';
import type { EmojiInfo } from './emoji.types';
import EmojiPicker from './emoji-picker.vue';

const mocks = vi.hoisted(() => ({
  keywordModuleLoaded: vi.fn(),
}));

vi.mock('emojilib', () => {
  mocks.keywordModuleLoaded();

  return {
    default: {
      '🎉': ['test-only-celebration-keyword'],
    },
  };
});

const InputStub = defineComponent({
  inheritAttrs: false,
  props: {
    value: { type: String, default: '' },
    testId: { type: String, default: undefined },
  },
  emits: ['update:value'],
  setup(props, { emit }) {
    return () => h('input', {
      'data-test-id': props.testId,
      'value': props.value,
      'onInput': (event: Event) => emit('update:value', (event.target as HTMLInputElement).value),
    });
  },
});

const ButtonStub = defineComponent({
  inheritAttrs: false,
  emits: ['click'],
  setup(_, { attrs, emit, slots }) {
    return () => h('button', {
      ...attrs,
      onClick: (event: MouseEvent) => emit('click', event),
    }, slots.default?.());
  },
});

const GridStub = defineComponent({
  props: {
    emojiInfos: { type: Array as () => EmojiInfo[], default: () => [] },
  },
  setup(props) {
    return () => h('div', { 'data-test-id': 'emoji-grid' }, props.emojiInfos.map(emojiInfo => h('span', {
      'data-test-id': 'emoji-card',
      'data-emoji': emojiInfo.emoji,
    }, emojiInfo.title)));
  },
});

function mountPicker() {
  return mount(EmojiPicker, {
    global: {
      stubs: {
        CButton: ButtonStub,
        CInputText: InputStub,
        EmojiGrid: GridStub,
        IconMdiSearch: true,
      },
    },
  });
}

describe('emoji picker component', () => {
  beforeEach(() => {
    mocks.keywordModuleLoaded.mockClear();
  });

  it('renders one bounded page and progressively adds another page', async () => {
    const wrapper = mountPicker();

    expect(wrapper.findAll('[data-test-id="emoji-card"]')).toHaveLength(EMOJI_PAGE_SIZE);
    expect(wrapper.get('[data-test-id="emoji-result-status"]').text()).toBe(`Showing ${EMOJI_PAGE_SIZE} of 1870 emojis`);
    expect(mocks.keywordModuleLoaded).not.toHaveBeenCalled();

    await wrapper.get('[data-test-id="emoji-load-more"]').trigger('click');

    expect(wrapper.findAll('[data-test-id="emoji-card"]')).toHaveLength(EMOJI_PAGE_SIZE * 2);
  });

  it('resets the progressive page after category and query changes', async () => {
    const wrapper = mountPicker();

    await wrapper.get('[data-test-id="emoji-load-more"]').trigger('click');
    expect(wrapper.findAll('[data-test-id="emoji-card"]')).toHaveLength(EMOJI_PAGE_SIZE * 2);

    await wrapper.get('[data-test-id="emoji-category"]').setValue('Flags');
    expect(wrapper.findAll('[data-test-id="emoji-card"]')).toHaveLength(EMOJI_PAGE_SIZE);
    expect(wrapper.findAll('[data-test-id="emoji-card"]').every(card => card.attributes('data-emoji'))).toBe(true);

    await wrapper.get('[data-test-id="emoji-search"]').setValue('United Nations');
    expect(wrapper.findAll('[data-test-id="emoji-card"]')).toHaveLength(1);
    expect(wrapper.get('[data-test-id="emoji-card"]').attributes('data-emoji')).toBe('🇺🇳');
  });

  it('loads optional synonym metadata only after search starts', async () => {
    const wrapper = mountPicker();

    await wrapper.get('[data-test-id="emoji-search"]').setValue('test-only-celebration-keyword');
    await flushPromises();

    expect(wrapper.get('[data-test-id="emoji-card"]').attributes('data-emoji')).toBe('🎉');
  });

  it('keeps Fuse relevance results in one ranked grid instead of regrouping them by category', async () => {
    const wrapper = mountPicker();

    await wrapper.get('[data-test-id="emoji-search"]').setValue('face');
    await flushPromises();

    expect(wrapper.findAll('[data-test-id="emoji-grid"]')).toHaveLength(1);
    expect(wrapper.findAll('[data-test-id="emoji-card"]')).toHaveLength(EMOJI_PAGE_SIZE);
  });
});
