<template>
  <div class="tool-wrapper">
    <v-row no-gutters justify="center" align="center">
      <v-col cols="12" lg="6">
        <div class="tool-wrapper-info">
          <h1>{{ config.title }}</h1>
          <div class="spacer" />
          <div class="description">
            {{ config.description }}
          </div>
        </div>
        <v-card flat>
          <v-card-text class="pa-10">
            <slot />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'nuxt-property-decorator'
import {ToolConfig} from '~/types/ToolConfig'

@Component
export default class ToolWrapper extends Vue {
  @Prop() config!: ToolConfig;
}

</script>

<style scoped lang="less">
.tool-wrapper {
  height: 100%;

  .tool-wrapper-info{
    padding: 50px 0 30px;
  }

  .category {
    color: #546167;
  }

  h1 {
    font-weight: 300;
    font-size: 50px;
    margin: 0;
    padding: 0;
  }

  .spacer{
    width: 130px;
    height: 1px;
    background-color: var(--v-primary-base);
    margin-bottom: 10px;
  }

  .description {
    color: #829097;
  }
}
</style>
