import type { MermaidRenderResult } from './mermaid-renderer.service';

export type MermaidRendererLoader = () => Promise<{
  renderMermaidDiagram: (source: string) => Promise<MermaidRenderResult>
  rasterizeMermaidSvg: (result: Pick<MermaidRenderResult, 'svg' | 'width' | 'height'>) => Promise<Blob>
}>;

const defaultLoader: MermaidRendererLoader = () => import('./mermaid-renderer.service');

export class MermaidRenderClient {
  private operation = 0;
  private disposed = false;

  constructor(private readonly load: MermaidRendererLoader = defaultLoader) {}

  async render(source: string): Promise<MermaidRenderResult> {
    if (this.disposed) {
      throw new Error('Mermaid renderer is no longer available.');
    }
    const operation = ++this.operation;
    const renderer = await this.load();
    if (operation !== this.operation || this.disposed) {
      throw new DOMException('Mermaid render cancelled.', 'AbortError');
    }
    const result = await renderer.renderMermaidDiagram(source);
    if (operation !== this.operation || this.disposed) {
      throw new DOMException('Mermaid render cancelled.', 'AbortError');
    }
    return result;
  }

  async rasterize(result: Pick<MermaidRenderResult, 'svg' | 'width' | 'height'>): Promise<Blob> {
    if (this.disposed) {
      throw new Error('Mermaid renderer is no longer available.');
    }
    const operation = this.operation;
    const renderer = await this.load();
    if (operation !== this.operation || this.disposed) {
      throw new DOMException('Mermaid export cancelled.', 'AbortError');
    }
    const blob = await renderer.rasterizeMermaidSvg(result);
    if (operation !== this.operation || this.disposed) {
      throw new DOMException('Mermaid export cancelled.', 'AbortError');
    }
    return blob;
  }

  cancel() {
    this.operation += 1;
  }

  dispose() {
    this.disposed = true;
    this.cancel();
  }
}
