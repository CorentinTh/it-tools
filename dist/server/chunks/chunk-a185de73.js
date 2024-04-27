import { NH2, NTag, NTable } from 'naive-ui';
import { _ as __unplugin_components_0 } from './chunk-89a4876c.js';
import { a as __unplugin_components_1 } from './chunk-8109fd17.js';
import { defineComponent, ref, computed, withCtx, createTextVNode, unref, isRef, toDisplayString, createVNode, openBlock, createBlock, Fragment, renderList, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderStyle, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { extensions, types } from 'mime-types';
import './chunk-6003391e.js';
import '@vueuse/core';
import 'pinia';
import './chunk-bb5bb4f6.js';
import './chunk-2ce6ed5e.js';
import 'fuse.js';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "mime-types",
  __ssrInlineRender: true,
  setup(__props) {
    const mimeInfos = Object.entries(extensions).map(([mimeType, extensions]) => ({ mimeType, extensions }));
    const mimeToExtensionsOptions = Object.keys(extensions).map((label) => ({ label, value: label }));
    const selectedMimeType = ref(void 0);
    const extensionsFound = computed(() => selectedMimeType.value ? extensions[selectedMimeType.value] : []);
    const extensionToMimeTypeOptions = Object.keys(types).map((label) => {
      const extension = `.${label}`;
      return { label: extension, value: label };
    });
    const selectedExtension = ref(void 0);
    const mimeTypeFound = computed(() => selectedExtension.value ? types[selectedExtension.value] : []);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_c_card = __unplugin_components_1;
      const _component_n_h2 = NH2;
      const _component_c_select = __unplugin_components_0;
      const _component_n_tag = NTag;
      const _component_n_table = NTable;
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_c_card, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_n_h2, { style: { "margin-bottom": "0" } }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Mime type to extension `);
                } else {
                  return [
                    createTextVNode(" Mime type to extension ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<div style="${ssrRenderStyle({ "opacity": "0.8" })}"${_scopeId}> Know which file extensions are associated to a mime-type </div>`);
            _push2(ssrRenderComponent(_component_c_select, {
              value: unref(selectedMimeType),
              "onUpdate:value": ($event) => isRef(selectedMimeType) ? selectedMimeType.value = $event : null,
              searchable: "",
              "my-4": "",
              options: unref(mimeToExtensionsOptions),
              placeholder: "Select your mimetype here... (ex: application/pdf)"
            }, null, _parent2, _scopeId));
            if (unref(extensionsFound).length > 0) {
              _push2(`<div${_scopeId}> Extensions of files with the `);
              _push2(ssrRenderComponent(_component_n_tag, {
                round: "",
                bordered: false
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(unref(selectedMimeType))}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(unref(selectedMimeType)), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(` mime-type: <div style="${ssrRenderStyle({ "margin-top": "10px" })}"${_scopeId}><!--[-->`);
              ssrRenderList(unref(extensionsFound), (extension) => {
                _push2(ssrRenderComponent(_component_n_tag, {
                  key: extension,
                  round: "",
                  bordered: false,
                  type: "primary",
                  style: { "margin-right": "10px" }
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(` .${ssrInterpolate(extension)}`);
                    } else {
                      return [
                        createTextVNode(" ." + toDisplayString(extension), 1)
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
              });
              _push2(`<!--]--></div></div>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode(_component_n_h2, { style: { "margin-bottom": "0" } }, {
                default: withCtx(() => [
                  createTextVNode(" Mime type to extension ")
                ]),
                _: 1
              }),
              createVNode("div", { style: { "opacity": "0.8" } }, " Know which file extensions are associated to a mime-type "),
              createVNode(_component_c_select, {
                value: unref(selectedMimeType),
                "onUpdate:value": ($event) => isRef(selectedMimeType) ? selectedMimeType.value = $event : null,
                searchable: "",
                "my-4": "",
                options: unref(mimeToExtensionsOptions),
                placeholder: "Select your mimetype here... (ex: application/pdf)"
              }, null, 8, ["value", "onUpdate:value", "options"]),
              unref(extensionsFound).length > 0 ? (openBlock(), createBlock("div", { key: 0 }, [
                createTextVNode(" Extensions of files with the "),
                createVNode(_component_n_tag, {
                  round: "",
                  bordered: false
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(unref(selectedMimeType)), 1)
                  ]),
                  _: 1
                }),
                createTextVNode(" mime-type: "),
                createVNode("div", { style: { "margin-top": "10px" } }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(unref(extensionsFound), (extension) => {
                    return openBlock(), createBlock(_component_n_tag, {
                      key: extension,
                      round: "",
                      bordered: false,
                      type: "primary",
                      style: { "margin-right": "10px" }
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" ." + toDisplayString(extension), 1)
                      ]),
                      _: 2
                    }, 1024);
                  }), 128))
                ])
              ])) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_c_card, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_n_h2, { style: { "margin-bottom": "0" } }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` File extension to mime type `);
                } else {
                  return [
                    createTextVNode(" File extension to mime type ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<div style="${ssrRenderStyle({ "opacity": "0.8" })}"${_scopeId}> Know which mime type is associated to a file extension </div>`);
            _push2(ssrRenderComponent(_component_c_select, {
              value: unref(selectedExtension),
              "onUpdate:value": ($event) => isRef(selectedExtension) ? selectedExtension.value = $event : null,
              searchable: "",
              "my-4": "",
              options: unref(extensionToMimeTypeOptions),
              placeholder: "Select your mimetype here... (ex: application/pdf)"
            }, null, _parent2, _scopeId));
            if (unref(selectedExtension)) {
              _push2(`<div${_scopeId}> Mime type associated to the extension `);
              _push2(ssrRenderComponent(_component_n_tag, {
                round: "",
                bordered: false
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(unref(selectedExtension))}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(unref(selectedExtension)), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(` file extension: <div style="${ssrRenderStyle({ "margin-top": "10px" })}"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_n_tag, {
                round: "",
                bordered: false,
                type: "primary",
                style: { "margin-right": "10px" }
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(unref(mimeTypeFound))}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(unref(mimeTypeFound)), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div></div>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode(_component_n_h2, { style: { "margin-bottom": "0" } }, {
                default: withCtx(() => [
                  createTextVNode(" File extension to mime type ")
                ]),
                _: 1
              }),
              createVNode("div", { style: { "opacity": "0.8" } }, " Know which mime type is associated to a file extension "),
              createVNode(_component_c_select, {
                value: unref(selectedExtension),
                "onUpdate:value": ($event) => isRef(selectedExtension) ? selectedExtension.value = $event : null,
                searchable: "",
                "my-4": "",
                options: unref(extensionToMimeTypeOptions),
                placeholder: "Select your mimetype here... (ex: application/pdf)"
              }, null, 8, ["value", "onUpdate:value", "options"]),
              unref(selectedExtension) ? (openBlock(), createBlock("div", { key: 0 }, [
                createTextVNode(" Mime type associated to the extension "),
                createVNode(_component_n_tag, {
                  round: "",
                  bordered: false
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(unref(selectedExtension)), 1)
                  ]),
                  _: 1
                }),
                createTextVNode(" file extension: "),
                createVNode("div", { style: { "margin-top": "10px" } }, [
                  createVNode(_component_n_tag, {
                    round: "",
                    bordered: false,
                    type: "primary",
                    style: { "margin-right": "10px" }
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(unref(mimeTypeFound)), 1)
                    ]),
                    _: 1
                  })
                ])
              ])) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div>`);
      _push(ssrRenderComponent(_component_n_table, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<thead${_scopeId}><tr${_scopeId}><th${_scopeId}>Mime types</th><th${_scopeId}>Extensions</th></tr></thead><tbody${_scopeId}><!--[-->`);
            ssrRenderList(unref(mimeInfos), ({ mimeType, extensions }) => {
              _push2(`<tr${_scopeId}><td${_scopeId}>${ssrInterpolate(mimeType)}</td><td${_scopeId}><!--[-->`);
              ssrRenderList(extensions, (extension) => {
                _push2(ssrRenderComponent(_component_n_tag, {
                  key: extension,
                  round: "",
                  bordered: false,
                  style: { "margin-right": "10px" }
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(` .${ssrInterpolate(extension)}`);
                    } else {
                      return [
                        createTextVNode(" ." + toDisplayString(extension), 1)
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
              });
              _push2(`<!--]--></td></tr>`);
            });
            _push2(`<!--]--></tbody>`);
          } else {
            return [
              createVNode("thead", null, [
                createVNode("tr", null, [
                  createVNode("th", null, "Mime types"),
                  createVNode("th", null, "Extensions")
                ])
              ]),
              createVNode("tbody", null, [
                (openBlock(true), createBlock(Fragment, null, renderList(unref(mimeInfos), ({ mimeType, extensions }) => {
                  return openBlock(), createBlock("tr", { key: mimeType }, [
                    createVNode("td", null, toDisplayString(mimeType), 1),
                    createVNode("td", null, [
                      (openBlock(true), createBlock(Fragment, null, renderList(extensions, (extension) => {
                        return openBlock(), createBlock(_component_n_tag, {
                          key: extension,
                          round: "",
                          bordered: false,
                          style: { "margin-right": "10px" }
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" ." + toDisplayString(extension), 1)
                          ]),
                          _: 2
                        }, 1024);
                      }), 128))
                    ])
                  ]);
                }), 128))
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><!--]-->`);
    };
  }
});

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/tools/mime-types/mime-types.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
