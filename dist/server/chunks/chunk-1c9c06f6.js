import { openBlock, createElementBlock, createElementVNode, defineComponent, toRefs, computed, mergeProps, withCtx, unref, renderSlot, withDirectives, createVNode, vShow, useSSRContext, createBlock, resolveDynamicComponent, ref, createTextVNode, toDisplayString, isRef, Fragment, renderList, h, createCommentVNode, onMounted, createSSRApp } from 'vue';
import { defineStore, storeToRefs, createPinia } from 'pinia';
import { useHead, createHead } from '@vueuse/head';
import _, { noop } from 'lodash';
import HomePage, { c as config, u as useToolStore, _ as _sfc_main$b, t as tools, i as i18nPlugin } from '../entries/src_pages_Home-page.mjs';
import { create, NLayout, NLayoutSider, NIcon, useThemeVars, NCollapseTransition, NMenu, NH1, darkTheme, NGlobalStyle, NMessageProvider, NNotificationProvider, NConfigProvider } from 'naive-ui';
import { ssrRenderComponent, ssrRenderSlot, ssrRenderStyle, ssrRenderAttrs, ssrRenderVNode, ssrInterpolate, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
import { useRouter, useRoute, RouterLink, RouterView, createRouter, createMemoryHistory } from 'vue-router';
import { Sun, Moon, Home2 } from '@vicons/tabler';
import { u as useStyleStore, _ as _export_sfc, a as __unplugin_components_0$2 } from './chunk-6003391e.js';
import { _ as _sfc_main$a } from './chunk-8109fd17.js';
import { C as CLink, r as routes } from '../entries/src_ui_demo_demo-home-page.mjs';
import { _ as __unplugin_components_3 } from './chunk-4e7a6a8d.js';
import { _ as __unplugin_components_2 } from './chunk-6ba26b76.js';
import { _ as __unplugin_components_1 } from './chunk-8daff870.js';
import { u as useFuzzySearch } from './chunk-2ce6ed5e.js';
import { useMagicKeys, whenever, useStorage, syncRef } from '@vueuse/core';
import { _ as __unplugin_components_0$3 } from './chunk-89a4876c.js';
import { useI18n } from 'vue-i18n/dist/vue-i18n.runtime.esm-bundler.js';
import _sfc_main$c from '../entries/src_pages_404-page.mjs';

function createFakePlausibleInstance() {
  return {
    trackEvent: noop,
    enableAutoPageviews: () => noop
  };
}
function createPlausibleInstance({
  config: config2
}) {
  if (config2.isTrackerEnabled) {
    return config2;
  }
  return createFakePlausibleInstance();
}
const plausible = {
  install: (app) => {
    const plausible2 = createPlausibleInstance({ config: config.plausible });
    plausible2.enableAutoPageviews();
    app.provide("plausible", plausible2);
  }
};

const naive = create();

const lightThemeOverrides = {
  Menu: {
    itemHeight: "32px"
  },
  Layout: { color: "#f1f5f9" },
  AutoComplete: {
    peers: {
      InternalSelectMenu: { height: "500px" }
    }
  }
};
const darkThemeOverrides = {
  common: {
    primaryColor: "#1ea54cFF",
    primaryColorHover: "#36AD6AFF",
    primaryColorPressed: "#0C7A43FF",
    primaryColorSuppl: "#36AD6AFF"
  },
  Notification: {
    color: "#333333"
  },
  AutoComplete: {
    peers: {
      InternalSelectMenu: { height: "500px", color: "#1e1e1e" }
    }
  },
  Menu: {
    itemHeight: "32px"
  },
  Layout: {
    color: "#1c1c1c",
    siderColor: "#232323",
    siderBorderColor: "transparent"
  },
  Card: {
    color: "#232323",
    borderColor: "#282828"
  },
  Table: {
    tdColor: "#232323",
    thColor: "#353535"
  }
};

const _hoisted_1$6 = {
  viewBox: "0 0 24 24",
  width: "1.2em",
  height: "1.2em"
};
const _hoisted_2$6 = /*#__PURE__*/createElementVNode("path", {
  fill: "currentColor",
  d: "M8 3C5.79 3 4 4.79 4 7v7c0 1.1.9 2 2 2h3v4c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2v-4h3c1.1 0 2-.9 2-2V3H8m0 2h4v2h2V5h1v4h2V5h1v5H6V7c0-1.1.9-2 2-2m-2 9v-2h12v2H6Z"
}, null, -1);
const _hoisted_3$6 = [
  _hoisted_2$6
];

function render$6(_ctx, _cache) {
  return (openBlock(), createElementBlock("svg", _hoisted_1$6, _hoisted_3$6))
}

const __unplugin_components_0$1 = { name: 'mdi-brush-variant', render: render$6 };
/* vite-plugin-components disabled */

const _sfc_main$9 = /* @__PURE__ */ defineComponent({
  __name: "MenuLayout",
  __ssrInlineRender: true,
  setup(__props) {
    const styleStore = useStyleStore();
    const { isMenuCollapsed, isSmallScreen } = toRefs(styleStore);
    const siderPosition = computed(() => isSmallScreen.value ? "absolute" : "static");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_n_layout = NLayout;
      const _component_n_layout_sider = NLayoutSider;
      _push(ssrRenderComponent(_component_n_layout, mergeProps({ "has-sider": "" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_n_layout_sider, {
              bordered: "",
              "collapse-mode": "width",
              "collapsed-width": 0,
              width: 240,
              collapsed: unref(isMenuCollapsed),
              "show-trigger": false,
              "native-scrollbar": false,
              position: unref(siderPosition)
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  ssrRenderSlot(_ctx.$slots, "sider", {}, null, _push3, _parent3, _scopeId2);
                } else {
                  return [
                    renderSlot(_ctx.$slots, "sider", {}, void 0, true)
                  ];
                }
              }),
              _: 3
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_n_layout, { class: "content" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  ssrRenderSlot(_ctx.$slots, "content", {}, null, _push3, _parent3, _scopeId2);
                  _push3(`<div style="${ssrRenderStyle(unref(isSmallScreen) && !unref(isMenuCollapsed) ? null : { display: "none" })}" class="overlay" data-v-63c31e01${_scopeId2}></div>`);
                } else {
                  return [
                    renderSlot(_ctx.$slots, "content", {}, void 0, true),
                    withDirectives(createVNode("div", {
                      class: "overlay",
                      onClick: ($event) => isMenuCollapsed.value = true
                    }, null, 8, ["onClick"]), [
                      [vShow, unref(isSmallScreen) && !unref(isMenuCollapsed)]
                    ])
                  ];
                }
              }),
              _: 3
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_n_layout_sider, {
                bordered: "",
                "collapse-mode": "width",
                "collapsed-width": 0,
                width: 240,
                collapsed: unref(isMenuCollapsed),
                "show-trigger": false,
                "native-scrollbar": false,
                position: unref(siderPosition)
              }, {
                default: withCtx(() => [
                  renderSlot(_ctx.$slots, "sider", {}, void 0, true)
                ]),
                _: 3
              }, 8, ["collapsed", "position"]),
              createVNode(_component_n_layout, { class: "content" }, {
                default: withCtx(() => [
                  renderSlot(_ctx.$slots, "content", {}, void 0, true),
                  withDirectives(createVNode("div", {
                    class: "overlay",
                    onClick: ($event) => isMenuCollapsed.value = true
                  }, null, 8, ["onClick"]), [
                    [vShow, unref(isSmallScreen) && !unref(isMenuCollapsed)]
                  ])
                ]),
                _: 3
              })
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});

/* unplugin-vue-components disabled */const MenuLayout_vue_vue_type_style_index_0_scoped_63c31e01_lang = '';

const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/MenuLayout.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const MenuLayout = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["__scopeId", "data-v-63c31e01"]]);

const _sfc_main$8 = /* @__PURE__ */ defineComponent({
  __name: "NavbarButtons",
  __ssrInlineRender: true,
  setup(__props) {
    const styleStore = useStyleStore();
    const { isDarkTheme } = toRefs(styleStore);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_c_tooltip = _sfc_main$a;
      const _component_c_button = __unplugin_components_0$2;
      const _component_n_icon = NIcon;
      _push(ssrRenderComponent(_component_c_tooltip, mergeProps({
        tooltip: unref(isDarkTheme) ? _ctx.$t("home.nav.lightMode") : _ctx.$t("home.nav.darkMode"),
        position: "bottom"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_c_button, {
              circle: "",
              variant: "text",
              "aria-label": _ctx.$t("home.nav.mode"),
              onClick: () => unref(styleStore).toggleDark()
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (unref(isDarkTheme)) {
                    _push3(ssrRenderComponent(_component_n_icon, {
                      size: "25",
                      component: unref(Sun)
                    }, null, _parent3, _scopeId2));
                  } else {
                    _push3(ssrRenderComponent(_component_n_icon, {
                      size: "25",
                      component: unref(Moon)
                    }, null, _parent3, _scopeId2));
                  }
                } else {
                  return [
                    unref(isDarkTheme) ? (openBlock(), createBlock(_component_n_icon, {
                      key: 0,
                      size: "25",
                      component: unref(Sun)
                    }, null, 8, ["component"])) : (openBlock(), createBlock(_component_n_icon, {
                      key: 1,
                      size: "25",
                      component: unref(Moon)
                    }, null, 8, ["component"]))
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_c_button, {
                circle: "",
                variant: "text",
                "aria-label": _ctx.$t("home.nav.mode"),
                onClick: () => unref(styleStore).toggleDark()
              }, {
                default: withCtx(() => [
                  unref(isDarkTheme) ? (openBlock(), createBlock(_component_n_icon, {
                    key: 0,
                    size: "25",
                    component: unref(Sun)
                  }, null, 8, ["component"])) : (openBlock(), createBlock(_component_n_icon, {
                    key: 1,
                    size: "25",
                    component: unref(Moon)
                  }, null, 8, ["component"]))
                ]),
                _: 1
              }, 8, ["aria-label", "onClick"])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});

/* unplugin-vue-components disabled */const NavbarButtons_vue_vue_type_style_index_0_scoped_99ae5a21_lang = '';

const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/NavbarButtons.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const NavbarButtons = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["__scopeId", "data-v-99ae5a21"]]);

const _sfc_main$7 = /* @__PURE__ */ defineComponent({
  __name: "command-palette-option",
  __ssrInlineRender: true,
  props: {
    option: {},
    selected: { type: Boolean, default: false }
  },
  emits: ["activated"],
  setup(__props, { emit }) {
    const props = __props;
    const { option } = toRefs(props);
    const { selected } = toRefs(props);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        role: "option",
        "aria-selected": unref(selected),
        class: {
          "text-white": unref(selected),
          "bg-primary": unref(selected)
        },
        "w-full": "",
        flex: "",
        "cursor-pointer": "",
        "items-center": "",
        "overflow-hidden": "",
        rounded: "",
        "pa-3": "",
        transition: "",
        "hover:bg-primary": "",
        "hover:text-white": ""
      }, _attrs))}>`);
      if (unref(option).icon) {
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(option).icon), {
          "mr-3": "",
          "h-30px": "",
          "w-30px": "",
          "shrink-0": "",
          "op-50": ""
        }, null), _parent);
      } else {
        _push(`<!---->`);
      }
      _push(`<div flex-1 overflow-hidden><div truncate font-bold lh-tight op-90>${ssrInterpolate(unref(option).name)}</div>`);
      if (unref(option).description) {
        _push(`<div truncate lh-tight op-60>${ssrInterpolate(unref(option).description)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
});

const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/modules/command-palette/components/command-palette-option.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};

const _hoisted_1$5 = {
  viewBox: "0 0 24 24",
  width: "1.2em",
  height: "1.2em"
};
const _hoisted_2$5 = /*#__PURE__*/createElementVNode("path", {
  fill: "currentColor",
  d: "m3.55 19.09l1.41 1.41l1.8-1.79l-1.42-1.42M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6s6-2.69 6-6c0-3.32-2.69-6-6-6m8 7h3v-2h-3m-2.76 7.71l1.8 1.79l1.41-1.41l-1.79-1.8M20.45 5l-1.41-1.4l-1.8 1.79l1.42 1.42M13 1h-2v3h2M6.76 5.39L4.96 3.6L3.55 5l1.79 1.81l1.42-1.42M1 13h3v-2H1m12 9h-2v3h2"
}, null, -1);
const _hoisted_3$5 = [
  _hoisted_2$5
];

function render$5(_ctx, _cache) {
  return (openBlock(), createElementBlock("svg", _hoisted_1$5, _hoisted_3$5))
}

const SunIcon = { name: 'mdi-white-balance-sunny', render: render$5 };
/* vite-plugin-components disabled */

const _hoisted_1$4 = {
  viewBox: "0 0 24 24",
  width: "1.2em",
  height: "1.2em"
};
const _hoisted_2$4 = /*#__PURE__*/createElementVNode("path", {
  fill: "currentColor",
  d: "M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33c.85 0 1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z"
}, null, -1);
const _hoisted_3$4 = [
  _hoisted_2$4
];

function render$4(_ctx, _cache) {
  return (openBlock(), createElementBlock("svg", _hoisted_1$4, _hoisted_3$4))
}

const GithubIcon = { name: 'mdi-github', render: render$4 };
/* vite-plugin-components disabled */

const _hoisted_1$3 = {
  viewBox: "0 0 24 24",
  width: "1.2em",
  height: "1.2em"
};
const _hoisted_2$3 = /*#__PURE__*/createElementVNode("path", {
  fill: "currentColor",
  d: "M20 8h-2.81c-.45-.8-1.07-1.5-1.82-2L17 4.41L15.59 3l-2.17 2.17a6.002 6.002 0 0 0-2.83 0L8.41 3L7 4.41L8.62 6c-.75.5-1.36 1.21-1.81 2H4v2h2.09c-.06.33-.09.66-.09 1v1H4v2h2v1c0 .34.03.67.09 1H4v2h2.81A5.988 5.988 0 0 0 15 20.18c.91-.52 1.67-1.28 2.19-2.18H20v-2h-2.09c.06-.33.09-.66.09-1v-1h2v-2h-2v-1c0-.34-.03-.67-.09-1H20V8m-4 7a4 4 0 0 1-4 4a4 4 0 0 1-4-4v-4a4 4 0 0 1 4-4a4 4 0 0 1 4 4v4m-2-5v2h-4v-2h4m-4 4h4v2h-4v-2Z"
}, null, -1);
const _hoisted_3$3 = [
  _hoisted_2$3
];

function render$3(_ctx, _cache) {
  return (openBlock(), createElementBlock("svg", _hoisted_1$3, _hoisted_3$3))
}

const BugIcon = { name: 'mdi-bug-outline', render: render$3 };
/* vite-plugin-components disabled */

const _hoisted_1$2 = {
  viewBox: "0 0 24 24",
  width: "1.2em",
  height: "1.2em"
};
const _hoisted_2$2 = /*#__PURE__*/createElementVNode("path", {
  fill: "currentColor",
  d: "M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2m2 2a2 2 0 0 0-2 2a2 2 0 0 0 2 2a2 2 0 0 0 2-2a2 2 0 0 0-2-2m10 10a2 2 0 0 0-2 2a2 2 0 0 0 2 2a2 2 0 0 0 2-2a2 2 0 0 0-2-2m0-10a2 2 0 0 0-2 2a2 2 0 0 0 2 2a2 2 0 0 0 2-2a2 2 0 0 0-2-2m-5 5a2 2 0 0 0-2 2a2 2 0 0 0 2 2a2 2 0 0 0 2-2a2 2 0 0 0-2-2m-5 5a2 2 0 0 0-2 2a2 2 0 0 0 2 2a2 2 0 0 0 2-2a2 2 0 0 0-2-2Z"
}, null, -1);
const _hoisted_3$2 = [
  _hoisted_2$2
];

function render$2(_ctx, _cache) {
  return (openBlock(), createElementBlock("svg", _hoisted_1$2, _hoisted_3$2))
}

const DiceIcon = { name: 'mdi-dice-5', render: render$2 };
/* vite-plugin-components disabled */

const _hoisted_1$1 = {
  viewBox: "0 0 24 24",
  width: "1.2em",
  height: "1.2em"
};
const _hoisted_2$1 = /*#__PURE__*/createElementVNode("path", {
  fill: "currentColor",
  d: "M11 9h2V7h-2m1 13c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m0-18A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2m-1 15h2v-6h-2v6Z"
}, null, -1);
const _hoisted_3$1 = [
  _hoisted_2$1
];

function render$1(_ctx, _cache) {
  return (openBlock(), createElementBlock("svg", _hoisted_1$1, _hoisted_3$1))
}

const InfoIcon = { name: 'mdi-information-outline', render: render$1 };
/* vite-plugin-components disabled */

const useCommandPaletteStore = defineStore("command-palette", () => {
  const toolStore = useToolStore();
  const styleStore = useStyleStore();
  const router = useRouter();
  const searchPrompt = ref("");
  const toolsOptions = toolStore.tools.map((tool) => ({
    ...tool,
    to: tool.path,
    toolCategory: tool.category,
    category: "Tools"
  }));
  const searchOptions = [
    ...toolsOptions,
    {
      name: "Random tool",
      description: "Get a random tool from the list.",
      action: () => {
        const { path } = _.sample(toolStore.tools);
        router.push(path);
      },
      icon: DiceIcon,
      category: "Tools",
      keywords: ["random", "tool", "pick", "choose", "select"],
      closeOnSelect: true
    },
    {
      name: "Toggle dark mode",
      description: "Toggle dark mode on or off.",
      action: () => styleStore.toggleDark(),
      icon: SunIcon,
      category: "Actions",
      keywords: ["dark", "theme", "toggle", "mode", "light", "system"]
    },
    {
      name: "Github repository",
      href: "https://github.com/zeeklog/it-tools",
      category: "External",
      description: "View the source code of it-tools on Github.",
      keywords: ["github", "repo", "repository", "source", "code"],
      icon: GithubIcon
    },
    {
      name: "Report a bug or an issue",
      description: "Report a bug or an issue to help improve it-tools.",
      href: "https://github.com/zeeklog/it-tools/issues/new/choose",
      category: "Actions",
      keywords: ["report", "issue", "bug", "problem", "error"],
      icon: BugIcon
    },
    {
      name: "About",
      description: "Learn more about IT-Tools.",
      to: "/about",
      category: "Pages",
      keywords: ["about", "learn", "more", "info", "information"],
      icon: InfoIcon
    }
  ];
  const { searchResult } = useFuzzySearch({
    search: searchPrompt,
    data: searchOptions,
    options: {
      keys: [{ name: "name", weight: 2 }, "description", "keywords", "category"],
      threshold: 0.3
    }
  });
  const filteredSearchResult = computed(() => _.chain(searchResult.value).groupBy("category").mapValues((categoryOptions) => _.take(categoryOptions, 5)).value());
  return {
    filteredSearchResult,
    searchPrompt
  };
});

const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  __name: "command-palette",
  __ssrInlineRender: true,
  setup(__props) {
    const isModalOpen = ref(false);
    const inputRef = ref();
    const router = useRouter();
    const isMac = computed(() => true);
    const commandPaletteStore = useCommandPaletteStore();
    const { searchPrompt, filteredSearchResult } = storeToRefs(commandPaletteStore);
    const keys = useMagicKeys({
      passive: false,
      onEventFired(e) {
        if (e.ctrlKey && e.key === "k" && e.type === "keydown") {
          e.preventDefault();
        }
        if (e.metaKey && e.key === "k" && e.type === "keydown") {
          e.preventDefault();
        }
      }
    });
    whenever(isModalOpen, () => inputRef.value?.focus());
    whenever(keys.ctrl_k, open);
    whenever(keys.meta_k, open);
    whenever(keys.escape, close);
    function open() {
      return isModalOpen.value = true;
    }
    function close() {
      isModalOpen.value = false;
      searchPrompt.value = "";
    }
    const selectedOptionIndex = ref(0);
    function handleKeydown(event) {
      const { key } = event;
      const isEnterPressed = key === "Enter";
      const isArrowUpOrDown = ["ArrowUp", "ArrowDown"].includes(key);
      const isArrowDown = key === "ArrowDown";
      if (isArrowUpOrDown) {
        const increment = isArrowDown ? 1 : -1;
        const maxIndex = Math.max(_.chain(filteredSearchResult.value).values().flatten().size().value() - 1, 0);
        selectedOptionIndex.value = Math.min(Math.max(selectedOptionIndex.value + increment, 0), maxIndex);
        return;
      }
      if (isEnterPressed) {
        const option = _.chain(filteredSearchResult.value).values().flatten().nth(selectedOptionIndex.value).value();
        activateOption(option);
      }
    }
    function getOptionIndex(option) {
      return _.chain(filteredSearchResult.value).values().flatten().findIndex((o) => o === option).value();
    }
    function activateOption(option) {
      const { closeOnSelect } = option;
      if (option.action) {
        option.action();
        if (closeOnSelect) {
          close();
        }
        return;
      }
      const closeAfterNavigation = closeOnSelect || _.isUndefined(closeOnSelect);
      if (option.to) {
        router.push(option.to);
        if (closeAfterNavigation) {
          close();
        }
        return;
      }
      if (option.href) {
        window.open(option.href, "_blank");
        if (closeAfterNavigation) {
          close();
        }
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_c_button = __unplugin_components_0$2;
      const _component_icon_mdi_search = __unplugin_components_1;
      const _component_c_modal = __unplugin_components_2;
      const _component_c_input_text = __unplugin_components_3;
      const _component_command_palette_option = _sfc_main$7;
      _push(`<div${ssrRenderAttrs(mergeProps({ "flex-1": "" }, _attrs))} data-v-b415a78e>`);
      _push(ssrRenderComponent(_component_c_button, {
        "w-full": "",
        "important:justify-start": "",
        onClick: ($event) => isModalOpen.value = true
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span flex items-center gap-3 op-40 data-v-b415a78e${_scopeId}>`);
            _push2(ssrRenderComponent(_component_icon_mdi_search, null, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate(_ctx.$t("search.label"))} <span hidden flex-1 border border-current border-op-40 rounded border-solid px-5px py-3px sm:inline data-v-b415a78e${_scopeId}>${ssrInterpolate(unref(isMac) ? "Cmd" : "Ctrl")} + K </span></span>`);
          } else {
            return [
              createVNode("span", {
                flex: "",
                "items-center": "",
                "gap-3": "",
                "op-40": ""
              }, [
                createVNode(_component_icon_mdi_search),
                createTextVNode(" " + toDisplayString(_ctx.$t("search.label")) + " ", 1),
                createVNode("span", {
                  hidden: "",
                  "flex-1": "",
                  border: "",
                  "border-current": "",
                  "border-op-40": "",
                  rounded: "",
                  "border-solid": "",
                  "px-5px": "",
                  "py-3px": "",
                  "sm:inline": ""
                }, toDisplayString(unref(isMac) ? "Cmd" : "Ctrl") + " + K ", 1)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_c_modal, {
        open: unref(isModalOpen),
        "onUpdate:open": ($event) => isRef(isModalOpen) ? isModalOpen.value = $event : null,
        class: "palette-modal",
        "shadow-xl": "",
        "important:max-w-650px": "",
        "important:pa-12px": "",
        onKeydown: handleKeydown
      }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_c_input_text, {
              ref_key: "inputRef",
              ref: inputRef,
              value: unref(searchPrompt),
              "onUpdate:value": ($event) => isRef(searchPrompt) ? searchPrompt.value = $event : null,
              "raw-text": "",
              placeholder: "Type to search a tool or a command...",
              autofocus: "",
              clearable: ""
            }, null, _parent2, _scopeId));
            _push2(`<!--[-->`);
            ssrRenderList(unref(filteredSearchResult), (options, category) => {
              _push2(`<div data-v-b415a78e${_scopeId}><div ml-3 mt-3 text-sm font-bold text-primary op-60 data-v-b415a78e${_scopeId}>${ssrInterpolate(category)}</div><!--[-->`);
              ssrRenderList(options, (option) => {
                _push2(ssrRenderComponent(_component_command_palette_option, {
                  key: option.name,
                  option,
                  selected: unref(selectedOptionIndex) === getOptionIndex(option),
                  onActivated: activateOption
                }, null, _parent2, _scopeId));
              });
              _push2(`<!--]--></div>`);
            });
            _push2(`<!--]-->`);
          } else {
            return [
              createVNode(_component_c_input_text, {
                ref_key: "inputRef",
                ref: inputRef,
                value: unref(searchPrompt),
                "onUpdate:value": ($event) => isRef(searchPrompt) ? searchPrompt.value = $event : null,
                "raw-text": "",
                placeholder: "Type to search a tool or a command...",
                autofocus: "",
                clearable: ""
              }, null, 8, ["value", "onUpdate:value"]),
              (openBlock(true), createBlock(Fragment, null, renderList(unref(filteredSearchResult), (options, category) => {
                return openBlock(), createBlock("div", { key: category }, [
                  createVNode("div", {
                    "ml-3": "",
                    "mt-3": "",
                    "text-sm": "",
                    "font-bold": "",
                    "text-primary": "",
                    "op-60": ""
                  }, toDisplayString(category), 1),
                  (openBlock(true), createBlock(Fragment, null, renderList(options, (option) => {
                    return openBlock(), createBlock(_component_command_palette_option, {
                      key: option.name,
                      option,
                      selected: unref(selectedOptionIndex) === getOptionIndex(option),
                      onActivated: activateOption
                    }, null, 8, ["option", "selected"]);
                  }), 128))
                ]);
              }), 128))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});

/* unplugin-vue-components disabled */const commandPalette_vue_vue_type_style_index_0_scoped_b415a78e_lang = '';

const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/modules/command-palette/command-palette.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const CommandPalette = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["__scopeId", "data-v-b415a78e"]]);

const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "locale-selector",
  __ssrInlineRender: true,
  setup(__props) {
    const { availableLocales, locale } = useI18n();
    const localesLong = {
      en: "English",
      es: "Español",
      fr: "Français",
      pt: "Português",
      ru: "Русский",
      uk: "Українська",
      zh: "中文",
      vi: "Tiếng Việt"
    };
    const localeOptions = computed(
      () => availableLocales.map((locale2) => ({
        label: localesLong[locale2] ?? locale2,
        value: locale2
      }))
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(__unplugin_components_0$3, mergeProps({
        value: unref(locale),
        "onUpdate:value": ($event) => isRef(locale) ? locale.value = $event : null,
        options: unref(localeOptions),
        placeholder: "Select a language",
        "w-100px": ""
      }, _attrs), null, _parent));
    };
  }
});

const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/modules/i18n/components/locale-selector.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};

const _hoisted_1 = {
  viewBox: "0 0 24 24",
  width: "1.2em",
  height: "1.2em"
};
const _hoisted_2 = /*#__PURE__*/createElementVNode("path", {
  fill: "currentColor",
  d: "M8.59 16.58L13.17 12L8.59 7.41L10 6l6 6l-6 6l-1.41-1.42Z"
}, null, -1);
const _hoisted_3 = [
  _hoisted_2
];

function render(_ctx, _cache) {
  return (openBlock(), createElementBlock("svg", _hoisted_1, _hoisted_3))
}

const __unplugin_components_0 = { name: 'mdi-chevron-right', render };
/* vite-plugin-components disabled */

const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "MenuIconItem",
  __ssrInlineRender: true,
  props: {
    tool: {}
  },
  setup(__props) {
    const props = __props;
    const { tool } = toRefs(props);
    const theme = useThemeVars();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_n_icon = NIcon;
      const _cssVars = { style: {
        "--c9671612": unref(theme).primaryColor
      } };
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "menu-icon-item" }, _attrs, _cssVars))} data-v-962461ab>`);
      _push(ssrRenderComponent(_component_n_icon, {
        component: unref(tool).icon
      }, null, _parent));
      if (unref(tool).isNew) {
        _push(`<div class="badge" data-v-962461ab></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});

/* unplugin-vue-components disabled */const MenuIconItem_vue_vue_type_style_index_0_scoped_962461ab_lang = '';

const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/MenuIconItem.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const MenuIconItem = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-962461ab"]]);

const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "CollapsibleToolMenu",
  __ssrInlineRender: true,
  props: {
    toolsByCategory: { default: () => [] }
  },
  setup(__props) {
    const props = __props;
    const { toolsByCategory } = toRefs(props);
    const route = useRoute();
    const makeLabel = (tool) => () => h(RouterLink, { to: tool.path }, { default: () => tool.name });
    const makeIcon = (tool) => () => h(MenuIconItem, { tool });
    const collapsedCategories = useStorage(
      "menu-tool-option:collapsed-categories",
      {},
      void 0,
      {
        deep: true,
        serializer: {
          read: (v) => v ? JSON.parse(v) : null,
          write: (v) => JSON.stringify(v)
        }
      }
    );
    function toggleCategoryCollapse({ name }) {
      collapsedCategories.value[name] = !collapsedCategories.value[name];
    }
    const menuOptions = computed(
      () => toolsByCategory.value.map(({ name, components }) => ({
        name,
        isCollapsed: collapsedCategories.value[name],
        tools: components.map((tool) => ({
          label: makeLabel(tool),
          icon: makeIcon(tool),
          key: tool.path
        }))
      }))
    );
    const themeVars = useThemeVars();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_icon_mdi_chevron_right = __unplugin_components_0;
      const _component_n_collapse_transition = NCollapseTransition;
      const _component_n_menu = NMenu;
      ({ style: {
        "--2adda884": unref(themeVars).textColor3
      } });
      _push(`<!--[-->`);
      ssrRenderList(unref(menuOptions), ({ name, tools, isCollapsed }) => {
        _push(`<div data-v-50838923><div ml-6px mt-12px flex cursor-pointer items-center op-60 data-v-50838923><span class="${ssrRenderClass({ "rotate-0": isCollapsed, "rotate-90": !isCollapsed })}" text-16px lh-1 op-50 transition-transform data-v-50838923>`);
        _push(ssrRenderComponent(_component_icon_mdi_chevron_right, null, null, _parent));
        _push(`</span><span ml-8px text-13px data-v-50838923>${ssrInterpolate(name)}</span></div>`);
        _push(ssrRenderComponent(_component_n_collapse_transition, {
          show: !isCollapsed
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="menu-wrapper" data-v-50838923${_scopeId}><div class="toggle-bar" data-v-50838923${_scopeId}></div>`);
              _push2(ssrRenderComponent(_component_n_menu, {
                class: "menu",
                value: unref(route).path,
                "collapsed-width": 64,
                "collapsed-icon-size": 22,
                options: tools,
                indent: 8,
                "default-expand-all": true
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              return [
                createVNode("div", { class: "menu-wrapper" }, [
                  createVNode("div", {
                    class: "toggle-bar",
                    onClick: ($event) => toggleCategoryCollapse({ name })
                  }, null, 8, ["onClick"]),
                  createVNode(_component_n_menu, {
                    class: "menu",
                    value: unref(route).path,
                    "collapsed-width": 64,
                    "collapsed-icon-size": 22,
                    options: tools,
                    indent: 8,
                    "default-expand-all": true
                  }, null, 8, ["value", "options"])
                ])
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</div>`);
      });
      _push(`<!--]-->`);
    };
  }
});

/* unplugin-vue-components disabled */const CollapsibleToolMenu_vue_vue_type_style_index_0_scoped_50838923_lang = '';

const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/CollapsibleToolMenu.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const CollapsibleToolMenu = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-50838923"]]);

const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "base.layout",
  __ssrInlineRender: true,
  setup(__props) {
    const themeVars = useThemeVars();
    const styleStore = useStyleStore();
    const version = config.app.version;
    const commitSha = config.app.lastCommitSha.slice(0, 7);
    const { t } = useI18n();
    const toolStore = useToolStore();
    const { favoriteTools, toolsByCategory } = storeToRefs(toolStore);
    const tools = computed(() => [
      ...favoriteTools.value.length > 0 ? [{ name: t("tools.categories.favorite-tools"), components: favoriteTools.value }] : [],
      ...toolsByCategory.value
    ]);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_icon_mdi58brush_variant = __unplugin_components_0$1;
      const _cssVars = { style: {
        "--525f0447": unref(themeVars).primaryColor
      } };
      _push(ssrRenderComponent(MenuLayout, mergeProps({
        class: ["menu-layout", { isSmallScreen: unref(styleStore).isSmallScreen }]
      }, _attrs, _cssVars), {
        sider: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(RouterLink), {
              to: "/",
              class: "hero-wrapper"
            }, null, _parent2, _scopeId));
            _push2(`<div class="sider-content" data-v-311f4fa3${_scopeId}>`);
            if (unref(styleStore).isSmallScreen) {
              _push2(`<div flex flex-col items-center data-v-311f4fa3${_scopeId}>`);
              _push2(ssrRenderComponent(_sfc_main$5, { w: "90%" }, null, _parent2, _scopeId));
              _push2(`<div flex justify-center data-v-311f4fa3${_scopeId}>`);
              _push2(ssrRenderComponent(NavbarButtons, null, null, _parent2, _scopeId));
              _push2(`</div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(CollapsibleToolMenu, { "tools-by-category": unref(tools) }, null, _parent2, _scopeId));
            _push2(`<div class="footer" data-v-311f4fa3${_scopeId}><div data-v-311f4fa3${_scopeId}> IT-Tools `);
            _push2(ssrRenderComponent(CLink, {
              target: "_blank",
              rel: "noopener",
              href: `https://github.com/zeeklog/it-tools/tree/v${unref(version)}`
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` v${ssrInterpolate(unref(version))}`);
                } else {
                  return [
                    createTextVNode(" v" + toDisplayString(unref(version)), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            if (unref(commitSha) && unref(commitSha).length > 0) {
              _push2(`<!--[--> - `);
              _push2(ssrRenderComponent(CLink, {
                target: "_blank",
                rel: "noopener",
                type: "primary",
                href: `https://github.com/zeeklog/it-tools/tree/${unref(commitSha)}`
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(unref(commitSha))}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(unref(commitSha)), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`<!--]-->`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div data-v-311f4fa3${_scopeId}> © ${ssrInterpolate(( new Date()).getFullYear())} `);
            _push2(ssrRenderComponent(CLink, {
              target: "_blank",
              rel: "noopener",
              href: "https://github.com/zeeklog"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Ne0inHK `);
                } else {
                  return [
                    createTextVNode(" Ne0inHK ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div></div>`);
          } else {
            return [
              createVNode(unref(RouterLink), {
                to: "/",
                class: "hero-wrapper"
              }),
              createVNode("div", { class: "sider-content" }, [
                unref(styleStore).isSmallScreen ? (openBlock(), createBlock("div", {
                  key: 0,
                  flex: "",
                  "flex-col": "",
                  "items-center": ""
                }, [
                  createVNode(_sfc_main$5, { w: "90%" }),
                  createVNode("div", {
                    flex: "",
                    "justify-center": ""
                  }, [
                    createVNode(NavbarButtons)
                  ])
                ])) : createCommentVNode("", true),
                createVNode(CollapsibleToolMenu, { "tools-by-category": unref(tools) }, null, 8, ["tools-by-category"]),
                createVNode("div", { class: "footer" }, [
                  createVNode("div", null, [
                    createTextVNode(" IT-Tools "),
                    createVNode(CLink, {
                      target: "_blank",
                      rel: "noopener",
                      href: `https://github.com/zeeklog/it-tools/tree/v${unref(version)}`
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" v" + toDisplayString(unref(version)), 1)
                      ]),
                      _: 1
                    }, 8, ["href"]),
                    unref(commitSha) && unref(commitSha).length > 0 ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                      createTextVNode(" - "),
                      createVNode(CLink, {
                        target: "_blank",
                        rel: "noopener",
                        type: "primary",
                        href: `https://github.com/zeeklog/it-tools/tree/${unref(commitSha)}`
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(unref(commitSha)), 1)
                        ]),
                        _: 1
                      }, 8, ["href"])
                    ], 64)) : createCommentVNode("", true)
                  ]),
                  createVNode("div", null, [
                    createTextVNode(" © " + toDisplayString((/* @__PURE__ */ new Date()).getFullYear()) + " ", 1),
                    createVNode(CLink, {
                      target: "_blank",
                      rel: "noopener",
                      href: "https://github.com/zeeklog"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Ne0inHK ")
                      ]),
                      _: 1
                    })
                  ])
                ])
              ])
            ];
          }
        }),
        content: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div flex items-center justify-center gap-2 data-v-311f4fa3${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$a, {
              tooltip: _ctx.$t("home.home"),
              position: "bottom"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(__unplugin_components_0$2, {
                    to: "/",
                    circle: "",
                    variant: "text",
                    "aria-label": _ctx.$t("home.home")
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(NIcon), {
                          size: "25",
                          component: unref(Home2)
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(NIcon), {
                            size: "25",
                            component: unref(Home2)
                          }, null, 8, ["component"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(__unplugin_components_0$2, {
                      to: "/",
                      circle: "",
                      variant: "text",
                      "aria-label": _ctx.$t("home.home")
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(NIcon), {
                          size: "25",
                          component: unref(Home2)
                        }, null, 8, ["component"])
                      ]),
                      _: 1
                    }, 8, ["aria-label"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$a, {
              tooltip: _ctx.$t("home.uiLib"),
              position: "bottom"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (unref(config).app.env === "development") {
                    _push3(ssrRenderComponent(__unplugin_components_0$2, {
                      to: "/c-lib",
                      circle: "",
                      variant: "text",
                      "aria-label": _ctx.$t("home.uiLib")
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_icon_mdi58brush_variant, { "text-20px": "" }, null, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_icon_mdi58brush_variant, { "text-20px": "" })
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                } else {
                  return [
                    unref(config).app.env === "development" ? (openBlock(), createBlock(__unplugin_components_0$2, {
                      key: 0,
                      to: "/c-lib",
                      circle: "",
                      variant: "text",
                      "aria-label": _ctx.$t("home.uiLib")
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_icon_mdi58brush_variant, { "text-20px": "" })
                      ]),
                      _: 1
                    }, 8, ["aria-label"])) : createCommentVNode("", true)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(CommandPalette, null, null, _parent2, _scopeId));
            if (!unref(styleStore).isSmallScreen) {
              _push2(ssrRenderComponent(_sfc_main$5, null, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div data-v-311f4fa3${_scopeId}>`);
            if (!unref(styleStore).isSmallScreen) {
              _push2(ssrRenderComponent(NavbarButtons, null, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div>`);
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              createVNode("div", {
                flex: "",
                "items-center": "",
                "justify-center": "",
                "gap-2": ""
              }, [
                createVNode(_sfc_main$a, {
                  tooltip: _ctx.$t("home.home"),
                  position: "bottom"
                }, {
                  default: withCtx(() => [
                    createVNode(__unplugin_components_0$2, {
                      to: "/",
                      circle: "",
                      variant: "text",
                      "aria-label": _ctx.$t("home.home")
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(NIcon), {
                          size: "25",
                          component: unref(Home2)
                        }, null, 8, ["component"])
                      ]),
                      _: 1
                    }, 8, ["aria-label"])
                  ]),
                  _: 1
                }, 8, ["tooltip"]),
                createVNode(_sfc_main$a, {
                  tooltip: _ctx.$t("home.uiLib"),
                  position: "bottom"
                }, {
                  default: withCtx(() => [
                    unref(config).app.env === "development" ? (openBlock(), createBlock(__unplugin_components_0$2, {
                      key: 0,
                      to: "/c-lib",
                      circle: "",
                      variant: "text",
                      "aria-label": _ctx.$t("home.uiLib")
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_icon_mdi58brush_variant, { "text-20px": "" })
                      ]),
                      _: 1
                    }, 8, ["aria-label"])) : createCommentVNode("", true)
                  ]),
                  _: 1
                }, 8, ["tooltip"]),
                createVNode(CommandPalette),
                !unref(styleStore).isSmallScreen ? (openBlock(), createBlock(_sfc_main$5, { key: 0 })) : createCommentVNode("", true),
                createVNode("div", null, [
                  !unref(styleStore).isSmallScreen ? (openBlock(), createBlock(NavbarButtons, { key: 0 })) : createCommentVNode("", true)
                ])
              ]),
              renderSlot(_ctx.$slots, "default", {}, void 0, true)
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});

/* unplugin-vue-components disabled */const base_layout_vue_vue_type_style_index_0_scoped_311f4fa3_lang = '';

const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/layouts/base.layout.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const BaseLayout = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-311f4fa3"]]);

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "tool.layout",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const head = computed(() => ({
      title: `${route.meta.name} - Zeeklog Online Tools`,
      meta: [
        {
          name: "description",
          content: route.meta?.description
        },
        {
          name: "keywords",
          content: (route.meta.keywords ?? []).join(",")
        }
      ]
    }));
    useHead(head);
    const { t } = useI18n();
    const i18nKey = computed(() => route.path.trim().replace("/", ""));
    const toolTitle = computed(() => t(`tools.${i18nKey.value}.title`, String(route.meta.name)));
    const toolDescription = computed(() => t(`tools.${i18nKey.value}.description`, String(route.meta.description)));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_n_h1 = NH1;
      _push(ssrRenderComponent(BaseLayout, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="tool-layout" data-v-bc13a56b${_scopeId}><div class="tool-header" data-v-bc13a56b${_scopeId}><div flex flex-nowrap items-center justify-between data-v-bc13a56b${_scopeId}>`);
            _push2(ssrRenderComponent(_component_n_h1, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(unref(toolTitle))}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(unref(toolTitle)), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<div data-v-bc13a56b${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$b, {
              tool: { name: unref(route).meta.name }
            }, null, _parent2, _scopeId));
            _push2(`</div></div><div class="separator" data-v-bc13a56b${_scopeId}></div><div class="description" data-v-bc13a56b${_scopeId}>${ssrInterpolate(unref(toolDescription))}</div></div></div><div class="tool-content" data-v-bc13a56b${_scopeId}>`);
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "tool-layout" }, [
                createVNode("div", { class: "tool-header" }, [
                  createVNode("div", {
                    flex: "",
                    "flex-nowrap": "",
                    "items-center": "",
                    "justify-between": ""
                  }, [
                    createVNode(_component_n_h1, null, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(unref(toolTitle)), 1)
                      ]),
                      _: 1
                    }),
                    createVNode("div", null, [
                      createVNode(_sfc_main$b, {
                        tool: { name: unref(route).meta.name }
                      }, null, 8, ["tool"])
                    ])
                  ]),
                  createVNode("div", { class: "separator" }),
                  createVNode("div", { class: "description" }, toDisplayString(unref(toolDescription)), 1)
                ])
              ]),
              createVNode("div", { class: "tool-content" }, [
                renderSlot(_ctx.$slots, "default", {}, void 0, true)
              ])
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});

/* unplugin-vue-components disabled */const tool_layout_vue_vue_type_style_index_0_scoped_bc13a56b_lang = '';

const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/layouts/tool.layout.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const ToolLayout = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-bc13a56b"]]);

const layouts = {
  base: BaseLayout,
  toolLayout: ToolLayout
};

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "App",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const layout = computed(() => route?.meta?.layout ?? layouts.base);
    const styleStore = useStyleStore();
    const theme = computed(() => styleStore.isDarkTheme ? darkTheme : null);
    const themeOverrides = computed(() => styleStore.isDarkTheme ? darkThemeOverrides : lightThemeOverrides);
    const { locale } = useI18n();
    syncRef(
      locale,
      useStorage("locale", locale)
    );
    onMounted(() => {
      console.log("APP MOUNTED");
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_n_config_provider = NConfigProvider;
      _push(ssrRenderComponent(_component_n_config_provider, mergeProps({
        theme: unref(theme),
        "theme-overrides": unref(themeOverrides)
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(NGlobalStyle), null, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(NMessageProvider), { placement: "bottom" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(NNotificationProvider), { placement: "bottom-right" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        ssrRenderVNode(_push4, createVNode(resolveDynamicComponent(unref(layout)), null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(RouterView), null, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(unref(RouterView))
                              ];
                            }
                          }),
                          _: 1
                        }), _parent4, _scopeId3);
                      } else {
                        return [
                          (openBlock(), createBlock(resolveDynamicComponent(unref(layout)), null, {
                            default: withCtx(() => [
                              createVNode(unref(RouterView))
                            ]),
                            _: 1
                          }))
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(NNotificationProvider), { placement: "bottom-right" }, {
                      default: withCtx(() => [
                        (openBlock(), createBlock(resolveDynamicComponent(unref(layout)), null, {
                          default: withCtx(() => [
                            createVNode(unref(RouterView))
                          ]),
                          _: 1
                        }))
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(NGlobalStyle)),
              createVNode(unref(NMessageProvider), { placement: "bottom" }, {
                default: withCtx(() => [
                  createVNode(unref(NNotificationProvider), { placement: "bottom-right" }, {
                    default: withCtx(() => [
                      (openBlock(), createBlock(resolveDynamicComponent(unref(layout)), null, {
                        default: withCtx(() => [
                          createVNode(unref(RouterView))
                        ]),
                        _: 1
                      }))
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});

/* unplugin-vue-components disabled */const App_vue_vue_type_style_index_0_lang = '';

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/App.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

const toolsRoutes = tools.map(({ path, name, component, ...config2 }) => ({
  path,
  name,
  component,
  meta: { isTool: true, layout: layouts.toolLayout, name, ...config2 }
}));
const toolsRedirectRoutes = tools.filter(({ redirectFrom }) => redirectFrom && redirectFrom.length > 0).flatMap(
  ({ path, redirectFrom }) => redirectFrom?.map((redirectSource) => ({ path: redirectSource, redirect: path })) ?? []
);
const router = createRouter({
  history: createMemoryHistory(config.app.baseUrl),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomePage
    },
    {
      path: "/about",
      name: "about",
      component: () => import('./chunk-e30e03ef.js')
    },
    ...toolsRoutes,
    ...toolsRedirectRoutes,
    ...config.app.env === "development" ? routes : [],
    { path: "/:pathMatch(.*)*", name: "NotFound", component: _sfc_main$c }
  ]
});

function createApp() {
  const app = createSSRApp(_sfc_main);
  const pinia = createPinia();
  app.use(pinia);
  app.use(createHead());
  app.use(i18nPlugin);
  app.use(router);
  app.use(plausible);
  app.use(naive);
  return { app, router, pinia, i18n: i18nPlugin };
}

const __uno = '';

export { createApp as c };
