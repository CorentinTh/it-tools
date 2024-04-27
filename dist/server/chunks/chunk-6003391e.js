import { watch, computed, defineComponent, toRefs, unref, createVNode, resolveDynamicComponent, mergeProps, withCtx, renderSlot, useSSRContext } from 'vue';
import { ssrRenderVNode, ssrRenderSlot } from 'vue/server-renderer';
import { useDark, useToggle, useMediaQuery, useStorage } from '@vueuse/core';
import { defineStore } from 'pinia';

const useStyleStore = defineStore("style", {
  state: () => {
    const isDarkTheme = useDark();
    const toggleDark = useToggle(isDarkTheme);
    const isSmallScreen = useMediaQuery("(max-width: 700px)");
    const isMenuCollapsed = useStorage("isMenuCollapsed", isSmallScreen.value);
    watch(isSmallScreen, (v) => isMenuCollapsed.value = v);
    return {
      isDarkTheme,
      toggleDark,
      isMenuCollapsed,
      isSmallScreen
    };
  }
});

function defineThemes(themes) {
  return {
    themes,
    useTheme() {
      const styleStore = useStyleStore();
      return computed(() => themes[styleStore.isDarkTheme ? "dark" : "light"]);
    }
  };
}

const { themes: appThemes, useTheme: useAppTheme } = defineThemes({
  light: {
    background: "#ffffff",
    text: {
      baseColor: "#333639",
      mutedColor: "#767c82"
    },
    default: {
      color: "rgba(46, 51, 56, 0.05)",
      colorHover: "rgba(46, 51, 56, 0.09)",
      colorPressed: "rgba(46, 51, 56, 0.22)"
    },
    primary: {
      color: "#18a058",
      colorHover: "#1ea54c",
      colorPressed: "#0C7A43",
      colorFaded: "#18a0582f"
    },
    warning: {
      color: "#f59e0b",
      colorHover: "#f59e0b",
      colorPressed: "#f59e0b",
      colorFaded: "#f59e0b2f"
    },
    success: {
      color: "#18a058",
      colorHover: "#36ad6a",
      colorPressed: "#0c7a43",
      colorFaded: "#18a0582f"
    },
    error: {
      color: "#d03050",
      colorHover: "#de576d",
      colorPressed: "#ab1f3f",
      colorFaded: "#d030502a"
    }
  },
  dark: {
    background: "#1e1e1e",
    text: {
      baseColor: "#ffffffd1",
      mutedColor: "#ffffff80"
    },
    default: {
      color: "rgba(255, 255, 255, 0.08)",
      colorHover: "rgba(255, 255, 255, 0.12)",
      colorPressed: "rgba(255, 255, 255, 0.24)"
    },
    primary: {
      color: "#1ea54c",
      colorHover: "#36AD6A",
      colorPressed: "#0C7A43",
      colorFaded: "#18a0582f"
    },
    warning: {
      color: "#f59e0b",
      colorHover: "#f59e0b",
      colorPressed: "#f59e0b",
      colorFaded: "#f59e0b2f"
    },
    success: {
      color: "#18a058",
      colorHover: "#36ad6a",
      colorPressed: "#0c7a43",
      colorFaded: "#18a0582f"
    },
    error: {
      color: "#e88080",
      colorHover: "#e98b8b",
      colorPressed: "#e57272",
      colorFaded: "#e8808029"
    }
  }
});

const clampHex = (value) => Math.max(0, Math.min(255, Math.round(value)));
function lighten(color, amount) {
  const alpha = color.length === 9 ? color.slice(7) : "";
  const num = Number.parseInt(color.slice(1, 7), 16);
  const r = clampHex((num >> 16 & 255) + amount);
  const g = clampHex((num >> 8 & 255) + amount);
  const b = clampHex((num & 255) + amount);
  return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, "0")}${alpha}`;
}
function darken(color, amount) {
  return lighten(color, -amount);
}

function createState({
  textColor,
  backgroundColor,
  hoverBackground,
  hoveredTextColor = textColor,
  pressedBackground,
  pressedTextColor = textColor
}) {
  return {
    textColor,
    backgroundColor,
    hover: { textColor: hoveredTextColor, backgroundColor: hoverBackground },
    pressed: { textColor: pressedTextColor, backgroundColor: pressedBackground }
  };
}
function createTheme({ style }) {
  const theme = appThemes[style];
  return {
    size: {
      small: {
        width: "28px",
        fontSize: "12px"
      },
      medium: {
        width: "34px",
        fontSize: "14px"
      },
      large: {
        width: "40px",
        fontSize: "16px"
      }
    },
    basic: {
      default: createState({
        textColor: theme.text.baseColor,
        backgroundColor: theme.default.color,
        hoverBackground: theme.default.colorHover,
        pressedBackground: theme.default.colorPressed
      }),
      primary: createState({
        textColor: theme.primary.color,
        backgroundColor: theme.primary.colorFaded,
        hoverBackground: lighten(theme.primary.colorFaded, 30),
        pressedBackground: darken(theme.primary.colorFaded, 30)
      }),
      warning: createState({
        textColor: theme.warning.color,
        backgroundColor: theme.warning.colorFaded,
        hoverBackground: lighten(theme.warning.colorFaded, 30),
        pressedBackground: darken(theme.warning.colorFaded, 30)
      }),
      error: createState({
        textColor: theme.error.color,
        backgroundColor: theme.error.colorFaded,
        hoverBackground: lighten(theme.error.colorFaded, 30),
        pressedBackground: darken(theme.error.colorFaded, 30)
      })
    },
    text: {
      default: createState({
        textColor: theme.text.baseColor,
        backgroundColor: "transparent",
        hoverBackground: theme.default.colorHover,
        pressedBackground: theme.default.colorPressed
      }),
      primary: createState({
        textColor: theme.primary.color,
        backgroundColor: "transparent",
        hoverBackground: theme.primary.colorFaded,
        pressedBackground: darken(theme.primary.colorFaded, 30)
      }),
      warning: createState({
        textColor: darken(theme.warning.color, 20),
        backgroundColor: "transparent",
        hoverBackground: theme.warning.colorFaded,
        pressedBackground: darken(theme.warning.colorFaded, 30)
      }),
      error: createState({
        textColor: darken(theme.error.color, 20),
        backgroundColor: "transparent",
        hoverBackground: theme.error.colorFaded,
        pressedBackground: darken(theme.error.colorFaded, 30)
      })
    }
  };
}
const { useTheme } = defineThemes({
  dark: createTheme({ style: "dark" }),
  light: createTheme({ style: "light" })
});

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "c-button",
  __ssrInlineRender: true,
  props: {
    type: { default: "default" },
    variant: { default: "basic" },
    disabled: { type: Boolean, default: false },
    round: { type: Boolean, default: false },
    circle: { type: Boolean, default: false },
    href: { default: void 0 },
    to: { default: void 0 },
    size: { default: "medium" }
  },
  emits: ["click"],
  setup(__props, { emit: emits }) {
    const props = __props;
    const { variant, disabled, round, circle, href, type, to, size: sizeName } = toRefs(props);
    function handleClick(event) {
      if (!disabled.value) {
        emits("click", event);
      }
    }
    const theme = useTheme();
    const variantTheme = computed(() => theme.value[variant.value][type.value]);
    const tag = computed(() => {
      if (href.value) {
        return "a";
      }
      if (to.value) {
        return "router-link";
      }
      return "button";
    });
    const appTheme = useAppTheme();
    const size = computed(() => theme.value.size[sizeName.value]);
    return (_ctx, _push, _parent, _attrs) => {
      const _cssVars = { style: {
        "--9a468bfe": unref(size).fontSize,
        "--09441655": unref(size).width,
        "--e1cab870": unref(variantTheme).textColor,
        "--645976e7": unref(variantTheme).backgroundColor,
        "--cea95e96": unref(variantTheme).hover.backgroundColor,
        "--369e4b1b": unref(variantTheme).pressed.backgroundColor,
        "--c8f65826": unref(appTheme).primary.color
      } };
      ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(tag)), mergeProps({
        href: unref(href) ?? unref(to),
        class: ["c-button", { disabled: unref(disabled), round: unref(round), circle: unref(circle) }],
        to: unref(to),
        onClick: handleClick
      }, _attrs, _cssVars), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default", {}, void 0, true)
            ];
          }
        }),
        _: 3
      }), _parent);
    };
  }
});

/* unplugin-vue-components disabled */const cButton_vue_vue_type_style_index_0_scoped_147876cf_lang = '';

const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/ui/c-button/c-button.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __unplugin_components_0 = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-147876cf"]]);

export { _export_sfc as _, __unplugin_components_0 as a, appThemes as b, useAppTheme as c, defineThemes as d, darken as e, useStyleStore as u };
