import { _ as _sfc_main$1 } from './chunk-2e7c6ce5.js';
import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import JSON5 from 'json5';
import { w as withDefaultOnError } from './chunk-f1b4cc24.js';
import './chunk-727cc0fb.js';
import 'naive-ui';
import './chunk-6003391e.js';
import '@vueuse/core';
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

function getHeaders({ array }) {
  const headers = /* @__PURE__ */ new Set();
  array.forEach((item) => Object.keys(item).forEach((key) => headers.add(key)));
  return Array.from(headers);
}
function serializeValue(value) {
  if (value === null) {
    return "null";
  }
  if (value === void 0) {
    return "";
  }
  const valueAsString = String(value).replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/"/g, '\\"');
  if (valueAsString.includes(",")) {
    return `"${valueAsString}"`;
  }
  return valueAsString;
}
function convertArrayToCsv({ array }) {
  const headers = getHeaders({ array });
  const rows = array.map((item) => headers.map((header) => serializeValue(item[header])));
  return [headers.join(","), ...rows].join("\n");
}

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "json-to-csv",
  __ssrInlineRender: true,
  setup(__props) {
    function transformer(value) {
      return withDefaultOnError(() => {
        if (value === "") {
          return "";
        }
        return convertArrayToCsv({ array: JSON5.parse(value) });
      }, "");
    }
    const rules = [
      {
        validator: (v) => v === "" || JSON5.parse(v),
        message: "Provided JSON is not valid."
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_format_transformer = _sfc_main$1;
      _push(ssrRenderComponent(_component_format_transformer, mergeProps({
        "input-label": "Your raw JSON",
        "input-placeholder": "Paste your raw JSON here...",
        "output-label": "CSV version of your JSON",
        "input-validation-rules": rules,
        transformer
      }, _attrs), null, _parent));
    };
  }
});

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/tools/json-to-csv/json-to-csv.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
