import { chromium } from '@playwright/test';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.goto('http://127.0.0.1:8092/');
await page.waitForFunction(() => document.querySelector('#status')?.textContent?.startsWith('Ready'));

const baseLine = 'stable payload line 000000000000000000000000000000000000000000000000\n';
const original = baseLine.repeat(Math.ceil(1_000_000 / baseLine.length)).slice(0, 1_000_000);
const changedAt = Math.floor(original.length / 2);
const modified = `${original.slice(0, changedAt)}CHANGED${original.slice(changedAt + 7)}`;

const initialStartedAt = performance.now();
await page.evaluate(([a, b]) => window.__codeMirrorWorkerSpike.setDocuments(a, b), [original, modified]);
const initialReadyMs = performance.now() - initialStartedAt;
const initialState = await page.evaluate(() => window.__codeMirrorWorkerSpike.getState());
const initialMarkers = await page.locator('.cm-changedLine, .cm-changedText').count();

await page.evaluate(() => {
  const state = window;
  state.__spikeHeartbeat = 0;
  state.__spikeLongTasks = [];
  state.__spikeTimer = window.setInterval(() => { state.__spikeHeartbeat += 1; }, 10);
  state.__spikeObserver = new PerformanceObserver((list) => {
    state.__spikeLongTasks.push(...list.getEntries().map(entry => entry.duration));
  });
  if (PerformanceObserver.supportedEntryTypes.includes('longtask')) {
    state.__spikeObserver.observe({ entryTypes: ['longtask'] });
  }
});

const modifiedContent = page.locator('.cm-merge-b .cm-content');
await modifiedContent.click();
const focusBefore = await page.evaluate(() => document.activeElement?.closest('.cm-merge-b') !== null);
const beforeEdit = (await page.evaluate(() => window.__codeMirrorWorkerSpike.getState())).modified;
await page.evaluate((position) => window.__codeMirrorWorkerSpike.replaceModified(position, position, 'X'), changedAt);
await page.waitForFunction(
  previousRebuilds => window.__codeMirrorWorkerSpike.getState().rebuilds > previousRebuilds
    && document.querySelector('#status')?.textContent?.startsWith('Ready'),
  initialState.rebuilds,
);
await page.waitForTimeout(100);
const publicationProbe = await page.evaluate(() => {
  window.clearInterval(window.__spikeTimer);
  window.__spikeObserver?.disconnect();
  return {
    focusAfter: document.activeElement?.closest('.cm-merge-b') !== null,
    heartbeat: window.__spikeHeartbeat,
    longestTaskMs: Math.max(0, ...window.__spikeLongTasks),
  };
});

await modifiedContent.click();
await page.keyboard.press(process.platform === 'darwin' ? 'Meta+z' : 'Control+z');
const afterUndo = (await page.evaluate(() => window.__codeMirrorWorkerSpike.getState())).modified;

const distributedOriginal = Array.from({ length: 4_000 }, (_, index) => `line-${index}-${'a'.repeat(220)}`).join('\n');
const distributedModified = Array.from({ length: 4_000 }, (_, index) => (
  index % 173 === 0 ? `line-${index}-${'b'.repeat(220)}` : `line-${index}-${'a'.repeat(220)}`
)).join('\n');
await page.evaluate(([a, b]) => window.__codeMirrorWorkerSpike.setDocuments(a, b), [distributedOriginal, distributedModified]);
const distributedState = await page.evaluate(() => window.__codeMirrorWorkerSpike.getState());
const distributedMarkers = await page.locator('.cm-changedLine, .cm-changedText').count();

for (let cycle = 0; cycle < 10; cycle += 1) {
  await page.evaluate(() => window.__codeMirrorWorkerSpike.destroy());
  await page.evaluate(() => window.__codeMirrorWorkerSpike.setDocuments('left', 'right'));
}
await page.evaluate(() => window.__codeMirrorWorkerSpike.destroy());
const remainingEditors = await page.locator('.cm-editor').count();

console.log(JSON.stringify({
  inputBytesPerSide: new TextEncoder().encode(original).byteLength,
  initialReadyMs,
  workerElapsedMs: initialState.workerElapsedMs,
  initialMarkers,
  focusBefore,
  focusAfter: publicationProbe.focusAfter,
  undoPreserved: afterUndo === beforeEdit,
  heartbeat: publicationProbe.heartbeat,
  longestTaskMs: publicationProbe.longestTaskMs,
  distributedWorkerElapsedMs: distributedState.workerElapsedMs,
  distributedMarkers,
  remainingEditors,
}, null, 2));

await browser.close();
