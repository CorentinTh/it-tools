import { _ as __unplugin_components_3 } from './chunk-4e7a6a8d.js';
import { a as __unplugin_components_0, _ as _export_sfc } from './chunk-6003391e.js';
import { NFormItem, NInputNumber } from 'naive-ui';
import { a as __unplugin_components_1 } from './chunk-8109fd17.js';
import { defineComponent, ref, computed, withCtx, unref, isRef, createVNode, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { u as useCopy } from './chunk-77c5cc16.js';
import { u as useValidation } from './chunk-35c3d701.js';
import './chunk-11f44f81.js';
import '@vueuse/core';
import 'pinia';
import 'lodash';

const MIN_ARABIC_TO_ROMAN = 1;
const MAX_ARABIC_TO_ROMAN = 3999;
function arabicToRoman(num) {
  if (num < MIN_ARABIC_TO_ROMAN || num > MAX_ARABIC_TO_ROMAN) {
    return "";
  }
  const lookup = {
    M: 1e3,
    CM: 900,
    D: 500,
    CD: 400,
    C: 100,
    XC: 90,
    L: 50,
    XL: 40,
    X: 10,
    IX: 9,
    V: 5,
    IV: 4,
    I: 1
  };
  let roman = "";
  for (const i in lookup) {
    while (num >= lookup[i]) {
      roman += i;
      num -= lookup[i];
    }
  }
  return roman;
}
const ROMAN_NUMBER_REGEX = /^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/;
function isValidRomanNumber(romanNumber) {
  return ROMAN_NUMBER_REGEX.test(romanNumber);
}
function romanToArabic(s) {
  if (!isValidRomanNumber(s)) {
    return null;
  }
  const map = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1e3 };
  return [...s].reduce((r, c, i, s2) => map[s2[i + 1]] > map[c] ? r - map[c] : r + map[c], 0);
}

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "roman-numeral-converter",
  __ssrInlineRender: true,
  setup(__props) {
    const inputNumeral = ref(42);
    const outputRoman = computed(() => arabicToRoman(inputNumeral.value));
    const { attrs: validationNumeral } = useValidation({
      source: inputNumeral,
      rules: [
        {
          validator: (value) => value >= MIN_ARABIC_TO_ROMAN && value <= MAX_ARABIC_TO_ROMAN,
          message: `We can only convert numbers between ${MIN_ARABIC_TO_ROMAN.toLocaleString()} and ${MAX_ARABIC_TO_ROMAN.toLocaleString()}`
        }
      ]
    });
    const inputRoman = ref("XLII");
    const outputNumeral = computed(() => romanToArabic(inputRoman.value));
    const validationRoman = useValidation({
      source: inputRoman,
      rules: [
        {
          validator: (value) => isValidRomanNumber(value),
          message: "The input you entered is not a valid roman number"
        }
      ]
    });
    const { copy: copyRoman } = useCopy({ source: outputRoman, text: "Roman number copied to the clipboard" });
    const { copy: copyArabic } = useCopy({ source: () => String(outputNumeral), text: "Arabic number copied to the clipboard" });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_c_card = __unplugin_components_1;
      const _component_n_form_item = NFormItem;
      const _component_n_input_number = NInputNumber;
      const _component_c_button = __unplugin_components_0;
      const _component_c_input_text = __unplugin_components_3;
      _push(`<div${ssrRenderAttrs(_attrs)} data-v-b1e0d482>`);
      _push(ssrRenderComponent(_component_c_card, { title: "Arabic to roman" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div flex items-center justify-between data-v-b1e0d482${_scopeId}>`);
            _push2(ssrRenderComponent(_component_n_form_item, unref(validationNumeral), {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_n_input_number, {
                    value: unref(inputNumeral),
                    "onUpdate:value": ($event) => isRef(inputNumeral) ? inputNumeral.value = $event : null,
                    min: 1,
                    style: { "width": "200px" },
                    "show-button": false
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_n_input_number, {
                      value: unref(inputNumeral),
                      "onUpdate:value": ($event) => isRef(inputNumeral) ? inputNumeral.value = $event : null,
                      min: 1,
                      style: { "width": "200px" },
                      "show-button": false
                    }, null, 8, ["value", "onUpdate:value"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<div class="result" data-v-b1e0d482${_scopeId}>${ssrInterpolate(unref(outputRoman))}</div>`);
            _push2(ssrRenderComponent(_component_c_button, {
              autofocus: "",
              disabled: unref(validationNumeral).validationStatus === "error",
              onClick: ($event) => unref(copyRoman)()
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
              createVNode("div", {
                flex: "",
                "items-center": "",
                "justify-between": ""
              }, [
                createVNode(_component_n_form_item, unref(validationNumeral), {
                  default: withCtx(() => [
                    createVNode(_component_n_input_number, {
                      value: unref(inputNumeral),
                      "onUpdate:value": ($event) => isRef(inputNumeral) ? inputNumeral.value = $event : null,
                      min: 1,
                      style: { "width": "200px" },
                      "show-button": false
                    }, null, 8, ["value", "onUpdate:value"])
                  ]),
                  _: 1
                }, 16),
                createVNode("div", { class: "result" }, toDisplayString(unref(outputRoman)), 1),
                createVNode(_component_c_button, {
                  autofocus: "",
                  disabled: unref(validationNumeral).validationStatus === "error",
                  onClick: ($event) => unref(copyRoman)()
                }, {
                  default: withCtx(() => [
                    createTextVNode(" Copy ")
                  ]),
                  _: 1
                }, 8, ["disabled", "onClick"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_c_card, {
        title: "Roman to arabic",
        "mt-5": ""
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div flex items-center justify-between data-v-b1e0d482${_scopeId}>`);
            _push2(ssrRenderComponent(_component_c_input_text, {
              value: unref(inputRoman),
              "onUpdate:value": ($event) => isRef(inputRoman) ? inputRoman.value = $event : null,
              style: { "width": "200px" },
              validation: unref(validationRoman)
            }, null, _parent2, _scopeId));
            _push2(`<div class="result" data-v-b1e0d482${_scopeId}>${ssrInterpolate(unref(outputNumeral))}</div>`);
            _push2(ssrRenderComponent(_component_c_button, {
              disabled: !unref(validationRoman).isValid,
              onClick: ($event) => unref(copyArabic)()
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
              createVNode("div", {
                flex: "",
                "items-center": "",
                "justify-between": ""
              }, [
                createVNode(_component_c_input_text, {
                  value: unref(inputRoman),
                  "onUpdate:value": ($event) => isRef(inputRoman) ? inputRoman.value = $event : null,
                  style: { "width": "200px" },
                  validation: unref(validationRoman)
                }, null, 8, ["value", "onUpdate:value", "validation"]),
                createVNode("div", { class: "result" }, toDisplayString(unref(outputNumeral)), 1),
                createVNode(_component_c_button, {
                  disabled: !unref(validationRoman).isValid,
                  onClick: ($event) => unref(copyArabic)()
                }, {
                  default: withCtx(() => [
                    createTextVNode(" Copy ")
                  ]),
                  _: 1
                }, 8, ["disabled", "onClick"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});

/* unplugin-vue-components disabled */const romanNumeralConverter_vue_vue_type_style_index_0_scoped_b1e0d482_lang = '';

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/tools/roman-numeral-converter/roman-numeral-converter.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const romanNumeralConverter = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-b1e0d482"]]);

export { romanNumeralConverter as default };
