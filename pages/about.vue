<template>
  <div class="about-page mt-10">
    <v-row justify="center">
      <v-col cols="12" sm="6" md="7" xl="5" class="about-section">
        <v-card>
          <v-card-title class="justify-center text-h4">
            <div class="pt-5">
              About
            </div>
          </v-card-title>
          <v-card-text>
            Welcome to IT-Tools! This wonderful website, originally created with ❤ by <a href="https://corentin-thomasset.fr" target="_blank" rel="noopener noreferrer">Corentin Thomasset</a>, aggregate a set of useful tools that every developer may need once in a while. And don't forget to add IT-Tools to your shortcut bar (press <code>Ctrl + D</code>).

            <v-row class="mt-10">
              <v-col cols="12" lg="6" md="12">
                <h2>A tool is missing?</h2>
                <p class="text-justify">
                  If you need a tool that is not currently not present here, and you think can be
                  relevant, you are welcome to submit a feature request <a
                    href="//github.com/CorentinTh/it-tools/issues/new?assignees=CorentinTh&labels=enhancement&template=feature_request.md&title=%5BFEAT%5D%20My%20feature"
                    target="_blank"
                    rel="noopener noreferrer"
                  >here</a>.
                </p>
              </v-col>
              <v-col cols="12" lg="6" md="12">
                <h2>Found a bug?</h2>
                <p class="text-justify">
                  If you found a bug, or something broken that doesn't work as expected, please fill a bug report here <a
                    href="//github.com/CorentinTh/it-tools/issues/new?assignees=CorentinTh&labels=bug&template=bug_report.md&title=%5BBUG%5D%20My%20bug"
                    target="_blank"
                    rel="noopener noreferrer"
                  >here</a>.
                </p>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        <br>
        <v-card>
          <v-card-title class="justify-center text-h4">
            <div class="pt-5">
              Contributors
            </div>
          </v-card-title>
          <v-card-text>
            <GithubContributors />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <v-card>
          <v-card-title class="justify-center text-h4">
            <div class="pt-5">
              Changelog
            </div>
          </v-card-title>
          <v-card-text>
            <div class="changelog" v-html="changelog" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import {Component, Vue} from 'nuxt-property-decorator'
import GithubContributors from '@/components/GithubContributors.vue'
import changelog from '@/CHANGELOG.md'

@Component({components: {GithubContributors}})
export default class About extends Vue {
  changelog = changelog.replace(/<h1>(.*?)<\/p>/is, '') // Remove h1 and first paragraphe
}
</script>

<style lang="less">

.about-page {
  .about-section{
    text-align: justify;
  }

  .changelog {
    h2 {

      &:not(:first-child) {
        margin-top: 25px;
      }

      color: #ffffff;
    }

    h3 {
      margin-top: 10px;
      padding-left: 5px;
    }

    .v-card-title{
      text-align: center;
    }
  }
}

</style>
