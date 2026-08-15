import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import { nextTick } from 'vue';
import TextareaCopyable from './TextareaCopyable.vue';
import { MAX_HIGHLIGHTED_OUTPUT_BYTES } from './TextareaCopyable.model';

vi.mock('@/composable/copy', () => ({
  useCopy: () => ({
    copy: vi.fn(),
    isJustCopied: { value: false },
  }),
}));

let resizeCallback: ResizeObserverCallback | undefined;
let observedElement: Element | undefined;

class ResizeObserverMock implements ResizeObserver {
  constructor(callback: ResizeObserverCallback) {
    resizeCallback = callback;
  }

  observe(target: Element) {
    observedElement = target;
  }

  disconnect() {}

  unobserve() {}
}

describe('TextareaCopyable', () => {
  beforeEach(() => {
    vi.stubGlobal('ResizeObserver', ResizeObserverMock);
    window.ResizeObserver = ResizeObserverMock;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    resizeCallback = undefined;
    observedElement = undefined;
  });

  it.each([
    ['top-right', true, false, '10px', undefined],
    ['bottom-right', true, false, undefined, '10px'],
    ['outside', false, true, undefined, undefined],
    ['none', false, false, undefined, undefined],
  ] as const)(
    'enforces the %s copy placement',
    (copyPlacement, hasOverlay, hasOutside, top, bottom) => {
      const wrapper = shallowMount(TextareaCopyable, {
        props: { value: 'result', copyPlacement },
        global: { renderStubDefaultSlot: true },
      });

      const overlay = wrapper.find('[data-test-id="copy-overlay"]');
      expect(overlay.exists()).toBe(hasOverlay);
      expect(wrapper.find('[data-test-id="copy-outside"]').exists()).toBe(hasOutside);

      if (hasOverlay) {
        const overlayStyle = (overlay.element as HTMLElement).style;
        expect(overlayStyle.top || undefined).toBe(top);
        expect(overlayStyle.bottom || undefined).toBe(bottom);
      }
    },
  );

  it('does not render a copy action for an empty value', () => {
    const wrapper = shallowMount(TextareaCopyable, {
      props: { value: '', copyPlacement: 'outside' },
      global: { renderStubDefaultSlot: true },
    });

    expect(wrapper.find('[data-test-id="copy-overlay"]').exists()).toBe(false);
    expect(wrapper.find('[data-test-id="copy-outside"]').exists()).toBe(false);
  });

  it('starts observing a follow-height element that appears after setup', async () => {
    const wrapper = shallowMount(TextareaCopyable, {
      props: { value: 'result', followHeightOf: null },
      global: { renderStubDefaultSlot: true },
    });
    const target = document.createElement('div');

    await wrapper.setProps({ followHeightOf: target });
    await nextTick();

    expect(observedElement).toBe(target);

    resizeCallback?.([
      {
        contentBoxSize: [{ blockSize: 120, inlineSize: 300 }],
        target,
      } as unknown as ResizeObserverEntry,
    ], {} as ResizeObserver);
    await nextTick();

    expect(wrapper.get('scrollbar-stub').attributes('style')).toContain('min-height: 90px');
  });

  it('uses one readonly native text control instead of highlighted markup for large output', () => {
    const value = 'x'.repeat(MAX_HIGHLIGHTED_OUTPUT_BYTES + 1);
    const wrapper = shallowMount(TextareaCopyable, {
      props: { value, language: 'json' },
      global: { renderStubDefaultSlot: true },
    });

    expect(wrapper.find('code-stub').exists()).toBe(false);
    expect(wrapper.get('[data-test-id="large-output-notice"]').text()).toContain('preview is limited');
    const output = wrapper.get('textarea[data-test-id="area-content"]');
    expect((output.element as HTMLTextAreaElement).value).toBe(value.slice(0, MAX_HIGHLIGHTED_OUTPUT_BYTES));
    expect(output.attributes('readonly')).toBeDefined();
  });

  it('does not split a Unicode scalar at the bounded preview edge', () => {
    const value = `${'x'.repeat(MAX_HIGHLIGHTED_OUTPUT_BYTES - 1)}🙂tail`;
    const wrapper = shallowMount(TextareaCopyable, {
      props: { value, language: 'json' },
      global: { renderStubDefaultSlot: true },
    });

    expect((wrapper.get('textarea[data-test-id="area-content"]').element as HTMLTextAreaElement).value)
      .toBe('x'.repeat(MAX_HIGHLIGHTED_OUTPUT_BYTES - 1));
    expect(wrapper.find('[data-test-id="copy-overlay"]').exists()).toBe(true);
  });

  it('supports a smaller degraded preview while retaining the complete copy source', () => {
    const value = 'x'.repeat(MAX_HIGHLIGHTED_OUTPUT_BYTES + 1);
    const wrapper = shallowMount(TextareaCopyable, {
      props: { value, language: 'sql', largePreviewBytes: 16 * 1024 },
      global: { renderStubDefaultSlot: true },
    });

    expect((wrapper.get('textarea[data-test-id="area-content"]').element as HTMLTextAreaElement).value)
      .toHaveLength(16 * 1024);
    expect(wrapper.get('[data-test-id="large-output-notice"]').text()).toContain('16,384 bytes');
  });

  it('keeps syntax highlighting at the exact byte boundary', () => {
    const wrapper = shallowMount(TextareaCopyable, {
      props: { value: 'x'.repeat(MAX_HIGHLIGHTED_OUTPUT_BYTES), language: 'json' },
      global: { renderStubDefaultSlot: true },
    });

    expect(wrapper.find('[data-test-id="large-output-notice"]').exists()).toBe(false);
    expect(wrapper.get('code-stub').attributes('code')).toHaveLength(MAX_HIGHLIGHTED_OUTPUT_BYTES);
  });
});
