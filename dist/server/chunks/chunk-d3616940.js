import { a as __unplugin_components_0 } from './chunk-6003391e.js';
import { _ as __unplugin_components_3 } from './chunk-4e7a6a8d.js';
import { a as __unplugin_components_1 } from './chunk-8109fd17.js';
import { defineComponent, ref, computed, withCtx, unref, isRef, createTextVNode, createVNode, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import { w as withDefaultOnError } from './chunk-f1b4cc24.js';
import { u as useCopy } from './chunk-77c5cc16.js';
import { i as isNotThrowing } from './chunk-5697d061.js';
import '@vueuse/core';
import 'pinia';
import './chunk-11f44f81.js';
import './chunk-35c3d701.js';
import 'lodash';
import 'naive-ui';

function convertTextToAsciiBinary(text, { separator = " " } = {}) {
  return text.split("").map((char) => char.charCodeAt(0).toString(2).padStart(8, "0")).join(separator);
}
function convertAsciiBinaryToText(binary) {
  const cleanBinary = binary.replace(/[^01]/g, "");
  if (cleanBinary.length % 8) {
    throw new Error("Invalid binary string");
  }
  return cleanBinary.split(/(\d{8})/).filter(Boolean).map((binary2) => String.fromCharCode(Number.parseInt(binary2, 2))).join("");
}

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "text-to-binary",
  __ssrInlineRender: true,
  setup(__props) {
    const inputText = ref("");
    const binaryFromText = computed(() => convertTextToAsciiBinary(inputText.value));
    const { copy: copyBinary } = useCopy({ source: binaryFromText });
    const inputBinary = ref("");
    const textFromBinary = computed(() => withDefaultOnError(() => convertAsciiBinaryToText(inputBinary.value), ""));
    const inputBinaryValidationRules = [
      {
        validator: (value) => isNotThrowing(() => convertAsciiBinaryToText(value)),
        message: "Binary should be a valid ASCII binary string with multiples of 8 bits"
      }
    ];
    const { copy: copyText } = useCopy({ source: textFromBinary });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_c_card = __unplugin_components_1;
      const _component_c_input_text = __unplugin_components_3;
      const _component_c_button = __unplugin_components_0;
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_c_card, { title: "Text to ASCII binary" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_c_input_text, {
              value: unref(inputText),
              "onUpdate:value": ($event) => isRef(inputText) ? inputText.value = $event : null,
              multiline: "",
              placeholder: "e.g. 'Hello world'",
              label: "Enter text to convert to binary",
              autosize: "",
              autofocus: "",
              "raw-text": "",
              "test-id": "text-to-binary-input"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_c_input_text, {
              value: unref(binaryFromText),
              "onUpdate:value": ($event) => isRef(binaryFromText) ? binaryFromText.value = $event : null,
              label: "Binary from your text",
              multiline: "",
              "raw-text": "",
              readonly: "",
              "mt-2": "",
              placeholder: "The binary representation of your text will be here",
              "test-id": "text-to-binary-output"
            }, null, _parent2, _scopeId));
            _push2(`<div mt-2 flex justify-center${_scopeId}>`);
            _push2(ssrRenderComponent(_component_c_button, {
              disabled: !unref(binaryFromText),
              onClick: ($event) => unref(copyBinary)()
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Copy binary to clipboard `);
                } else {
                  return [
                    createTextVNode(" Copy binary to clipboard ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode(_component_c_input_text, {
                value: unref(inputText),
                "onUpdate:value": ($event) => isRef(inputText) ? inputText.value = $event : null,
                multiline: "",
                placeholder: "e.g. 'Hello world'",
                label: "Enter text to convert to binary",
                autosize: "",
                autofocus: "",
                "raw-text": "",
                "test-id": "text-to-binary-input"
              }, null, 8, ["value", "onUpdate:value"]),
              createVNode(_component_c_input_text, {
                value: unref(binaryFromText),
                "onUpdate:value": ($event) => isRef(binaryFromText) ? binaryFromText.value = $event : null,
                label: "Binary from your text",
                multiline: "",
                "raw-text": "",
                readonly: "",
                "mt-2": "",
                placeholder: "The binary representation of your text will be here",
                "test-id": "text-to-binary-output"
              }, null, 8, ["value", "onUpdate:value"]),
              createVNode("div", {
                "mt-2": "",
                flex: "",
                "justify-center": ""
              }, [
                createVNode(_component_c_button, {
                  disabled: !unref(binaryFromText),
                  onClick: ($event) => unref(copyBinary)()
                }, {
                  default: withCtx(() => [
                    createTextVNode(" Copy binary to clipboard ")
                  ]),
                  _: 1
                }, 8, ["disabled", "onClick"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_c_card, { title: "ASCII binary to text" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_c_input_text, {
              value: unref(inputBinary),
              "onUpdate:value": ($event) => isRef(inputBinary) ? inputBinary.value = $event : null,
              multiline: "",
              placeholder: "e.g. '01001000 01100101 01101100 01101100 01101111'",
              label: "Enter binary to convert to text",
              autosize: "",
              "raw-text": "",
              "validation-rules": inputBinaryValidationRules,
              "test-id": "binary-to-text-input"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_c_input_text, {
              value: unref(textFromBinary),
              "onUpdate:value": ($event) => isRef(textFromBinary) ? textFromBinary.value = $event : null,
              label: "Text from your binary",
              multiline: "",
              "raw-text": "",
              readonly: "",
              "mt-2": "",
              placeholder: "The text representation of your binary will be here",
              "test-id": "binary-to-text-output"
            }, null, _parent2, _scopeId));
            _push2(`<div mt-2 flex justify-center${_scopeId}>`);
            _push2(ssrRenderComponent(_component_c_button, {
              disabled: !unref(textFromBinary),
              onClick: ($event) => unref(copyText)()
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Copy text to clipboard `);
                } else {
                  return [
                    createTextVNode(" Copy text to clipboard ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode(_component_c_input_text, {
                value: unref(inputBinary),
                "onUpdate:value": ($event) => isRef(inputBinary) ? inputBinary.value = $event : null,
                multiline: "",
                placeholder: "e.g. '01001000 01100101 01101100 01101100 01101111'",
                label: "Enter binary to convert to text",
                autosize: "",
                "raw-text": "",
                "validation-rules": inputBinaryValidationRules,
                "test-id": "binary-to-text-input"
              }, null, 8, ["value", "onUpdate:value"]),
              createVNode(_component_c_input_text, {
                value: unref(textFromBinary),
                "onUpdate:value": ($event) => isRef(textFromBinary) ? textFromBinary.value = $event : null,
                label: "Text from your binary",
                multiline: "",
                "raw-text": "",
                readonly: "",
                "mt-2": "",
                placeholder: "The text representation of your binary will be here",
                "test-id": "binary-to-text-output"
              }, null, 8, ["value", "onUpdate:value"]),
              createVNode("div", {
                "mt-2": "",
                flex: "",
                "justify-center": ""
              }, [
                createVNode(_component_c_button, {
                  disabled: !unref(textFromBinary),
                  onClick: ($event) => unref(copyText)()
                }, {
                  default: withCtx(() => [
                    createTextVNode(" Copy text to clipboard ")
                  ]),
                  _: 1
                }, 8, ["disabled", "onClick"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/tools/text-to-binary/text-to-binary.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
