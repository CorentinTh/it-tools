<template>
  <v-autocomplete
    label="Search..."
    single-line
    append-icon="mdi-magnify"
    color="white"
    hide-details
    :items="toolRoutesFlat"
    :item-text="item => item.config.title"
    item-value="path"
    solo-inverted
    dense
    :filter="filterItems"
    clearable
    cache-items
    @change="choose"
  >
    <template #no-data>
      <v-list-item>
        <v-list-item-title>
          Search for the <strong>tool</strong> you need!
        </v-list-item-title>
      </v-list-item>
    </template>
  </v-autocomplete>
</template>

<script lang="ts">
import {Component, mixins} from 'nuxt-property-decorator'
import {ToolRoutesMixin} from '@/mixins/tool-routes.mixin'
import {ToolRouteConfig} from '~/types/ToolConfig'

@Component
export default class SearchBar extends mixins(ToolRoutesMixin) {
  choose(path:string) {
    this.$router.push({path})
  }

  filterItems(item:ToolRouteConfig, queryText:string, itemText:string) {
    const query = queryText.trim().toLowerCase()
    const nameContainsText = itemText.toLowerCase().includes(query)
    const keywordContainsText = item?.config?.keywords.join(' ').toLowerCase().includes(query) ?? false
    return nameContainsText || keywordContainsText
  }
}
</script>

<style scoped lang="less">
::v-deep {
  .v-input__slot{
    background: var(--v-primary-base) !important;
    background: linear-gradient(90deg, rgba(37,99,108,1) 0%, rgba(59,149,111,1) 60%, rgba(71,177,113,1) 100%) !important;
    input {
      color: #ffffff !important;
    }
  }

}

.v-list{
  background: var(--v-foreground-base) !important;
}
</style>
