import { NDivider, NFormItem } from 'naive-ui';
import { _ as __unplugin_components_3 } from './chunk-4e7a6a8d.js';
import { defineComponent, ref, computed, unref, isRef, withCtx, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { T as TextareaCopyable } from './chunk-727cc0fb.js';
import './chunk-6003391e.js';
import '@vueuse/core';
import 'pinia';
import './chunk-11f44f81.js';
import './chunk-35c3d701.js';
import 'lodash';
import './chunk-8109fd17.js';
import '@vicons/tabler';
import 'highlight.js/lib/core';
import 'highlight.js/lib/languages/json';
import 'highlight.js/lib/languages/sql';
import 'highlight.js/lib/languages/xml';
import 'highlight.js/lib/languages/yaml';
import 'highlight.js/lib/languages/ini';
import './chunk-77c5cc16.js';

function decodeSafeLinksURL(safeLinksUrl) {
  if (!safeLinksUrl.match(/\.safelinks\.protection\.outlook\.com/)) {
    throw new Error("Invalid SafeLinks URL provided");
  }
  return new URL(safeLinksUrl).searchParams.get("url");
}

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "safelink-decoder",
  __ssrInlineRender: true,
  setup(__props) {
    const inputSafeLinkUrl = ref("");
    const outputDecodedUrl = computed(() => {
      try {
        return decodeSafeLinksURL(inputSafeLinkUrl.value);
      } catch (e) {
        return e.toString();
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_c_input_text = __unplugin_components_3;
      const _component_n_divider = NDivider;
      const _component_n_form_item = NFormItem;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_c_input_text, {
        value: unref(inputSafeLinkUrl),
        "onUpdate:value": ($event) => isRef(inputSafeLinkUrl) ? inputSafeLinkUrl.value = $event : null,
        "raw-text": "",
        placeholder: "Your input Outlook SafeLink Url...",
        autofocus: "",
        label: "Your input Outlook SafeLink Url:"
      }, null, _parent));
      _push(ssrRenderComponent(_component_n_divider, null, null, _parent));
      _push(ssrRenderComponent(_component_n_form_item, { label: "Output decoded URL:" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(TextareaCopyable, {
              value: unref(outputDecodedUrl),
              "word-wrap": true
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(TextareaCopyable, {
                value: unref(outputDecodedUrl),
                "word-wrap": true
              }, null, 8, ["value"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/tools/safelink-decoder/safelink-decoder.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
