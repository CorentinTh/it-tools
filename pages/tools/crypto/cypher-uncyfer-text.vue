<template>
  <ToolWrapper :config="config()">
    <v-row justify="center" align="center">
      <v-col cols="12" lg="8" md="12">
        <v-textarea
          v-model="key"
          outlined
          label="Encryption key"
          rows="1"
          @input="encrypt"
        />
      </v-col>
      <v-col cols="12" lg="4" md="12">
        <v-select
          v-model="algorithm"
          :items="Object.keys(algorithms)"
          label="Algorithm"
          outlined
          @change="encrypt"
        />
      </v-col>
    </v-row>

    <v-textarea
      v-model="decrypted"
      outlined
      label="Clear text"
      @input="encrypt"
    />

    <v-textarea
      v-model="encrypted"
      outlined
      label="Cyphered text"
      @input="decrypt"
    />
    <div class="text-center">
      <v-btn depressed @click="copy(encrypted)">
        Copy result
      </v-btn>
    </div>
  </ToolWrapper>
</template>

<script lang="ts">
import {Component} from 'nuxt-property-decorator'
import {CopyableMixin} from '@/mixins/copyable.mixin'
import Tool from '@/components/Tool.vue'
import {ToolConfig} from '@/types/ToolConfig'
import CryptoJS from 'crypto-js'

const algos = {
  AES: CryptoJS.AES,
  TripleDES: CryptoJS.TripleDES,
  Rabbit: CryptoJS.Rabbit,
  RabbitLegacy: CryptoJS.RabbitLegacy,
  RC4: CryptoJS.RC4
}

@Component({
  mixins: [CopyableMixin]
})
export default class CypherUncyferText extends Tool {
  algorithm: keyof typeof algos = 'AES'
  algorithms: typeof algos = algos
  key = 'sup3r s3cr3t k3y'
  decrypted = 'Lorem ipsum dolor sit amet.'
  encrypted = ''

  config(): ToolConfig {
    return {
      title: 'Cypher / uncypher text',
      description: 'Cypher and uncyfer text.',
      icon: 'mdi-lock-open',
      keywords: ['cypher', 'uncypher', 'text', ...Object.keys(algos).map(s => s.toLowerCase())]
    }
  }

  mounted() {
    this.encrypt()
  }

  encrypt() {
    try {
      this.encrypted = this.algorithms[this.algorithm]
        .encrypt(this.decrypted.trim(), this.key)
        .toString()
    } catch (ignored) {
      // ignored
    }
  }

  decrypt() {
    try {
      this.decrypted = this.algorithms[this.algorithm]
        .decrypt(this.encrypted.trim(), this.key)
        .toString(CryptoJS.enc.Utf8)
    } catch (ignored) {
      // ignored
    }
  }
}
</script>

<style lang="less">
</style>
