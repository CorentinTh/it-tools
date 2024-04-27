import { a as __unplugin_components_1 } from './chunk-8109fd17.js';
import { _ as __unplugin_components_3 } from './chunk-4e7a6a8d.js';
import { defineComponent, ref, computed, unref, isRef, withCtx, createVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { a as codesByCategories } from '../entries/src_pages_Home-page.mjs';
import { u as useFuzzySearch } from './chunk-2ce6ed5e.js';
import './chunk-6003391e.js';
import '@vueuse/core';
import 'pinia';
import './chunk-11f44f81.js';
import './chunk-35c3d701.js';
import 'lodash';
import 'naive-ui';
import '@vicons/tabler';
import '@vueuse/head';
import 'date-fns';
import 'vue-i18n/dist/vue-i18n.runtime.esm-bundler.js';
import '@vicons/material';
import 'figue';
import 'fuse.js';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "http-status-codes",
  __ssrInlineRender: true,
  setup(__props) {
    const search = ref("");
    const { searchResult } = useFuzzySearch({
      search,
      data: codesByCategories.flatMap(({ codes, category }) => codes.map((code) => ({ ...code, category }))),
      options: {
        keys: [{ name: "code", weight: 3 }, { name: "name", weight: 2 }, "description", "category"]
      }
    });
    const codesByCategoryFiltered = computed(() => {
      if (!search.value) {
        return codesByCategories;
      }
      return [{ category: "Search results", codes: searchResult.value }];
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_c_input_text = __unplugin_components_3;
      const _component_c_card = __unplugin_components_1;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_c_input_text, {
        value: unref(search),
        "onUpdate:value": ($event) => isRef(search) ? search.value = $event : null,
        placeholder: "Search http status...",
        autofocus: "",
        "raw-text": "",
        "mb-10": ""
      }, null, _parent));
      _push(`<!--[-->`);
      ssrRenderList(unref(codesByCategoryFiltered), ({ codes, category }) => {
        _push(`<div mb-8><div mb-2 text-xl>${ssrInterpolate(category)}</div><!--[-->`);
        ssrRenderList(codes, ({ code, description, name, type }) => {
          _push(ssrRenderComponent(_component_c_card, {
            key: code,
            "mb-2": ""
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div text-lg font-bold${_scopeId}>${ssrInterpolate(code)} ${ssrInterpolate(name)}</div><div op-70${_scopeId}>${ssrInterpolate(description)} ${ssrInterpolate(type !== "HTTP" ? `For ${type}.` : "")}</div>`);
              } else {
                return [
                  createVNode("div", {
                    "text-lg": "",
                    "font-bold": ""
                  }, toDisplayString(code) + " " + toDisplayString(name), 1),
                  createVNode("div", { "op-70": "" }, toDisplayString(description) + " " + toDisplayString(type !== "HTTP" ? `For ${type}.` : ""), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div>`);
      });
      _push(`<!--]--></div>`);
    };
  }
});

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/tools/http-status-codes/http-status-codes.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
