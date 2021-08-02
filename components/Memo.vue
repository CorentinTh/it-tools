<template>
  <div class="memo">
    <v-row justify="center">
      <v-col lg="6" md="9" sm="9" cols="12" class="mb-16">
        <ToolHeader :config="$toolConfig" />

        <v-card>
          <v-card-text class="pa-10">
            <div class="memo-content" v-html="content" />
          </v-card-text>
        </v-card>
      </v-col>

      <v-col lg="2" md="3" sm="3" cols="12">
        <div class="toc">
          <div class="toc-title">
            On this page
          </div>
          <div class="toc-content" v-html="toc" />
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import {Component} from 'nuxt-property-decorator'
import Tool from './Tool.vue'
import {CopyableMixin} from '~/mixins/copyable.mixin'
import ToolHeader from '~/components/ToolHeader.vue'
import {toc} from '~/utils/md-toc'

@Component({
  mixins: [CopyableMixin],
  components: {ToolHeader}
})
export default class Memo extends Tool {
  fetchOnServer = true
  content: string = ''
  toc: string = ''

  fetch() {
    // @ts-ignore
    const content: string = this.$options.__memo.trim()

    this.toc = this.$md.render(toc(content).join('\n'))
    this.content = this.$md.render(content)
  }
}
</script>

<style lang="less" scoped>
.memo {

  ::v-deep {
    .memo-content {
      text-align: justify;

      h2 {
        font-weight: 400;
        font-size: 25px;
        margin: 0 0 20px 0;
        padding-bottom: 10px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.26);
        color: #ffffff;

        &:not(:first-child){
          margin-top: 50px;
        }
      }

      h3 {
        font-weight: 400;
        margin-top: 20px;
        margin-bottom: 10px;
      }

      pre {
        width: 100%;
        overflow-x: auto;

        code {
          display: block;
          padding: 15px;
        }
      }
    }
  }

  .toc {
    margin-top: 140px;

    .toc-title {
      font-weight: 600;
      margin-bottom: 10px;
    }

    ::v-deep {
      .toc-content {
        a {
          color: #ffffff;
          text-decoration: none;
          opacity: 0.7;
          transition: all 0.3s ease;
          font-weight: 400;

          &:hover {
            opacity: 1;
            color: var(--v-primary-base);
          }
        }

        ul {
          list-style-type: none;
          padding-left: 10px;

          li {
            padding: 5px 0;
          }
        }

        &>ul {
          padding-left: 0;

          &>li {
            border-top: 1px dashed rgba(238, 238, 238, 0.38);
            padding: 5px 0 5px 10px;

            &>a {
              font-weight: 600 !important;
            }
          }
        }
      }
    }
  }
}
</style>
