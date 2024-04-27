import { a as __unplugin_components_0, _ as _export_sfc } from './chunk-6003391e.js';
import { a as __unplugin_components_1 } from './chunk-8109fd17.js';
import { defineComponent, ref, withCtx, unref, createVNode, toDisplayString, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { useRafFn } from '@vueuse/core';
import 'pinia';

function formatMs(msTotal) {
  const ms = msTotal % 1e3;
  const secs = (msTotal - ms) / 1e3 % 60;
  const mins = ((msTotal - ms) / 1e3 - secs) / 60 % 60;
  const hrs = (((msTotal - ms) / 1e3 - secs) / 60 - mins) / 60;
  const hrsString = hrs > 0 ? `${hrs.toString().padStart(2, "0")}:` : "";
  return `${hrsString}${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}.${ms.toString().padStart(3, "0")}`;
}

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "chronometer",
  __ssrInlineRender: true,
  setup(__props) {
    const isRunning = ref(false);
    const counter = ref(0);
    let previousRafDate = Date.now();
    const { pause: pauseRaf, resume: resumeRaf } = useRafFn(
      () => {
        const deltaMs = Date.now() - previousRafDate;
        previousRafDate = Date.now();
        counter.value += deltaMs;
      },
      { immediate: false }
    );
    function resume() {
      previousRafDate = Date.now();
      resumeRaf();
      isRunning.value = true;
    }
    function pause() {
      pauseRaf();
      isRunning.value = false;
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_c_card = __unplugin_components_1;
      const _component_c_button = __unplugin_components_0;
      _push(`<div${ssrRenderAttrs(_attrs)} data-v-3e03ad8b>`);
      _push(ssrRenderComponent(_component_c_card, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="duration" data-v-3e03ad8b${_scopeId}>${ssrInterpolate(unref(formatMs)(unref(counter)))}</div>`);
          } else {
            return [
              createVNode("div", { class: "duration" }, toDisplayString(unref(formatMs)(unref(counter))), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div mt-5 flex justify-center gap-3 data-v-3e03ad8b>`);
      if (!unref(isRunning)) {
        _push(ssrRenderComponent(_component_c_button, {
          type: "primary",
          onClick: resume
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Start `);
            } else {
              return [
                createTextVNode(" Start ")
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(ssrRenderComponent(_component_c_button, {
          type: "warning",
          onClick: pause
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Stop `);
            } else {
              return [
                createTextVNode(" Stop ")
              ];
            }
          }),
          _: 1
        }, _parent));
      }
      _push(ssrRenderComponent(_component_c_button, {
        onClick: ($event) => counter.value = 0
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Reset `);
          } else {
            return [
              createTextVNode(" Reset ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
    };
  }
});

/* unplugin-vue-components disabled */const chronometer_vue_vue_type_style_index_0_scoped_3e03ad8b_lang = '';

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/tools/chronometer/chronometer.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const chronometer = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-3e03ad8b"]]);

export { chronometer as default };
