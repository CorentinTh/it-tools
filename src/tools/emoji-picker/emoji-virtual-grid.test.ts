import emojiUnicodeData from 'unicode-emoji-json';
import { defineComponent, h } from 'vue';
import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createEmojiCatalog } from './emoji-picker.model';
import type { EmojiInfo } from './emoji.types';
import EmojiVirtualGrid from './emoji-virtual-grid.vue';

const catalog = createEmojiCatalog(emojiUnicodeData);

const CardStub = defineComponent({
  props: {
    emojiInfo: { type: Object as () => EmojiInfo, required: true },
    position: { type: Number, required: true },
    total: { type: Number, required: true },
    virtualIndex: { type: Number, required: true },
  },
  setup(props) {
    return () => h('div', {
      'aria-posinset': props.position,
      'aria-setsize': props.total,
      'data-test-id': 'emoji-card',
      'role': 'listitem',
    }, [h('button', {
      'data-emoji-index': props.virtualIndex,
    }, props.emojiInfo.emoji)]);
  },
});

function mountGrid() {
  return mount(EmojiVirtualGrid, {
    props: { emojiInfos: catalog, resetKey: 'initial', showGroupHeaders: false },
    global: { stubs: { EmojiCard: CardStub } },
    attachTo: document.body,
  });
}

afterEach(() => {
  vi.restoreAllMocks();
  document.body.innerHTML = '';
});

describe('emoji virtual grid', () => {
  it('mounts only a bounded viewport window and replaces it after scrolling', async () => {
    vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(1_280);
    vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(504);
    const wrapper = mountGrid();
    await flushPromises();

    const initialCards = wrapper.findAll('[data-test-id="emoji-card"]');
    expect(initialCards.length).toBeGreaterThan(0);
    expect(initialCards.length).toBeLessThan(100);
    expect(initialCards[0].attributes('aria-posinset')).toBe('1');
    expect(initialCards[0].attributes('aria-setsize')).toBe('1914');

    const viewport = wrapper.get('[data-test-id="emoji-virtual-viewport"]');
    (viewport.element as HTMLElement).scrollTop = 5_000;
    await viewport.trigger('scroll');

    expect(Number(wrapper.get('[data-test-id="emoji-card"]').attributes('aria-posinset'))).toBeGreaterThan(300);
    expect(wrapper.findAll('[data-test-id="emoji-card"]').length).toBeLessThan(100);
  });

  it('uses arrow/Home/End navigation across unmounted rows', async () => {
    vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(1_280);
    vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(504);
    const wrapper = mountGrid();
    await flushPromises();

    const first = wrapper.get('[data-emoji-index="0"]');
    (first.element as HTMLElement).focus();
    await first.trigger('keydown', { key: 'End' });
    await flushPromises();

    expect(document.activeElement?.getAttribute('data-emoji-index')).toBe('1913');
    await wrapper.get('[data-emoji-index="1913"]').trigger('keydown', { key: 'Home' });
    await flushPromises();
    expect(document.activeElement?.getAttribute('data-emoji-index')).toBe('0');
  });
});
