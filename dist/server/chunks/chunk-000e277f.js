import { a as __unplugin_components_0 } from './chunk-6003391e.js';
import { _ as _sfc_main$2 } from './chunk-8109fd17.js';
import { _ as _sfc_main$1 } from './chunk-bb5bb4f6.js';
import { defineComponent, toRefs, computed, mergeProps, withCtx, unref, createTextVNode, toDisplayString, createVNode, openBlock, createBlock, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import _ from 'lodash';
import { useVModel } from '@vueuse/core';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "c-buttons-select",
  __ssrInlineRender: true,
  props: {
    options: { default: () => [] },
    value: { default: void 0 },
    size: { default: "medium" },
    label: {},
    labelFor: {},
    labelPosition: { default: "left" },
    labelWidth: {},
    labelAlign: {}
  },
  emits: ["update:value"],
  setup(__props, { emit: emits }) {
    const props = __props;
    const { options: rawOptions, size } = toRefs(props);
    const options = computed(() => {
      if (_.isArray(rawOptions.value)) {
        return rawOptions.value.map((option) => {
          if (typeof option === "string") {
            return { label: option, value: option };
          }
          return option;
        });
      }
      return _.map(rawOptions.value, (value2, label) => ({ label, value: value2 }));
    });
    const value = useVModel(props, "value", emits);
    function selectOption(option) {
      value.value = option.value;
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_c_label = _sfc_main$1;
      const _component_c_tooltip = _sfc_main$2;
      const _component_c_button = __unplugin_components_0;
      _push(ssrRenderComponent(_component_c_label, mergeProps(props, _attrs), {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex gap-2"${_scopeId}><!--[-->`);
            ssrRenderList(unref(options), (option) => {
              _push2(ssrRenderComponent(_component_c_tooltip, {
                key: option.value,
                tooltip: option.tooltip
              }, {
                default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_c_button, {
                      "test-id": option.value,
                      size: unref(size),
                      type: option.value === unref(value) ? "primary" : "default",
                      onClick: ($event) => selectOption(option)
                    }, {
                      default: withCtx((_4, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${ssrInterpolate(option.label)}`);
                        } else {
                          return [
                            createTextVNode(toDisplayString(option.label), 1)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_c_button, {
                        "test-id": option.value,
                        size: unref(size),
                        type: option.value === unref(value) ? "primary" : "default",
                        onClick: ($event) => selectOption(option)
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(option.label), 1)
                        ]),
                        _: 2
                      }, 1032, ["test-id", "size", "type", "onClick"])
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]--></div>`);
          } else {
            return [
              createVNode("div", { class: "flex gap-2" }, [
                (openBlock(true), createBlock(Fragment, null, renderList(unref(options), (option) => {
                  return openBlock(), createBlock(_component_c_tooltip, {
                    key: option.value,
                    tooltip: option.tooltip
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_c_button, {
                        "test-id": option.value,
                        size: unref(size),
                        type: option.value === unref(value) ? "primary" : "default",
                        onClick: ($event) => selectOption(option)
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(option.label), 1)
                        ]),
                        _: 2
                      }, 1032, ["test-id", "size", "type", "onClick"])
                    ]),
                    _: 2
                  }, 1032, ["tooltip"]);
                }), 128))
              ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/ui/c-buttons-select/c-buttons-select.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
