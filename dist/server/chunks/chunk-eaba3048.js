import { a as __unplugin_components_0 } from './chunk-6003391e.js';
import { a as __unplugin_components_1 } from './chunk-8109fd17.js';
import { _ as _sfc_main$1 } from './chunk-000e277f.js';
import { NInputNumber } from 'naive-ui';
import { defineComponent, mergeProps, unref, isRef, withCtx, createVNode, toDisplayString, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { ulid } from 'ulid';
import _ from 'lodash';
import { c as computedRefreshable } from './chunk-cc665c88.js';
import { u as useCopy } from './chunk-77c5cc16.js';
import { useStorage } from '@vueuse/core';
import 'pinia';
import './chunk-bb5bb4f6.js';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ulid-generator",
  __ssrInlineRender: true,
  setup(__props) {
    const amount = useStorage("ulid-generator-amount", 1);
    const formats = [{ label: "Raw", value: "raw" }, { label: "JSON", value: "json" }];
    const format = useStorage("ulid-generator-format", formats[0].value);
    const [ulids, refreshUlids] = computedRefreshable(() => {
      const ids = _.times(amount.value, () => ulid());
      if (format.value === "json") {
        return JSON.stringify(ids, null, 2);
      }
      return ids.join("\n");
    });
    const { copy } = useCopy({ source: ulids, text: "ULIDs copied to the clipboard" });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_n_input_number = NInputNumber;
      const _component_c_buttons_select = _sfc_main$1;
      const _component_c_card = __unplugin_components_1;
      const _component_c_button = __unplugin_components_0;
      _push(`<div${ssrRenderAttrs(mergeProps({
        flex: "",
        "flex-col": "",
        "justify-center": "",
        "gap-2": ""
      }, _attrs))}><div flex items-center><label w-75px> Quantity:</label>`);
      _push(ssrRenderComponent(_component_n_input_number, {
        value: unref(amount),
        "onUpdate:value": ($event) => isRef(amount) ? amount.value = $event : null,
        min: "1",
        max: "100",
        "flex-1": ""
      }, null, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_c_buttons_select, {
        value: unref(format),
        "onUpdate:value": ($event) => isRef(format) ? format.value = $event : null,
        options: formats,
        label: "Format: ",
        "label-width": "75px"
      }, null, _parent));
      _push(ssrRenderComponent(_component_c_card, {
        "mt-5": "",
        flex: "",
        "data-test-id": "ulids"
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<pre m-0 m-x-auto${_scopeId}>${ssrInterpolate(unref(ulids))}</pre>`);
          } else {
            return [
              createVNode("pre", {
                "m-0": "",
                "m-x-auto": ""
              }, toDisplayString(unref(ulids)), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div flex justify-center gap-2>`);
      _push(ssrRenderComponent(_component_c_button, {
        "data-test-id": "refresh",
        onClick: ($event) => unref(refreshUlids)()
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Refresh `);
          } else {
            return [
              createTextVNode(" Refresh ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_c_button, {
        onClick: ($event) => unref(copy)()
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Copy `);
          } else {
            return [
              createTextVNode(" Copy ")
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/tools/ulid-generator/ulid-generator.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
