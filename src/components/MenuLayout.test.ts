import { shallowMount } from '@vue/test-utils';
import { nextTick, reactive } from 'vue';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useRoute } from 'vue-router';
import MenuLayout from './MenuLayout.vue';
import { useStyleStore } from '@/stores/style.store';

vi.mock('vue-router', () => ({
  useRoute: vi.fn(),
}));

vi.mock('@/stores/style.store', () => ({
  useStyleStore: vi.fn(),
}));

describe('MenuLayout navigation visibility', () => {
  const route = reactive({ path: '/' });
  const styleStore = reactive({
    isMenuCollapsed: false,
    isSmallScreen: true,
  });

  beforeEach(() => {
    route.path = '/';
    styleStore.isMenuCollapsed = false;
    styleStore.isSmallScreen = true;
    vi.mocked(useRoute).mockReturnValue(route as ReturnType<typeof useRoute>);
    vi.mocked(useStyleStore).mockReturnValue(styleStore as ReturnType<typeof useStyleStore>);
  });

  it('starts collapsed on a small screen and closes again after navigation', async () => {
    const wrapper = shallowMount(MenuLayout);

    expect(styleStore.isMenuCollapsed).toBe(true);
    styleStore.isMenuCollapsed = false;
    route.path = '/json-prettify';
    await nextTick();

    expect(styleStore.isMenuCollapsed).toBe(true);
    wrapper.unmount();
  });

  it('does not change the persisted desktop state during navigation', async () => {
    styleStore.isSmallScreen = false;
    const wrapper = shallowMount(MenuLayout);

    expect(styleStore.isMenuCollapsed).toBe(false);
    route.path = '/url-parser';
    await nextTick();

    expect(styleStore.isMenuCollapsed).toBe(false);
    wrapper.unmount();
  });

  it('removes collapsed desktop navigation from the accessibility tree and tab order', async () => {
    styleStore.isSmallScreen = false;
    styleStore.isMenuCollapsed = true;
    const wrapper = shallowMount(MenuLayout, {
      global: { renderStubDefaultSlot: true },
    });
    const menu = wrapper.get('[data-test-id="tool-navigation"]');

    expect(menu.attributes('inert')).toBeDefined();
    expect(menu.attributes('aria-hidden')).toBe('true');

    styleStore.isMenuCollapsed = false;
    await nextTick();
    expect(menu.attributes('inert')).toBeUndefined();
    expect(menu.attributes('aria-hidden')).toBeUndefined();
    wrapper.unmount();
  });

  it('lets keyboard users close the small-screen overlay with Escape', async () => {
    const wrapper = shallowMount(MenuLayout, {
      attachTo: document.body,
      global: { renderStubDefaultSlot: true },
      slots: {
        sider: '<a href="#target" data-test-id="menu-link">Tool link</a>',
      },
    });
    styleStore.isMenuCollapsed = false;
    await nextTick();
    const menu = wrapper.get('[data-test-id="tool-navigation"]');
    const menuLink = wrapper.get<HTMLElement>('[data-test-id="menu-link"]');
    menuLink.element.focus();

    expect(menu.attributes('inert')).toBeUndefined();
    expect(document.activeElement).toBe(menuLink.element);

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await nextTick();

    expect(styleStore.isMenuCollapsed).toBe(true);
    expect(menu.attributes('inert')).toBeDefined();
    expect(menu.attributes('aria-hidden')).toBe('true');
    expect(wrapper.emitted('requestFocusRestore')).toHaveLength(1);
    wrapper.unmount();
  });
});
