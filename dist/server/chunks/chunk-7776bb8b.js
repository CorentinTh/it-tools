import { _ as __unplugin_components_3$1 } from './chunk-28375bc9.js';
import { _ as __unplugin_components_0 } from './chunk-89a4876c.js';
import { _ as __unplugin_components_3 } from './chunk-4e7a6a8d.js';
import { a as __unplugin_components_1 } from './chunk-8109fd17.js';
import { ref, watchEffect, defineComponent, computed, withCtx, unref, isRef, createVNode, createTextVNode, toDisplayString, openBlock, createBlock, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { AES, TripleDES, Rabbit, RC4, enc } from 'crypto-js';
import './chunk-6003391e.js';
import '@vueuse/core';
import 'pinia';
import './chunk-bb5bb4f6.js';
import './chunk-2ce6ed5e.js';
import 'fuse.js';
import './chunk-11f44f81.js';
import './chunk-35c3d701.js';
import 'lodash';

function computedCatch(getter, { defaultValue, defaultErrorMessage = "Unknown error" } = {}) {
  const error = ref();
  const value = ref();
  watchEffect(() => {
    try {
      error.value = void 0;
      value.value = getter();
    } catch (err) {
      error.value = err instanceof Error ? err.message : err?.toString() ?? defaultErrorMessage;
      value.value = defaultValue;
    }
  });
  return [value, error];
}

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "encryption",
  __ssrInlineRender: true,
  setup(__props) {
    const algos = { AES, TripleDES, Rabbit, RC4 };
    const cypherInput = ref("Lorem ipsum dolor sit amet");
    const cypherAlgo = ref("AES");
    const cypherSecret = ref("my secret key");
    const cypherOutput = computed(() => algos[cypherAlgo.value].encrypt(cypherInput.value, cypherSecret.value).toString());
    const decryptInput = ref("U2FsdGVkX1/EC3+6P5dbbkZ3e1kQ5o2yzuU0NHTjmrKnLBEwreV489Kr0DIB+uBs");
    const decryptAlgo = ref("AES");
    const decryptSecret = ref("my secret key");
    const [decryptOutput, decryptError] = computedCatch(() => algos[decryptAlgo.value].decrypt(decryptInput.value, decryptSecret.value).toString(enc.Utf8), {
      defaultValue: "",
      defaultErrorMessage: "Unable to decrypt your text"
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_c_card = __unplugin_components_1;
      const _component_c_input_text = __unplugin_components_3;
      const _component_c_select = __unplugin_components_0;
      const _component_c_alert = __unplugin_components_3$1;
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_c_card, { title: "Encrypt" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div flex gap-3${_scopeId}>`);
            _push2(ssrRenderComponent(_component_c_input_text, {
              value: unref(cypherInput),
              "onUpdate:value": ($event) => isRef(cypherInput) ? cypherInput.value = $event : null,
              label: "Your text:",
              placeholder: "The string to cypher",
              rows: "4",
              multiline: "",
              "raw-text": "",
              monospace: "",
              autosize: "",
              "flex-1": ""
            }, null, _parent2, _scopeId));
            _push2(`<div flex flex-1 flex-col gap-2${_scopeId}>`);
            _push2(ssrRenderComponent(_component_c_input_text, {
              value: unref(cypherSecret),
              "onUpdate:value": ($event) => isRef(cypherSecret) ? cypherSecret.value = $event : null,
              label: "Your secret key:",
              clearable: "",
              "raw-text": ""
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_c_select, {
              value: unref(cypherAlgo),
              "onUpdate:value": ($event) => isRef(cypherAlgo) ? cypherAlgo.value = $event : null,
              label: "Encryption algorithm:",
              options: Object.keys(algos).map((label) => ({ label, value: label }))
            }, null, _parent2, _scopeId));
            _push2(`</div></div>`);
            _push2(ssrRenderComponent(_component_c_input_text, {
              label: "Your text encrypted:",
              value: unref(cypherOutput),
              rows: "3",
              placeholder: "Your string hash",
              multiline: "",
              monospace: "",
              readonly: "",
              autosize: "",
              "mt-5": ""
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode("div", {
                flex: "",
                "gap-3": ""
              }, [
                createVNode(_component_c_input_text, {
                  value: unref(cypherInput),
                  "onUpdate:value": ($event) => isRef(cypherInput) ? cypherInput.value = $event : null,
                  label: "Your text:",
                  placeholder: "The string to cypher",
                  rows: "4",
                  multiline: "",
                  "raw-text": "",
                  monospace: "",
                  autosize: "",
                  "flex-1": ""
                }, null, 8, ["value", "onUpdate:value"]),
                createVNode("div", {
                  flex: "",
                  "flex-1": "",
                  "flex-col": "",
                  "gap-2": ""
                }, [
                  createVNode(_component_c_input_text, {
                    value: unref(cypherSecret),
                    "onUpdate:value": ($event) => isRef(cypherSecret) ? cypherSecret.value = $event : null,
                    label: "Your secret key:",
                    clearable: "",
                    "raw-text": ""
                  }, null, 8, ["value", "onUpdate:value"]),
                  createVNode(_component_c_select, {
                    value: unref(cypherAlgo),
                    "onUpdate:value": ($event) => isRef(cypherAlgo) ? cypherAlgo.value = $event : null,
                    label: "Encryption algorithm:",
                    options: Object.keys(algos).map((label) => ({ label, value: label }))
                  }, null, 8, ["value", "onUpdate:value", "options"])
                ])
              ]),
              createVNode(_component_c_input_text, {
                label: "Your text encrypted:",
                value: unref(cypherOutput),
                rows: "3",
                placeholder: "Your string hash",
                multiline: "",
                monospace: "",
                readonly: "",
                autosize: "",
                "mt-5": ""
              }, null, 8, ["value"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_c_card, { title: "Decrypt" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div flex gap-3${_scopeId}>`);
            _push2(ssrRenderComponent(_component_c_input_text, {
              value: unref(decryptInput),
              "onUpdate:value": ($event) => isRef(decryptInput) ? decryptInput.value = $event : null,
              label: "Your encrypted text:",
              placeholder: "The string to cypher",
              rows: "4",
              multiline: "",
              "raw-text": "",
              monospace: "",
              autosize: "",
              "flex-1": ""
            }, null, _parent2, _scopeId));
            _push2(`<div flex flex-1 flex-col gap-2${_scopeId}>`);
            _push2(ssrRenderComponent(_component_c_input_text, {
              value: unref(decryptSecret),
              "onUpdate:value": ($event) => isRef(decryptSecret) ? decryptSecret.value = $event : null,
              label: "Your secret key:",
              clearable: "",
              "raw-text": ""
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_c_select, {
              value: unref(decryptAlgo),
              "onUpdate:value": ($event) => isRef(decryptAlgo) ? decryptAlgo.value = $event : null,
              label: "Encryption algorithm:",
              options: Object.keys(algos).map((label) => ({ label, value: label }))
            }, null, _parent2, _scopeId));
            _push2(`</div></div>`);
            if (unref(decryptError)) {
              _push2(ssrRenderComponent(_component_c_alert, {
                type: "error",
                "mt-12": "",
                title: "Error while decrypting"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(unref(decryptError))}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(unref(decryptError)), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(ssrRenderComponent(_component_c_input_text, {
                label: "Your decrypted text:",
                value: unref(decryptOutput),
                placeholder: "Your string hash",
                rows: "3",
                multiline: "",
                monospace: "",
                readonly: "",
                autosize: "",
                "mt-5": ""
              }, null, _parent2, _scopeId));
            }
          } else {
            return [
              createVNode("div", {
                flex: "",
                "gap-3": ""
              }, [
                createVNode(_component_c_input_text, {
                  value: unref(decryptInput),
                  "onUpdate:value": ($event) => isRef(decryptInput) ? decryptInput.value = $event : null,
                  label: "Your encrypted text:",
                  placeholder: "The string to cypher",
                  rows: "4",
                  multiline: "",
                  "raw-text": "",
                  monospace: "",
                  autosize: "",
                  "flex-1": ""
                }, null, 8, ["value", "onUpdate:value"]),
                createVNode("div", {
                  flex: "",
                  "flex-1": "",
                  "flex-col": "",
                  "gap-2": ""
                }, [
                  createVNode(_component_c_input_text, {
                    value: unref(decryptSecret),
                    "onUpdate:value": ($event) => isRef(decryptSecret) ? decryptSecret.value = $event : null,
                    label: "Your secret key:",
                    clearable: "",
                    "raw-text": ""
                  }, null, 8, ["value", "onUpdate:value"]),
                  createVNode(_component_c_select, {
                    value: unref(decryptAlgo),
                    "onUpdate:value": ($event) => isRef(decryptAlgo) ? decryptAlgo.value = $event : null,
                    label: "Encryption algorithm:",
                    options: Object.keys(algos).map((label) => ({ label, value: label }))
                  }, null, 8, ["value", "onUpdate:value", "options"])
                ])
              ]),
              unref(decryptError) ? (openBlock(), createBlock(_component_c_alert, {
                key: 0,
                type: "error",
                "mt-12": "",
                title: "Error while decrypting"
              }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(unref(decryptError)), 1)
                ]),
                _: 1
              })) : (openBlock(), createBlock(_component_c_input_text, {
                key: 1,
                label: "Your decrypted text:",
                value: unref(decryptOutput),
                placeholder: "Your string hash",
                rows: "3",
                multiline: "",
                monospace: "",
                readonly: "",
                autosize: "",
                "mt-5": ""
              }, null, 8, ["value"]))
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/tools/encryption/encryption.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
