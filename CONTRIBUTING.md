# Contributing

## Commit message semantic

// TODO

## Create a tool

Create a `.vue` file in `pages/tools/[category]/[route].vue` where `[category]` correspond to the tool scope and 
`[route]` will be the path of the file in the url (ex: `foo-bar.vue` will be accessible at it-tools.tech/foo-bar).


Here is a template of a component 
```vue
<template>
  <ToolWrapper :config="config()">
    Hello world
  </ToolWrapper>
</template>

<script lang="ts">

import {Component} from 'nuxt-property-decorator'
import type {ToolConfig} from '@/types/ToolConfig'
import Tool from '~/components/Tool.vue'

@Component
export default class MyComponent extends Tool {
  config(): ToolConfig {
    return {
      title: 'My component',
      description: 'The description of my component',
      icon: 'mdi-icon',
      keywords: ['some', 'keywords', 'here']
    }
  }
}

</script>

<style scoped lang="less">
// Extra styling here
</style>

```
