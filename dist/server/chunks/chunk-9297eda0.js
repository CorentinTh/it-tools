import { a as __unplugin_components_1 } from './chunk-8109fd17.js';
import { _ as __unplugin_components_3 } from './chunk-4e7a6a8d.js';
import { defineComponent, ref, computed, unref, isRef, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { evaluate } from 'mathjs';
import { w as withDefaultOnError } from './chunk-f1b4cc24.js';
import './chunk-6003391e.js';
import '@vueuse/core';
import 'pinia';
import './chunk-11f44f81.js';
import './chunk-35c3d701.js';
import 'lodash';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "math-evaluator",
  __ssrInlineRender: true,
  setup(__props) {
    const expression = ref("");
    const result = computed(() => withDefaultOnError(() => evaluate(expression.value) ?? "", ""));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_c_input_text = __unplugin_components_3;
      const _component_c_card = __unplugin_components_1;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_c_input_text, {
        value: unref(expression),
        "onUpdate:value": ($event) => isRef(expression) ? expression.value = $event : null,
        rows: "1",
        multiline: "",
        placeholder: "Your math expression (ex: 2*sqrt(6) )...",
        "raw-text": "",
        monospace: "",
        autofocus: "",
        autosize: ""
      }, null, _parent));
      if (unref(result) !== "") {
        _push(ssrRenderComponent(_component_c_card, {
          title: "Result ",
          "mt-5": ""
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(result))}`);
            } else {
              return [
                createTextVNode(toDisplayString(unref(result)), 1)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/tools/math-evaluator/math-evaluator.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
