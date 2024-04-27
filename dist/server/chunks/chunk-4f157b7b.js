import { NInputGroup, NInputGroupLabel } from 'naive-ui';
import { a as __unplugin_components_1 } from './chunk-8109fd17.js';
import { defineComponent, ref, computed, withCtx, unref, openBlock, createBlock, toDisplayString, createCommentVNode, createVNode, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { useEventListener } from '@vueuse/core';
import { _ as _sfc_main$1 } from './chunk-de61ec1c.js';
import './chunk-6003391e.js';
import 'pinia';
import './chunk-95ec8cf7.js';
import './chunk-4e7a6a8d.js';
import './chunk-11f44f81.js';
import './chunk-35c3d701.js';
import 'lodash';
import './chunk-77c5cc16.js';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "keycode-info",
  __ssrInlineRender: true,
  setup(__props) {
    const event = ref();
    useEventListener(document, "keydown", (e) => {
      event.value = e;
    });
    const fields = computed(() => {
      if (!event.value) {
        return [];
      }
      return [
        {
          label: "Key :",
          value: event.value.key,
          placeholder: "Key name..."
        },
        {
          label: "Keycode :",
          value: String(event.value.keyCode),
          placeholder: "Keycode..."
        },
        {
          label: "Code :",
          value: event.value.code,
          placeholder: "Code..."
        },
        {
          label: "Location :",
          value: String(event.value.location),
          placeholder: "Code..."
        },
        {
          label: "Modifiers :",
          value: [
            event.value.metaKey && "Meta",
            event.value.shiftKey && "Shift",
            event.value.ctrlKey && "Ctrl",
            event.value.altKey && "Alt"
          ].filter(Boolean).join(" + "),
          placeholder: "None"
        }
      ];
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_c_card = __unplugin_components_1;
      const _component_n_input_group = NInputGroup;
      const _component_n_input_group_label = NInputGroupLabel;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_c_card, {
        "mb-5": "",
        "text-center": "",
        "important:py-12": ""
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (unref(event)) {
              _push2(`<div mb-2 text-3xl${_scopeId}>${ssrInterpolate(unref(event).key)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<span lh-1 op-70${_scopeId}> Press the key on your keyboard you want to get info about this key </span>`);
          } else {
            return [
              unref(event) ? (openBlock(), createBlock("div", {
                key: 0,
                "mb-2": "",
                "text-3xl": ""
              }, toDisplayString(unref(event).key), 1)) : createCommentVNode("", true),
              createVNode("span", {
                "lh-1": "",
                "op-70": ""
              }, " Press the key on your keyboard you want to get info about this key ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--[-->`);
      ssrRenderList(unref(fields), ({ label, value, placeholder }, i) => {
        _push(ssrRenderComponent(_component_n_input_group, {
          key: i,
          style: { "margin-bottom": "5px" }
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_n_input_group_label, { style: { "flex": "0 0 150px" } }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(label)}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(label), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_sfc_main$1, {
                value,
                readonly: "",
                placeholder
              }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_n_input_group_label, { style: { "flex": "0 0 150px" } }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(label), 1)
                  ]),
                  _: 2
                }, 1024),
                createVNode(_sfc_main$1, {
                  value,
                  readonly: "",
                  placeholder
                }, null, 8, ["value", "placeholder"])
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div>`);
    };
  }
});

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/tools/keycode-info/keycode-info.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
