## Configuration

Set the global config

```shell
git config --global user.name "[name]"
git config --global user.email "[email]"
```

## Get started

Create a git repository

```shell
git init
```

Clone an existing git repository

```shell
git clone [url]
```

## Commit

Commit all tracked changes

```shell
git commit -am "[commit message]"
```

Add new modifications to the last commit

```shell
git commit --amend --no-edit
```

## I’ve made a mistake

Change last commit message

```shell
git commit --amend
```

Undo most recent commit and keep changes

```shell
git reset HEAD~1
```

Undo the `N` most recent commit and keep changes

```shell
git reset HEAD~N
```

Undo most recent commit and get rid of changes

```shell
git reset HEAD~1 --hard
```

Reset branch to remote state

```shell
git fetch origin
git reset --hard origin/[branch-name]
```

## Miscellaneous

Renaming the local master branch to main

```shell
git branch -m master main
```

Checking log graph
```shell
git log --graph
```

Checking log graph (merges only)

```shell
git log --graph --merges
```

Tracking down a bad commit using binary search

```shell
git bisect start
git bisect good 13c988d4f15e06bcdd0b0af290086a3079cdadb0
git bisect bad ca82a6dff817ec66f44342007202690a93763949
```

Pulling new changes into current branch from mainline

```shell
git checkout [branch-name]
git fetch origin [master-branch-name]
git rebase origin/[master-branch-name]
```
