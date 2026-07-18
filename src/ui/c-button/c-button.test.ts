import { defineComponent, h } from 'vue';
import { flushPromises, mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { createMemoryHistory, createRouter } from 'vue-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import CButton from './c-button.vue';

const EmptyPage = defineComponent({
  setup: () => () => h('div'),
});

function createTestRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: EmptyPage },
      { path: '/target', name: 'target', component: EmptyPage },
    ],
  });
}

describe('CButton disabled semantics', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('uses the native disabled state for a real button', async () => {
    const wrapper = mount(CButton, { props: { disabled: true } });
    const button = wrapper.get('button');

    expect((button.element as HTMLButtonElement).disabled).toBe(true);
    expect(button.attributes('type')).toBe('button');
    expect(button.attributes('aria-disabled')).toBeUndefined();
    expect(button.attributes('tabindex')).toBeUndefined();

    await button.trigger('click');
    expect(wrapper.emitted('click')).toBeUndefined();

    await wrapper.setProps({ disabled: false });
    expect((button.element as HTMLButtonElement).disabled).toBe(false);

    await button.trigger('click');
    expect(wrapper.emitted('click')).toHaveLength(1);
  });

  it('only submits or resets a form when the native type is explicit', async () => {
    const form = document.createElement('form');
    const onSubmit = vi.fn((event: Event) => event.preventDefault());
    const onReset = vi.fn((event: Event) => event.preventDefault());
    form.addEventListener('submit', onSubmit);
    form.addEventListener('reset', onReset);
    document.body.append(form);

    const wrapper = mount(CButton, { attachTo: form });
    const button = wrapper.get('button');

    (button.element as HTMLButtonElement).click();
    expect(onSubmit).not.toHaveBeenCalled();
    expect(onReset).not.toHaveBeenCalled();

    await wrapper.setProps({ nativeType: 'submit' });
    expect(button.attributes('type')).toBe('submit');
    (button.element as HTMLButtonElement).click();
    expect(onSubmit).toHaveBeenCalledTimes(1);

    await wrapper.setProps({ nativeType: 'reset' });
    expect(button.attributes('type')).toBe('reset');
    (button.element as HTMLButtonElement).click();
    expect(onReset).toHaveBeenCalledTimes(1);

    wrapper.unmount();
    form.remove();
  });

  it('exposes a disabled link without allowing activation', async () => {
    const wrapper = mount(CButton, {
      props: { disabled: true, href: '#target' },
    });
    const link = wrapper.get('a');

    expect(link.attributes('href')).toBeUndefined();
    expect(link.attributes('role')).toBe('link');
    expect(link.attributes('aria-disabled')).toBe('true');
    expect(link.attributes('tabindex')).toBe('-1');
    expect(link.attributes('disabled')).toBeUndefined();

    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    link.element.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
    expect(wrapper.emitted('click')).toBeUndefined();

    await wrapper.setProps({ disabled: false });
    expect(link.attributes('href')).toBe('#target');
    expect(link.attributes('role')).toBeUndefined();
    expect(link.attributes('aria-disabled')).toBeUndefined();
    expect(link.attributes('tabindex')).toBeUndefined();

    await link.trigger('click');
    expect(wrapper.emitted('click')).toHaveLength(1);
  });

  it('renders a disabled router target inert and restores enabled navigation', async () => {
    const router = createTestRouter();
    await router.push('/');
    await router.isReady();

    const wrapper = mount(CButton, {
      props: {
        disabled: true,
        to: { name: 'target', query: { source: 'button' } },
      },
      global: { plugins: [router] },
    });
    const link = wrapper.get('a');

    expect(link.attributes('href')).toBeUndefined();
    expect(link.attributes('role')).toBe('link');
    expect(link.attributes('aria-disabled')).toBe('true');
    expect(link.attributes('tabindex')).toBe('-1');

    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    link.element.dispatchEvent(event);
    await flushPromises();

    expect(event.defaultPrevented).toBe(true);
    expect(router.currentRoute.value.fullPath).toBe('/');
    expect(wrapper.emitted('click')).toBeUndefined();

    await wrapper.setProps({ disabled: false });
    const enabledLink = wrapper.get('a');
    expect(enabledLink.attributes('href')).toBe('/target?source=button');
    await enabledLink.trigger('click');
    await flushPromises();

    expect(router.currentRoute.value.fullPath).toBe('/target?source=button');
    expect(wrapper.emitted('click')).toHaveLength(1);
  });
});
