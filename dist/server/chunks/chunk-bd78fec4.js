import { _ as __unplugin_components_3 } from './chunk-4e7a6a8d.js';
import { NFormItem } from 'naive-ui';
import { _ as __unplugin_components_0 } from './chunk-89a4876c.js';
import { defineComponent, ref, reactive, computed, unref, withCtx, isRef, createVNode, useSSRContext } from 'vue';
import { ssrRenderStyle, ssrRenderClass, ssrRenderComponent } from 'vue/server-renderer';
import { format } from 'sql-formatter';
import { T as TextareaCopyable } from './chunk-727cc0fb.js';
import { u as useStyleStore, _ as _export_sfc } from './chunk-6003391e.js';
import './chunk-11f44f81.js';
import './chunk-35c3d701.js';
import '@vueuse/core';
import 'lodash';
import './chunk-bb5bb4f6.js';
import './chunk-2ce6ed5e.js';
import 'fuse.js';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "sql-prettify",
  __ssrInlineRender: true,
  setup(__props) {
    const inputElement = ref();
    const styleStore = useStyleStore();
    const config = reactive({
      keywordCase: "upper",
      useTabs: false,
      language: "sql",
      indentStyle: "standard",
      tabulateAlias: true
    });
    const rawSQL = ref("select field1,field2,field3 from my_table where my_condition;");
    const prettySQL = computed(() => format(rawSQL.value, config));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_c_select = __unplugin_components_0;
      const _component_n_form_item = NFormItem;
      const _component_c_input_text = __unplugin_components_3;
      _push(`<!--[--><div style="${ssrRenderStyle({ "flex": "0 0 100%" })}" data-v-b7c40ff0><div style="${ssrRenderStyle({ "max-width": "600px" })}" class="${ssrRenderClass({ "flex-col": unref(styleStore).isSmallScreen })}" mx-auto mb-5 flex gap-2 data-v-b7c40ff0>`);
      _push(ssrRenderComponent(_component_c_select, {
        value: unref(config).language,
        "onUpdate:value": ($event) => unref(config).language = $event,
        "flex-1": "",
        label: "Dialect",
        options: [
          { label: "GCP BigQuery", value: "bigquery" },
          { label: "IBM DB2", value: "db2" },
          { label: "Apache Hive", value: "hive" },
          { label: "MariaDB", value: "mariadb" },
          { label: "MySQL", value: "mysql" },
          { label: "Couchbase N1QL", value: "n1ql" },
          { label: "Oracle PL/SQL", value: "plsql" },
          { label: "PostgreSQL", value: "postgresql" },
          { label: "Amazon Redshift", value: "redshift" },
          { label: "Spark", value: "spark" },
          { label: "Standard SQL", value: "sql" },
          { label: "sqlite", value: "sqlite" },
          { label: "SQL Server Transact-SQL", value: "tsql" }
        ]
      }, null, _parent));
      _push(ssrRenderComponent(_component_c_select, {
        value: unref(config).keywordCase,
        "onUpdate:value": ($event) => unref(config).keywordCase = $event,
        label: "Keyword case",
        "flex-1": "",
        options: [
          { label: "UPPERCASE", value: "upper" },
          { label: "lowercase", value: "lower" },
          { label: "Preserve", value: "preserve" }
        ]
      }, null, _parent));
      _push(ssrRenderComponent(_component_c_select, {
        value: unref(config).indentStyle,
        "onUpdate:value": ($event) => unref(config).indentStyle = $event,
        label: "Indent style",
        "flex-1": "",
        options: [
          { label: "Standard", value: "standard" },
          { label: "Tabular left", value: "tabularLeft" },
          { label: "Tabular right", value: "tabularRight" }
        ]
      }, null, _parent));
      _push(`</div></div>`);
      _push(ssrRenderComponent(_component_n_form_item, { label: "Your SQL query" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_c_input_text, {
              ref_key: "inputElement",
              ref: inputElement,
              value: unref(rawSQL),
              "onUpdate:value": ($event) => isRef(rawSQL) ? rawSQL.value = $event : null,
              placeholder: "Put your SQL query here...",
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
                value: unref(rawSQL),
                "onUpdate:value": ($event) => isRef(rawSQL) ? rawSQL.value = $event : null,
                placeholder: "Put your SQL query here...",
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
      _push(ssrRenderComponent(_component_n_form_item, { label: "Prettify version of your query" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(TextareaCopyable, {
              value: unref(prettySQL),
              language: "sql",
              "follow-height-of": unref(inputElement)
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(TextareaCopyable, {
                value: unref(prettySQL),
                language: "sql",
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

/* unplugin-vue-components disabled */const sqlPrettify_vue_vue_type_style_index_0_scoped_b7c40ff0_lang = '';

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/tools/sql-prettify/sql-prettify.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const sqlPrettify = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-b7c40ff0"]]);

export { sqlPrettify as default };
