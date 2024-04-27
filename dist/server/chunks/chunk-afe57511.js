import { a as __unplugin_components_0 } from './chunk-6003391e.js';
import { _ as __unplugin_components_3 } from './chunk-4e7a6a8d.js';
import { a as __unplugin_components_1 } from './chunk-8109fd17.js';
import { defineComponent, ref, computed, withCtx, unref, isRef, createTextVNode, createVNode, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import { u as useCopy } from './chunk-77c5cc16.js';
import '@vueuse/core';
import 'pinia';
import './chunk-11f44f81.js';
import './chunk-35c3d701.js';
import 'lodash';
import 'naive-ui';

function convertTextToUnicode(text) {
  return text.split("").map((value) => `&#${value.charCodeAt(0)};`).join("");
}
function convertUnicodeToText(unicodeStr) {
  return unicodeStr.replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec));
}

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "text-to-unicode",
  __ssrInlineRender: true,
  setup(__props) {
    const inputText = ref("");
    const unicodeFromText = computed(() => inputText.value.trim() === "" ? "" : convertTextToUnicode(inputText.value));
    const { copy: copyUnicode } = useCopy({ source: unicodeFromText });
    const inputUnicode = ref("");
    const textFromUnicode = computed(() => inputUnicode.value.trim() === "" ? "" : convertUnicodeToText(inputUnicode.value));
    const { copy: copyText } = useCopy({ source: textFromUnicode });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_c_card = __unplugin_components_1;
      const _component_c_input_text = __unplugin_components_3;
      const _component_c_button = __unplugin_components_0;
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_c_card, { title: "Text to Unicode" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_c_input_text, {
              value: unref(inputText),
              "onUpdate:value": ($event) => isRef(inputText) ? inputText.value = $event : null,
              multiline: "",
              placeholder: "e.g. 'Hello Avengers'",
              label: "Enter text to convert to unicode",
              autosize: "",
              autofocus: "",
              "raw-text": "",
              "test-id": "text-to-unicode-input"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_c_input_text, {
              value: unref(unicodeFromText),
              "onUpdate:value": ($event) => isRef(unicodeFromText) ? unicodeFromText.value = $event : null,
              label: "Unicode from your text",
              multiline: "",
              "raw-text": "",
              readonly: "",
              "mt-2": "",
              placeholder: "The unicode representation of your text will be here",
              "test-id": "text-to-unicode-output"
            }, null, _parent2, _scopeId));
            _push2(`<div mt-2 flex justify-center${_scopeId}>`);
            _push2(ssrRenderComponent(_component_c_button, {
              disabled: !unref(unicodeFromText),
              onClick: ($event) => unref(copyUnicode)()
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Copy unicode to clipboard `);
                } else {
                  return [
                    createTextVNode(" Copy unicode to clipboard ")
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
                placeholder: "e.g. 'Hello Avengers'",
                label: "Enter text to convert to unicode",
                autosize: "",
                autofocus: "",
                "raw-text": "",
                "test-id": "text-to-unicode-input"
              }, null, 8, ["value", "onUpdate:value"]),
              createVNode(_component_c_input_text, {
                value: unref(unicodeFromText),
                "onUpdate:value": ($event) => isRef(unicodeFromText) ? unicodeFromText.value = $event : null,
                label: "Unicode from your text",
                multiline: "",
                "raw-text": "",
                readonly: "",
                "mt-2": "",
                placeholder: "The unicode representation of your text will be here",
                "test-id": "text-to-unicode-output"
              }, null, 8, ["value", "onUpdate:value"]),
              createVNode("div", {
                "mt-2": "",
                flex: "",
                "justify-center": ""
              }, [
                createVNode(_component_c_button, {
                  disabled: !unref(unicodeFromText),
                  onClick: ($event) => unref(copyUnicode)()
                }, {
                  default: withCtx(() => [
                    createTextVNode(" Copy unicode to clipboard ")
                  ]),
                  _: 1
                }, 8, ["disabled", "onClick"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_c_card, { title: "Unicode to Text" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_c_input_text, {
              value: unref(inputUnicode),
              "onUpdate:value": ($event) => isRef(inputUnicode) ? inputUnicode.value = $event : null,
              multiline: "",
              placeholder: "Input Unicode",
              label: "Enter unicode to convert to text",
              autosize: "",
              "raw-text": "",
              "test-id": "unicode-to-text-input"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_c_input_text, {
              value: unref(textFromUnicode),
              "onUpdate:value": ($event) => isRef(textFromUnicode) ? textFromUnicode.value = $event : null,
              label: "Text from your Unicode",
              multiline: "",
              "raw-text": "",
              readonly: "",
              "mt-2": "",
              placeholder: "The text representation of your unicode will be here",
              "test-id": "unicode-to-text-output"
            }, null, _parent2, _scopeId));
            _push2(`<div mt-2 flex justify-center${_scopeId}>`);
            _push2(ssrRenderComponent(_component_c_button, {
              disabled: !unref(textFromUnicode),
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
                value: unref(inputUnicode),
                "onUpdate:value": ($event) => isRef(inputUnicode) ? inputUnicode.value = $event : null,
                multiline: "",
                placeholder: "Input Unicode",
                label: "Enter unicode to convert to text",
                autosize: "",
                "raw-text": "",
                "test-id": "unicode-to-text-input"
              }, null, 8, ["value", "onUpdate:value"]),
              createVNode(_component_c_input_text, {
                value: unref(textFromUnicode),
                "onUpdate:value": ($event) => isRef(textFromUnicode) ? textFromUnicode.value = $event : null,
                label: "Text from your Unicode",
                multiline: "",
                "raw-text": "",
                readonly: "",
                "mt-2": "",
                placeholder: "The text representation of your unicode will be here",
                "test-id": "unicode-to-text-output"
              }, null, 8, ["value", "onUpdate:value"]),
              createVNode("div", {
                "mt-2": "",
                flex: "",
                "justify-center": ""
              }, [
                createVNode(_component_c_button, {
                  disabled: !unref(textFromUnicode),
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/tools/text-to-unicode/text-to-unicode.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
