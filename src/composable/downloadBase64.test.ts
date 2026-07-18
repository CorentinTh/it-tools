import { afterEach, describe, expect, it, vi } from 'vitest';
import { ref } from 'vue';
import {
  getMimeTypeFromBase64,
  getMimeTypeFromExtension,
  previewImageFromBase64,
  useDownloadFileFromBase64Refs,
} from './downloadBase64';

describe('downloadBase64', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = '';
  });

  describe('getMimeTypeFromBase64', () => {
    it('when the base64 string has a data URI, it returns the mime type', () => {
      expect(getMimeTypeFromBase64({ base64String: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA' })).to.deep.equal({ mimeType: 'image/png' });
      expect(getMimeTypeFromBase64({ base64String: 'data:image/jpg;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA' })).to.deep.equal({ mimeType: 'image/jpg' });
    });

    it('when the base64 string has no data URI, it try to infer the mime type from the signature', () => {
      // https://en.wikipedia.org/wiki/List_of_file_signatures

      // PNG
      expect(getMimeTypeFromBase64({ base64String: 'iVBORw0KGgoAAAANSUhEUgAAAAUA' })).to.deep.equal({ mimeType: 'image/png' });

      // GIF
      expect(getMimeTypeFromBase64({ base64String: 'R0lGODdh' })).to.deep.equal({ mimeType: 'image/gif' });
      expect(getMimeTypeFromBase64({ base64String: 'R0lGODlh' })).to.deep.equal({ mimeType: 'image/gif' });

      // JPG
      expect(getMimeTypeFromBase64({ base64String: '/9j/' })).to.deep.equal({ mimeType: 'image/jpg' });

      // PDF
      expect(getMimeTypeFromBase64({ base64String: 'JVBERi0' })).to.deep.equal({ mimeType: 'application/pdf' });
    });

    it('when the base64 string has no data URI and no signature, it returns an undefined mimeType', () => {
      expect(getMimeTypeFromBase64({ base64String: 'JVBERi' })).to.deep.equal({ mimeType: undefined });
    });
  });

  it('looks up a MIME type from a file extension', () => {
    expect(getMimeTypeFromExtension('png')).to.equal('image/png');
    expect(getMimeTypeFromExtension('.pdf')).to.equal('application/pdf');
    expect(getMimeTypeFromExtension('not-a-real-extension')).to.equal(undefined);
  });

  it('wraps raw Base64 in a data URI when downloading an inferred file type', () => {
    const anchor = document.createElement('a');
    vi.spyOn(anchor, 'click').mockImplementation(() => undefined);
    vi.spyOn(document, 'createElement').mockReturnValue(anchor);

    const { download } = useDownloadFileFromBase64Refs({
      source: ref('iVBORw0KGgoAAAANSUhEUgAAAAUA'),
      filename: ref('pixel'),
      extension: ref('png'),
    });
    download();

    expect(anchor.href).to.equal('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA');
    expect(anchor.download).to.equal('pixel.png');
  });

  it('uses the selected extension MIME type for raw Base64 without a known signature', () => {
    const anchor = document.createElement('a');
    vi.spyOn(anchor, 'click').mockImplementation(() => undefined);
    vi.spyOn(document, 'createElement').mockReturnValue(anchor);

    const { download } = useDownloadFileFromBase64Refs({
      source: ref('SGVsbG8='),
      filename: ref('hello'),
      extension: ref('txt'),
    });
    download();

    expect(anchor.href).to.equal('data:text/plain;base64,SGVsbG8=');
    expect(anchor.download).to.equal('hello.txt');
  });

  it('wraps raw Base64 in a data URI for image preview', () => {
    const previewContainer = document.createElement('div');
    previewContainer.id = 'previewContainer';
    document.body.appendChild(previewContainer);

    const image = previewImageFromBase64('iVBORw0KGgoAAAANSUhEUgAAAAUA');

    expect(image.src).to.equal('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA');
    expect(previewContainer.querySelector('img')).to.equal(image);
  });

  it('uses an explicit fallback MIME type when previewing raw Base64 without a known signature', () => {
    const previewContainer = document.createElement('div');
    previewContainer.id = 'previewContainer';
    document.body.appendChild(previewContainer);

    const image = previewImageFromBase64('SGVsbG8=', 'image/webp');

    expect(image.src).to.equal('data:image/webp;base64,SGVsbG8=');
  });
});
