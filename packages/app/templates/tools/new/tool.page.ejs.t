---
to: src/modules/tools/definitions/<%= h.changeCase.param(name) %>/<%= h.changeCase.param(name) %>.page.tsx
---
import type { Component } from 'solid-js';

const <%= h.changeCase.pascal(name) %>: Component = () => {
  return (
    <div class="mx-auto max-w-1200px p-6">
      <h1><%= h.changeCase.title(name) %></h1>
    </div>
  );
}

export default <%= h.changeCase.pascal(name) %>;