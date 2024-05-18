<script setup lang="ts">
import { request } from 'malicious-link-detector';
import { useValidation } from '@/composable/validation';
import { useQueryParam } from '@/composable/queryParams';

/*
What tool do you want?
Send Message via Whatsapp Web

Describe the solution you'd like
I would like to have an input field where I can write a mobile number and a textfield, where I can send a message.
A button "Send" which will open the follwowing url:

https://web.whatsapp.com/send/?phone=THE_MOBILE_NUMBER&text=THE_MESSAGE

it is important that the number is formatted correctly:
the "0" at the beginning should be "49" (for germany) and all spaces or characters like "-" should be removed.
*/

const url = useQueryParam({ name: 'url', defaultValue: '' });
const urlValidation = useValidation({
  source: url,
  rules: [
    {
      message: 'Invalid url string',
      validator: (value) => {
        try {
          const _ = (new URL(value));
          return true;
        }
        catch {
          return false;
        }
      },
    },
  ],
});
const result = computedAsync(async () => {
  const urlValue = url.value;
  return await request(urlValue);
});
</script>

<template>
  <div>
    <c-input-text
      v-model:value="url"
      label="Website url"
      placeholder="Put your website url here..."
      clearable
      mb-2
      :validation="urlValidation"
    />

    <c-alert v-if="result !== 'Safe'" type="error">
      Danger! '{{ url }}' website is listed as not safe by Google Safe Browsing: <strong>{{ result }}</strong>
      <c-alert />
    </c-alert>
    <c-alert v-if="result" type="success">
      This website is safe.
      <c-alert />
    </c-alert>
  </div>
</template>
