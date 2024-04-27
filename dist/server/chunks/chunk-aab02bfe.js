import { defineComponent, toRefs, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderList, ssrInterpolate, ssrRenderClass, ssrRenderSlot } from 'vue/server-renderer';
import _ from 'lodash';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "c-table",
  __ssrInlineRender: true,
  props: {
    data: { default: () => [] },
    headers: { default: void 0 },
    hideHeaders: { type: Boolean, default: false },
    description: { default: "Data table" }
  },
  setup(__props) {
    const props = __props;
    const { data, headers: rawHeaders, hideHeaders } = toRefs(props);
    const headers = computed(() => {
      if (rawHeaders.value) {
        if (Array.isArray(rawHeaders.value)) {
          return rawHeaders.value.map((value) => {
            if (typeof value === "string") {
              return { key: value, label: value };
            }
            const { key, label } = value;
            return {
              key,
              label: label ?? key
            };
          });
        }
        return _.map(rawHeaders.value, (value, key) => ({
          key,
          label: value
        }));
      }
      return _.chain(data.value).map((row) => Object.keys(row)).flatten().uniq().map((key) => ({ key, label: key })).value();
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "relative overflow-x-auto rounded" }, _attrs))}><table class="w-full border-collapse text-left text-sm text-gray-500 dark:text-gray-400" role="table"${ssrRenderAttr("aria-label", _ctx.description)}>`);
      if (!unref(hideHeaders)) {
        _push(`<thead class="bg-#ffffff uppercase text-gray-700 dark:bg-#333333 dark:text-gray-400" border-b="1px solid dark:transparent #efeff5"><tr><!--[-->`);
        ssrRenderList(unref(headers), (header) => {
          _push(`<th scope="col" class="px-6 py-3 text-xs">${ssrInterpolate(header.label)}</th>`);
        });
        _push(`<!--]--></tr></thead>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<tbody><!--[-->`);
      ssrRenderList(unref(data), (row, i) => {
        _push(`<tr border-b="1px solid dark:#282828 #efeff5" class="${ssrRenderClass([{
          "important:border-b-none": i === unref(data).length - 1
        }, "bg-white dark:bg-#232323"])}"><!--[-->`);
        ssrRenderList(unref(headers), (header) => {
          _push(`<td class="px-6 py-4">`);
          ssrRenderSlot(_ctx.$slots, header.key, {
            row,
            headers: unref(headers),
            value: row[header.key]
          }, () => {
            _push(`${ssrInterpolate(row[header.key])}`);
          }, _push, _parent);
          _push(`</td>`);
        });
        _push(`<!--]--></tr>`);
      });
      _push(`<!--]--></tbody></table></div>`);
    };
  }
});

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/ui/c-table/c-table.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
