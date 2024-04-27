import { NFormItem, NColorPicker } from 'naive-ui';
import { _ as _sfc_main$1 } from './chunk-de61ec1c.js';
import { a as __unplugin_components_1 } from './chunk-8109fd17.js';
import { ref, defineComponent, withCtx, createVNode, openBlock, createBlock, Fragment, renderList, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderList } from 'vue/server-renderer';
import { colord, extend } from 'colord';
import _ from 'lodash';
import cmykPlugin from 'colord/plugins/cmyk';
import hwbPlugin from 'colord/plugins/hwb';
import namesPlugin from 'colord/plugins/names';
import lchPlugin from 'colord/plugins/lch';
import { w as withDefaultOnError } from './chunk-f1b4cc24.js';
import { u as useValidation } from './chunk-35c3d701.js';
import './chunk-95ec8cf7.js';
import './chunk-6003391e.js';
import '@vueuse/core';
import 'pinia';
import './chunk-4e7a6a8d.js';
import './chunk-11f44f81.js';
import './chunk-77c5cc16.js';

function buildColorFormat({
  label,
  parse = (value) => colord(value),
  format,
  placeholder,
  invalidMessage = `Invalid ${label.toLowerCase()} format.`,
  type = "text"
}) {
  const value = ref("");
  return {
    type,
    label,
    parse: (v) => withDefaultOnError(() => parse(v), void 0),
    format,
    placeholder,
    value,
    validation: useValidation({
      source: value,
      rules: [
        {
          message: invalidMessage,
          validator: (v) => withDefaultOnError(() => {
            if (v === "") {
              return true;
            }
            return parse(v).isValid();
          }, false)
        }
      ]
    })
  };
}

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "color-converter",
  __ssrInlineRender: true,
  setup(__props) {
    extend([cmykPlugin, hwbPlugin, namesPlugin, lchPlugin]);
    const formats = {
      picker: buildColorFormat({
        label: "color picker",
        format: (v) => v.toHex(),
        type: "color-picker"
      }),
      hex: buildColorFormat({
        label: "hex",
        format: (v) => v.toHex(),
        placeholder: "e.g. #ff0000"
      }),
      rgb: buildColorFormat({
        label: "rgb",
        format: (v) => v.toRgbString(),
        placeholder: "e.g. rgb(255, 0, 0)"
      }),
      hsl: buildColorFormat({
        label: "hsl",
        format: (v) => v.toHslString(),
        placeholder: "e.g. hsl(0, 100%, 50%)"
      }),
      hwb: buildColorFormat({
        label: "hwb",
        format: (v) => v.toHwbString(),
        placeholder: "e.g. hwb(0, 0%, 0%)"
      }),
      lch: buildColorFormat({
        label: "lch",
        format: (v) => v.toLchString(),
        placeholder: "e.g. lch(53.24, 104.55, 40.85)"
      }),
      cmyk: buildColorFormat({
        label: "cmyk",
        format: (v) => v.toCmykString(),
        placeholder: "e.g. cmyk(0, 100%, 100%, 0)"
      }),
      name: buildColorFormat({
        label: "name",
        format: (v) => v.toName({ closest: true }) ?? "Unknown",
        placeholder: "e.g. red"
      })
    };
    updateColorValue(colord("#1ea54c"));
    function updateColorValue(value, omitLabel) {
      if (value === void 0) {
        return;
      }
      if (!value.isValid()) {
        return;
      }
      _.forEach(formats, ({ value: valueRef, format }, key) => {
        if (key !== omitLabel) {
          valueRef.value = format(value);
        }
      });
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_c_card = __unplugin_components_1;
      const _component_input_copyable = _sfc_main$1;
      const _component_n_form_item = NFormItem;
      const _component_n_color_picker = NColorPicker;
      _push(ssrRenderComponent(_component_c_card, _attrs, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<!--[-->`);
            ssrRenderList(formats, ({ label, parse, placeholder, validation, type }, key) => {
              _push2(`<!--[-->`);
              if (type === "text") {
                _push2(ssrRenderComponent(_component_input_copyable, {
                  value: formats[key].value.value,
                  "onUpdate:value": [($event) => formats[key].value.value = $event, (v) => updateColorValue(parse(v), key)],
                  "test-id": `input-${key}`,
                  label: `${label}:`,
                  "label-position": "left",
                  "label-width": "100px",
                  "label-align": "right",
                  placeholder,
                  validation,
                  "raw-text": "",
                  clearable: "",
                  "mt-2": ""
                }, null, _parent2, _scopeId));
              } else if (type === "color-picker") {
                _push2(ssrRenderComponent(_component_n_form_item, {
                  label: `${label}:`,
                  "label-width": "100",
                  "label-placement": "left",
                  "show-feedback": false
                }, {
                  default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(ssrRenderComponent(_component_n_color_picker, {
                        value: formats[key].value.value,
                        "onUpdate:value": [($event) => formats[key].value.value = $event, (v) => updateColorValue(parse(v), key)],
                        placement: "bottom-end"
                      }, null, _parent3, _scopeId2));
                    } else {
                      return [
                        createVNode(_component_n_color_picker, {
                          value: formats[key].value.value,
                          "onUpdate:value": [($event) => formats[key].value.value = $event, (v) => updateColorValue(parse(v), key)],
                          placement: "bottom-end"
                        }, null, 8, ["value", "onUpdate:value"])
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(`<!--]-->`);
            });
            _push2(`<!--]-->`);
          } else {
            return [
              (openBlock(), createBlock(Fragment, null, renderList(formats, ({ label, parse, placeholder, validation, type }, key) => {
                return openBlock(), createBlock(Fragment, { key }, [
                  type === "text" ? (openBlock(), createBlock(_component_input_copyable, {
                    key: 0,
                    value: formats[key].value.value,
                    "onUpdate:value": [($event) => formats[key].value.value = $event, (v) => updateColorValue(parse(v), key)],
                    "test-id": `input-${key}`,
                    label: `${label}:`,
                    "label-position": "left",
                    "label-width": "100px",
                    "label-align": "right",
                    placeholder,
                    validation,
                    "raw-text": "",
                    clearable: "",
                    "mt-2": ""
                  }, null, 8, ["value", "onUpdate:value", "test-id", "label", "placeholder", "validation"])) : type === "color-picker" ? (openBlock(), createBlock(_component_n_form_item, {
                    key: 1,
                    label: `${label}:`,
                    "label-width": "100",
                    "label-placement": "left",
                    "show-feedback": false
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_n_color_picker, {
                        value: formats[key].value.value,
                        "onUpdate:value": [($event) => formats[key].value.value = $event, (v) => updateColorValue(parse(v), key)],
                        placement: "bottom-end"
                      }, null, 8, ["value", "onUpdate:value"])
                    ]),
                    _: 2
                  }, 1032, ["label"])) : createCommentVNode("", true)
                ], 64);
              }), 64))
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/tools/color-converter/color-converter.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
