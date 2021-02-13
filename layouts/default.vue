<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      fixed
      app
    >
      <div class="small-hero">
        <HeroGradient />
        <div class="small-hero-content">
          <div class="small-hero-content-logo">
            <LogoOutlined />
          </div>
          <div class="small-hero-content-title">
            {{ title }}
          </div>
        </div>
      </div>

      <v-list>
        <div v-for="(items, section) in toolRoutesSections" :key="section">
          <v-subheader class="mt-4 pl-4">
            {{ section }}
          </v-subheader>

          <v-list-item
            v-for="(item, i) in items"
            :key="i"
            :to="items.path"
            router
            exact
            dense
          >
            <v-list-item-action>
              <v-icon>{{ item.config.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title v-text="item.config.title" />
            </v-list-item-content>
          </v-list-item>
        </div>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      app
      flat
      height="60px"
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title v-if="!drawer" v-text="title" />
      <v-spacer />
    </v-app-bar>

    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <!--    <v-footer app>-->
    <!--      <span>&copy; {{ new Date().getFullYear() }}</span>-->
    <!--    </v-footer>-->
  </v-app>
</template>

<script lang="ts">
import {Component, mixins} from 'nuxt-property-decorator'
import {ToolRoutes} from '~/mixins/tool-routes'
import LogoOutlined from '~/assets/logo-outlined.svg?inline'
import HeroGradient from '~/assets/small-hero-gradient.svg?inline'

@Component({
  components: {
    LogoOutlined,
    HeroGradient
  }
})
export default class DefaultLayout extends mixins(ToolRoutes) {
  title = 'IT - Tools'
  drawer = false
  items = []
}
</script>

<style lang="less">

.small-hero {
  position: relative;

  .small-hero-content {
    padding-top: 30px;
    position: absolute;
    top: 0;
    left: 0;
    text-align: center;
    width: 100%;

    .small-hero-content-logo {
      width: 30%;
      margin: 0 auto;
    }

    .small-hero-content-title {
      font-size: 30px;
      font-weight: 600;
      font-family: Ubuntu, Roboto, sans-serif;
    }
  }
}

.v-application {
  background-color: var(--v-background-base, #121212) !important;
}

.v-snack {
  background: none !important;
}

.v-snack__content {
  font-weight: bold !important;
  color: #fff !important;
}

.theme--dark {
  .v-card,
  .v-footer,
  .v-navigation-drawer,
  .v-app-bar.v-toolbar.v-sheet {
    background-color: var(--v-foreground-base, #121212) !important;
  }

  .v-footer,
  .v-app-bar.v-toolbar.v-sheet {
    background-color: var(--v-toolbar-base, #121212) !important;
  }
}
</style>
