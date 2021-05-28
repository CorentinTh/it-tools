<template>
  <ToolWrapper :config="$toolConfig">
    <v-text-field
      v-model="port"
      outlined
      class="centered-input"
      readonly
    />

    <div class="text-center">
      <v-btn depressed class="mr-4" @click="refreshPort">
        Refresh
      </v-btn>
      <v-btn depressed @click="copy(port.toString())">
        Copy port
      </v-btn>
    </div>
  </ToolWrapper>
</template>

<tool>
title: 'Random port generator'
description: 'Random port generator without the range of "known" ports (0-1023).'
icon: 'mdi-lan-pending'
keywords: ['system', 'port', 'lan']
path: '/random-port-generator'
</tool>

<script lang="ts">

import {Component} from 'nuxt-property-decorator'
import {CopyableMixin} from '@/mixins/copyable.mixin'
import Tool from '~/components/Tool.vue'
import {randIntFromInterval} from '~/utils/random'

const generatePort = () => randIntFromInterval(1024, 65535)

@Component({
  mixins: [CopyableMixin]
})
export default class RandomPortGenerator extends Tool {
  port!: number

  created() {
    this.refreshPort()
  }

  refreshPort() {
    this.port = generatePort()
  }
}
</script>

<style scoped lang="less">
::v-deep .centered-input input {
  text-align: center;
  font-family: Consolas, monospace;
}
</style>
