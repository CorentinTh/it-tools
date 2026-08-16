import { describe, expect, it, vi } from 'vitest';
import { MermaidRenderClient, type MermaidRendererLoader } from './mermaid-render.client';
import type { MermaidRenderResult } from './mermaid-renderer.service';

const result: MermaidRenderResult = {
  source: 'flowchart LR\nA-->B',
  kind: 'Flowchart',
  svg: '<svg/>',
  sourceBytes: 18,
  svgBytes: 6,
  elementCount: 1,
  width: 10,
  height: 10,
  elapsedMs: 1,
};

function deferred<T>() {
  let resolvePending!: (value: T) => void;
  const promise = new Promise<T>((resolve) => {
    resolvePending = resolve;
  });
  return { promise, resolve: resolvePending };
}

describe('MermaidRenderClient', () => {
  it('loads the heavy renderer only when explicitly requested', async () => {
    const renderMermaidDiagram = vi.fn(async () => result);
    const load = vi.fn(async () => ({ renderMermaidDiagram, rasterizeMermaidSvg: vi.fn() }));
    const client = new MermaidRenderClient(load);
    expect(load).not.toHaveBeenCalled();
    await expect(client.render(result.source)).resolves.toEqual(result);
    expect(load).toHaveBeenCalledOnce();
    expect(renderMermaidDiagram).toHaveBeenCalledWith(result.source);
  });

  it('rejects a load result after cancellation', async () => {
    const loading = deferred<Awaited<ReturnType<MermaidRendererLoader>>>();
    const client = new MermaidRenderClient(() => loading.promise);
    const pending = client.render(result.source);
    client.cancel();
    loading.resolve({ renderMermaidDiagram: vi.fn(async () => result), rasterizeMermaidSvg: vi.fn() });
    await expect(pending).rejects.toMatchObject({ name: 'AbortError' });
  });

  it('rejects a stale completed render and all work after disposal', async () => {
    const rendering = deferred<MermaidRenderResult>();
    const client = new MermaidRenderClient(async () => ({
      renderMermaidDiagram: () => rendering.promise,
      rasterizeMermaidSvg: vi.fn(),
    }));
    const pending = client.render(result.source);
    await Promise.resolve();
    client.cancel();
    rendering.resolve(result);
    await expect(pending).rejects.toMatchObject({ name: 'AbortError' });
    client.dispose();
    await expect(client.render(result.source)).rejects.toThrow('no longer available');
  });

  it('uses the same lazy module for bounded PNG export and invalidates stale export', async () => {
    const rasterizeMermaidSvg = vi.fn(async () => new Blob(['png'], { type: 'image/png' }));
    const client = new MermaidRenderClient(async () => ({ renderMermaidDiagram: vi.fn(), rasterizeMermaidSvg }));
    await expect(client.rasterize(result)).resolves.toMatchObject({ type: 'image/png' });
    expect(rasterizeMermaidSvg).toHaveBeenCalledWith(result);
  });
});
