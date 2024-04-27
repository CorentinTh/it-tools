import { useThemeVars, NFormItem, NInputNumber, NForm } from 'naive-ui';
import { a as __unplugin_components_0, _ as _export_sfc } from './chunk-6003391e.js';
import { _ as __unplugin_components_3 } from './chunk-4e7a6a8d.js';
import { a as __unplugin_components_1 } from './chunk-8109fd17.js';
import { defineComponent, ref, computed, unref, mergeProps, withCtx, isRef, createVNode, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderClass, ssrInterpolate } from 'vue/server-renderer';
import { hashSync, compareSync } from 'bcryptjs';
import { u as useCopy } from './chunk-77c5cc16.js';
import '@vueuse/core';
import 'pinia';
import './chunk-11f44f81.js';
import './chunk-35c3d701.js';
import 'lodash';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "bcrypt",
  __ssrInlineRender: true,
  setup(__props) {
    const themeVars = useThemeVars();
    const input = ref("");
    const saltCount = ref(10);
    const hashed = computed(() => hashSync(input.value, saltCount.value));
    const { copy } = useCopy({ source: hashed, text: "Hashed string copied to the clipboard" });
    const compareString = ref("");
    const compareHash = ref("");
    const compareMatch = computed(() => compareSync(compareString.value, compareHash.value));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_c_card = __unplugin_components_1;
      const _component_c_input_text = __unplugin_components_3;
      const _component_n_form_item = NFormItem;
      const _component_n_input_number = NInputNumber;
      const _component_c_button = __unplugin_components_0;
      const _component_n_form = NForm;
      const _cssVars = { style: {
        "--d3350ad4": unref(themeVars).errorColor,
        "--2320e6bb": unref(themeVars).successColor
      } };
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_c_card, mergeProps({ title: "Hash" }, _cssVars), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_c_input_text, {
              value: unref(input),
              "onUpdate:value": ($event) => isRef(input) ? input.value = $event : null,
              placeholder: "Your string to bcrypt...",
              "raw-text": "",
              label: "Your string: ",
              "label-position": "left",
              "label-align": "right",
              "label-width": "120px",
              "mb-2": ""
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_n_form_item, {
              label: "Salt count: ",
              "label-placement": "left",
              "label-width": "120"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_n_input_number, {
                    value: unref(saltCount),
                    "onUpdate:value": ($event) => isRef(saltCount) ? saltCount.value = $event : null,
                    placeholder: "Salt rounds...",
                    max: 100,
                    min: 0,
                    "w-full": ""
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_n_input_number, {
                      value: unref(saltCount),
                      "onUpdate:value": ($event) => isRef(saltCount) ? saltCount.value = $event : null,
                      placeholder: "Salt rounds...",
                      max: 100,
                      min: 0,
                      "w-full": ""
                    }, null, 8, ["value", "onUpdate:value"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_c_input_text, {
              value: unref(hashed),
              readonly: "",
              "text-center": ""
            }, null, _parent2, _scopeId));
            _push2(`<div mt-5 flex justify-center data-v-bb1cecfb${_scopeId}>`);
            _push2(ssrRenderComponent(_component_c_button, {
              onClick: ($event) => unref(copy)()
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Copy hash `);
                } else {
                  return [
                    createTextVNode(" Copy hash ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode(_component_c_input_text, {
                value: unref(input),
                "onUpdate:value": ($event) => isRef(input) ? input.value = $event : null,
                placeholder: "Your string to bcrypt...",
                "raw-text": "",
                label: "Your string: ",
                "label-position": "left",
                "label-align": "right",
                "label-width": "120px",
                "mb-2": ""
              }, null, 8, ["value", "onUpdate:value"]),
              createVNode(_component_n_form_item, {
                label: "Salt count: ",
                "label-placement": "left",
                "label-width": "120"
              }, {
                default: withCtx(() => [
                  createVNode(_component_n_input_number, {
                    value: unref(saltCount),
                    "onUpdate:value": ($event) => isRef(saltCount) ? saltCount.value = $event : null,
                    placeholder: "Salt rounds...",
                    max: 100,
                    min: 0,
                    "w-full": ""
                  }, null, 8, ["value", "onUpdate:value"])
                ]),
                _: 1
              }),
              createVNode(_component_c_input_text, {
                value: unref(hashed),
                readonly: "",
                "text-center": ""
              }, null, 8, ["value"]),
              createVNode("div", {
                "mt-5": "",
                flex: "",
                "justify-center": ""
              }, [
                createVNode(_component_c_button, {
                  onClick: ($event) => unref(copy)()
                }, {
                  default: withCtx(() => [
                    createTextVNode(" Copy hash ")
                  ]),
                  _: 1
                }, 8, ["onClick"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_c_card, mergeProps({ title: "Compare string with hash" }, _cssVars), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_n_form, { "label-width": "120" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_n_form_item, {
                    label: "Your string: ",
                    "label-placement": "left"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_c_input_text, {
                          value: unref(compareString),
                          "onUpdate:value": ($event) => isRef(compareString) ? compareString.value = $event : null,
                          placeholder: "Your string to compare...",
                          "raw-text": ""
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_c_input_text, {
                            value: unref(compareString),
                            "onUpdate:value": ($event) => isRef(compareString) ? compareString.value = $event : null,
                            placeholder: "Your string to compare...",
                            "raw-text": ""
                          }, null, 8, ["value", "onUpdate:value"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_n_form_item, {
                    label: "Your hash: ",
                    "label-placement": "left"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_c_input_text, {
                          value: unref(compareHash),
                          "onUpdate:value": ($event) => isRef(compareHash) ? compareHash.value = $event : null,
                          placeholder: "Your hash to compare...",
                          "raw-text": ""
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_c_input_text, {
                            value: unref(compareHash),
                            "onUpdate:value": ($event) => isRef(compareHash) ? compareHash.value = $event : null,
                            placeholder: "Your hash to compare...",
                            "raw-text": ""
                          }, null, 8, ["value", "onUpdate:value"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_n_form_item, {
                    label: "Do they match ? ",
                    "label-placement": "left",
                    "show-feedback": false
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="${ssrRenderClass([{ positive: unref(compareMatch) }, "compare-result"])}" data-v-bb1cecfb${_scopeId3}>${ssrInterpolate(unref(compareMatch) ? "Yes" : "No")}</div>`);
                      } else {
                        return [
                          createVNode("div", {
                            class: ["compare-result", { positive: unref(compareMatch) }]
                          }, toDisplayString(unref(compareMatch) ? "Yes" : "No"), 3)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_n_form_item, {
                      label: "Your string: ",
                      "label-placement": "left"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_c_input_text, {
                          value: unref(compareString),
                          "onUpdate:value": ($event) => isRef(compareString) ? compareString.value = $event : null,
                          placeholder: "Your string to compare...",
                          "raw-text": ""
                        }, null, 8, ["value", "onUpdate:value"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_n_form_item, {
                      label: "Your hash: ",
                      "label-placement": "left"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_c_input_text, {
                          value: unref(compareHash),
                          "onUpdate:value": ($event) => isRef(compareHash) ? compareHash.value = $event : null,
                          placeholder: "Your hash to compare...",
                          "raw-text": ""
                        }, null, 8, ["value", "onUpdate:value"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_n_form_item, {
                      label: "Do they match ? ",
                      "label-placement": "left",
                      "show-feedback": false
                    }, {
                      default: withCtx(() => [
                        createVNode("div", {
                          class: ["compare-result", { positive: unref(compareMatch) }]
                        }, toDisplayString(unref(compareMatch) ? "Yes" : "No"), 3)
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
              createVNode(_component_n_form, { "label-width": "120" }, {
                default: withCtx(() => [
                  createVNode(_component_n_form_item, {
                    label: "Your string: ",
                    "label-placement": "left"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_c_input_text, {
                        value: unref(compareString),
                        "onUpdate:value": ($event) => isRef(compareString) ? compareString.value = $event : null,
                        placeholder: "Your string to compare...",
                        "raw-text": ""
                      }, null, 8, ["value", "onUpdate:value"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_n_form_item, {
                    label: "Your hash: ",
                    "label-placement": "left"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_c_input_text, {
                        value: unref(compareHash),
                        "onUpdate:value": ($event) => isRef(compareHash) ? compareHash.value = $event : null,
                        placeholder: "Your hash to compare...",
                        "raw-text": ""
                      }, null, 8, ["value", "onUpdate:value"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_n_form_item, {
                    label: "Do they match ? ",
                    "label-placement": "left",
                    "show-feedback": false
                  }, {
                    default: withCtx(() => [
                      createVNode("div", {
                        class: ["compare-result", { positive: unref(compareMatch) }]
                      }, toDisplayString(unref(compareMatch) ? "Yes" : "No"), 3)
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
      _push(`<!--]-->`);
    };
  }
});

/* unplugin-vue-components disabled */const bcrypt_vue_vue_type_style_index_0_scoped_bb1cecfb_lang = '';

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/tools/bcrypt/bcrypt.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const bcrypt = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-bb1cecfb"]]);

export { bcrypt as default };
