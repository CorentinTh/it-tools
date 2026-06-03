<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { strategies } from './strategies/index';
import type { Gender, GenerateOptions } from './national-id-generator.types';
import { useCopy } from '@/composable/copy';

function countryCodeToFlag(code: string): string {
  return [...code.toUpperCase()].map(c => String.fromCodePoint(0x1F1E6 + c.charCodeAt(0) - 65)).join('');
}

const countries = Object.values(strategies).map(s => ({ value: s.countryCode, label: `${countryCodeToFlag(s.countryCode)} ${s.label}` }));
const countryCode = ref('be');
const activeStrategy = computed(() => strategies[countryCode.value]);

const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
];
const selectedGender = ref<string | null>(null);
const birthDay = ref<number | null>(null);
const birthMonth = ref<number | null>(null);
const birthYear = ref<number | null>(null);

function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

const maxBirthDay = computed(() => {
  if (birthMonth.value === null) {
    return 31;
  }
  // Fall back to a leap year so Feb 29 is enterable; strategy enforces a leap year is chosen when Feb 29 is used without a fixed year
  return daysInMonth(birthYear.value ?? 2000, birthMonth.value);
});

watch([birthMonth, birthYear], () => {
  if (birthDay.value !== null && birthDay.value > maxBirthDay.value) {
    birthDay.value = maxBirthDay.value;
  }
});
const fictitious = ref(false);

const count = ref(1);

const result = ref<{ raw: string; formatted: string }[] | null>(null);
const isStale = ref(false);
const generatedFewerThanRequested = ref(false);

watch([countryCode, birthDay, birthMonth, birthYear, selectedGender, fictitious, count], () => {
  if (result.value !== null) {
    isStale.value = true;
  }
});

const formattedRef = ref('');
const rawRef = ref('');
const { copy: copyFormatted, isJustCopied: isJustCopiedFormatted } = useCopy({ source: formattedRef, createToast: false });
const { copy: copyRaw, isJustCopied: isJustCopiedRaw } = useCopy({ source: rawRef, createToast: false });

function copyRowFormatted(text: string) {
  navigator.clipboard.writeText(text);
}

function generate() {
  const opts: GenerateOptions = {};

  if (activeStrategy.value.supportsGender && (selectedGender.value === 'male' || selectedGender.value === 'female')) {
    opts.gender = selectedGender.value as Gender;
  }
  if (activeStrategy.value.supportsBirthDate) {
    if (birthYear.value !== null) {
      opts.birthYear = birthYear.value;
    }
    if (birthMonth.value !== null) {
      opts.birthMonth = birthMonth.value;
    }
    if (birthDay.value !== null) {
      opts.birthDay = birthDay.value;
    }
  }
  if (activeStrategy.value.supportsFictitious) {
    opts.fictitious = fictitious.value;
  }

  const seen = new Set<string>();
  const results: { raw: string; formatted: string }[] = [];
  const maxAttempts = count.value * 10;
  let attempts = 0;
  while (results.length < count.value && attempts < maxAttempts) {
    const r = activeStrategy.value.generate(opts);
    if (!seen.has(r.raw)) {
      seen.add(r.raw);
      results.push(r);
    }
    attempts++;
  }
  result.value = results;
  generatedFewerThanRequested.value = results.length < count.value;
  isStale.value = false;
  formattedRef.value = results.map(r => r.formatted).join('\n');
  rawRef.value = results.map(r => r.raw).join('\n');
}
</script>

<template>
  <div flex flex-col gap-4>
    <c-card title="Options">
      <div grid gap-3 style="grid-template-columns: 140px 1fr">
        <span self-center text-right text-sm op-70>Country</span>
        <c-select
          v-model:value="countryCode"
          :options="countries"
          searchable
        />

        <template v-if="activeStrategy.supportsBirthDate">
          <span self-center text-right text-sm op-70>Date of birth</span>
          <div flex gap-2>
            <n-input-number v-model:value="birthDay" :min="1" :max="maxBirthDay" placeholder="Day" clearable />
            <n-input-number v-model:value="birthMonth" :min="1" :max="12" placeholder="Month" clearable />
            <n-input-number v-model:value="birthYear" :min="1900" :max="2099" placeholder="Year" clearable />
          </div>
        </template>

        <template v-if="activeStrategy.supportsGender">
          <span self-center text-right text-sm op-70>Gender</span>
          <c-select
            v-model:value="selectedGender"
            :options="genderOptions"
            placeholder="Random"
            clearable
          />
        </template>

        <template v-if="activeStrategy.supportsFictitious">
          <span self-center text-right text-sm op-70>Fictitious</span>
          <div flex items-center gap-2>
            <n-switch v-model:value="fictitious" />
            <span text-xs op-50>Use high serial (non-existing number)</span>
          </div>
        </template>

        <span self-center text-right text-sm op-70>Count</span>
        <n-input-number v-model:value="count" :min="1" :max="100" />

        <span />
        <div>
          <c-button @click="generate">
            Generate
          </c-button>
        </div>
      </div>
    </c-card>

    <c-card title="Result">
      <n-alert v-if="isStale" type="warning" mb-3>
        Options have changed — regenerate to match current settings.
      </n-alert>
      <n-alert v-if="generatedFewerThanRequested" type="warning" mb-3>
        Only {{ result?.length }} unique ID(s) could be generated out of the {{ count }} requested.
      </n-alert>
      <div v-if="!result" flex justify-center py-4 text-sm op-40>
        Your generated ID(s) will appear here
      </div>

      <template v-else>
        <!-- Single result: keep original two-field layout -->
        <div v-if="result.length === 1" grid gap-3 style="grid-template-columns: 140px 1fr">
          <span self-center text-right text-sm op-70>Formatted</span>
          <c-input-text :value="result[0].formatted" readonly font-mono>
            <template #suffix>
              <c-tooltip :tooltip="isJustCopiedFormatted ? 'Copied!' : 'Copy to clipboard'">
                <c-button circle variant="text" size="small" @click="copyFormatted()">
                  <icon-mdi-content-copy />
                </c-button>
              </c-tooltip>
            </template>
          </c-input-text>

          <span self-center text-right text-sm op-70>Raw</span>
          <c-input-text :value="result[0].raw" readonly font-mono>
            <template #suffix>
              <c-tooltip :tooltip="isJustCopiedRaw ? 'Copied!' : 'Copy to clipboard'">
                <c-button circle variant="text" size="small" @click="copyRaw()">
                  <icon-mdi-content-copy />
                </c-button>
              </c-tooltip>
            </template>
          </c-input-text>
        </div>

        <!-- Multiple results: scrollable list with copy-all buttons -->
        <div v-else flex flex-col gap-2>
          <div

            style="grid-template-columns: 1fr 1fr auto"
            border-base grid gap-x-3 gap-y-1 border-b pb-1 text-xs op-50
          >
            <span>Formatted</span>
            <span>Raw</span>
            <span />
          </div>
          <div max-h-72 flex flex-col gap-1 overflow-y-auto pretty-scrollbar>
            <div
              v-for="(row, i) in result"
              :key="i"
              grid items-center gap-x-3
              style="grid-template-columns: 1fr 1fr auto"
            >
              <span text-sm font-mono>{{ row.formatted }}</span>
              <span text-sm font-mono op-60>{{ row.raw }}</span>
              <c-tooltip tooltip="Copy formatted">
                <c-button circle variant="text" size="small" @click="copyRowFormatted(row.formatted)">
                  <icon-mdi-content-copy />
                </c-button>
              </c-tooltip>
            </div>
          </div>
          <div border-base flex gap-2 border-t pt-2>
            <c-tooltip :tooltip="isJustCopiedFormatted ? 'Copied!' : 'Copy all formatted'">
              <c-button size="small" @click="copyFormatted()">
                <icon-mdi-content-copy mr-1 />
                Copy all formatted
              </c-button>
            </c-tooltip>
            <c-tooltip :tooltip="isJustCopiedRaw ? 'Copied!' : 'Copy all raw'">
              <c-button size="small" @click="copyRaw()">
                <icon-mdi-content-copy mr-1 />
                Copy all raw
              </c-button>
            </c-tooltip>
          </div>
        </div>
      </template>
    </c-card>
  </div>
</template>
