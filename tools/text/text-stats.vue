<template>
  <ToolWrapper :config="$toolConfig">
    <v-textarea
      v-model="text"
      outlined
      label="Input text"
      hide-details
      auto-grow
    />

    <div>{{ $toolListFlat }}</div>

    <table>
      <tbody>
        <tr>
          <td><strong>Character count:</strong></td>
          <td>{{ textLength }}</td>
        </tr>
        <tr>
          <td><strong>Word count:</strong></td>
          <td>{{ textWordCount }}</td>
        </tr>
        <tr>
          <td><strong>Line count:</strong></td>
          <td>{{ textLineCount }}</td>
        </tr>
        <tr>
          <td><strong>Byte size:</strong></td>
          <td>{{ textSize }}</td>
        </tr>
      </tbody>
    </table>
  </ToolWrapper>
</template>

<tool>
title: 'Text stats'
description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Delectus distinctio dolor dolorum eaque eligendi, facilis impedit laboriosam odit placeat.'
icon: mdi-text
keywords: [ length, character, count ]
path: '/text-stats'
</tool>

<script lang="ts">
import {Component} from 'nuxt-property-decorator'
import {CopyableMixin} from '~/mixins/copyable.mixin'
import Tool from '~/components/Tool.vue'
import {formatBytes} from '~/utils/convert'

@Component({
  mixins: [CopyableMixin]
})
export default class TextStats extends Tool {
  text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'

  created() {
  }

  get textLength() {
    return this.text.length
  }

  get textWordCount() {
    return this.text.split(/\s+/).length
  }

  get textLineCount() {
    return this.text.split(/\r\n|\r|\n/).length
  }

  get textSize() {
    return formatBytes(Uint8Array.from(this.text as unknown as ArrayLike<number>).buffer.byteLength, 3)
  }
}

</script>

<style scoped lang="less">
table {
  width: 100%;

  tr {
    td {
      width: 50%;
      padding: 5px;

      &:first-child {
        text-align: right;
      }
    }
  }
}
</style>
