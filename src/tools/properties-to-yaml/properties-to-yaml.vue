<script setup lang="ts">
import { stringify as stringifyToYaml } from 'yaml';
import { withDefaultOnError } from '../../utils/defaults';
import { isValidProperties, parseProperties } from './properties-to-yaml.service';
import type { UseValidationRule } from '@/composable/validation';

const transformer = (value: string) => value.trim() === '' ? '' : withDefaultOnError(() => stringifyToYaml(parseProperties(value)), '');
const rules: UseValidationRule<string>[] = [
  {
    validator: isValidProperties,
    message: 'Invalid .properties given.',
  },
];
</script>

<template>
  <format-transformer
    input-label="Your Properties"
    input-placeholder="Paste your Properties here..."
    output-label="YAML from your Properties"
    output-language="yaml"
    :input-validation-rules="rules"
    :transformer="transformer"
  />
</template>
