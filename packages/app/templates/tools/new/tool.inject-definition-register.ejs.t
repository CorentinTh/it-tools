---
inject: true
to: src/modules/tools/tools.registry.ts
before: "^]"
---
  <%= h.changeCase.camel(name) %>Tool,