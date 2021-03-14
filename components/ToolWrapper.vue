<template>
  <div class="tool-wrapper">
    <v-row no-gutters justify="center" align="center">
      <v-col cols="12" xl="6" lg="8" md="10">
        <div class="tool-wrapper-info">
          <h1>{{ config.title }}</h1>
          <div class="spacer"/>
          <div class="description">
            {{ config.description }}
          </div>
        </div>
        <template v-if="!noCard">
          <v-card flat>
            <v-card-text class="pa-10">
              <slot/>
            </v-card-text>
          </v-card>
        </template>
        <template v-else>
          <slot/>
        </template>

      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'nuxt-property-decorator'
import {ToolConfig} from '~/types/ToolConfig'

@Component
export default class ToolWrapper extends Vue {
  @Prop() readonly config!: ToolConfig;
  @Prop({default: () => false}) readonly noCard!: boolean;
}

</script>

<style scoped lang="less">
.tool-wrapper {
  height: 100%;

  .tool-wrapper-info {
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
