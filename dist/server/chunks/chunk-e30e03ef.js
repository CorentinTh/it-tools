import { _ as _sfc_main$1 } from '../entries/src_ui_demo_demo-home-page.mjs';
import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import { useHead } from '@vueuse/head';
import './chunk-6003391e.js';
import '@vueuse/core';
import 'pinia';
import './chunk-28375bc9.js';
import './chunk-95ec8cf7.js';
import 'lodash';
import './chunk-000e277f.js';
import './chunk-8109fd17.js';
import './chunk-bb5bb4f6.js';
import './chunk-83cdd9a0.js';
import './chunk-4e7a6a8d.js';
import './chunk-11f44f81.js';
import './chunk-35c3d701.js';
import 'vue-router';
import 'marked';
import 'dompurify';
import './chunk-6ba26b76.js';
import './chunk-77c5cc16.js';
import 'naive-ui';
import './chunk-89a4876c.js';
import './chunk-2ce6ed5e.js';
import 'fuse.js';
import './chunk-aab02bfe.js';
import './chunk-aff50618.js';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "About",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({ title: "About - Zeeklog Online Tools" });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_c_markdown = _sfc_main$1;
      _push(ssrRenderComponent(_component_c_markdown, mergeProps({
        markdown: _ctx.$t("about.content"),
        "mx-auto": "",
        "mt-50px": "",
        "max-w-600px": ""
      }, _attrs), null, _parent));
    };
  }
});

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/About.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
