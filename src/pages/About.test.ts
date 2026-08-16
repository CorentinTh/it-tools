import { flushPromises, shallowMount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import AboutPage from './About.vue';

const mocks = vi.hoisted(() => ({ deleteOtpVaultDatabase: vi.fn(async () => true) }));
vi.mock('@/tools/local-encrypted-otp-vault/local-encrypted-otp-vault.repository', () => mocks);

vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (key: string) => key }),
}));

describe('About privacy controls', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    mocks.deleteOtpVaultDatabase.mockResolvedValue(true);
  });

  it('clears managed browser data only after confirmation', async () => {
    localStorage.setItem('json-prettify:sort-keys', 'true');
    localStorage.setItem('another-app:key', 'preserved');

    const wrapper = shallowMount(AboutPage, {
      global: {
        renderStubDefaultSlot: true,
        mocks: {
          $t: (key: string) => key,
        },
      },
    });

    wrapper.getComponent({ name: 'Popconfirm' }).vm.$emit('positive-click');
    await flushPromises();
    expect(mocks.deleteOtpVaultDatabase).toHaveBeenCalledOnce();
    await wrapper.vm.$nextTick();

    expect(localStorage.getItem('json-prettify:sort-keys')).toBeNull();
    expect(localStorage.getItem('another-app:key')).toBe('preserved');
    expect(wrapper.get('[data-test-id="storage-clear-status"]').text()).toContain('about.privacy.clearSuccess');
  });

  it('leaves data unchanged before positive confirmation', () => {
    localStorage.setItem('json-prettify:sort-keys', 'true');

    const wrapper = shallowMount(AboutPage, {
      global: {
        renderStubDefaultSlot: true,
        mocks: {
          $t: (key: string) => key,
        },
      },
    });

    expect(localStorage.getItem('json-prettify:sort-keys')).toBe('true');
    expect(wrapper.find('[data-test-id="storage-clear-status"]').exists()).toBe(false);
  });
});
