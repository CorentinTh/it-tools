import { _ as __unplugin_components_3 } from './chunk-4e7a6a8d.js';
import { a as __unplugin_components_1 } from './chunk-8109fd17.js';
import { defineComponent, ref, computed, withCtx, mergeProps, unref, isRef, createVNode, openBlock, createBlock, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderList } from 'vue/server-renderer';
import { camelCase, capitalCase, constantCase, dotCase, headerCase, noCase, paramCase, pascalCase, pathCase, sentenceCase, snakeCase } from 'change-case';
import { _ as _sfc_main$1 } from './chunk-de61ec1c.js';
import './chunk-6003391e.js';
import '@vueuse/core';
import 'pinia';
import './chunk-11f44f81.js';
import './chunk-35c3d701.js';
import 'lodash';
import './chunk-95ec8cf7.js';
import './chunk-77c5cc16.js';
import 'naive-ui';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "case-converter",
  __ssrInlineRender: true,
  setup(__props) {
    const baseConfig = {
      stripRegexp: /[^A-Za-zÀ-ÖØ-öø-ÿ]+/gi
    };
    const input = ref("lorem ipsum dolor sit amet");
    const formats = computed(() => [
      {
        label: "Lowercase:",
        value: input.value.toLocaleLowerCase()
      },
      {
        label: "Uppercase:",
        value: input.value.toLocaleUpperCase()
      },
      {
        label: "Camelcase:",
        value: camelCase(input.value, baseConfig)
      },
      {
        label: "Capitalcase:",
        value: capitalCase(input.value, baseConfig)
      },
      {
        label: "Constantcase:",
        value: constantCase(input.value, baseConfig)
      },
      {
        label: "Dotcase:",
        value: dotCase(input.value, baseConfig)
      },
      {
        label: "Headercase:",
        value: headerCase(input.value, baseConfig)
      },
      {
        label: "Nocase:",
        value: noCase(input.value, baseConfig)
      },
      {
        label: "Paramcase:",
        value: paramCase(input.value, baseConfig)
      },
      {
        label: "Pascalcase:",
        value: pascalCase(input.value, baseConfig)
      },
      {
        label: "Pathcase:",
        value: pathCase(input.value, baseConfig)
      },
      {
        label: "Sentencecase:",
        value: sentenceCase(input.value, baseConfig)
      },
      {
        label: "Snakecase:",
        value: snakeCase(input.value, baseConfig)
      },
      {
        label: "Mockingcase:",
        value: input.value.split("").map((char, index) => index % 2 === 0 ? char.toUpperCase() : char.toLowerCase()).join("")
      }
    ]);
    const inputLabelAlignmentConfig = {
      labelPosition: "left",
      labelWidth: "120px",
      labelAlign: "right"
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_c_card = __unplugin_components_1;
      const _component_c_input_text = __unplugin_components_3;
      _push(ssrRenderComponent(_component_c_card, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_c_input_text, mergeProps({
              value: unref(input),
              "onUpdate:value": ($event) => isRef(input) ? input.value = $event : null,
              label: "Your string:",
              placeholder: "Your string...",
              "raw-text": ""
            }, inputLabelAlignmentConfig), null, _parent2, _scopeId));
            _push2(`<div my-16px divider${_scopeId}></div><!--[-->`);
            ssrRenderList(unref(formats), (format) => {
              _push2(ssrRenderComponent(_sfc_main$1, mergeProps({
                key: format.label,
                value: format.value,
                label: format.label
              }, inputLabelAlignmentConfig, { "mb-1": "" }), null, _parent2, _scopeId));
            });
            _push2(`<!--]-->`);
          } else {
            return [
              createVNode(_component_c_input_text, mergeProps({
                value: unref(input),
                "onUpdate:value": ($event) => isRef(input) ? input.value = $event : null,
                label: "Your string:",
                placeholder: "Your string...",
                "raw-text": ""
              }, inputLabelAlignmentConfig), null, 16, ["value", "onUpdate:value"]),
              createVNode("div", {
                "my-16px": "",
                divider: ""
              }),
              (openBlock(true), createBlock(Fragment, null, renderList(unref(formats), (format) => {
                return openBlock(), createBlock(_sfc_main$1, mergeProps({
                  key: format.label,
                  value: format.value,
                  label: format.label
                }, inputLabelAlignmentConfig, { "mb-1": "" }), null, 16, ["value", "label"]);
              }), 128))
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/tools/case-converter/case-converter.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
