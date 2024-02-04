<script setup lang="ts">
import { parse as parseToml } from 'iarna-toml-esm';
import { withDefaultOnError } from '../../utils/defaults';
import { isValidToml } from './toml.services';
import type { UseValidationRule } from '@/composable/validation';

const transformer = (value: string) => value === '' ? '' : withDefaultOnError(() => JSON.stringify(parseToml(value), null, 3), '');

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
    output-label="JSON"
    output-language="json"
    :input-validation-rules="rules"
    :transformer="transformer"
  />
</template>
