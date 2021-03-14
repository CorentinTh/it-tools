<template>
  <div class="tool-wrapper-info">
    <h1>{{ config.title }}</h1>
    <div class="spacer" />
    <div class="description">
      {{ config.description }}
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'nuxt-property-decorator'
import type {ToolConfig} from '@/types/ToolConfig'

@Component
export default class ToolWrapper extends Vue {
  @Prop() readonly config!: ToolConfig;
}
</script>

<style scoped lang="less">
.tool-wrapper-info {
  padding: 50px 0 30px;

  h1 {
    font-weight: 300;
    font-size: 50px;
    margin: 0;
    padding: 0;
  }

  .spacer {
    width: 200px;
    height: 2px;
    background: var(--v-primary-base);
    background: linear-gradient(90deg, rgba(71, 177, 113, 1) 0%, rgba(59, 149, 111, 1) 60%, rgba(37, 99, 108, 1) 200%);
    margin-bottom: 10px;
  }

  .description {
    color: #829097;
  }
}
</style>
