import { openBlock, createElementBlock, createElementVNode, defineComponent, toRefs, computed, unref, mergeProps, createVNode, resolveDynamicComponent, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderSlot, ssrRenderVNode, ssrInterpolate } from 'vue/server-renderer';
import { d as defineThemes, b as appThemes, e as darken, _ as _export_sfc } from './chunk-6003391e.js';

const _hoisted_1$1 = {
  viewBox: "0 0 24 24",
  width: "1.2em",
  height: "1.2em"
};
const _hoisted_2$1 = /*#__PURE__*/createElementVNode("path", {
  fill: "currentColor",
  d: "M11 15h2v2h-2v-2m0-8h2v6h-2V7m1-5C6.47 2 2 6.5 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2m0 18a8 8 0 0 1-8-8a8 8 0 0 1 8-8a8 8 0 0 1 8 8a8 8 0 0 1-8 8Z"
}, null, -1);
const _hoisted_3$1 = [
  _hoisted_2$1
];

function render$1(_ctx, _cache) {
  return (openBlock(), createElementBlock("svg", _hoisted_1$1, _hoisted_3$1))
}

const WarningIcon = { name: 'mdi-alert-circle-outline', render: render$1 };
/* vite-plugin-components disabled */

const _hoisted_1 = {
  viewBox: "0 0 24 24",
  width: "1.2em",
  height: "1.2em"
};
const _hoisted_2 = /*#__PURE__*/createElementVNode("path", {
  fill: "currentColor",
  d: "M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m0-18C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2m2.59 6L12 10.59L9.41 8L8 9.41L10.59 12L8 14.59L9.41 16L12 13.41L14.59 16L16 14.59L13.41 12L16 9.41L14.59 8Z"
}, null, -1);
const _hoisted_3 = [
  _hoisted_2
];

function render(_ctx, _cache) {
  return (openBlock(), createElementBlock("svg", _hoisted_1, _hoisted_3))
}

const ErrorIcon = { name: 'mdi-close-circle-outline', render };
/* vite-plugin-components disabled */

const { useTheme } = defineThemes({
  dark: {
    warning: {
      backgroundColor: appThemes.dark.warning.colorFaded,
      borderColor: appThemes.dark.warning.color,
      textColor: appThemes.dark.warning.color,
      icon: WarningIcon
    },
    error: {
      backgroundColor: appThemes.dark.error.colorFaded,
      borderColor: appThemes.dark.error.color,
      textColor: appThemes.dark.error.color,
      icon: ErrorIcon
    }
  },
  light: {
    warning: {
      backgroundColor: appThemes.light.warning.colorFaded,
      borderColor: appThemes.light.warning.color,
      textColor: darken(appThemes.light.warning.color, 40),
      icon: WarningIcon
    },
    error: {
      backgroundColor: appThemes.light.error.colorFaded,
      borderColor: appThemes.light.error.color,
      textColor: darken(appThemes.light.error.color, 40),
      icon: ErrorIcon
    }
  }
});

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "c-alert",
  __ssrInlineRender: true,
  props: {
    type: { default: "warning" },
    title: { default: void 0 }
  },
  setup(__props) {
    const props = __props;
    const { type, title } = toRefs(props);
    const theme = useTheme();
    const variantTheme = computed(() => theme.value[type.value]);
    return (_ctx, _push, _parent, _attrs) => {
      const _cssVars = { style: {
        "--2d6e05b1": unref(variantTheme).backgroundColor,
        "--a966dbdc": unref(variantTheme).textColor
      } };
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "c-alert",
        flex: "",
        "items-center": "",
        "b-rd-4px": "",
        "pa-5": ""
      }, _attrs, _cssVars))} data-v-d1c7f863><div class="c-alert--icon" mr-4 text-40px op-60 data-v-d1c7f863>`);
      ssrRenderSlot(_ctx.$slots, "icon", {}, () => {
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(variantTheme).icon), null, null), _parent);
      }, _push, _parent);
      _push(`</div><div class="c-alert--content" data-v-d1c7f863>`);
      if (unref(title)) {
        _push(`<div class="c-alert--title" text-15px fw-600 data-v-d1c7f863>${ssrInterpolate(unref(title))}</div>`);
      } else {
        _push(`<!---->`);
      }
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div></div>`);
    };
  }
});

/* unplugin-vue-components disabled */const cAlert_vue_vue_type_style_index_0_scoped_d1c7f863_lang = '';

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/ui/c-alert/c-alert.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __unplugin_components_3 = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-d1c7f863"]]);

export { __unplugin_components_3 as _ };
