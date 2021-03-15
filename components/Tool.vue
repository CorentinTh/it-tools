<script lang="ts">
import {Component, Vue} from 'nuxt-property-decorator'
import ToolWrapper from '~/components/ToolWrapper.vue'
import type {ToolConfig} from '~/types/ToolConfig'
@Component({components: {ToolWrapper}})
export default class Tool extends Vue {
  config(): ToolConfig {
    throw new Error('You need to specify a config() method your custom Tool.')
  };

  public head() {
    const {title, description, keywords} = this.config()

    return {
      title,
      meta: [
        {
          name: 'description',
          content: description,
          hid: 'description'
        },
        {
          name: 'keywords',
          content: keywords,
          hid: 'keywords'
        }
      ]
    }
  }
}

</script>
