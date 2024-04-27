import { NInputGroup, NInputGroupLabel, NInputNumber } from 'naive-ui';
import { defineComponent, reactive, unref, withCtx, createTextVNode, toDisplayString, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import _ from 'lodash';

const convertCelsiusToKelvin = (temperature) => temperature + 273.15;
const convertKelvinToCelsius = (temperature) => temperature - 273.15;
const convertFahrenheitToKelvin = (temperature) => (temperature + 459.67) * (5 / 9);
const convertKelvinToFahrenheit = (temperature) => temperature * (9 / 5) - 459.67;
const convertRankineToKelvin = (temperature) => temperature * (5 / 9);
const convertKelvinToRankine = (temperature) => temperature * (9 / 5);
const convertDelisleToKelvin = (temperature) => 373.15 - 2 / 3 * temperature;
const convertKelvinToDelisle = (temperature) => 3 / 2 * (373.15 - temperature);
const convertNewtonToKelvin = (temperature) => temperature * (100 / 33) + 273.15;
const convertKelvinToNewton = (temperature) => (temperature - 273.15) * (33 / 100);
const convertReaumurToKelvin = (temperature) => temperature * (5 / 4) + 273.15;
const convertKelvinToReaumur = (temperature) => (temperature - 273.15) * (4 / 5);
const convertRomerToKelvin = (temperature) => (temperature - 7.5) * (40 / 21) + 273.15;
const convertKelvinToRomer = (temperature) => (temperature - 273.15) * (21 / 40) + 7.5;

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "temperature-converter",
  __ssrInlineRender: true,
  setup(__props) {
    const units = reactive({
      kelvin: {
        title: "Kelvin",
        unit: "K",
        ref: 0,
        toKelvin: _.identity,
        fromKelvin: _.identity
      },
      celsius: {
        title: "Celsius",
        unit: "°C",
        ref: 0,
        toKelvin: convertCelsiusToKelvin,
        fromKelvin: convertKelvinToCelsius
      },
      fahrenheit: {
        title: "Fahrenheit",
        unit: "°F",
        ref: 0,
        toKelvin: convertFahrenheitToKelvin,
        fromKelvin: convertKelvinToFahrenheit
      },
      rankine: {
        title: "Rankine",
        unit: "°R",
        ref: 0,
        toKelvin: convertRankineToKelvin,
        fromKelvin: convertKelvinToRankine
      },
      delisle: {
        title: "Delisle",
        unit: "°De",
        ref: 0,
        toKelvin: convertDelisleToKelvin,
        fromKelvin: convertKelvinToDelisle
      },
      newton: {
        title: "Newton",
        unit: "°N",
        ref: 0,
        toKelvin: convertNewtonToKelvin,
        fromKelvin: convertKelvinToNewton
      },
      reaumur: {
        title: "Réaumur",
        unit: "°Ré",
        ref: 0,
        toKelvin: convertReaumurToKelvin,
        fromKelvin: convertKelvinToReaumur
      },
      romer: {
        title: "Rømer",
        unit: "°Rø",
        ref: 0,
        toKelvin: convertRomerToKelvin,
        fromKelvin: convertKelvinToRomer
      }
    });
    function update(key) {
      const { ref: value, toKelvin } = units[key];
      const kelvins = toKelvin(value) ?? 0;
      _.chain(units).omit(key).forEach(({ fromKelvin }, index) => {
        units[index].ref = Math.floor((fromKelvin(kelvins) ?? 0) * 100) / 100;
      }).value();
    }
    update("kelvin");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_n_input_group = NInputGroup;
      const _component_n_input_group_label = NInputGroupLabel;
      const _component_n_input_number = NInputNumber;
      _push(`<div${ssrRenderAttrs(_attrs)}><!--[-->`);
      ssrRenderList(Object.entries(unref(units)), ([key, { title, unit }]) => {
        _push(ssrRenderComponent(_component_n_input_group, {
          key,
          "mb-3": "",
          "w-full": ""
        }, {
          default: withCtx((_2, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_n_input_group_label, { style: { "width": "100px" } }, {
                default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(title)}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(title), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_n_input_number, {
                value: unref(units)[key].ref,
                "onUpdate:value": [($event) => unref(units)[key].ref = $event, () => update(key)],
                style: { "flex": "1" }
              }, null, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_n_input_group_label, { style: { "width": "50px" } }, {
                default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(unit)}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(unit), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_n_input_group_label, { style: { "width": "100px" } }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(title), 1)
                  ]),
                  _: 2
                }, 1024),
                createVNode(_component_n_input_number, {
                  value: unref(units)[key].ref,
                  "onUpdate:value": [($event) => unref(units)[key].ref = $event, () => update(key)],
                  style: { "flex": "1" }
                }, null, 8, ["value", "onUpdate:value"]),
                createVNode(_component_n_input_group_label, { style: { "width": "50px" } }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(unit), 1)
                  ]),
                  _: 2
                }, 1024)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/tools/temperature-converter/temperature-converter.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
