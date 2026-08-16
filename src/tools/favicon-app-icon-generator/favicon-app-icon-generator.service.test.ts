import { Blob as NodeBlob } from 'node:buffer';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { APP_ICON_SPECS, createAppIconTar, createAppManifest, generateAppIcons } from './favicon-app-icon-generator.service';

describe('favicon and app icon generation', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('generates the bounded icon matrix and always closes the decoded source', async () => {
    const close = vi.fn();
    const icons = await generateAppIcons(
      new File(['image'], 'source.png', { type: 'image/png' }),
      { background: '#ffffff', paddingPercent: 8, transparent: true },
      {
        decode: async () => ({ width: 1000, height: 500 }),
        render: async (_source, spec) => new Blob([`png-${spec.size}`], { type: 'image/png' }),
        close,
      },
    );
    expect(icons.map(icon => icon.name)).toEqual(APP_ICON_SPECS.map(icon => icon.name));
    expect(close).toHaveBeenCalledOnce();
  });

  it('rejects oversized decoded dimensions and still closes the resource', async () => {
    const close = vi.fn();
    await expect(generateAppIcons(
      new File(['image'], 'source.png', { type: 'image/png' }),
      { background: '#ffffff', paddingPercent: 0, transparent: false },
      { decode: async () => ({ width: 5000, height: 1 }), render: vi.fn(), close },
    )).rejects.toThrow('4096×4096');
    expect(close).toHaveBeenCalledOnce();
  });

  it('creates PWA manifest entries and a deterministic ustar archive', async () => {
    vi.stubGlobal('Blob', NodeBlob);
    const icons = APP_ICON_SPECS.map(spec => ({ ...spec, blob: new Blob(['png'], { type: 'image/png' }) }));
    const manifest = createAppManifest(icons);
    expect(manifest).toContain('"purpose": "maskable"');
    expect(manifest).not.toContain('favicon-16.png');
    const archive = new Uint8Array(await (await createAppIconTar(icons, manifest)).arrayBuffer());
    expect(new TextDecoder().decode(archive.slice(0, 14))).toBe('favicon-16.png');
    expect(new TextDecoder().decode(archive.slice(257, 262))).toBe('ustar');
    expect(archive.byteLength % 512).toBe(0);
  });
});
