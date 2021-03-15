<template>
  <ToolWrapper :config="config()">
    <v-select
      v-model="language"
      outlined
      label="Language"
      :items="languageList"
      @change="languageChanged"
    />
    <v-text-field
      ref="entropy"
      v-model="entropy"
      outlined
      label="Entropy"
      append-icon="mdi-content-copy"
      :rules="rules.entropy"
      @click:append="copy(entropy)"
    />
    <v-text-field
      ref="passphrase"
      v-model="passphrase"
      outlined
      label="Passphrase"
      append-icon="mdi-content-copy"
      :rules="rules.passphrase"
      @click:append="copy(passphrase)"
    />
    <div class="text-center">
      <v-btn @click="refresh">
        refresh
      </v-btn>
    </div>
  </ToolWrapper>
</template>

<script lang="ts">
import * as bip39 from 'bip39'
import {shuffle} from '@/utils/string'
import {Component, Ref} from 'nuxt-property-decorator'
import {CopyableMixin} from '@/mixins/copyable.mixin'
import Tool from '@/components/Tool.vue'
import {ToolConfig} from '@/types/ToolConfig'
import type {VForm} from '~/types/VForm'

const getRandomBuffer = () => Buffer.from(shuffle('0123456789abcdef'.repeat(16)).substring(0, 32), 'hex')

@Component({
  mixins: [CopyableMixin]
})
export default class Bip39Generator extends Tool {
  config(): ToolConfig {
    return {
      title: 'BIP39 passphrase generator',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Delectus distinctio dolor dolorum eaque eligendi, facilis impedit laboriosam odit placeat.',
      icon: 'mdi-message-text-lock-outline',
      keywords: ['BIP39', 'passphrase', 'generator']
    }
  }

  @Ref() readonly entropyRef!: VForm
  @Ref() readonly passphraseRef!: VForm
  buffer = getRandomBuffer()
  language: string = 'english'
  languageList = Object
    .keys(bip39.wordlists)
    .filter(k => !k.match(/[A-Z]{2}/))
    .map(k => ({
      text: k.split('_').map(k => k.charAt(0).toUpperCase() + k.slice(1)).join(' '),
      value: k
    }))

  rules = {
    passphrase: [(v: string | undefined) => (!!v && bip39.validateMnemonic(v)) || 'Invalid mnemonic.'],
    entropy: [(v: string | undefined) => (!!v && !!v.match(/[0-9a-fA-F]{32}/)) || 'Invalid entropy.']
  }

  get entropy() {
    return this.buffer.toString('hex')
  }

  set entropy(value) {
    if (this.entropyRef.validate()) {
      this.buffer = Buffer.from(value, 'hex')
    }
  }

  get passphrase() {
    return bip39.entropyToMnemonic(this.buffer)
  }

  set passphrase(value) {
    if (this.passphraseRef.validate()) {
      this.buffer = Buffer.from(bip39.mnemonicToEntropy(value), 'hex')
    }
  }

  refresh() {
    this.buffer = getRandomBuffer()
  }

  languageChanged() {
    bip39.setDefaultWordlist(this.language)
    this.passphrase = bip39.entropyToMnemonic(this.buffer)
  }
}

</script>

<style scoped>
</style>
