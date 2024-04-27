import { _ as __unplugin_components_5 } from './chunk-95ec8cf7.js';
import { _ as _sfc_main$1 } from './chunk-8109fd17.js';
import { defineComponent, toRefs, mergeProps, unref, withCtx, createVNode, createTextVNode, toDisplayString, openBlock, createBlock, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { u as useCopy } from './chunk-77c5cc16.js';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "c-text-copyable",
  __ssrInlineRender: true,
  props: {
    value: { default: "" },
    displayedValue: { default: void 0 },
    showIcon: { type: Boolean, default: true }
  },
  setup(__props) {
    const props = __props;
    const { value, displayedValue, showIcon } = toRefs(props);
    const { copy, isJustCopied } = useCopy({ source: value, createToast: false });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_c_tooltip = _sfc_main$1;
      const _component_icon_mdi_content_copy = __unplugin_components_5;
      _push(ssrRenderComponent(_component_c_tooltip, mergeProps({
        tooltip: unref(isJustCopied) ? "Copied!" : "Copy to clipboard",
        "cursor-pointer": "",
        onClick: unref(copy)
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span flex items-center gap-2${_scopeId}>${ssrInterpolate(unref(displayedValue) ?? unref(value))} `);
            if (unref(showIcon)) {
              _push2(ssrRenderComponent(_component_icon_mdi_content_copy, { "op-40": "" }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`</span>`);
          } else {
            return [
              createVNode("span", {
                flex: "",
                "items-center": "",
                "gap-2": ""
              }, [
                createTextVNode(toDisplayString(unref(displayedValue) ?? unref(value)) + " ", 1),
                unref(showIcon) ? (openBlock(), createBlock(_component_icon_mdi_content_copy, {
                  key: 0,
                  "op-40": ""
                })) : createCommentVNode("", true)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/ui/c-text-copyable/c-text-copyable.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
