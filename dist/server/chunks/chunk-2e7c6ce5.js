import { T as TextareaCopyable } from './chunk-727cc0fb.js';
import { defineComponent, toRefs, ref, computed, unref, isRef, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import _ from 'lodash';
import { _ as __unplugin_components_3 } from './chunk-4e7a6a8d.js';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "FormatTransformer",
  __ssrInlineRender: true,
  props: {
    transformer: { type: Function, default: _.identity },
    inputValidationRules: { default: () => [] },
    inputLabel: { default: "Input" },
    inputPlaceholder: { default: "Input..." },
    inputDefault: { default: "" },
    outputLabel: { default: "Output" },
    outputLanguage: { default: "" }
  },
  setup(__props) {
    const props = __props;
    const { transformer, inputValidationRules, inputLabel, outputLabel, outputLanguage, inputPlaceholder, inputDefault } = toRefs(props);
    const inputElement = ref();
    const input = ref(inputDefault.value);
    const output = computed(() => transformer.value(input.value));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_textarea_copyable = TextareaCopyable;
      _push(`<!--[-->`);
      _push(ssrRenderComponent(__unplugin_components_3, {
        ref_key: "inputElement",
        ref: inputElement,
        value: unref(input),
        "onUpdate:value": ($event) => isRef(input) ? input.value = $event : null,
        placeholder: unref(inputPlaceholder),
        label: unref(inputLabel),
        rows: "20",
        autosize: "",
        "raw-text": "",
        multiline: "",
        "test-id": "input",
        "validation-rules": unref(inputValidationRules),
        monospace: ""
      }, null, _parent));
      _push(`<div><div mb-5px>${ssrInterpolate(unref(outputLabel))}</div>`);
      _push(ssrRenderComponent(_component_textarea_copyable, {
        value: unref(output),
        language: unref(outputLanguage),
        "follow-height-of": unref(inputElement)?.inputWrapperRef
      }, null, _parent));
      _push(`</div><!--]-->`);
    };
  }
});

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/components/FormatTransformer.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
