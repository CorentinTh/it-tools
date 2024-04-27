import { NScrollbar, NConfigProvider, NCode, NIcon } from 'naive-ui';
import { a as __unplugin_components_0, _ as _export_sfc } from './chunk-6003391e.js';
import { a as __unplugin_components_1, _ as _sfc_main$1 } from './chunk-8109fd17.js';
import { defineComponent, toRefs, ref, computed, mergeProps, withCtx, unref, createVNode, openBlock, createBlock, createCommentVNode, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { Copy } from '@vicons/tabler';
import { useElementSize } from '@vueuse/core';
import hljs from 'highlight.js/lib/core';
import jsonHljs from 'highlight.js/lib/languages/json';
import sqlHljs from 'highlight.js/lib/languages/sql';
import xmlHljs from 'highlight.js/lib/languages/xml';
import yamlHljs from 'highlight.js/lib/languages/yaml';
import iniHljs from 'highlight.js/lib/languages/ini';
import { u as useCopy } from './chunk-77c5cc16.js';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "TextareaCopyable",
  __ssrInlineRender: true,
  props: {
    value: {},
    followHeightOf: { default: null },
    language: { default: "txt" },
    copyPlacement: { default: "top-right" },
    copyMessage: { default: "Copy to clipboard" }
  },
  setup(__props) {
    const props = __props;
    hljs.registerLanguage("sql", sqlHljs);
    hljs.registerLanguage("json", jsonHljs);
    hljs.registerLanguage("html", xmlHljs);
    hljs.registerLanguage("xml", xmlHljs);
    hljs.registerLanguage("yaml", yamlHljs);
    hljs.registerLanguage("toml", iniHljs);
    const { value, language, followHeightOf, copyPlacement, copyMessage } = toRefs(props);
    const { height } = followHeightOf.value ? useElementSize(followHeightOf) : { height: ref(null) };
    const { copy, isJustCopied } = useCopy({ source: value, createToast: false });
    const tooltipText = computed(() => isJustCopied.value ? "Copied!" : copyMessage.value);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_c_card = __unplugin_components_1;
      const _component_n_scrollbar = NScrollbar;
      const _component_n_config_provider = NConfigProvider;
      const _component_n_code = NCode;
      const _component_c_tooltip = _sfc_main$1;
      const _component_c_button = __unplugin_components_0;
      const _component_n_icon = NIcon;
      _push(`<div${ssrRenderAttrs(mergeProps({ style: { "overflow-x": "hidden", "width": "100%" } }, _attrs))} data-v-486e5d1f>`);
      _push(ssrRenderComponent(_component_c_card, { relative: "" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_n_scrollbar, {
              "x-scrollable": "",
              trigger: "none",
              style: unref(height) ? `min-height: ${unref(height) - 40 + 10}px` : ""
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_n_config_provider, { hljs: unref(hljs) }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_n_code, {
                          code: unref(value),
                          language: unref(language),
                          trim: false,
                          "data-test-id": "area-content"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_n_code, {
                            code: unref(value),
                            language: unref(language),
                            trim: false,
                            "data-test-id": "area-content"
                          }, null, 8, ["code", "language"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_n_config_provider, { hljs: unref(hljs) }, {
                      default: withCtx(() => [
                        createVNode(_component_n_code, {
                          code: unref(value),
                          language: unref(language),
                          trim: false,
                          "data-test-id": "area-content"
                        }, null, 8, ["code", "language"])
                      ]),
                      _: 1
                    }, 8, ["hljs"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<div absolute right-10px top-10px data-v-486e5d1f${_scopeId}>`);
            if (unref(value)) {
              _push2(ssrRenderComponent(_component_c_tooltip, {
                tooltip: unref(tooltipText),
                position: "left"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_c_button, {
                      circle: "",
                      "important:h-10": "",
                      "important:w-10": "",
                      onClick: ($event) => unref(copy)()
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_n_icon, {
                            size: "22",
                            component: unref(Copy)
                          }, null, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_n_icon, {
                              size: "22",
                              component: unref(Copy)
                            }, null, 8, ["component"])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_c_button, {
                        circle: "",
                        "important:h-10": "",
                        "important:w-10": "",
                        onClick: ($event) => unref(copy)()
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_n_icon, {
                            size: "22",
                            component: unref(Copy)
                          }, null, 8, ["component"])
                        ]),
                        _: 1
                      }, 8, ["onClick"])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode(_component_n_scrollbar, {
                "x-scrollable": "",
                trigger: "none",
                style: unref(height) ? `min-height: ${unref(height) - 40 + 10}px` : ""
              }, {
                default: withCtx(() => [
                  createVNode(_component_n_config_provider, { hljs: unref(hljs) }, {
                    default: withCtx(() => [
                      createVNode(_component_n_code, {
                        code: unref(value),
                        language: unref(language),
                        trim: false,
                        "data-test-id": "area-content"
                      }, null, 8, ["code", "language"])
                    ]),
                    _: 1
                  }, 8, ["hljs"])
                ]),
                _: 1
              }, 8, ["style"]),
              createVNode("div", {
                absolute: "",
                "right-10px": "",
                "top-10px": ""
              }, [
                unref(value) ? (openBlock(), createBlock(_component_c_tooltip, {
                  key: 0,
                  tooltip: unref(tooltipText),
                  position: "left"
                }, {
                  default: withCtx(() => [
                    createVNode(_component_c_button, {
                      circle: "",
                      "important:h-10": "",
                      "important:w-10": "",
                      onClick: ($event) => unref(copy)()
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_n_icon, {
                          size: "22",
                          component: unref(Copy)
                        }, null, 8, ["component"])
                      ]),
                      _: 1
                    }, 8, ["onClick"])
                  ]),
                  _: 1
                }, 8, ["tooltip"])) : createCommentVNode("", true)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      if (unref(copyPlacement) === "outside") {
        _push(`<div mt-4 flex justify-center data-v-486e5d1f>`);
        _push(ssrRenderComponent(_component_c_button, {
          onClick: ($event) => unref(copy)()
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(tooltipText))}`);
            } else {
              return [
                createTextVNode(toDisplayString(unref(tooltipText)), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});

/* unplugin-vue-components disabled */const TextareaCopyable_vue_vue_type_style_index_0_scoped_486e5d1f_lang = '';

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/TextareaCopyable.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const TextareaCopyable = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-486e5d1f"]]);

export { TextareaCopyable as T };
