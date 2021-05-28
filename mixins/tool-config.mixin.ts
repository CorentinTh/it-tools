import {Component, Vue} from 'nuxt-property-decorator'
import {ToolConfig} from '~/types/ToolConfig'

@Component
export class ToolConfigMixin extends Vue {
  public $toolConfig!: ToolConfig;

  beforeCreate() {
    // @ts-ignore
    this.$toolConfig = this.$options.__toolConfig
  }
}
