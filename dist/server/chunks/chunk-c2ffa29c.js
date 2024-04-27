import { openBlock, createElementBlock, createElementVNode, defineComponent, ref, computed, withCtx, unref, isRef, createVNode, createBlock, Fragment, renderList, useSSRContext } from 'vue';
import { NDivider } from 'naive-ui';
import { _ as __unplugin_components_3$1 } from './chunk-4e7a6a8d.js';
import { a as __unplugin_components_1 } from './chunk-8109fd17.js';
import { ssrRenderComponent, ssrRenderList, ssrRenderStyle } from 'vue/server-renderer';
import { _ as _sfc_main$1 } from './chunk-de61ec1c.js';
import { i as isNotThrowing } from './chunk-5697d061.js';
import { w as withDefaultOnError } from './chunk-f1b4cc24.js';
import { _ as _export_sfc } from './chunk-6003391e.js';
import './chunk-11f44f81.js';
import './chunk-35c3d701.js';
import '@vueuse/core';
import 'lodash';
import './chunk-95ec8cf7.js';
import './chunk-77c5cc16.js';
import 'pinia';

const _hoisted_1 = {
  viewBox: "0 0 24 24",
  width: "1.2em",
  height: "1.2em"
};
const _hoisted_2 = /*#__PURE__*/createElementVNode("path", {
  fill: "currentColor",
  d: "m20 16l-5.5 5.5l-1.42-1.41L16.17 17H10.5A6.5 6.5 0 0 1 4 10.5V4h2v6.5C6 13 8 15 10.5 15h5.67l-3.08-3.09l1.41-1.41L20 16Z"
}, null, -1);
const _hoisted_3 = [
  _hoisted_2
];

function render(_ctx, _cache) {
  return (openBlock(), createElementBlock("svg", _hoisted_1, _hoisted_3))
}

const __unplugin_components_3 = { name: 'mdi-arrow-right-bottom', render };
/* vite-plugin-components disabled */

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "url-parser",
  __ssrInlineRender: true,
  setup(__props) {
    const urlToParse = ref("https://me:pwd@it-tools.tech:3000/url-parser?key1=value&key2=value2#the-hash");
    const urlParsed = computed(() => withDefaultOnError(() => new URL(urlToParse.value), void 0));
    const urlValidationRules = [
      {
        validator: (value) => isNotThrowing(() => new URL(value)),
        message: "Invalid url"
      }
    ];
    const properties = [
      { title: "Protocol", key: "protocol" },
      { title: "Username", key: "username" },
      { title: "Password", key: "password" },
      { title: "Hostname", key: "hostname" },
      { title: "Port", key: "port" },
      { title: "Path", key: "pathname" },
      { title: "Params", key: "search" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_c_card = __unplugin_components_1;
      const _component_c_input_text = __unplugin_components_3$1;
      const _component_n_divider = NDivider;
      const _component_icon_mdi_arrow_right_bottom = __unplugin_components_3;
      _push(ssrRenderComponent(_component_c_card, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_c_input_text, {
              value: unref(urlToParse),
              "onUpdate:value": ($event) => isRef(urlToParse) ? urlToParse.value = $event : null,
              label: "Your url to parse:",
              placeholder: "Your url to parse...",
              "raw-text": "",
              "validation-rules": urlValidationRules
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_n_divider, null, null, _parent2, _scopeId));
            _push2(`<!--[-->`);
            ssrRenderList(properties, ({ title, key }) => {
              _push2(ssrRenderComponent(_sfc_main$1, {
                key,
                label: title,
                value: unref(urlParsed)?.[key] ?? "",
                readonly: "",
                "label-position": "left",
                "label-width": "110px",
                "mb-2": "",
                placeholder: " "
              }, null, _parent2, _scopeId));
            });
            _push2(`<!--]--><!--[-->`);
            ssrRenderList(Object.entries(Object.fromEntries(unref(urlParsed)?.searchParams.entries() ?? [])), ([k, v]) => {
              _push2(`<div mb-2 w-full flex data-v-98d1859c${_scopeId}><div style="${ssrRenderStyle({ "flex": "1 0 110px" })}" data-v-98d1859c${_scopeId}>`);
              _push2(ssrRenderComponent(_component_icon_mdi_arrow_right_bottom, null, null, _parent2, _scopeId));
              _push2(`</div>`);
              _push2(ssrRenderComponent(_sfc_main$1, {
                value: k,
                readonly: ""
              }, null, _parent2, _scopeId));
              _push2(ssrRenderComponent(_sfc_main$1, {
                value: v,
                readonly: ""
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
            });
            _push2(`<!--]-->`);
          } else {
            return [
              createVNode(_component_c_input_text, {
                value: unref(urlToParse),
                "onUpdate:value": ($event) => isRef(urlToParse) ? urlToParse.value = $event : null,
                label: "Your url to parse:",
                placeholder: "Your url to parse...",
                "raw-text": "",
                "validation-rules": urlValidationRules
              }, null, 8, ["value", "onUpdate:value"]),
              createVNode(_component_n_divider),
              (openBlock(), createBlock(Fragment, null, renderList(properties, ({ title, key }) => {
                return createVNode(_sfc_main$1, {
                  key,
                  label: title,
                  value: unref(urlParsed)?.[key] ?? "",
                  readonly: "",
                  "label-position": "left",
                  "label-width": "110px",
                  "mb-2": "",
                  placeholder: " "
                }, null, 8, ["label", "value"]);
              }), 64)),
              (openBlock(true), createBlock(Fragment, null, renderList(Object.entries(Object.fromEntries(unref(urlParsed)?.searchParams.entries() ?? [])), ([k, v]) => {
                return openBlock(), createBlock("div", {
                  key: k,
                  "mb-2": "",
                  "w-full": "",
                  flex: ""
                }, [
                  createVNode("div", { style: { "flex": "1 0 110px" } }, [
                    createVNode(_component_icon_mdi_arrow_right_bottom)
                  ]),
                  createVNode(_sfc_main$1, {
                    value: k,
                    readonly: ""
                  }, null, 8, ["value"]),
                  createVNode(_sfc_main$1, {
                    value: v,
                    readonly: ""
                  }, null, 8, ["value"])
                ]);
              }), 128))
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});

/* unplugin-vue-components disabled */const urlParser_vue_vue_type_style_index_0_scoped_98d1859c_lang = '';

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/tools/url-parser/url-parser.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const urlParser = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-98d1859c"]]);

export { urlParser as default };
