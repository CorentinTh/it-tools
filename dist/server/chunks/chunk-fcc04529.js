import { NTable, NIcon } from 'naive-ui';
import { a as __unplugin_components_0 } from './chunk-6003391e.js';
import { _ as __unplugin_components_3 } from './chunk-4e7a6a8d.js';
import { defineComponent, computed, unref, isRef, withCtx, createVNode, openBlock, createBlock, Fragment, renderList, toDisplayString, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { Netmask } from 'netmask';
import { useStorage } from '@vueuse/core';
import { ArrowLeft, ArrowRight } from '@vicons/tabler';
import { w as withDefaultOnError } from './chunk-f1b4cc24.js';
import { i as isNotThrowing } from './chunk-5697d061.js';
import { _ as _sfc_main$1 } from './chunk-588e4d58.js';
import 'pinia';
import './chunk-11f44f81.js';
import './chunk-35c3d701.js';
import 'lodash';
import './chunk-8109fd17.js';
import './chunk-77c5cc16.js';

function getIPClass({ ip }) {
  const [firstOctet] = ip.split(".").map(Number);
  if (firstOctet < 128) {
    return "A";
  }
  if (firstOctet > 127 && firstOctet < 192) {
    return "B";
  }
  if (firstOctet > 191 && firstOctet < 224) {
    return "C";
  }
  if (firstOctet > 223 && firstOctet < 240) {
    return "D";
  }
  if (firstOctet > 239 && firstOctet < 256) {
    return "E";
  }
  return void 0;
}

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ipv4-subnet-calculator",
  __ssrInlineRender: true,
  setup(__props) {
    const ip = useStorage("ipv4-subnet-calculator:ip", "192.168.0.1/24");
    const getNetworkInfo = (address) => new Netmask(address.trim());
    const networkInfo = computed(() => withDefaultOnError(() => getNetworkInfo(ip.value), void 0));
    const ipValidationRules = [
      {
        message: "We cannot parse this address, check the format",
        validator: (value) => isNotThrowing(() => getNetworkInfo(value.trim()))
      }
    ];
    const sections = [
      {
        label: "Netmask",
        getValue: (block) => block.toString()
      },
      {
        label: "Network address",
        getValue: ({ base }) => base
      },
      {
        label: "Network mask",
        getValue: ({ mask }) => mask
      },
      {
        label: "Network mask in binary",
        getValue: ({ bitmask }) => ("1".repeat(bitmask) + "0".repeat(32 - bitmask)).match(/.{8}/g)?.join(".") ?? ""
      },
      {
        label: "CIDR notation",
        getValue: ({ bitmask }) => `/${bitmask}`
      },
      {
        label: "Wildcard mask",
        getValue: ({ hostmask }) => hostmask
      },
      {
        label: "Network size",
        getValue: ({ size }) => String(size)
      },
      {
        label: "First address",
        getValue: ({ first }) => first
      },
      {
        label: "Last address",
        getValue: ({ last }) => last
      },
      {
        label: "Broadcast address",
        getValue: ({ broadcast }) => broadcast,
        undefinedFallback: "No broadcast address with this mask"
      },
      {
        label: "IP class",
        getValue: ({ base: ip2 }) => getIPClass({ ip: ip2 }),
        undefinedFallback: "Unknown class type"
      }
    ];
    function switchToBlock({ count = 1 }) {
      const next = networkInfo.value?.next(count);
      if (next) {
        ip.value = next.toString();
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_c_input_text = __unplugin_components_3;
      const _component_n_table = NTable;
      const _component_c_button = __unplugin_components_0;
      const _component_n_icon = NIcon;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_c_input_text, {
        value: unref(ip),
        "onUpdate:value": ($event) => isRef(ip) ? ip.value = $event : null,
        label: "An IPv4 address with or without mask",
        placeholder: "The ipv4 address...",
        "validation-rules": ipValidationRules,
        "mb-4": ""
      }, null, _parent));
      if (unref(networkInfo)) {
        _push(`<div>`);
        _push(ssrRenderComponent(_component_n_table, null, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<tbody${_scopeId}><!--[-->`);
              ssrRenderList(sections, ({ getValue, label, undefinedFallback }) => {
                _push2(`<tr${_scopeId}><td font-bold${_scopeId}>${ssrInterpolate(label)}</td><td${_scopeId}>`);
                if (getValue(unref(networkInfo))) {
                  _push2(ssrRenderComponent(_sfc_main$1, {
                    value: getValue(unref(networkInfo))
                  }, null, _parent2, _scopeId));
                } else {
                  _push2(`<span op-70${_scopeId}>${ssrInterpolate(undefinedFallback)}</span>`);
                }
                _push2(`</td></tr>`);
              });
              _push2(`<!--]--></tbody>`);
            } else {
              return [
                createVNode("tbody", null, [
                  (openBlock(), createBlock(Fragment, null, renderList(sections, ({ getValue, label, undefinedFallback }) => {
                    return createVNode("tr", { key: label }, [
                      createVNode("td", { "font-bold": "" }, toDisplayString(label), 1),
                      createVNode("td", null, [
                        getValue(unref(networkInfo)) ? (openBlock(), createBlock(_sfc_main$1, {
                          key: 0,
                          value: getValue(unref(networkInfo))
                        }, null, 8, ["value"])) : (openBlock(), createBlock("span", {
                          key: 1,
                          "op-70": ""
                        }, toDisplayString(undefinedFallback), 1))
                      ])
                    ]);
                  }), 64))
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<div mt-3 flex items-center justify-between>`);
        _push(ssrRenderComponent(_component_c_button, {
          onClick: ($event) => switchToBlock({ count: -1 })
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_n_icon, { component: unref(ArrowLeft) }, null, _parent2, _scopeId));
              _push2(` Previous block `);
            } else {
              return [
                createVNode(_component_n_icon, { component: unref(ArrowLeft) }, null, 8, ["component"]),
                createTextVNode(" Previous block ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_c_button, {
          onClick: ($event) => switchToBlock({ count: 1 })
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Next block `);
              _push2(ssrRenderComponent(_component_n_icon, { component: unref(ArrowRight) }, null, _parent2, _scopeId));
            } else {
              return [
                createTextVNode(" Next block "),
                createVNode(_component_n_icon, { component: unref(ArrowRight) }, null, 8, ["component"])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/tools/ipv4-subnet-calculator/ipv4-subnet-calculator.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
