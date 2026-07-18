import { createPinia, setActivePinia } from 'pinia';
import { nextTick, ref } from 'vue';
import type { Ref } from 'vue';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useStyleStore } from './style.store';

let smallScreen: Ref<boolean>;
let persistedDesktopState: Ref<boolean>;

vi.mock('@vueuse/core', async () => ({
  ...await vi.importActual<typeof import('@vueuse/core')>('@vueuse/core'),
  useDark: () => ref(false),
  useMediaQuery: () => smallScreen,
  useStorage: () => persistedDesktopState,
  useToggle: () => vi.fn(),
}));

describe('style store menu state', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    smallScreen = ref(false);
    persistedDesktopState = ref(false);
  });

  it('keeps mobile menu state transient without overwriting the desktop preference', async () => {
    const store = useStyleStore();
    expect(store.isMenuCollapsed).toBe(false);

    smallScreen.value = true;
    await nextTick();
    expect(store.isMenuCollapsed).toBe(true);

    store.isMenuCollapsed = false;
    expect(store.isMenuCollapsed).toBe(false);
    expect(persistedDesktopState.value).toBe(false);

    store.isMenuCollapsed = true;
    smallScreen.value = false;
    await nextTick();

    expect(store.isMenuCollapsed).toBe(false);
    expect(persistedDesktopState.value).toBe(false);
  });

  it('restores the persisted desktop preference after a mobile round trip', async () => {
    persistedDesktopState.value = true;
    const store = useStyleStore();
    expect(store.isMenuCollapsed).toBe(true);

    smallScreen.value = true;
    await nextTick();
    store.isMenuCollapsed = false;

    smallScreen.value = false;
    await nextTick();
    expect(store.isMenuCollapsed).toBe(true);
    expect(persistedDesktopState.value).toBe(true);
  });
});
