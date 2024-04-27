import { _ as _sfc_main$1 } from './chunk-aab02bfe.js';
import { NDivider, NForm, NFormItem, NSwitch } from 'naive-ui';
import { _ as __unplugin_components_3 } from './chunk-4e7a6a8d.js';
import { a as __unplugin_components_1 } from './chunk-8109fd17.js';
import { defineComponent, ref, reactive, computed, withCtx, unref, isRef, createVNode, toDisplayString, createTextVNode, openBlock, createBlock, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import cronstrue from 'cronstrue';
import { isValidCron } from 'cron-validator';
import { u as useStyleStore, _ as _export_sfc } from './chunk-6003391e.js';
import 'lodash';
import './chunk-11f44f81.js';
import './chunk-35c3d701.js';
import '@vueuse/core';
import 'pinia';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "crontab-generator",
  __ssrInlineRender: true,
  setup(__props) {
    function isCronValid(v) {
      return isValidCron(v, { allowBlankDay: true, alias: true, seconds: true });
    }
    const styleStore = useStyleStore();
    const cron = ref("40 * * * *");
    const cronstrueConfig = reactive({
      verbose: true,
      dayOfWeekStartIndexZero: true,
      use24HourTimeFormat: true,
      throwExceptionOnParseError: true
    });
    const helpers = [
      {
        symbol: "*",
        meaning: "Any value",
        example: "* * * *",
        equivalent: "Every minute"
      },
      {
        symbol: "-",
        meaning: "Range of values",
        example: "1-10 * * *",
        equivalent: "Minutes 1 through 10"
      },
      {
        symbol: ",",
        meaning: "List of values",
        example: "1,10 * * *",
        equivalent: "At minutes 1 and 10"
      },
      {
        symbol: "/",
        meaning: "Step values",
        example: "*/10 * * *",
        equivalent: "Every 10 minutes"
      },
      {
        symbol: "@yearly",
        meaning: "Once every year at midnight of 1 January",
        example: "@yearly",
        equivalent: "0 0 1 1 *"
      },
      {
        symbol: "@annually",
        meaning: "Same as @yearly",
        example: "@annually",
        equivalent: "0 0 1 1 *"
      },
      {
        symbol: "@monthly",
        meaning: "Once a month at midnight on the first day",
        example: "@monthly",
        equivalent: "0 0 1 * *"
      },
      {
        symbol: "@weekly",
        meaning: "Once a week at midnight on Sunday morning",
        example: "@weekly",
        equivalent: "0 0 * * 0"
      },
      {
        symbol: "@daily",
        meaning: "Once a day at midnight",
        example: "@daily",
        equivalent: "0 0 * * *"
      },
      {
        symbol: "@midnight",
        meaning: "Same as @daily",
        example: "@midnight",
        equivalent: "0 0 * * *"
      },
      {
        symbol: "@hourly",
        meaning: "Once an hour at the beginning of the hour",
        example: "@hourly",
        equivalent: "0 * * * *"
      },
      {
        symbol: "@reboot",
        meaning: "Run at startup",
        example: "",
        equivalent: ""
      }
    ];
    const cronString = computed(() => {
      if (isCronValid(cron.value)) {
        return cronstrue.toString(cron.value, cronstrueConfig);
      }
      return " ";
    });
    const cronValidationRules = [
      {
        validator: (value) => isCronValid(value),
        message: "This cron is invalid"
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_c_card = __unplugin_components_1;
      const _component_c_input_text = __unplugin_components_3;
      const _component_n_divider = NDivider;
      const _component_n_form = NForm;
      const _component_n_form_item = NFormItem;
      const _component_n_switch = NSwitch;
      const _component_c_table = _sfc_main$1;
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_c_card, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div mx-auto max-w-sm data-v-b6cbd7a9${_scopeId}>`);
            _push2(ssrRenderComponent(_component_c_input_text, {
              value: unref(cron),
              "onUpdate:value": ($event) => isRef(cron) ? cron.value = $event : null,
              size: "large",
              placeholder: "* * * * *",
              "validation-rules": cronValidationRules,
              "mb-3": ""
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="cron-string" data-v-b6cbd7a9${_scopeId}>${ssrInterpolate(unref(cronString))}</div>`);
            _push2(ssrRenderComponent(_component_n_divider, null, null, _parent2, _scopeId));
            _push2(`<div flex justify-center data-v-b6cbd7a9${_scopeId}>`);
            _push2(ssrRenderComponent(_component_n_form, {
              "show-feedback": false,
              "label-width": "170",
              "label-placement": "left"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_n_form_item, { label: "Verbose" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_n_switch, {
                          value: unref(cronstrueConfig).verbose,
                          "onUpdate:value": ($event) => unref(cronstrueConfig).verbose = $event
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_n_switch, {
                            value: unref(cronstrueConfig).verbose,
                            "onUpdate:value": ($event) => unref(cronstrueConfig).verbose = $event
                          }, null, 8, ["value", "onUpdate:value"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_n_form_item, { label: "Use 24 hour time format" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_n_switch, {
                          value: unref(cronstrueConfig).use24HourTimeFormat,
                          "onUpdate:value": ($event) => unref(cronstrueConfig).use24HourTimeFormat = $event
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_n_switch, {
                            value: unref(cronstrueConfig).use24HourTimeFormat,
                            "onUpdate:value": ($event) => unref(cronstrueConfig).use24HourTimeFormat = $event
                          }, null, 8, ["value", "onUpdate:value"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_n_form_item, { label: "Days start at 0" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_n_switch, {
                          value: unref(cronstrueConfig).dayOfWeekStartIndexZero,
                          "onUpdate:value": ($event) => unref(cronstrueConfig).dayOfWeekStartIndexZero = $event
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_n_switch, {
                            value: unref(cronstrueConfig).dayOfWeekStartIndexZero,
                            "onUpdate:value": ($event) => unref(cronstrueConfig).dayOfWeekStartIndexZero = $event
                          }, null, 8, ["value", "onUpdate:value"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_n_form_item, { label: "Verbose" }, {
                      default: withCtx(() => [
                        createVNode(_component_n_switch, {
                          value: unref(cronstrueConfig).verbose,
                          "onUpdate:value": ($event) => unref(cronstrueConfig).verbose = $event
                        }, null, 8, ["value", "onUpdate:value"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_n_form_item, { label: "Use 24 hour time format" }, {
                      default: withCtx(() => [
                        createVNode(_component_n_switch, {
                          value: unref(cronstrueConfig).use24HourTimeFormat,
                          "onUpdate:value": ($event) => unref(cronstrueConfig).use24HourTimeFormat = $event
                        }, null, 8, ["value", "onUpdate:value"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_n_form_item, { label: "Days start at 0" }, {
                      default: withCtx(() => [
                        createVNode(_component_n_switch, {
                          value: unref(cronstrueConfig).dayOfWeekStartIndexZero,
                          "onUpdate:value": ($event) => unref(cronstrueConfig).dayOfWeekStartIndexZero = $event
                        }, null, 8, ["value", "onUpdate:value"])
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", {
                "mx-auto": "",
                "max-w-sm": ""
              }, [
                createVNode(_component_c_input_text, {
                  value: unref(cron),
                  "onUpdate:value": ($event) => isRef(cron) ? cron.value = $event : null,
                  size: "large",
                  placeholder: "* * * * *",
                  "validation-rules": cronValidationRules,
                  "mb-3": ""
                }, null, 8, ["value", "onUpdate:value"])
              ]),
              createVNode("div", { class: "cron-string" }, toDisplayString(unref(cronString)), 1),
              createVNode(_component_n_divider),
              createVNode("div", {
                flex: "",
                "justify-center": ""
              }, [
                createVNode(_component_n_form, {
                  "show-feedback": false,
                  "label-width": "170",
                  "label-placement": "left"
                }, {
                  default: withCtx(() => [
                    createVNode(_component_n_form_item, { label: "Verbose" }, {
                      default: withCtx(() => [
                        createVNode(_component_n_switch, {
                          value: unref(cronstrueConfig).verbose,
                          "onUpdate:value": ($event) => unref(cronstrueConfig).verbose = $event
                        }, null, 8, ["value", "onUpdate:value"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_n_form_item, { label: "Use 24 hour time format" }, {
                      default: withCtx(() => [
                        createVNode(_component_n_switch, {
                          value: unref(cronstrueConfig).use24HourTimeFormat,
                          "onUpdate:value": ($event) => unref(cronstrueConfig).use24HourTimeFormat = $event
                        }, null, 8, ["value", "onUpdate:value"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_n_form_item, { label: "Days start at 0" }, {
                      default: withCtx(() => [
                        createVNode(_component_n_switch, {
                          value: unref(cronstrueConfig).dayOfWeekStartIndexZero,
                          "onUpdate:value": ($event) => unref(cronstrueConfig).dayOfWeekStartIndexZero = $event
                        }, null, 8, ["value", "onUpdate:value"])
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                })
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_c_card, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<pre data-v-b6cbd7a9${_scopeId}>┌──────────── [optional] seconds (0 - 59)
| ┌────────── minute (0 - 59)
| | ┌──────── hour (0 - 23)
| | | ┌────── day of month (1 - 31)
| | | | ┌──── month (1 - 12) OR jan,feb,mar,apr ...
| | | | | ┌── day of week (0 - 6, sunday=0) OR sun,mon ...
| | | | | |
* * * * * * command</pre>`);
            if (unref(styleStore).isSmallScreen) {
              _push2(`<div data-v-b6cbd7a9${_scopeId}><!--[-->`);
              ssrRenderList(helpers, ({ symbol, meaning, example, equivalent }) => {
                _push2(ssrRenderComponent(_component_c_card, {
                  key: symbol,
                  "mb-3": "",
                  "important:border-none": ""
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<div data-v-b6cbd7a9${_scopeId2}> Symbol: <strong data-v-b6cbd7a9${_scopeId2}>${ssrInterpolate(symbol)}</strong></div><div data-v-b6cbd7a9${_scopeId2}> Meaning: <strong data-v-b6cbd7a9${_scopeId2}>${ssrInterpolate(meaning)}</strong></div><div data-v-b6cbd7a9${_scopeId2}> Example: <strong data-v-b6cbd7a9${_scopeId2}><code data-v-b6cbd7a9${_scopeId2}>${ssrInterpolate(example)}</code></strong></div><div data-v-b6cbd7a9${_scopeId2}> Equivalent: <strong data-v-b6cbd7a9${_scopeId2}>${ssrInterpolate(equivalent)}</strong></div>`);
                    } else {
                      return [
                        createVNode("div", null, [
                          createTextVNode(" Symbol: "),
                          createVNode("strong", null, toDisplayString(symbol), 1)
                        ]),
                        createVNode("div", null, [
                          createTextVNode(" Meaning: "),
                          createVNode("strong", null, toDisplayString(meaning), 1)
                        ]),
                        createVNode("div", null, [
                          createTextVNode(" Example: "),
                          createVNode("strong", null, [
                            createVNode("code", null, toDisplayString(example), 1)
                          ])
                        ]),
                        createVNode("div", null, [
                          createTextVNode(" Equivalent: "),
                          createVNode("strong", null, toDisplayString(equivalent), 1)
                        ])
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(ssrRenderComponent(_component_c_table, { data: helpers }, null, _parent2, _scopeId));
            }
          } else {
            return [
              createVNode("pre", null, "┌──────────── [optional] seconds (0 - 59)\n| ┌────────── minute (0 - 59)\n| | ┌──────── hour (0 - 23)\n| | | ┌────── day of month (1 - 31)\n| | | | ┌──── month (1 - 12) OR jan,feb,mar,apr ...\n| | | | | ┌── day of week (0 - 6, sunday=0) OR sun,mon ...\n| | | | | |\n* * * * * * command"),
              unref(styleStore).isSmallScreen ? (openBlock(), createBlock("div", { key: 0 }, [
                (openBlock(), createBlock(Fragment, null, renderList(helpers, ({ symbol, meaning, example, equivalent }) => {
                  return createVNode(_component_c_card, {
                    key: symbol,
                    "mb-3": "",
                    "important:border-none": ""
                  }, {
                    default: withCtx(() => [
                      createVNode("div", null, [
                        createTextVNode(" Symbol: "),
                        createVNode("strong", null, toDisplayString(symbol), 1)
                      ]),
                      createVNode("div", null, [
                        createTextVNode(" Meaning: "),
                        createVNode("strong", null, toDisplayString(meaning), 1)
                      ]),
                      createVNode("div", null, [
                        createTextVNode(" Example: "),
                        createVNode("strong", null, [
                          createVNode("code", null, toDisplayString(example), 1)
                        ])
                      ]),
                      createVNode("div", null, [
                        createTextVNode(" Equivalent: "),
                        createVNode("strong", null, toDisplayString(equivalent), 1)
                      ])
                    ]),
                    _: 2
                  }, 1024);
                }), 64))
              ])) : (openBlock(), createBlock(_component_c_table, {
                key: 1,
                data: helpers
              }))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
});

/* unplugin-vue-components disabled */const crontabGenerator_vue_vue_type_style_index_0_scoped_b6cbd7a9_lang = '';

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/tools/crontab-generator/crontab-generator.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const crontabGenerator = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-b6cbd7a9"]]);

export { crontabGenerator as default };
