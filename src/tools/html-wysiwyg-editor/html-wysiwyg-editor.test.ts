import { shallowMount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { beforeEach, describe, expect, it } from 'vitest';
import Editor from './editor/editor.vue';
import HtmlWysiwygEditor from './html-wysiwyg-editor.vue';

describe('HTML WYSIWYG editor persistence', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('keeps edited HTML ephemeral', async () => {
    const wrapper = shallowMount(HtmlWysiwygEditor);

    wrapper.getComponent(Editor).vm.$emit('update:html', '<p>private draft</p>');
    await nextTick();

    expect(localStorage.getItem('html-wysiwyg-editor--html')).toBeNull();
    wrapper.unmount();
  });
});
