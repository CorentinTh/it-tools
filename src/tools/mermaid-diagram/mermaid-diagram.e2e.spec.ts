import { Buffer } from 'node:buffer';
import { expect, test } from '@playwright/test';

test.describe('Mermaid Diagram Renderer', () => {
  test('renders every supported syntax family through the real browser renderer', async ({ page }) => {
    const fixtures = [
      { source: 'flowchart LR\nA --> B', kind: 'Flowchart' },
      { source: 'sequenceDiagram\nAlice->>Bob: hello', kind: 'Sequence' },
      { source: 'classDiagram\nAnimal <|-- Cat', kind: 'Class' },
      { source: 'stateDiagram-v2\n[*] --> Ready', kind: 'State' },
      { source: 'erDiagram\nCUSTOMER ||--o{ ORDER : places', kind: 'Entity relationship' },
    ];

    await page.goto('/mermaid-diagram');
    for (const fixture of fixtures) {
      await page.getByTestId('mermaid-source').fill(fixture.source);
      await page.getByTestId('mermaid-render').click();
      await expect(page.getByTestId('mermaid-status')).toContainText(`${fixture.kind} rendered`, { timeout: 20_000 });
      await expect(page.frameLocator('[data-test-id="mermaid-preview"]').locator('svg')).toHaveCount(1);
    }
  });

  test('renders only explicitly, isolates output, rejects active syntax, exports, and keeps source ephemeral', async ({ context, page }) => {
    const marker = 'private-mermaid-marker-42';
    const markerRequests: string[] = [];
    const markerConsoleMessages: string[] = [];
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    page.on('request', (request) => {
      if (request.url().includes(marker) || request.postData()?.includes(marker)) {
        markerRequests.push(request.url());
      }
    });
    page.on('console', (message) => {
      if (message.text().includes(marker)) {
        markerConsoleMessages.push(message.text());
      }
    });

    await page.goto('/mermaid-diagram');
    await expect(page.getByRole('heading', { name: 'Mermaid Diagram Renderer' })).toBeVisible();
    await expect(page.getByTestId('mermaid-empty-preview')).toBeVisible();

    const source = `flowchart LR\n  A[${marker}] --> B[Sanitized export]`;
    await page.getByTestId('mermaid-source').fill(source);
    await expect(page.getByTestId('mermaid-empty-preview')).toBeVisible();
    expect(markerRequests).toEqual([]);

    await page.getByTestId('mermaid-render').click();
    await page.getByTestId('mermaid-cancel').dispatchEvent('click');
    await expect(page.getByTestId('mermaid-status')).toContainText('cancelled');
    await expect(page.getByTestId('mermaid-empty-preview')).toBeVisible();

    await page.getByTestId('mermaid-render').click();
    await expect(page.getByTestId('mermaid-status')).toContainText('Flowchart rendered', { timeout: 20_000 });
    const preview = page.frameLocator('[data-test-id="mermaid-preview"]');
    await expect(preview.locator('body')).toContainText(marker);
    await expect(preview.locator('script, a, foreignObject, iframe, image')).toHaveCount(0);
    const sourceBox = await page.getByTestId('mermaid-source').boundingBox();
    const previewBox = await page.getByTestId('mermaid-preview').boundingBox();
    expect(sourceBox).not.toBeNull();
    expect(previewBox).not.toBeNull();
    expect(sourceBox!.width).toBeGreaterThan(600);
    expect(previewBox!.width).toBeGreaterThan(600);
    expect(Math.abs(sourceBox!.width - previewBox!.width)).toBeLessThan(80);
    expect(previewBox!.y).toBeGreaterThan(sourceBox!.y + sourceBox!.height);

    await page.getByTestId('mermaid-copy-svg').click();
    const clipboard = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboard).toContain(marker);
    expect(clipboard).not.toMatch(/<script|<foreignObject|\son\w+=|\s(?:href|src)=/iu);
    expect(clipboard.replace('http://www.w3.org/2000/svg', '')).not.toMatch(/https?:\/\//iu);

    const svgDownloadPromise = page.waitForEvent('download');
    await page.getByTestId('mermaid-download-svg').click();
    const svgDownload = await svgDownloadPromise;
    expect(svgDownload.suggestedFilename()).toBe('mermaid-diagram.svg');
    const svgPath = await svgDownload.path();
    expect(svgPath).not.toBeNull();
    const svgContent = await import('node:fs/promises').then(fs => fs.readFile(svgPath!, 'utf8'));
    expect(svgContent).toContain(marker);

    const pngDownloadPromise = page.waitForEvent('download');
    await page.getByTestId('mermaid-download-png').click();
    const pngDownload = await pngDownloadPromise;
    expect(pngDownload.suggestedFilename()).toBe('mermaid-diagram.png');
    const pngPath = await pngDownload.path();
    expect(pngPath).not.toBeNull();
    const png = await import('node:fs/promises').then(fs => fs.readFile(pngPath!));
    expect(png.subarray(0, 8)).toEqual(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));

    await page.getByTestId('mermaid-source').fill(`flowchart LR\nclick A "https://${marker}.invalid"`);
    await page.getByTestId('mermaid-render').click();
    await expect(page.getByTestId('mermaid-error')).toContainText('directives are disabled');
    await expect(page.getByTestId('mermaid-error')).not.toContainText(marker);
    expect(page.url()).not.toContain(marker);
    const stored = await page.evaluate(() => JSON.stringify({ local: Object.entries(localStorage), session: Object.entries(sessionStorage) }));
    expect(stored).not.toContain(marker);
    expect(markerRequests).toEqual([]);
    expect(markerConsoleMessages).toEqual([]);
  });
});
