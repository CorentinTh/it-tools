import { defineComponent, toRefs, ref, watch, onMounted, mergeProps, useSSRContext, withCtx, createVNode } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import * as monaco from 'monaco-editor';
import { u as useStyleStore, _ as _export_sfc } from './chunk-6003391e.js';
import { useResizeObserver } from '@vueuse/core';
import { a as __unplugin_components_1 } from './chunk-8109fd17.js';
import 'pinia';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "c-diff-editor",
  __ssrInlineRender: true,
  props: {
    options: { default: () => ({}) }
  },
  setup(__props) {
    const props = __props;
    const { options } = toRefs(props);
    const editorContainer = ref(null);
    let editor = null;
    monaco.editor.defineTheme("it-tools-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#00000000"
      }
    });
    monaco.editor.defineTheme("it-tools-light", {
      base: "vs",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#00000000"
      }
    });
    const styleStore = useStyleStore();
    watch(
      () => styleStore.isDarkTheme,
      (isDarkTheme) => monaco.editor.setTheme(isDarkTheme ? "it-tools-dark" : "it-tools-light"),
      { immediate: true }
    );
    watch(
      () => options.value,
      (options2) => editor?.updateOptions(options2),
      { immediate: true, deep: true }
    );
    useResizeObserver(editorContainer, () => {
      editor?.layout();
    });
    onMounted(() => {
      if (!editorContainer.value) {
        return;
      }
      editor = monaco.editor.createDiffEditor(editorContainer.value, {
        originalEditable: true,
        minimap: {
          enabled: false
        }
      });
      editor.setModel({
        original: monaco.editor.createModel("original text", "txt"),
        modified: monaco.editor.createModel("modified text", "txt")
      });
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        ref_key: "editorContainer",
        ref: editorContainer,
        "h-600px": ""
      }, _attrs))}></div>`);
    };
  }
});

const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/ui/c-diff-editor/c-diff-editor.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};

const _sfc_main = {};

function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_c_card = __unplugin_components_1;
  const _component_c_diff_editor = _sfc_main$1;

  _push(ssrRenderComponent(_component_c_card, mergeProps({
    "w-full": "",
    "important:flex-1": "",
    "important:pa-0": ""
  }, _attrs), {
    default: withCtx((_, _push, _parent, _scopeId) => {
      if (_push) {
        _push(ssrRenderComponent(_component_c_diff_editor, null, null, _parent, _scopeId));
      } else {
        return [
          createVNode(_component_c_diff_editor)
        ]
      }
    }),
    _: 1
  }, _parent));
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext()
  ;(ssrContext.modules || (ssrContext.modules = new Set())).add("src/tools/text-diff/text-diff.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : undefined
};
const textDiff = /*#__PURE__*/_export_sfc(_sfc_main, [['ssrRender',_sfc_ssrRender]]);

export { textDiff as default };
