<script setup lang="ts">
import {
  clearPersistedTextDiffContent,
  readPersistedTextDiffContent,
  readTextDiffPersistencePreference,
  writePersistedTextDiffContent,
  writeTextDiffPersistencePreference,
} from './text-diff.persistence';
import CSwitch from '@/ui/c-switch/c-switch.vue';

const DEFAULT_ORIGINAL_TEXT = 'original text';
const DEFAULT_MODIFIED_TEXT = 'modified text';
const STORAGE_WRITE_DELAY_MS = 500;

const { t } = useI18n();
const originalText = ref(DEFAULT_ORIGINAL_TEXT);
const modifiedText = ref(DEFAULT_MODIFIED_TEXT);
const persistenceEnabled = ref(false);
const persistenceMessage = ref('');
let persistenceTimer: number | undefined;

function describeStorageError(error: unknown) {
  return error instanceof Error ? error.message : t('tools.text-diff.persistenceError');
}

function cancelScheduledPersistence() {
  if (persistenceTimer !== undefined) {
    window.clearTimeout(persistenceTimer);
    persistenceTimer = undefined;
  }
}

function persistCurrentContent() {
  persistenceTimer = undefined;

  if (!persistenceEnabled.value) {
    return;
  }

  try {
    writePersistedTextDiffContent(localStorage, {
      original: originalText.value,
      modified: modifiedText.value,
    });
    persistenceMessage.value = '';
  }
  catch (error) {
    persistenceMessage.value = describeStorageError(error);
  }
}

function schedulePersistence() {
  cancelScheduledPersistence();

  if (persistenceEnabled.value) {
    persistenceTimer = window.setTimeout(persistCurrentContent, STORAGE_WRITE_DELAY_MS);
  }
}

function loadOptedInContent() {
  try {
    persistenceEnabled.value = readTextDiffPersistencePreference(localStorage);

    if (!persistenceEnabled.value) {
      return;
    }

    const persistedContent = readPersistedTextDiffContent(localStorage);
    if (persistedContent) {
      originalText.value = persistedContent.original;
      modifiedText.value = persistedContent.modified;
    }
  }
  catch (error) {
    persistenceEnabled.value = false;
    persistenceMessage.value = describeStorageError(error);
  }
}

function clearSavedContent() {
  cancelScheduledPersistence();
  persistenceEnabled.value = false;

  try {
    clearPersistedTextDiffContent(localStorage);
    persistenceMessage.value = t('tools.text-diff.persistenceCleared');
  }
  catch (error) {
    persistenceMessage.value = describeStorageError(error);
  }
}

loadOptedInContent();

watch(persistenceEnabled, (enabled) => {
  try {
    writeTextDiffPersistencePreference(localStorage, enabled);
  }
  catch (error) {
    persistenceMessage.value = describeStorageError(error);
    if (enabled) {
      persistenceEnabled.value = false;
    }
    return;
  }

  if (enabled) {
    schedulePersistence();
  }
  else {
    cancelScheduledPersistence();
  }
});

watch([originalText, modifiedText], schedulePersistence);

onBeforeUnmount(() => {
  if (persistenceTimer !== undefined) {
    cancelScheduledPersistence();
    persistCurrentContent();
  }
});
</script>

<template>
  <c-card class="c-tool-workbench" w-full important:flex-1 important:pa-0>
    <div flex flex-wrap items-center gap-3 px-4 py-3>
      <CSwitch
        id="text-diff-persistence"
        v-model:value="persistenceEnabled"
        :label="t('tools.text-diff.persistenceLabel')"
        :description="t('tools.text-diff.persistenceHint')"
        label-position="top"
        min-w-280px
        flex-1
      />
      <c-button ml-auto @click="clearSavedContent">
        {{ t('tools.text-diff.clearSavedContent') }}
      </c-button>
      <p v-if="persistenceMessage" w-full text-sm text-red role="status">
        {{ persistenceMessage }}
      </p>
    </div>

    <c-diff-editor
      v-model:original-text="originalText"
      v-model:modified-text="modifiedText"
    />
  </c-card>
</template>
