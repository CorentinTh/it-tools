<script lang="ts">
import {Component} from 'nuxt-property-decorator'
import type {ToolConfig} from '@/types/ToolConfig'
import Memo from '~/components/Memo.vue'

@Component
export default class GitMemo extends Memo {
  config(): ToolConfig {
    return {
      title: 'Git memo',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Delectus distinctio dolor dolorum eaque eligendi, facilis impedit laboriosam odit placeat.',
      icon: 'mdi-git',
      keywords: ['git', 'memo', 'cheat', 'sheet']
    }
  }
}
</script>

<i18n lang="yaml">
en:
  memo:
    - section: Titre de la section 1
      items:
        - text: Tip n°1
        - text: Tip n°2 (avec sous titre
          subtitle: Un super sous titre
        - text: Tip n°3 (avec du code !)
          code: rm -rf / --no-preserve-root
        - text: Tip n°4 (avec du code et un sous titre !)
          code: rm -rf / --no-preserve-root
          subtitle: Un super sous titre, yeah

    - section: Titre de la section 2
      items:
        - text: Tip n°1
        - text: Tip n°2
        - text: Tip n°3 (avec du code !)
          code: rm -rf / --no-preserve-root
        - text: Tip n°4
          code: "multiline\ncode sample"

    - section: Titre de la section 3
      items:
        - text: Tip n°1
        - text: Tip n°2 (avec sous titre
          subtitle: Un super sous titre
        - text: Tip n°3 (avec du code !)
          code: rm -rf / --no-preserve-root
        - text: Tip n°4 (avec du code et un sous titre !)
          code: rm -rf / --no-preserve-root
          subtitle: Un super sous titre, yeah

    - section: Titre de la section 4
      items:
        - text: Tip n°1
        - text: Tip n°2 (avec sous titre
          subtitle: Un super sous titre
        - text: Tip n°3 (avec du code !)
          code: rm -rf / --no-preserve-root
        - text: Tip n°4 (avec du code et un sous titre !)
          code: rm -rf / --no-preserve-root
          subtitle: Un super sous titre, yeah
</i18n>
