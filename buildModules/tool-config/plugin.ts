// @ts-nocheck
import {Plugin} from '@nuxt/types'
import type {ToolRouteConfig} from '~/types/ToolConfig';

declare module 'vue/types/vue' {
  interface Vue {
    $toolListFlat: ToolRouteConfig[]
    $toolList: { [key: string]: ToolRouteConfig[] }
  }
}

const plugin: Plugin = (_, inject) => {
  inject('toolListFlat', <%= serialize(options.toolListFlat) %>)
  inject('toolList', <%= serialize(options.toolList) %>)
}
export default plugin
