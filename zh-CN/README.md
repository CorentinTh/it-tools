![logo](.github/logo.png)

对于开发人员和 IT 工作人员来说非常有用的工具。 

[[在线预览](https://it-tools.haokudelei.com/)]

## 建议新工具

请前往 issues 提出新工具的想法，并查看列出的某些功能是否已实现。

## 指北

### 推荐的 IDE 设置

建议安装 [VSCode](https://code.visualstudio.com/) 扩展:

- [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (需要禁用 Vetur)
- [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [i18n Ally](https://marketplace.visualstudio.com/items?itemName=lokalise.i18n-ally)

建议的扩展设置:

```json
{
  "editor.formatOnSave": false,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "i18n-ally.localesPaths": ["locales", "src/tools/*/locales"],
  "i18n-ally.keystyle": "nested"
}
```

### TS 中对“.vue”导入的类型支持

默认情况下，TypeScript 无法处理“.vue”导入的类型信息，因此我们将“tsc”CLI 替换为“vue-tsc”来进行类型检查。 在编辑器中，我们需要 [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) 来使 TypeScript 语言服务识别 `.vue` 类型。

如果您觉得独立的 TypeScript 插件不够快，Volar 还实现了性能更高的[接管模式](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669)。 您可以通过以下步骤启用它：

1.禁用内置的TypeScript扩展
    1. 从 VSCode 的命令面板运行 “扩展：显示内置扩展”
    2. 找到 “TypeScript 和 JavaScript 语言功能” ，右键单击并选择 “禁用（工作区）”
2. 通过从命令面板运行 “Developer: Reload Window” 来重新加载 VSCode 窗口。

### 下载

```sh
git clone https://gitee.com/angelofan/it-tools.git
```

### 安装依赖

```sh
cd it-tools
```

```sh
npm install
```

### 启动实时重载开发

```sh
npm run dev
```

### 编译

```sh
npm run build
```

### 使用 [ESLint](https://eslint.org/) 进行检查

```sh
npm run lint
```

### 创建一个新工具

要创建新工具，有一个脚本可以生成新工具的样板文件，只需运行：

```sh
npm run script:create:tool your-tool-name
```

它将在 “src/tools” 中创建一个包含正确文件的目录，并在 “src/tools/index.ts” 中自动导入。您只需要将导入的工具添加到适当的类别中并开发该工具。

## 贡献

非常感谢所有已经做出贡献的人！

由作者 [Corentin Thomasset](//corentin-thomasset.fr) 编写。

该项目使用 [vercel.com](https://vercel.com) 持续部署。

贡献者图是使用 [contrib.rocks](https://contrib.rocks/preview?repo=corentinth/it-tools) 生成的。

## 许可证

[GNU GPLv3](LICENSE)
