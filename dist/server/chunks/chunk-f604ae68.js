import { _ as _sfc_main$1 } from './chunk-588e4d58.js';
import { NTable } from 'naive-ui';
import { _ as __unplugin_components_3 } from './chunk-4e7a6a8d.js';
import { _ as __unplugin_components_0 } from './chunk-89a4876c.js';
import { defineComponent, ref, computed, unref, isRef, withCtx, createVNode, openBlock, createBlock, Fragment, renderList, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { getCountries, getCountryCallingCode, parsePhoneNumber } from 'libphonenumber-js/max';
import lookup from 'country-code-lookup';
import { w as withDefaultOnError } from './chunk-f1b4cc24.js';
import { b as booleanToHumanReadable } from './chunk-5697d061.js';
import { u as useValidation } from './chunk-35c3d701.js';
import './chunk-8109fd17.js';
import './chunk-6003391e.js';
import '@vueuse/core';
import 'pinia';
import './chunk-77c5cc16.js';
import './chunk-11f44f81.js';
import './chunk-bb5bb4f6.js';
import './chunk-2ce6ed5e.js';
import 'fuse.js';
import 'lodash';

const typeToLabel = {
  MOBILE: "Mobile",
  FIXED_LINE: "Fixed line",
  FIXED_LINE_OR_MOBILE: "Fixed line or mobile",
  PERSONAL_NUMBER: "Personal number",
  PREMIUM_RATE: "Premium rate",
  SHARED_COST: "Shared cost",
  TOLL_FREE: "Toll free",
  UAN: "Universal access number",
  VOICEMAIL: "Voicemail",
  VOIP: "VoIP",
  PAGER: "Pager"
};
function formatTypeToHumanReadable(type) {
  if (!type) {
    return void 0;
  }
  return typeToLabel[type];
}
function getFullCountryName(countryCode) {
  if (!countryCode) {
    return void 0;
  }
  return lookup.byIso(countryCode)?.country;
}
function getDefaultCountryCode({
  locale = window.navigator.language,
  defaultCode = "FR"
} = {}) {
  const countryCode = locale.split("-")[1]?.toUpperCase();
  if (!countryCode) {
    return defaultCode;
  }
  return lookup.byIso(countryCode)?.iso2 ?? defaultCode;
}

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "phone-parser-and-formatter",
  __ssrInlineRender: true,
  setup(__props) {
    const rawPhone = ref("");
    const defaultCountryCode = ref(getDefaultCountryCode());
    const validation = useValidation({
      source: rawPhone,
      rules: [
        {
          validator: (value) => value === "" || /^[0-9 +\-()]+$/.test(value),
          message: "Invalid phone number"
        }
      ]
    });
    const parsedDetails = computed(() => {
      if (!validation.isValid) {
        return void 0;
      }
      const parsed = withDefaultOnError(() => parsePhoneNumber(rawPhone.value, defaultCountryCode.value), void 0);
      if (!parsed) {
        return void 0;
      }
      return [
        {
          label: "Country",
          value: parsed.country
        },
        {
          label: "Country",
          value: getFullCountryName(parsed.country)
        },
        {
          label: "Country calling code",
          value: parsed.countryCallingCode
        },
        {
          label: "Is valid?",
          value: booleanToHumanReadable(parsed.isValid())
        },
        {
          label: "Is possible?",
          value: booleanToHumanReadable(parsed.isPossible())
        },
        {
          label: "Type",
          value: formatTypeToHumanReadable(parsed.getType())
        },
        {
          label: "International format",
          value: parsed.formatInternational()
        },
        {
          label: "National format",
          value: parsed.formatNational()
        },
        {
          label: "E.164 format",
          value: parsed.format("E.164")
        },
        {
          label: "RFC3966 format",
          value: parsed.format("RFC3966")
        }
      ];
    });
    const countriesOptions = getCountries().map((code) => ({
      label: `${lookup.byIso(code)?.country || code} (+${getCountryCallingCode(code)})`,
      value: code
    }));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_c_select = __unplugin_components_0;
      const _component_c_input_text = __unplugin_components_3;
      const _component_n_table = NTable;
      const _component_span_copyable = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_c_select, {
        value: unref(defaultCountryCode),
        "onUpdate:value": ($event) => isRef(defaultCountryCode) ? defaultCountryCode.value = $event : null,
        label: "Default country code:",
        options: unref(countriesOptions),
        searchable: "",
        "mb-5": ""
      }, null, _parent));
      _push(ssrRenderComponent(_component_c_input_text, {
        value: unref(rawPhone),
        "onUpdate:value": ($event) => isRef(rawPhone) ? rawPhone.value = $event : null,
        placeholder: "Enter a phone number",
        label: "Phone number:",
        validation: unref(validation),
        "mb-5": ""
      }, null, _parent));
      if (unref(parsedDetails)) {
        _push(ssrRenderComponent(_component_n_table, null, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<tbody${_scopeId}><!--[-->`);
              ssrRenderList(unref(parsedDetails), ({ label, value }) => {
                _push2(`<tr${_scopeId}><td font-bold${_scopeId}>${ssrInterpolate(label)}</td><td${_scopeId}>`);
                if (value) {
                  _push2(ssrRenderComponent(_component_span_copyable, { value }, null, _parent2, _scopeId));
                } else {
                  _push2(`<span op-70${_scopeId}> Unknown </span>`);
                }
                _push2(`</td></tr>`);
              });
              _push2(`<!--]--></tbody>`);
            } else {
              return [
                createVNode("tbody", null, [
                  (openBlock(true), createBlock(Fragment, null, renderList(unref(parsedDetails), ({ label, value }) => {
                    return openBlock(), createBlock("tr", { key: label }, [
                      createVNode("td", { "font-bold": "" }, toDisplayString(label), 1),
                      createVNode("td", null, [
                        value ? (openBlock(), createBlock(_component_span_copyable, {
                          key: 0,
                          value
                        }, null, 8, ["value"])) : (openBlock(), createBlock("span", {
                          key: 1,
                          "op-70": ""
                        }, " Unknown "))
                      ])
                    ]);
                  }), 128))
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/tools/phone-parser-and-formatter/phone-parser-and-formatter.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
