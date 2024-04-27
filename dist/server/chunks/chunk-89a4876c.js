import { openBlock, createElementBlock, createElementVNode, defineComponent, toRefs, computed, ref, shallowRef, nextTick, watch, unref, mergeProps, withCtx, createVNode, renderSlot, withDirectives, createBlock, isRef, vModelText, toDisplayString, Transition, Fragment, renderList, vShow, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderClass, ssrRenderSlot, ssrRenderAttr, ssrInterpolate, ssrRenderStyle, ssrRenderList } from 'vue/server-renderer';
import { d as defineThemes, b as appThemes, c as useAppTheme, _ as _export_sfc } from './chunk-6003391e.js';
import { _ as _sfc_main$1 } from './chunk-bb5bb4f6.js';
import { u as useFuzzySearch } from './chunk-2ce6ed5e.js';
import { useMagicKeys, useVModel, whenever, onClickOutside } from '@vueuse/core';

const _hoisted_1 = {
  viewBox: "0 0 24 24",
  width: "1.2em",
  height: "1.2em"
};
const _hoisted_2 = /*#__PURE__*/createElementVNode("path", {
  fill: "currentColor",
  d: "M7.41 8.58L12 13.17l4.59-4.59L18 10l-6 6l-6-6l1.41-1.42Z"
}, null, -1);
const _hoisted_3 = [
  _hoisted_2
];

function render(_ctx, _cache) {
  return (openBlock(), createElementBlock("svg", _hoisted_1, _hoisted_3))
}

const __unplugin_components_0$1 = { name: 'mdi-chevron-down', render };
/* vite-plugin-components disabled */

const sizes = {
  small: {
    height: "28px",
    fontSize: "12px"
  },
  medium: {
    height: "34px",
    fontSize: "14px"
  },
  large: {
    height: "40px",
    fontSize: "16px"
  }
};
const { useTheme } = defineThemes({
  dark: {
    sizes,
    backgroundColor: "#333333",
    borderColor: "#333333",
    dropdownShadow: "rgba(0, 0, 0, 0.2) 0px 8px 24px",
    option: {
      hover: {
        backgroundColor: "#444444"
      },
      active: {
        textColor: appThemes.dark.primary.color
      }
    },
    focus: {
      backgroundColor: "#1ea54c1a"
    }
  },
  light: {
    sizes,
    backgroundColor: "#ffffff",
    borderColor: "#e0e0e69e",
    dropdownShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
    option: {
      hover: {
        backgroundColor: "#eee"
      },
      active: {
        textColor: appThemes.light.primary.color
      }
    },
    focus: {
      backgroundColor: "#ffffff"
    }
  }
});

function clamp({ value, min = 0, max = 100 }) {
  return Math.min(Math.max(value, min), max);
}

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "c-select",
  __ssrInlineRender: true,
  props: {
    options: { default: () => [] },
    value: { default: void 0 },
    placeholder: { default: void 0 },
    size: { default: "medium" },
    searchable: { type: Boolean, default: false },
    label: {},
    labelFor: {},
    labelPosition: {},
    labelWidth: {},
    labelAlign: {}
  },
  emits: ["update:value"],
  setup(__props, { emit: emits }) {
    const props = __props;
    const { options: rawOptions, placeholder, size: sizeName, searchable } = toRefs(props);
    const options = computed(() => {
      return rawOptions.value.map((option) => {
        if (typeof option === "string") {
          return { label: option, value: option };
        }
        return option;
      });
    });
    const keys = useMagicKeys();
    const value = useVModel(props, "value", emits);
    const theme = useTheme();
    const appTheme = useAppTheme();
    const isOpen = ref(false);
    const selectedOption = shallowRef(options.value.find((option) => option.value === value.value));
    const focusIndex = ref(0);
    const elementRef = ref(null);
    const size = computed(() => theme.value.sizes[sizeName.value]);
    const searchQuery = ref("");
    const searchInputRef = ref();
    whenever(() => !isOpen.value, () => {
      focusIndex.value = 0;
      searchQuery.value = "";
    });
    whenever(() => isOpen.value, () => {
      nextTick(() => searchInputRef.value?.focus());
    });
    onClickOutside(elementRef, close);
    whenever(keys.escape, close);
    watch(
      value,
      (newValue) => {
        const option = options.value.find((option2) => option2.value === newValue);
        if (option) {
          selectedOption.value = option;
        }
      }
    );
    const { searchResult: filteredOptions } = useFuzzySearch({
      search: searchQuery,
      data: options.value,
      options: {
        keys: ["label"],
        shouldSort: false,
        threshold: 0.3,
        filterEmpty: false
      }
    });
    function close() {
      isOpen.value = false;
    }
    function toggleOpen() {
      isOpen.value = !isOpen.value;
    }
    function selectOption({ option }) {
      selectedOption.value = option;
      value.value = option.value;
      isOpen.value = false;
    }
    function handleKeydown(event) {
      const { key } = event;
      const isEnter = ["Enter"].includes(key);
      const isArrowUpOrDown = ["ArrowUp", "ArrowDown"].includes(key);
      const isArrowDown = key === "ArrowDown";
      if (isEnter) {
        const valueCanBeSelected = isOpen.value && focusIndex.value !== -1;
        if (valueCanBeSelected) {
          selectOption({ option: filteredOptions.value[focusIndex.value] });
        } else {
          toggleOpen();
        }
        event.preventDefault();
        return;
      }
      if (isArrowUpOrDown) {
        const increment = isArrowDown ? 1 : -1;
        focusIndex.value = clamp({
          value: focusIndex.value + increment,
          min: 0,
          max: options.value.length - 1
        });
        event.preventDefault();
      }
    }
    function onSearchInput() {
      focusIndex.value = 0;
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_icon_mdi_chevron_down = __unplugin_components_0$1;
      const _cssVars = { style: {
        "--b681f728": unref(appTheme).text.mutedColor,
        "--24b10592": unref(theme).backgroundColor,
        "--7208e40e": unref(theme).borderColor,
        "--0e8b7fc4": unref(size).fontSize,
        "--3a8b14fb": unref(size).height,
        "--4f44bdef": unref(theme).dropdownShadow,
        "--094b2a09": unref(theme).option.active.textColor,
        "--9f7bab70": unref(theme).option.hover.backgroundColor
      } };
      _push(ssrRenderComponent(_sfc_main$1, mergeProps(props, _attrs, _cssVars), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div relative class="c-select" w-full data-v-350c641a${_scopeId}><div flex flex-nowrap cursor-pointer items-center class="${ssrRenderClass([{ "is-open": unref(isOpen), "important:border-primary": unref(isOpen) }, "c-select-input"])}" tabindex="0" hover:important:border-primary data-v-350c641a${_scopeId}><div flex-1 truncate data-v-350c641a${_scopeId}>`);
            ssrRenderSlot(_ctx.$slots, "displayed-value", {}, () => {
              if (unref(searchable) && unref(isOpen)) {
                _push2(`<input${ssrRenderAttr("value", unref(searchQuery))} type="text" placeholder="Search..." class="search-input" w-full lh-normal color-current data-v-350c641a${_scopeId}>`);
              } else if (unref(selectedOption)) {
                _push2(`<span lh-normal data-v-350c641a${_scopeId}>${ssrInterpolate(unref(selectedOption).label)}</span>`);
              } else {
                _push2(`<span class="placeholder" lh-normal data-v-350c641a${_scopeId}>${ssrInterpolate(unref(placeholder) ?? "Select an option")}</span>`);
              }
            }, _push2, _parent2, _scopeId);
            _push2(`</div>`);
            _push2(ssrRenderComponent(_component_icon_mdi_chevron_down, { class: "chevron" }, null, _parent2, _scopeId));
            _push2(`</div><div style="${ssrRenderStyle(unref(isOpen) ? null : { display: "none" })}" class="c-select-dropdown" absolute z-10 mt-1 max-h-312px w-full overflow-y-auto pretty-scrollbar data-v-350c641a${_scopeId}>`);
            if (!unref(filteredOptions).length) {
              ssrRenderSlot(_ctx.$slots, "empty", {}, () => {
                _push2(`<div px-4 py-1 opacity-70 data-v-350c641a${_scopeId}> No results found </div>`);
              }, _push2, _parent2, _scopeId);
            } else {
              _push2(`<!--[-->`);
              ssrRenderList(unref(filteredOptions), (option, index) => {
                _push2(`<div cursor-pointer px-4 py-1 class="${ssrRenderClass([{ active: unref(selectedOption)?.label === option.label, hover: unref(focusIndex) === index }, "c-select-dropdown-option"])}" data-v-350c641a${_scopeId}>${ssrInterpolate(option.label)}</div>`);
              });
              _push2(`<!--]-->`);
            }
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", {
                ref_key: "elementRef",
                ref: elementRef,
                relative: "",
                class: "c-select",
                "w-full": ""
              }, [
                createVNode("div", {
                  flex: "",
                  "flex-nowrap": "",
                  "cursor-pointer": "",
                  "items-center": "",
                  class: [{ "is-open": unref(isOpen), "important:border-primary": unref(isOpen) }, "c-select-input"],
                  tabindex: "0",
                  "hover:important:border-primary": "",
                  onClick: toggleOpen,
                  onKeydown: handleKeydown
                }, [
                  createVNode("div", {
                    "flex-1": "",
                    truncate: ""
                  }, [
                    renderSlot(_ctx.$slots, "displayed-value", {}, () => [
                      unref(searchable) && unref(isOpen) ? withDirectives((openBlock(), createBlock("input", {
                        key: 0,
                        ref_key: "searchInputRef",
                        ref: searchInputRef,
                        "onUpdate:modelValue": ($event) => isRef(searchQuery) ? searchQuery.value = $event : null,
                        type: "text",
                        placeholder: "Search...",
                        class: "search-input",
                        "w-full": "",
                        "lh-normal": "",
                        "color-current": "",
                        onInput: onSearchInput
                      }, null, 40, ["onUpdate:modelValue"])), [
                        [vModelText, unref(searchQuery)]
                      ]) : unref(selectedOption) ? (openBlock(), createBlock("span", {
                        key: 1,
                        "lh-normal": ""
                      }, toDisplayString(unref(selectedOption).label), 1)) : (openBlock(), createBlock("span", {
                        key: 2,
                        class: "placeholder",
                        "lh-normal": ""
                      }, toDisplayString(unref(placeholder) ?? "Select an option"), 1))
                    ], true)
                  ]),
                  createVNode(_component_icon_mdi_chevron_down, { class: "chevron" })
                ], 34),
                createVNode(Transition, { name: "dropdown" }, {
                  default: withCtx(() => [
                    withDirectives(createVNode("div", {
                      class: "c-select-dropdown",
                      absolute: "",
                      "z-10": "",
                      "mt-1": "",
                      "max-h-312px": "",
                      "w-full": "",
                      "overflow-y-auto": "",
                      "pretty-scrollbar": ""
                    }, [
                      !unref(filteredOptions).length ? renderSlot(_ctx.$slots, "empty", { key: 0 }, () => [
                        createVNode("div", {
                          "px-4": "",
                          "py-1": "",
                          "opacity-70": ""
                        }, " No results found ")
                      ], true) : (openBlock(true), createBlock(Fragment, { key: 1 }, renderList(unref(filteredOptions), (option, index) => {
                        return openBlock(), createBlock("div", {
                          key: option.label,
                          "cursor-pointer": "",
                          "px-4": "",
                          "py-1": "",
                          class: [{ active: unref(selectedOption)?.label === option.label, hover: unref(focusIndex) === index }, "c-select-dropdown-option"],
                          onClick: ($event) => selectOption({ option })
                        }, toDisplayString(option.label), 11, ["onClick"]);
                      }), 128))
                    ], 512), [
                      [vShow, unref(isOpen)]
                    ])
                  ]),
                  _: 3
                })
              ], 512)
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});

/* unplugin-vue-components disabled */const cSelect_vue_vue_type_style_index_0_scoped_350c641a_lang = '';

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/ui/c-select/c-select.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __unplugin_components_0 = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-350c641a"]]);

export { __unplugin_components_0 as _ };
