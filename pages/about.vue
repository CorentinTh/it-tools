<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="12" md="8">
      <h1>Yolo</h1>

      <v-card>
        <v-card-title>Changelog</v-card-title>
        <v-card-text>
          <div class="changelog" v-html="changelog" />
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import {Component, Vue} from 'nuxt-property-decorator'
import changelog from '@/CHANGELOG.md'

@Component
export default class About extends Vue {
  changelog = changelog.replace(/<h1>(.*?)<\/p>/is, '') // Remove h1 and first paragraphe
}
</script>

<style lang="less">
.changelog {
  h2 {
    margin-top: 25px;
    color: #ffffff;
  }

  h3 {
    margin-top: 10px;
    padding-left: 5px;
  }
}
</style>
