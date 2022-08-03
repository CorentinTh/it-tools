<template>
  <div style="flex: 0 0 100%">
    <n-space item-style="flex:1 1 0" style="margin: 0 auto; max-width: 600px" :vertical="styleStore.isSmallScreen">
      <n-form-item label="Dialect" label-width="500">
        <n-select
          v-model:value="config.language"
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
      </n-form-item>
      <n-form-item label="Keyword case">
        <n-select
          v-model:value="config.keywordCase"
          :options="[
            { label: 'UPPERCASE', value: 'upper' },
            { label: 'lowercase', value: 'lower' },
            { label: 'Preserve', value: 'preserve' },
          ]"
        />
      </n-form-item>
      <n-form-item label="Indent style">
        <n-select
          v-model:value="config.indentStyle"
          :options="[
            { label: 'Standard', value: 'standard' },
            { label: 'Tabular left', value: 'tabularLeft' },
            { label: 'Tabular right', value: 'tabularRight' },
          ]"
        />
      </n-form-item>
    </n-space>
  </div>

  <n-form-item label="Your SQL query">
    <n-input
      ref="inputElement"
      v-model:value="rawSQL"
      placeholder="Put your SQL query here..."
      type="textarea"
      rows="20"
      autocomplete="off"
      autocorrect="off"
      autocapitalize="off"
      spellcheck="false"
    />
  </n-form-item>
  <n-form-item label="Prettify version of your query">
    <textarea-copyable :value="prettySQL" language="sql" :follow-height-of="inputElement" />
  </n-form-item>
</template>

<script setup lang="ts">
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import { useStyleStore } from '@/stores/style.store';
import { format as formatSQL, type FormatFnOptions } from 'sql-formatter';
import { computed, reactive, ref } from 'vue';

const inputElement = ref<HTMLElement>();
const styleStore = useStyleStore();
const config = reactive<Partial<FormatFnOptions>>({
  keywordCase: 'upper',
  useTabs: false,
  language: 'sql',
  indentStyle: 'standard',
  tabulateAlias: true,
});

const rawSQL = ref('select field1,field2,field3 from my_table where my_condition;');
const prettySQL = computed(() => formatSQL(rawSQL.value, config));
</script>

<style lang="less" scoped>
.result-card {
  position: relative;
  .copy-button {
    position: absolute;
    top: 10px;
    right: 10px;
  }
}
</style>
