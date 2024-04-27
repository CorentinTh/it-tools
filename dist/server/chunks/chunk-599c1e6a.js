import { _ as _sfc_main$1 } from './chunk-83cdd9a0.js';
import { a as __unplugin_components_0, _ as _export_sfc } from './chunk-6003391e.js';
import { _ as __unplugin_components_3 } from './chunk-4e7a6a8d.js';
import { a as __unplugin_components_1 } from './chunk-8109fd17.js';
import { defineComponent, ref, withCtx, unref, isRef, createTextVNode, createVNode, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import { useBase64 } from '@vueuse/core';
import { u as useCopy } from './chunk-77c5cc16.js';
import { u as useDownloadFileFromBase64 } from './chunk-cce4ae69.js';
import { u as useValidation } from './chunk-35c3d701.js';
import { i as isValidBase64 } from './chunk-72fc6fca.js';
import 'lodash';
import 'pinia';
import './chunk-11f44f81.js';
import 'naive-ui';
import 'mime-types';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "base64-file-converter",
  __ssrInlineRender: true,
  setup(__props) {
    const base64Input = ref("");
    const { download } = useDownloadFileFromBase64({ source: base64Input });
    const base64InputValidation = useValidation({
      source: base64Input,
      rules: [
        {
          message: "Invalid base 64 string",
          validator: (value) => isValidBase64(value.trim())
        }
      ]
    });
    function downloadFile() {
      if (!base64InputValidation.isValid) {
        return;
      }
      try {
        download();
      } catch (_) {
      }
    }
    const fileInput = ref();
    const { base64: fileBase64 } = useBase64(fileInput);
    const { copy: copyFileBase64 } = useCopy({ source: fileBase64, text: "Base64 string copied to the clipboard" });
    async function onUpload(file) {
      if (file) {
        fileInput.value = file;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_c_card = __unplugin_components_1;
      const _component_c_input_text = __unplugin_components_3;
      const _component_c_button = __unplugin_components_0;
      const _component_c_file_upload = _sfc_main$1;
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_c_card, { title: "Base64 to file" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_c_input_text, {
              value: unref(base64Input),
              "onUpdate:value": ($event) => isRef(base64Input) ? base64Input.value = $event : null,
              multiline: "",
              placeholder: "Put your base64 file string here...",
              rows: "5",
              validation: unref(base64InputValidation),
              "mb-2": ""
            }, null, _parent2, _scopeId));
            _push2(`<div flex justify-center data-v-7721e582${_scopeId}>`);
            _push2(ssrRenderComponent(_component_c_button, {
              disabled: unref(base64Input) === "" || !unref(base64InputValidation).isValid,
              onClick: ($event) => downloadFile()
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Download file `);
                } else {
                  return [
                    createTextVNode(" Download file ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode(_component_c_input_text, {
                value: unref(base64Input),
                "onUpdate:value": ($event) => isRef(base64Input) ? base64Input.value = $event : null,
                multiline: "",
                placeholder: "Put your base64 file string here...",
                rows: "5",
                validation: unref(base64InputValidation),
                "mb-2": ""
              }, null, 8, ["value", "onUpdate:value", "validation"]),
              createVNode("div", {
                flex: "",
                "justify-center": ""
              }, [
                createVNode(_component_c_button, {
                  disabled: unref(base64Input) === "" || !unref(base64InputValidation).isValid,
                  onClick: ($event) => downloadFile()
                }, {
                  default: withCtx(() => [
                    createTextVNode(" Download file ")
                  ]),
                  _: 1
                }, 8, ["disabled", "onClick"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_c_card, { title: "File to base64" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_c_file_upload, {
              title: "Drag and drop a file here, or click to select a file",
              onFileUpload: onUpload
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_c_input_text, {
              value: unref(fileBase64),
              multiline: "",
              readonly: "",
              placeholder: "File in base64 will be here",
              rows: "5",
              "my-2": ""
            }, null, _parent2, _scopeId));
            _push2(`<div flex justify-center data-v-7721e582${_scopeId}>`);
            _push2(ssrRenderComponent(_component_c_button, {
              onClick: ($event) => unref(copyFileBase64)()
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Copy `);
                } else {
                  return [
                    createTextVNode(" Copy ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode(_component_c_file_upload, {
                title: "Drag and drop a file here, or click to select a file",
                onFileUpload: onUpload
              }),
              createVNode(_component_c_input_text, {
                value: unref(fileBase64),
                multiline: "",
                readonly: "",
                placeholder: "File in base64 will be here",
                rows: "5",
                "my-2": ""
              }, null, 8, ["value"]),
              createVNode("div", {
                flex: "",
                "justify-center": ""
              }, [
                createVNode(_component_c_button, {
                  onClick: ($event) => unref(copyFileBase64)()
                }, {
                  default: withCtx(() => [
                    createTextVNode(" Copy ")
                  ]),
                  _: 1
                }, 8, ["onClick"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
});

/* unplugin-vue-components disabled */const base64FileConverter_vue_vue_type_style_index_0_scoped_7721e582_lang = '';

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/tools/base64-file-converter/base64-file-converter.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const base64FileConverter = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-7721e582"]]);

export { base64FileConverter as default };
