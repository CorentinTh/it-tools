<template>
  <v-row justify="center" align="center">
    <v-col lg="1" />
    <v-col lg="4">
      <div>
        <HelloSvg />
      </div>

      <v-card>
        <v-card-title>IT Tools</v-card-title>
        <v-card-text>
          <h2>Hello, World!</h2>
          Welcome to IT-Tools! This wonderful website, originally created with ❤ by Corentin Thomasset, aggregate a set
          of useful tools that every developer may need once in a while. And don't forget to add IT-Tools to your
          shortcut bar (press Ctrl + D).
        </v-card-text>
      </v-card>
    </v-col>
    <v-col lg="1" />
    <v-col cols="12" sm="12" md="12" lg="5">
      <v-row>
        <v-col
          v-for="(items, section) in $toolList"
          :key="section"
          cols="12"
          sm="12"
          md="6"
          lg="6"
          class="tool-group"
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
                    <v-icon>{{ item.icon }}</v-icon>
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title v-text="item.title" />
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
    <v-col lg="1" />
  </v-row>
</template>

<script>
import {Component, Vue} from 'nuxt-property-decorator'
import HelloSvg from '~/assets/hello.svg?inline'

@Component({components: {HelloSvg}})
export default class Index extends Vue {
}
</script>

<style scoped lang="less">
.v-list {
  background: transparent !important;
}

.tool-group {
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
}
</style>
