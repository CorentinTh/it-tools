import { openBlock, createElementBlock, createElementVNode, defineComponent, ref, toRefs, watch, nextTick, computed, onMounted, unref, mergeProps, withCtx, createVNode, createBlock, createCommentVNode, useSSRContext } from 'vue';
import { d as defineThemes, c as useAppTheme, a as __unplugin_components_0, _ as _export_sfc } from './chunk-6003391e.js';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrRenderSlot, ssrRenderClass, ssrIncludeBooleanAttr, ssrRenderDynamicModel, ssrRenderComponent } from 'vue/server-renderer';
import { g as generateRandomId } from './chunk-11f44f81.js';
import { u as useValidation } from './chunk-35c3d701.js';
import { useVModel } from '@vueuse/core';

const _hoisted_1$2 = {
  viewBox: "0 0 24 24",
  width: "1.2em",
  height: "1.2em"
};
const _hoisted_2$2 = /*#__PURE__*/createElementVNode("path", {
  fill: "currentColor",
  d: "M11.83 9L15 12.16V12a3 3 0 0 0-3-3h-.17m-4.3.8l1.55 1.55c-.05.21-.08.42-.08.65a3 3 0 0 0 3 3c.22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53a5 5 0 0 1-5-5c0-.79.2-1.53.53-2.2M2 4.27l2.28 2.28l.45.45C3.08 8.3 1.78 10 1 12c1.73 4.39 6 7.5 11 7.5c1.55 0 3.03-.3 4.38-.84l.43.42L19.73 22L21 20.73L3.27 3M12 7a5 5 0 0 1 5 5c0 .64-.13 1.26-.36 1.82l2.93 2.93c1.5-1.25 2.7-2.89 3.43-4.75c-1.73-4.39-6-7.5-11-7.5c-1.4 0-2.74.25-4 .7l2.17 2.15C10.74 7.13 11.35 7 12 7Z"
}, null, -1);
const _hoisted_3$2 = [
  _hoisted_2$2
];

function render$2(_ctx, _cache) {
  return (openBlock(), createElementBlock("svg", _hoisted_1$2, _hoisted_3$2))
}

const __unplugin_components_3$1 = { name: 'mdi-eye-off', render: render$2 };
/* vite-plugin-components disabled */

const _hoisted_1$1 = {
  viewBox: "0 0 24 24",
  width: "1.2em",
  height: "1.2em"
};
const _hoisted_2$1 = /*#__PURE__*/createElementVNode("path", {
  fill: "currentColor",
  d: "M12 9a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3m0 8a5 5 0 0 1-5-5a5 5 0 0 1 5-5a5 5 0 0 1 5 5a5 5 0 0 1-5 5m0-12.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5Z"
}, null, -1);
const _hoisted_3$1 = [
  _hoisted_2$1
];

function render$1(_ctx, _cache) {
  return (openBlock(), createElementBlock("svg", _hoisted_1$1, _hoisted_3$1))
}

const __unplugin_components_2 = { name: 'mdi-eye', render: render$1 };
/* vite-plugin-components disabled */

const _hoisted_1 = {
  viewBox: "0 0 24 24",
  width: "1.2em",
  height: "1.2em"
};
const _hoisted_2 = /*#__PURE__*/createElementVNode("path", {
  fill: "currentColor",
  d: "M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
}, null, -1);
const _hoisted_3 = [
  _hoisted_2
];

function render(_ctx, _cache) {
  return (openBlock(), createElementBlock("svg", _hoisted_1, _hoisted_3))
}

const __unplugin_components_1 = { name: 'mdi-close', render };
/* vite-plugin-components disabled */

const { useTheme } = defineThemes({
  dark: {
    backgroundColor: "#333333",
    borderColor: "#333333",
    focus: {
      backgroundColor: "#1ea54c1a"
    }
  },
  light: {
    backgroundColor: "#ffffff",
    borderColor: "#e0e0e69e",
    focus: {
      backgroundColor: "#ffffff"
    }
  }
});

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "c-input-text",
  __ssrInlineRender: true,
  props: {
    value: { default: "" },
    id: { default: generateRandomId },
    placeholder: { default: "Input text" },
    label: { default: void 0 },
    readonly: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    validationRules: { default: () => [] },
    validationWatch: { default: void 0 },
    validation: { default: void 0 },
    labelPosition: { default: "top" },
    labelWidth: { default: "auto" },
    labelAlign: { default: "left" },
    clearable: { type: Boolean, default: false },
    testId: { default: void 0 },
    autocapitalize: { default: void 0 },
    autocomplete: { default: void 0 },
    autocorrect: { default: void 0 },
    spellcheck: { type: [String, Boolean], default: void 0 },
    rawText: { type: Boolean, default: false },
    type: { default: "text" },
    multiline: { type: Boolean, default: false },
    rows: { default: 3 },
    autosize: { type: Boolean, default: false },
    autofocus: { type: Boolean, default: false },
    monospace: { type: Boolean, default: false }
  },
  emits: ["update:value"],
  setup(__props, { expose: __expose, emit }) {
    const props = __props;
    const value = useVModel(props, "value", emit);
    const showPassword = ref(false);
    const { id, placeholder, label, validationRules, labelPosition, labelWidth, labelAlign, autosize, readonly, disabled, clearable, type, multiline, rows, rawText, autofocus, monospace } = toRefs(props);
    const validation = props.validation ?? useValidation({
      rules: validationRules,
      source: value,
      watch: props.validationWatch
    });
    const theme = useTheme();
    const appTheme = useAppTheme();
    const textareaRef = ref();
    const inputRef = ref();
    const inputWrapperRef = ref();
    watch(
      [value, autosize, multiline, inputWrapperRef, textareaRef],
      () => nextTick(() => {
        if (props.multiline && autosize.value) {
          resizeTextarea();
        }
      }),
      { immediate: true }
    );
    function resizeTextarea() {
      if (!textareaRef.value || !inputWrapperRef.value) {
        return;
      }
      const scrollHeight = textareaRef.value.scrollHeight + 2;
      inputWrapperRef.value.style.height = `${scrollHeight}px`;
    }
    const htmlInputType = computed(() => {
      if (props.type === "password" && !showPassword.value) {
        return "password";
      }
      return "text";
    });
    function focus() {
      if (textareaRef.value) {
        textareaRef.value.focus();
      }
      if (inputRef.value) {
        inputRef.value.focus();
      }
    }
    function blur() {
      if (textareaRef.value) {
        textareaRef.value.blur?.();
      }
      if (inputRef.value) {
        inputRef.value.blur?.();
      }
    }
    onMounted(() => {
      if (autofocus.value) {
        focus();
      }
    });
    __expose({
      inputWrapperRef,
      focus,
      blur
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_c_button = __unplugin_components_0;
      const _component_icon_mdi_close = __unplugin_components_1;
      const _component_icon_mdi_eye = __unplugin_components_2;
      const _component_icon_mdi_eye_off = __unplugin_components_3$1;
      const _cssVars = { style: {
        "--1578999c": unref(appTheme).error.color,
        "--b18512fa": unref(appTheme).error.color + 22,
        "--15951ced": unref(labelWidth),
        "--1460862c": unref(labelAlign),
        "--e1b5bfd6": unref(theme).backgroundColor,
        "--e9ed6052": unref(theme).borderColor,
        "--1728643c": unref(appTheme).text.baseColor,
        "--ffa9e664": unref(appTheme).text.mutedColor,
        "--ac68db28": unref(appTheme).primary.color,
        "--0ab89a02": unref(theme).focus.backgroundColor
      } };
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["c-input-text", { disabled: unref(disabled), "error": !unref(validation).isValid, "label-left": unref(labelPosition) === "left", multiline: unref(multiline) }]
      }, _attrs, _cssVars))} data-v-c4df69f5>`);
      if (unref(label)) {
        _push(`<label${ssrRenderAttr("for", unref(id))} class="label" data-v-c4df69f5>${ssrInterpolate(unref(label))}</label>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="feedback-wrapper" data-v-c4df69f5><div class="input-wrapper" data-v-c4df69f5>`);
      ssrRenderSlot(_ctx.$slots, "prefix", {}, null, _push, _parent);
      if (unref(multiline)) {
        _push(`<textarea${ssrRenderAttr("id", unref(id))} class="${ssrRenderClass([{
          "leading-5 !font-mono": unref(monospace)
        }, "input"])}"${ssrRenderAttr("placeholder", unref(placeholder))}${ssrIncludeBooleanAttr(unref(readonly)) ? " readonly" : ""}${ssrIncludeBooleanAttr(unref(disabled)) ? " disabled" : ""}${ssrRenderAttr("data-test-id", _ctx.testId)}${ssrRenderAttr("autocapitalize", _ctx.autocapitalize ?? (unref(rawText) ? "off" : void 0))}${ssrRenderAttr("autocomplete", _ctx.autocomplete ?? (unref(rawText) ? "off" : void 0))}${ssrRenderAttr("autocorrect", _ctx.autocorrect ?? (unref(rawText) ? "off" : void 0))}${ssrRenderAttr("spellcheck", _ctx.spellcheck ?? (unref(rawText) ? false : void 0))}${ssrRenderAttr("rows", unref(rows))} data-v-c4df69f5>${ssrInterpolate(unref(value))}</textarea>`);
      } else {
        _push(`<input${ssrRenderAttr("id", unref(id))}${ssrRenderDynamicModel(unref(htmlInputType), unref(value), null)}${ssrRenderAttr("type", unref(htmlInputType))} class="${ssrRenderClass([{
          "leading-5 !font-mono": unref(monospace)
        }, "input"])}" size="1"${ssrRenderAttr("placeholder", unref(placeholder))}${ssrIncludeBooleanAttr(unref(readonly)) ? " readonly" : ""}${ssrIncludeBooleanAttr(unref(disabled)) ? " disabled" : ""}${ssrRenderAttr("data-test-id", _ctx.testId)}${ssrRenderAttr("autocapitalize", _ctx.autocapitalize ?? (unref(rawText) ? "off" : void 0))}${ssrRenderAttr("autocomplete", _ctx.autocomplete ?? (unref(rawText) ? "off" : void 0))}${ssrRenderAttr("autocorrect", _ctx.autocorrect ?? (unref(rawText) ? "off" : void 0))}${ssrRenderAttr("spellcheck", _ctx.spellcheck ?? (unref(rawText) ? false : void 0))} data-v-c4df69f5>`);
      }
      if (unref(clearable) && unref(value)) {
        _push(ssrRenderComponent(_component_c_button, {
          variant: "text",
          circle: "",
          size: "small",
          onClick: ($event) => value.value = ""
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_icon_mdi_close, null, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_icon_mdi_close)
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      if (unref(type) === "password") {
        _push(ssrRenderComponent(_component_c_button, {
          variant: "text",
          circle: "",
          size: "small",
          onClick: ($event) => showPassword.value = !unref(showPassword)
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (!unref(showPassword)) {
                _push2(ssrRenderComponent(_component_icon_mdi_eye, null, null, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              if (unref(showPassword)) {
                _push2(ssrRenderComponent(_component_icon_mdi_eye_off, null, null, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                !unref(showPassword) ? (openBlock(), createBlock(_component_icon_mdi_eye, { key: 0 })) : createCommentVNode("", true),
                unref(showPassword) ? (openBlock(), createBlock(_component_icon_mdi_eye_off, { key: 1 })) : createCommentVNode("", true)
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      ssrRenderSlot(_ctx.$slots, "suffix", {}, null, _push, _parent);
      _push(`</div>`);
      if (!unref(validation).isValid) {
        _push(`<span class="feedback" data-v-c4df69f5>${ssrInterpolate(unref(validation).message)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
});

/* unplugin-vue-components disabled */const cInputText_vue_vue_type_style_index_0_scoped_c4df69f5_lang = '';

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/ui/c-input-text/c-input-text.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __unplugin_components_3 = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-c4df69f5"]]);

export { __unplugin_components_3 as _ };
