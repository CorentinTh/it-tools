import { mergeProps, useSSRContext, defineComponent, unref } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { useThemeVars } from 'naive-ui';
import { _ as _export_sfc } from './chunk-6003391e.js';
import '@vueuse/core';
import 'pinia';

const _sfc_main$1 = {
  __name: 'git-memo.content',
  __ssrInlineRender: true,
  setup(__props, { expose: __expose }) {

const frontmatter = {};
__expose({ frontmatter });

return (_ctx, _push, _parent, _attrs) => {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "markdown-body" }, _attrs))}><h2>Configuration</h2><p>Set the global config</p><pre><code class="language-shell">git config --global user.name &quot;[name]&quot;
git config --global user.email &quot;[email]&quot;
</code></pre><h2>Get started</h2><p>Create a git repository</p><pre><code class="language-shell">git init
</code></pre><p>Clone an existing git repository</p><pre><code class="language-shell">git clone [url]
</code></pre><h2>Commit</h2><p>Commit all tracked changes</p><pre><code class="language-shell">git commit -am &quot;[commit message]&quot;
</code></pre><p>Add new modifications to the last commit</p><pre><code class="language-shell">git commit --amend --no-edit
</code></pre><h2>I’ve made a mistake</h2><p>Change last commit message</p><pre><code class="language-shell">git commit --amend
</code></pre><p>Undo most recent commit and keep changes</p><pre><code class="language-shell">git reset HEAD~1
</code></pre><p>Undo the <code>N</code> most recent commit and keep changes</p><pre><code class="language-shell">git reset HEAD~N
</code></pre><p>Undo most recent commit and get rid of changes</p><pre><code class="language-shell">git reset HEAD~1 --hard
</code></pre><p>Reset branch to remote state</p><pre><code class="language-shell">git fetch origin
git reset --hard origin/[branch-name]
</code></pre><h2>Miscellaneous</h2><p>Renaming the local master branch to main</p><pre><code class="language-shell">git branch -m master main
</code></pre></div>`);
}
}

};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext()
  ;(ssrContext.modules || (ssrContext.modules = new Set())).add("src/tools/git-memo/git-memo.content.md");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : undefined
};
const Memo = _sfc_main$1;

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "git-memo",
  __ssrInlineRender: true,
  setup(__props) {
    const themeVars = useThemeVars();
    return (_ctx, _push, _parent, _attrs) => {
      const _cssVars = { style: {
        "--8cb22b3c": unref(themeVars).cardColor
      } };
      _push(`<div${ssrRenderAttrs(mergeProps(_attrs, _cssVars))} data-v-c7dbeca3>`);
      _push(ssrRenderComponent(unref(Memo), null, null, _parent));
      _push(`</div>`);
    };
  }
});

/* unplugin-vue-components disabled */const gitMemo_vue_vue_type_style_index_0_scoped_c7dbeca3_lang = '';

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/tools/git-memo/git-memo.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const gitMemo = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-c7dbeca3"]]);

export { gitMemo as default };
