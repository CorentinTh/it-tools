import { _ as __unplugin_components_3 } from './chunk-4e7a6a8d.js';
import { defineComponent, toRefs, withCtx, unref, createTextVNode, toDisplayString, createVNode, openBlock, createBlock, Fragment, renderList, createCommentVNode, useSSRContext, ref, computed, isRef } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { UAParser } from 'ua-parser-js';
import { Browser, Engine, Adjustments, Devices, Cpu } from '@vicons/tabler';
import { NGrid, NGi, NIcon, NTag } from 'naive-ui';
import { a as __unplugin_components_1, _ as _sfc_main$2 } from './chunk-8109fd17.js';
import { w as withDefaultOnError } from './chunk-f1b4cc24.js';
import './chunk-6003391e.js';
import '@vueuse/core';
import 'pinia';
import './chunk-11f44f81.js';
import './chunk-35c3d701.js';
import 'lodash';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "user-agent-result-cards",
  __ssrInlineRender: true,
  props: {
    userAgentInfo: {},
    sections: {}
  },
  setup(__props) {
    const props = __props;
    const { userAgentInfo, sections } = toRefs(props);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_n_grid = NGrid;
      const _component_n_gi = NGi;
      const _component_c_card = __unplugin_components_1;
      const _component_n_icon = NIcon;
      const _component_c_tooltip = _sfc_main$2;
      const _component_n_tag = NTag;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_n_grid, {
        "x-gap": 12,
        "y-gap": 8,
        cols: "1 s:2",
        responsive: "screen"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<!--[-->`);
            ssrRenderList(unref(sections), ({ heading, icon, content }) => {
              _push2(ssrRenderComponent(_component_n_gi, { key: heading }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_c_card, { "h-full": "" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`<div flex items-center gap-3${_scopeId3}>`);
                          _push4(ssrRenderComponent(_component_n_icon, {
                            size: "30",
                            component: icon,
                            depth: 3
                          }, null, _parent4, _scopeId3));
                          _push4(`<span text-lg${_scopeId3}>${ssrInterpolate(heading)}</span></div><div mt-5 flex gap-2${_scopeId3}><!--[-->`);
                          ssrRenderList(content, ({ label, getValue }) => {
                            _push4(`<span${_scopeId3}>`);
                            if (getValue(unref(userAgentInfo))) {
                              _push4(ssrRenderComponent(_component_c_tooltip, { tooltip: label }, {
                                default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                  if (_push5) {
                                    _push5(ssrRenderComponent(_component_n_tag, {
                                      type: "success",
                                      size: "large",
                                      round: "",
                                      bordered: false
                                    }, {
                                      default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                        if (_push6) {
                                          _push6(`${ssrInterpolate(getValue(unref(userAgentInfo)))}`);
                                        } else {
                                          return [
                                            createTextVNode(toDisplayString(getValue(unref(userAgentInfo))), 1)
                                          ];
                                        }
                                      }),
                                      _: 2
                                    }, _parent5, _scopeId4));
                                  } else {
                                    return [
                                      createVNode(_component_n_tag, {
                                        type: "success",
                                        size: "large",
                                        round: "",
                                        bordered: false
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(getValue(unref(userAgentInfo))), 1)
                                        ]),
                                        _: 2
                                      }, 1024)
                                    ];
                                  }
                                }),
                                _: 2
                              }, _parent4, _scopeId3));
                            } else {
                              _push4(`<!---->`);
                            }
                            _push4(`</span>`);
                          });
                          _push4(`<!--]--></div><div flex flex-col${_scopeId3}><!--[-->`);
                          ssrRenderList(content, ({ label, getValue, undefinedFallback }) => {
                            _push4(`<span${_scopeId3}>`);
                            if (getValue(unref(userAgentInfo)) === void 0) {
                              _push4(`<span op-70${_scopeId3}>${ssrInterpolate(undefinedFallback)}</span>`);
                            } else {
                              _push4(`<!---->`);
                            }
                            _push4(`</span>`);
                          });
                          _push4(`<!--]--></div>`);
                        } else {
                          return [
                            createVNode("div", {
                              flex: "",
                              "items-center": "",
                              "gap-3": ""
                            }, [
                              createVNode(_component_n_icon, {
                                size: "30",
                                component: icon,
                                depth: 3
                              }, null, 8, ["component"]),
                              createVNode("span", { "text-lg": "" }, toDisplayString(heading), 1)
                            ]),
                            createVNode("div", {
                              "mt-5": "",
                              flex: "",
                              "gap-2": ""
                            }, [
                              (openBlock(true), createBlock(Fragment, null, renderList(content, ({ label, getValue }) => {
                                return openBlock(), createBlock("span", { key: label }, [
                                  getValue(unref(userAgentInfo)) ? (openBlock(), createBlock(_component_c_tooltip, {
                                    key: 0,
                                    tooltip: label
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(_component_n_tag, {
                                        type: "success",
                                        size: "large",
                                        round: "",
                                        bordered: false
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(getValue(unref(userAgentInfo))), 1)
                                        ]),
                                        _: 2
                                      }, 1024)
                                    ]),
                                    _: 2
                                  }, 1032, ["tooltip"])) : createCommentVNode("", true)
                                ]);
                              }), 128))
                            ]),
                            createVNode("div", {
                              flex: "",
                              "flex-col": ""
                            }, [
                              (openBlock(true), createBlock(Fragment, null, renderList(content, ({ label, getValue, undefinedFallback }) => {
                                return openBlock(), createBlock("span", { key: label }, [
                                  getValue(unref(userAgentInfo)) === void 0 ? (openBlock(), createBlock("span", {
                                    key: 0,
                                    "op-70": ""
                                  }, toDisplayString(undefinedFallback), 1)) : createCommentVNode("", true)
                                ]);
                              }), 128))
                            ])
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_c_card, { "h-full": "" }, {
                        default: withCtx(() => [
                          createVNode("div", {
                            flex: "",
                            "items-center": "",
                            "gap-3": ""
                          }, [
                            createVNode(_component_n_icon, {
                              size: "30",
                              component: icon,
                              depth: 3
                            }, null, 8, ["component"]),
                            createVNode("span", { "text-lg": "" }, toDisplayString(heading), 1)
                          ]),
                          createVNode("div", {
                            "mt-5": "",
                            flex: "",
                            "gap-2": ""
                          }, [
                            (openBlock(true), createBlock(Fragment, null, renderList(content, ({ label, getValue }) => {
                              return openBlock(), createBlock("span", { key: label }, [
                                getValue(unref(userAgentInfo)) ? (openBlock(), createBlock(_component_c_tooltip, {
                                  key: 0,
                                  tooltip: label
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_component_n_tag, {
                                      type: "success",
                                      size: "large",
                                      round: "",
                                      bordered: false
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(getValue(unref(userAgentInfo))), 1)
                                      ]),
                                      _: 2
                                    }, 1024)
                                  ]),
                                  _: 2
                                }, 1032, ["tooltip"])) : createCommentVNode("", true)
                              ]);
                            }), 128))
                          ]),
                          createVNode("div", {
                            flex: "",
                            "flex-col": ""
                          }, [
                            (openBlock(true), createBlock(Fragment, null, renderList(content, ({ label, getValue, undefinedFallback }) => {
                              return openBlock(), createBlock("span", { key: label }, [
                                getValue(unref(userAgentInfo)) === void 0 ? (openBlock(), createBlock("span", {
                                  key: 0,
                                  "op-70": ""
                                }, toDisplayString(undefinedFallback), 1)) : createCommentVNode("", true)
                              ]);
                            }), 128))
                          ])
                        ]),
                        _: 2
                      }, 1024)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]-->`);
          } else {
            return [
              (openBlock(true), createBlock(Fragment, null, renderList(unref(sections), ({ heading, icon, content }) => {
                return openBlock(), createBlock(_component_n_gi, { key: heading }, {
                  default: withCtx(() => [
                    createVNode(_component_c_card, { "h-full": "" }, {
                      default: withCtx(() => [
                        createVNode("div", {
                          flex: "",
                          "items-center": "",
                          "gap-3": ""
                        }, [
                          createVNode(_component_n_icon, {
                            size: "30",
                            component: icon,
                            depth: 3
                          }, null, 8, ["component"]),
                          createVNode("span", { "text-lg": "" }, toDisplayString(heading), 1)
                        ]),
                        createVNode("div", {
                          "mt-5": "",
                          flex: "",
                          "gap-2": ""
                        }, [
                          (openBlock(true), createBlock(Fragment, null, renderList(content, ({ label, getValue }) => {
                            return openBlock(), createBlock("span", { key: label }, [
                              getValue(unref(userAgentInfo)) ? (openBlock(), createBlock(_component_c_tooltip, {
                                key: 0,
                                tooltip: label
                              }, {
                                default: withCtx(() => [
                                  createVNode(_component_n_tag, {
                                    type: "success",
                                    size: "large",
                                    round: "",
                                    bordered: false
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(getValue(unref(userAgentInfo))), 1)
                                    ]),
                                    _: 2
                                  }, 1024)
                                ]),
                                _: 2
                              }, 1032, ["tooltip"])) : createCommentVNode("", true)
                            ]);
                          }), 128))
                        ]),
                        createVNode("div", {
                          flex: "",
                          "flex-col": ""
                        }, [
                          (openBlock(true), createBlock(Fragment, null, renderList(content, ({ label, getValue, undefinedFallback }) => {
                            return openBlock(), createBlock("span", { key: label }, [
                              getValue(unref(userAgentInfo)) === void 0 ? (openBlock(), createBlock("span", {
                                key: 0,
                                "op-70": ""
                              }, toDisplayString(undefinedFallback), 1)) : createCommentVNode("", true)
                            ]);
                          }), 128))
                        ])
                      ]),
                      _: 2
                    }, 1024)
                  ]),
                  _: 2
                }, 1024);
              }), 128))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});

const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/tools/user-agent-parser/user-agent-result-cards.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "user-agent-parser",
  __ssrInlineRender: true,
  setup(__props) {
    const ua = ref(navigator.userAgent);
    function getUserAgentInfo(userAgent) {
      return userAgent.trim().length > 0 ? UAParser(userAgent.trim()) : { ua: "", browser: {}, cpu: {}, device: {}, engine: {}, os: {} };
    }
    const userAgentInfo = computed(() => withDefaultOnError(() => getUserAgentInfo(ua.value), void 0));
    const sections = [
      {
        heading: "Browser",
        icon: Browser,
        content: [
          {
            label: "Name",
            getValue: (block) => block?.browser.name,
            undefinedFallback: "No browser name available"
          },
          {
            label: "Version",
            getValue: (block) => block?.browser.version,
            undefinedFallback: "No browser version available"
          }
        ]
      },
      {
        heading: "Engine",
        icon: Engine,
        content: [
          {
            label: "Name",
            getValue: (block) => block?.engine.name,
            undefinedFallback: "No engine name available"
          },
          {
            label: "Version",
            getValue: (block) => block?.engine.version,
            undefinedFallback: "No engine version available"
          }
        ]
      },
      {
        heading: "OS",
        icon: Adjustments,
        content: [
          {
            label: "Name",
            getValue: (block) => block?.os.name,
            undefinedFallback: "No OS name available"
          },
          {
            label: "Version",
            getValue: (block) => block?.os.version,
            undefinedFallback: "No OS version available"
          }
        ]
      },
      {
        heading: "Device",
        icon: Devices,
        content: [
          {
            label: "Model",
            getValue: (block) => block?.device.model,
            undefinedFallback: "No device model available"
          },
          {
            label: "Type",
            getValue: (block) => block?.device.type,
            undefinedFallback: "No device type available"
          },
          {
            label: "Vendor",
            getValue: (block) => block?.device.vendor,
            undefinedFallback: "No device vendor available"
          }
        ]
      },
      {
        heading: "CPU",
        icon: Cpu,
        content: [
          {
            label: "Architecture",
            getValue: (block) => block?.cpu.architecture,
            undefinedFallback: "No CPU architecture available"
          }
        ]
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_c_input_text = __unplugin_components_3;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_c_input_text, {
        value: unref(ua),
        "onUpdate:value": ($event) => isRef(ua) ? ua.value = $event : null,
        label: "User agent string",
        multiline: "",
        placeholder: "Put your user-agent here...",
        clearable: "",
        "raw-text": "",
        rows: "2",
        autosize: "",
        monospace: "",
        "mb-3": ""
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, {
        "user-agent-info": unref(userAgentInfo),
        sections
      }, null, _parent));
      _push(`</div>`);
    };
  }
});

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/tools/user-agent-parser/user-agent-parser.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
