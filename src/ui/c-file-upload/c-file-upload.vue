<script lang="ts" setup>
import _ from 'lodash';

const props = withDefaults(defineProps<{
  multiple?: boolean
  accept?: string
  title?: string
  disabled?: boolean
}>(), {
  multiple: false,
  accept: undefined,
  title: 'Drag and drop files here, or click to select files',
  disabled: false,
});

const emit = defineEmits<{
  (event: 'filesUpload', files: File[]): void
  (event: 'fileUpload', file: File): void
}>();

const { disabled, multiple } = toRefs(props);

const isOverDropZone = ref(false);

const fileInput = ref<HTMLInputElement | null>(null);

function triggerFileInput() {
  if (disabled.value) {
    return;
  }

  fileInput.value?.click();
}

function handleFileInput(event: Event) {
  const input = event.target as HTMLInputElement;

  try {
    handleUpload(input.files);
  }
  finally {
    input.value = '';
  }
}

function handleDrop(event: DragEvent) {
  event.preventDefault();

  try {
    if (!disabled.value) {
      handleUpload(event.dataTransfer?.files);
    }
  }
  finally {
    isOverDropZone.value = false;
  }
}

function handleUpload(files: FileList | null | undefined) {
  if (disabled.value || _.isNil(files) || _.isEmpty(files)) {
    return;
  }

  if (multiple.value) {
    emit('filesUpload', Array.from(files));
    return;
  }

  emit('fileUpload', files[0]);
}
</script>

<template>
  <div
    class="c-file-upload flex flex-col items-center justify-center border-2px border-gray-300 border-opacity-50 rounded-lg border-dashed p-8 transition-colors focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
    :class="{
      'border-primary border-opacity-100': isOverDropZone,
      'cursor-pointer': !disabled,
      'cursor-not-allowed opacity-50': disabled,
    }"
    role="button"
    :tabindex="disabled ? -1 : 0"
    :aria-label="title"
    :aria-disabled="disabled ? 'true' : undefined"
    @click="triggerFileInput"
    @keydown.enter.prevent="triggerFileInput"
    @keydown.space.prevent="triggerFileInput"
    @drop.prevent="handleDrop"
    @dragover.prevent
    @dragenter="!disabled && (isOverDropZone = true)"
    @dragleave="isOverDropZone = false"
  >
    <input
      ref="fileInput"
      type="file"
      class="hidden"
      :multiple="multiple"
      :accept="accept"
      :disabled="disabled"
      @click.stop
      @change="handleFileInput"
    >
    <slot>
      <span op-70>
        {{ title }}
      </span>

      <!-- separator -->
      <div my-4 w-full flex items-center justify-center op-70>
        <div class="h-1px max-w-100px flex-1 bg-gray-300 op-50" />
        <div class="mx-2 text-gray-400">
          or
        </div>
        <div class="h-1px max-w-100px flex-1 bg-gray-300 op-50" />
      </div>

      <c-button :disabled="disabled" tabindex="-1" aria-hidden="true">
        Browse files
      </c-button>
    </slot>
  </div>
</template>
