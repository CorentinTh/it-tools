import { a as __unplugin_components_0$1 } from './chunk-6003391e.js';
import { NGrid, NGi, NForm, NFormItem, NColorPicker, NImage } from 'naive-ui';
import { _ as __unplugin_components_0 } from './chunk-89a4876c.js';
import { _ as __unplugin_components_3 } from './chunk-4e7a6a8d.js';
import { a as __unplugin_components_1 } from './chunk-8109fd17.js';
import { defineComponent, ref, withCtx, unref, isRef, createVNode, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import { u as useQRCode } from './chunk-aa632c49.js';
import { u as useDownloadFileFromBase64 } from './chunk-cce4ae69.js';
import '@vueuse/core';
import 'pinia';
import './chunk-bb5bb4f6.js';
import './chunk-2ce6ed5e.js';
import 'fuse.js';
import './chunk-11f44f81.js';
import './chunk-35c3d701.js';
import 'lodash';
import 'qrcode';
import 'mime-types';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "qr-code-generator",
  __ssrInlineRender: true,
  setup(__props) {
    const foreground = ref("#000000ff");
    const background = ref("#ffffffff");
    const errorCorrectionLevel = ref("medium");
    const errorCorrectionLevels = ["low", "medium", "quartile", "high"];
    const text = ref("https://it-tools.tech");
    const { qrcode } = useQRCode({
      text,
      color: {
        background,
        foreground
      },
      errorCorrectionLevel,
      options: { width: 1024 }
    });
    const { download } = useDownloadFileFromBase64({ source: qrcode, filename: "qr-code.png" });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_c_card = __unplugin_components_1;
      const _component_n_grid = NGrid;
      const _component_n_gi = NGi;
      const _component_c_input_text = __unplugin_components_3;
      const _component_n_form = NForm;
      const _component_n_form_item = NFormItem;
      const _component_n_color_picker = NColorPicker;
      const _component_c_select = __unplugin_components_0;
      const _component_n_image = NImage;
      const _component_c_button = __unplugin_components_0$1;
      _push(ssrRenderComponent(_component_c_card, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_n_grid, {
              "x-gap": "12",
              "y-gap": "12",
              cols: "1 600:3"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_n_gi, { span: "2" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_c_input_text, {
                          value: unref(text),
                          "onUpdate:value": ($event) => isRef(text) ? text.value = $event : null,
                          "label-position": "left",
                          "label-width": "130px",
                          "label-align": "right",
                          label: "Text:",
                          multiline: "",
                          rows: "1",
                          autosize: "",
                          placeholder: "Your link or text...",
                          "mb-6": ""
                        }, null, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_n_form, {
                          "label-width": "130",
                          "label-placement": "left"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_n_form_item, { label: "Foreground color:" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_n_color_picker, {
                                      value: unref(foreground),
                                      "onUpdate:value": ($event) => isRef(foreground) ? foreground.value = $event : null,
                                      modes: ["hex"]
                                    }, null, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(_component_n_color_picker, {
                                        value: unref(foreground),
                                        "onUpdate:value": ($event) => isRef(foreground) ? foreground.value = $event : null,
                                        modes: ["hex"]
                                      }, null, 8, ["value", "onUpdate:value"])
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_n_form_item, { label: "Background color:" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_n_color_picker, {
                                      value: unref(background),
                                      "onUpdate:value": ($event) => isRef(background) ? background.value = $event : null,
                                      modes: ["hex"]
                                    }, null, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(_component_n_color_picker, {
                                        value: unref(background),
                                        "onUpdate:value": ($event) => isRef(background) ? background.value = $event : null,
                                        modes: ["hex"]
                                      }, null, 8, ["value", "onUpdate:value"])
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(_component_c_select, {
                                value: unref(errorCorrectionLevel),
                                "onUpdate:value": ($event) => isRef(errorCorrectionLevel) ? errorCorrectionLevel.value = $event : null,
                                label: "Error resistance:",
                                "label-position": "left",
                                "label-width": "130px",
                                "label-align": "right",
                                options: errorCorrectionLevels.map((value) => ({ label: value, value }))
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_n_form_item, { label: "Foreground color:" }, {
                                  default: withCtx(() => [
                                    createVNode(_component_n_color_picker, {
                                      value: unref(foreground),
                                      "onUpdate:value": ($event) => isRef(foreground) ? foreground.value = $event : null,
                                      modes: ["hex"]
                                    }, null, 8, ["value", "onUpdate:value"])
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_n_form_item, { label: "Background color:" }, {
                                  default: withCtx(() => [
                                    createVNode(_component_n_color_picker, {
                                      value: unref(background),
                                      "onUpdate:value": ($event) => isRef(background) ? background.value = $event : null,
                                      modes: ["hex"]
                                    }, null, 8, ["value", "onUpdate:value"])
                                  ]),
                                  _: 1
                                }),
                                createVNode(_component_c_select, {
                                  value: unref(errorCorrectionLevel),
                                  "onUpdate:value": ($event) => isRef(errorCorrectionLevel) ? errorCorrectionLevel.value = $event : null,
                                  label: "Error resistance:",
                                  "label-position": "left",
                                  "label-width": "130px",
                                  "label-align": "right",
                                  options: errorCorrectionLevels.map((value) => ({ label: value, value }))
                                }, null, 8, ["value", "onUpdate:value", "options"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_c_input_text, {
                            value: unref(text),
                            "onUpdate:value": ($event) => isRef(text) ? text.value = $event : null,
                            "label-position": "left",
                            "label-width": "130px",
                            "label-align": "right",
                            label: "Text:",
                            multiline: "",
                            rows: "1",
                            autosize: "",
                            placeholder: "Your link or text...",
                            "mb-6": ""
                          }, null, 8, ["value", "onUpdate:value"]),
                          createVNode(_component_n_form, {
                            "label-width": "130",
                            "label-placement": "left"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_n_form_item, { label: "Foreground color:" }, {
                                default: withCtx(() => [
                                  createVNode(_component_n_color_picker, {
                                    value: unref(foreground),
                                    "onUpdate:value": ($event) => isRef(foreground) ? foreground.value = $event : null,
                                    modes: ["hex"]
                                  }, null, 8, ["value", "onUpdate:value"])
                                ]),
                                _: 1
                              }),
                              createVNode(_component_n_form_item, { label: "Background color:" }, {
                                default: withCtx(() => [
                                  createVNode(_component_n_color_picker, {
                                    value: unref(background),
                                    "onUpdate:value": ($event) => isRef(background) ? background.value = $event : null,
                                    modes: ["hex"]
                                  }, null, 8, ["value", "onUpdate:value"])
                                ]),
                                _: 1
                              }),
                              createVNode(_component_c_select, {
                                value: unref(errorCorrectionLevel),
                                "onUpdate:value": ($event) => isRef(errorCorrectionLevel) ? errorCorrectionLevel.value = $event : null,
                                label: "Error resistance:",
                                "label-position": "left",
                                "label-width": "130px",
                                "label-align": "right",
                                options: errorCorrectionLevels.map((value) => ({ label: value, value }))
                              }, null, 8, ["value", "onUpdate:value", "options"])
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_n_gi, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div flex flex-col items-center gap-3${_scopeId3}>`);
                        _push4(ssrRenderComponent(_component_n_image, {
                          src: unref(qrcode),
                          width: "200"
                        }, null, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_c_button, { onClick: unref(download) }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(` Download qr-code `);
                            } else {
                              return [
                                createTextVNode(" Download qr-code ")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(`</div>`);
                      } else {
                        return [
                          createVNode("div", {
                            flex: "",
                            "flex-col": "",
                            "items-center": "",
                            "gap-3": ""
                          }, [
                            createVNode(_component_n_image, {
                              src: unref(qrcode),
                              width: "200"
                            }, null, 8, ["src"]),
                            createVNode(_component_c_button, { onClick: unref(download) }, {
                              default: withCtx(() => [
                                createTextVNode(" Download qr-code ")
                              ]),
                              _: 1
                            }, 8, ["onClick"])
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_n_gi, { span: "2" }, {
                      default: withCtx(() => [
                        createVNode(_component_c_input_text, {
                          value: unref(text),
                          "onUpdate:value": ($event) => isRef(text) ? text.value = $event : null,
                          "label-position": "left",
                          "label-width": "130px",
                          "label-align": "right",
                          label: "Text:",
                          multiline: "",
                          rows: "1",
                          autosize: "",
                          placeholder: "Your link or text...",
                          "mb-6": ""
                        }, null, 8, ["value", "onUpdate:value"]),
                        createVNode(_component_n_form, {
                          "label-width": "130",
                          "label-placement": "left"
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_n_form_item, { label: "Foreground color:" }, {
                              default: withCtx(() => [
                                createVNode(_component_n_color_picker, {
                                  value: unref(foreground),
                                  "onUpdate:value": ($event) => isRef(foreground) ? foreground.value = $event : null,
                                  modes: ["hex"]
                                }, null, 8, ["value", "onUpdate:value"])
                              ]),
                              _: 1
                            }),
                            createVNode(_component_n_form_item, { label: "Background color:" }, {
                              default: withCtx(() => [
                                createVNode(_component_n_color_picker, {
                                  value: unref(background),
                                  "onUpdate:value": ($event) => isRef(background) ? background.value = $event : null,
                                  modes: ["hex"]
                                }, null, 8, ["value", "onUpdate:value"])
                              ]),
                              _: 1
                            }),
                            createVNode(_component_c_select, {
                              value: unref(errorCorrectionLevel),
                              "onUpdate:value": ($event) => isRef(errorCorrectionLevel) ? errorCorrectionLevel.value = $event : null,
                              label: "Error resistance:",
                              "label-position": "left",
                              "label-width": "130px",
                              "label-align": "right",
                              options: errorCorrectionLevels.map((value) => ({ label: value, value }))
                            }, null, 8, ["value", "onUpdate:value", "options"])
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(_component_n_gi, null, {
                      default: withCtx(() => [
                        createVNode("div", {
                          flex: "",
                          "flex-col": "",
                          "items-center": "",
                          "gap-3": ""
                        }, [
                          createVNode(_component_n_image, {
                            src: unref(qrcode),
                            width: "200"
                          }, null, 8, ["src"]),
                          createVNode(_component_c_button, { onClick: unref(download) }, {
                            default: withCtx(() => [
                              createTextVNode(" Download qr-code ")
                            ]),
                            _: 1
                          }, 8, ["onClick"])
                        ])
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
              createVNode(_component_n_grid, {
                "x-gap": "12",
                "y-gap": "12",
                cols: "1 600:3"
              }, {
                default: withCtx(() => [
                  createVNode(_component_n_gi, { span: "2" }, {
                    default: withCtx(() => [
                      createVNode(_component_c_input_text, {
                        value: unref(text),
                        "onUpdate:value": ($event) => isRef(text) ? text.value = $event : null,
                        "label-position": "left",
                        "label-width": "130px",
                        "label-align": "right",
                        label: "Text:",
                        multiline: "",
                        rows: "1",
                        autosize: "",
                        placeholder: "Your link or text...",
                        "mb-6": ""
                      }, null, 8, ["value", "onUpdate:value"]),
                      createVNode(_component_n_form, {
                        "label-width": "130",
                        "label-placement": "left"
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_n_form_item, { label: "Foreground color:" }, {
                            default: withCtx(() => [
                              createVNode(_component_n_color_picker, {
                                value: unref(foreground),
                                "onUpdate:value": ($event) => isRef(foreground) ? foreground.value = $event : null,
                                modes: ["hex"]
                              }, null, 8, ["value", "onUpdate:value"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_n_form_item, { label: "Background color:" }, {
                            default: withCtx(() => [
                              createVNode(_component_n_color_picker, {
                                value: unref(background),
                                "onUpdate:value": ($event) => isRef(background) ? background.value = $event : null,
                                modes: ["hex"]
                              }, null, 8, ["value", "onUpdate:value"])
                            ]),
                            _: 1
                          }),
                          createVNode(_component_c_select, {
                            value: unref(errorCorrectionLevel),
                            "onUpdate:value": ($event) => isRef(errorCorrectionLevel) ? errorCorrectionLevel.value = $event : null,
                            label: "Error resistance:",
                            "label-position": "left",
                            "label-width": "130px",
                            "label-align": "right",
                            options: errorCorrectionLevels.map((value) => ({ label: value, value }))
                          }, null, 8, ["value", "onUpdate:value", "options"])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  createVNode(_component_n_gi, null, {
                    default: withCtx(() => [
                      createVNode("div", {
                        flex: "",
                        "flex-col": "",
                        "items-center": "",
                        "gap-3": ""
                      }, [
                        createVNode(_component_n_image, {
                          src: unref(qrcode),
                          width: "200"
                        }, null, 8, ["src"]),
                        createVNode(_component_c_button, { onClick: unref(download) }, {
                          default: withCtx(() => [
                            createTextVNode(" Download qr-code ")
                          ]),
                          _: 1
                        }, 8, ["onClick"])
                      ])
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
    };
  }
});

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/tools/qr-code-generator/qr-code-generator.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
