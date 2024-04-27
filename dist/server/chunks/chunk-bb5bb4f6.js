import { defineComponent, toRefs, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderStyle, ssrRenderClass, ssrInterpolate, ssrRenderSlot } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "c-label",
  __ssrInlineRender: true,
  props: {
    label: { default: void 0 },
    labelFor: { default: void 0 },
    labelPosition: { default: "top" },
    labelWidth: { default: "auto" },
    labelAlign: { default: "left" }
  },
  setup(__props) {
    const props = __props;
    const { label, labelAlign, labelFor, labelPosition, labelWidth } = toRefs(props);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: {
          "flex-col": unref(labelPosition) === "top",
          "flex-row": unref(labelPosition) === "left"
        },
        flex: "",
        "items-baseline": ""
      }, _attrs))}>`);
      if (unref(label)) {
        _push(`<label${ssrRenderAttr("for", unref(labelFor))} style="${ssrRenderStyle({ flex: `0 0 ${unref(labelWidth)}` })}" mb-5px pr-12px class="${ssrRenderClass({
          "text-left": unref(labelAlign) === "left",
          "text-center": unref(labelAlign) === "center",
          "text-right": unref(labelAlign) === "right"
        })}">${ssrInterpolate(unref(label))}</label>`);
      } else {
        _push(`<!---->`);
      }
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div>`);
    };
  }
});

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/ui/c-label/c-label.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
