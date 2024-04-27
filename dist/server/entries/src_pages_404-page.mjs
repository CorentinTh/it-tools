import { a as __unplugin_components_0$1 } from '../chunks/chunk-6003391e.js';
import { openBlock, createElementBlock, createElementVNode, defineComponent, mergeProps, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { useHead } from '@vueuse/head';
import '@vueuse/core';
import 'pinia';

const _hoisted_1 = {
  viewBox: "0 0 24 24",
  width: "1.2em",
  height: "1.2em"
};
const _hoisted_2 = /*#__PURE__*/createElementVNode("path", {
  fill: "currentColor",
  d: "M9.5 3C4.8 3 1 5.7 1 9c0 1.2.5 2.3 1.4 3.3C1.5 13.5.985 15 1 16.5V20c0 1.1.9 2 2 2h13c1.11 0 2-.89 2-2v-3.5c0-1.2-.3-2.4-1-3.5l2-2l-3-3l-2.1 2.1a9.191 9.191 0 0 0-9.3.3C4.22 10.03 4 9.53 4 9c0-1.8 2.5-3.3 5.5-3.3c1.4 0 2.8.4 3.8 1l2-2A10.05 10.05 0 0 0 9.5 3m0 8c3.5 0 6.5 3 6.5 5.5V20H3v-3.5C3 14 6 11 9.5 11m.5 1.5c-3 0-5 1.5-5 4.5v1h2v-1c0-1 0-3.5 3-4.5m13-5.2c0 1.63-1.09 3.3-2.62 3.67l-.67-.68L19 9.6h.75c1 0 1.75-1.38 1.75-2.4s-.85-2.06-1.85-2.06v-1.5C21.5 3.64 23 5.45 23 7.3m-5.35-.57c-.62-.61-1-1.45-1-2.38C16.65 2.5 18.15 1 20 1v1.5c-1 0-1.85.83-1.85 1.85S19 6.2 20 6.2v1.5c-.82 0-1.58.25-2.21.68l-1.07-1.07c.28-.22.6-.42.93-.58Z"
}, null, -1);
const _hoisted_3 = [
  _hoisted_2
];

function render(_ctx, _cache) {
  return (openBlock(), createElementBlock("svg", _hoisted_1, _hoisted_3))
}

const __unplugin_components_0 = { name: 'mdi-kettle-steam-outline', render };
/* vite-plugin-components disabled */

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "404.page",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({ title: "Page not found - Zeeklog Online Tools" });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_icon_mdi58kettle_steam_outline = __unplugin_components_0;
      const _component_c_button = __unplugin_components_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({
        "mt-20": "",
        flex: "",
        "flex-col": "",
        "items-center": ""
      }, _attrs))}><span text-90px lh-1 op-50>`);
      _push(ssrRenderComponent(_component_icon_mdi58kettle_steam_outline, null, null, _parent));
      _push(`</span><h1 m-0 mt-3>${ssrInterpolate(_ctx.$t("404.notFound"))}</h1><div mt-4 op-60>${ssrInterpolate(_ctx.$t("404.sorry"))}</div><div mb-8 op-60>${ssrInterpolate(_ctx.$t("404.maybe"))}</div>`);
      _push(ssrRenderComponent(_component_c_button, { to: "/" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(_ctx.$t("404.backHome"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(_ctx.$t("404.backHome")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/404.page.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
