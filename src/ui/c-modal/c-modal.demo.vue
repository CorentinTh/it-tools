<script lang="ts" setup>
const modal1 = ref();
</script>

<template>
  <div>
    <c-button @click="() => modal1?.open()">
      Open Modal
    </c-button>

    <c-modal ref="modal1">
      Content
    </c-modal>
  </div>
</template>
