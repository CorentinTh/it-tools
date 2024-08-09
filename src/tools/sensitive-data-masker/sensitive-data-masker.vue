<script setup lang="ts">
import { type MatcherNames, maskSensitiveData } from './sensitive-data-masker.service';
import { withDefaultOnError } from '@/utils/defaults';

const defaultValue = `{
  email: 'john.doe@example.com',
  creditCard: '1234 5678 9000 9876',
  id: '3f8a43fd-6489-4ec7-bd55-7a1ba172d77b',
  name: 'John',
  surname: 'Doe',
  phone: '+358 40 1234567',
  url: 'truc.google.com',
  ip4: '83.24.45.56',
  ip6: '2001:db8:0:85a3:0:0:ac1f:8001',
  mac: '3D:F2:C9:A6:B3:4F',
  token: 'eyJhbGciOiJIUzI1NiJ9.ew0KICAic3ViIjogIjEyMzQ1Njc4OTAiLA0KICAibmFtZSI6ICJBbGV4IEtvemxvdiIsDQogICJpYXQiOiAxNTE2MjM5MDIyDQp9.PNKysYFTCenU5bekHCmwIxCUXoYG41H_xc3uN3ZF_b8',
}`;

const customRegex = useStorage('sensitive-data:regex', '');
const excludedMatchers = useStorage('sensitive-data:exclude', [] as string[]);
const allMatchers = [
  'uuid', 'creditCard', 'ssn', 'url', 'ipv4', 'email',
  'passwordInUri', 'mac', 'ipv6', 'urlWithOrWithoutPrefix',
  'jwt', 'phone'];

function transformer(value: string) {
  return withDefaultOnError(() => maskSensitiveData({
    value,
    customRegex: customRegex.value,
    excludedMatchers: excludedMatchers.value as MatcherNames[],
  }), '');
}
</script>

<template>
  <div style="max-width: 600px;">
    <c-input-text
      v-model:value="customRegex"
      label="Your custom cleaning regex(es) (case insensitive):"
      placeholder="Your custom cleaning regex(es)"
      raw-text
      multiline
      rows="4"
      mb-2
    />

    <n-select
      v-model:value="excludedMatchers"
      placeholder="No Fallback"
      multiple
      :fallback-option="false"
      :options="allMatchers.map(v => ({ label: v, value: v }))"
      mb-2
    />

    <format-transformer
      input-label="Your log/textual data:"
      :input-default="defaultValue"
      input-placeholder="Paste your log/textual data here..."
      output-label="Cleaned version:"
      :transformer="transformer"
    />
  </div>
</template>
