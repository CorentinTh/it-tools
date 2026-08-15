import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { createPinia, setActivePinia } from 'pinia';
import CFileUpload from './c-file-upload.vue';

function setFileSelection(input: HTMLInputElement, files: File[]): void {
  Object.defineProperty(input, 'files', {
    configurable: true,
    value: files,
  });
  Object.defineProperty(input, 'value', {
    configurable: true,
    value: `C:\\fakepath\\${files[0]?.name ?? ''}`,
    writable: true,
  });
}

function mountFileUpload(props: { disabled?: boolean; title?: string } = {}) {
  const uploadedFiles: File[] = [];
  const TestHost = defineComponent({
    setup: () => () => h(CFileUpload, {
      ...props,
      onFileUpload: (file: File) => uploadedFiles.push(file),
    }, {
      default: () => 'Upload a file',
    }),
  });

  return { uploadedFiles, wrapper: mount(TestHost) };
}

describe('CFileUpload', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('exposes one keyboard-operable labelled drop-zone trigger', async () => {
    const { wrapper } = mountFileUpload({ title: 'Upload certificate' });
    const dropZone = wrapper.get('.c-file-upload');
    const input = wrapper.get<HTMLInputElement>('input[type="file"]');
    const click = vi.spyOn(input.element, 'click');

    expect(dropZone.attributes('role')).toBe('button');
    expect(dropZone.attributes('tabindex')).toBe('0');
    expect(dropZone.attributes('aria-label')).toBe('Upload certificate');

    await dropZone.trigger('keydown', { key: 'Enter' });
    await dropZone.trigger('keydown', { key: ' ' });

    expect(click).toHaveBeenCalledTimes(2);
  });

  it('makes the native input and drop zone inert when disabled', async () => {
    const { wrapper } = mountFileUpload({ disabled: true });
    const dropZone = wrapper.get('.c-file-upload');
    const input = wrapper.get<HTMLInputElement>('input[type="file"]');
    const click = vi.spyOn(input.element, 'click');

    expect(dropZone.attributes('aria-disabled')).toBe('true');
    expect(dropZone.attributes('tabindex')).toBe('-1');
    expect(input.element.disabled).toBe(true);

    await dropZone.trigger('click');
    await dropZone.trigger('keydown', { key: 'Enter' });
    await dropZone.trigger('drop', {
      dataTransfer: { files: [new File(['content'], 'disabled.txt')] },
    });

    expect(click).not.toHaveBeenCalled();
    expect(wrapper.emitted('fileUpload')).toBeUndefined();
  });

  it('clears the native input so the same file can be selected again', async () => {
    const { uploadedFiles, wrapper } = mountFileUpload();
    const input = wrapper.get<HTMLInputElement>('input[type="file"]');
    const file = new File(['content'], 'example.txt', { type: 'text/plain' });

    setFileSelection(input.element, [file]);
    await input.trigger('change');

    expect(input.element.value).toBe('');
    expect(uploadedFiles).toEqual([file]);

    setFileSelection(input.element, [file]);
    await input.trigger('change');

    expect(input.element.value).toBe('');
    expect(uploadedFiles).toEqual([file, file]);
  });

  it('always clears the drop-zone hover state, including an empty drop', async () => {
    const { uploadedFiles, wrapper } = mountFileUpload();
    const dropZone = wrapper.get('div');

    await dropZone.trigger('dragenter');
    expect(dropZone.classes()).toContain('border-primary');

    await dropZone.trigger('drop');
    expect(dropZone.classes()).not.toContain('border-primary');
    expect(uploadedFiles).toEqual([]);

    const file = new File(['content'], 'dropped.txt', { type: 'text/plain' });
    await dropZone.trigger('dragenter');
    await dropZone.trigger('drop', { dataTransfer: { files: [file] } });

    expect(dropZone.classes()).not.toContain('border-primary');
    expect(uploadedFiles).toEqual([file]);
  });
});
