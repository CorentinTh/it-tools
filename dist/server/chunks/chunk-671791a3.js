import { _ as _sfc_main$3 } from './chunk-aab02bfe.js';
import { NInputNumber, NIcon, NScrollbar, NDivider, NFormItem } from 'naive-ui';
import { a as __unplugin_components_0 } from './chunk-6003391e.js';
import { _ as __unplugin_components_3 } from './chunk-4e7a6a8d.js';
import { _ as _sfc_main$2, a as __unplugin_components_1 } from './chunk-8109fd17.js';
import { defineComponent, unref, withCtx, createVNode, createTextVNode, nextTick, useSSRContext, computed, openBlock, createBlock, Fragment, renderList, createCommentVNode, isRef } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent, ssrRenderStyle } from 'vue/server-renderer';
import { Trash, Plus } from '@vicons/tabler';
import { useTemplateRefsList, useVModel, useStorage } from '@vueuse/core';
import _ from 'lodash';
import { u as useCopy } from './chunk-77c5cc16.js';
import 'pinia';
import './chunk-11f44f81.js';
import './chunk-35c3d701.js';

function computeAverage({ data }) {
  if (data.length === 0) {
    return 0;
  }
  return _.sum(data) / data.length;
}
function computeVariance({ data }) {
  const mean = computeAverage({ data });
  const squaredDiffs = data.map((value) => (value - mean) ** 2);
  return computeAverage({ data: squaredDiffs });
}
function arrayToMarkdownTable({ data, headerMap = {} }) {
  if (!Array.isArray(data) || data.length === 0) {
    return "";
  }
  const headers = Object.keys(data[0]);
  const rows = data.map((obj) => Object.values(obj));
  const headerRow = `| ${headers.map((header) => headerMap[header] ?? header).join(" | ")} |`;
  const separatorRow = `| ${headers.map(() => "---").join(" | ")} |`;
  const dataRows = rows.map((row) => `| ${row.join(" | ")} |`).join("\n");
  return `${headerRow}
${separatorRow}
${dataRows}`;
}

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "dynamic-values",
  __ssrInlineRender: true,
  props: {
    values: {}
  },
  emits: ["update:values"],
  setup(__props, { emit }) {
    const props = __props;
    const refs = useTemplateRefsList();
    const values = useVModel(props, "values", emit);
    async function addValue() {
      values.value.push(null);
      await nextTick();
      refs.value.at(-1)?.focus();
    }
    function onInputEnter(index) {
      if (index === values.value.length - 1) {
        addValue();
        return;
      }
      refs.value.at(index + 1)?.focus();
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_c_tooltip = _sfc_main$2;
      const _component_c_button = __unplugin_components_0;
      const _component_n_icon = NIcon;
      _push(`<div${ssrRenderAttrs(_attrs)}><!--[-->`);
      ssrRenderList(unref(values), (value, index) => {
        _push(`<div mb-2 flex flex-nowrap gap-2>`);
        _push(ssrRenderComponent(unref(NInputNumber), {
          ref_for: true,
          ref: unref(refs).set,
          value: unref(values)[index],
          "onUpdate:value": ($event) => unref(values)[index] = $event,
          "show-button": false,
          placeholder: "Set your measure...",
          autofocus: "",
          onKeydown: ($event) => onInputEnter(index)
        }, null, _parent));
        _push(ssrRenderComponent(_component_c_tooltip, { tooltip: "Delete this value" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_c_button, {
                circle: "",
                variant: "text",
                onClick: ($event) => unref(values).splice(index, 1)
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_n_icon, {
                      component: unref(Trash),
                      depth: "3",
                      size: "18"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_n_icon, {
                        component: unref(Trash),
                        depth: "3",
                        size: "18"
                      }, null, 8, ["component"])
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_c_button, {
                  circle: "",
                  variant: "text",
                  onClick: ($event) => unref(values).splice(index, 1)
                }, {
                  default: withCtx(() => [
                    createVNode(_component_n_icon, {
                      component: unref(Trash),
                      depth: "3",
                      size: "18"
                    }, null, 8, ["component"])
                  ]),
                  _: 2
                }, 1032, ["onClick"])
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</div>`);
      });
      _push(`<!--]-->`);
      _push(ssrRenderComponent(_component_c_button, { onClick: addValue }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_n_icon, {
              component: unref(Plus),
              depth: "3",
              "mr-2": "",
              size: "18"
            }, null, _parent2, _scopeId));
            _push2(` Add a measure `);
          } else {
            return [
              createVNode(_component_n_icon, {
                component: unref(Plus),
                depth: "3",
                "mr-2": "",
                size: "18"
              }, null, 8, ["component"]),
              createTextVNode(" Add a measure ")
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/tools/benchmark-builder/dynamic-values.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "benchmark-builder",
  __ssrInlineRender: true,
  setup(__props) {
    const suites = useStorage("benchmark-builder:suites", [
      { title: "Suite 1", data: [5, 10] },
      { title: "Suite 2", data: [8, 12] }
    ]);
    const unit = useStorage("benchmark-builder:unit", "");
    const round = (v) => Math.round(v * 1e3) / 1e3;
    const results = computed(() => {
      return suites.value.map(({ data: dirtyData, title }) => {
        const data = dirtyData.filter(_.isNumber);
        return {
          title,
          size: data.length,
          mean: computeAverage({ data }),
          variance: computeVariance({ data })
        };
      }).sort((a, b) => a.mean - b.mean).map(({ mean, variance, size, title }, index, suites2) => {
        const cleanUnit = unit.value.trim();
        const bestMean = suites2[0].mean;
        const deltaWithBestMean = mean - bestMean;
        const ratioWithBestMean = bestMean === 0 ? "∞" : round(mean / bestMean);
        const comparisonValues = index !== 0 && bestMean !== mean ? ` (+${round(deltaWithBestMean)}${cleanUnit} ; x${ratioWithBestMean})` : "";
        return {
          position: index + 1,
          title,
          mean: `${round(mean)}${cleanUnit}${comparisonValues}`,
          variance: `${round(variance)}${cleanUnit}${cleanUnit ? "²" : ""}`,
          size
        };
      });
    });
    const { copy } = useCopy({ createToast: false });
    const header = {
      position: "Position",
      title: "Suite",
      size: "Samples",
      mean: "Mean",
      variance: "Variance"
    };
    function copyAsMarkdown() {
      copy(arrayToMarkdownTable({ data: results.value, headerMap: header }));
    }
    function copyAsBulletList() {
      const bulletList = results.value.flatMap(({ title, ...sections }) => {
        return [
          ` - ${title}`,
          ...Object.entries(sections).map(
            ([key, value]) => `    - ${header[key] ?? key}: ${value}`
          )
        ];
      }).join("\n");
      copy(bulletList);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_n_scrollbar = NScrollbar;
      const _component_c_card = __unplugin_components_1;
      const _component_c_input_text = __unplugin_components_3;
      const _component_n_divider = NDivider;
      const _component_n_form_item = NFormItem;
      const _component_c_button = __unplugin_components_0;
      const _component_n_icon = NIcon;
      const _component_c_table = _sfc_main$3;
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_n_scrollbar, {
        style: { "flex": "1" },
        "x-scrollable": ""
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div mb-5 flex flex-1 flex-nowrap justify-center gap-12px${_scopeId}><!--[-->`);
            ssrRenderList(unref(suites), (suite, index) => {
              _push2(`<div${_scopeId}>`);
              _push2(ssrRenderComponent(_component_c_card, { style: { "width": "294px" } }, {
                default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_c_input_text, {
                      value: suite.title,
                      "onUpdate:value": ($event) => suite.title = $event,
                      "label-position": "left",
                      label: "Suite name",
                      placeholder: "Suite name...",
                      clearable: ""
                    }, null, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_component_n_divider, null, null, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_component_n_form_item, {
                      label: "Suite values",
                      "show-feedback": false
                    }, {
                      default: withCtx((_4, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_sfc_main$1, {
                            values: suite.data,
                            "onUpdate:values": ($event) => suite.data = $event
                          }, null, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_sfc_main$1, {
                              values: suite.data,
                              "onUpdate:values": ($event) => suite.data = $event
                            }, null, 8, ["values", "onUpdate:values"])
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_c_input_text, {
                        value: suite.title,
                        "onUpdate:value": ($event) => suite.title = $event,
                        "label-position": "left",
                        label: "Suite name",
                        placeholder: "Suite name...",
                        clearable: ""
                      }, null, 8, ["value", "onUpdate:value"]),
                      createVNode(_component_n_divider),
                      createVNode(_component_n_form_item, {
                        label: "Suite values",
                        "show-feedback": false
                      }, {
                        default: withCtx(() => [
                          createVNode(_sfc_main$1, {
                            values: suite.data,
                            "onUpdate:values": ($event) => suite.data = $event
                          }, null, 8, ["values", "onUpdate:values"])
                        ]),
                        _: 2
                      }, 1024)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(`<div flex justify-center${_scopeId}>`);
              if (unref(suites).length > 1) {
                _push2(ssrRenderComponent(_component_c_button, {
                  variant: "text",
                  onClick: ($event) => unref(suites).splice(index, 1)
                }, {
                  default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(ssrRenderComponent(_component_n_icon, {
                        component: unref(Trash),
                        depth: "3",
                        "mr-2": "",
                        size: "18"
                      }, null, _parent3, _scopeId2));
                      _push3(` Delete suite `);
                    } else {
                      return [
                        createVNode(_component_n_icon, {
                          component: unref(Trash),
                          depth: "3",
                          "mr-2": "",
                          size: "18"
                        }, null, 8, ["component"]),
                        createTextVNode(" Delete suite ")
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(ssrRenderComponent(_component_c_button, {
                variant: "text",
                onClick: ($event) => unref(suites).splice(index + 1, 0, { data: [0], title: `Suite ${unref(suites).length + 1}` })
              }, {
                default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_n_icon, {
                      component: unref(Plus),
                      depth: "3",
                      "mr-2": "",
                      size: "18"
                    }, null, _parent3, _scopeId2));
                    _push3(` Add suite `);
                  } else {
                    return [
                      createVNode(_component_n_icon, {
                        component: unref(Plus),
                        depth: "3",
                        "mr-2": "",
                        size: "18"
                      }, null, 8, ["component"]),
                      createTextVNode(" Add suite ")
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(`</div></div>`);
            });
            _push2(`<!--]--></div>`);
          } else {
            return [
              createVNode("div", {
                "mb-5": "",
                flex: "",
                "flex-1": "",
                "flex-nowrap": "",
                "justify-center": "",
                "gap-12px": ""
              }, [
                (openBlock(true), createBlock(Fragment, null, renderList(unref(suites), (suite, index) => {
                  return openBlock(), createBlock("div", { key: index }, [
                    createVNode(_component_c_card, { style: { "width": "294px" } }, {
                      default: withCtx(() => [
                        createVNode(_component_c_input_text, {
                          value: suite.title,
                          "onUpdate:value": ($event) => suite.title = $event,
                          "label-position": "left",
                          label: "Suite name",
                          placeholder: "Suite name...",
                          clearable: ""
                        }, null, 8, ["value", "onUpdate:value"]),
                        createVNode(_component_n_divider),
                        createVNode(_component_n_form_item, {
                          label: "Suite values",
                          "show-feedback": false
                        }, {
                          default: withCtx(() => [
                            createVNode(_sfc_main$1, {
                              values: suite.data,
                              "onUpdate:values": ($event) => suite.data = $event
                            }, null, 8, ["values", "onUpdate:values"])
                          ]),
                          _: 2
                        }, 1024)
                      ]),
                      _: 2
                    }, 1024),
                    createVNode("div", {
                      flex: "",
                      "justify-center": ""
                    }, [
                      unref(suites).length > 1 ? (openBlock(), createBlock(_component_c_button, {
                        key: 0,
                        variant: "text",
                        onClick: ($event) => unref(suites).splice(index, 1)
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_n_icon, {
                            component: unref(Trash),
                            depth: "3",
                            "mr-2": "",
                            size: "18"
                          }, null, 8, ["component"]),
                          createTextVNode(" Delete suite ")
                        ]),
                        _: 2
                      }, 1032, ["onClick"])) : createCommentVNode("", true),
                      createVNode(_component_c_button, {
                        variant: "text",
                        onClick: ($event) => unref(suites).splice(index + 1, 0, { data: [0], title: `Suite ${unref(suites).length + 1}` })
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_n_icon, {
                            component: unref(Plus),
                            depth: "3",
                            "mr-2": "",
                            size: "18"
                          }, null, 8, ["component"]),
                          createTextVNode(" Add suite ")
                        ]),
                        _: 2
                      }, 1032, ["onClick"])
                    ])
                  ]);
                }), 128))
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div style="${ssrRenderStyle({ "flex": "0 0 100%" })}"><div style="${ssrRenderStyle({ "max-width": "600px", "margin": "0 auto" })}"><div mx-auto max-w-sm flex justify-center gap-3>`);
      _push(ssrRenderComponent(_component_c_input_text, {
        value: unref(unit),
        "onUpdate:value": ($event) => isRef(unit) ? unit.value = $event : null,
        placeholder: "Unit (eg: ms)",
        label: "Unit",
        "label-position": "left",
        "mb-4": ""
      }, null, _parent));
      _push(ssrRenderComponent(_component_c_button, {
        onClick: ($event) => suites.value = [
          { title: "Suite 1", data: [] },
          { title: "Suite 2", data: [] }
        ]
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Reset suites `);
          } else {
            return [
              createTextVNode(" Reset suites ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_c_table, {
        data: unref(results),
        headers: header
      }, null, _parent));
      _push(`<div mt-5 flex justify-center gap-3>`);
      _push(ssrRenderComponent(_component_c_button, {
        onClick: ($event) => copyAsMarkdown()
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Copy as markdown table `);
          } else {
            return [
              createTextVNode(" Copy as markdown table ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_c_button, {
        onClick: ($event) => copyAsBulletList()
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Copy as bullet list `);
          } else {
            return [
              createTextVNode(" Copy as bullet list ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div><!--]-->`);
    };
  }
});

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/tools/benchmark-builder/benchmark-builder.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
