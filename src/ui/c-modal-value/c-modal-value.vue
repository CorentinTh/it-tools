<script lang="ts" setup>
import { useCopy } from '@/composable/copy';

const props = withDefaults(defineProps<{ value: string; label?: string; copyable?: boolean }>(), { label: undefined, copyable: true });
const { value, label } = toRefs(props);

const { copy, isJustCopied } = useCopy({ source: value });

const isModalOpen = ref(false);
const toggleModal = useToggle(isModalOpen);
</script>

<template>
  <slot name="label" :value="value" :toggle-modal="toggleModal" :is-modal-open="isModalOpen">
    <c-button class="text-left" @click="isModalOpen = true">
      {{ label }}
    </c-button>
  </slot>

  <c-modal v-model:open="isModalOpen">
    <slot name="value" :value="value" :toggle-modal="toggleModal" :is-modal-open="isModalOpen">
      {{ value }}
    </slot>

    <div mt-4 flex justify-center>
      <c-button class="w-full" @click="copy">
        {{ isJustCopied ? 'Copied!' : 'Copy' }}
      </c-button>
    </div>
  </c-modal>
</template>
