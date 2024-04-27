import { _ as _sfc_main$1 } from './chunk-2e7c6ce5.js';
import { NFormItem, NSwitch, NInputNumber } from 'naive-ui';
import { defineComponent, withCtx, unref, isRef, createVNode, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import xmlFormat from 'xml-formatter';
import { w as withDefaultOnError } from './chunk-f1b4cc24.js';
import { useStorage } from '@vueuse/core';
import './chunk-727cc0fb.js';
import './chunk-6003391e.js';
import 'pinia';
import './chunk-8109fd17.js';
import '@vicons/tabler';
import 'highlight.js/lib/core';
import 'highlight.js/lib/languages/json';
import 'highlight.js/lib/languages/sql';
import 'highlight.js/lib/languages/xml';
import 'highlight.js/lib/languages/yaml';
import 'highlight.js/lib/languages/ini';
import './chunk-77c5cc16.js';
import 'lodash';
import './chunk-4e7a6a8d.js';
import './chunk-11f44f81.js';
import './chunk-35c3d701.js';

function cleanRawXml(rawXml) {
  return rawXml.trim();
}
function formatXml(rawXml, options) {
  return withDefaultOnError(() => xmlFormat(cleanRawXml(rawXml), options) ?? "", "");
}
function isValidXML(rawXml) {
  const cleanedRawXml = cleanRawXml(rawXml);
  if (cleanedRawXml === "") {
    return true;
  }
  try {
    xmlFormat(cleanedRawXml);
    return true;
  } catch (e) {
    return false;
  }
}

const defaultValue = "<hello><world>foo</world><world>bar</world></hello>";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "xml-formatter",
  __ssrInlineRender: true,
  setup(__props) {
    const indentSize = useStorage("xml-formatter:indent-size", 2);
    const collapseContent = useStorage("xml-formatter:collapse-content", true);
    function transformer(value) {
      return formatXml(value, {
        indentation: " ".repeat(indentSize.value),
        collapseContent: collapseContent.value,
        lineSeparator: "\n"
      });
    }
    const rules = [
      {
        validator: isValidXML,
        message: "Provided XML is not valid."
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_n_form_item = NFormItem;
      const _component_n_switch = NSwitch;
      const _component_n_input_number = NInputNumber;
      const _component_format_transformer = _sfc_main$1;
      _push(`<!--[--><div important:flex-full important:flex-shrink-0 important:flex-grow-0><div flex justify-center>`);
      _push(ssrRenderComponent(_component_n_form_item, {
        label: "Collapse content:",
        "label-placement": "left"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_n_switch, {
              value: unref(collapseContent),
              "onUpdate:value": ($event) => isRef(collapseContent) ? collapseContent.value = $event : null
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_n_switch, {
                value: unref(collapseContent),
                "onUpdate:value": ($event) => isRef(collapseContent) ? collapseContent.value = $event : null
              }, null, 8, ["value", "onUpdate:value"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_n_form_item, {
        label: "Indent size:",
        "label-placement": "left",
        "label-width": "100",
        "show-feedback": false
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_n_input_number, {
              value: unref(indentSize),
              "onUpdate:value": ($event) => isRef(indentSize) ? indentSize.value = $event : null,
              min: "0",
              max: "10",
              "w-100px": ""
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_n_input_number, {
                value: unref(indentSize),
                "onUpdate:value": ($event) => isRef(indentSize) ? indentSize.value = $event : null,
                min: "0",
                max: "10",
                "w-100px": ""
              }, null, 8, ["value", "onUpdate:value"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
      _push(ssrRenderComponent(_component_format_transformer, {
        "input-label": "Your XML",
        "input-placeholder": "Paste your XML here...",
        "output-label": "Formatted XML from your XML",
        "output-language": "xml",
        "input-validation-rules": rules,
        transformer,
        "input-default": defaultValue
      }, null, _parent));
      _push(`<!--]-->`);
    };
  }
});

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/tools/xml-formatter/xml-formatter.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
