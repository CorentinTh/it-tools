<script lang="ts" setup>
import _ from 'lodash';

const buttonVariants = ['basic', 'text'] as const;
const buttonTypes = ['default', 'primary', 'warning', 'error'] as const;
const buttonSizes = ['small', 'medium', 'large'] as const;
</script>

<template>
  <div v-for="buttonVariant of buttonVariants" :key="buttonVariant">
    <h2>{{ _.capitalize(buttonVariant) }}</h2>

    <div v-for="buttonSize of buttonSizes" :key="buttonSize" mb-2>
      <c-button
        v-for="buttonType of buttonTypes"
        :key="buttonType"
        :variant="buttonVariant"
        :type="buttonType"
        :size="buttonSize"
        mx-1
      >
        Button
      </c-button>

      <c-button
        v-for="buttonType of buttonTypes"
        :key="buttonType"
        :variant="buttonVariant"
        :type="buttonType"
        :size="buttonSize"
        circle
        mx-1
      >
        A
      </c-button>

      <c-button
        v-for="buttonType of buttonTypes"
        :key="buttonType"
        :variant="buttonVariant"
        :type="buttonType"
        :size="buttonSize"
        circle
        mx-1
      >
        <icon-mdi-content-copy />
      </c-button>
    </div>
  </div>
</template>
