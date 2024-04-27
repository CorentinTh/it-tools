import { NDivider, NFormItem, NInputNumber, NDatePicker, NStatistic } from 'naive-ui';
import { a as __unplugin_components_1 } from './chunk-8109fd17.js';
import { _ as __unplugin_components_0 } from './chunk-89a4876c.js';
import { defineComponent, ref, computed, withCtx, unref, isRef, createVNode, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { formatDuration, formatRelative, addMilliseconds } from 'date-fns';
import { enGB } from 'date-fns/locale';
import { _ as _export_sfc } from './chunk-6003391e.js';
import '@vueuse/core';
import './chunk-bb5bb4f6.js';
import './chunk-2ce6ed5e.js';
import 'fuse.js';
import 'pinia';

function formatMsDuration(duration) {
  const ms = Math.floor(duration % 1e3);
  const secs = Math.floor((duration - ms) / 1e3 % 60);
  const mins = Math.floor(((duration - ms) / 1e3 - secs) / 60 % 60);
  const hrs = Math.floor((((duration - ms) / 1e3 - secs) / 60 - mins) / 60);
  return formatDuration({
    hours: hrs,
    minutes: mins,
    seconds: secs
  }) + (ms > 0 ? ` ${ms} ms` : "");
}

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "eta-calculator",
  __ssrInlineRender: true,
  setup(__props) {
    const unitCount = ref(3 * 62);
    const unitPerTimeSpan = ref(3);
    const timeSpan = ref(5);
    const timeSpanUnitMultiplier = ref(6e4);
    const startedAt = ref(Date.now());
    const durationMs = computed(() => {
      const timeSpanMs = timeSpan.value * timeSpanUnitMultiplier.value;
      return unitCount.value / (unitPerTimeSpan.value / timeSpanMs);
    });
    const endAt = computed(
      () => formatRelative(addMilliseconds(startedAt.value, durationMs.value), Date.now(), { locale: enGB })
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_n_divider = NDivider;
      const _component_n_form_item = NFormItem;
      const _component_n_input_number = NInputNumber;
      const _component_n_date_picker = NDatePicker;
      const _component_c_select = __unplugin_components_0;
      const _component_c_card = __unplugin_components_1;
      const _component_n_statistic = NStatistic;
      _push(`<div${ssrRenderAttrs(_attrs)} data-v-d93763ac><div text-justify op-70 data-v-d93763ac> With a concrete example, if you wash 5 plates in 3 minutes and you have 500 plates to wash, it will take you 5 hours to wash them all. </div>`);
      _push(ssrRenderComponent(_component_n_divider, null, null, _parent));
      _push(`<div flex gap-2 data-v-d93763ac>`);
      _push(ssrRenderComponent(_component_n_form_item, {
        label: "Amount of element to consume",
        "flex-1": ""
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_n_input_number, {
              value: unref(unitCount),
              "onUpdate:value": ($event) => isRef(unitCount) ? unitCount.value = $event : null,
              min: 1
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_n_input_number, {
                value: unref(unitCount),
                "onUpdate:value": ($event) => isRef(unitCount) ? unitCount.value = $event : null,
                min: 1
              }, null, 8, ["value", "onUpdate:value"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_n_form_item, {
        label: "The consumption started at",
        "flex-1": ""
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_n_date_picker, {
              value: unref(startedAt),
              "onUpdate:value": ($event) => isRef(startedAt) ? startedAt.value = $event : null,
              type: "datetime"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_n_date_picker, {
                value: unref(startedAt),
                "onUpdate:value": ($event) => isRef(startedAt) ? startedAt.value = $event : null,
                type: "datetime"
              }, null, 8, ["value", "onUpdate:value"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><p data-v-d93763ac>Amount of unit consumed by time span</p><div flex flex-col items-baseline gap-y-2 md:flex-row data-v-d93763ac>`);
      _push(ssrRenderComponent(_component_n_input_number, {
        value: unref(unitPerTimeSpan),
        "onUpdate:value": ($event) => isRef(unitPerTimeSpan) ? unitPerTimeSpan.value = $event : null,
        min: 1
      }, null, _parent));
      _push(`<div flex items-baseline gap-2 data-v-d93763ac><span ml-2 data-v-d93763ac>in</span>`);
      _push(ssrRenderComponent(_component_n_input_number, {
        value: unref(timeSpan),
        "onUpdate:value": ($event) => isRef(timeSpan) ? timeSpan.value = $event : null,
        "min-w-130px": "",
        min: 1
      }, null, _parent));
      _push(ssrRenderComponent(_component_c_select, {
        value: unref(timeSpanUnitMultiplier),
        "onUpdate:value": ($event) => isRef(timeSpanUnitMultiplier) ? timeSpanUnitMultiplier.value = $event : null,
        "min-w-130px": "",
        options: [
          { label: "milliseconds", value: 1 },
          { label: "seconds", value: 1e3 },
          { label: "minutes", value: 1e3 * 60 },
          { label: "hours", value: 1e3 * 60 * 60 },
          { label: "days", value: 1e3 * 60 * 60 * 24 }
        ]
      }, null, _parent));
      _push(`</div></div>`);
      _push(ssrRenderComponent(_component_n_divider, null, null, _parent));
      _push(ssrRenderComponent(_component_c_card, { "mb-2": "" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_n_statistic, { label: "Total duration" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(unref(formatMsDuration)(unref(durationMs)))}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(unref(formatMsDuration)(unref(durationMs))), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_n_statistic, { label: "Total duration" }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(unref(formatMsDuration)(unref(durationMs))), 1)
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_c_card, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_n_statistic, { label: "It will end " }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(unref(endAt))}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(unref(endAt)), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_n_statistic, { label: "It will end " }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(unref(endAt)), 1)
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});

/* unplugin-vue-components disabled */const etaCalculator_vue_vue_type_style_index_0_scoped_d93763ac_lang = '';

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/tools/eta-calculator/eta-calculator.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const etaCalculator = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-d93763ac"]]);

export { etaCalculator as default };
