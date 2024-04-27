import { NTable, NAlert, NIcon } from 'naive-ui';
import { a as __unplugin_components_0 } from './chunk-6003391e.js';
import { _ as __unplugin_components_3 } from './chunk-4e7a6a8d.js';
import { defineComponent, toRefs, computed, unref, useSSRContext, isRef, withCtx, createVNode, openBlock, createBlock, Fragment, renderList, createTextVNode } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrRenderComponent, ssrRenderList } from 'vue/server-renderer';
import { Exchange } from '@vicons/tabler';
import { i as ipv4ToInt, a as isValidIpv4 } from './chunk-7b2d32fe.js';
import { c as convertBase } from './chunk-5f44352e.js';
import _ from 'lodash';
import { _ as _sfc_main$2 } from './chunk-588e4d58.js';
import { u as useValidation } from './chunk-35c3d701.js';
import { useStorage } from '@vueuse/core';
import 'pinia';
import './chunk-11f44f81.js';
import './chunk-8109fd17.js';
import './chunk-77c5cc16.js';

function bits2ip(ipInt) {
  return `${ipInt >>> 24}.${ipInt >> 16 & 255}.${ipInt >> 8 & 255}.${ipInt & 255}`;
}
function getRangesize(start, end) {
  if (start == null || end == null) {
    return -1;
  }
  return 1 + Number.parseInt(end, 2) - Number.parseInt(start, 2);
}
function getCidr(start, end) {
  if (start == null || end == null) {
    return null;
  }
  const range = getRangesize(start, end);
  if (range < 1) {
    return null;
  }
  let mask = 32;
  for (let i = 0; i < 32; i++) {
    if (start[i] !== end[i]) {
      mask = i;
      break;
    }
  }
  const newStart = start.substring(0, mask) + "0".repeat(32 - mask);
  const newEnd = end.substring(0, mask) + "1".repeat(32 - mask);
  return { start: newStart, end: newEnd, mask };
}
function calculateCidr({ startIp, endIp }) {
  const start = convertBase({
    value: ipv4ToInt({ ip: startIp }).toString(),
    fromBase: 10,
    toBase: 2
  }).padStart(32, "0");
  const end = convertBase({
    value: ipv4ToInt({ ip: endIp }).toString(),
    fromBase: 10,
    toBase: 2
  }).padStart(32, "0");
  const cidr = getCidr(start, end);
  if (cidr != null) {
    const result = {};
    result.newEnd = bits2ip(Number.parseInt(cidr.end, 2));
    result.newStart = bits2ip(Number.parseInt(cidr.start, 2));
    result.newCidr = `${result.newStart}/${cidr.mask}`;
    result.newSize = getRangesize(cidr.start, cidr.end);
    result.oldSize = getRangesize(start, end);
    return result;
  }
  return void 0;
}

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "result-row",
  __ssrInlineRender: true,
  props: {
    label: { default: "" },
    oldValue: { default: "" },
    newValue: { default: "" }
  },
  setup(__props) {
    const props = __props;
    const { label, oldValue, newValue } = toRefs(props);
    const testId = computed(() => _.kebabCase(label.value));
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<tr${ssrRenderAttrs(_attrs)}><td font-bold>${ssrInterpolate(unref(label))}</td><td${ssrRenderAttr("data-test-id", `${unref(testId)}.old`)}>`);
      _push(ssrRenderComponent(_sfc_main$2, {
        value: unref(oldValue),
        class: "monospace"
      }, null, _parent));
      _push(`</td><td${ssrRenderAttr("data-test-id", `${unref(testId)}.new`)}>`);
      _push(ssrRenderComponent(_sfc_main$2, { value: unref(newValue) }, null, _parent));
      _push(`</td></tr>`);
    };
  }
});

const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/tools/ipv4-range-expander/result-row.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ipv4-range-expander",
  __ssrInlineRender: true,
  setup(__props) {
    const rawStartAddress = useStorage("ipv4-range-expander:startAddress", "192.168.1.1");
    const rawEndAddress = useStorage("ipv4-range-expander:endAddress", "192.168.6.255");
    const result = computed(() => calculateCidr({ startIp: rawStartAddress.value, endIp: rawEndAddress.value }));
    const calculatedValues = [
      {
        label: "Start address",
        getOldValue: () => rawStartAddress.value,
        getNewValue: (result2) => result2?.newStart
      },
      {
        label: "End address",
        getOldValue: () => rawEndAddress.value,
        getNewValue: (result2) => result2?.newEnd
      },
      {
        label: "Addresses in range",
        getOldValue: (result2) => result2?.oldSize?.toLocaleString(),
        getNewValue: (result2) => result2?.newSize?.toLocaleString()
      },
      {
        label: "CIDR",
        getOldValue: () => "",
        getNewValue: (result2) => result2?.newCidr
      }
    ];
    const startIpValidation = useValidation({
      source: rawStartAddress,
      rules: [{ message: "Invalid ipv4 address", validator: (ip) => isValidIpv4({ ip }) }]
    });
    const endIpValidation = useValidation({
      source: rawEndAddress,
      rules: [{ message: "Invalid ipv4 address", validator: (ip) => isValidIpv4({ ip }) }]
    });
    const showResult = computed(() => endIpValidation.isValid && startIpValidation.isValid && result.value !== void 0);
    function onSwitchStartEndClicked() {
      const tmpStart = rawStartAddress.value;
      rawStartAddress.value = rawEndAddress.value;
      rawEndAddress.value = tmpStart;
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_c_input_text = __unplugin_components_3;
      const _component_n_table = NTable;
      const _component_n_alert = NAlert;
      const _component_c_button = __unplugin_components_0;
      const _component_n_icon = NIcon;
      _push(`<div${ssrRenderAttrs(_attrs)}><div mb-4 flex gap-4>`);
      _push(ssrRenderComponent(_component_c_input_text, {
        value: unref(rawStartAddress),
        "onUpdate:value": ($event) => isRef(rawStartAddress) ? rawStartAddress.value = $event : null,
        label: "Start address",
        placeholder: "Start IPv4 address...",
        validation: unref(startIpValidation),
        clearable: ""
      }, null, _parent));
      _push(ssrRenderComponent(_component_c_input_text, {
        value: unref(rawEndAddress),
        "onUpdate:value": ($event) => isRef(rawEndAddress) ? rawEndAddress.value = $event : null,
        label: "End address",
        placeholder: "End IPv4 address...",
        validation: unref(endIpValidation),
        clearable: ""
      }, null, _parent));
      _push(`</div>`);
      if (unref(showResult)) {
        _push(ssrRenderComponent(_component_n_table, { "data-test-id": "result" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<thead${_scopeId}><tr${_scopeId}><th scope="col"${_scopeId}>   </th><th scope="col"${_scopeId}> old value </th><th scope="col"${_scopeId}> new value </th></tr></thead><tbody${_scopeId}><!--[-->`);
              ssrRenderList(calculatedValues, ({ label, getOldValue, getNewValue }) => {
                _push2(ssrRenderComponent(_sfc_main$1, {
                  key: label,
                  label,
                  "old-value": getOldValue(unref(result)),
                  "new-value": getNewValue(unref(result))
                }, null, _parent2, _scopeId));
              });
              _push2(`<!--]--></tbody>`);
            } else {
              return [
                createVNode("thead", null, [
                  createVNode("tr", null, [
                    createVNode("th", { scope: "col" }, "   "),
                    createVNode("th", { scope: "col" }, " old value "),
                    createVNode("th", { scope: "col" }, " new value ")
                  ])
                ]),
                createVNode("tbody", null, [
                  (openBlock(), createBlock(Fragment, null, renderList(calculatedValues, ({ label, getOldValue, getNewValue }) => {
                    return createVNode(_sfc_main$1, {
                      key: label,
                      label,
                      "old-value": getOldValue(unref(result)),
                      "new-value": getNewValue(unref(result))
                    }, null, 8, ["label", "old-value", "new-value"]);
                  }), 64))
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
      } else if (unref(startIpValidation).isValid && unref(endIpValidation).isValid) {
        _push(ssrRenderComponent(_component_n_alert, {
          title: "Invalid combination of start and end IPv4 address",
          type: "error"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div my-3 op-70${_scopeId}> The end IPv4 address is lower than the start IPv4 address. This is not valid and no result could be calculated. In the most cases the solution to solve this problem is to change start and end address. </div>`);
              _push2(ssrRenderComponent(_component_c_button, { onClick: onSwitchStartEndClicked }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_n_icon, {
                      "mr-2": "",
                      component: unref(Exchange),
                      depth: "3",
                      size: "22"
                    }, null, _parent3, _scopeId2));
                    _push3(` Switch start and end IPv4 address `);
                  } else {
                    return [
                      createVNode(_component_n_icon, {
                        "mr-2": "",
                        component: unref(Exchange),
                        depth: "3",
                        size: "22"
                      }, null, 8, ["component"]),
                      createTextVNode(" Switch start and end IPv4 address ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode("div", {
                  "my-3": "",
                  "op-70": ""
                }, " The end IPv4 address is lower than the start IPv4 address. This is not valid and no result could be calculated. In the most cases the solution to solve this problem is to change start and end address. "),
                createVNode(_component_c_button, { onClick: onSwitchStartEndClicked }, {
                  default: withCtx(() => [
                    createVNode(_component_n_icon, {
                      "mr-2": "",
                      component: unref(Exchange),
                      depth: "3",
                      size: "22"
                    }, null, 8, ["component"]),
                    createTextVNode(" Switch start and end IPv4 address ")
                  ]),
                  _: 1
                })
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/tools/ipv4-range-expander/ipv4-range-expander.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
