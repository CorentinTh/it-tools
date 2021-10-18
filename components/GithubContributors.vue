<template>
  <div class="github-contributor">
    <v-list class="pa-0">
      <v-list-item v-for="(contributor, i) in contributors" :key="i" :href="contributor.html_url" target="_blank" rel="noopener noreferrer">
        <v-list-item-avatar>
          <v-img :src="contributor.avatar_url" />
        </v-list-item-avatar>
        <v-list-item-content>
          {{ contributor.login }}
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'nuxt-property-decorator'

import axios from 'axios'
const url = 'https://api.github.com/repos/CorentinTh/it-tools/contributors'

interface IGithubContributors {
    contributions: number;
    // eslint-disable-next-line camelcase
    avatar_url: string;
    login: string;
    type: 'User' | 'Bot'
}

@Component
export default class GithubContributors extends Vue {
  contributors: IGithubContributors[] = []
  fetchOnServer = true

  fetch() {
    axios
      .get(url)
      .then(({data}: {data: IGithubContributors[]}) => {
        this.contributors = data.filter(u => u.type === 'User').sort((a, b) => b.contributions - a.contributions)
      })
  }
}
</script>

<style scoped lang="less">
.github-contributor{
    .v-list {
        background: transparent !important;
    }
}
</style>
