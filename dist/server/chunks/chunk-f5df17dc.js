import { _ as _sfc_main$1 } from './chunk-de61ec1c.js';
import { openBlock, createElementBlock, createElementVNode, defineComponent, ref, computed, mergeProps, unref, isRef, useSSRContext } from 'vue';
import { _ as __unplugin_components_3 } from './chunk-4e7a6a8d.js';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import './chunk-95ec8cf7.js';
import './chunk-6003391e.js';
import '@vueuse/core';
import 'pinia';
import './chunk-8109fd17.js';
import './chunk-77c5cc16.js';
import 'naive-ui';
import './chunk-11f44f81.js';
import './chunk-35c3d701.js';
import 'lodash';

const _hoisted_1 = {
  viewBox: "0 0 24 24",
  width: "1.2em",
  height: "1.2em"
};
const _hoisted_2 = /*#__PURE__*/createElementVNode("path", {
  fill: "currentColor",
  d: "M11 4h2v12l5.5-5.5l1.42 1.42L12 19.84l-7.92-7.92L5.5 10.5L11 16V4Z"
}, null, -1);
const _hoisted_3 = [
  _hoisted_2
];

function render(_ctx, _cache) {
  return (openBlock(), createElementBlock("svg", _hoisted_1, _hoisted_3))
}

const __unplugin_components_1 = { name: 'mdi-arrow-down', render };
/* vite-plugin-components disabled */

function generateNumeronym(word) {
  const wordLength = word.length;
  if (wordLength <= 3) {
    return word;
  }
  return `${word.at(0)}${wordLength - 2}${word.at(-1)}`;
}

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "numeronym-generator",
  __ssrInlineRender: true,
  setup(__props) {
    const word = ref("");
    const numeronym = computed(() => generateNumeronym(word.value));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_c_input_text = __unplugin_components_3;
      const _component_icon_mdi_arrow_down = __unplugin_components_1;
      const _component_input_copyable = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({
        flex: "",
        "flex-col": "",
        "items-center": "",
        "gap-4": ""
      }, _attrs))}>`);
      _push(ssrRenderComponent(_component_c_input_text, {
        value: unref(word),
        "onUpdate:value": ($event) => isRef(word) ? word.value = $event : null,
        placeholder: "Enter a word, e.g. 'internationalization'",
        size: "large",
        clearable: "",
        "test-id": "word-input"
      }, null, _parent));
      _push(ssrRenderComponent(_component_icon_mdi_arrow_down, { "text-30px": "" }, null, _parent));
      _push(ssrRenderComponent(_component_input_copyable, {
        value: unref(numeronym),
        size: "large",
        readonly: "",
        placeholder: "Your numeronym will be here, e.g. 'i18n'",
        "test-id": "numeronym"
      }, null, _parent));
      _push(`</div>`);
    };
  }
});

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/tools/numeronym-generator/numeronym-generator.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
