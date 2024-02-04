## 配置

设置全局配置

```shell
git config --global user.name "[name]"
git config --global user.email "[email]"
```

## 开始使用

创建 git 存储库

```shell
git init
```

克隆现有的 git 存储库

```shell
git clone [url]
```

## 提交

提交所有跟踪的更改

```shell
git commit -am "[commit message]"
```

向上次提交添加新的修改

```shell
git commit --amend --no-edit
```

## 我犯了一个错误

更改最后提交消息

```shell
git commit --amend
```

撤消最近的提交并保留更改

```shell
git reset HEAD~1
```

撤消“N”最近的提交并保留更改

```shell
git reset HEAD~N
```

撤消最近的提交并摆脱更改

```shell
git reset HEAD~1 --hard
```

将分支重置为远程状态

```shell
git fetch origin
git reset --hard origin/[branch-name]
```

## 其他

将本地master分支重命名为main

```shell
git branch -m master main
```
