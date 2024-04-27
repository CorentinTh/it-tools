import { a as __unplugin_components_0, _ as _export_sfc } from './chunk-6003391e.js';
import { _ as __unplugin_components_3 } from './chunk-4e7a6a8d.js';
import { NInputNumber } from 'naive-ui';
import { _ as _sfc_main$1 } from './chunk-000e277f.js';
import { defineComponent, ref, unref, isRef, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { NIL, v1, v3, v4, v5 } from 'uuid';
import { u as useCopy } from './chunk-77c5cc16.js';
import { c as computedRefreshable } from './chunk-cc665c88.js';
import { w as withDefaultOnError } from './chunk-f1b4cc24.js';
import { useStorage } from '@vueuse/core';
import 'pinia';
import './chunk-11f44f81.js';
import './chunk-35c3d701.js';
import 'lodash';
import './chunk-8109fd17.js';
import './chunk-bb5bb4f6.js';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "uuid-generator",
  __ssrInlineRender: true,
  setup(__props) {
    const versions = ["NIL", "v1", "v3", "v4", "v5"];
    const version = useStorage("uuid-generator:version", "v4");
    const count = useStorage("uuid-generator:quantity", 1);
    const v35Args = ref({ namespace: "6ba7b811-9dad-11d1-80b4-00c04fd430c8", name: "" });
    const validUuidRules = [
      {
        message: "Invalid UUID",
        validator: (value) => {
          if (value === NIL) {
            return true;
          }
          return Boolean(value.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/));
        }
      }
    ];
    const generators = {
      NIL: () => NIL,
      v1: (index) => v1({
        clockseq: index,
        msecs: Date.now(),
        nsecs: Math.floor(Math.random() * 1e4),
        node: Array.from({ length: 6 }, () => Math.floor(Math.random() * 256))
      }),
      v3: () => v3(v35Args.value.name, v35Args.value.namespace),
      v4: () => v4(),
      v5: () => v5(v35Args.value.name, v35Args.value.namespace)
    };
    const [uuids, refreshUUIDs] = computedRefreshable(() => withDefaultOnError(() => Array.from({ length: count.value }, (_ignored, index) => {
      const generator = generators[version.value] ?? generators.NIL;
      return generator(index);
    }).join("\n"), ""));
    const { copy } = useCopy({ source: uuids, text: "UUIDs copied to the clipboard" });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_c_buttons_select = _sfc_main$1;
      const _component_n_input_number = NInputNumber;
      const _component_c_input_text = __unplugin_components_3;
      const _component_c_button = __unplugin_components_0;
      _push(`<div${ssrRenderAttrs(_attrs)} data-v-8623cf81>`);
      _push(ssrRenderComponent(_component_c_buttons_select, {
        value: unref(version),
        "onUpdate:value": ($event) => isRef(version) ? version.value = $event : null,
        options: versions,
        label: "UUID version",
        "label-width": "100px",
        "mb-2": ""
      }, null, _parent));
      _push(`<div mb-2 flex items-center data-v-8623cf81><span w-100px data-v-8623cf81>Quantity </span>`);
      _push(ssrRenderComponent(_component_n_input_number, {
        value: unref(count),
        "onUpdate:value": ($event) => isRef(count) ? count.value = $event : null,
        "flex-1": "",
        min: 1,
        max: 50,
        placeholder: "UUID quantity"
      }, null, _parent));
      _push(`</div>`);
      if (unref(version) === "v3" || unref(version) === "v5") {
        _push(`<div data-v-8623cf81><div data-v-8623cf81>`);
        _push(ssrRenderComponent(_component_c_buttons_select, {
          value: unref(v35Args).namespace,
          "onUpdate:value": ($event) => unref(v35Args).namespace = $event,
          options: {
            DNS: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
            URL: "6ba7b811-9dad-11d1-80b4-00c04fd430c8",
            OID: "6ba7b812-9dad-11d1-80b4-00c04fd430c8",
            X500: "6ba7b814-9dad-11d1-80b4-00c04fd430c8"
          },
          label: "Namespace",
          "label-width": "100px",
          "mb-2": ""
        }, null, _parent));
        _push(`</div><div flex-1 data-v-8623cf81>`);
        _push(ssrRenderComponent(_component_c_input_text, {
          value: unref(v35Args).namespace,
          "onUpdate:value": ($event) => unref(v35Args).namespace = $event,
          placeholder: "Namespace",
          "label-width": "100px",
          "label-position": "left",
          label: " ",
          "validation-rules": validUuidRules,
          "mb-2": ""
        }, null, _parent));
        _push(`</div>`);
        _push(ssrRenderComponent(_component_c_input_text, {
          value: unref(v35Args).name,
          "onUpdate:value": ($event) => unref(v35Args).name = $event,
          placeholder: "Name",
          label: "Name",
          "label-width": "100px",
          "label-position": "left",
          "mb-2": ""
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_c_input_text, {
        style: { "text-align": "center", "font-family": "monospace" },
        value: unref(uuids),
        multiline: "",
        placeholder: "Your uuids",
        autosize: "",
        rows: "1",
        readonly: "",
        "raw-text": "",
        monospace: "",
        "my-3": "",
        class: "uuid-display"
      }, null, _parent));
      _push(`<div flex justify-center gap-3 data-v-8623cf81>`);
      _push(ssrRenderComponent(_component_c_button, {
        autofocus: "",
        onClick: ($event) => unref(copy)()
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Copy `);
          } else {
            return [
              createTextVNode(" Copy ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_c_button, { onClick: unref(refreshUUIDs) }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Refresh `);
          } else {
            return [
              createTextVNode(" Refresh ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
    };
  }
});

/* unplugin-vue-components disabled */const uuidGenerator_vue_vue_type_style_index_0_scoped_8623cf81_lang = '';

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/tools/uuid-generator/uuid-generator.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const uuidGenerator = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-8623cf81"]]);

export { uuidGenerator as default };
