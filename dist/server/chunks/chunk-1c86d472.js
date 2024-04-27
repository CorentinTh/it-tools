import { useThemeVars, NProgress, NImage } from 'naive-ui';
import { openBlock, createElementBlock, createElementVNode, defineComponent, toRefs, unref, withCtx, createTextVNode, toDisplayString, createVNode, withModifiers, useSSRContext, computed, ref, isRef } from 'vue';
import { a as __unplugin_components_0, u as useStyleStore, _ as _export_sfc } from './chunk-6003391e.js';
import { _ as _sfc_main$2 } from './chunk-8109fd17.js';
import { _ as __unplugin_components_3$1 } from './chunk-4e7a6a8d.js';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderStyle } from 'vue/server-renderer';
import { useTimestamp } from '@vueuse/core';
import { u as useQRCode } from './chunk-aa632c49.js';
import { HmacSHA1, enc } from 'crypto-js';
import _ from 'lodash';
import { c as createToken } from './chunk-264f08b8.js';
import { u as useCopy } from './chunk-77c5cc16.js';
import { _ as _sfc_main$3 } from './chunk-de61ec1c.js';
import { c as computedRefreshable } from './chunk-cc665c88.js';
import 'pinia';
import './chunk-11f44f81.js';
import './chunk-35c3d701.js';
import 'qrcode';
import './chunk-95ec8cf7.js';

const _hoisted_1 = {
  viewBox: "0 0 24 24",
  width: "1.2em",
  height: "1.2em"
};
const _hoisted_2 = /*#__PURE__*/createElementVNode("path", {
  fill: "currentColor",
  d: "M17.65 6.35A7.958 7.958 0 0 0 12 4a8 8 0 0 0-8 8a8 8 0 0 0 8 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18a6 6 0 0 1-6-6a6 6 0 0 1 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35Z"
}, null, -1);
const _hoisted_3 = [
  _hoisted_2
];

function render(_ctx, _cache) {
  return (openBlock(), createElementBlock("svg", _hoisted_1, _hoisted_3))
}

const __unplugin_components_3 = { name: 'mdi-refresh', render };
/* vite-plugin-components disabled */

function hexToBytes(hex) {
  return (hex.match(/.{1,2}/g) ?? []).map((char) => Number.parseInt(char, 16));
}
function computeHMACSha1(message, key) {
  return HmacSHA1(enc.Hex.parse(message), enc.Hex.parse(base32toHex(key))).toString(enc.Hex);
}
function base32toHex(base32) {
  const base32Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  const bits = base32.toUpperCase().replace(/=+$/, "").split("").map((value) => base32Chars.indexOf(value).toString(2).padStart(5, "0")).join("");
  const hex = (bits.match(/.{1,8}/g) ?? []).map((chunk) => Number.parseInt(chunk, 2).toString(16).padStart(2, "0")).join("");
  return hex;
}
function generateHOTP({ key, counter = 0 }) {
  const digest = computeHMACSha1(counter.toString(16).padStart(16, "0"), key);
  const bytes = hexToBytes(digest);
  const offset = bytes[19] & 15;
  const v = (bytes[offset] & 127) << 24 | (bytes[offset + 1] & 255) << 16 | (bytes[offset + 2] & 255) << 8 | bytes[offset + 3] & 255;
  const code = String(v % 1e6).padStart(6, "0");
  return code;
}
function getCounterFromTime({ now, timeStep }) {
  return Math.floor(now / 1e3 / timeStep);
}
function generateTOTP({ key, now = Date.now(), timeStep = 30 }) {
  const counter = getCounterFromTime({ now, timeStep });
  return generateHOTP({ key, counter });
}
function buildKeyUri({
  secret,
  app = "IT-Tools",
  account = "demo-user",
  algorithm = "SHA1",
  digits = 6,
  period = 30
}) {
  const params = {
    issuer: app,
    secret,
    algorithm,
    digits,
    period
  };
  const paramsString = _(params).map((value, key) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join("&");
  return `otpauth://totp/${encodeURIComponent(app)}:${encodeURIComponent(account)}?${paramsString}`;
}
function generateSecret() {
  return createToken({ length: 16, alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567" });
}

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "token-display",
  __ssrInlineRender: true,
  props: {
    tokens: {}
  },
  setup(__props) {
    const props = __props;
    const { copy: copyPrevious, isJustCopied: previousCopied } = useCopy({ createToast: false });
    const { copy: copyCurrent, isJustCopied: currentCopied } = useCopy({ createToast: false });
    const { copy: copyNext, isJustCopied: nextCopied } = useCopy({ createToast: false });
    const { tokens } = toRefs(props);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_c_tooltip = _sfc_main$2;
      const _component_c_button = __unplugin_components_0;
      _push(`<div${ssrRenderAttrs(_attrs)}><div mb-5px w-full flex items-center><div flex-1 text-left> Previous </div><div flex-1 text-center> Current OTP </div><div flex-1 text-right> Next </div></div><div flex items-center>`);
      _push(ssrRenderComponent(_component_c_tooltip, {
        tooltip: unref(previousCopied) ? "Copied !" : "Copy previous OTP",
        position: "bottom",
        "flex-1": ""
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_c_button, {
              "data-test-id": "previous-otp",
              "w-full": "",
              "important:h-12": "",
              "important:rounded-r-none": "",
              "important:font-mono": "",
              onClick: ($event) => unref(copyPrevious)(unref(tokens).previous)
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(unref(tokens).previous)}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(unref(tokens).previous), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_c_button, {
                "data-test-id": "previous-otp",
                "w-full": "",
                "important:h-12": "",
                "important:rounded-r-none": "",
                "important:font-mono": "",
                onClick: withModifiers(($event) => unref(copyPrevious)(unref(tokens).previous), ["prevent"])
              }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(unref(tokens).previous), 1)
                ]),
                _: 1
              }, 8, ["onClick"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_c_tooltip, {
        tooltip: unref(currentCopied) ? "Copied !" : "Copy current OTP",
        position: "bottom",
        "flex-1": "",
        "flex-basis-5xl": ""
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_c_button, {
              "data-test-id": "current-otp",
              "w-full": "",
              "important:border-x": "1px solid gray op-40",
              "important:h-12": "",
              "important:rounded-0": "",
              "important:text-22px": "",
              onClick: ($event) => unref(copyCurrent)(unref(tokens).current)
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(unref(tokens).current)}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(unref(tokens).current), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_c_button, {
                "data-test-id": "current-otp",
                "w-full": "",
                "important:border-x": "1px solid gray op-40",
                "important:h-12": "",
                "important:rounded-0": "",
                "important:text-22px": "",
                onClick: withModifiers(($event) => unref(copyCurrent)(unref(tokens).current), ["prevent"])
              }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(unref(tokens).current), 1)
                ]),
                _: 1
              }, 8, ["onClick"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_c_tooltip, {
        tooltip: unref(nextCopied) ? "Copied !" : "Copy next OTP",
        position: "bottom",
        "flex-1": ""
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_c_button, {
              "data-test-id": "next-otp",
              "w-full": "",
              "important:h-12": "",
              "important:rounded-l-none": "",
              onClick: ($event) => unref(copyNext)(unref(tokens).next)
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(unref(tokens).next)}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(unref(tokens).next), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_c_button, {
                "data-test-id": "next-otp",
                "w-full": "",
                "important:h-12": "",
                "important:rounded-l-none": "",
                onClick: withModifiers(($event) => unref(copyNext)(unref(tokens).next), ["prevent"])
              }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(unref(tokens).next), 1)
                ]),
                _: 1
              }, 8, ["onClick"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
    };
  }
});

const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/tools/otp-code-generator-and-validator/token-display.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "otp-code-generator-and-validator",
  __ssrInlineRender: true,
  setup(__props) {
    const now = useTimestamp();
    const interval = computed(() => now.value / 1e3 % 30);
    const theme = useThemeVars();
    const styleStore = useStyleStore();
    const secret = ref(generateSecret());
    function refreshSecret() {
      secret.value = generateSecret();
    }
    const [tokens] = computedRefreshable(
      () => ({
        previous: generateTOTP({ key: secret.value, now: now.value - 3e4 }),
        current: generateTOTP({ key: secret.value, now: now.value }),
        next: generateTOTP({ key: secret.value, now: now.value + 3e4 })
      }),
      { throttle: 500 }
    );
    const keyUri = computed(() => buildKeyUri({ secret: secret.value }));
    const { qrcode } = useQRCode({
      text: keyUri,
      color: {
        background: computed(() => styleStore.isDarkTheme ? "#ffffff" : "#00000000"),
        foreground: "#000000"
      },
      options: { width: 210 }
    });
    const secretValidationRules = [
      {
        message: "Secret should be a base32 string",
        validator: (value) => value.toUpperCase().match(/^[A-Z234567]+$/)
      },
      {
        message: "Please set a secret",
        validator: (value) => value !== ""
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_c_input_text = __unplugin_components_3$1;
      const _component_c_tooltip = _sfc_main$2;
      const _component_c_button = __unplugin_components_0;
      const _component_icon_mdi_refresh = __unplugin_components_3;
      const _component_n_progress = NProgress;
      const _component_n_image = NImage;
      _push(`<!--[--><div style="${ssrRenderStyle({ "max-width": "350px" })}" data-v-388f1b9b>`);
      _push(ssrRenderComponent(_component_c_input_text, {
        value: unref(secret),
        "onUpdate:value": ($event) => isRef(secret) ? secret.value = $event : null,
        label: "Secret",
        placeholder: "Paste your TOTP secret...",
        "mb-5": "",
        "validation-rules": secretValidationRules
      }, {
        suffix: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_c_tooltip, { tooltip: "Generate a new random secret" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_c_button, {
                    circle: "",
                    variant: "text",
                    size: "small",
                    onClick: refreshSecret
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_icon_mdi_refresh, null, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_icon_mdi_refresh)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_c_button, {
                      circle: "",
                      variant: "text",
                      size: "small",
                      onClick: refreshSecret
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_icon_mdi_refresh)
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_c_tooltip, { tooltip: "Generate a new random secret" }, {
                default: withCtx(() => [
                  createVNode(_component_c_button, {
                    circle: "",
                    variant: "text",
                    size: "small",
                    onClick: refreshSecret
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_icon_mdi_refresh)
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div data-v-388f1b9b>`);
      _push(ssrRenderComponent(_sfc_main$1, { tokens: unref(tokens) }, null, _parent));
      _push(ssrRenderComponent(_component_n_progress, {
        percentage: 100 * unref(interval) / 30,
        color: unref(theme).primaryColor,
        "show-indicator": false
      }, null, _parent));
      _push(`<div style="${ssrRenderStyle({ "text-align": "center" })}" data-v-388f1b9b> Next in ${ssrInterpolate(String(Math.floor(30 - unref(interval))).padStart(2, "0"))}s </div></div><div mt-4 flex flex-col items-center justify-center gap-3 data-v-388f1b9b>`);
      _push(ssrRenderComponent(_component_n_image, { src: unref(qrcode) }, null, _parent));
      _push(ssrRenderComponent(_component_c_button, {
        href: unref(keyUri),
        target: "_blank"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Open Key URI in new tab `);
          } else {
            return [
              createTextVNode(" Open Key URI in new tab ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div><div style="${ssrRenderStyle({ "max-width": "350px" })}" data-v-388f1b9b>`);
      _push(ssrRenderComponent(_sfc_main$3, {
        label: "Secret in hexadecimal",
        value: unref(base32toHex)(unref(secret)),
        readonly: "",
        placeholder: "Secret in hex will be displayed here",
        "mb-5": ""
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$3, {
        label: "Epoch",
        value: Math.floor(unref(now) / 1e3).toString(),
        readonly: "",
        "mb-5": "",
        placeholder: "Epoch in sec will be displayed here"
      }, null, _parent));
      _push(`<p data-v-388f1b9b>Iteration</p>`);
      _push(ssrRenderComponent(_sfc_main$3, {
        value: String(unref(getCounterFromTime)({ now: unref(now), timeStep: 30 })),
        readonly: "",
        label: "Count:",
        "label-position": "left",
        "label-width": "90px",
        "label-align": "right",
        placeholder: "Iteration count will be displayed here"
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$3, {
        value: unref(getCounterFromTime)({ now: unref(now), timeStep: 30 }).toString(16).padStart(16, "0"),
        readonly: "",
        placeholder: "Iteration count in hex will be displayed here",
        "label-position": "left",
        "label-width": "90px",
        "label-align": "right",
        label: "Padded hex:"
      }, null, _parent));
      _push(`</div><!--]-->`);
    };
  }
});

/* unplugin-vue-components disabled */const otpCodeGeneratorAndValidator_vue_vue_type_style_index_0_scoped_388f1b9b_lang = '';

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/tools/otp-code-generator-and-validator/otp-code-generator-and-validator.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const otpCodeGeneratorAndValidator = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-388f1b9b"]]);

export { otpCodeGeneratorAndValidator as default };
