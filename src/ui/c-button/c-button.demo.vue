<template>
  <div v-for="buttonVariant of buttonVariants" :key="buttonVariant">
    <h2>{{ _.capitalize(buttonVariant) }}</h2>

    <c-button v-for="buttonType of buttonTypes" :key="buttonType" :variant="buttonVariant" :type="buttonType" mx-1>
      Button
    </c-button>

    <c-button
      v-for="buttonType of buttonTypes"
      :key="buttonType"
      :variant="buttonVariant"
      :type="buttonType"
      circle
      mx-1
    >
      A
    </c-button>
  </div>
</template>

<script lang="ts" setup>
import _ from 'lodash';

const buttonVariants = ['basic', 'text'];
const buttonTypes = ['default', 'primary'];
</script>

<style lang="less" scoped></style>
