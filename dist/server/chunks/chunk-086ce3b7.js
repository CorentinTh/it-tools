import { a as __unplugin_components_0, _ as _export_sfc } from './chunk-6003391e.js';
import { NForm, NFormItem, NSwitch, NSlider } from 'naive-ui';
import { a as __unplugin_components_1 } from './chunk-8109fd17.js';
import { defineComponent, withCtx, unref, isRef, createVNode, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { c as createToken } from './chunk-264f08b8.js';
import { _ as __unplugin_components_3 } from './chunk-4e7a6a8d.js';
import { u as useCopy } from './chunk-77c5cc16.js';
import { u as useQueryParam } from './chunk-bc09e76f.js';
import { c as computedRefreshable } from './chunk-cc665c88.js';
import { useI18n } from 'vue-i18n/dist/vue-i18n.runtime.esm-bundler.js';
import '@vueuse/core';
import 'pinia';
import './chunk-11f44f81.js';
import './chunk-35c3d701.js';
import 'lodash';
import '@vueuse/router';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "token-generator.tool",
  __ssrInlineRender: true,
  setup(__props) {
    const length = useQueryParam({ name: "length", defaultValue: 64 });
    const withUppercase = useQueryParam({ name: "uppercase", defaultValue: true });
    const withLowercase = useQueryParam({ name: "lowercase", defaultValue: true });
    const withNumbers = useQueryParam({ name: "numbers", defaultValue: true });
    const withSymbols = useQueryParam({ name: "symbols", defaultValue: false });
    const { t } = useI18n();
    const [token, refreshToken] = computedRefreshable(
      () => createToken({
        length: length.value,
        withUppercase: withUppercase.value,
        withLowercase: withLowercase.value,
        withNumbers: withNumbers.value,
        withSymbols: withSymbols.value
      })
    );
    const { copy } = useCopy({ source: token, text: t("tools.token-generator.copied") });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_c_card = __unplugin_components_1;
      const _component_n_form = NForm;
      const _component_n_form_item = NFormItem;
      const _component_n_switch = NSwitch;
      const _component_n_slider = NSlider;
      const _component_c_button = __unplugin_components_0;
      _push(`<div${ssrRenderAttrs(_attrs)} data-v-1b0e7f55>`);
      _push(ssrRenderComponent(_component_c_card, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_n_form, {
              "label-placement": "left",
              "label-width": "140"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div flex justify-center data-v-1b0e7f55${_scopeId2}><div data-v-1b0e7f55${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_n_form_item, {
                    label: unref(t)("tools.token-generator.uppercase")
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_n_switch, {
                          value: unref(withUppercase),
                          "onUpdate:value": ($event) => isRef(withUppercase) ? withUppercase.value = $event : null
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_n_switch, {
                            value: unref(withUppercase),
                            "onUpdate:value": ($event) => isRef(withUppercase) ? withUppercase.value = $event : null
                          }, null, 8, ["value", "onUpdate:value"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_n_form_item, {
                    label: unref(t)("tools.token-generator.lowercase")
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_n_switch, {
                          value: unref(withLowercase),
                          "onUpdate:value": ($event) => isRef(withLowercase) ? withLowercase.value = $event : null
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_n_switch, {
                            value: unref(withLowercase),
                            "onUpdate:value": ($event) => isRef(withLowercase) ? withLowercase.value = $event : null
                          }, null, 8, ["value", "onUpdate:value"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div><div data-v-1b0e7f55${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_n_form_item, {
                    label: unref(t)("tools.token-generator.numbers")
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_n_switch, {
                          value: unref(withNumbers),
                          "onUpdate:value": ($event) => isRef(withNumbers) ? withNumbers.value = $event : null
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_n_switch, {
                            value: unref(withNumbers),
                            "onUpdate:value": ($event) => isRef(withNumbers) ? withNumbers.value = $event : null
                          }, null, 8, ["value", "onUpdate:value"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_n_form_item, {
                    label: unref(t)("tools.token-generator.symbols")
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_n_switch, {
                          value: unref(withSymbols),
                          "onUpdate:value": ($event) => isRef(withSymbols) ? withSymbols.value = $event : null
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_n_switch, {
                            value: unref(withSymbols),
                            "onUpdate:value": ($event) => isRef(withSymbols) ? withSymbols.value = $event : null
                          }, null, 8, ["value", "onUpdate:value"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div></div>`);
                } else {
                  return [
                    createVNode("div", {
                      flex: "",
                      "justify-center": ""
                    }, [
                      createVNode("div", null, [
                        createVNode(_component_n_form_item, {
                          label: unref(t)("tools.token-generator.uppercase")
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_n_switch, {
                              value: unref(withUppercase),
                              "onUpdate:value": ($event) => isRef(withUppercase) ? withUppercase.value = $event : null
                            }, null, 8, ["value", "onUpdate:value"])
                          ]),
                          _: 1
                        }, 8, ["label"]),
                        createVNode(_component_n_form_item, {
                          label: unref(t)("tools.token-generator.lowercase")
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_n_switch, {
                              value: unref(withLowercase),
                              "onUpdate:value": ($event) => isRef(withLowercase) ? withLowercase.value = $event : null
                            }, null, 8, ["value", "onUpdate:value"])
                          ]),
                          _: 1
                        }, 8, ["label"])
                      ]),
                      createVNode("div", null, [
                        createVNode(_component_n_form_item, {
                          label: unref(t)("tools.token-generator.numbers")
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_n_switch, {
                              value: unref(withNumbers),
                              "onUpdate:value": ($event) => isRef(withNumbers) ? withNumbers.value = $event : null
                            }, null, 8, ["value", "onUpdate:value"])
                          ]),
                          _: 1
                        }, 8, ["label"]),
                        createVNode(_component_n_form_item, {
                          label: unref(t)("tools.token-generator.symbols")
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_n_switch, {
                              value: unref(withSymbols),
                              "onUpdate:value": ($event) => isRef(withSymbols) ? withSymbols.value = $event : null
                            }, null, 8, ["value", "onUpdate:value"])
                          ]),
                          _: 1
                        }, 8, ["label"])
                      ])
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_n_form_item, {
              label: `${unref(t)("tools.token-generator.length")} (${unref(length)})`,
              "label-placement": "left"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_n_slider, {
                    value: unref(length),
                    "onUpdate:value": ($event) => isRef(length) ? length.value = $event : null,
                    step: 1,
                    min: 1,
                    max: 512
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_n_slider, {
                      value: unref(length),
                      "onUpdate:value": ($event) => isRef(length) ? length.value = $event : null,
                      step: 1,
                      min: 1,
                      max: 512
                    }, null, 8, ["value", "onUpdate:value"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(__unplugin_components_3, {
              value: unref(token),
              "onUpdate:value": ($event) => isRef(token) ? token.value = $event : null,
              multiline: "",
              placeholder: unref(t)("tools.token-generator.tokenPlaceholder"),
              readonly: "",
              rows: "3",
              autosize: "",
              class: "token-display"
            }, null, _parent2, _scopeId));
            _push2(`<div mt-5 flex justify-center gap-3 data-v-1b0e7f55${_scopeId}>`);
            _push2(ssrRenderComponent(_component_c_button, {
              onClick: ($event) => unref(copy)()
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(unref(t)("tools.token-generator.button.copy"))}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(unref(t)("tools.token-generator.button.copy")), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_c_button, { onClick: unref(refreshToken) }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(unref(t)("tools.token-generator.button.refresh"))}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(unref(t)("tools.token-generator.button.refresh")), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode(_component_n_form, {
                "label-placement": "left",
                "label-width": "140"
              }, {
                default: withCtx(() => [
                  createVNode("div", {
                    flex: "",
                    "justify-center": ""
                  }, [
                    createVNode("div", null, [
                      createVNode(_component_n_form_item, {
                        label: unref(t)("tools.token-generator.uppercase")
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_n_switch, {
                            value: unref(withUppercase),
                            "onUpdate:value": ($event) => isRef(withUppercase) ? withUppercase.value = $event : null
                          }, null, 8, ["value", "onUpdate:value"])
                        ]),
                        _: 1
                      }, 8, ["label"]),
                      createVNode(_component_n_form_item, {
                        label: unref(t)("tools.token-generator.lowercase")
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_n_switch, {
                            value: unref(withLowercase),
                            "onUpdate:value": ($event) => isRef(withLowercase) ? withLowercase.value = $event : null
                          }, null, 8, ["value", "onUpdate:value"])
                        ]),
                        _: 1
                      }, 8, ["label"])
                    ]),
                    createVNode("div", null, [
                      createVNode(_component_n_form_item, {
                        label: unref(t)("tools.token-generator.numbers")
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_n_switch, {
                            value: unref(withNumbers),
                            "onUpdate:value": ($event) => isRef(withNumbers) ? withNumbers.value = $event : null
                          }, null, 8, ["value", "onUpdate:value"])
                        ]),
                        _: 1
                      }, 8, ["label"]),
                      createVNode(_component_n_form_item, {
                        label: unref(t)("tools.token-generator.symbols")
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_n_switch, {
                            value: unref(withSymbols),
                            "onUpdate:value": ($event) => isRef(withSymbols) ? withSymbols.value = $event : null
                          }, null, 8, ["value", "onUpdate:value"])
                        ]),
                        _: 1
                      }, 8, ["label"])
                    ])
                  ])
                ]),
                _: 1
              }),
              createVNode(_component_n_form_item, {
                label: `${unref(t)("tools.token-generator.length")} (${unref(length)})`,
                "label-placement": "left"
              }, {
                default: withCtx(() => [
                  createVNode(_component_n_slider, {
                    value: unref(length),
                    "onUpdate:value": ($event) => isRef(length) ? length.value = $event : null,
                    step: 1,
                    min: 1,
                    max: 512
                  }, null, 8, ["value", "onUpdate:value"])
                ]),
                _: 1
              }, 8, ["label"]),
              createVNode(__unplugin_components_3, {
                value: unref(token),
                "onUpdate:value": ($event) => isRef(token) ? token.value = $event : null,
                multiline: "",
                placeholder: unref(t)("tools.token-generator.tokenPlaceholder"),
                readonly: "",
                rows: "3",
                autosize: "",
                class: "token-display"
              }, null, 8, ["value", "onUpdate:value", "placeholder"]),
              createVNode("div", {
                "mt-5": "",
                flex: "",
                "justify-center": "",
                "gap-3": ""
              }, [
                createVNode(_component_c_button, {
                  onClick: ($event) => unref(copy)()
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(unref(t)("tools.token-generator.button.copy")), 1)
                  ]),
                  _: 1
                }, 8, ["onClick"]),
                createVNode(_component_c_button, { onClick: unref(refreshToken) }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(unref(t)("tools.token-generator.button.refresh")), 1)
                  ]),
                  _: 1
                }, 8, ["onClick"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});

/* unplugin-vue-components disabled */const tokenGenerator_tool_vue_vue_type_style_index_0_scoped_1b0e7f55_lang = '';

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/tools/token-generator/token-generator.tool.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const tokenGenerator_tool = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-1b0e7f55"]]);

export { tokenGenerator_tool as default };
