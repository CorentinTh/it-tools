<tool>
title: 'Git memo'
description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Delectus distinctio dolor dolorum eaque eligendi, facilis impedit laboriosam odit placeat.'
icon: 'mdi-git'
keywords: ['git', 'memo', 'cheat', 'sheet']
path: '/git-memo'
</tool>

<memo>
## Configuration

### Set the global username

```shell
git config --global user.name "[name]"
```

### Set the global email

```shell
git config --global user.email "[email]"
```

## I've made a mistake

### Change last commit message
```shell
git commit --amend
```

### Undo most recent commit and keep changes
```shell
git reset HEAD~1
```

### Undo most recent commit and get rid of changes
```shell
git reset HEAD~1 --hard
```

### Reset branch to remote state
```shell
git fetch origin
git reset --hard origin/[branch-name]
```

</memo>

<script lang="ts">
import {Component} from 'nuxt-property-decorator'
import Memo from '~/components/Memo.vue'

@Component
export default class GitMemo extends Memo {

}
</script>
