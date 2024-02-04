<script setup lang="ts">
import { type FormatOptionsWithLanguage, format as formatSQL } from 'sql-formatter';
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import { useStyleStore } from '@/stores/style.store';

const inputElement = ref<HTMLElement>();
const styleStore = useStyleStore();
const config = reactive<FormatOptionsWithLanguage>({
  keywordCase: 'upper',
  useTabs: false,
  language: 'sql',
  indentStyle: 'standard',
  tabulateAlias: true,
});

const rawSQL = ref('select field1,field2,field3 from my_table where my_condition;');
const prettySQL = computed(() => formatSQL(rawSQL.value, config));
</script>

<template>
  <div style="flex: 0 0 100%">
    <div style="max-width: 600px" :class="{ 'flex-col': styleStore.isSmallScreen }" mx-auto mb-5 flex gap-2>
      <c-select
        v-model:value="config.language"
        flex-1
        label="语句类型"
        :options="[
          { label: '标准SQL', value: 'sql' },
          { label: 'Amazon Redshift', value: 'redshift' },
          { label: 'Apache Hive', value: 'hive' },
          { label: 'Couchbase N1QL', value: 'n1ql' },
          { label: 'GCP BigQuery', value: 'bigquery' },
          { label: 'IBM DB2', value: 'db2' },
          { label: 'MariaDB', value: 'mariadb' },
          { label: 'MySQL', value: 'mysql' },
          { label: 'Oracle PL/SQL', value: 'plsql' },
          { label: 'PostgreSQL', value: 'postgresql' },
          { label: 'Spark', value: 'spark' },
          { label: 'SQL Server T-SQL', value: 'tsql' },
          { label: 'SQLite', value: 'sqlite' },

        ]"
      />
      <c-select
        v-model:value="config.keywordCase" label="关键词"
        flex-1
        :options="[
          { label: '大写', value: 'upper' },
          { label: '小写', value: 'lower' },
          { label: '不转换', value: 'preserve' },
        ]"
      />
      <c-select
        v-model:value="config.indentStyle" label="缩进样式"
        flex-1
        :options="[
          { label: '标准', value: 'standard' },
          { label: '左侧', value: 'tabularLeft' },
          { label: '右侧', value: 'tabularRight' },
        ]"
      />
    </div>
  </div>

  <n-form-item label="原始 SQL 查询语句">
    <c-input-text
      ref="inputElement"
      v-model:value="rawSQL"
      placeholder="输入原始 SQL 查询语句"
      rows="20"
      multiline
      autocomplete="off"
      autocorrect="off"
      autocapitalize="off"
      spellcheck="false"
      monospace
    />
  </n-form-item>
  <n-form-item label="已格式化的 SQL 查询语句">
    <TextareaCopyable :value="prettySQL" language="sql" :follow-height-of="inputElement" />
  </n-form-item>
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
</style>
