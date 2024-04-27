import { _ as _sfc_main$2 } from './chunk-aff50618.js';
import { _ as _sfc_main$1 } from './chunk-ab9bd3df.js';
import { a as __unplugin_components_1 } from './chunk-8109fd17.js';
import { defineComponent, ref, computed, unref, isRef, withCtx, createVNode, openBlock, createBlock, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList } from 'vue/server-renderer';
import { _ as __unplugin_components_3 } from './chunk-4e7a6a8d.js';
import { ValidationErrorsIBAN, validateIBAN, extractIBAN, isQRIBAN, friendlyFormatIBAN } from 'ibantools';
import './chunk-95ec8cf7.js';
import './chunk-77c5cc16.js';
import '@vueuse/core';
import 'naive-ui';
import 'lodash';
import './chunk-6003391e.js';
import 'pinia';
import './chunk-11f44f81.js';
import './chunk-35c3d701.js';

const ibanErrorToMessage = {
  [ValidationErrorsIBAN.NoIBANProvided]: "No IBAN provided",
  [ValidationErrorsIBAN.NoIBANCountry]: "No IBAN country",
  [ValidationErrorsIBAN.WrongBBANLength]: "Wrong BBAN length",
  [ValidationErrorsIBAN.WrongBBANFormat]: "Wrong BBAN format",
  [ValidationErrorsIBAN.ChecksumNotNumber]: "Checksum is not a number",
  [ValidationErrorsIBAN.WrongIBANChecksum]: "Wrong IBAN checksum",
  [ValidationErrorsIBAN.WrongAccountBankBranchChecksum]: "Wrong account bank branch checksum",
  [ValidationErrorsIBAN.QRIBANNotAllowed]: "QR-IBAN not allowed"
};
function getFriendlyErrors(errorCodes) {
  return errorCodes.map((errorCode) => ibanErrorToMessage[errorCode]).filter(Boolean);
}

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "iban-validator-and-parser",
  __ssrInlineRender: true,
  setup(__props) {
    const rawIban = ref("");
    const ibanInfo = computed(() => {
      const iban = rawIban.value.toUpperCase().replace(/\s/g, "").replace(/-/g, "");
      if (iban === "") {
        return [];
      }
      const { valid: isIbanValid, errorCodes } = validateIBAN(iban);
      const { countryCode, bban } = extractIBAN(iban);
      const errors = getFriendlyErrors(errorCodes);
      return [
        {
          label: "Is IBAN valid ?",
          value: isIbanValid,
          showCopyButton: false
        },
        {
          label: "IBAN errors",
          value: errors.length === 0 ? void 0 : errors,
          hideOnNil: true,
          showCopyButton: false
        },
        {
          label: "Is IBAN a QR-IBAN ?",
          value: isQRIBAN(iban),
          showCopyButton: false
        },
        {
          label: "Country code",
          value: countryCode
        },
        {
          label: "BBAN",
          value: bban
        },
        {
          label: "IBAN friendly format",
          value: friendlyFormatIBAN(iban)
        }
      ];
    });
    const ibanExamples = [
      "FR7630006000011234567890189",
      "DE89370400440532013000",
      "GB29NWBK60161331926819"
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_c_card = __unplugin_components_1;
      const _component_c_key_value_list = _sfc_main$1;
      const _component_c_text_copyable = _sfc_main$2;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(__unplugin_components_3, {
        value: unref(rawIban),
        "onUpdate:value": ($event) => isRef(rawIban) ? rawIban.value = $event : null,
        placeholder: "Enter an IBAN to check for validity...",
        "test-id": "iban-input"
      }, null, _parent));
      if (unref(ibanInfo).length > 0) {
        _push(ssrRenderComponent(_component_c_card, { "mt-5": "" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_c_key_value_list, {
                items: unref(ibanInfo),
                "data-test-id": "iban-info"
              }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_c_key_value_list, {
                  items: unref(ibanInfo),
                  "data-test-id": "iban-info"
                }, null, 8, ["items"])
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_c_card, {
        title: "Valid IBAN examples",
        "mt-5": ""
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<!--[-->`);
            ssrRenderList(ibanExamples, (iban) => {
              _push2(`<div${_scopeId}>`);
              _push2(ssrRenderComponent(_component_c_text_copyable, {
                value: iban,
                "font-mono": "",
                "displayed-value": unref(friendlyFormatIBAN)(iban)
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
            });
            _push2(`<!--]-->`);
          } else {
            return [
              (openBlock(), createBlock(Fragment, null, renderList(ibanExamples, (iban) => {
                return createVNode("div", { key: iban }, [
                  createVNode(_component_c_text_copyable, {
                    value: iban,
                    "font-mono": "",
                    "displayed-value": unref(friendlyFormatIBAN)(iban)
                  }, null, 8, ["value", "displayed-value"])
                ]);
              }), 64))
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/tools/iban-validator-and-parser/iban-validator-and-parser.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
