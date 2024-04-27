import { NStatistic } from 'naive-ui';
import { _ as __unplugin_components_3 } from './chunk-4e7a6a8d.js';
import { a as __unplugin_components_1 } from './chunk-8109fd17.js';
import { defineComponent, ref, withCtx, unref, isRef, createVNode, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import { f as formatBytes } from './chunk-3e99c6bf.js';
import './chunk-6003391e.js';
import '@vueuse/core';
import 'pinia';
import './chunk-11f44f81.js';
import './chunk-35c3d701.js';
import 'lodash';

function getStringSizeInBytes(text) {
  return new TextEncoder().encode(text).buffer.byteLength;
}

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "text-statistics",
  __ssrInlineRender: true,
  setup(__props) {
    const text = ref("");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_c_card = __unplugin_components_1;
      const _component_c_input_text = __unplugin_components_3;
      const _component_n_statistic = NStatistic;
      _push(ssrRenderComponent(_component_c_card, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_c_input_text, {
              value: unref(text),
              "onUpdate:value": ($event) => isRef(text) ? text.value = $event : null,
              multiline: "",
              placeholder: "Your text...",
              rows: "5"
            }, null, _parent2, _scopeId));
            _push2(`<div mt-5 flex${_scopeId}>`);
            _push2(ssrRenderComponent(_component_n_statistic, {
              label: "Character count",
              value: unref(text).length,
              "flex-1": ""
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_n_statistic, {
              label: "Word count",
              value: unref(text) === "" ? 0 : unref(text).split(/\s+/).length,
              "flex-1": ""
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_n_statistic, {
              label: "Line count",
              value: unref(text) === "" ? 0 : unref(text).split(/\r\n|\r|\n/).length,
              "flex-1": ""
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_n_statistic, {
              label: "Byte size",
              value: unref(formatBytes)(unref(getStringSizeInBytes)(unref(text))),
              "flex-1": ""
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode(_component_c_input_text, {
                value: unref(text),
                "onUpdate:value": ($event) => isRef(text) ? text.value = $event : null,
                multiline: "",
                placeholder: "Your text...",
                rows: "5"
              }, null, 8, ["value", "onUpdate:value"]),
              createVNode("div", {
                "mt-5": "",
                flex: ""
              }, [
                createVNode(_component_n_statistic, {
                  label: "Character count",
                  value: unref(text).length,
                  "flex-1": ""
                }, null, 8, ["value"]),
                createVNode(_component_n_statistic, {
                  label: "Word count",
                  value: unref(text) === "" ? 0 : unref(text).split(/\s+/).length,
                  "flex-1": ""
                }, null, 8, ["value"]),
                createVNode(_component_n_statistic, {
                  label: "Line count",
                  value: unref(text) === "" ? 0 : unref(text).split(/\r\n|\r|\n/).length,
                  "flex-1": ""
                }, null, 8, ["value"]),
                createVNode(_component_n_statistic, {
                  label: "Byte size",
                  value: unref(formatBytes)(unref(getStringSizeInBytes)(unref(text))),
                  "flex-1": ""
                }, null, 8, ["value"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/tools/text-statistics/text-statistics.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
