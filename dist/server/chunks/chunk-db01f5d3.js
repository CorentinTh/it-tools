import { a as __unplugin_components_0, _ as _export_sfc } from './chunk-6003391e.js';
import { NForm, NFormItem, NInputNumber, NColorPicker, NSwitch } from 'naive-ui';
import { _ as __unplugin_components_3 } from './chunk-4e7a6a8d.js';
import { defineComponent, ref, computed, withCtx, unref, isRef, createVNode, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderAttr } from 'vue/server-renderer';
import { T as TextareaCopyable } from './chunk-727cc0fb.js';
import { u as useCopy } from './chunk-77c5cc16.js';
import { u as useDownloadFileFromBase64 } from './chunk-cce4ae69.js';
import { t as textToBase64 } from './chunk-72fc6fca.js';
import '@vueuse/core';
import 'pinia';
import './chunk-11f44f81.js';
import './chunk-35c3d701.js';
import 'lodash';
import './chunk-8109fd17.js';
import '@vicons/tabler';
import 'highlight.js/lib/core';
import 'highlight.js/lib/languages/json';
import 'highlight.js/lib/languages/sql';
import 'highlight.js/lib/languages/xml';
import 'highlight.js/lib/languages/yaml';
import 'highlight.js/lib/languages/ini';
import 'mime-types';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "svg-placeholder-generator",
  __ssrInlineRender: true,
  setup(__props) {
    const width = ref(600);
    const height = ref(350);
    const fontSize = ref(26);
    const bgColor = ref("#cccccc");
    const fgColor = ref("#333333");
    const useExactSize = ref(true);
    const customText = ref("");
    const svgString = computed(() => {
      const w = width.value;
      const h = height.value;
      const text = customText.value.length > 0 ? customText.value : `${w}x${h}`;
      const size = useExactSize.value ? ` width="${w}" height="${h}"` : "";
      return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}"${size}>
  <rect width="${w}" height="${h}" fill="${bgColor.value}"></rect>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="monospace" font-size="${fontSize.value}px" fill="${fgColor.value}">${text}</text>
</svg>
  `.trim();
    });
    const base64 = computed(() => `data:image/svg+xml;base64,${textToBase64(svgString.value)}`);
    const { copy: copySVG } = useCopy({ source: svgString });
    const { copy: copyBase64 } = useCopy({ source: base64 });
    const { download } = useDownloadFileFromBase64({ source: base64 });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_n_form = NForm;
      const _component_n_form_item = NFormItem;
      const _component_n_input_number = NInputNumber;
      const _component_n_color_picker = NColorPicker;
      const _component_c_input_text = __unplugin_components_3;
      const _component_n_switch = NSwitch;
      const _component_c_button = __unplugin_components_0;
      _push(`<!--[--><div data-v-9f7dfee7>`);
      _push(ssrRenderComponent(_component_n_form, {
        "label-placement": "left",
        "label-width": "100"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div flex gap-3 data-v-9f7dfee7${_scopeId}>`);
            _push2(ssrRenderComponent(_component_n_form_item, {
              label: "Width (in px)",
              "flex-1": ""
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_n_input_number, {
                    value: unref(width),
                    "onUpdate:value": ($event) => isRef(width) ? width.value = $event : null,
                    placeholder: "SVG width...",
                    min: "1"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_n_input_number, {
                      value: unref(width),
                      "onUpdate:value": ($event) => isRef(width) ? width.value = $event : null,
                      placeholder: "SVG width...",
                      min: "1"
                    }, null, 8, ["value", "onUpdate:value"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_n_form_item, {
              label: "Background",
              "flex-1": ""
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_n_color_picker, {
                    value: unref(bgColor),
                    "onUpdate:value": ($event) => isRef(bgColor) ? bgColor.value = $event : null,
                    modes: ["hex"]
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_n_color_picker, {
                      value: unref(bgColor),
                      "onUpdate:value": ($event) => isRef(bgColor) ? bgColor.value = $event : null,
                      modes: ["hex"]
                    }, null, 8, ["value", "onUpdate:value"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div><div flex gap-3 data-v-9f7dfee7${_scopeId}>`);
            _push2(ssrRenderComponent(_component_n_form_item, {
              label: "Height (in px)",
              "flex-1": ""
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_n_input_number, {
                    value: unref(height),
                    "onUpdate:value": ($event) => isRef(height) ? height.value = $event : null,
                    placeholder: "SVG height...",
                    min: "1"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_n_input_number, {
                      value: unref(height),
                      "onUpdate:value": ($event) => isRef(height) ? height.value = $event : null,
                      placeholder: "SVG height...",
                      min: "1"
                    }, null, 8, ["value", "onUpdate:value"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_n_form_item, {
              label: "Text color",
              "flex-1": ""
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_n_color_picker, {
                    value: unref(fgColor),
                    "onUpdate:value": ($event) => isRef(fgColor) ? fgColor.value = $event : null,
                    modes: ["hex"]
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_n_color_picker, {
                      value: unref(fgColor),
                      "onUpdate:value": ($event) => isRef(fgColor) ? fgColor.value = $event : null,
                      modes: ["hex"]
                    }, null, 8, ["value", "onUpdate:value"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div><div flex gap-3 data-v-9f7dfee7${_scopeId}>`);
            _push2(ssrRenderComponent(_component_n_form_item, {
              label: "Font size",
              "flex-1": ""
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_n_input_number, {
                    value: unref(fontSize),
                    "onUpdate:value": ($event) => isRef(fontSize) ? fontSize.value = $event : null,
                    placeholder: "Font size...",
                    min: "1"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_n_input_number, {
                      value: unref(fontSize),
                      "onUpdate:value": ($event) => isRef(fontSize) ? fontSize.value = $event : null,
                      placeholder: "Font size...",
                      min: "1"
                    }, null, 8, ["value", "onUpdate:value"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_c_input_text, {
              value: unref(customText),
              "onUpdate:value": ($event) => isRef(customText) ? customText.value = $event : null,
              label: "Custom text",
              placeholder: `Default is ${unref(width)}x${unref(height)}`,
              "label-position": "left",
              "label-width": "100px",
              "label-align": "right",
              "flex-1": ""
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
            _push2(ssrRenderComponent(_component_n_form_item, {
              label: "Use exact size",
              "label-placement": "left"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_n_switch, {
                    value: unref(useExactSize),
                    "onUpdate:value": ($event) => isRef(useExactSize) ? useExactSize.value = $event : null
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_n_switch, {
                      value: unref(useExactSize),
                      "onUpdate:value": ($event) => isRef(useExactSize) ? useExactSize.value = $event : null
                    }, null, 8, ["value", "onUpdate:value"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode("div", {
                flex: "",
                "gap-3": ""
              }, [
                createVNode(_component_n_form_item, {
                  label: "Width (in px)",
                  "flex-1": ""
                }, {
                  default: withCtx(() => [
                    createVNode(_component_n_input_number, {
                      value: unref(width),
                      "onUpdate:value": ($event) => isRef(width) ? width.value = $event : null,
                      placeholder: "SVG width...",
                      min: "1"
                    }, null, 8, ["value", "onUpdate:value"])
                  ]),
                  _: 1
                }),
                createVNode(_component_n_form_item, {
                  label: "Background",
                  "flex-1": ""
                }, {
                  default: withCtx(() => [
                    createVNode(_component_n_color_picker, {
                      value: unref(bgColor),
                      "onUpdate:value": ($event) => isRef(bgColor) ? bgColor.value = $event : null,
                      modes: ["hex"]
                    }, null, 8, ["value", "onUpdate:value"])
                  ]),
                  _: 1
                })
              ]),
              createVNode("div", {
                flex: "",
                "gap-3": ""
              }, [
                createVNode(_component_n_form_item, {
                  label: "Height (in px)",
                  "flex-1": ""
                }, {
                  default: withCtx(() => [
                    createVNode(_component_n_input_number, {
                      value: unref(height),
                      "onUpdate:value": ($event) => isRef(height) ? height.value = $event : null,
                      placeholder: "SVG height...",
                      min: "1"
                    }, null, 8, ["value", "onUpdate:value"])
                  ]),
                  _: 1
                }),
                createVNode(_component_n_form_item, {
                  label: "Text color",
                  "flex-1": ""
                }, {
                  default: withCtx(() => [
                    createVNode(_component_n_color_picker, {
                      value: unref(fgColor),
                      "onUpdate:value": ($event) => isRef(fgColor) ? fgColor.value = $event : null,
                      modes: ["hex"]
                    }, null, 8, ["value", "onUpdate:value"])
                  ]),
                  _: 1
                })
              ]),
              createVNode("div", {
                flex: "",
                "gap-3": ""
              }, [
                createVNode(_component_n_form_item, {
                  label: "Font size",
                  "flex-1": ""
                }, {
                  default: withCtx(() => [
                    createVNode(_component_n_input_number, {
                      value: unref(fontSize),
                      "onUpdate:value": ($event) => isRef(fontSize) ? fontSize.value = $event : null,
                      placeholder: "Font size...",
                      min: "1"
                    }, null, 8, ["value", "onUpdate:value"])
                  ]),
                  _: 1
                }),
                createVNode(_component_c_input_text, {
                  value: unref(customText),
                  "onUpdate:value": ($event) => isRef(customText) ? customText.value = $event : null,
                  label: "Custom text",
                  placeholder: `Default is ${unref(width)}x${unref(height)}`,
                  "label-position": "left",
                  "label-width": "100px",
                  "label-align": "right",
                  "flex-1": ""
                }, null, 8, ["value", "onUpdate:value", "placeholder"])
              ]),
              createVNode(_component_n_form_item, {
                label: "Use exact size",
                "label-placement": "left"
              }, {
                default: withCtx(() => [
                  createVNode(_component_n_switch, {
                    value: unref(useExactSize),
                    "onUpdate:value": ($event) => isRef(useExactSize) ? useExactSize.value = $event : null
                  }, null, 8, ["value", "onUpdate:value"])
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_n_form_item, { label: "SVG HTML element" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(TextareaCopyable, {
              value: unref(svgString),
              "copy-placement": "none"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(TextareaCopyable, {
                value: unref(svgString),
                "copy-placement": "none"
              }, null, 8, ["value"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_n_form_item, { label: "SVG in Base64" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(TextareaCopyable, {
              value: unref(base64),
              "copy-placement": "none"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(TextareaCopyable, {
                value: unref(base64),
                "copy-placement": "none"
              }, null, 8, ["value"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div flex justify-center gap-3 data-v-9f7dfee7>`);
      _push(ssrRenderComponent(_component_c_button, {
        onClick: ($event) => unref(copySVG)()
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Copy svg `);
          } else {
            return [
              createTextVNode(" Copy svg ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_c_button, {
        onClick: ($event) => unref(copyBase64)()
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Copy base64 `);
          } else {
            return [
              createTextVNode(" Copy base64 ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_c_button, {
        onClick: ($event) => unref(download)()
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Download svg `);
          } else {
            return [
              createTextVNode(" Download svg ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div><img${ssrRenderAttr("src", unref(base64))} alt="Image" data-v-9f7dfee7><!--]-->`);
    };
  }
});

/* unplugin-vue-components disabled */const svgPlaceholderGenerator_vue_vue_type_style_index_0_scoped_9f7dfee7_lang = '';

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/tools/svg-placeholder-generator/svg-placeholder-generator.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const svgPlaceholderGenerator = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-9f7dfee7"]]);

export { svgPlaceholderGenerator as default };
