<template>
  <ToolWrapper :config="$toolConfig">
    <v-text-field
      v-model.number="arabic"
      label="Arabic form"
      outlined
      append-icon="mdi-content-copy"
      @click:append="copy(arabic)"
    />
    <v-text-field
      v-model="roman"
      label="Roman number"
      outlined
      hide-details="auto"
      append-icon="mdi-content-copy"
      @click:append="copy(roman)"
    />
  </ToolWrapper>
</template>

<tool>
title: 'Roman numeral converter'
description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Delectus distinctio dolor dolorum eaque eligendi, facilis impedit laboriosam odit placeat.'
icon: 'mdi-swap-horizontal'
keywords: [ 'roman', 'arabic', 'converter' ]
path: '/roman-numeral-converter'
</tool>

<script lang="ts">
import {Component} from 'nuxt-property-decorator'
import {CopyableMixin} from '@/mixins/copyable.mixin'
import Tool from '@/components/Tool.vue'

function arabicToRoman(num:number) {
  const lookup: { [key: string]: number } = {M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1}
  let roman = ''
  for (const i in lookup) {
    while (num >= lookup[i]) {
      roman += i
      num -= lookup[i]
    }
  }
  return roman
}

const romanToArabic = (s: string) => {
  const map: { [key: string]: number } = {I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000}
  return [...s].reduce((r, c, i, s) => map[s[i + 1]] > map[c] ? r - map[c] : r + map[c], 0)
}

@Component({
  mixins: [CopyableMixin]
})
export default class RomanNumeralConverter extends Tool {
  arabic = 256

  get roman() {
    return arabicToRoman(this.arabic)
  }

  set roman(value: string) {
    this.arabic = romanToArabic(value)
  }
}
</script>

<style scoped>

</style>
