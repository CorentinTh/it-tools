import { a as __unplugin_components_0 } from './chunk-6003391e.js';
import { _ as __unplugin_components_3 } from './chunk-4e7a6a8d.js';
import { a as __unplugin_components_1 } from './chunk-8109fd17.js';
import { defineComponent, ref, computed, withCtx, unref, isRef, createTextVNode, createVNode, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import { u as useCopy } from './chunk-77c5cc16.js';
import { u as useValidation } from './chunk-35c3d701.js';
import { i as isNotThrowing } from './chunk-5697d061.js';
import { w as withDefaultOnError } from './chunk-f1b4cc24.js';
import '@vueuse/core';
import 'pinia';
import './chunk-11f44f81.js';
import 'naive-ui';
import 'lodash';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "url-encoder",
  __ssrInlineRender: true,
  setup(__props) {
    const encodeInput = ref("Hello world :)");
    const encodeOutput = computed(() => withDefaultOnError(() => encodeURIComponent(encodeInput.value), ""));
    const encodedValidation = useValidation({
      source: encodeInput,
      rules: [
        {
          validator: (value) => isNotThrowing(() => encodeURIComponent(value)),
          message: "Impossible to parse this string"
        }
      ]
    });
    const { copy: copyEncoded } = useCopy({ source: encodeOutput, text: "Encoded string copied to the clipboard" });
    const decodeInput = ref("Hello%20world%20%3A)");
    const decodeOutput = computed(() => withDefaultOnError(() => decodeURIComponent(decodeInput.value), ""));
    const decodeValidation = useValidation({
      source: encodeInput,
      rules: [
        {
          validator: (value) => isNotThrowing(() => decodeURIComponent(value)),
          message: "Impossible to parse this string"
        }
      ]
    });
    const { copy: copyDecoded } = useCopy({ source: decodeOutput, text: "Decoded string copied to the clipboard" });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_c_card = __unplugin_components_1;
      const _component_c_input_text = __unplugin_components_3;
      const _component_c_button = __unplugin_components_0;
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_c_card, { title: "Encode" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_c_input_text, {
              value: unref(encodeInput),
              "onUpdate:value": ($event) => isRef(encodeInput) ? encodeInput.value = $event : null,
              label: "Your string :",
              validation: unref(encodedValidation),
              multiline: "",
              autosize: "",
              placeholder: "The string to encode",
              rows: "2",
              "mb-3": ""
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_c_input_text, {
              label: "Your string encoded :",
              value: unref(encodeOutput),
              multiline: "",
              autosize: "",
              readonly: "",
              placeholder: "Your string encoded",
              rows: "2",
              "mb-3": ""
            }, null, _parent2, _scopeId));
            _push2(`<div flex justify-center${_scopeId}>`);
            _push2(ssrRenderComponent(_component_c_button, {
              onClick: ($event) => unref(copyEncoded)()
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
              createVNode(_component_c_input_text, {
                value: unref(encodeInput),
                "onUpdate:value": ($event) => isRef(encodeInput) ? encodeInput.value = $event : null,
                label: "Your string :",
                validation: unref(encodedValidation),
                multiline: "",
                autosize: "",
                placeholder: "The string to encode",
                rows: "2",
                "mb-3": ""
              }, null, 8, ["value", "onUpdate:value", "validation"]),
              createVNode(_component_c_input_text, {
                label: "Your string encoded :",
                value: unref(encodeOutput),
                multiline: "",
                autosize: "",
                readonly: "",
                placeholder: "Your string encoded",
                rows: "2",
                "mb-3": ""
              }, null, 8, ["value"]),
              createVNode("div", {
                flex: "",
                "justify-center": ""
              }, [
                createVNode(_component_c_button, {
                  onClick: ($event) => unref(copyEncoded)()
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
      _push(ssrRenderComponent(_component_c_card, { title: "Decode" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_c_input_text, {
              value: unref(decodeInput),
              "onUpdate:value": ($event) => isRef(decodeInput) ? decodeInput.value = $event : null,
              label: "Your encoded string :",
              validation: unref(decodeValidation),
              multiline: "",
              autosize: "",
              placeholder: "The string to decode",
              rows: "2",
              "mb-3": ""
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_c_input_text, {
              label: "Your string decoded :",
              value: unref(decodeOutput),
              multiline: "",
              autosize: "",
              readonly: "",
              placeholder: "Your string decoded",
              rows: "2",
              "mb-3": ""
            }, null, _parent2, _scopeId));
            _push2(`<div flex justify-center${_scopeId}>`);
            _push2(ssrRenderComponent(_component_c_button, {
              onClick: ($event) => unref(copyDecoded)()
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
              createVNode(_component_c_input_text, {
                value: unref(decodeInput),
                "onUpdate:value": ($event) => isRef(decodeInput) ? decodeInput.value = $event : null,
                label: "Your encoded string :",
                validation: unref(decodeValidation),
                multiline: "",
                autosize: "",
                placeholder: "The string to decode",
                rows: "2",
                "mb-3": ""
              }, null, 8, ["value", "onUpdate:value", "validation"]),
              createVNode(_component_c_input_text, {
                label: "Your string decoded :",
                value: unref(decodeOutput),
                multiline: "",
                autosize: "",
                readonly: "",
                placeholder: "Your string decoded",
                rows: "2",
                "mb-3": ""
              }, null, 8, ["value"]),
              createVNode("div", {
                flex: "",
                "justify-center": ""
              }, [
                createVNode(_component_c_button, {
                  onClick: ($event) => unref(copyDecoded)()
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/tools/url-encoder/url-encoder.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
