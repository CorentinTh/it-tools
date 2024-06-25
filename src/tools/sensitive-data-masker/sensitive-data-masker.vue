<script setup lang="ts">
import maskSensitiveData from 'mask-sensitive-data';
import { withDefaultOnError } from '@/utils/defaults';

const defaultValue = `
{
  email: 'john.doe@example.com',
  creditCard: '1234 5678 9000 9876',
  id: '3f8a43fd-6489-4ec7-bd55-7a1ba172d77b',
  name: 'John',
  surname: 'Doe',
  phone: '+358 40 1234567',
  token: 'eyJhbGciOiJIUzI1NiJ9.ew0KICAic3ViIjogIjEyMzQ1Njc4OTAiLA0KICAibmFtZSI6ICJBbGV4IEtvemxvdiIsDQogICJpYXQiOiAxNTE2MjM5MDIyDQp9.PNKysYFTCenU5bekHCmwIxCUXoYG41H_xc3uN3ZF_b8',
}
`;
function transformer(value: string) {
  return withDefaultOnError(() => maskSensitiveData(value), '');
}
</script>

<template>
  <format-transformer
    input-label="Your log/textual data:"
    :input-default="defaultValue"
    input-placeholder="Paste your log/textual data here..."
    output-label="Cleaned version:"
    :transformer="transformer"
  />
</template>
