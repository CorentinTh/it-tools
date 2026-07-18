import { defineComponent, h } from 'vue';
import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createMemoryHistory, createRouter } from 'vue-router';
import OfflineRouteUnavailable from './OfflineRouteUnavailable.vue';
import { clearOfflineRouteFailure, offlineRouteFailure } from './offline-route-recovery';

const ButtonStub = defineComponent({
  inheritAttrs: false,
  props: {
    disabled: { type: Boolean, default: false },
  },
  emits: ['click'],
  setup(props, { attrs, emit, slots }) {
    return () => h('button', {
      ...attrs,
      disabled: props.disabled,
      onClick: () => emit('click'),
    }, slots.default?.());
  },
});

function createTestRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: { template: '<div>Home</div>' } },
      { path: '/previous', component: { template: '<div>Previous</div>' } },
      { path: '/target', component: { template: '<div>Target</div>' } },
    ],
  });
}

afterEach(() => {
  clearOfflineRouteFailure();
  vi.restoreAllMocks();
});

describe('OfflineRouteUnavailable', () => {
  it('renders only a safe path and retries with a fresh query-free document', async () => {
    const router = createTestRouter();
    await router.push('/previous');
    const navigateDocument = vi.fn();
    const probeOrigin = vi.fn(async () => true);
    offlineRouteFailure.value = {
      displayPath: '/target',
      fullPath: '/target?private=must-not-render#secret',
      toolName: 'Target',
    };

    const wrapper = mount(OfflineRouteUnavailable, {
      props: { navigateDocument, probeOrigin },
      global: {
        plugins: [router],
        stubs: { CButton: ButtonStub },
      },
    });

    expect(wrapper.get('[data-test-id="offline-route-unavailable"]').text()).toContain('/target');
    expect(wrapper.text()).not.toContain('must-not-render');
    expect(wrapper.text()).not.toContain('secret');

    await wrapper.get('[data-test-id="retry-offline-route"]').trigger('click');
    await flushPromises();
    expect(probeOrigin).toHaveBeenCalledOnce();
    expect(navigateDocument).toHaveBeenCalledWith('/target');
    expect(navigateDocument).not.toHaveBeenCalledWith(expect.stringContaining('private'));
  });

  it('keeps recovery visible when the network interface is up but the origin probe fails', async () => {
    const router = createTestRouter();
    await router.push('/previous');
    const navigateDocument = vi.fn();
    const probeOrigin = vi.fn(async () => false);
    offlineRouteFailure.value = {
      displayPath: '/target',
      fullPath: '/target',
    };

    const wrapper = mount(OfflineRouteUnavailable, {
      props: { navigateDocument, probeOrigin },
      global: {
        plugins: [router],
        stubs: { CButton: ButtonStub },
      },
    });

    await wrapper.get('[data-test-id="retry-offline-route"]').trigger('click');
    await flushPromises();

    expect(navigateDocument).not.toHaveBeenCalled();
    expect(offlineRouteFailure.value).toBeDefined();
    expect(wrapper.get('[data-test-id="offline-route-retry-error"]').text())
      .toContain('still unreachable');
  });

  it('keeps the previous route hidden until Back home has completed', async () => {
    const router = createTestRouter();
    await router.push('/previous');
    const realPush = router.push.bind(router);
    let allowNavigation: (() => void) | undefined;
    const navigationGate = new Promise<void>((resolve) => {
      allowNavigation = resolve;
    });
    vi.spyOn(router, 'push').mockImplementation(async (target) => {
      await navigationGate;
      return realPush(target);
    });
    offlineRouteFailure.value = {
      displayPath: '/target',
      fullPath: '/target',
    };
    const wrapper = mount(OfflineRouteUnavailable, {
      global: {
        plugins: [router],
        stubs: { CButton: ButtonStub },
      },
    });

    await wrapper.findAll('button')[1].trigger('click');
    expect(offlineRouteFailure.value).toBeDefined();
    allowNavigation?.();
    await flushPromises();

    expect(router.currentRoute.value.path).toBe('/');
    expect(offlineRouteFailure.value).toBeUndefined();
  });
});
