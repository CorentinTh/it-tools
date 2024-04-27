import { _ as _sfc_main$2 } from './chunk-aff50618.js';
import { defineComponent, toRefs, unref, mergeProps, useSSRContext, computed } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import _ from 'lodash';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "c-key-value-list-item",
  __ssrInlineRender: true,
  props: {
    item: {}
  },
  setup(__props) {
    const props = __props;
    const { item } = toRefs(props);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_c_text_copyable = _sfc_main$2;
      if (unref(_).isArray(unref(item).value)) {
        _push(`<div${ssrRenderAttrs(_attrs)}><!--[-->`);
        ssrRenderList(unref(item).value, (value) => {
          _push(`<div>`);
          _push(ssrRenderComponent(_component_c_text_copyable, {
            value,
            "show-icon": unref(item).showCopyButton ?? true
          }, null, _parent));
          _push(`</div>`);
        });
        _push(`<!--]--></div>`);
      } else if (unref(_).isBoolean(unref(item).value)) {
        _push(`<div${ssrRenderAttrs(_attrs)}>`);
        _push(ssrRenderComponent(_component_c_text_copyable, {
          value: unref(item).value ? "true" : "false",
          "displayed-value": unref(item).value ? "Yes" : "No",
          "show-icon": unref(item).showCopyButton ?? true
        }, null, _parent));
        _push(`</div>`);
      } else if (unref(_).isNumber(unref(item).value)) {
        _push(`<div${ssrRenderAttrs(mergeProps({ "font-mono": "" }, _attrs))}>`);
        _push(ssrRenderComponent(_component_c_text_copyable, {
          value: String(unref(item).value),
          "show-icon": unref(item).showCopyButton ?? true
        }, null, _parent));
        _push(`</div>`);
      } else if (unref(_).isNil(unref(item).value) || unref(item).value === "") {
        _push(`<div${ssrRenderAttrs(mergeProps({ "op-70": "" }, _attrs))}>${ssrInterpolate(unref(item).placeholder ?? "N/A")}</div>`);
      } else {
        _push(`<div${ssrRenderAttrs(_attrs)}>`);
        _push(ssrRenderComponent(_component_c_text_copyable, {
          value: unref(item).value,
          "show-icon": unref(item).showCopyButton ?? true
        }, null, _parent));
        _push(`</div>`);
      }
    };
  }
});

const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/ui/c-key-value-list/c-key-value-list-item.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "c-key-value-list",
  __ssrInlineRender: true,
  props: {
    items: { default: () => [] }
  },
  setup(__props) {
    const props = __props;
    const { items } = toRefs(props);
    const formattedItems = computed(() => items.value.filter((item) => !_.isNil(item.value) || !item.hideOnNil));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_c_key_value_list_item = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({
        flex: "",
        "flex-col": "",
        "gap-2": ""
      }, _attrs))}><!--[-->`);
      ssrRenderList(unref(formattedItems), (item) => {
        _push(`<div class="c-key-value-list__item"><div class="c-key-value-list__key" text-13px lh-normal>${ssrInterpolate(item.label)}</div>`);
        _push(ssrRenderComponent(_component_c_key_value_list_item, {
          item,
          class: "c-key-value-list__value",
          "font-bold": "",
          "lh-normal": ""
        }, null, _parent));
        _push(`</div>`);
      });
      _push(`<!--]--></div>`);
    };
  }
});

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/ui/c-key-value-list/c-key-value-list.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
