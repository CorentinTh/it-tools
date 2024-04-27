import { a as __unplugin_components_0 } from './chunk-6003391e.js';
import { _ as __unplugin_components_3 } from './chunk-4e7a6a8d.js';
import { NFormItem } from 'naive-ui';
import { a as __unplugin_components_1 } from './chunk-8109fd17.js';
import { defineComponent, ref, computed, withCtx, unref, isRef, createVNode, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import { escape, unescape } from 'lodash';
import { u as useCopy } from './chunk-77c5cc16.js';
import '@vueuse/core';
import 'pinia';
import './chunk-11f44f81.js';
import './chunk-35c3d701.js';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "html-entities",
  __ssrInlineRender: true,
  setup(__props) {
    const escapeInput = ref("<title>IT Tool</title>");
    const escapeOutput = computed(() => escape(escapeInput.value));
    const { copy: copyEscaped } = useCopy({ source: escapeOutput });
    const unescapeInput = ref("&lt;title&gt;IT Tool&lt;/title&gt;");
    const unescapeOutput = computed(() => unescape(unescapeInput.value));
    const { copy: copyUnescaped } = useCopy({ source: unescapeOutput });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_c_card = __unplugin_components_1;
      const _component_n_form_item = NFormItem;
      const _component_c_input_text = __unplugin_components_3;
      const _component_c_button = __unplugin_components_0;
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_c_card, { title: "Escape html entities" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_n_form_item, { label: "Your string :" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_c_input_text, {
                    value: unref(escapeInput),
                    "onUpdate:value": ($event) => isRef(escapeInput) ? escapeInput.value = $event : null,
                    multiline: "",
                    placeholder: "The string to escape",
                    rows: "3",
                    autosize: "",
                    "raw-text": ""
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_c_input_text, {
                      value: unref(escapeInput),
                      "onUpdate:value": ($event) => isRef(escapeInput) ? escapeInput.value = $event : null,
                      multiline: "",
                      placeholder: "The string to escape",
                      rows: "3",
                      autosize: "",
                      "raw-text": ""
                    }, null, 8, ["value", "onUpdate:value"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_n_form_item, { label: "Your string escaped :" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_c_input_text, {
                    multiline: "",
                    readonly: "",
                    placeholder: "Your string escaped",
                    value: unref(escapeOutput),
                    rows: "3",
                    autosize: ""
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_c_input_text, {
                      multiline: "",
                      readonly: "",
                      placeholder: "Your string escaped",
                      value: unref(escapeOutput),
                      rows: "3",
                      autosize: ""
                    }, null, 8, ["value"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<div flex justify-center${_scopeId}>`);
            _push2(ssrRenderComponent(_component_c_button, {
              onClick: ($event) => unref(copyEscaped)()
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Copy `);
                } else {
                  return [
                    createTextVNode(" Copy ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode(_component_n_form_item, { label: "Your string :" }, {
                default: withCtx(() => [
                  createVNode(_component_c_input_text, {
                    value: unref(escapeInput),
                    "onUpdate:value": ($event) => isRef(escapeInput) ? escapeInput.value = $event : null,
                    multiline: "",
                    placeholder: "The string to escape",
                    rows: "3",
                    autosize: "",
                    "raw-text": ""
                  }, null, 8, ["value", "onUpdate:value"])
                ]),
                _: 1
              }),
              createVNode(_component_n_form_item, { label: "Your string escaped :" }, {
                default: withCtx(() => [
                  createVNode(_component_c_input_text, {
                    multiline: "",
                    readonly: "",
                    placeholder: "Your string escaped",
                    value: unref(escapeOutput),
                    rows: "3",
                    autosize: ""
                  }, null, 8, ["value"])
                ]),
                _: 1
              }),
              createVNode("div", {
                flex: "",
                "justify-center": ""
              }, [
                createVNode(_component_c_button, {
                  onClick: ($event) => unref(copyEscaped)()
                }, {
                  default: withCtx(() => [
                    createTextVNode(" Copy ")
                  ]),
                  _: 1
                }, 8, ["onClick"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_c_card, { title: "Unescape html entities" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_n_form_item, { label: "Your escaped string :" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_c_input_text, {
                    value: unref(unescapeInput),
                    "onUpdate:value": ($event) => isRef(unescapeInput) ? unescapeInput.value = $event : null,
                    multiline: "",
                    placeholder: "The string to unescape",
                    rows: "3",
                    autosize: "",
                    "raw-text": ""
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_c_input_text, {
                      value: unref(unescapeInput),
                      "onUpdate:value": ($event) => isRef(unescapeInput) ? unescapeInput.value = $event : null,
                      multiline: "",
                      placeholder: "The string to unescape",
                      rows: "3",
                      autosize: "",
                      "raw-text": ""
                    }, null, 8, ["value", "onUpdate:value"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_n_form_item, { label: "Your string unescaped :" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_c_input_text, {
                    value: unref(unescapeOutput),
                    multiline: "",
                    readonly: "",
                    placeholder: "Your string unescaped",
                    rows: "3",
                    autosize: ""
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_c_input_text, {
                      value: unref(unescapeOutput),
                      multiline: "",
                      readonly: "",
                      placeholder: "Your string unescaped",
                      rows: "3",
                      autosize: ""
                    }, null, 8, ["value"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<div flex justify-center${_scopeId}>`);
            _push2(ssrRenderComponent(_component_c_button, {
              onClick: ($event) => unref(copyUnescaped)()
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Copy `);
                } else {
                  return [
                    createTextVNode(" Copy ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode(_component_n_form_item, { label: "Your escaped string :" }, {
                default: withCtx(() => [
                  createVNode(_component_c_input_text, {
                    value: unref(unescapeInput),
                    "onUpdate:value": ($event) => isRef(unescapeInput) ? unescapeInput.value = $event : null,
                    multiline: "",
                    placeholder: "The string to unescape",
                    rows: "3",
                    autosize: "",
                    "raw-text": ""
                  }, null, 8, ["value", "onUpdate:value"])
                ]),
                _: 1
              }),
              createVNode(_component_n_form_item, { label: "Your string unescaped :" }, {
                default: withCtx(() => [
                  createVNode(_component_c_input_text, {
                    value: unref(unescapeOutput),
                    multiline: "",
                    readonly: "",
                    placeholder: "Your string unescaped",
                    rows: "3",
                    autosize: ""
                  }, null, 8, ["value"])
                ]),
                _: 1
              }),
              createVNode("div", {
                flex: "",
                "justify-center": ""
              }, [
                createVNode(_component_c_button, {
                  onClick: ($event) => unref(copyUnescaped)()
                }, {
                  default: withCtx(() => [
                    createTextVNode(" Copy ")
                  ]),
                  _: 1
                }, 8, ["onClick"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
});

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/tools/html-entities/html-entities.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
