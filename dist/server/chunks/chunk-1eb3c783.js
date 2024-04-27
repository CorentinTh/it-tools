import { a as __unplugin_components_0, _ as _export_sfc } from './chunk-6003391e.js';
import { a as __unplugin_components_1 } from './chunk-8109fd17.js';
import { defineComponent, withCtx, unref, createTextVNode, createVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { a as randIntFromInterval } from './chunk-11f44f81.js';
import { c as computedRefreshable } from './chunk-cc665c88.js';
import { u as useCopy } from './chunk-77c5cc16.js';
import '@vueuse/core';
import 'pinia';
import 'naive-ui';

const generatePort = () => randIntFromInterval(1024, 65535);

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "random-port-generator",
  __ssrInlineRender: true,
  setup(__props) {
    const [port, refreshPort] = computedRefreshable(() => String(generatePort()));
    const { copy } = useCopy({ source: port, text: "Port copied to the clipboard" });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_c_card = __unplugin_components_1;
      const _component_c_button = __unplugin_components_0;
      _push(ssrRenderComponent(_component_c_card, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="port" data-v-9a5a7fb0${_scopeId}>${ssrInterpolate(unref(port))}</div><div flex justify-center gap-3 data-v-9a5a7fb0${_scopeId}>`);
            _push2(ssrRenderComponent(_component_c_button, {
              onClick: ($event) => unref(copy)()
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Copy `);
                } else {
                  return [
                    createTextVNode(" Copy ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_c_button, { onClick: unref(refreshPort) }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Refresh `);
                } else {
                  return [
                    createTextVNode(" Refresh ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "port" }, toDisplayString(unref(port)), 1),
              createVNode("div", {
                flex: "",
                "justify-center": "",
                "gap-3": ""
              }, [
                createVNode(_component_c_button, {
                  onClick: ($event) => unref(copy)()
                }, {
                  default: withCtx(() => [
                    createTextVNode(" Copy ")
                  ]),
                  _: 1
                }, 8, ["onClick"]),
                createVNode(_component_c_button, { onClick: unref(refreshPort) }, {
                  default: withCtx(() => [
                    createTextVNode(" Refresh ")
                  ]),
                  _: 1
                }, 8, ["onClick"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});

/* unplugin-vue-components disabled */const randomPortGenerator_vue_vue_type_style_index_0_scoped_9a5a7fb0_lang = '';

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/tools/random-port-generator/random-port-generator.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const randomPortGenerator = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-9a5a7fb0"]]);

export { randomPortGenerator as default };
