import { a as __unplugin_components_0, _ as _export_sfc } from './chunk-6003391e.js';
import { NStatistic, NScrollbar } from 'naive-ui';
import { a as __unplugin_components_1 } from './chunk-8109fd17.js';
import { _ as __unplugin_components_3 } from './chunk-4e7a6a8d.js';
import { defineComponent, ref, computed, unref, isRef, withCtx, createTextVNode, toDisplayString, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { u as useCopy } from './chunk-77c5cc16.js';
import { t as textToBase64 } from './chunk-72fc6fca.js';
import '@vueuse/core';
import 'pinia';
import './chunk-11f44f81.js';
import './chunk-35c3d701.js';
import 'lodash';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "basic-auth-generator",
  __ssrInlineRender: true,
  setup(__props) {
    const username = ref("");
    const password = ref("");
    const header = computed(() => `Authorization: Basic ${textToBase64(`${username.value}:${password.value}`)}`);
    const { copy } = useCopy({ source: header, text: "Header copied to the clipboard" });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_c_input_text = __unplugin_components_3;
      const _component_c_card = __unplugin_components_1;
      const _component_n_statistic = NStatistic;
      const _component_n_scrollbar = NScrollbar;
      const _component_c_button = __unplugin_components_0;
      _push(`<div${ssrRenderAttrs(_attrs)} data-v-981b0cc5>`);
      _push(ssrRenderComponent(_component_c_input_text, {
        value: unref(username),
        "onUpdate:value": ($event) => isRef(username) ? username.value = $event : null,
        label: "Username",
        placeholder: "Your username...",
        clearable: "",
        "raw-text": "",
        "mb-5": ""
      }, null, _parent));
      _push(ssrRenderComponent(_component_c_input_text, {
        value: unref(password),
        "onUpdate:value": ($event) => isRef(password) ? password.value = $event : null,
        label: "Password",
        placeholder: "Your password...",
        clearable: "",
        "raw-text": "",
        "mb-2": "",
        type: "password"
      }, null, _parent));
      _push(ssrRenderComponent(_component_c_card, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_n_statistic, {
              label: "Authorization header:",
              class: "header"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_n_scrollbar, {
                    "x-scrollable": "",
                    style: { "max-width": "550px", "margin-bottom": "-10px", "padding-bottom": "10px" },
                    trigger: "none"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`${ssrInterpolate(unref(header))}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(unref(header)), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_n_scrollbar, {
                      "x-scrollable": "",
                      style: { "max-width": "550px", "margin-bottom": "-10px", "padding-bottom": "10px" },
                      trigger: "none"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(unref(header)), 1)
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_n_statistic, {
                label: "Authorization header:",
                class: "header"
              }, {
                default: withCtx(() => [
                  createVNode(_component_n_scrollbar, {
                    "x-scrollable": "",
                    style: { "max-width": "550px", "margin-bottom": "-10px", "padding-bottom": "10px" },
                    trigger: "none"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(unref(header)), 1)
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div mt-5 flex justify-center data-v-981b0cc5>`);
      _push(ssrRenderComponent(_component_c_button, {
        onClick: ($event) => unref(copy)()
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Copy header `);
          } else {
            return [
              createTextVNode(" Copy header ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
    };
  }
});

/* unplugin-vue-components disabled */const basicAuthGenerator_vue_vue_type_style_index_0_scoped_981b0cc5_lang = '';

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/tools/basic-auth-generator/basic-auth-generator.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const basicAuthGenerator = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-981b0cc5"]]);

export { basicAuthGenerator as default };
