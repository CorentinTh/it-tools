import { defineComponent, toRefs, ref, unref, mergeProps, useSSRContext, withCtx, createTextVNode, toDisplayString, isRef, renderSlot, createVNode } from 'vue';
import { ssrRenderAttrs, ssrRenderSlot, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { d as defineThemes, b as appThemes, _ as _export_sfc, a as __unplugin_components_0 } from './chunk-6003391e.js';
import { useVModel, onClickOutside, useToggle } from '@vueuse/core';
import { u as useCopy } from './chunk-77c5cc16.js';

const { useTheme } = defineThemes({
  dark: {
    background: appThemes.dark.background
  },
  light: {
    background: appThemes.light.background
  }
});

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  ...{
    inheritAttrs: false
  },
  __name: "c-modal",
  __ssrInlineRender: true,
  props: {
    open: { type: Boolean, default: false },
    centered: { type: Boolean, default: true }
  },
  emits: ["update:open"],
  setup(__props, { expose: __expose, emit }) {
    const props = __props;
    const isOpen = useVModel(props, "open", emit, { passive: true });
    const { centered } = toRefs(props);
    function close() {
      isOpen.value = false;
    }
    function open() {
      isOpen.value = true;
    }
    function toggle() {
      isOpen.value = !isOpen.value;
    }
    __expose({
      close,
      open,
      toggle,
      isOpen
    });
    const theme = useTheme();
    const modal = ref();
    onClickOutside(modal, () => {
      if (isOpen.value) {
        close();
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      ({ style: {
        "--f6e4b4d2": unref(theme).background
      } });
      if (unref(isOpen)) {
        _push(`<div${ssrRenderAttrs(mergeProps({
          class: ["c-modal--overlay", { "items-center": unref(centered) }],
          fixed: "",
          "left-0": "",
          "top-0": "",
          "z-10": "",
          "h-full": "",
          "w-full": "",
          flex: "",
          "justify-center": "",
          "px-2": ""
        }, _attrs))} data-v-94793f53><div${ssrRenderAttrs(mergeProps({
          ref_key: "modal",
          ref: modal,
          class: "c-modal--container"
        }, _ctx.$attrs, {
          "max-w-xl": "",
          "w-full": "",
          "flex-grow": "",
          "rounded-md": "",
          "pa-24px": ""
        }))} data-v-94793f53>`);
        ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});

/* unplugin-vue-components disabled */const cModal_vue_vue_type_style_index_0_scoped_94793f53_lang = '';

const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/ui/c-modal/c-modal.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __unplugin_components_2 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-94793f53"]]);

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "c-modal-value",
  __ssrInlineRender: true,
  props: {
    value: {},
    label: { default: void 0 },
    copyable: { type: Boolean, default: true }
  },
  setup(__props) {
    const props = __props;
    const { value, label } = toRefs(props);
    const { copy, isJustCopied } = useCopy({ source: value });
    const isModalOpen = ref(false);
    const toggleModal = useToggle(isModalOpen);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_c_button = __unplugin_components_0;
      const _component_c_modal = __unplugin_components_2;
      _push(`<!--[-->`);
      ssrRenderSlot(_ctx.$slots, "label", {
        value: unref(value),
        toggleModal: unref(toggleModal),
        isModalOpen: unref(isModalOpen)
      }, () => {
        _push(ssrRenderComponent(_component_c_button, {
          class: "text-left",
          onClick: ($event) => isModalOpen.value = true
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(label))}`);
            } else {
              return [
                createTextVNode(toDisplayString(unref(label)), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
      }, _push, _parent);
      _push(ssrRenderComponent(_component_c_modal, {
        open: unref(isModalOpen),
        "onUpdate:open": ($event) => isRef(isModalOpen) ? isModalOpen.value = $event : null
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "value", {
              value: unref(value),
              toggleModal: unref(toggleModal),
              isModalOpen: unref(isModalOpen)
            }, () => {
              _push2(`${ssrInterpolate(unref(value))}`);
            }, _push2, _parent2, _scopeId);
            _push2(`<div mt-4 flex justify-center${_scopeId}>`);
            _push2(ssrRenderComponent(_component_c_button, {
              class: "w-full",
              onClick: unref(copy)
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(unref(isJustCopied) ? "Copied!" : "Copy")}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(unref(isJustCopied) ? "Copied!" : "Copy"), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              renderSlot(_ctx.$slots, "value", {
                value: unref(value),
                toggleModal: unref(toggleModal),
                isModalOpen: unref(isModalOpen)
              }, () => [
                createTextVNode(toDisplayString(unref(value)), 1)
              ]),
              createVNode("div", {
                "mt-4": "",
                flex: "",
                "justify-center": ""
              }, [
                createVNode(_component_c_button, {
                  class: "w-full",
                  onClick: unref(copy)
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(unref(isJustCopied) ? "Copied!" : "Copy"), 1)
                  ]),
                  _: 1
                }, 8, ["onClick"])
              ])
            ];
          }
        }),
        _: 3
      }, _parent));
      _push(`<!--]-->`);
    };
  }
});

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/ui/c-modal-value/c-modal-value.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { __unplugin_components_2 as _, _sfc_main as a };
