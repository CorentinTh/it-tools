import mermaid from 'mermaid';
import {
  MERMAID_MAX_EDGES,
  MERMAID_MAX_SOURCE_CHARACTERS,
  calculatePngDimensions,
  sanitizeMermaidSvg,
  validateMermaidSource,
} from './mermaid-diagram.policy';

export const MERMAID_RENDER_DEADLINE_MS = 8_000;

export interface MermaidRenderResult {
  source: string
  kind: string
  svg: string
  sourceBytes: number
  svgBytes: number
  elementCount: number
  width: number
  height: number
  elapsedMs: number
}

let initialized = false;
let renderSequence = 0;

function initializeMermaid() {
  if (initialized) {
    return;
  }
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'strict',
    theme: 'neutral',
    deterministicIds: true,
    deterministicIDSeed: 'it-tools-mermaid-v1',
    maxTextSize: MERMAID_MAX_SOURCE_CHARACTERS,
    maxEdges: MERMAID_MAX_EDGES,
    htmlLabels: false,
    flowchart: { htmlLabels: false, useMaxWidth: true },
  });
  initialized = true;
}

function removeRendererArtifacts(renderId: string) {
  document.getElementById(renderId)?.remove();
  document.getElementById(`d${renderId}`)?.remove();
}

export async function renderMermaidDiagram(value: string): Promise<MermaidRenderResult> {
  const source = validateMermaidSource(value);
  initializeMermaid();
  const renderId = `it-tools-mermaid-${++renderSequence}`;
  const startedAt = performance.now();
  try {
    const rendered = await mermaid.render(renderId, source.source);
    const elapsedMs = performance.now() - startedAt;
    if (elapsedMs > MERMAID_RENDER_DEADLINE_MS) {
      throw new Error('Mermaid rendering exceeded the eight-second deadline.');
    }
    const sanitized = sanitizeMermaidSvg(rendered.svg);
    return {
      ...source,
      ...sanitized,
      elapsedMs,
    };
  }
  catch (error) {
    if (error instanceof Error && error.message.startsWith('Mermaid rendering exceeded')) {
      throw error;
    }
    throw new Error('Mermaid could not render this bounded source. Check its syntax and the supported-feature restrictions.');
  }
  finally {
    removeRendererArtifacts(renderId);
  }
}

export async function rasterizeMermaidSvg(result: Pick<MermaidRenderResult, 'svg' | 'width' | 'height'>): Promise<Blob> {
  const dimensions = calculatePngDimensions(result.width, result.height);
  const svgUrl = URL.createObjectURL(new Blob([result.svg], { type: 'image/svg+xml;charset=utf-8' }));
  try {
    const image = new Image();
    image.decoding = 'async';
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error('The sanitized SVG could not be rasterized.'));
      image.src = svgUrl;
    });
    const canvas = document.createElement('canvas');
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Canvas rendering is unavailable in this browser.');
    }
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        }
        else {
          reject(new Error('The browser could not encode the Mermaid PNG.'));
        }
      }, 'image/png');
    });
  }
  finally {
    URL.revokeObjectURL(svgUrl);
  }
}
