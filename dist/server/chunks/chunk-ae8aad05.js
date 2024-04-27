import { NGrid, NGi, NEllipsis } from 'naive-ui';
import { a as __unplugin_components_1 } from './chunk-8109fd17.js';
import { defineComponent, computed, withCtx, createTextVNode, toDisplayString, createVNode, openBlock, createBlock, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderList, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { useWindowSize } from '@vueuse/core';
import { _ as _export_sfc } from './chunk-6003391e.js';
import 'pinia';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "device-information",
  __ssrInlineRender: true,
  setup(__props) {
    const { width, height } = useWindowSize();
    const sections = [
      {
        name: "Screen",
        information: [
          {
            label: "Screen size",
            value: computed(() => `${window.screen.availWidth} x ${window.screen.availHeight}`)
          },
          {
            label: "Orientation",
            value: computed(() => window.screen.orientation.type)
          },
          {
            label: "Orientation angle",
            value: computed(() => `${window.screen.orientation.angle}°`)
          },
          {
            label: "Color depth",
            value: computed(() => `${window.screen.colorDepth} bits`)
          },
          {
            label: "Pixel ratio",
            value: computed(() => `${window.devicePixelRatio} dppx`)
          },
          {
            label: "Window size",
            value: computed(() => `${width.value} x ${height.value}`)
          }
        ]
      },
      {
        name: "Device",
        information: [
          {
            label: "Browser vendor",
            value: computed(() => navigator.vendor)
          },
          {
            label: "Languages",
            value: computed(() => navigator.languages.join(", "))
          },
          {
            label: "Platform",
            value: computed(() => navigator.platform)
          },
          {
            label: "User agent",
            value: computed(() => navigator.userAgent)
          }
        ]
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_c_card = __unplugin_components_1;
      const _component_n_grid = NGrid;
      const _component_n_gi = NGi;
      const _component_n_ellipsis = NEllipsis;
      _push(`<!--[-->`);
      ssrRenderList(sections, ({ name, information }) => {
        _push(ssrRenderComponent(_component_c_card, {
          key: name,
          title: name
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_n_grid, {
                cols: "1 400:2",
                "x-gap": "12",
                "y-gap": "12"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<!--[-->`);
                    ssrRenderList(information, ({ label, value: { value } }) => {
                      _push3(ssrRenderComponent(_component_n_gi, {
                        key: label,
                        class: "information"
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`<div class="label" data-v-3d05d2aa${_scopeId3}>${ssrInterpolate(label)}</div><div class="value" data-v-3d05d2aa${_scopeId3}>`);
                            if (value) {
                              _push4(ssrRenderComponent(_component_n_ellipsis, null, {
                                default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                  if (_push5) {
                                    _push5(`${ssrInterpolate(value)}`);
                                  } else {
                                    return [
                                      createTextVNode(toDisplayString(value), 1)
                                    ];
                                  }
                                }),
                                _: 2
                              }, _parent4, _scopeId3));
                            } else {
                              _push4(`<div class="undefined-value" data-v-3d05d2aa${_scopeId3}> unknown </div>`);
                            }
                            _push4(`</div>`);
                          } else {
                            return [
                              createVNode("div", { class: "label" }, toDisplayString(label), 1),
                              createVNode("div", { class: "value" }, [
                                value ? (openBlock(), createBlock(_component_n_ellipsis, { key: 0 }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(value), 1)
                                  ]),
                                  _: 2
                                }, 1024)) : (openBlock(), createBlock("div", {
                                  key: 1,
                                  class: "undefined-value"
                                }, " unknown "))
                              ])
                            ];
                          }
                        }),
                        _: 2
                      }, _parent3, _scopeId2));
                    });
                    _push3(`<!--]-->`);
                  } else {
                    return [
                      (openBlock(true), createBlock(Fragment, null, renderList(information, ({ label, value: { value } }) => {
                        return openBlock(), createBlock(_component_n_gi, {
                          key: label,
                          class: "information"
                        }, {
                          default: withCtx(() => [
                            createVNode("div", { class: "label" }, toDisplayString(label), 1),
                            createVNode("div", { class: "value" }, [
                              value ? (openBlock(), createBlock(_component_n_ellipsis, { key: 0 }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(value), 1)
                                ]),
                                _: 2
                              }, 1024)) : (openBlock(), createBlock("div", {
                                key: 1,
                                class: "undefined-value"
                              }, " unknown "))
                            ])
                          ]),
                          _: 2
                        }, 1024);
                      }), 128))
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_n_grid, {
                  cols: "1 400:2",
                  "x-gap": "12",
                  "y-gap": "12"
                }, {
                  default: withCtx(() => [
                    (openBlock(true), createBlock(Fragment, null, renderList(information, ({ label, value: { value } }) => {
                      return openBlock(), createBlock(_component_n_gi, {
                        key: label,
                        class: "information"
                      }, {
                        default: withCtx(() => [
                          createVNode("div", { class: "label" }, toDisplayString(label), 1),
                          createVNode("div", { class: "value" }, [
                            value ? (openBlock(), createBlock(_component_n_ellipsis, { key: 0 }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(value), 1)
                              ]),
                              _: 2
                            }, 1024)) : (openBlock(), createBlock("div", {
                              key: 1,
                              class: "undefined-value"
                            }, " unknown "))
                          ])
                        ]),
                        _: 2
                      }, 1024);
                    }), 128))
                  ]),
                  _: 2
                }, 1024)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]-->`);
    };
  }
});

/* unplugin-vue-components disabled */const deviceInformation_vue_vue_type_style_index_0_scoped_3d05d2aa_lang = '';

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/tools/device-information/device-information.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const deviceInformation = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-3d05d2aa"]]);

export { deviceInformation as default };
