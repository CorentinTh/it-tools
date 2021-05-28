<template>
  <ToolWrapper :config="$toolConfig">
    <v-row>
      <v-col cols="12" sm="4">
        <v-text-field
          ref="inputBaseRef"
          v-model.number="inputBase"
          label="Input base"
          outlined
          type="number"
          hide-details="auto"
          :rules="baseRules"
        />
      </v-col>
      <v-col cols="12" sm="8">
        <v-text-field
          ref="inputField"
          v-model="inputNumber"
          label="Input number"
          outlined
          hide-details="auto"
        />
      </v-col>
    </v-row>
    <br>
    <v-divider />
    <br>
    <v-row>
      <v-col cols="12" sm="4">
        <v-text-field
          ref="outputBaseRef"
          v-model.number="outputBase"
          label="Output base"
          outlined
          type="number"
          :rules="baseRules"
        />
      </v-col>
      <v-col cols="12" sm="8">
        <v-text-field
          v-model="outputNumber"
          label="Output number"
          outlined
          readonly
          append-icon="mdi-content-copy"
          @click:append="copy(outputNumber)"
        />
      </v-col>
    </v-row>
  </ToolWrapper>
</template>

<tool>
title: 'Base converter'
description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Delectus distinctio dolor dolorum eaque eligendi, facilis impedit laboriosam odit placeat.'
icon: 'mdi-swap-horizontal'
keywords: ['base', 'converter']
path: '/color-picker-converter'
</tool>

<script lang="ts">

import {Component, Ref} from 'nuxt-property-decorator'
import {CopyableMixin} from '~/mixins/copyable.mixin'
import Tool from '~/components/Tool.vue'
import type {VForm} from '~/types/VForm'

const convertBase = (value: string, fromBase: number, toBase: number) => {
  const range = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/'.split('')
  const fromRange = range.slice(0, fromBase)
  const toRange = range.slice(0, toBase)
  let decValue = value
    .split('')
    .reverse()
    .reduce((carry: number, digit: string, index: number) => {
      if (!fromRange.includes(digit)) {
        throw new Error('Invalid digit `' + digit + '` for base ' + fromBase + '.')
      }
      return (carry += fromRange.indexOf(digit) * (Math.pow(fromBase, index)))
    }, 0)
  let newValue = ''
  while (decValue > 0) {
    newValue = toRange[decValue % toBase] + newValue
    decValue = (decValue - (decValue % toBase)) / toBase
  }
  return newValue || '0'
}

@Component({
  mixins: [CopyableMixin]
})
export default class BaseConverter extends Tool {
  @Ref() readonly inputBaseRef!: VForm
  @Ref() readonly outputBaseRef!: VForm

  isMounted = false
  inputError = ''
  inputNumber = '42'
  inputBase = 10
  outputBase = 16
  baseRules = [
    (v: unknown) => !!v || 'Required',
    (v: unknown) => Number.isInteger(v) || 'Base should be an integer',
    (v: number) => v > 1 || 'Base should be > 1',
    (v: number) => v <= 64 || 'Base should be <= 64'
  ]

  mounted() {
    this.isMounted = true
  }

  get outputNumber() {
    if (this.isMounted && this.inputBaseRef.validate() && this.outputBaseRef.validate()) {
      try {
        return convertBase(this.inputNumber, this.inputBase, this.outputBase)
      } catch (e) {
        return e.message
      }
    } else {
      return ''
    }
  }
}

// import {copyToClipboard, isInt} from "../../utils/helpers";
//
// const convertBase = (value, fromBase, toBase) => {
//   const range = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/'.split('');
//   const fromRange = range.slice(0, fromBase);
//   const toRange = range.slice(0, toBase);
//   let decValue = value.split('').reverse().reduce((carry, digit, index) => {
//     if (fromRange.indexOf(digit) === -1) throw new Error('Invalid digit `' + digit + '` for base ' + fromBase + '.');
//     return carry += fromRange.indexOf(digit) * (Math.pow(fromBase, index));
//   }, 0);
//   let newValue = '';
//   while (decValue > 0) {
//     newValue = toRange[decValue % toBase] + newValue;
//     decValue = (decValue - (decValue % toBase)) / toBase;
//   }
//   return newValue || '0';
// }
// export default {
//   name: "BaseConverter",
//   data() {
//     return {
//       inputError: '',
//       inputNumber: '42',
//       inputBase: 10,
//       outputBase: 16,
//       baseRules: [
//         v => isInt(v) || 'Base should be an integer',
//         v => !!v || 'Required',
//         v => v > 1 || 'Base should be > 1',
//         v => v <= 64 || 'Base should be <= 64'
//       ],
//       isMounted: false
//     }
//   },
//   mounted() {
//     this.isMounted = true;
//   },
//   methods: {
//     copy() {
//       copyToClipboard(this.outputNumber);
//       this.$toast.success('Copied to clipboard.')
//     }
//   },
//   computed: {
//     outputNumber() {
//       if (this.isMounted && this.$refs.inputBase.validate() && this.$refs.outputBase.validate()) {
//         try {
//           return convertBase(this.inputNumber, this.inputBase, this.outputBase)
//         } catch (e) {
//           return e.message;
//         }
//       } else {
//         return ''
//       }
//     }
//   }
// }
</script>

<style scoped lang="less">
</style>
