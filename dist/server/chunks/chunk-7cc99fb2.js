import { NDivider, NInputGroup, NInputGroupLabel } from 'naive-ui';
import { _ as __unplugin_components_0 } from './chunk-89a4876c.js';
import { _ as __unplugin_components_3 } from './chunk-4e7a6a8d.js';
import { a as __unplugin_components_1 } from './chunk-8109fd17.js';
import { defineComponent, ref, withCtx, unref, isRef, createTextVNode, toDisplayString, createVNode, openBlock, createBlock, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderStyle, ssrInterpolate } from 'vue/server-renderer';
import { MD5, SHA1, SHA256, SHA224, SHA512, SHA384, SHA3, RIPEMD160, enc } from 'crypto-js';
import { _ as _sfc_main$1 } from './chunk-de61ec1c.js';
import { c as convertHexToBin } from './chunk-915ca1f7.js';
import { u as useQueryParam } from './chunk-bc09e76f.js';
import './chunk-6003391e.js';
import '@vueuse/core';
import 'pinia';
import './chunk-bb5bb4f6.js';
import './chunk-2ce6ed5e.js';
import 'fuse.js';
import './chunk-11f44f81.js';
import './chunk-35c3d701.js';
import 'lodash';
import './chunk-95ec8cf7.js';
import './chunk-77c5cc16.js';
import '@vueuse/router';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "hash-text",
  __ssrInlineRender: true,
  setup(__props) {
    const algos = {
      MD5,
      SHA1,
      SHA256,
      SHA224,
      SHA512,
      SHA384,
      SHA3,
      RIPEMD160
    };
    const algoNames = Object.keys(algos);
    const encoding = useQueryParam({ defaultValue: "Hex", name: "encoding" });
    const clearText = ref("");
    function formatWithEncoding(words, encoding2) {
      if (encoding2 === "Bin") {
        return convertHexToBin(words.toString(enc.Hex));
      }
      return words.toString(enc[encoding2]);
    }
    const hashText = (algo, value) => formatWithEncoding(algos[algo](value), encoding.value);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_c_card = __unplugin_components_1;
      const _component_c_input_text = __unplugin_components_3;
      const _component_n_divider = NDivider;
      const _component_c_select = __unplugin_components_0;
      const _component_n_input_group = NInputGroup;
      const _component_n_input_group_label = NInputGroupLabel;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_c_card, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_c_input_text, {
              value: unref(clearText),
              "onUpdate:value": ($event) => isRef(clearText) ? clearText.value = $event : null,
              multiline: "",
              "raw-text": "",
              placeholder: "Your string to hash...",
              rows: "3",
              autosize: "",
              autofocus: "",
              label: "Your text to hash:"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_n_divider, null, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_c_select, {
              value: unref(encoding),
              "onUpdate:value": ($event) => isRef(encoding) ? encoding.value = $event : null,
              "mb-4": "",
              label: "Digest encoding",
              options: [
                {
                  label: "Binary (base 2)",
                  value: "Bin"
                },
                {
                  label: "Hexadecimal (base 16)",
                  value: "Hex"
                },
                {
                  label: "Base64 (base 64)",
                  value: "Base64"
                },
                {
                  label: "Base64url (base 64 with url safe chars)",
                  value: "Base64url"
                }
              ]
            }, null, _parent2, _scopeId));
            _push2(`<!--[-->`);
            ssrRenderList(unref(algoNames), (algo) => {
              _push2(`<div style="${ssrRenderStyle({ "margin": "5px 0" })}"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_n_input_group, null, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_n_input_group_label, { style: { "flex": "0 0 120px" } }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${ssrInterpolate(algo)}`);
                        } else {
                          return [
                            createTextVNode(toDisplayString(algo), 1)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_sfc_main$1, {
                      value: hashText(algo, unref(clearText)),
                      readonly: ""
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_n_input_group_label, { style: { "flex": "0 0 120px" } }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(algo), 1)
                        ]),
                        _: 2
                      }, 1024),
                      createVNode(_sfc_main$1, {
                        value: hashText(algo, unref(clearText)),
                        readonly: ""
                      }, null, 8, ["value"])
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(`</div>`);
            });
            _push2(`<!--]-->`);
          } else {
            return [
              createVNode(_component_c_input_text, {
                value: unref(clearText),
                "onUpdate:value": ($event) => isRef(clearText) ? clearText.value = $event : null,
                multiline: "",
                "raw-text": "",
                placeholder: "Your string to hash...",
                rows: "3",
                autosize: "",
                autofocus: "",
                label: "Your text to hash:"
              }, null, 8, ["value", "onUpdate:value"]),
              createVNode(_component_n_divider),
              createVNode(_component_c_select, {
                value: unref(encoding),
                "onUpdate:value": ($event) => isRef(encoding) ? encoding.value = $event : null,
                "mb-4": "",
                label: "Digest encoding",
                options: [
                  {
                    label: "Binary (base 2)",
                    value: "Bin"
                  },
                  {
                    label: "Hexadecimal (base 16)",
                    value: "Hex"
                  },
                  {
                    label: "Base64 (base 64)",
                    value: "Base64"
                  },
                  {
                    label: "Base64url (base 64 with url safe chars)",
                    value: "Base64url"
                  }
                ]
              }, null, 8, ["value", "onUpdate:value", "options"]),
              (openBlock(true), createBlock(Fragment, null, renderList(unref(algoNames), (algo) => {
                return openBlock(), createBlock("div", {
                  key: algo,
                  style: { "margin": "5px 0" }
                }, [
                  createVNode(_component_n_input_group, null, {
                    default: withCtx(() => [
                      createVNode(_component_n_input_group_label, { style: { "flex": "0 0 120px" } }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(algo), 1)
                        ]),
                        _: 2
                      }, 1024),
                      createVNode(_sfc_main$1, {
                        value: hashText(algo, unref(clearText)),
                        readonly: ""
                      }, null, 8, ["value"])
                    ]),
                    _: 2
                  }, 1024)
                ]);
              }), 128))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/tools/hash-text/hash-text.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
