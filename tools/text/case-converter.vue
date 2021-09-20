<template>
  <ToolWrapper :config="$toolConfig">
    <v-text-field
      v-model="text"
      outlined
      label="Input text"
    />

    <v-row no-dense>
      <v-col v-for="item of cases" :key="item.title" class="section" lg="6">
        <h2 class="section-title">
          {{ item.title }}
        </h2>
        {{ item.description }}
        <v-text-field
          dense
          readonly
          outlined
          :value="item.transform(text)"
          append-icon="mdi-content-copy"
          hide-details
          @click:append="copy(item.transform(text))"
        />
      </v-col>
    </v-row>
  </ToolWrapper>
</template>

<tool>
title: 'Case converter'
description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Delectus distinctio dolor dolorum eaque eligendi, facilis impedit laboriosam odit placeat.'
icon: mdi-format-letter-case-upper
keywords: [ flatcase, camelcase ]
path: '/case-converter'
</tool>

<script lang="ts">
import {Component} from 'nuxt-property-decorator'
import * as changeCase from 'change-case'
import {CopyableMixin} from '~/mixins/copyable.mixin'
import Tool from '~/components/Tool.vue'

@Component({
  mixins: [CopyableMixin]
})
export default class CaseConverter extends Tool {
  text = 'lorem ipsum'
  changeCase = changeCase

  cases = [
    {
      title: 'Lowercase',
      description: 'Basically lowercase',
      transform: (s: string) => s.toLowerCase()
    },
    {
      title: 'Uppercase',
      description: 'Basically uppercase',
      transform: (s: string) => s.toUpperCase()
    },
    {
      title: 'Camel case',
      description: 'String with the separator denoted by the next word capitalized.',
      transform: changeCase.camelCase
    },
    {
      title: 'Snake case',
      description: 'Lower case string with underscores between words.',
      transform: changeCase.snakeCase
    },
    {
      title: 'Kebab case',
      description: 'Lower cased string with dashes between words.',
      transform: changeCase.paramCase
    },
    {
      title: 'Capital case',
      description: 'Space separated string with each word capitalized.',
      transform: changeCase.capitalCase
    },
    {
      title: 'Constant case',
      description: 'Upper case string with an underscore between words.',
      transform: changeCase.constantCase
    },
    {
      title: 'Dot case',
      description: 'Lower case string with a period between words.',
      transform: changeCase.dotCase
    },
    {
      title: 'Header case',
      description: 'Dash separated string of capitalized words.',
      transform: changeCase.headerCase
    },
    {
      title: 'No case',
      description: 'Lower cased string with spaces between words.',
      transform: changeCase.noCase
    },
    {
      title: 'Pascal case',
      description: 'String of capitalized words without separators.',
      transform: changeCase.pascalCase
    },
    {
      title: 'Path case',
      description: 'Lower case string with slashes between words.',
      transform: changeCase.pathCase
    },
    {
      title: 'Sentence case',
      description: 'Lower case with spaces between words, then capitalize the string.',
      transform: changeCase.sentenceCase
    },
    {
      title: 'Swap case',
      description: 'Swap every character from upper to lower case, or lower to upper case.',
      transform: (s: string) => s.replace(/\w/g, (val: string) => val === val.toLowerCase() ? val.toUpperCase() : val.toLowerCase())
    },
    {
      title: 'Sponge case',
      description: 'Transform into a string with random capitalization applied.',
      transform: (s: string) => s.replace(/\w/g, (val: string) => Math.random() > 0.5 ? val.toUpperCase() : val.toLowerCase())
    }
  ]
}

</script>

<style scoped lang="less">

</style>
