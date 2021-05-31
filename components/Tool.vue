<script lang="ts">
import {Component, mixins} from 'nuxt-property-decorator'
import ToolWrapper from '~/components/ToolWrapper.vue'
import {ToolConfigMixin} from '~/mixins/tool-config.mixin'

@Component({
  components: {ToolWrapper}
})
export default class Tool extends mixins(ToolConfigMixin) {
  public head() {
    const {title, description, keywords} = this.$toolConfig

    const uniqueKeywordsCleaned = [...new Set([...keywords, ...title.split(/\s+/)].map(s => s.trim().toLowerCase()))]

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
          content: uniqueKeywordsCleaned,
          hid: 'keywords'
        }
      ]
    }
  }
}

</script>
