---
inject: true
to: src/modules/tools/tools.registry.ts
at_line: 0
---
import { <%= h.changeCase.camel(name) %>Tool } from './definitions/<%= h.changeCase.param(name) %>/<%= h.changeCase.param(name) %>.tool';