<script setup lang="ts">
import { stringify as stringifyToml } from 'iarna-toml-esm';
import JSON5 from 'json5';
import { withDefaultOnError } from '@/utils/defaults';
import type { UseValidationRule } from '@/composable/validation';

const { t } = useI18n();
const convertJsonToToml = (value: string) => [stringifyToml(JSON5.parse(value))].flat().join('\n').trim();

const transformer = (value: string) => value.trim() === '' ? '' : withDefaultOnError(() => convertJsonToToml(value), '');

const rules: UseValidationRule<string>[] = [
  {
    validator: (v: string) => v === '' || JSON5.parse(v),
    message: computed(() => t('tools.json-to-toml.invalid')),
  },
];
</script>

<template>
  <format-transformer
    :input-label="t('tools.json-to-toml.your-json')"
    :input-placeholder="t('tools.json-to-toml.placeholder.your-json')"
    :output-label="t('tools.json-to-toml.toml-from-json')"
    output-language="toml"
    :input-validation-rules="rules"
    :transformer="transformer"
  />
</template>
