<tool>
title: 'Git memo old'
description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Delectus distinctio dolor dolorum eaque eligendi, facilis impedit laboriosam odit placeat.'
icon: 'mdi-git'
keywords: ['git', 'memo', 'cheat', 'sheet']
path: '/git-memo-test'
</tool>

<template lang="md">
  <ToolWrapper :config="$toolConfig">

  ## test

  ```js
  yolo
  ```
  </ToolWrapper>
</template>

<script lang="ts">
import {Component} from 'nuxt-property-decorator'
import Tool from '~/components/Tool.vue'

@Component
export default class GitMemo extends Tool {
}
</script>
