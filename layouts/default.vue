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

      <SearchBar class="hidden-sm-and-up" />

      <v-list>
        <div v-for="(items, section) in toolRoutesSections" :key="section">
          <v-subheader class="mt-4 pl-4">
            {{ section }}
          </v-subheader>

          <v-list-item
            v-for="(item, i) in items"
            :key="i"
            :to="item.path"
            router
            exact
            dense
          >
            <v-list-item-action>
              <v-icon color="primary">
                {{ item.config.icon }}
              </v-icon>
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
      <v-toolbar-title>
        <NuxtLink to="/" class="title">
          {{ title }}
        </NuxtLink>
      </v-toolbar-title>
      <v-spacer />
      <SearchBar class="hidden-sm-and-down" />
      <v-spacer />

      <NuxtLink to="/how-to-report-bug-or-request">
        Bug / Request
      </NuxtLink>
      <NuxtLink to="/about">
        About
      </NuxtLink>
      <a href="https://github.com/CorentinTh/it-tools" target="_blank" class="github-link">
        <v-icon>mdi-github</v-icon>
      </a>
    </v-app-bar>

    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <!--<v-footer app>-->
    <!--  <span>&copy; {{ new Date().getFullYear() }}</span>-->
    <!--</v-footer>-->
  </v-app>
</template>

<script lang="ts">
import {Component, mixins} from 'nuxt-property-decorator'
import {ToolRoutesMixin} from '~/mixins/tool-routes.mixin'
import LogoOutlined from '~/assets/logo-outlined.svg?inline'
import HeroGradient from '~/assets/small-hero-gradient.svg?inline'
import SearchBar from '~/components/SearchBar.vue'

@Component({
  components: {
    LogoOutlined,
    HeroGradient,
    SearchBar
  }
})
export default class DefaultLayout extends mixins(ToolRoutesMixin) {
  title = 'IT - Tools'
  drawer = false
  items = []
}
</script>

<style lang="less">

.v-toolbar__content {
  a {
    color: #ffffff;
    text-decoration: none;
    transition: all ease 0.2s;
    margin: 0 10px;
    opacity: 0.5;
    font-size: 15px;

    &.title{
      opacity: 1;
    }

    &:hover {
      opacity: 1;
      color: var(--v-primary-base);
    }
  }

  .github-link {
    border-bottom: none;
    margin-left: 10px;
    transition: all ease 0.2s;

    .v-icon {
      font-size: 37px !important;
      color: var(--v-primary-base);
      transition: all ease 0.2s;
      transition: all ease 0.2s;

    }
  }
}

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
      width: 25%;
      margin: 0 auto;
    }

    .small-hero-content-title {
      margin-top: 10px;
      font-size: 25px;
      font-weight: 600;
      font-family: Ubuntu, Roboto, sans-serif;
    }
  }
}

.v-navigation-drawer__content{
  .v-list-item--active{
    color: var(--v-anchor-base);
    border-left: 3px solid var(--v-primary-base);
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
