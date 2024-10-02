---
to: src/modules/tools/definitions/<%= h.changeCase.param(name) %>/<%= h.changeCase.param(name) %>.tool.ts
---
import { defineTool } from '../../tools.models'

export const <%= h.changeCase.camel(name) %>Tool = defineTool({
  slug: '<%= h.changeCase.param(name) %>',
  entryFile: () => import('./<%= h.changeCase.param(name) %>.page'),
  icon: 'i-tabler-question-mark',
  createdAt: new Date('<%= new Date().toISOString().split('T')[0] %>'),
  dirName: '<%= h.changeCase.param(name) %>',
})