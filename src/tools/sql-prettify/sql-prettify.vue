<script setup lang="ts">
import type { FormatOptionsWithLanguage } from 'sql-formatter';
import { createSqlWorkerClient } from './sql-prettify.worker-client';
import { SQL_LIVE_MAX_BYTES, SQL_MAX_INPUT_BYTES } from './sql-prettify.worker.protocol';
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import { useBoundedTextTransform } from '@/composable/bounded-text-transform';
import { downloadTextFile } from '@/composable/downloadText';

const SQL_LARGE_OUTPUT_PREVIEW_BYTES = 16 * 1024;

const inputComponent = ref<{ inputWrapperRef?: HTMLElement }>();
const config = reactive<FormatOptionsWithLanguage>({
  keywordCase: 'upper',
  useTabs: false,
  language: 'sql',
  indentStyle: 'standard',
  tabulateAlias: true,
});

const rawSQL = ref('select field1,field2,field3 from my_table where my_condition;');
const client = createSqlWorkerClient();
const {
  cancel,
  hasError,
  isRunning,
  output: prettySQL,
  run,
  state,
} = useBoundedTextTransform({
  client,
  createTask: () => ({ options: { ...config }, source: rawSQL.value }),
  debounceMs: 250,
  label: 'SQL formatting',
  liveMaxBytes: SQL_LIVE_MAX_BYTES,
  maxInputBytes: SQL_MAX_INPUT_BYTES,
  source: rawSQL,
  watchSources: [
    rawSQL,
    () => config.language,
    () => config.keywordCase,
    () => config.indentStyle,
    () => config.useTabs,
    () => config.tabulateAlias,
  ],
});

function download(): void {
  downloadTextFile({ content: prettySQL.value, filename: 'formatted.sql' });
}
</script>

<template>
  <div class="c-tool-workbench c-tool-stack">
    <section aria-label="Formatting options">
      <c-card title="Formatting options">
        <div grid grid-cols-1 gap-3 md:grid-cols-3>
          <c-select
            v-model:value="config.language"
            label="Dialect"
            :options="[
              { label: 'GCP BigQuery', value: 'bigquery' },
              { label: 'IBM DB2', value: 'db2' },
              { label: 'Apache Hive', value: 'hive' },
              { label: 'MariaDB', value: 'mariadb' },
              { label: 'MySQL', value: 'mysql' },
              { label: 'Couchbase N1QL', value: 'n1ql' },
              { label: 'Oracle PL/SQL', value: 'plsql' },
              { label: 'PostgreSQL', value: 'postgresql' },
              { label: 'Amazon Redshift', value: 'redshift' },
              { label: 'Spark', value: 'spark' },
              { label: 'Standard SQL', value: 'sql' },
              { label: 'sqlite', value: 'sqlite' },
              { label: 'SQL Server Transact-SQL', value: 'tsql' },
            ]"
          />
          <c-select
            v-model:value="config.keywordCase" label="Keyword case"
            :options="[
              { label: 'UPPERCASE', value: 'upper' },
              { label: 'lowercase', value: 'lower' },
              { label: 'Preserve', value: 'preserve' },
            ]"
          />
          <c-select
            v-model:value="config.indentStyle" label="Indent style"
            :options="[
              { label: 'Standard', value: 'standard' },
              { label: 'Tabular left', value: 'tabularLeft' },
              { label: 'Tabular right', value: 'tabularRight' },
            ]"
          />
        </div>
      </c-card>
    </section>

    <c-field class="c-tool-panel" label="Your SQL query">
      <c-input-text
        ref="inputComponent"
        v-model:value="rawSQL"
        aria-label="Your SQL query"
        placeholder="Put your SQL query here..."
        rows="20"
        multiline
        autocomplete="off"
        autocorrect="off"
        autocapitalize="off"
        spellcheck="false"
        monospace
      />
    </c-field>
    <div class="c-task-actions">
      <c-button type="primary" data-test-id="sql-format-run" :disabled="rawSQL.trim() === '' || isRunning" @click="run">
        {{ isRunning ? 'Formatting…' : 'Run SQL formatting' }}
      </c-button>
      <c-button v-if="isRunning" type="warning" data-test-id="sql-format-cancel" @click="cancel">
        Cancel
      </c-button>
    </div>
    <p
      v-if="state.message"
      data-test-id="sql-format-status"
      role="status"
      aria-live="polite"
      :class="{ 'status-error': hasError }"
    >
      {{ state.message }}
    </p>
    <c-field class="c-tool-panel" label="Prettified version of your query">
      <TextareaCopyable
        :value="prettySQL"
        language="sql"
        :large-preview-bytes="SQL_LARGE_OUTPUT_PREVIEW_BYTES"
        :follow-height-of="inputComponent?.inputWrapperRef"
      />
    </c-field>
    <div class="c-task-actions">
      <c-button data-test-id="sql-download" :disabled="prettySQL === ''" @click="download">
        Download complete SQL
      </c-button>
    </div>
  </div>
</template>

<style lang="less" scoped>
.result-card {
  position: relative;
  .copy-button {
    position: absolute;
    top: 10px;
    right: 10px;
  }
}

.status-error {
  color: var(--n-feedback-text-color-error);
}
</style>
