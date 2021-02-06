<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      fixed
      app
    >
      <div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Blanditiis corporis cumque dolore esse eveniet
        exercitationem explicabo ipsa libero necessitatibus numquam optio pariatur, perferendis placeat porro ullam vel
        velit voluptas voluptates?
      </div>

      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <path fill="#eee" fill-opacity="1"
              d="M0,160L26.7,133.3C53.3,107,107,53,160,58.7C213.3,64,267,128,320,176C373.3,224,427,256,480,250.7C533.3,245,587,203,640,186.7C693.3,171,747,181,800,186.7C853.3,192,907,192,960,186.7C1013.3,181,1067,171,1120,176C1173.3,181,1227,203,1280,192C1333.3,181,1387,139,1413,117.3L1440,96L1440,0L1413.3,0C1386.7,0,1333,0,1280,0C1226.7,0,1173,0,1120,0C1066.7,0,1013,0,960,0C906.7,0,853,0,800,0C746.7,0,693,0,640,0C586.7,0,533,0,480,0C426.7,0,373,0,320,0C266.7,0,213,0,160,0C106.7,0,53,0,27,0L0,0Z"></path>
        <path fill="#05e677" fill-opacity="1"
              d="M0,224L26.7,218.7C53.3,213,107,203,160,213.3C213.3,224,267,256,320,266.7C373.3,277,427,267,480,256C533.3,245,587,235,640,208C693.3,181,747,139,800,106.7C853.3,75,907,53,960,69.3C1013.3,85,1067,139,1120,181.3C1173.3,224,1227,256,1280,266.7C1333.3,277,1387,267,1413,261.3L1440,256L1440,0L1413.3,0C1386.7,0,1333,0,1280,0C1226.7,0,1173,0,1120,0C1066.7,0,1013,0,960,0C906.7,0,853,0,800,0C746.7,0,693,0,640,0C586.7,0,533,0,480,0C426.7,0,373,0,320,0C266.7,0,213,0,160,0C106.7,0,53,0,27,0L0,0Z"></path>
      </svg>

      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
          dense
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title"/>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      app
      flat
      height="60px"
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"/>
      <v-toolbar-title v-text="title"/>
      <v-spacer/>
    </v-app-bar>

    <v-main>
      <v-container>
        <nuxt/>
      </v-container>
    </v-main>
    <!--    <v-footer app>-->
    <!--      <span>&copy; {{ new Date().getFullYear() }}</span>-->
    <!--    </v-footer>-->
  </v-app>
</template>

<script lang="ts">
import {Component, Vue} from 'nuxt-property-decorator';

@Component
export default class DefaultLayout extends Vue {
  title = 'IT - Tools'
  drawer = false
  items = [
    {
      icon: 'mdi-apps',
      title: 'Welcome',
      to: '/'
    },
    {
      icon: 'mdi-apps',
      title: 'Token generator',
      to: '/crypto/TokenGenerator'
    },
    {
      icon: 'mdi-chart-bubble',
      title: 'Inspire',
      to: '/inspire'
    }
  ]

  created() {

  }
}
</script>

<style lang="less">

.v-application {
  background-color: var(--v-background-base, #121212) !important;
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
