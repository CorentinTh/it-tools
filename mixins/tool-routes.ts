import {Component, Vue} from 'nuxt-property-decorator'
import {RouteConfig} from '@nuxt/types/config/router'
import {ToolConfig} from '~/types/ToolConfig'
import {capitalise} from '~/utils/string'

export type ToolRouteConfig = RouteConfig & {config: ToolConfig}

@Component
export class ToolRoutes extends Vue {
  toolRoutesFlat : ToolRouteConfig[] = []
  toolRoutesSections : {[key: string]: ToolRouteConfig[]} = {}

  async mounted() {
    const routes = this.$router.options.routes?.filter(r => r.meta?.isTool) || []

    for (const route of routes) {
      if ('component' in route) {
        // @ts-ignore
        const component = await route.component()
        const routeConfig = {...route, config: component.options.methods.config()} as ToolRouteConfig
        this.toolRoutesFlat.push(routeConfig)

        const sectionKey = capitalise(route.meta.section).replace(/_/g, ' ')

        if (!(sectionKey in this.toolRoutesSections)) {
          this.toolRoutesSections[sectionKey] = []
        }

        this.toolRoutesSections[sectionKey].push(routeConfig)
      }
    }
  }
}
