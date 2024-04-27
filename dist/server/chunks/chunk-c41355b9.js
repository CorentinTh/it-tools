import { _ as _sfc_main$1 } from './chunk-de61ec1c.js';
import { NInputNumber } from 'naive-ui';
import { a as __unplugin_components_1 } from './chunk-8109fd17.js';
import { defineComponent, ref, computed, mergeProps, withCtx, unref, isRef, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderComponent } from 'vue/server-renderer';
import './chunk-95ec8cf7.js';
import './chunk-6003391e.js';
import '@vueuse/core';
import 'pinia';
import './chunk-4e7a6a8d.js';
import './chunk-11f44f81.js';
import './chunk-35c3d701.js';
import 'lodash';
import './chunk-77c5cc16.js';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "percentage-calculator",
  __ssrInlineRender: true,
  setup(__props) {
    const percentageX = ref();
    const percentageY = ref();
    const percentageResult = computed(() => {
      if (percentageX.value === void 0 || percentageY.value === void 0) {
        return "";
      }
      return (percentageX.value / 100 * percentageY.value).toString();
    });
    const numberX = ref();
    const numberY = ref();
    const numberResult = computed(() => {
      if (numberX.value === void 0 || numberY.value === void 0) {
        return "";
      }
      const result = 100 * numberX.value / numberY.value;
      return !Number.isFinite(result) || Number.isNaN(result) ? "" : result.toString();
    });
    const numberFrom = ref();
    const numberTo = ref();
    const percentageIncreaseDecrease = computed(() => {
      if (numberFrom.value === void 0 || numberTo.value === void 0) {
        return "";
      }
      const result = (numberTo.value - numberFrom.value) / numberFrom.value * 100;
      return !Number.isFinite(result) || Number.isNaN(result) ? "" : result.toString();
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_c_card = __unplugin_components_1;
      const _component_n_input_number = NInputNumber;
      const _component_input_copyable = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ style: { "flex": "0 0 100%" } }, _attrs))}><div style="${ssrRenderStyle({ "margin": "0 auto", "max-width": "600px" })}">`);
      _push(ssrRenderComponent(_component_c_card, { "mb-3": "" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div mb-3 sm:hidden${_scopeId}> What is </div><div flex gap-2${_scopeId}><div hidden pt-1 sm:block style="${ssrRenderStyle({ "min-width": "48px" })}"${_scopeId}> What is </div>`);
            _push2(ssrRenderComponent(_component_n_input_number, {
              value: unref(percentageX),
              "onUpdate:value": ($event) => isRef(percentageX) ? percentageX.value = $event : null,
              "data-test-id": "percentageX",
              placeholder: "X"
            }, null, _parent2, _scopeId));
            _push2(`<div min-w-fit pt-1${_scopeId}> % of </div>`);
            _push2(ssrRenderComponent(_component_n_input_number, {
              value: unref(percentageY),
              "onUpdate:value": ($event) => isRef(percentageY) ? percentageY.value = $event : null,
              "data-test-id": "percentageY",
              placeholder: "Y"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_input_copyable, {
              value: unref(percentageResult),
              "onUpdate:value": ($event) => isRef(percentageResult) ? percentageResult.value = $event : null,
              "data-test-id": "percentageResult",
              readonly: "",
              placeholder: "Result",
              style: { "max-width": "150px" }
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", {
                "mb-3": "",
                "sm:hidden": ""
              }, " What is "),
              createVNode("div", {
                flex: "",
                "gap-2": ""
              }, [
                createVNode("div", {
                  hidden: "",
                  "pt-1": "",
                  "sm:block": "",
                  style: { "min-width": "48px" }
                }, " What is "),
                createVNode(_component_n_input_number, {
                  value: unref(percentageX),
                  "onUpdate:value": ($event) => isRef(percentageX) ? percentageX.value = $event : null,
                  "data-test-id": "percentageX",
                  placeholder: "X"
                }, null, 8, ["value", "onUpdate:value"]),
                createVNode("div", {
                  "min-w-fit": "",
                  "pt-1": ""
                }, " % of "),
                createVNode(_component_n_input_number, {
                  value: unref(percentageY),
                  "onUpdate:value": ($event) => isRef(percentageY) ? percentageY.value = $event : null,
                  "data-test-id": "percentageY",
                  placeholder: "Y"
                }, null, 8, ["value", "onUpdate:value"]),
                createVNode(_component_input_copyable, {
                  value: unref(percentageResult),
                  "onUpdate:value": ($event) => isRef(percentageResult) ? percentageResult.value = $event : null,
                  "data-test-id": "percentageResult",
                  readonly: "",
                  placeholder: "Result",
                  style: { "max-width": "150px" }
                }, null, 8, ["value", "onUpdate:value"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_c_card, { "mb-3": "" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div mb-3 sm:hidden${_scopeId}> X is what percent of Y </div><div flex gap-2${_scopeId}>`);
            _push2(ssrRenderComponent(_component_n_input_number, {
              value: unref(numberX),
              "onUpdate:value": ($event) => isRef(numberX) ? numberX.value = $event : null,
              "data-test-id": "numberX",
              placeholder: "X"
            }, null, _parent2, _scopeId));
            _push2(`<div hidden min-w-fit pt-1 sm:block${_scopeId}> is what percent of </div>`);
            _push2(ssrRenderComponent(_component_n_input_number, {
              value: unref(numberY),
              "onUpdate:value": ($event) => isRef(numberY) ? numberY.value = $event : null,
              "data-test-id": "numberY",
              placeholder: "Y"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_input_copyable, {
              value: unref(numberResult),
              "onUpdate:value": ($event) => isRef(numberResult) ? numberResult.value = $event : null,
              "data-test-id": "numberResult",
              readonly: "",
              placeholder: "Result",
              style: { "max-width": "150px" }
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", {
                "mb-3": "",
                "sm:hidden": ""
              }, " X is what percent of Y "),
              createVNode("div", {
                flex: "",
                "gap-2": ""
              }, [
                createVNode(_component_n_input_number, {
                  value: unref(numberX),
                  "onUpdate:value": ($event) => isRef(numberX) ? numberX.value = $event : null,
                  "data-test-id": "numberX",
                  placeholder: "X"
                }, null, 8, ["value", "onUpdate:value"]),
                createVNode("div", {
                  hidden: "",
                  "min-w-fit": "",
                  "pt-1": "",
                  "sm:block": ""
                }, " is what percent of "),
                createVNode(_component_n_input_number, {
                  value: unref(numberY),
                  "onUpdate:value": ($event) => isRef(numberY) ? numberY.value = $event : null,
                  "data-test-id": "numberY",
                  placeholder: "Y"
                }, null, 8, ["value", "onUpdate:value"]),
                createVNode(_component_input_copyable, {
                  value: unref(numberResult),
                  "onUpdate:value": ($event) => isRef(numberResult) ? numberResult.value = $event : null,
                  "data-test-id": "numberResult",
                  readonly: "",
                  placeholder: "Result",
                  style: { "max-width": "150px" }
                }, null, 8, ["value", "onUpdate:value"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_c_card, { "mb-3": "" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div mb-3${_scopeId}> What is the percentage increase/decrease </div><div flex gap-2${_scopeId}>`);
            _push2(ssrRenderComponent(_component_n_input_number, {
              value: unref(numberFrom),
              "onUpdate:value": ($event) => isRef(numberFrom) ? numberFrom.value = $event : null,
              "data-test-id": "numberFrom",
              placeholder: "From"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_n_input_number, {
              value: unref(numberTo),
              "onUpdate:value": ($event) => isRef(numberTo) ? numberTo.value = $event : null,
              "data-test-id": "numberTo",
              placeholder: "To"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_input_copyable, {
              value: unref(percentageIncreaseDecrease),
              "onUpdate:value": ($event) => isRef(percentageIncreaseDecrease) ? percentageIncreaseDecrease.value = $event : null,
              "data-test-id": "percentageIncreaseDecrease",
              readonly: "",
              placeholder: "Result",
              style: { "max-width": "150px" }
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { "mb-3": "" }, " What is the percentage increase/decrease "),
              createVNode("div", {
                flex: "",
                "gap-2": ""
              }, [
                createVNode(_component_n_input_number, {
                  value: unref(numberFrom),
                  "onUpdate:value": ($event) => isRef(numberFrom) ? numberFrom.value = $event : null,
                  "data-test-id": "numberFrom",
                  placeholder: "From"
                }, null, 8, ["value", "onUpdate:value"]),
                createVNode(_component_n_input_number, {
                  value: unref(numberTo),
                  "onUpdate:value": ($event) => isRef(numberTo) ? numberTo.value = $event : null,
                  "data-test-id": "numberTo",
                  placeholder: "To"
                }, null, 8, ["value", "onUpdate:value"]),
                createVNode(_component_input_copyable, {
                  value: unref(percentageIncreaseDecrease),
                  "onUpdate:value": ($event) => isRef(percentageIncreaseDecrease) ? percentageIncreaseDecrease.value = $event : null,
                  "data-test-id": "percentageIncreaseDecrease",
                  readonly: "",
                  placeholder: "Result",
                  style: { "max-width": "150px" }
                }, null, 8, ["value", "onUpdate:value"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
    };
  }
});

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/tools/percentage-calculator/percentage-calculator.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
