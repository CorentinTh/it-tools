import { mount } from '@vue/test-utils';
import emojiUnicodeData from 'unicode-emoji-json';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createEmojiCatalog } from './emoji-picker.model';
import EmojiCard from './emoji-card.vue';
import emojiCardSource from './emoji-card.vue?raw';

const mocks = vi.hoisted(() => ({
  copy: vi.fn(),
}));

vi.mock('@/composable/copy', () => ({
  useCopy: () => ({ copy: mocks.copy }),
}));

const familyCatalog = createEmojiCatalog({
  '👨‍👩‍👧‍👦': emojiUnicodeData['👨‍👩‍👧‍👦'],
});

describe('emoji card', () => {
  beforeEach(() => {
    mocks.copy.mockReset();
  });

  it('uses keyboard-native buttons and copies complete complex sequences', async () => {
    const wrapper = mount(EmojiCard, {
      props: { emojiInfo: familyCatalog[0] },
      global: {
        stubs: {
          CCard: { template: '<article><slot /></article>' },
        },
      },
    });
    const buttons = wrapper.findAll('button');

    expect(buttons).toHaveLength(3);
    expect(buttons.every(button => button.attributes('type') === 'button')).toBe(true);

    await buttons[0].trigger('click');
    await buttons[1].trigger('click');
    await buttons[2].trigger('click');

    expect(mocks.copy.mock.calls.map(([value]) => value)).toEqual([
      '👨‍👩‍👧‍👦',
      '0x1f468 0x200d 0x1f469 0x200d 0x1f467 0x200d 0x1f466',
      '\\ud83d\\udc68\\u200d\\ud83d\\udc69\\u200d\\ud83d\\udc67\\u200d\\ud83d\\udc66',
    ]);
  });

  it('does not reset the symbol-size utility with a font shorthand', () => {
    const style = emojiCardSource.match(/<style scoped>([\s\S]*?)<\/style>/)?.[1] ?? '';

    expect(style).toContain('font-family: inherit');
    expect(style).not.toMatch(/(^|[;{]\s*)font\s*:/m);
  });
});
