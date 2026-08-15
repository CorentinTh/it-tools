<script setup lang="ts">
import { useThemeVars } from 'naive-ui';
import { onBeforeRouteLeave } from 'vue-router';
import type { RegexMatchResult } from './regex-tester.service';
import { RegexWorkerClient } from './regex-tester.worker-client';
import {
  REGEX_INPUT_DEBOUNCE_MS,
  REGEX_MAX_DIAGRAM_PATTERN_BYTES,
  REGEX_MAX_INPUT_BYTES,
  REGEX_MAX_MATCHES,
  REGEX_MAX_PATTERN_BYTES,
  RegexTaskError,
  getUtf8ByteLength,
  toRegexTaskError,
} from './regex-tester.worker.protocol';
import CCheckbox from '@/ui/c-choice-group/c-checkbox.vue';
import CChoiceGroup from '@/ui/c-choice-group/c-choice-group.vue';
import { useValidation } from '@/composable/validation';
import { useQueryParam } from '@/composable/queryParams';

const REGEX_MAX_DIAGRAM_NODES = 1_500;
const REGEX_MAX_DIAGRAM_BYTES = 256 * 1024;

type TaskStatus = 'idle' | 'running' | 'success' | 'cancelled' | 'timeout' | 'error';

interface TaskViewState {
  status: TaskStatus
  elapsedMs: number
  message: string
}

const themeVars = useThemeVars();
const regexQuery = useQueryParam({ name: 'regex', defaultValue: '' });
const regex = ref(regexQuery.value);
const text = ref('');
const global = ref(true);
const ignoreCase = ref(false);
const multiline = ref(false);
const dotAll = ref(true);
const unicode = ref(true);
const unicodeSets = ref(false);
const diagramContainer = ref<HTMLElement>();

const matches = ref<RegexMatchResult[]>([]);
const matchesTruncated = ref(false);
const sample = ref('');
const matchState = reactive<TaskViewState>({ status: 'idle', elapsedMs: 0, message: '' });
const sampleState = reactive<TaskViewState>({ status: 'idle', elapsedMs: 0, message: '' });
const diagramState = reactive<TaskViewState>({ status: 'idle', elapsedMs: 0, message: '' });
const diagramInFlight = ref(false);

const matchClient = new RegexWorkerClient();
const sampleClient = new RegexWorkerClient();
let matchAttempt = 0;
let sampleAttempt = 0;
let diagramAttempt = 0;
let taskDebounceTimer: ReturnType<typeof setTimeout> | undefined;

const flags = computed(() => {
  let value = 'd';
  if (global.value) {
    value += 'g';
  }
  if (ignoreCase.value) {
    value += 'i';
  }
  if (multiline.value) {
    value += 'm';
  }
  if (dotAll.value) {
    value += 's';
  }
  if (unicode.value) {
    value += 'u';
  }
  else if (unicodeSets.value) {
    value += 'v';
  }
  return value;
});

function getPatternValidationError(value: string): string {
  const byteLength = getUtf8ByteLength(value);
  if (byteLength > REGEX_MAX_PATTERN_BYTES) {
    return `Pattern is ${byteLength.toLocaleString()} UTF-8 bytes; the limit is ${REGEX_MAX_PATTERN_BYTES.toLocaleString()} bytes.`;
  }

  try {
    RegExp(value, flags.value);
    return '';
  }
  catch (error) {
    return error instanceof Error ? error.message : 'Invalid regular expression.';
  }
}

const regexValidation = useValidation({
  source: regex,
  watch: [global, ignoreCase, multiline, dotAll, unicode, unicodeSets],
  rules: [
    {
      message: 'Invalid regex: {0}',
      validator: value => getPatternValidationError(value) === '',
      getErrorMessage: getPatternValidationError,
    },
  ],
});

const textValidation = useValidation({
  source: text,
  rules: [
    {
      message: `Text is limited to ${REGEX_MAX_INPUT_BYTES.toLocaleString()} UTF-8 bytes.`,
      validator: value => getUtf8ByteLength(value) <= REGEX_MAX_INPUT_BYTES,
    },
  ],
});

watch(unicode, (enabled) => {
  if (enabled) {
    unicodeSets.value = false;
  }
});

watch(unicodeSets, (enabled) => {
  if (enabled) {
    unicode.value = false;
  }
});

watch(regex, () => {
  ++diagramAttempt;
  clearDiagram();
  if (diagramState.status === 'running') {
    diagramState.status = 'cancelled';
    diagramState.message = 'Diagram result discarded because the pattern changed.';
  }
  else {
    resetState(diagramState);
  }
});

watch(regexQuery, (value) => {
  if (value !== regex.value) {
    regex.value = value;
  }
});

function resetState(state: TaskViewState): void {
  state.status = 'idle';
  state.elapsedMs = 0;
  state.message = '';
}

function beginTask(state: TaskViewState): ReturnType<typeof setInterval> {
  state.status = 'running';
  state.elapsedMs = 0;
  state.message = '';
  const startedAt = performance.now();

  return setInterval(() => {
    state.elapsedMs = Math.max(0, performance.now() - startedAt);
  }, 100);
}

function applyTaskError(state: TaskViewState, error: unknown): void {
  const taskError = toRegexTaskError(error);
  state.elapsedMs = taskError.elapsedMs;
  state.message = taskError.message;

  if (taskError.code === 'cancelled') {
    state.status = 'cancelled';
  }
  else if (taskError.code === 'timeout') {
    state.status = 'timeout';
  }
  else {
    state.status = 'error';
  }
}

function markInputChangeCancellation(): void {
  if (matchState.status === 'running') {
    matchState.status = 'cancelled';
    matchState.message = 'Matching cancelled because its input changed.';
  }
  else {
    resetState(matchState);
  }

  if (sampleState.status === 'running') {
    sampleState.status = 'cancelled';
    sampleState.message = 'Sample generation cancelled because its input changed.';
  }
  else {
    resetState(sampleState);
  }
}

async function runMatching(): Promise<void> {
  const attempt = ++matchAttempt;
  const task = { operation: 'match' as const, pattern: regex.value, text: text.value, flags: flags.value };
  const elapsedTimer = beginTask(matchState);

  try {
    const result = await matchClient.run(task);
    if (attempt !== matchAttempt) {
      return;
    }

    matches.value = result.value.matches;
    matchesTruncated.value = result.value.truncated;
    matchState.status = 'success';
    matchState.elapsedMs = result.elapsedMs;
    matchState.message = result.value.truncated
      ? `Showing bounded results (up to ${REGEX_MAX_MATCHES} matches).`
      : `${result.value.matches.length} match${result.value.matches.length === 1 ? '' : 'es'} found.`;
  }
  catch (error) {
    if (attempt === matchAttempt) {
      applyTaskError(matchState, error);
    }
  }
  finally {
    clearInterval(elapsedTimer);
  }
}

async function runSampleGeneration(): Promise<void> {
  const attempt = ++sampleAttempt;
  const task = { operation: 'sample' as const, pattern: regex.value, flags: flags.value };
  const elapsedTimer = beginTask(sampleState);

  try {
    const result = await sampleClient.run(task);
    if (attempt !== sampleAttempt) {
      return;
    }

    sample.value = result.value;
    sampleState.status = 'success';
    sampleState.elapsedMs = result.elapsedMs;
    sampleState.message = 'Sample generated.';
  }
  catch (error) {
    if (attempt === sampleAttempt) {
      applyTaskError(sampleState, error);
    }
  }
  finally {
    clearInterval(elapsedTimer);
  }
}

function runTasks(): void {
  runMatching();
  runSampleGeneration();
}

function scheduleTasks(): void {
  clearTimeout(taskDebounceTimer);
  ++matchAttempt;
  ++sampleAttempt;
  matchClient.cancel('Matching cancelled because its input changed.');
  sampleClient.cancel('Sample generation cancelled because its input changed.');
  markInputChangeCancellation();
  matches.value = [];
  matchesTruncated.value = false;
  sample.value = '';

  taskDebounceTimer = setTimeout(runTasks, REGEX_INPUT_DEBOUNCE_MS);
}

watch([regex, text, flags], scheduleTasks, { immediate: true, flush: 'post' });

function cancelTasks(): void {
  clearTimeout(taskDebounceTimer);
  matchClient.cancel('Matching cancelled by the user.');
  sampleClient.cancel('Sample generation cancelled by the user.');
}

function formatElapsed(elapsedMs: number): string {
  if (elapsedMs < 1) {
    return '<1 ms';
  }
  if (elapsedMs < 1_000) {
    return `${Math.round(elapsedMs)} ms`;
  }
  return `${(elapsedMs / 1_000).toFixed(2)} s`;
}

function getStatusText(label: string, state: TaskViewState): string {
  if (state.status === 'idle') {
    return '';
  }
  if (state.status === 'running') {
    return `${label} running · ${formatElapsed(state.elapsedMs)}`;
  }
  if (state.status === 'success') {
    return `${state.message} Completed in ${formatElapsed(state.elapsedMs)}.`;
  }
  return state.message;
}

const matchStatusText = computed(() => getStatusText('Matching', matchState));
const sampleStatusText = computed(() => getStatusText('Sample generation', sampleState));
const tasksRunning = computed(() => matchState.status === 'running' || sampleState.status === 'running');

function clearDiagram(): void {
  diagramContainer.value?.replaceChildren();
}

async function renderDiagram(): Promise<void> {
  if (diagramInFlight.value) {
    return;
  }

  const attempt = ++diagramAttempt;
  const pattern = regex.value;
  const patternBytes = getUtf8ByteLength(pattern);
  clearDiagram();

  if (patternBytes > REGEX_MAX_DIAGRAM_PATTERN_BYTES) {
    applyTaskError(
      diagramState,
      new RegexTaskError(
        'limit',
        `Diagram patterns are limited to ${REGEX_MAX_DIAGRAM_PATTERN_BYTES.toLocaleString()} UTF-8 bytes.`,
      ),
    );
    return;
  }

  const syntaxError = getPatternValidationError(pattern);
  if (syntaxError) {
    applyTaskError(diagramState, new RegexTaskError('syntax', syntaxError));
    return;
  }

  diagramInFlight.value = true;
  const elapsedTimer = beginTask(diagramState);
  const startedAt = performance.now();

  try {
    await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
    const { render } = await import('@regexper/render');
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    await render(pattern, svg);

    if (attempt !== diagramAttempt) {
      return;
    }

    const nodeCount = svg.querySelectorAll('*').length;
    const byteLength = getUtf8ByteLength(svg.outerHTML);
    if (nodeCount > REGEX_MAX_DIAGRAM_NODES || byteLength > REGEX_MAX_DIAGRAM_BYTES) {
      throw new RegexTaskError(
        'limit',
        `Diagram output exceeded its ${REGEX_MAX_DIAGRAM_NODES.toLocaleString()}-node or ${REGEX_MAX_DIAGRAM_BYTES.toLocaleString()}-byte limit.`,
      );
    }

    const visualizer = diagramContainer.value;
    if (!visualizer) {
      throw new RegexTaskError('operation', 'The diagram surface is not available yet.');
    }
    visualizer.replaceChildren(svg);
    diagramState.status = 'success';
    diagramState.elapsedMs = Math.max(0, performance.now() - startedAt);
    diagramState.message = `Diagram rendered with ${nodeCount.toLocaleString()} nodes.`;
  }
  catch (error) {
    if (attempt === diagramAttempt) {
      applyTaskError(diagramState, error);
    }
  }
  finally {
    clearInterval(elapsedTimer);
    diagramInFlight.value = false;
  }
}

const diagramStatusText = computed(() => getStatusText('Diagram rendering', diagramState));

function disposeRegexTasks(): void {
  clearTimeout(taskDebounceTimer);
  ++matchAttempt;
  ++sampleAttempt;
  ++diagramAttempt;
  matchClient.dispose();
  sampleClient.dispose();
  clearDiagram();
}

onBeforeRouteLeave(() => {
  disposeRegexTasks();
});

onUnmounted(() => {
  disposeRegexTasks();
});
</script>

<template>
  <div class="c-tool-workbench c-task-layout">
    <c-card title="Regex">
      <c-input-text
        v-model:value="regex"
        test-id="regex-pattern"
        label="Regex to test"
        placeholder="Put the regex to test"
        raw-text
        multiline
        rows="3"
        :validation="regexValidation"
      />
      <router-link target="_blank" to="/regex-memo" my-2 inline-block>
        See Regular Expression Cheatsheet
      </router-link>

      <CChoiceGroup
        label="Flags"
        description="Each flag independently changes how the expression is evaluated. Unicode and Unicode Sets are mutually exclusive."
      >
        <CCheckbox v-model:checked="global">
          <span title="Global search">Global search. (<code>g</code>)</span>
        </CCheckbox>
        <CCheckbox v-model:checked="ignoreCase">
          <span title="Case-insensitive search">Case-insensitive search. (<code>i</code>)</span>
        </CCheckbox>
        <CCheckbox v-model:checked="multiline">
          <span title="Allows ^ and $ to match next to newline characters.">Multiline(<code>m</code>)</span>
        </CCheckbox>
        <CCheckbox v-model:checked="dotAll">
          <span title="Allows . to match newline characters.">Singleline(<code>s</code>)</span>
        </CCheckbox>
        <CCheckbox v-model:checked="unicode">
          <span title="Unicode; treat a pattern as a sequence of Unicode code points.">Unicode(<code>u</code>)</span>
        </CCheckbox>
        <CCheckbox v-model:checked="unicodeSets">
          <span title="An upgrade to the u mode with more Unicode features.">Unicode Sets (<code>v</code>)</span>
        </CCheckbox>
      </CChoiceGroup>

      <n-divider />

      <c-input-text
        v-model:value="text"
        test-id="regex-text"
        label="Text to match"
        placeholder="Put the text to match"
        multiline
        raw-text
        rows="8"
        :validation="textValidation"
      />

      <p mt-2 text-xs op-70>
        Pattern: {{ REGEX_MAX_PATTERN_BYTES.toLocaleString() }} bytes · input: {{ REGEX_MAX_INPUT_BYTES.toLocaleString() }} bytes · output: {{ REGEX_MAX_MATCHES }} matches.
      </p>
      <div v-if="tasksRunning" class="c-task-actions" mt-3>
        <c-button type="warning" data-test-id="regex-cancel" @click="cancelTasks">
          Cancel computations
        </c-button>
      </div>
    </c-card>

    <c-card title="Matches" class="c-task-results">
      <p
        class="c-task-status"
        data-test-id="regex-match-status"
        role="status"
        aria-live="polite"
        text-sm
        :class="{ 'status-error': matchState.status === 'error' || matchState.status === 'timeout' }"
      >
        {{ matchStatusText }}
      </p>
      <n-alert v-if="matchesTruncated" type="warning" mb-3>
        Results reached a safety limit; refine the pattern or input to see a complete set.
      </n-alert>
      <div v-if="matches.length > 0" overflow-x-auto>
        <n-table data-test-id="regex-matches">
          <thead>
            <tr>
              <th scope="col">
                Index in text
              </th>
              <th scope="col">
                Value
              </th>
              <th scope="col">
                Captures
              </th>
              <th scope="col">
                Groups
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="match of matches" :key="`${match.index}:${match.value}`">
              <td>{{ match.index }}</td>
              <td>{{ match.value }}</td>
              <td>
                <ul>
                  <li v-for="capture in match.captures" :key="capture.name">
                    "{{ capture.name }}" = {{ capture.value }} [{{ capture.start }} - {{ capture.end }}]
                  </li>
                </ul>
              </td>
              <td>
                <ul>
                  <li v-for="group in match.groups" :key="group.name">
                    "{{ group.name }}" = {{ group.value }} [{{ group.start }} - {{ group.end }}]
                  </li>
                </ul>
              </td>
            </tr>
          </tbody>
        </n-table>
      </div>
      <c-alert v-else>
        No match
      </c-alert>
    </c-card>

    <c-card title="Sample matching text" class="c-task-results">
      <p
        class="c-task-status"
        data-test-id="regex-sample-status"
        role="status"
        aria-live="polite"
        text-sm
        :class="{ 'status-error': sampleState.status === 'error' || sampleState.status === 'timeout' }"
      >
        {{ sampleStatusText }}
      </p>
      <pre data-test-id="regex-sample" style="white-space: pre-wrap; word-break: break-all;">{{ sample }}</pre>
    </c-card>

    <c-card title="Regex Diagram" class="c-task-results" overflow-x-auto>
      <p mb-3 text-xs op-70>
        Diagram rendering uses the browser DOM, so it runs only when requested and applies strict pattern, node, and output limits.
      </p>
      <div class="c-task-actions">
        <c-button
          type="primary"
          data-test-id="regex-diagram-run"
          :disabled="diagramInFlight"
          @click="renderDiagram"
        >
          {{ diagramInFlight ? 'Rendering diagram…' : 'Render diagram' }}
        </c-button>
      </div>
      <p
        class="c-task-status"
        data-test-id="regex-diagram-status"
        role="status"
        aria-live="polite"
        text-sm
        :class="{ 'status-error': diagramState.status === 'error' || diagramState.status === 'timeout' }"
      >
        {{ diagramStatusText }}
      </p>
      <shadow-root>
        <div ref="diagramContainer" data-test-id="regex-diagram-surface" />
      </shadow-root>
    </c-card>
  </div>
</template>

<style lang="less" scoped>
.status-error {
  color: v-bind('themeVars.errorColor');
}
</style>
