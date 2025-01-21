<script setup lang="ts">
import InputCopyable from '@/components/InputCopyable.vue';
import { isValidObjectId, objectIdFromDate, objectIdToDate } from '@/utils/objectId';

const objectIdDate = ref(new Date().getTime());
const objectId = ref<null | string>(objectIdFromDate(objectIdDate.value));
const objectIdHex = computed({
  get() {
    if (objectId.value === null) {
      return objectIdFromDate(objectIdDate.value, true);
    }

    return objectId.value;
  },
  set(value) {
    objectId.value = value;
  },
});
const objectIdMongo = computed(() => `ObjectId("${objectIdHex.value}")`);

const objectIdValidationRules = [
  {
    validator: isValidObjectId,
    message: 'This ObjectId is invalid',
  },
];

function onObjectIdChanged(value: string) {
  objectId.value = value;
  objectIdDate.value = objectIdToDate(value).getTime();
}

function onDateChanged() {
  objectId.value = null;
}

function generateRandomObjectId() {
  onObjectIdChanged(objectIdFromDate(objectIdDate.value));
}
</script>

<template>
  <c-card>
    <InputCopyable
      :value="objectIdHex"
      raw-text
      placeholder="000000000000000000000000"
      label="ObjectId"
      :validation-rules="objectIdValidationRules"
      mb-5
      test-id="objectid-hex"
      @update:value="onObjectIdChanged"
    />

    <InputCopyable
      :value="objectIdMongo"
      raw-text
      readonly
      placeholder="000000000000000000000000"
      label="Mongo shell format"
      mb-5
      test-id="objectid-mongo"
    />

    <n-form-item label="ObjectId datetime">
      <n-date-picker
        id="datetime"
        v-model:value="objectIdDate"
        type="datetime"
        format="yyyy-MM-dd'T'HH:mm:ss.000XX"
        w-full
        data-test-id="objectid-date"
        @update:value="onDateChanged"
      />
    </n-form-item>

    <c-button
      w-full
      test-id="objectid-generate"
      @click="generateRandomObjectId()"
    >
      Generate random ObjectId
    </c-button>
  </c-card>
</template>
