import { a as __unplugin_components_1 } from './chunk-8109fd17.js';
import { _ as __unplugin_components_3 } from './chunk-4e7a6a8d.js';
import { defineComponent, ref, computed, mergeProps, unref, isRef, withCtx, createVNode, toDisplayString, openBlock, createBlock, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import _ from 'lodash';
import './chunk-6003391e.js';
import '@vueuse/core';
import 'pinia';
import './chunk-11f44f81.js';
import './chunk-35c3d701.js';

function prettifyExponentialNotation(exponentialNotation) {
  const [base, exponent] = exponentialNotation.toString().split("e");
  const baseAsNumber = Number.parseFloat(base);
  const prettyBase = baseAsNumber % 1 === 0 ? baseAsNumber.toLocaleString() : baseAsNumber.toFixed(2);
  return exponent ? `${prettyBase}e${exponent}` : prettyBase;
}
function getHumanFriendlyDuration({ seconds }) {
  if (seconds <= 1e-3) {
    return "Instantly";
  }
  if (seconds <= 1) {
    return "Less than a second";
  }
  const timeUnits = [
    { unit: "millenium", secondsInUnit: 31536e6, format: prettifyExponentialNotation, plural: "millennia" },
    { unit: "century", secondsInUnit: 31536e5, plural: "centuries" },
    { unit: "decade", secondsInUnit: 31536e4, plural: "decades" },
    { unit: "year", secondsInUnit: 31536e3, plural: "years" },
    { unit: "month", secondsInUnit: 2592e3, plural: "months" },
    { unit: "week", secondsInUnit: 604800, plural: "weeks" },
    { unit: "day", secondsInUnit: 86400, plural: "days" },
    { unit: "hour", secondsInUnit: 3600, plural: "hours" },
    { unit: "minute", secondsInUnit: 60, plural: "minutes" },
    { unit: "second", secondsInUnit: 1, plural: "seconds" }
  ];
  return _.chain(timeUnits).map(({ unit, secondsInUnit, plural, format = _.identity }) => {
    const quantity = Math.floor(seconds / secondsInUnit);
    seconds %= secondsInUnit;
    if (quantity <= 0) {
      return void 0;
    }
    const formattedQuantity = format(quantity);
    return `${formattedQuantity} ${quantity > 1 ? plural : unit}`;
  }).compact().take(2).join(", ").value();
}
function getPasswordCrackTimeEstimation({ password, guessesPerSecond = 1e9 }) {
  const charsetLength = getCharsetLength({ password });
  const passwordLength = password.length;
  const entropy = password === "" ? 0 : Math.log2(charsetLength) * passwordLength;
  const secondsToCrack = 2 ** entropy / guessesPerSecond;
  const crackDurationFormatted = getHumanFriendlyDuration({ seconds: secondsToCrack });
  const score = Math.min(entropy / 128, 1);
  return {
    entropy,
    charsetLength,
    passwordLength,
    crackDurationFormatted,
    secondsToCrack,
    score
  };
}
function getCharsetLength({ password }) {
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasDigits = /\d/.test(password);
  const hasSpecialChars = /\W|_/.test(password);
  let charsetLength = 0;
  if (hasLowercase) {
    charsetLength += 26;
  }
  if (hasUppercase) {
    charsetLength += 26;
  }
  if (hasDigits) {
    charsetLength += 10;
  }
  if (hasSpecialChars) {
    charsetLength += 32;
  }
  return charsetLength;
}

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "password-strength-analyser",
  __ssrInlineRender: true,
  setup(__props) {
    const password = ref("");
    const crackTimeEstimation = computed(() => getPasswordCrackTimeEstimation({ password: password.value }));
    const details = computed(() => [
      {
        label: "Password length:",
        value: crackTimeEstimation.value.passwordLength
      },
      {
        label: "Entropy:",
        value: Math.round(crackTimeEstimation.value.entropy * 100) / 100
      },
      {
        label: "Character set size:",
        value: crackTimeEstimation.value.charsetLength
      },
      {
        label: "Score:",
        value: `${Math.round(crackTimeEstimation.value.score * 100)} / 100`
      }
    ]);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_c_input_text = __unplugin_components_3;
      const _component_c_card = __unplugin_components_1;
      _push(`<div${ssrRenderAttrs(mergeProps({
        flex: "",
        "flex-col": "",
        "gap-3": ""
      }, _attrs))}>`);
      _push(ssrRenderComponent(_component_c_input_text, {
        value: unref(password),
        "onUpdate:value": ($event) => isRef(password) ? password.value = $event : null,
        type: "password",
        placeholder: "Enter a password...",
        clearable: "",
        autofocus: "",
        "raw-text": "",
        "test-id": "password-input"
      }, null, _parent));
      _push(ssrRenderComponent(_component_c_card, { "text-center": "" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div op-60${_scopeId}> Duration to crack this password with brute force </div><div text-2xl data-test-id="crack-duration"${_scopeId}>${ssrInterpolate(unref(crackTimeEstimation).crackDurationFormatted)}</div>`);
          } else {
            return [
              createVNode("div", { "op-60": "" }, " Duration to crack this password with brute force "),
              createVNode("div", {
                "text-2xl": "",
                "data-test-id": "crack-duration"
              }, toDisplayString(unref(crackTimeEstimation).crackDurationFormatted), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_c_card, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<!--[-->`);
            ssrRenderList(unref(details), ({ label, value }) => {
              _push2(`<div flex gap-3${_scopeId}><div flex-1 text-right op-60${_scopeId}>${ssrInterpolate(label)}</div><div flex-1 text-left${_scopeId}>${ssrInterpolate(value)}</div></div>`);
            });
            _push2(`<!--]-->`);
          } else {
            return [
              (openBlock(true), createBlock(Fragment, null, renderList(unref(details), ({ label, value }) => {
                return openBlock(), createBlock("div", {
                  key: label,
                  flex: "",
                  "gap-3": ""
                }, [
                  createVNode("div", {
                    "flex-1": "",
                    "text-right": "",
                    "op-60": ""
                  }, toDisplayString(label), 1),
                  createVNode("div", {
                    "flex-1": "",
                    "text-left": ""
                  }, toDisplayString(value), 1)
                ]);
              }), 128))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div op-70><span font-bold>Note: </span> The computed strength is based on the time it would take to crack the password using a brute force approach, it does not take into account the possibility of a dictionary attack. </div></div>`);
    };
  }
});

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/tools/password-strength-analyser/password-strength-analyser.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
