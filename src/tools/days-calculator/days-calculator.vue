<script setup lang="ts">
const startDate = ref<Date | null>(null);
const endDate = ref<Date | null>(null);
const includeEndDate = ref(false);

const calculatedDays = computed<string | null>(() => {
  if (startDate.value && endDate.value) {
    const start = new Date(startDate.value);
    const end = new Date(endDate.value);
    if (!Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime())) {
      const diff = Math.abs(end.getTime() - start.getTime());
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
      return (includeEndDate.value ? days + 1 : days).toString();
    }
  }
  return null;
});
</script>

<template>
  <div>
    <n-form>
      <div w-full flex gap-4>
        <n-form-item label="Start Date">
          <n-date-picker v-model:value="startDate" type="date" />
        </n-form-item>
        <n-form-item label="End Date">
          <n-date-picker v-model:value="endDate" type="date" />
        </n-form-item>
      </div>
      <n-form-item label="Include end date in calculation (1 day is added)" label-placement="left">
        <n-checkbox v-model:checked="includeEndDate" />
      </n-form-item>
    </n-form>
    <c-input-text label="Calculated days" :value="calculatedDays" readonly />
  </div>
</template>
