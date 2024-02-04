<script setup lang="ts">
import { stringify as stringifyToml } from 'iarna-toml-esm';
import { parse as parseYaml } from 'yaml';
import { withDefaultOnError } from '../../utils/defaults';
import type { UseValidationRule } from '@/composable/validation';

const convertYamlToToml = (value: string) => [stringifyToml(parseYaml(value))].flat().join('\n').trim();

const transformer = (value: string) => value.trim() === '' ? '' : withDefaultOnError(() => convertYamlToToml(value), '');

const rules: UseValidationRule<string>[] = [
  {
    validator: (v: string) => v === '' || parseYaml(v),
    message: '无效的YAML',
  },
];
</script>

<template>
  <format-transformer
    input-label="YAML"
    input-placeholder="请输入YAML"
    output-label="TOML"
    output-language="toml"
    :input-validation-rules="rules"
    :transformer="transformer"
  />
</template>
