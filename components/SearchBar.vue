<template>
  <v-autocomplete
    label="Search..."
    single-line
    append-icon="fa-search"
    color="white"
    hide-details
    :items="items"
    item-text="text"
    item-value="path"
    solo-inverted
    :filter="filter"
    clearable
    cache-items
    @change="choose"
  >
    <template v-slot:no-data>
      <v-list-item>
        <v-list-item-title>
          Search for the <strong>tool</strong> you need!
        </v-list-item-title>
      </v-list-item>
    </template>
  </v-autocomplete>
</template>

<script>
import {Component, Vue} from 'nuxt-property-decorator'
import {ToolRoutes} from '~/mixins/tool-routes'

@Component({
  mixins: [ToolRoutes]
})
export default class SearchBar extends Vue {
  title = 'IT - Tools'
  drawer = false
  items = []
}
</script>

<style scoped lang="less">
::v-deep .v-list-item__mask{
  color: inherit !important;
  background: inherit !important;
}
</style>
