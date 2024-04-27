import { _ as __unplugin_components_3 } from './chunk-4e7a6a8d.js';
import { NFormItem, NSwitch, NInputNumber } from 'naive-ui';
import { defineComponent, ref, computed, withCtx, unref, isRef, createVNode, useSSRContext } from 'vue';
import { ssrRenderStyle, ssrRenderComponent } from 'vue/server-renderer';
import yaml from 'yaml';
import { get, useStorage } from '@vueuse/core';
import { w as withDefaultOnError } from './chunk-f1b4cc24.js';
import { u as useValidation } from './chunk-35c3d701.js';
import { T as TextareaCopyable } from './chunk-727cc0fb.js';
import { _ as _export_sfc } from './chunk-6003391e.js';
import './chunk-11f44f81.js';
import 'lodash';
import './chunk-8109fd17.js';
import '@vicons/tabler';
import 'highlight.js/lib/core';
import 'highlight.js/lib/languages/json';
import 'highlight.js/lib/languages/sql';
import 'highlight.js/lib/languages/xml';
import 'highlight.js/lib/languages/yaml';
import 'highlight.js/lib/languages/ini';
import './chunk-77c5cc16.js';
import 'pinia';

function formatYaml({
  rawYaml,
  sortKeys = false,
  indentSize = 2
}) {
  const parsedYaml = yaml.parse(get(rawYaml));
  const formattedYAML = yaml.stringify(parsedYaml, {
    sortMapEntries: get(sortKeys),
    indent: get(indentSize)
  });
  return formattedYAML;
}

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "yaml-viewer",
  __ssrInlineRender: true,
  setup(__props) {
    const inputElement = ref();
    const rawYaml = useStorage("yaml-prettify:raw-yaml", "");
    const indentSize = useStorage("yaml-prettify:indent-size", 2);
    const sortKeys = useStorage("yaml-prettify:sort-keys", false);
    const cleanYaml = computed(() => withDefaultOnError(() => formatYaml({ rawYaml, indentSize, sortKeys }), ""));
    const rawYamlValidation = useValidation({
      source: rawYaml,
      rules: [
        {
          validator: (v) => v === "" || yaml.parse(v),
          message: "Provided YAML is not valid."
        }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_n_form_item = NFormItem;
      const _component_n_switch = NSwitch;
      const _component_n_input_number = NInputNumber;
      const _component_c_input_text = __unplugin_components_3;
      _push(`<!--[--><div style="${ssrRenderStyle({ "flex": "0 0 100%" })}" data-v-0baea7b2><div style="${ssrRenderStyle({ "margin": "0 auto", "max-width": "600px" })}" flex justify-center gap-3 data-v-0baea7b2>`);
      _push(ssrRenderComponent(_component_n_form_item, {
        label: "Sort keys :",
        "label-placement": "left",
        "label-width": "100"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_n_switch, {
              value: unref(sortKeys),
              "onUpdate:value": ($event) => isRef(sortKeys) ? sortKeys.value = $event : null
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_n_switch, {
                value: unref(sortKeys),
                "onUpdate:value": ($event) => isRef(sortKeys) ? sortKeys.value = $event : null
              }, null, 8, ["value", "onUpdate:value"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_n_form_item, {
        label: "Indent size :",
        "label-placement": "left",
        "label-width": "100",
        "show-feedback": false
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_n_input_number, {
              value: unref(indentSize),
              "onUpdate:value": ($event) => isRef(indentSize) ? indentSize.value = $event : null,
              min: "1",
              max: "10",
              style: { "width": "100px" }
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_n_input_number, {
                value: unref(indentSize),
                "onUpdate:value": ($event) => isRef(indentSize) ? indentSize.value = $event : null,
                min: "1",
                max: "10",
                style: { "width": "100px" }
              }, null, 8, ["value", "onUpdate:value"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
      _push(ssrRenderComponent(_component_n_form_item, {
        label: "Your raw YAML",
        feedback: unref(rawYamlValidation).message,
        "validation-status": unref(rawYamlValidation).status
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_c_input_text, {
              ref_key: "inputElement",
              ref: inputElement,
              value: unref(rawYaml),
              "onUpdate:value": ($event) => isRef(rawYaml) ? rawYaml.value = $event : null,
              placeholder: "Paste your raw YAML here...",
              rows: "20",
              multiline: "",
              autocomplete: "off",
              autocorrect: "off",
              autocapitalize: "off",
              spellcheck: "false",
              monospace: ""
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_c_input_text, {
                ref_key: "inputElement",
                ref: inputElement,
                value: unref(rawYaml),
                "onUpdate:value": ($event) => isRef(rawYaml) ? rawYaml.value = $event : null,
                placeholder: "Paste your raw YAML here...",
                rows: "20",
                multiline: "",
                autocomplete: "off",
                autocorrect: "off",
                autocapitalize: "off",
                spellcheck: "false",
                monospace: ""
              }, null, 8, ["value", "onUpdate:value"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_n_form_item, { label: "Prettified version of your YAML" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(TextareaCopyable, {
              value: unref(cleanYaml),
              language: "yaml",
              "follow-height-of": unref(inputElement)
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(TextareaCopyable, {
                value: unref(cleanYaml),
                language: "yaml",
                "follow-height-of": unref(inputElement)
              }, null, 8, ["value", "follow-height-of"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
});

/* unplugin-vue-components disabled */const yamlViewer_vue_vue_type_style_index_0_scoped_0baea7b2_lang = '';

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/tools/yaml-viewer/yaml-viewer.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const yamlViewer = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-0baea7b2"]]);

export { yamlViewer as default };
