<script lang="ts" setup>
import _ from 'lodash';

const props = withDefaults(defineProps<{
  multiple?: boolean
  accept?: string
  title?: string
  pasteImage?: boolean
}>(), {
  multiple: false,
  accept: undefined,
  title: 'Drag and drop files here, or click to select files',
  pasteImage: false,
});

const emit = defineEmits<{
  (event: 'filesUpload', files: File[]): void
  (event: 'fileUpload', file: File): void
}>();

const { multiple, pasteImage } = toRefs(props);

const isOverDropZone = ref(false);

function toBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result?.toString() ?? '');
    reader.onerror = error => reject(error);
  });
}

const fileInput = ref<HTMLInputElement | null>(null);
const imgPreview = ref<HTMLImageElement | null>(null);
async function handlePreview(image: File) {
  if (imgPreview.value) {
    imgPreview.value.src = await toBase64(image);
  }
}
function clearPreview() {
  if (imgPreview.value) {
    imgPreview.value.src = '';
  }
}

function triggerFileInput() {
  fileInput.value?.click();
}

function handleFileInput(event: Event) {
  const files = (event.target as HTMLInputElement).files;

  handleUpload(files);
}

function handleDrop(event: DragEvent) {
  event.preventDefault();
  const files = event.dataTransfer?.files;

  handleUpload(files);
}

async function onPasteImage(evt: ClipboardEvent) {
  if (!pasteImage.value) {
    return false;
  }

  const items = evt.clipboardData?.items;
  if (!items) {
    return false;
  }
  for (let i = 0; i < items.length; i++) {
    if (items[i].type.includes('image')) {
      const imageFile = items[i].getAsFile();
      if (imageFile) {
        await handlePreview(imageFile);
        emit('fileUpload', imageFile);
      }
    }
  }
  return true;
}

async function handleUpload(files: FileList | null | undefined) {
  clearPreview();

  if (_.isNil(files) || _.isEmpty(files)) {
    return;
  }

  if (multiple.value) {
    emit('filesUpload', Array.from(files));
    return;
  }

  await handlePreview(files[0]);
  emit('fileUpload', files[0]);
}
</script>

<template>
  <div
    class="flex flex-col cursor-pointer items-center justify-center border-2px border-gray-300 border-opacity-50 rounded-lg border-dashed p-8 transition-colors"
    :class="{
      'border-primary border-opacity-100': isOverDropZone,
    }"
    @click="triggerFileInput"
    @paste.prevent="onPasteImage"
    @drop.prevent="handleDrop"
    @dragover.prevent
    @dragenter="isOverDropZone = true"
    @dragleave="isOverDropZone = false"
  >
    <input
      ref="fileInput"
      type="file"
      class="hidden"
      :multiple="multiple"
      :accept="accept"
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

      <c-button>
        Browse files
      </c-button>

      <div v-if="pasteImage">
        <!-- separator -->
        <div my-4 w-full flex items-center justify-center op-70>
          <div class="h-1px max-w-100px flex-1 bg-gray-300 op-50" />
          <div class="mx-2 text-gray-400">
            or
          </div>
          <div class="h-1px max-w-100px flex-1 bg-gray-300 op-50" />
        </div>

        <p>Paste an image from clipboard</p>
      </div>
    </slot>
    <div mt-2>
      <img ref="imgPreview" width="150">
    </div>
  </div>
</template>
