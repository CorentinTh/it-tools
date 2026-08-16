/* eslint-disable vue/one-component-per-file -- Small render-only stubs keep the DOM-count assertions precise. */
import { defineComponent, h } from 'vue';
import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import emojiUnicodeData from 'unicode-emoji-json';
import { EMOJI_PAGE_SIZE, createEmojiCatalog } from './emoji-picker.model';
import type { EmojiInfo } from './emoji.types';
import EmojiPicker from './emoji-picker.vue';

const mocks = vi.hoisted(() => ({
  cancel: vi.fn(),
  dispose: vi.fn(),
  search: vi.fn(),
}));

vi.mock('./emoji-picker.worker-client', () => ({
  createEmojiSearchWorkerClient: () => mocks,
}));

const emojiCatalog = createEmojiCatalog(emojiUnicodeData);

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
    vi.useFakeTimers();
    mocks.cancel.mockClear();
    mocks.dispose.mockClear();
    mocks.search.mockReset();
    mocks.search.mockImplementation(async (query: string) => {
      const values = query === 'test-only-celebration-keyword'
        ? ['🎉']
        : emojiCatalog
          .filter(info => info.emoji === query || info.name.toLowerCase().includes(query.toLowerCase()))
          .map(info => info.emoji);
      return { elapsedMs: 1, value: values };
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders one bounded page and progressively adds another page', async () => {
    const wrapper = mountPicker();

    expect(wrapper.findAll('[data-test-id="emoji-card"]')).toHaveLength(EMOJI_PAGE_SIZE);
    expect(wrapper.get('[data-test-id="emoji-result-status"]').text()).toBe(`Showing ${EMOJI_PAGE_SIZE} of 1870 emojis`);
    expect(mocks.search).not.toHaveBeenCalled();

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
    await vi.advanceTimersByTimeAsync(150);
    await flushPromises();
    expect(wrapper.findAll('[data-test-id="emoji-card"]')).toHaveLength(1);
    expect(wrapper.get('[data-test-id="emoji-card"]').attributes('data-emoji')).toBe('🇺🇳');
  });

  it('starts the isolated search worker only after search starts', async () => {
    const wrapper = mountPicker();

    await wrapper.get('[data-test-id="emoji-search"]').setValue('test-only-celebration-keyword');
    await vi.advanceTimersByTimeAsync(150);
    await flushPromises();

    expect(mocks.search).toHaveBeenCalledWith('test-only-celebration-keyword');
    expect(wrapper.get('[data-test-id="emoji-card"]').attributes('data-emoji')).toBe('🎉');
  });

  it('keeps Fuse relevance results in one ranked grid instead of regrouping them by category', async () => {
    const wrapper = mountPicker();

    await wrapper.get('[data-test-id="emoji-search"]').setValue('face');
    await vi.advanceTimersByTimeAsync(150);
    await flushPromises();

    expect(wrapper.findAll('[data-test-id="emoji-grid"]')).toHaveLength(1);
    expect(wrapper.findAll('[data-test-id="emoji-card"]')).toHaveLength(EMOJI_PAGE_SIZE);
  });
});
