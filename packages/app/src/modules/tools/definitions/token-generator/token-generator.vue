<script setup lang="ts">
import { times } from 'lodash-es';
import { useRefreshableState } from '~/src/modules/shared/composables/useRefreshableState';
import { Button } from '~/src/modules/ui/components/button';
import Card from '~/src/modules/ui/components/card/Card.vue';
import { Checkbox } from '~/src/modules/ui/components/checkbox';
import NumberField from '~/src/modules/ui/components/number-field/NumberField.vue';
import NumberFieldContent from '~/src/modules/ui/components/number-field/NumberFieldContent.vue';
import NumberFieldDecrement from '~/src/modules/ui/components/number-field/NumberFieldDecrement.vue';
import NumberFieldIncrement from '~/src/modules/ui/components/number-field/NumberFieldIncrement.vue';
import NumberFieldInput from '~/src/modules/ui/components/number-field/NumberFieldInput.vue';
import Slider from '~/src/modules/ui/components/slider/Slider.vue';
import { Textarea } from '~/src/modules/ui/components/textarea';
import ToggleGroup from '~/src/modules/ui/components/toggle-group/ToggleGroup.vue';
import ToggleGroupItem from '~/src/modules/ui/components/toggle-group/ToggleGroupItem.vue';
import { createToken } from './token-generator.models';

definePageMeta({
  layout: 'sidenav',
});

const withUppercase = ref(true);
const withLowercase = ref(true);
const withNumbers = ref(true);
const withSymbols = ref(false);
const length = ref(48);

const formats = {
  raw: {
    label: 'Raw',
    format: ({ tokens }: { tokens: string[] }) => tokens.join('\n'),
  },
  JSON: {
    label: 'JSON',
    format: ({ tokens }: { tokens: string[] }) => JSON.stringify(tokens),
  },
};

const format = ref<keyof typeof formats>('raw');
const quantity = ref(1);

function generateToken() {
  return createToken({
    withUppercase: withUppercase.value,
    withLowercase: withLowercase.value,
    withNumbers: withNumbers.value,
    withSymbols: withSymbols.value,
    length: length.value,
  });
}

const [token, refreshToken] = useRefreshableState(
  'token-generator:token',
  () => {
    const tokens = times(
      quantity.value,
      generateToken,
    );

    return formats[format.value].format({ tokens });
  },
);

watch([
  withUppercase,
  withLowercase,
  withNumbers,
  withSymbols,
  length,
  format,
  quantity,
], refreshToken);

// const { copy: copyToken } = useCopy({ source: token, notificationText: 'Token copied to clipboard' });
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="p-6 bg-white dark:bg-background border-b">
      <h1 class="text-2xl">
        {{ $t('tools.token-generator.title') }}
      </h1>
      <p class="text-muted-foreground">
        {{ $t('tools.token-generator.description') }}
      </p>
    </div>

    <div class="h-full flex-1 p-6">
      <Card class="max-w-[550px] mx-auto p-6 bg-white dark:bg-background shadow-none">
        <div class="grid grid-cols-2 gap-4">
          <div class="flex gap-2 items-center">
            <Checkbox id="use-uppercase" v-model:checked="withUppercase" />
            <label for="use-uppercase">
              {{ $t('tools.token-generator.use-uppercase') }}
              <span class="text-muted-foreground">
                (A-Z)
              </span>
            </label>
          </div>

          <div class="flex gap-2 items-center">
            <Checkbox id="use-lowercase" v-model:checked="withLowercase" />
            <label for="use-lowercase">
              {{ $t('tools.token-generator.use-lowercase') }}
              <span class="text-muted-foreground">
                (a-z)
              </span>
            </label>
          </div>

          <div class="flex gap-2 items-center">
            <Checkbox id="use-numbers" v-model:checked="withNumbers" />
            <label for="use-numbers">
              {{ $t('tools.token-generator.use-numbers') }}
              <span class="text-muted-foreground">
                (0-9)
              </span>
            </label>
          </div>

          <div class="flex gap-2 items-center">
            <Checkbox id="use-symbols" v-model:checked="withSymbols" />
            <label for="use-symbols">
              {{ $t('tools.token-generator.use-symbols') }}
              <span class="text-muted-foreground">
                (!@,]*...)
              </span>
            </label>
          </div>

          <div class="flex gap-4 items-center">
            <label for="length" class="shrink-0">{{ $t('tools.token-generator.length') }}</label>
            <NumberField id="length" v-model="length" :min="1" :max="1024">
              <NumberFieldContent class="flex-1">
                <NumberFieldDecrement />
                <NumberFieldInput />
                <NumberFieldIncrement />
              </NumberFieldContent>
            </NumberField>
          </div>

          <Slider
            :model-value="[length]"
            :max="512"
            :min="1"
            :step="1"
            @update:model-value="(v) => length = v?.[0] ?? 1"
          />
        </div>

        <hr class="my-6">

        <div class="mb-4 flex items-center gap-4">
          <div>{{ $t('tools.token-generator.format') }}</div>
          <ToggleGroup v-model="format" type="single" variant="outline">
            <ToggleGroupItem v-for="({ label }, key) in formats" :key="key" :value="key">
              {{ label }}
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div class="mb-4 flex items-center gap-4">
          <div>{{ $t('tools.token-generator.quantity') }}</div>

          <NumberField v-model="quantity" :min="1" :max="100">
            <NumberFieldContent class="flex-1">
              <NumberFieldDecrement />
              <NumberFieldInput />
              <NumberFieldIncrement />
            </NumberFieldContent>
          </NumberField>
        </div>

        <Textarea v-model="token" rows="5" class="font-mono" readonly :placeholder="$t('tools.token-generator.placeholder')" />

        <Button class="mt-4" variant="secondary" @click="refreshToken">
          {{ $t('tools.token-generator.refresh') }}
        </Button>
      </Card>
    </div>
  </div>
</template>
