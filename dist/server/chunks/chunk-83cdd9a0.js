import { a as __unplugin_components_0 } from './chunk-6003391e.js';
import { defineComponent, toRefs, ref, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrIncludeBooleanAttr, ssrRenderAttr, ssrRenderSlot, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import 'lodash';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "c-file-upload",
  __ssrInlineRender: true,
  props: {
    multiple: { type: Boolean, default: false },
    accept: { default: void 0 },
    title: { default: "Drag and drop files here, or click to select files" }
  },
  emits: ["filesUpload", "fileUpload"],
  setup(__props, { emit }) {
    const props = __props;
    const { multiple } = toRefs(props);
    const isOverDropZone = ref(false);
    ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_c_button = __unplugin_components_0;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["flex flex-col cursor-pointer items-center justify-center border-2px border-gray-300 border-opacity-50 rounded-lg border-dashed p-8 transition-colors", {
          "border-primary border-opacity-100": unref(isOverDropZone)
        }]
      }, _attrs))}><input type="file" class="hidden"${ssrIncludeBooleanAttr(unref(multiple)) ? " multiple" : ""}${ssrRenderAttr("accept", _ctx.accept)}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, () => {
        _push(`<span op-70>${ssrInterpolate(_ctx.title)}</span><div my-4 w-full flex items-center justify-center op-70><div class="h-1px max-w-100px flex-1 bg-gray-300 op-50"></div><div class="mx-2 text-gray-400"> or </div><div class="h-1px max-w-100px flex-1 bg-gray-300 op-50"></div></div>`);
        _push(ssrRenderComponent(_component_c_button, null, {
          default: withCtx((_2, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Browse files `);
            } else {
              return [
                createTextVNode(" Browse files ")
              ];
            }
          }),
          _: 1
        }, _parent));
      }, _push, _parent);
      _push(`</div>`);
    };
  }
});

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/ui/c-file-upload/c-file-upload.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
