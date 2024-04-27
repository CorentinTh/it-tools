import { a as __unplugin_components_0 } from './chunk-6003391e.js';
import { _ as __unplugin_components_3 } from './chunk-4e7a6a8d.js';
import { NFormItem, NSwitch } from 'naive-ui';
import { a as __unplugin_components_1 } from './chunk-8109fd17.js';
import { defineComponent, ref, computed, withCtx, unref, isRef, createVNode, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import { u as useCopy } from './chunk-77c5cc16.js';
import { t as textToBase64, b as base64ToText, i as isValidBase64 } from './chunk-72fc6fca.js';
import { w as withDefaultOnError } from './chunk-f1b4cc24.js';
import { useStorage } from '@vueuse/core';
import 'pinia';
import './chunk-11f44f81.js';
import './chunk-35c3d701.js';
import 'lodash';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "base64-string-converter",
  __ssrInlineRender: true,
  setup(__props) {
    const encodeUrlSafe = useStorage("base64-string-converter--encode-url-safe", false);
    const decodeUrlSafe = useStorage("base64-string-converter--decode-url-safe", false);
    const textInput = ref("");
    const base64Output = computed(() => textToBase64(textInput.value, { makeUrlSafe: encodeUrlSafe.value }));
    const { copy: copyTextBase64 } = useCopy({ source: base64Output, text: "Base64 string copied to the clipboard" });
    const base64Input = ref("");
    const textOutput = computed(
      () => withDefaultOnError(() => base64ToText(base64Input.value.trim(), { makeUrlSafe: decodeUrlSafe.value }), "")
    );
    const { copy: copyText } = useCopy({ source: textOutput, text: "String copied to the clipboard" });
    const b64ValidationRules = [
      {
        message: "Invalid base64 string",
        validator: (value) => isValidBase64(value.trim(), { makeUrlSafe: decodeUrlSafe.value })
      }
    ];
    const b64ValidationWatch = [decodeUrlSafe];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_c_card = __unplugin_components_1;
      const _component_n_form_item = NFormItem;
      const _component_n_switch = NSwitch;
      const _component_c_input_text = __unplugin_components_3;
      const _component_c_button = __unplugin_components_0;
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_c_card, { title: "String to base64" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_n_form_item, {
              label: "Encode URL safe",
              "label-placement": "left"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_n_switch, {
                    value: unref(encodeUrlSafe),
                    "onUpdate:value": ($event) => isRef(encodeUrlSafe) ? encodeUrlSafe.value = $event : null
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_n_switch, {
                      value: unref(encodeUrlSafe),
                      "onUpdate:value": ($event) => isRef(encodeUrlSafe) ? encodeUrlSafe.value = $event : null
                    }, null, 8, ["value", "onUpdate:value"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_c_input_text, {
              value: unref(textInput),
              "onUpdate:value": ($event) => isRef(textInput) ? textInput.value = $event : null,
              multiline: "",
              placeholder: "Put your string here...",
              rows: "5",
              label: "String to encode",
              "raw-text": "",
              "mb-5": ""
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_c_input_text, {
              label: "Base64 of string",
              value: unref(base64Output),
              multiline: "",
              readonly: "",
              placeholder: "The base64 encoding of your string will be here",
              rows: "5",
              "mb-5": ""
            }, null, _parent2, _scopeId));
            _push2(`<div flex justify-center${_scopeId}>`);
            _push2(ssrRenderComponent(_component_c_button, {
              onClick: ($event) => unref(copyTextBase64)()
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Copy base64 `);
                } else {
                  return [
                    createTextVNode(" Copy base64 ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode(_component_n_form_item, {
                label: "Encode URL safe",
                "label-placement": "left"
              }, {
                default: withCtx(() => [
                  createVNode(_component_n_switch, {
                    value: unref(encodeUrlSafe),
                    "onUpdate:value": ($event) => isRef(encodeUrlSafe) ? encodeUrlSafe.value = $event : null
                  }, null, 8, ["value", "onUpdate:value"])
                ]),
                _: 1
              }),
              createVNode(_component_c_input_text, {
                value: unref(textInput),
                "onUpdate:value": ($event) => isRef(textInput) ? textInput.value = $event : null,
                multiline: "",
                placeholder: "Put your string here...",
                rows: "5",
                label: "String to encode",
                "raw-text": "",
                "mb-5": ""
              }, null, 8, ["value", "onUpdate:value"]),
              createVNode(_component_c_input_text, {
                label: "Base64 of string",
                value: unref(base64Output),
                multiline: "",
                readonly: "",
                placeholder: "The base64 encoding of your string will be here",
                rows: "5",
                "mb-5": ""
              }, null, 8, ["value"]),
              createVNode("div", {
                flex: "",
                "justify-center": ""
              }, [
                createVNode(_component_c_button, {
                  onClick: ($event) => unref(copyTextBase64)()
                }, {
                  default: withCtx(() => [
                    createTextVNode(" Copy base64 ")
                  ]),
                  _: 1
                }, 8, ["onClick"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_c_card, { title: "Base64 to string" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_n_form_item, {
              label: "Decode URL safe",
              "label-placement": "left"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_n_switch, {
                    value: unref(decodeUrlSafe),
                    "onUpdate:value": ($event) => isRef(decodeUrlSafe) ? decodeUrlSafe.value = $event : null
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_n_switch, {
                      value: unref(decodeUrlSafe),
                      "onUpdate:value": ($event) => isRef(decodeUrlSafe) ? decodeUrlSafe.value = $event : null
                    }, null, 8, ["value", "onUpdate:value"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_c_input_text, {
              value: unref(base64Input),
              "onUpdate:value": ($event) => isRef(base64Input) ? base64Input.value = $event : null,
              multiline: "",
              placeholder: "Your base64 string...",
              rows: "5",
              "validation-rules": b64ValidationRules,
              "validation-watch": b64ValidationWatch,
              label: "Base64 string to decode",
              "mb-5": ""
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_c_input_text, {
              value: unref(textOutput),
              "onUpdate:value": ($event) => isRef(textOutput) ? textOutput.value = $event : null,
              label: "Decoded string",
              placeholder: "The decoded string will be here",
              multiline: "",
              rows: "5",
              readonly: "",
              "mb-5": ""
            }, null, _parent2, _scopeId));
            _push2(`<div flex justify-center${_scopeId}>`);
            _push2(ssrRenderComponent(_component_c_button, {
              onClick: ($event) => unref(copyText)()
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Copy decoded string `);
                } else {
                  return [
                    createTextVNode(" Copy decoded string ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode(_component_n_form_item, {
                label: "Decode URL safe",
                "label-placement": "left"
              }, {
                default: withCtx(() => [
                  createVNode(_component_n_switch, {
                    value: unref(decodeUrlSafe),
                    "onUpdate:value": ($event) => isRef(decodeUrlSafe) ? decodeUrlSafe.value = $event : null
                  }, null, 8, ["value", "onUpdate:value"])
                ]),
                _: 1
              }),
              createVNode(_component_c_input_text, {
                value: unref(base64Input),
                "onUpdate:value": ($event) => isRef(base64Input) ? base64Input.value = $event : null,
                multiline: "",
                placeholder: "Your base64 string...",
                rows: "5",
                "validation-rules": b64ValidationRules,
                "validation-watch": b64ValidationWatch,
                label: "Base64 string to decode",
                "mb-5": ""
              }, null, 8, ["value", "onUpdate:value"]),
              createVNode(_component_c_input_text, {
                value: unref(textOutput),
                "onUpdate:value": ($event) => isRef(textOutput) ? textOutput.value = $event : null,
                label: "Decoded string",
                placeholder: "The decoded string will be here",
                multiline: "",
                rows: "5",
                readonly: "",
                "mb-5": ""
              }, null, 8, ["value", "onUpdate:value"]),
              createVNode("div", {
                flex: "",
                "justify-center": ""
              }, [
                createVNode(_component_c_button, {
                  onClick: ($event) => unref(copyText)()
                }, {
                  default: withCtx(() => [
                    createTextVNode(" Copy decoded string ")
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/tools/base64-string-converter/base64-string-converter.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
