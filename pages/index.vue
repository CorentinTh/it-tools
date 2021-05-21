<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="12" md="12">
      <h1>Yolo</h1>

      <v-row>
        <v-col
          v-for="(items, section) in toolRoutesSections"
          :key="section"
          cols="12"
          sm="12"
          md="6"
          lg="4"
        >
          <v-card>
            <v-card-title>{{ section }}</v-card-title>
            <v-card-text>
              <v-list>
                <v-list-item
                  v-for="(item, i) in items"
                  :key="i"
                  :to="item.path"
                  router
                  exact
                >
                  <v-list-item-action>
                    <v-icon>{{ item.config.icon }}</v-icon>
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title v-text="item.config.title" />
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import {Component, mixins} from 'nuxt-property-decorator'
import {ToolRoutesMixin} from '@/mixins/tool-routes.mixin'

@Component
export default class Index extends mixins(ToolRoutesMixin) {
}
</script>

<style scoped lang="less">
.v-list {
  background: transparent !important;
}

.v-card__title {
  background: var(--v-primary-base) !important;
  background: linear-gradient(90deg, rgba(37, 99, 108, 1) 0%, rgba(59, 149, 111, 1) 60%, rgba(71, 177, 113, 1) 100%) !important;
  padding-left: 33px;
}

.v-list-item {
  padding-left: 31px;
}

.v-card__text {
  padding: 0;
}
</style>
