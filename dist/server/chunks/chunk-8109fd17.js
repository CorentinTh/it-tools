import { defineComponent, toRefs, unref, mergeProps, useSSRContext, ref } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderSlot, ssrRenderClass } from 'vue/server-renderer';
import { d as defineThemes, _ as _export_sfc } from './chunk-6003391e.js';
import { useElementHover } from '@vueuse/core';

const { useTheme } = defineThemes({
  dark: {
    backgroundColor: "#232323",
    borderColor: "#282828"
  },
  light: {
    backgroundColor: "#ffffff",
    borderColor: "#efeff5"
  }
});

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "c-card",
  __ssrInlineRender: true,
  props: {
    title: {}
  },
  setup(__props) {
    const props = __props;
    const { title } = toRefs(props);
    const theme = useTheme();
    return (_ctx, _push, _parent, _attrs) => {
      const _cssVars = { style: {
        "--51386d66": unref(theme).backgroundColor,
        "--1d9c24b0": unref(theme).borderColor
      } };
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "c-card" }, _attrs, _cssVars))} data-v-236d2dc6>`);
      if (unref(title)) {
        _push(`<div class="c-card-title" data-v-236d2dc6>${ssrInterpolate(unref(title))}</div>`);
      } else {
        _push(`<!---->`);
      }
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div>`);
    };
  }
});

/* unplugin-vue-components disabled */const cCard_vue_vue_type_style_index_0_scoped_236d2dc6_lang = '';

const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/ui/c-card/c-card.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __unplugin_components_1 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-236d2dc6"]]);

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "c-tooltip",
  __ssrInlineRender: true,
  props: {
    tooltip: { default: void 0 },
    position: { default: "top" }
  },
  setup(__props) {
    const props = __props;
    const { tooltip, position } = toRefs(props);
    const targetRef = ref();
    const isTargetHovered = useElementHover(targetRef);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        relative: "",
        "inline-block": ""
      }, _attrs))}><div>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div>`);
      if (unref(tooltip) || _ctx.$slots.tooltip) {
        _push(`<div class="${ssrRenderClass([{
          "op-0 scale-0": unref(isTargetHovered) === false,
          "op-100 scale-100": unref(isTargetHovered),
          "bottom-100% left-50% -translate-x-1/2 mb-5px": unref(position) === "top",
          "top-100% left-50% -translate-x-1/2 mt-5px": unref(position) === "bottom",
          "right-100% top-50% -translate-y-1/2 mr-5px": unref(position) === "left",
          "left-100% top-50% -translate-y-1/2 ml-5px": unref(position) === "right"
        }, "absolute z-10 whitespace-nowrap rounded bg-black px-12px py-6px text-sm text-white shadow-lg transition transition transition-duration-0.2s"])}">`);
        if (unref(isTargetHovered)) {
          ssrRenderSlot(_ctx.$slots, "tooltip", {}, () => {
            _push(`${ssrInterpolate(unref(tooltip))}`);
          }, _push, _parent);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/ui/c-tooltip/c-tooltip.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _, __unplugin_components_1 as a };
