import { _ as _sfc_main$1 } from './chunk-2e7c6ce5.js';
import { _ as __unplugin_components_3 } from './chunk-4e7a6a8d.js';
import { _ as __unplugin_components_0 } from './chunk-89a4876c.js';
import { NFormItem, NSwitch } from 'naive-ui';
import { a as __unplugin_components_1 } from './chunk-8109fd17.js';
import { defineComponent, withCtx, unref, createVNode, useSSRContext } from 'vue';
import { ssrRenderStyle, ssrRenderComponent } from 'vue/server-renderer';
import { useStorage } from '@vueuse/core';
import _ from 'lodash';
import './chunk-727cc0fb.js';
import './chunk-6003391e.js';
import 'pinia';
import '@vicons/tabler';
import 'highlight.js/lib/core';
import 'highlight.js/lib/languages/json';
import 'highlight.js/lib/languages/sql';
import 'highlight.js/lib/languages/xml';
import 'highlight.js/lib/languages/yaml';
import 'highlight.js/lib/languages/ini';
import './chunk-77c5cc16.js';
import './chunk-11f44f81.js';
import './chunk-35c3d701.js';
import './chunk-bb5bb4f6.js';
import './chunk-2ce6ed5e.js';
import 'fuse.js';

function byOrder({ order }) {
  return (a, b) => {
    return order === "asc" ? a.localeCompare(b) : b.localeCompare(a);
  };
}

function whenever(condition, fn) {
  return (value) => condition ? fn(value) : value;
}
function convert(list, options) {
  const lineBreak = options.keepLineBreaks ? "\n" : "";
  return _.chain(list).thru(whenever(options.lowerCase, (text) => text.toLowerCase())).split("\n").thru(whenever(options.removeDuplicates, _.uniq)).thru(whenever(options.reverseList, _.reverse)).thru(whenever(!_.isNull(options.sortList), (parts) => parts.sort(byOrder({ order: options.sortList })))).map(whenever(options.trimItems, _.trim)).without("").map((p) => options.itemPrefix + p + options.itemSuffix).join(options.separator + lineBreak).thru((text) => [options.listPrefix, text, options.listSuffix].join(lineBreak)).value();
}

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "list-converter",
  __ssrInlineRender: true,
  setup(__props) {
    const sortOrderOptions = [
      {
        label: "Sort ascending",
        value: "asc",
        disabled: false
      },
      {
        label: "Sort descending",
        value: "desc",
        disabled: false
      }
    ];
    const conversionConfig = useStorage("list-converter:conversionConfig", {
      lowerCase: false,
      trimItems: true,
      removeDuplicates: true,
      keepLineBreaks: false,
      itemPrefix: "",
      itemSuffix: "",
      listPrefix: "",
      listSuffix: "",
      reverseList: false,
      sortList: null,
      separator: ", "
    });
    function transformer(value) {
      return convert(value, conversionConfig.value);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_c_card = __unplugin_components_1;
      const _component_n_form_item = NFormItem;
      const _component_n_switch = NSwitch;
      const _component_c_select = __unplugin_components_0;
      const _component_c_input_text = __unplugin_components_3;
      const _component_format_transformer = _sfc_main$1;
      _push(`<!--[--><div style="${ssrRenderStyle({ "flex": "0 0 100%" })}"><div style="${ssrRenderStyle({ "margin": "0 auto", "max-width": "600px" })}">`);
      _push(ssrRenderComponent(_component_c_card, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div flex${_scopeId}><div${_scopeId}>`);
            _push2(ssrRenderComponent(_component_n_form_item, {
              label: "Trim list items",
              "label-placement": "left",
              "label-width": "150",
              "show-feedback": false,
              "mb-2": ""
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_n_switch, {
                    value: unref(conversionConfig).trimItems,
                    "onUpdate:value": ($event) => unref(conversionConfig).trimItems = $event
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_n_switch, {
                      value: unref(conversionConfig).trimItems,
                      "onUpdate:value": ($event) => unref(conversionConfig).trimItems = $event
                    }, null, 8, ["value", "onUpdate:value"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_n_form_item, {
              label: "Remove duplicates",
              "label-placement": "left",
              "label-width": "150",
              "show-feedback": false,
              "mb-2": ""
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_n_switch, {
                    value: unref(conversionConfig).removeDuplicates,
                    "onUpdate:value": ($event) => unref(conversionConfig).removeDuplicates = $event,
                    "data-test-id": "removeDuplicates"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_n_switch, {
                      value: unref(conversionConfig).removeDuplicates,
                      "onUpdate:value": ($event) => unref(conversionConfig).removeDuplicates = $event,
                      "data-test-id": "removeDuplicates"
                    }, null, 8, ["value", "onUpdate:value"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_n_form_item, {
              label: "Convert to lowercase",
              "label-placement": "left",
              "label-width": "150",
              "show-feedback": false,
              "mb-2": ""
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_n_switch, {
                    value: unref(conversionConfig).lowerCase,
                    "onUpdate:value": ($event) => unref(conversionConfig).lowerCase = $event
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_n_switch, {
                      value: unref(conversionConfig).lowerCase,
                      "onUpdate:value": ($event) => unref(conversionConfig).lowerCase = $event
                    }, null, 8, ["value", "onUpdate:value"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_n_form_item, {
              label: "Keep line breaks",
              "label-placement": "left",
              "label-width": "150",
              "show-feedback": false,
              "mb-2": ""
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_n_switch, {
                    value: unref(conversionConfig).keepLineBreaks,
                    "onUpdate:value": ($event) => unref(conversionConfig).keepLineBreaks = $event
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_n_switch, {
                      value: unref(conversionConfig).keepLineBreaks,
                      "onUpdate:value": ($event) => unref(conversionConfig).keepLineBreaks = $event
                    }, null, 8, ["value", "onUpdate:value"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div><div flex-1${_scopeId}>`);
            _push2(ssrRenderComponent(_component_c_select, {
              value: unref(conversionConfig).sortList,
              "onUpdate:value": ($event) => unref(conversionConfig).sortList = $event,
              label: "Sort list",
              "label-position": "left",
              "label-width": "120px",
              "label-align": "right",
              "mb-2": "",
              options: sortOrderOptions,
              "w-full": "",
              disabled: unref(conversionConfig).reverseList,
              "data-test-id": "sortList",
              placeholder: "Sort alphabetically"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_c_input_text, {
              value: unref(conversionConfig).separator,
              "onUpdate:value": ($event) => unref(conversionConfig).separator = $event,
              label: "Separator",
              "label-position": "left",
              "label-width": "120px",
              "label-align": "right",
              "mb-2": "",
              placeholder: ","
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_n_form_item, {
              label: "Wrap item",
              "label-placement": "left",
              "label-width": "120",
              "show-feedback": false,
              "mb-2": ""
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_c_input_text, {
                    value: unref(conversionConfig).itemPrefix,
                    "onUpdate:value": ($event) => unref(conversionConfig).itemPrefix = $event,
                    placeholder: "Item prefix",
                    "test-id": "itemPrefix"
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_c_input_text, {
                    value: unref(conversionConfig).itemSuffix,
                    "onUpdate:value": ($event) => unref(conversionConfig).itemSuffix = $event,
                    placeholder: "Item suffix",
                    "test-id": "itemSuffix"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_c_input_text, {
                      value: unref(conversionConfig).itemPrefix,
                      "onUpdate:value": ($event) => unref(conversionConfig).itemPrefix = $event,
                      placeholder: "Item prefix",
                      "test-id": "itemPrefix"
                    }, null, 8, ["value", "onUpdate:value"]),
                    createVNode(_component_c_input_text, {
                      value: unref(conversionConfig).itemSuffix,
                      "onUpdate:value": ($event) => unref(conversionConfig).itemSuffix = $event,
                      placeholder: "Item suffix",
                      "test-id": "itemSuffix"
                    }, null, 8, ["value", "onUpdate:value"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_n_form_item, {
              label: "Wrap list",
              "label-placement": "left",
              "label-width": "120",
              "show-feedback": false,
              "mb-2": ""
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_c_input_text, {
                    value: unref(conversionConfig).listPrefix,
                    "onUpdate:value": ($event) => unref(conversionConfig).listPrefix = $event,
                    placeholder: "List prefix",
                    "test-id": "listPrefix"
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_c_input_text, {
                    value: unref(conversionConfig).listSuffix,
                    "onUpdate:value": ($event) => unref(conversionConfig).listSuffix = $event,
                    placeholder: "List suffix",
                    "test-id": "listSuffix"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_c_input_text, {
                      value: unref(conversionConfig).listPrefix,
                      "onUpdate:value": ($event) => unref(conversionConfig).listPrefix = $event,
                      placeholder: "List prefix",
                      "test-id": "listPrefix"
                    }, null, 8, ["value", "onUpdate:value"]),
                    createVNode(_component_c_input_text, {
                      value: unref(conversionConfig).listSuffix,
                      "onUpdate:value": ($event) => unref(conversionConfig).listSuffix = $event,
                      placeholder: "List suffix",
                      "test-id": "listSuffix"
                    }, null, 8, ["value", "onUpdate:value"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { flex: "" }, [
                createVNode("div", null, [
                  createVNode(_component_n_form_item, {
                    label: "Trim list items",
                    "label-placement": "left",
                    "label-width": "150",
                    "show-feedback": false,
                    "mb-2": ""
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_n_switch, {
                        value: unref(conversionConfig).trimItems,
                        "onUpdate:value": ($event) => unref(conversionConfig).trimItems = $event
                      }, null, 8, ["value", "onUpdate:value"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_n_form_item, {
                    label: "Remove duplicates",
                    "label-placement": "left",
                    "label-width": "150",
                    "show-feedback": false,
                    "mb-2": ""
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_n_switch, {
                        value: unref(conversionConfig).removeDuplicates,
                        "onUpdate:value": ($event) => unref(conversionConfig).removeDuplicates = $event,
                        "data-test-id": "removeDuplicates"
                      }, null, 8, ["value", "onUpdate:value"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_n_form_item, {
                    label: "Convert to lowercase",
                    "label-placement": "left",
                    "label-width": "150",
                    "show-feedback": false,
                    "mb-2": ""
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_n_switch, {
                        value: unref(conversionConfig).lowerCase,
                        "onUpdate:value": ($event) => unref(conversionConfig).lowerCase = $event
                      }, null, 8, ["value", "onUpdate:value"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_n_form_item, {
                    label: "Keep line breaks",
                    "label-placement": "left",
                    "label-width": "150",
                    "show-feedback": false,
                    "mb-2": ""
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_n_switch, {
                        value: unref(conversionConfig).keepLineBreaks,
                        "onUpdate:value": ($event) => unref(conversionConfig).keepLineBreaks = $event
                      }, null, 8, ["value", "onUpdate:value"])
                    ]),
                    _: 1
                  })
                ]),
                createVNode("div", { "flex-1": "" }, [
                  createVNode(_component_c_select, {
                    value: unref(conversionConfig).sortList,
                    "onUpdate:value": ($event) => unref(conversionConfig).sortList = $event,
                    label: "Sort list",
                    "label-position": "left",
                    "label-width": "120px",
                    "label-align": "right",
                    "mb-2": "",
                    options: sortOrderOptions,
                    "w-full": "",
                    disabled: unref(conversionConfig).reverseList,
                    "data-test-id": "sortList",
                    placeholder: "Sort alphabetically"
                  }, null, 8, ["value", "onUpdate:value", "disabled"]),
                  createVNode(_component_c_input_text, {
                    value: unref(conversionConfig).separator,
                    "onUpdate:value": ($event) => unref(conversionConfig).separator = $event,
                    label: "Separator",
                    "label-position": "left",
                    "label-width": "120px",
                    "label-align": "right",
                    "mb-2": "",
                    placeholder: ","
                  }, null, 8, ["value", "onUpdate:value"]),
                  createVNode(_component_n_form_item, {
                    label: "Wrap item",
                    "label-placement": "left",
                    "label-width": "120",
                    "show-feedback": false,
                    "mb-2": ""
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_c_input_text, {
                        value: unref(conversionConfig).itemPrefix,
                        "onUpdate:value": ($event) => unref(conversionConfig).itemPrefix = $event,
                        placeholder: "Item prefix",
                        "test-id": "itemPrefix"
                      }, null, 8, ["value", "onUpdate:value"]),
                      createVNode(_component_c_input_text, {
                        value: unref(conversionConfig).itemSuffix,
                        "onUpdate:value": ($event) => unref(conversionConfig).itemSuffix = $event,
                        placeholder: "Item suffix",
                        "test-id": "itemSuffix"
                      }, null, 8, ["value", "onUpdate:value"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_n_form_item, {
                    label: "Wrap list",
                    "label-placement": "left",
                    "label-width": "120",
                    "show-feedback": false,
                    "mb-2": ""
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_c_input_text, {
                        value: unref(conversionConfig).listPrefix,
                        "onUpdate:value": ($event) => unref(conversionConfig).listPrefix = $event,
                        placeholder: "List prefix",
                        "test-id": "listPrefix"
                      }, null, 8, ["value", "onUpdate:value"]),
                      createVNode(_component_c_input_text, {
                        value: unref(conversionConfig).listSuffix,
                        "onUpdate:value": ($event) => unref(conversionConfig).listSuffix = $event,
                        placeholder: "List suffix",
                        "test-id": "listSuffix"
                      }, null, 8, ["value", "onUpdate:value"])
                    ]),
                    _: 1
                  })
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
      _push(ssrRenderComponent(_component_format_transformer, {
        "input-label": "Your input data",
        "input-placeholder": "Paste your input data here...",
        "output-label": "Your transformed data",
        transformer
      }, null, _parent));
      _push(`<!--]-->`);
    };
  }
});

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/tools/list-converter/list-converter.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
