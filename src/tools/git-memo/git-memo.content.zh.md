## 配置

设置全局配置

```shell
git config --global user.name "[姓名]"
git config --global user.email "[邮箱]"
```

## 入门

创建一个 git 仓库

```shell
git init
```

克隆现有的 git 仓库

```shell
git clone [url]
```

## 提交

提交所有已跟踪的更改

```shell
git commit -am "[提交信息]"
```

将新修改添加到上次提交中

```shell
git commit --amend --no-edit
```

## 我犯了一个错误

更改上次提交的消息

```shell
git commit --amend
```

撤消最近的提交并保留更改

```shell
git reset HEAD~1
```

撤消最近的 `N` 个提交并保留更改

```shell
git reset HEAD~N
```

撤消最近的提交并放弃更改

```shell
git reset HEAD~1 --hard
```

将分支重置为远程状态

```shell
git fetch origin
git reset --hard origin/[分支名]
```

## 其他

将本地 master 分支重命名为 main

```shell
git branch -m master main
```