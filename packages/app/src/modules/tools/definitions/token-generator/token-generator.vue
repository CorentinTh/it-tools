<script setup lang="ts">
import { useRefreshableState } from '~/src/modules/shared/composables/useRefreshableState';
import { Button } from '~/src/modules/ui/components/button';
import { createToken } from './token-generator.models';

const withUppercase = ref(true);
const withLowercase = ref(true);
const withNumbers = ref(true);
const withSymbols = ref(false);
const length = ref(64);

const [token, refreshToken] = useRefreshableState(
  'token-generator:token',
  () => createToken({
    withUppercase: withUppercase.value,
    withLowercase: withLowercase.value,
    withNumbers: withNumbers.value,
    withSymbols: withSymbols.value,
    length: length.value,
  }),
);

watch([withUppercase, withLowercase, withNumbers, withSymbols, length], refreshToken);

// const { copy: copyToken } = useCopy({ source: token, notificationText: 'Token copied to clipboard' });
</script>

<template>
  <div class="max-w-screen-md mx-auto p-6">
    <div>{{ token }}</div>

    <Button class="mt-4" @click="refreshToken">
      Generate new token
    </Button>
  </div>
</template>
