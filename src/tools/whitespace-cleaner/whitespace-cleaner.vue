<script setup lang="ts">
import CInputText from '@/ui/c-input-text/c-input-text.vue';
import { getBrowserStorage, loadOptions, OPTION_DEFINITIONS, saveOptions } from './whitespace-cleaner.options';
import { SAMPLE_INPUT } from './whitespace-cleaner.sample';
import { cleanText, computeStats } from './whitespace-cleaner.service';

type CopyState = 'idle' | 'copied' | 'failed';

const COPIED_DURATION_MS = 1500;
const INPUT_DEBOUNCE_MS = 100;

const storage = getBrowserStorage();
const options = ref(loadOptions(storage));
watch(options, value => saveOptions(storage, value), { deep: true });

const input = ref('');
// Debouncing keeps the cleaner and the output re-render out of the keystroke path for large pastes.
const debouncedInput = refDebounced(input, INPUT_DEBOUNCE_MS);
const output = computed(() => cleanText(debouncedInput.value, options.value));
const stats = computed(() => computeStats(debouncedInput.value, output.value));

const inputBadge = computed(() => (debouncedInput.value === '' ? 'input' : `${stats.value.inputLines} lines · ${stats.value.inputChars} chars`));
const outputBadge = computed(() => (output.value === '' ? 'output' : `${stats.value.outputLines} lines · ${stats.value.outputChars} chars · −${stats.value.savedPercent}%`));

const outputField = ref<InstanceType<typeof CInputText>>();
const copyState = ref<CopyState>('idle');
const announcement = ref('');

const { start: startCopiedTimer, stop: stopCopiedTimer } = useTimeoutFn(() => {
  copyState.value = 'idle';
}, COPIED_DURATION_MS, { immediate: false });

watch(output, () => {
  stopCopiedTimer();
  copyState.value = 'idle';
});

const copyLabel = computed(() => ({ idle: 'Copy', copied: 'Copied ✓', failed: 'Copy failed' })[copyState.value]);

function loadSample() {
  input.value = SAMPLE_INPUT;
}

function clearInput() {
  input.value = '';
}

function toggleOption(key: keyof typeof options.value) {
  options.value[key] = !options.value[key];
}

async function announce(message: string) {
  // Clearing first makes screen readers announce a repeated message again.
  announcement.value = '';
  await nextTick();
  announcement.value = message;
}

// Firefox scrolls a textarea to the end of a selection set by script, so selecting all would jump to the bottom.
// The scroll position is restored right away and again on the next frame, in case the browser scrolls later.
function changeSelectionKeepingScroll(textarea: HTMLTextAreaElement, changeSelection: () => void) {
  const { scrollTop, scrollLeft } = textarea;
  const restoreScroll = () => {
    textarea.scrollTop = scrollTop;
    textarea.scrollLeft = scrollLeft;
  };

  changeSelection();
  restoreScroll();
  requestAnimationFrame(restoreScroll);
}

function selectAllKeepingScroll(textarea: HTMLTextAreaElement) {
  changeSelectionKeepingScroll(textarea, () => textarea.select());
}

function selectOutput() {
  const textarea = outputField.value?.textareaRef;
  if (textarea) {
    textarea.focus();
    selectAllKeepingScroll(textarea);
  }
}

async function copyOutput() {
  if (output.value === '') {
    return;
  }

  stopCopiedTimer();

  try {
    if (!navigator.clipboard?.writeText) {
      throw new Error('The Clipboard API is unavailable.');
    }

    await navigator.clipboard.writeText(output.value);
    copyState.value = 'copied';
    startCopiedTimer();
    announce('Copied to the clipboard.');
  }
  catch {
    copyState.value = 'failed';
    selectOutput();
    announce('Copy failed. The output is selected. Press Ctrl+C to copy it.');
  }
}

// A mouse press focuses the output before a drag starts. Selecting all on that focus would replace the drag selection,
// so a mouse focus is left to `selectAllOnClick`.
let isMouseFocus = false;

// A mouse press inside an existing selection starts a text drag instead of a new selection.
// Collapsing the selection first lets the user drag-select part of the output, and lets a plain click select all.
function prepareMouseSelection(event: MouseEvent) {
  isMouseFocus = true;

  const target = event.target;
  if (event.button !== 0 || event.shiftKey || !(target instanceof HTMLTextAreaElement) || target.selectionStart === target.selectionEnd) {
    return;
  }

  changeSelectionKeepingScroll(target, () => target.setSelectionRange(target.selectionStart, target.selectionStart));
}

function selectAllOnFocus(event: FocusEvent) {
  const focusedByMouse = isMouseFocus;
  isMouseFocus = false;

  if (!focusedByMouse && event.target instanceof HTMLTextAreaElement) {
    selectAllKeepingScroll(event.target);
  }
}

function selectAllOnClick(event: MouseEvent) {
  isMouseFocus = false;
  const target = event.target;
  if (target instanceof HTMLTextAreaElement && target.selectionStart === target.selectionEnd) {
    selectAllKeepingScroll(target);
  }
}
</script>

<template>
  <div class="whitespace-cleaner">
    <div class="panes">
      <section class="pane" aria-labelledby="whitespace-cleaner-input-label">
        <div class="pane-header">
          <div class="pane-title">
            <label id="whitespace-cleaner-input-label" for="whitespace-cleaner-input" font-bold>Paste</label>
            <n-tag size="small" round :bordered="false" data-test-id="input-badge">
              {{ inputBadge }}
            </n-tag>
          </div>
          <div class="pane-actions">
            <c-button size="small" data-test-id="sample" @click="loadSample">
              Sample
            </c-button>
            <c-button size="small" :disabled="input === ''" :aria-disabled="input === ''" data-test-id="clear" @click="clearInput">
              Clear
            </c-button>
          </div>
        </div>

        <CInputText
          id="whitespace-cleaner-input"
          v-model:value="input"

          raw-text multiline monospace
          rows="16"
          placeholder="Paste fragmented Claude Code output here…"
          test-id="input"
        />
      </section>

      <section class="pane" aria-labelledby="whitespace-cleaner-output-label">
        <div class="pane-header">
          <div class="pane-title">
            <label id="whitespace-cleaner-output-label" for="whitespace-cleaner-output" font-bold>Clean</label>
            <n-tag size="small" round :bordered="false" data-test-id="output-badge">
              {{ outputBadge }}
            </n-tag>
          </div>
          <div class="pane-actions">
            <c-button
              size="small"
              :type="copyState === 'failed' ? 'error' : 'primary'"
              :disabled="output === ''"
              :aria-disabled="output === ''"
              data-test-id="copy"
              @click="copyOutput"
            >
              {{ copyLabel }}
            </c-button>
          </div>
        </div>

        <CInputText
          id="whitespace-cleaner-output"
          ref="outputField"
          :value="output"
          multiline
          monospace
          raw-text
          readonly
          rows="16"
          placeholder="Your cleaned output will appear here."
          test-id="output"
          @mousedown="prepareMouseSelection"
          @focusin="selectAllOnFocus"
          @click="selectAllOnClick"
        />

        <div v-if="output !== ''" class="output-hint" data-test-id="output-hint">
          ⌘/Ctrl+A · Ctrl+C
        </div>
      </section>
    </div>

    <div class="chips" role="group" aria-label="Cleaning options">
      <c-tooltip v-for="{ key, label, hint } in OPTION_DEFINITIONS" :key="key" :tooltip="hint">
        <c-button
          size="small"
          round
          :type="options[key] ? 'primary' : 'default'"
          :aria-pressed="options[key]"
          :data-test-id="`option-${key}`"
          @click="toggleOption(key)"
        >
          <icon-mdi-check v-if="options[key]" mr-1 aria-hidden="true" />
          {{ label }}
        </c-button>
      </c-tooltip>
    </div>

    <div class="sr-only" role="status" aria-live="polite" data-test-id="copy-status">
      {{ announcement }}
    </div>
  </div>
</template>

<style lang="less" scoped>
.whitespace-cleaner {
  flex: 1 1 100% !important;
  max-width: 1216px;
  min-width: 0;
}

.panes {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 16px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.pane {
  min-width: 0;
}

.pane-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
}

.pane-title,
.pane-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.output-hint {
  margin-top: 4px;
  font-size: 12px;
  opacity: 0.6;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
}
</style>
