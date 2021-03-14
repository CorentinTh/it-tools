<template>
  <ToolWrapper :config="config()">
    <v-text-field
      v-model.number="quantity"
      outlined
      type="number"
      label="Quantity"
      dense
      class="quantity"
      :rules="rules.quantity"
    />
    <v-textarea
      v-model="token"
      outlined
      class="centered-input"
      :rows="quantity <= 10 ? quantity : 10"
      readonly
    />

    <div class="text-center">
      <v-btn depressed class="mr-4" @click="computeToken">
        Refresh
      </v-btn>
      <v-btn depressed @click="copy(token, `UUID${quantity > 1 ? 's' : ''} copied !`)">
        Copy UUID{{ quantity > 1 ? 's' : '' }}
      </v-btn>
    </div>
  </ToolWrapper>
</template>

<script lang="ts">

import {Component, Ref, Watch} from 'nuxt-property-decorator'
import {CopyableMixin} from '@/mixins/copyable.mixin'
import {ToolConfig} from '@/types/ToolConfig'
import { VTextField } from 'vuetify/lib'
import Tool from '~/components/Tool.vue'

const generateUuid = () => '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, c => ((c as unknown as number) ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> (c as unknown as number) / 4).toString(16))

@Component({
  mixins: [CopyableMixin]
})
export default class UuidGenerator extends Tool {
  config(): ToolConfig {
    return {
      title: 'UUIDs generator',
      description: 'A universally unique identifier (UUID) is a 128-bit number used to identify information in computer systems. ',
      icon: 'mdi-fingerprint',
      keywords: ['uuid', 'v4', 'random', 'id', 'alphanumeric', 'identity']
    }
  }

  @Ref() readonly quantityEl! : typeof VTextField
  token = ''
  quantity = 1
  rules = {
    quantity: [
      (v: any) => !!v || 'Quantity is required',
      (v: any) => (v > 0 && v <= 50) || 'Quantity should be > 0 and <= 50',
      (v: any) => Number.isInteger(v) || 'Quantity should be an integer'
    ]
  }

  mounted() {
    this.computeToken()
  }

  @Watch('quantity')
  computeToken() {
    this.token = Array.from({length: this.quantity}, generateUuid).join('\n')
  }
}
</script>

<style scoped lang="less">
.quantity {
  width: 100px;
  margin: auto;
  text-align: center;

  ::v-deep input {
    text-align: center;
  }
}

::v-deep .centered-input textarea {
  text-align: center;
  margin-top: 13px !important;
  font-family: Consolas, monospace;
}
</style>
