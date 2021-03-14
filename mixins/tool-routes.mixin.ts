import {Component, Vue} from 'nuxt-property-decorator'
import {ToolRouteConfig} from '~/types/ToolConfig'
import {capitalise} from '~/utils/string'


@Component
export class ToolRoutesMixin extends Vue {
  toolRoutesFlat : ToolRouteConfig[] = []
  toolRoutesSections : {[key: string]: ToolRouteConfig[]} = {}

  async created() {
    const routes = this.$router.options.routes?.filter(r => r.meta?.isTool) || []
    const flat: ToolRouteConfig[] = []
    const sections: { [key: string]: ToolRouteConfig[] } = {}

    for (const route of routes) {
      if ('component' in route) {
        // @ts-ignore
        const component = await route.component()
        const routeConfig = {...route, config: component.options.methods.config()} as ToolRouteConfig
        flat.push(routeConfig)

        const sectionKey = capitalise(route.meta.section).replace(/_/g, ' ')

        if (!(sectionKey in sections)) {
          sections[sectionKey] = []
        }

        sections[sectionKey].push(routeConfig)
      }
    }

    this.toolRoutesSections = sections
    this.toolRoutesFlat = flat
  }
}
