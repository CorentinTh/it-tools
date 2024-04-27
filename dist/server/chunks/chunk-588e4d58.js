import { _ as _sfc_main$1 } from './chunk-8109fd17.js';
import { defineComponent, toRefs, computed, mergeProps, unref, withCtx, createVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { u as useCopy } from './chunk-77c5cc16.js';

const initialText = "Copy to clipboard";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "SpanCopyable",
  __ssrInlineRender: true,
  props: {
    value: { default: "" }
  },
  setup(__props) {
    const props = __props;
    const { value } = toRefs(props);
    const { copy, isJustCopied } = useCopy({ source: value, createToast: false });
    const tooltipText = computed(() => isJustCopied.value ? "Copied!" : initialText);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_c_tooltip = _sfc_main$1;
      _push(ssrRenderComponent(_component_c_tooltip, mergeProps({ tooltip: unref(tooltipText) }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span cursor-pointer font-mono${_scopeId}>${ssrInterpolate(unref(value))}</span>`);
          } else {
            return [
              createVNode("span", {
                "cursor-pointer": "",
                "font-mono": "",
                onClick: ($event) => unref(copy)()
              }, toDisplayString(unref(value)), 9, ["onClick"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/SpanCopyable.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
