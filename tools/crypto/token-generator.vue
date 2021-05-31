<template>
  <ToolWrapper :config="$toolConfig">
    <v-row no-gutters>
      <v-col lg="6" md="12">
        <v-switch v-model="config.withLowercase" label="Lowercase (abc...)"/>
        <v-switch v-model="config.withUppercase" label="Uppercase (ABC...)"/>
      </v-col>
      <v-col lg="6" md="12">
        <v-switch v-model="config.withNumbers" label="Numbers (123...)"/>
        <v-switch v-model="config.withSpecials" label="Specials (#]-...)"/>
      </v-col>
    </v-row>

    <v-slider v-model="config.length" :label="`Length (${config.length})`" min="1" max="512"/>

    <v-textarea v-model="token" outlined/>

    <div class="text-center">
      <v-btn depressed class="mr-4" @click="refreshToken()">
        Refresh
      </v-btn>
      <v-btn depressed @click="copy(token)">
        Copy token
      </v-btn>
    </div>
  </ToolWrapper>
</template>

<tool>
title: 'Token generator'
description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Delectus distinctio dolor dolorum eaque eligendi, facilis impedit laboriosam odit placeat.'
icon: 'mdi-key-chain-variant'
keywords: [ 'token', 'random', 'string', 'alphanumeric', 'symbols' ]
path: '/token-generator'
</tool>

<script lang="ts">
import {Component, Watch} from 'nuxt-property-decorator'
import Tool from '~/components/Tool.vue'
import {CopyableMixin} from '~/mixins/copyable.mixin'
import {shuffle} from '~/utils/string'

const lowercase = 'abcdefghijklmopqrstuvwxyz'
const uppercase = 'ABCDEFGHIJKLMOPQRSTUVWXYZ'
const numbers = '0123456789'
const specials = '.,;:!?./-"\'#{([-|\\@)]=}*+'

@Component({
  mixins: [CopyableMixin]
})
export default class TokenGenerator extends Tool {
  token = '';
  config = {
    withNumbers: true,
    withLowercase: true,
    withUppercase: true,
    withSpecials: false,
    length: 64
  }

  created() {
    this.refreshToken()
  }

  @Watch('config', {deep: true})
  refreshToken() {
    let result = ''
    if (this.config.withLowercase) {
      result += lowercase
    }
    if (this.config.withUppercase) {
      result += uppercase
    }
    if (this.config.withNumbers) {
      result += numbers
    }
    if (this.config.withSpecials) {
      result += specials
    }

    this.token = shuffle(result.repeat(this.config.length)).substring(0, this.config.length)
  }
}
</script>
