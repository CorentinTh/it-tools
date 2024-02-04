<script setup lang="ts">
import { parse as parseToml } from 'iarna-toml-esm';
import { stringify as stringifyToYaml } from 'yaml';
import { withDefaultOnError } from '../../utils/defaults';
import { isValidToml } from '../toml-to-json/toml.services';
import type { UseValidationRule } from '@/composable/validation';

const transformer = (value: string) => value.trim() === '' ? '' : withDefaultOnError(() => stringifyToYaml(parseToml(value)), '');

const rules: UseValidationRule<string>[] = [
  {
    validator: isValidToml,
    message: '无效的TOML',
  },
];
</script>

<template>
  <format-transformer
    input-label="TOML"
    input-placeholder="输入TOML"
    output-label="YAML"
    output-language="yaml"
    :input-validation-rules="rules"
    :transformer="transformer"
  />
</template>
