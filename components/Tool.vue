<script lang="ts">
import {Component, Vue} from 'nuxt-property-decorator'
import ToolWrapper from '~/components/ToolWrapper.vue';

interface ToolConfig {
  title: string;
  description: string;
}

export {ToolConfig}

@Component({components: {ToolWrapper}})
export default class Tool extends Vue {
  public isTool = true;
  public config: ToolConfig = {
    title: 'Tool',
    description: 'Tool description'
  }

  public head() {
    const {title, description} = this.config

    return {
      title,
      description
    }
  }
}

</script>
