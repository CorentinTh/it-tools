import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import DockerRunToDockerComposeConverter from './docker-run-to-docker-compose-converter.vue';
import CInputText from '@/ui/c-input-text/c-input-text.vue';

describe('Docker run converter layout', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    setActivePinia(createPinia());
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('uses the wide paired-transformer contract', () => {
    const wrapper = shallowMount(DockerRunToDockerComposeConverter);
    const input = wrapper.getComponent(CInputText);

    expect(wrapper.get('.c-tool-workbench').classes()).toContain('c-tool-stack');
    expect(wrapper.findAll('.c-tool-panel')).toHaveLength(2);
    expect(input.props('rows')).toBe('18');
    expect(input.props('autosize')).toBe(false);
    expect(wrapper.text()).toContain('Docker Compose output');
    expect(wrapper.find('[data-test-id="docker-converter-run"]').exists()).toBe(true);
    wrapper.unmount();
  });
});
