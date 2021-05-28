<template>
  <ToolWrapper :config="$toolConfig">
    <v-slider v-model="paragraphs" min="1" max="20" label="Paragraphs" thumb-label />
    <v-range-slider
      v-model="sentencePerParagraph"
      min="1"
      max="50"
      label="Sentences per paragraph"
      thumb-label
    />
    <v-range-slider
      v-model="wordPerSentence"
      min="1"
      max="50"
      label="Words per sentence"
      thumb-label
      hide-details
    />
    <v-checkbox v-model="startWithLoremIpsum" label="Start with 'Lorem ipsum ...'" hide-details />
    <v-checkbox v-model="asHTML" label="As HTML" />

    <v-textarea
      v-model="loremIpsum"
      outlined
      readonly
      hide-details="auto"
      rows="15"
      class="text-justify"
    />
    <div class="text-center mt-4">
      <v-btn depressed @click="copy(loremIpsum)">
        Copy
      </v-btn>
    </div>
  </ToolWrapper>
</template>

<tool>
title: 'Lorem ipsum generator'
description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Delectus distinctio dolor dolorum eaque eligendi, facilis impedit laboriosam odit placeat.'
icon: 'mdi-comment-text'
keywords: ['Lorem', 'ipsum', 'dolor', 'sit', 'amet']
path: '/lorem-ipsum-generator'
</tool>

<script lang="ts">
import {Component} from 'nuxt-property-decorator'
import {CopyableMixin} from '~/mixins/copyable.mixin'
import Tool from '~/components/Tool.vue'
import {randFromArray, randIntFromInterval} from '~/utils/random'

const vocabulary = ['a', 'ac', 'accumsan', 'ad', 'adipiscing', 'aenean', 'aliquam', 'aliquet', 'amet', 'ante', 'aptent', 'arcu', 'at', 'auctor', 'bibendum', 'blandit', 'class', 'commodo', 'condimentum', 'congue', 'consectetur', 'consequat', 'conubia', 'convallis', 'cras', 'cubilia', 'cum', 'curabitur', 'curae', 'dapibus', 'diam', 'dictum', 'dictumst', 'dignissim', 'dolor', 'donec', 'dui', 'duis', 'egestas', 'eget', 'eleifend', 'elementum', 'elit', 'enim', 'erat', 'eros', 'est', 'et', 'etiam', 'eu', 'euismod', 'facilisi', 'faucibus', 'felis', 'fermentum', 'feugiat', 'fringilla', 'fusce', 'gravida', 'habitant', 'habitasse', 'hac', 'hendrerit', 'himenaeos', 'iaculis', 'id', 'imperdiet', 'in', 'inceptos', 'integer', 'interdum', 'ipsum', 'justo', 'lacinia', 'lacus', 'laoreet', 'lectus', 'leo', 'ligula', 'litora', 'lobortis', 'lorem', 'luctus', 'maecenas', 'magna', 'magnis', 'malesuada', 'massa', 'mattis', 'mauris', 'metus', 'mi', 'molestie', 'mollis', 'montes', 'morbi', 'mus', 'nam', 'nascetur', 'natoque', 'nec', 'neque', 'netus', 'nisi', 'nisl', 'non', 'nostra', 'nulla', 'nullam', 'nunc', 'odio', 'orci', 'ornare', 'parturient', 'pellentesque', 'penatibus', 'per', 'pharetra', 'phasellus', 'placerat', 'platea', 'porta', 'porttitor', 'posuere', 'potenti', 'praesent', 'pretium', 'primis', 'proin', 'pulvinar', 'purus', 'quam', 'quis', 'quisque', 'rhoncus', 'ridiculus', 'risus', 'rutrum', 'sagittis', 'sapien', 'scelerisque', 'sed', 'sem', 'semper', 'senectus', 'sit', 'sociis', 'sociosqu', 'sodales', 'sollicitudin', 'suscipit', 'suspendisse', 'taciti', 'tellus', 'tempor', 'tempus', 'tincidunt', 'torquent', 'tortor', 'turpis', 'ullamcorper', 'ultrices', 'ultricies', 'urna', 'varius', 'vehicula', 'vel', 'velit', 'venenatis', 'vestibulum', 'vitae', 'vivamus', 'viverra', 'volutpat', 'vulputate']
const firstSentence = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
const generateSentence = (length: number) => {
  let sentence = Array.from({length}).map(() => randFromArray(vocabulary)).join(' ')
  sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.'
  return sentence
}

@Component({
  mixins: [CopyableMixin]
})
export default class LoremIpsumGenerator extends Tool {
  paragraphs = 1
  sentencePerParagraph = [3, 8]
  wordPerSentence = [8, 15]
  startWithLoremIpsum = true
  asHTML = false

  get loremIpsum() {
    const lorem = Array
      .from({length: this.paragraphs})
      .map(() => {
        const length = randIntFromInterval(this.sentencePerParagraph[0], this.sentencePerParagraph[1])
        return Array.from({length}).map(() => {
          const wordCount = randIntFromInterval(this.wordPerSentence[0], this.wordPerSentence[1])
          return generateSentence(wordCount)
        })
      })

    if (this.startWithLoremIpsum) {
      lorem[0][0] = firstSentence
    }
    let result
    if (this.asHTML) {
      result = `<p>${lorem.map(s => s.join(' ')).join('</p>\n\n<p>')}</p>`
    } else {
      result = lorem.map(s => s.join(' ')).join('\n\n')
    }
    return result
  }
}

</script>

<style scoped lang="less">
::v-deep {
  .v-label {
    // To align labels
    min-width: 200px !important;
  }
}
</style>
