/* eslint-disable vue/one-component-per-file -- Render-only stubs exercise v-model and shadow-root behavior. */
import { defineComponent, h } from 'vue';
import { flushPromises, shallowMount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import RegexTester from './regex-tester.vue';

const mocks = vi.hoisted(() => ({
  renderDiagram: vi.fn(),
  regexQuery: { __v_isRef: true, value: '' },
}));

vi.mock('@regexper/render', () => ({
  render: mocks.renderDiagram,
}));

vi.mock('naive-ui', async () => {
  const actual = await vi.importActual<typeof import('naive-ui')>('naive-ui');

  return {
    ...actual,
    useThemeVars: () => ({ value: { errorColor: '#d03050' } }),
  };
});

vi.mock('vue-router', () => ({
  onBeforeRouteLeave: vi.fn(),
}));

vi.mock('@/composable/queryParams', () => ({
  useQueryParam: () => mocks.regexQuery,
}));

vi.mock('./regex-tester.worker-client', () => ({
  RegexWorkerClient: class {
    cancel(): void {}

    dispose(): void {}

    run(task: { operation: string }) {
      return task.operation === 'sample'
        ? Promise.resolve({ value: '', elapsedMs: 0 })
        : Promise.resolve({ value: { matches: [], truncated: false }, elapsedMs: 0 });
    }
  },
}));

const ShadowRootStub = defineComponent({
  setup(_, { slots }) {
    return () => h('div', slots.default?.());
  },
});

const RegexInputStub = defineComponent({
  props: {
    value: { type: String, default: '' },
  },
  emits: ['update:value'],
  setup(props, { emit }) {
    return () => h('input', {
      value: props.value,
      onInput: (event: Event) => emit('update:value', (event.target as HTMLInputElement).value),
    });
  },
});

describe('regex tester diagram lifecycle', () => {
  beforeEach(() => {
    mocks.renderDiagram.mockReset();
    mocks.regexQuery.value = '';
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('imports an explicit query pattern without writing edited content back to history', async () => {
    vi.useFakeTimers();
    mocks.regexQuery.value = 'shared-pattern';

    const wrapper = shallowMount(RegexTester, {
      global: {
        renderStubDefaultSlot: true,
        stubs: {
          CInputText: RegexInputStub,
          RouterLink: true,
          ShadowRoot: ShadowRootStub,
        },
      },
    });
    const input = wrapper.get('input');

    expect((input.element as HTMLInputElement).value).toBe('shared-pattern');
    await input.setValue('private-pattern');
    await flushPromises();
    vi.advanceTimersByTime(1_000);
    await flushPromises();

    expect(mocks.regexQuery.value).toBe('shared-pattern');
    wrapper.unmount();
  });

  it('keeps DOM diagram rendering single-flight until the renderer settles', async () => {
    let finishRendering: (() => void) | undefined;
    mocks.renderDiagram.mockImplementation(() => new Promise<void>((resolve) => {
      finishRendering = resolve;
    }));

    const wrapper = shallowMount(RegexTester, {
      global: {
        renderStubDefaultSlot: true,
        stubs: {
          RouterLink: true,
          ShadowRoot: ShadowRootStub,
        },
      },
    });
    const button = wrapper.get('[data-test-id="regex-diagram-run"]');

    await button.trigger('click');
    await flushPromises();

    expect(mocks.renderDiagram).toHaveBeenCalledTimes(1);
    expect(button.attributes('disabled')).toBe('true');
    expect(button.text()).toBe('Rendering diagram…');

    await button.trigger('click');
    await flushPromises();
    expect(mocks.renderDiagram).toHaveBeenCalledTimes(1);

    finishRendering?.();
    await flushPromises();

    expect(button.attributes('disabled')).toBe('false');
    expect(button.text()).toBe('Render diagram');
    wrapper.unmount();
  });
});
