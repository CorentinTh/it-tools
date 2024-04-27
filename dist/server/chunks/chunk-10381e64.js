import { a as __unplugin_components_0 } from './chunk-6003391e.js';
import { defineComponent, computed, resolveComponent, mergeProps, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import _ from 'lodash';
import { d as demoRoutes } from '../entries/src_ui_demo_demo-home-page.mjs';
import { useRoute } from 'vue-router';
import '@vueuse/core';
import 'pinia';
import './chunk-28375bc9.js';
import './chunk-95ec8cf7.js';
import './chunk-000e277f.js';
import './chunk-8109fd17.js';
import './chunk-bb5bb4f6.js';
import './chunk-83cdd9a0.js';
import './chunk-4e7a6a8d.js';
import './chunk-11f44f81.js';
import './chunk-35c3d701.js';
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
  __name: "demo-wrapper",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const componentName = computed(() => _.startCase(String(route.name).replace(/^c-/, "")));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_c_button = __unplugin_components_0;
      const _component_router_view = resolveComponent("router-view");
      _push(`<div${ssrRenderAttrs(mergeProps({
        "mt-2": "",
        "w-full": "",
        "p-8": ""
      }, _attrs))}><h1>c-lib components</h1><div flex><div w-200px b-r b-gray b-op-10 b-r-solid pr-4><!--[-->`);
      ssrRenderList(unref(demoRoutes), ({ name }) => {
        _push(ssrRenderComponent(_component_c_button, {
          key: name,
          variant: "text",
          to: { name },
          "w-full": "",
          "important:justify-start": "",
          "important:text-left": "",
          type: unref(route).name === name ? "primary" : "default"
        }, {
          default: withCtx((_2, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(name)}`);
            } else {
              return [
                createTextVNode(toDisplayString(name), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div><div flex-1 pl-4><h1>${ssrInterpolate(unref(componentName))}</h1>`);
      _push(ssrRenderComponent(_component_router_view, null, null, _parent));
      _push(`</div></div></div>`);
    };
  }
});

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/ui/demo/demo-wrapper.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
