<script setup lang="ts">
import { TidyURL } from 'tidy-url';
import { Check as CheckIcon, LetterX as CrossIcon } from '@vicons/tabler';
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import { withDefaultOnError } from '@/utils/defaults';

const inputUrl = ref('');
const cleanedUrl = computed(() => withDefaultOnError(() => TidyURL.clean(inputUrl.value), undefined));
const isClean = computed(() => withDefaultOnError(() => TidyURL.clean(inputUrl.value)?.url === inputUrl.value, false));
</script>

<template>
  <c-card title="Clean url">
    <c-input-text
      v-model:value="inputUrl"
      placeholder="Put your url here..."
      label="Url to clean"
    />

    <n-divider />

    <div v-if="inputUrl">
      <n-p v-if="isClean" text-center>
        <n-icon color="green">
          <CheckIcon />
        </n-icon>
        Is clean
      </n-p>
      <n-p v-if="!isClean" text-center>
        <n-icon color="red">
          <CrossIcon />
        </n-icon>
        Was not clean
      </n-p>
      <TextareaCopyable
        label="Cleaned url"
        :value="cleanedUrl?.url || ''"
        placeholder="The cleaned url will be here"
        mb-5
        mt-5
      />
      <n-p text-center>
        <n-a :href="cleanedUrl?.url" target="_blank" rel="noopener noreferrer">
          {{ cleanedUrl?.url }}
        </n-a>
      </n-p>
    </div>
  </c-card>
</template>
