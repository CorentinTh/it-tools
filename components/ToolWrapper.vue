<template>
  <div class="tool-wrapper">
    <v-row no-gutters justify="center" align="center">
      <v-col cols="12" xl="6" lg="8" md="10">
        <ToolHeader :config="config" />

        <template v-if="!noCard">
          <v-card flat>
            <v-card-text class="pa-10">
              <slot />
            </v-card-text>
          </v-card>
        </template>
        <template v-else>
          <slot />
        </template>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'nuxt-property-decorator'
import ToolHeader from './ToolHeader.vue'
import type {ToolConfig} from '~/types/ToolConfig'
@Component({components: {ToolHeader}})
export default class ToolWrapper extends Vue {
  @Prop() readonly config!: ToolConfig;
  @Prop({default: () => false}) readonly noCard!: boolean;
}

</script>

<style scoped lang="less">
.tool-wrapper {
  height: 100%;

  .category {
    color: #546167;
  }
}
</style>
