import { useThemeVars, NTable, NCheckbox } from 'naive-ui';
import { defineComponent, ref, computed, unref, mergeProps, withCtx, createVNode, openBlock, createBlock, Fragment, renderList, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { _ as _sfc_main$1 } from './chunk-de61ec1c.js';
import _ from 'lodash';
import { _ as _export_sfc } from './chunk-6003391e.js';
import './chunk-95ec8cf7.js';
import './chunk-8109fd17.js';
import '@vueuse/core';
import './chunk-4e7a6a8d.js';
import './chunk-11f44f81.js';
import './chunk-35c3d701.js';
import './chunk-77c5cc16.js';
import 'pinia';

function computeChmodOctalRepresentation({ permissions }) {
  const permissionValue = { read: 4, write: 2, execute: 1 };
  const getGroupPermissionValue = (permission) => _.reduce(permission, (acc, isPermSet, key) => acc + (isPermSet ? _.get(permissionValue, key, 0) : 0), 0);
  return [
    getGroupPermissionValue(permissions.owner),
    getGroupPermissionValue(permissions.group),
    getGroupPermissionValue(permissions.public)
  ].join("");
}
function computeChmodSymbolicRepresentation({ permissions }) {
  const permissionValue = { read: "r", write: "w", execute: "x" };
  const getGroupPermissionValue = (permission) => _.reduce(permission, (acc, isPermSet, key) => acc + (isPermSet ? _.get(permissionValue, key, "") : "-"), "");
  return [
    getGroupPermissionValue(permissions.owner),
    getGroupPermissionValue(permissions.group),
    getGroupPermissionValue(permissions.public)
  ].join("");
}

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "chmod-calculator",
  __ssrInlineRender: true,
  setup(__props) {
    const themeVars = useThemeVars();
    const scopes = [
      { scope: "read", title: "Read (4)" },
      { scope: "write", title: "Write (2)" },
      { scope: "execute", title: "Execute (1)" }
    ];
    const groups = ["owner", "group", "public"];
    const permissions = ref({
      owner: { read: false, write: false, execute: false },
      group: { read: false, write: false, execute: false },
      public: { read: false, write: false, execute: false }
    });
    const octal = computed(() => computeChmodOctalRepresentation({ permissions: permissions.value }));
    const symbolic = computed(() => computeChmodSymbolicRepresentation({ permissions: permissions.value }));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_n_table = NTable;
      const _component_n_checkbox = NCheckbox;
      const _cssVars = { style: {
        "--383ee3da": unref(themeVars).primaryColor
      } };
      _push(`<div${ssrRenderAttrs(mergeProps(_attrs, _cssVars))} data-v-55b63c39>`);
      _push(ssrRenderComponent(_component_n_table, {
        bordered: false,
        "bottom-bordered": false,
        "single-column": "",
        class: "permission-table"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<thead data-v-55b63c39${_scopeId}><tr data-v-55b63c39${_scopeId}><th class="text-center" scope="col" data-v-55b63c39${_scopeId}></th><th class="text-center" scope="col" data-v-55b63c39${_scopeId}> Owner (u) </th><th class="text-center" scope="col" data-v-55b63c39${_scopeId}> Group (g) </th><th class="text-center" scope="col" data-v-55b63c39${_scopeId}> Public (o) </th></tr></thead><tbody data-v-55b63c39${_scopeId}><!--[-->`);
            ssrRenderList(scopes, ({ scope, title }) => {
              _push2(`<tr data-v-55b63c39${_scopeId}><td class="line-header" data-v-55b63c39${_scopeId}>${ssrInterpolate(title)}</td><!--[-->`);
              ssrRenderList(groups, (group) => {
                _push2(`<td class="text-center" data-v-55b63c39${_scopeId}>`);
                _push2(ssrRenderComponent(_component_n_checkbox, {
                  checked: unref(permissions)[group][scope],
                  "onUpdate:checked": ($event) => unref(permissions)[group][scope] = $event,
                  size: "large"
                }, null, _parent2, _scopeId));
                _push2(`</td>`);
              });
              _push2(`<!--]--></tr>`);
            });
            _push2(`<!--]--></tbody>`);
          } else {
            return [
              createVNode("thead", null, [
                createVNode("tr", null, [
                  createVNode("th", {
                    class: "text-center",
                    scope: "col"
                  }),
                  createVNode("th", {
                    class: "text-center",
                    scope: "col"
                  }, " Owner (u) "),
                  createVNode("th", {
                    class: "text-center",
                    scope: "col"
                  }, " Group (g) "),
                  createVNode("th", {
                    class: "text-center",
                    scope: "col"
                  }, " Public (o) ")
                ])
              ]),
              createVNode("tbody", null, [
                (openBlock(), createBlock(Fragment, null, renderList(scopes, ({ scope, title }) => {
                  return createVNode("tr", { key: scope }, [
                    createVNode("td", { class: "line-header" }, toDisplayString(title), 1),
                    (openBlock(), createBlock(Fragment, null, renderList(groups, (group) => {
                      return createVNode("td", {
                        key: group,
                        class: "text-center"
                      }, [
                        createVNode(_component_n_checkbox, {
                          checked: unref(permissions)[group][scope],
                          "onUpdate:checked": ($event) => unref(permissions)[group][scope] = $event,
                          size: "large"
                        }, null, 8, ["checked", "onUpdate:checked"])
                      ]);
                    }), 64))
                  ]);
                }), 64))
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="octal-result" data-v-55b63c39>${ssrInterpolate(unref(octal))}</div><div class="octal-result" data-v-55b63c39>${ssrInterpolate(unref(symbolic))}</div>`);
      _push(ssrRenderComponent(_sfc_main$1, {
        value: `chmod ${unref(octal)} path`,
        readonly: ""
      }, null, _parent));
      _push(`</div>`);
    };
  }
});

/* unplugin-vue-components disabled */const chmodCalculator_vue_vue_type_style_index_0_scoped_55b63c39_lang = '';

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/tools/chmod-calculator/chmod-calculator.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const chmodCalculator = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-55b63c39"]]);

export { chmodCalculator as default };
