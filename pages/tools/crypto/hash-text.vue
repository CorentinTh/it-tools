<template>
  <ToolWrapper :config="config()">
    <v-textarea
      v-model="inputText"
      outlined
      label="Text to hash"
    />

    <v-select
      v-model="algorithm"
      :items="Object.keys(algorithms)"
      label="Algorithm"
      outlined
    />

    <v-textarea
      v-model="hashed"
      outlined
      readonly
      label="Hashed text"
    />
    <div class="text-center">
      <v-btn depressed @click="copy(hashed)">
        Copy hash
      </v-btn>
    </div>
  </ToolWrapper>
</template>

<script lang="ts">
import {Component} from 'nuxt-property-decorator'
import CryptoJS from 'crypto-js'
import {CopyableMixin} from '~/mixins/copyable.mixin'
import Tool from '~/components/Tool.vue'
import type {ToolConfig} from '~/types/ToolConfig'
const algos = {
  MD5: CryptoJS.MD5,
  SHA1: CryptoJS.SHA1,
  SHA256: CryptoJS.SHA256,
  SHA224: CryptoJS.SHA224,
  SHA512: CryptoJS.SHA512,
  SHA384: CryptoJS.SHA384,
  SHA3: CryptoJS.SHA3,
  RIPEMD160: CryptoJS.RIPEMD160
}

@Component({
  mixins: [CopyableMixin]
})
export default class HashText extends Tool {
  config(): ToolConfig {
    return {
      title: 'Hash text',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Delectus distinctio dolor dolorum eaque eligendi, facilis impedit laboriosam odit placeat.',
      icon: 'mdi-script-text-play',
      keywords: ['hash', 'text', ...Object.keys(algos).map(s => s.toLowerCase())]
    }
  }

  inputText = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.'
  algorithm: keyof typeof algos = 'SHA256'
  algorithms: typeof algos = algos

  get hashed() {
    if (this.algorithms[this.algorithm]) {
      return this.algorithms[this.algorithm](this.inputText).toString()
    } else {
      this.$toast.error('Invalid algorithm.')
      return ''
    }
  }
}

</script>

<style>
</style>
