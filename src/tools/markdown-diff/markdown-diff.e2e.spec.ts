import { expect, test } from '@playwright/test';

test.describe('Markdown Diff', () => {
  test('compares, sanitizes previews, stays private, and cancels worker work', async ({ page }) => {
    const marker = 'markdown-private-marker-42';
    const requestLeaks: string[] = [];
    await page.addInitScript(() => {
      const NativeWorker = window.Worker;
      window.Worker = new Proxy(NativeWorker, {
        construct(Target, argumentsList) {
          const worker = Reflect.construct(Target, argumentsList) as Worker;
          const postMessage = worker.postMessage.bind(worker);
          worker.postMessage = ((message: unknown, options?: StructuredSerializeOptions) => {
            window.setTimeout(() => postMessage(message, options), 750);
          }) as Worker['postMessage'];
          return worker;
        },
      });
    });
    page.on('request', (request) => {
      if (request.url().includes(marker) || (request.postData() ?? '').includes(marker) || request.url().includes('example.invalid')) {
        requestLeaks.push(request.url());
      }
    });

    await page.goto('/markdown-diff');
    await expect(page.getByRole('heading', { name: 'Markdown Diff' })).toBeVisible();
    await page.getByTestId('markdown-diff-left').fill(`# Old ${marker}\n\n[remote](https://example.invalid/a)\n\n<img src=x onerror=alert(1)>`);
    await page.getByTestId('markdown-diff-right').fill(`# New ${marker}\n\n![remote](https://example.invalid/b.png)\n\n<script>alert(1)</script>`);
    await page.getByTestId('markdown-diff-run').click();
    await expect(page.getByTestId('markdown-diff-output')).toHaveValue(/- # Old markdown-private-marker-42/u);
    await expect(page.getByTestId('markdown-diff-output')).toHaveValue(/\+ # New markdown-private-marker-42/u);

    for (const previewId of ['markdown-diff-left-preview', 'markdown-diff-right-preview']) {
      const preview = page.getByTestId(previewId);
      await expect(preview).toBeVisible();
      await expect(preview.locator('a, img, script, svg')).toHaveCount(0);
    }
    expect(page.url()).not.toContain(marker);
    expect(await page.evaluate(() => JSON.stringify({ local: localStorage, session: sessionStorage }))).not.toContain(marker);
    expect(requestLeaks).toEqual([]);

    const left = Array.from({ length: 999 }, (_, index) => `left-${index}`).join('\n');
    const right = Array.from({ length: 999 }, (_, index) => `right-${index}`).join('\n');
    await page.getByTestId('markdown-diff-left').fill(left);
    await page.getByTestId('markdown-diff-right').fill(right);
    await page.getByTestId('markdown-diff-run').click();
    await expect(page.getByTestId('markdown-diff-cancel')).toBeVisible();
    await page.getByTestId('markdown-diff-cancel').click();
    await expect(page.getByTestId('markdown-diff-status')).toContainText('worker was terminated');
  });
});
