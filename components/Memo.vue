<template>
  <div class="memo">
    <ToolHeader :config="$toolConfig" />

    Warning: le style/aspect est toujours en wip, so focus on content <br><br>

    <v-row>
      <v-col
        v-for="item in items"
        :key="item.section"
        cols="12"
        sm="12"
        md="6"
        lg="4"
        class="memo-section"
      >
        <v-card class="mb-5">
          <v-card-title>{{ item.section }}</v-card-title>
          <v-card-text>
            <div v-for="tip in item.items" :key="tip.text" class="memo-item">
              <div class="memo-item-title">
                {{ tip.text }}
              </div>
              <div v-if="tip.subtitle" class="memo-item-subtitle">
                {{ tip.subtitle }}
              </div>
              <div v-if="tip.code" class="memo-item-code" @click="copy(tip.code)">
                <pre>{{ tip.code }}</pre>
                <v-icon>mdi-content-copy</v-icon>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import {Component} from 'nuxt-property-decorator'
import Tool from './Tool.vue'
import type {ToolConfig} from '~/types/ToolConfig'
import {CopyableMixin} from '~/mixins/copyable.mixin'
import ToolHeader from '~/components/ToolHeader.vue'

type MemoItems = { section: string, items: { text: string, code?: string, subtitle?: string }[] }[];

@Component({
  mixins: [CopyableMixin],
  components: {ToolHeader}
})
export default class Memo extends Tool {
  private memoConfig: ToolConfig = this.config();
  private items: MemoItems = this.$t('memo') as unknown as MemoItems
}
</script>

<style lang="less">
.memo {
  h1 {
    font-weight: 300;
    font-size: 50px;
    margin: 0;
    padding: 0;
  }

  h2 {
    font-weight: 400;
  }

  .memo-item {
    margin-bottom: 20px;

    .memo-item-title {
      font-weight: bold;
      font-size: 16px;
      color: var(--v-primary-base);
    }

    .memo-item-subtitle {
      padding-bottom: 5px;
    }

    .memo-item-code {
      cursor: pointer;
      background-color: rgba(0, 0, 0, 0.1);
      border-radius: 4px;
      padding: 8px 15px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;

      pre {
        flex: 1;
        overflow-x: auto;
      }

      .v-icon {
        opacity: 0;
      }

      &:hover {
        .v-icon {
          opacity: 1;
        }
      }
    }
  }
}
</style>
