import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
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

function mountFileUpload() {
  const uploadedFiles: File[] = [];
  const TestHost = defineComponent({
    setup: () => () => h(CFileUpload, {
      onFileUpload: (file: File) => uploadedFiles.push(file),
    }, {
      default: () => 'Upload a file',
    }),
  });

  return { uploadedFiles, wrapper: mount(TestHost) };
}

describe('CFileUpload', () => {
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
