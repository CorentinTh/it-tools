<template>
  <ToolWrapper :config="$toolConfig">
    <v-textarea
      v-model="decoded"
      outlined
      label="URL decoded string"
      :rules="rules.decoded"
    />
    <v-textarea
      v-model="encoded"
      outlined
      label="URL encoded string"
      :rules="rules.encoder"
    />

    <div class="text-center">
      <v-btn @click="copy(decoded)">
        Copy decoded
      </v-btn>
      <v-btn @click="copy(encoded)">
        Copy encoded
      </v-btn>
    </div>
  </ToolWrapper>
</template>

<tool>
title: 'URL encode / decode'
description: 'Lorem Ipsum dolor sit amet'
icon: 'mdi-link-variant'
keywords: [ 'system', 'port', 'lan' ]
path: '/url-encoder-decoder'
</tool>

<script lang="ts">

import {Component} from 'nuxt-property-decorator'
import {CopyableMixin} from '@/mixins/copyable.mixin'
import Tool from '~/components/Tool.vue'

@Component({
  mixins: [CopyableMixin]
})
export default class UrlEncoderDecoder extends Tool {
  decoded = 'Hello world :)'
  rules = {
    decoder: [
      (v: string) => {
        try {
          decodeURIComponent(v)
          return true
        } catch (_) {
          return 'Impossible to parse this string'
        }
      }
    ],
    encoder: [
      (v: string) => {
        try {
          encodeURIComponent(v)
          return true
        } catch (_) {
          return 'Impossible to parse this string'
        }
      }
    ]
  }

  get encoded() {
    return encodeURIComponent(this.decoded)
  }

  set encoded(value: string) {
    try {
      this.decoded = decodeURIComponent(value)
    } catch (_) {
    }
  }
}
</script>
