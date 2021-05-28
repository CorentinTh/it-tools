<template>
  <ToolWrapper :config="$toolConfig">
    <v-textarea
      v-model="clearText"
      outlined
      label="Clear text"
    />

    <v-textarea
      v-model="base64Text"
      outlined
      readonly
      label="Base64 text"
    />
    <div class="text-center">
      <v-btn depressed @click="copy(clearText)">
        Copy clear
      </v-btn>
      <v-btn depressed @click="copy(base64Text)">
        Copy hash
      </v-btn>
    </div>
  </ToolWrapper>
</template>

<tool>
title: 'Base64 string converter'
description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Delectus distinctio dolor dolorum eaque eligendi, facilis impedit laboriosam odit placeat.'
icon: 'mdi-text-box-outline'
keywords: ['base64', 'base', '64', 'converter']
path: '/base64-string-converter'
</tool>

<script lang="ts">
import {Component} from 'nuxt-property-decorator'
import {CopyableMixin} from '~/mixins/copyable.mixin'
import Tool from '~/components/Tool.vue'
import {base64ToString, stringToBase64} from '~/utils/convert'

@Component({
  mixins: [CopyableMixin]
})
export default class Base64StringConverter extends Tool {
  clearText = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.'

  get base64Text() {
    return stringToBase64(this.clearText)
  }

  set base64Text(value: string) {
    this.clearText = base64ToString(value)
  }
}

</script>

<style scoped>
</style>
