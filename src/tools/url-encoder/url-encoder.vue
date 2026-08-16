<script setup lang="ts">
import {
  type UrlEncodingMode,
  decodeUrlText,
  encodeUrlText,
  urlEncodingModes,
} from './url-encoder.model';
import {
  URL_WORKSPACE_MAX_BYTES,
  buildTextFragmentUrl,
  buildUtmUrl,
  defangUrl,
  refangUrl,
  removeTrackingParameters,
} from './url-safety.service';
import { useCopy } from '@/composable/copy';
import { useValidation } from '@/composable/validation';
import { isNotThrowing } from '@/utils/boolean';
import { withDefaultOnError } from '@/utils/defaults';

const mode = ref<UrlEncodingMode>('component');
const modeDescription = computed(() => urlEncodingModes.find(({ value }) => value === mode.value)?.description ?? '');

const encodeInput = ref('Hello world :)');
const encodeOutput = computed(() => withDefaultOnError(() => encodeUrlText(encodeInput.value, mode.value), ''));

const encodedValidation = useValidation({
  source: encodeInput,
  rules: [
    {
      validator: value => isNotThrowing(() => encodeUrlText(value, mode.value)),
      message: 'This string cannot be encoded as valid UTF-8',
    },
  ],
  watch: [mode],
});

const { copy: copyEncoded } = useCopy({ source: encodeOutput, text: 'Encoded string copied to the clipboard' });

const decodeInput = ref('Hello%20world%20%3A)');
const decodeOutput = computed(() => withDefaultOnError(() => decodeUrlText(decodeInput.value, mode.value), ''));

const decodeValidation = useValidation({
  source: decodeInput,
  rules: [
    {
      validator: value => isNotThrowing(() => decodeUrlText(value, mode.value)),
      message: 'This value contains malformed percent-encoding or invalid UTF-8',
    },
  ],
  watch: [mode],
});

const { copy: copyDecoded } = useCopy({ source: decodeOutput, text: 'Decoded string copied to the clipboard' });

const safetyInput = ref('https://example.com/article?utm_source=newsletter&keep=1');
const safetyOutput = ref('');
const removedParameters = ref<string[]>([]);
const safetyError = ref('');
const utmSource = ref('newsletter');
const utmMedium = ref('email');
const utmCampaign = ref('spring-launch');
const utmTerm = ref('');
const utmContent = ref('');
const fragmentStart = ref('important text');
const fragmentEnd = ref('');
const fragmentPrefix = ref('');
const fragmentSuffix = ref('');

function runSafetyAction(action: () => string, removed: string[] = []) {
  try {
    safetyOutput.value = action();
    removedParameters.value = removed;
    safetyError.value = '';
  }
  catch (error) {
    safetyError.value = error instanceof Error ? error.message : 'The URL operation failed.';
  }
}

function removeTrackers() {
  try {
    const result = removeTrackingParameters(safetyInput.value);
    runSafetyAction(() => result.url, result.removedParameters);
  }
  catch (error) {
    safetyError.value = error instanceof Error ? error.message : 'The URL operation failed.';
  }
}

function buildCampaign() {
  runSafetyAction(() => buildUtmUrl(safetyInput.value, {
    source: utmSource.value,
    medium: utmMedium.value,
    campaign: utmCampaign.value,
    term: utmTerm.value,
    content: utmContent.value,
  }));
}

function buildFragment() {
  runSafetyAction(() => buildTextFragmentUrl(safetyInput.value, {
    start: fragmentStart.value,
    end: fragmentEnd.value,
    prefix: fragmentPrefix.value,
    suffix: fragmentSuffix.value,
  }));
}

const { copy: copySafetyOutput } = useCopy({ source: safetyOutput, text: 'URL copied to the clipboard' });
</script>

<template>
  <div class="c-tool-workbench c-tool-stack">
    <c-card title="Encoding mode">
      <c-select
        v-model:value="mode"
        label="Standard:"
        :options="urlEncodingModes"
        mb-2
      />
      <p m-0 text-sm op-70>
        {{ modeDescription }}
      </p>
    </c-card>

    <c-card title="Encode">
      <c-input-text
        v-model:value="encodeInput"
        class="mb-3"
        label="Your string :"
        placeholder="The string to encode"
        rows="2"
        :autosize="true"
        :multiline="true"
        :validation="encodedValidation"
      />

      <c-input-text
        :value="encodeOutput"
        class="mb-3"
        label="Your string encoded :"
        placeholder="Your string encoded"
        rows="2"
        :autosize="true"
        :multiline="true"
        :readonly="true"
      />

      <div flex justify-center>
        <c-button @click="copyEncoded()">
          Copy
        </c-button>
      </div>
    </c-card>
    <c-card title="Decode">
      <c-input-text
        v-model:value="decodeInput"
        class="mb-3"
        label="Your encoded string :"
        placeholder="The string to decode"
        rows="2"
        :autosize="true"
        :multiline="true"
        :validation="decodeValidation"
      />

      <c-input-text
        :value="decodeOutput"
        class="mb-3"
        label="Your string decoded :"
        placeholder="Your string decoded"
        rows="2"
        :autosize="true"
        :multiline="true"
        :readonly="true"
      />

      <div flex justify-center>
        <c-button @click="copyDecoded()">
          Copy
        </c-button>
      </div>
    </c-card>

    <c-card title="URL safety input">
      <c-input-text
        v-model:value="safetyInput"
        label="Absolute HTTP or HTTPS URL"
        placeholder="https://example.com/path?utm_source=campaign"
        test-id="url-safety-input"
        raw-text multiline monospace
        :rows="4"
        :maxlength="URL_WORKSPACE_MAX_BYTES"
      />
      <p mt-2 text-sm op-70>
        Operations run only when selected, stay in this tab, and never navigate to the result. URLs with embedded credentials are rejected.
      </p>
      <c-alert v-if="safetyError" title="URL operation failed" mt-3 data-test-id="url-safety-error">
        {{ safetyError }}
      </c-alert>
    </c-card>

    <c-card title="Clean, defang, or refang">
      <div class="c-task-actions">
        <c-button type="primary" data-test-id="url-remove-trackers" @click="removeTrackers">
          Remove known trackers
        </c-button>
        <c-button data-test-id="url-defang" @click="runSafetyAction(() => defangUrl(safetyInput))">
          Defang
        </c-button>
        <c-button data-test-id="url-refang" @click="runSafetyAction(() => refangUrl(safetyInput))">
          Refang
        </c-button>
      </div>
      <p v-if="removedParameters.length" mt-3 text-sm data-test-id="url-removed-parameters">
        Removed parameter names: {{ removedParameters.join(', ') }}. Values are intentionally not echoed.
      </p>
    </c-card>

    <c-card title="UTM campaign authoring">
      <div grid grid-cols-1 gap-3 md:grid-cols-2>
        <c-input-text v-model:value="utmSource" label="Source" :maxlength="256" raw-text />
        <c-input-text v-model:value="utmMedium" label="Medium" :maxlength="256" raw-text />
        <c-input-text v-model:value="utmCampaign" label="Campaign" :maxlength="256" raw-text />
        <c-input-text v-model:value="utmTerm" label="Term (optional)" :maxlength="256" raw-text />
        <c-input-text v-model:value="utmContent" label="Content (optional)" :maxlength="256" raw-text />
      </div>
      <div class="c-task-actions" mt-3>
        <c-button type="primary" data-test-id="url-build-utm" @click="buildCampaign">
          Build UTM URL
        </c-button>
      </div>
    </c-card>

    <c-card title="Text fragment authoring">
      <div grid grid-cols-1 gap-3 md:grid-cols-2>
        <c-input-text v-model:value="fragmentStart" label="Start text" :maxlength="256" raw-text />
        <c-input-text v-model:value="fragmentEnd" label="End text (optional)" :maxlength="256" raw-text />
        <c-input-text v-model:value="fragmentPrefix" label="Prefix (optional)" :maxlength="256" raw-text />
        <c-input-text v-model:value="fragmentSuffix" label="Suffix (optional)" :maxlength="256" raw-text />
      </div>
      <div class="c-task-actions" mt-3>
        <c-button type="primary" data-test-id="url-build-fragment" @click="buildFragment">
          Build text fragment URL
        </c-button>
      </div>
    </c-card>

    <c-input-text
      :value="safetyOutput"
      label="Safety / authoring output"
      placeholder="Select an operation to produce a URL"
      test-id="url-safety-output"
      raw-text multiline monospace readonly
      :rows="4"
    />
    <div class="c-task-actions">
      <c-button :disabled="!safetyOutput" data-test-id="url-safety-copy" @click="copySafetyOutput()">
        Copy output
      </c-button>
    </div>
  </div>
</template>
