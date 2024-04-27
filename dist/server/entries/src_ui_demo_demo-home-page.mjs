import { a as __unplugin_components_0$1, _ as _export_sfc, d as defineThemes, b as appThemes } from '../chunks/chunk-6003391e.js';
import { defineComponent, withCtx, createTextVNode, useSSRContext, unref, createVNode, ref, isRef, openBlock, createElementBlock, createElementVNode, toRefs, mergeProps, computed, resolveDynamicComponent, renderSlot, toDisplayString } from 'vue';
import { ssrRenderList, ssrRenderComponent, ssrInterpolate, ssrRenderAttrs, ssrRenderSlot, ssrRenderStyle, ssrRenderVNode } from 'vue/server-renderer';
import { _ as __unplugin_components_3 } from '../chunks/chunk-28375bc9.js';
import { _ as __unplugin_components_5 } from '../chunks/chunk-95ec8cf7.js';
import _ from 'lodash';
import { _ as _sfc_main$j } from '../chunks/chunk-000e277f.js';
import { a as __unplugin_components_1$1, _ as _sfc_main$o } from '../chunks/chunk-8109fd17.js';
import { _ as _sfc_main$k } from '../chunks/chunk-83cdd9a0.js';
import { _ as __unplugin_components_3$1 } from '../chunks/chunk-4e7a6a8d.js';
import { u as useValidation } from '../chunks/chunk-35c3d701.js';
import { RouterLink } from 'vue-router';
import { marked } from 'marked';
import DomPurify from 'dompurify';
import { a as _sfc_main$l, _ as __unplugin_components_2 } from '../chunks/chunk-6ba26b76.js';
import { _ as __unplugin_components_0$2 } from '../chunks/chunk-89a4876c.js';
import { _ as _sfc_main$m } from '../chunks/chunk-aab02bfe.js';
import { _ as _sfc_main$n } from '../chunks/chunk-aff50618.js';
import '@vueuse/core';
import 'pinia';
import '../chunks/chunk-bb5bb4f6.js';
import '../chunks/chunk-11f44f81.js';
import '../chunks/chunk-77c5cc16.js';
import 'naive-ui';
import '../chunks/chunk-2ce6ed5e.js';
import 'fuse.js';

const _sfc_main$i = /* @__PURE__ */ defineComponent({
  __name: "c-alert.demo",
  __ssrInlineRender: true,
  setup(__props) {
    const variants = ["warning", "error"];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_c_alert = __unplugin_components_3;
      _push(`<!--[--><h2>Basic</h2><!--[-->`);
      ssrRenderList(variants, (variant) => {
        _push(ssrRenderComponent(_component_c_alert, {
          key: variant,
          type: variant,
          "mb-4": ""
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni reprehenderit itaque enim? Suscipit magni optio velit quia, eveniet repellat pariatur quaerat laudantium dignissimos natus, beatae deleniti adipisci, atque necessitatibus odio! `);
            } else {
              return [
                createTextVNode(" Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni reprehenderit itaque enim? Suscipit magni optio velit quia, eveniet repellat pariatur quaerat laudantium dignissimos natus, beatae deleniti adipisci, atque necessitatibus odio! ")
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--><h2>With title</h2><!--[-->`);
      ssrRenderList(variants, (variant) => {
        _push(ssrRenderComponent(_component_c_alert, {
          key: variant,
          type: variant,
          title: "This is the title",
          "mb-4": ""
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni reprehenderit itaque enim? Suscipit magni optio velit quia, eveniet repellat pariatur quaerat laudantium dignissimos natus, beatae deleniti adipisci, atque necessitatibus odio! `);
            } else {
              return [
                createTextVNode(" Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni reprehenderit itaque enim? Suscipit magni optio velit quia, eveniet repellat pariatur quaerat laudantium dignissimos natus, beatae deleniti adipisci, atque necessitatibus odio! ")
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--><!--]-->`);
    };
  }
});

const _sfc_setup$i = _sfc_main$i.setup;
_sfc_main$i.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/ui/c-alert/c-alert.demo.vue");
  return _sfc_setup$i ? _sfc_setup$i(props, ctx) : void 0;
};

const __vite_glob_0_0 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _sfc_main$i
}, Symbol.toStringTag, { value: 'Module' }));

const _sfc_main$h = /* @__PURE__ */ defineComponent({
  __name: "c-button.demo",
  __ssrInlineRender: true,
  setup(__props) {
    const buttonVariants = ["basic", "text"];
    const buttonTypes = ["default", "primary", "warning", "error"];
    const buttonSizes = ["small", "medium", "large"];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_c_button = __unplugin_components_0$1;
      const _component_icon_mdi_content_copy = __unplugin_components_5;
      _push(`<!--[-->`);
      ssrRenderList(buttonVariants, (buttonVariant) => {
        _push(`<div><h2>${ssrInterpolate(unref(_).capitalize(buttonVariant))}</h2><!--[-->`);
        ssrRenderList(buttonSizes, (buttonSize) => {
          _push(`<div mb-2><!--[-->`);
          ssrRenderList(buttonTypes, (buttonType) => {
            _push(ssrRenderComponent(_component_c_button, {
              key: buttonType,
              variant: buttonVariant,
              type: buttonType,
              size: buttonSize,
              "mx-1": ""
            }, {
              default: withCtx((_2, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(` Button `);
                } else {
                  return [
                    createTextVNode(" Button ")
                  ];
                }
              }),
              _: 2
            }, _parent));
          });
          _push(`<!--]--><!--[-->`);
          ssrRenderList(buttonTypes, (buttonType) => {
            _push(ssrRenderComponent(_component_c_button, {
              key: buttonType,
              variant: buttonVariant,
              type: buttonType,
              size: buttonSize,
              circle: "",
              "mx-1": ""
            }, {
              default: withCtx((_2, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(` A `);
                } else {
                  return [
                    createTextVNode(" A ")
                  ];
                }
              }),
              _: 2
            }, _parent));
          });
          _push(`<!--]--><!--[-->`);
          ssrRenderList(buttonTypes, (buttonType) => {
            _push(ssrRenderComponent(_component_c_button, {
              key: buttonType,
              variant: buttonVariant,
              type: buttonType,
              size: buttonSize,
              circle: "",
              "mx-1": ""
            }, {
              default: withCtx((_2, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(ssrRenderComponent(_component_icon_mdi_content_copy, null, null, _parent2, _scopeId));
                } else {
                  return [
                    createVNode(_component_icon_mdi_content_copy)
                  ];
                }
              }),
              _: 2
            }, _parent));
          });
          _push(`<!--]--></div>`);
        });
        _push(`<!--]--></div>`);
      });
      _push(`<!--]-->`);
    };
  }
});

const _sfc_setup$h = _sfc_main$h.setup;
_sfc_main$h.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/ui/c-button/c-button.demo.vue");
  return _sfc_setup$h ? _sfc_setup$h(props, ctx) : void 0;
};

const __vite_glob_0_1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _sfc_main$h
}, Symbol.toStringTag, { value: 'Module' }));

const _sfc_main$g = /* @__PURE__ */ defineComponent({
  __name: "c-buttons-select.demo",
  __ssrInlineRender: true,
  setup(__props) {
    const optionsA = [
      { label: "Option A", value: "a" },
      { label: "Option B", value: "b", tooltip: "This is a tooltip" },
      { label: "Option C", value: "c" }
    ];
    const optionB = {
      "Option A": "a",
      "Option B": "b",
      "Option C": "c"
    };
    const valueA = ref("a");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_c_buttons_select = _sfc_main$j;
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_c_buttons_select, {
        value: unref(valueA),
        "onUpdate:value": ($event) => isRef(valueA) ? valueA.value = $event : null,
        options: optionsA,
        label: "Label: "
      }, null, _parent));
      _push(ssrRenderComponent(_component_c_buttons_select, {
        value: unref(valueA),
        "onUpdate:value": ($event) => isRef(valueA) ? valueA.value = $event : null,
        options: optionsA,
        label: "Label: ",
        "label-position": "left",
        "mt-2": ""
      }, null, _parent));
      _push(ssrRenderComponent(_component_c_buttons_select, {
        value: unref(valueA),
        "onUpdate:value": ($event) => isRef(valueA) ? valueA.value = $event : null,
        options: optionB,
        label: "Options object: "
      }, null, _parent));
      _push(`<!--]-->`);
    };
  }
});

const _sfc_setup$g = _sfc_main$g.setup;
_sfc_main$g.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/ui/c-buttons-select/c-buttons-select.demo.vue");
  return _sfc_setup$g ? _sfc_setup$g(props, ctx) : void 0;
};

const __vite_glob_0_2 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _sfc_main$g
}, Symbol.toStringTag, { value: 'Module' }));

const _sfc_main$f = {};

function _sfc_ssrRender$4(_ctx, _push, _parent, _attrs) {
  const _component_c_card = __unplugin_components_1$1;

  _push(`<div${ssrRenderAttrs(_attrs)}><h2>Default</h2>`);
  _push(ssrRenderComponent(_component_c_card, { title: "Title" }, {
    default: withCtx((_, _push, _parent, _scopeId) => {
      if (_push) {
        _push(` Lorem ipsum, dolor sit amet consectetur adipisicing elit. Repudiandae ipsa reiciendis facilis officia nulla. Laboriosam cumque molestias excepturi doloribus nulla nemo quod ratione rerum possimus. Excepturi nihil possimus error itaque. `);
      } else {
        return [
          createTextVNode(" Lorem ipsum, dolor sit amet consectetur adipisicing elit. Repudiandae ipsa reiciendis facilis officia nulla. Laboriosam cumque molestias excepturi doloribus nulla nemo quod ratione rerum possimus. Excepturi nihil possimus error itaque. ")
        ]
      }
    }),
    _: 1
  }, _parent));
  _push(`</div>`);
}
const _sfc_setup$f = _sfc_main$f.setup;
_sfc_main$f.setup = (props, ctx) => {
  const ssrContext = useSSRContext()
  ;(ssrContext.modules || (ssrContext.modules = new Set())).add("src/ui/c-card/c-card.demo.vue");
  return _sfc_setup$f ? _sfc_setup$f(props, ctx) : undefined
};
const cCard_demo = /*#__PURE__*/_export_sfc(_sfc_main$f, [['ssrRender',_sfc_ssrRender$4]]);

const __vite_glob_0_3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: cCard_demo
}, Symbol.toStringTag, { value: 'Module' }));

const _hoisted_1$1 = {
  viewBox: "0 0 24 24",
  width: "1.2em",
  height: "1.2em"
};
const _hoisted_2$1 = /*#__PURE__*/createElementVNode("path", {
  fill: "currentColor",
  d: "M1 3h22L12 22"
}, null, -1);
const _hoisted_3$1 = [
  _hoisted_2$1
];

function render$1(_ctx, _cache) {
  return (openBlock(), createElementBlock("svg", _hoisted_1$1, _hoisted_3$1))
}

const __unplugin_components_0 = { name: 'mdi-triangle-down', render: render$1 };
/* vite-plugin-components disabled */

const _sfc_main$e = /* @__PURE__ */ defineComponent({
  __name: "c-collapse",
  __ssrInlineRender: true,
  props: {
    title: { default: "" }
  },
  setup(__props) {
    const props = __props;
    const { title } = toRefs(props);
    const isCollapsed = ref(true);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_icon_mdi_triangle_down = __unplugin_components_0;
      _push(`<div${ssrRenderAttrs(_attrs)}><div flex cursor-pointer items-center>`);
      _push(ssrRenderComponent(_component_icon_mdi_triangle_down, {
        class: { "transform-rotate--90": unref(isCollapsed) },
        "op-50": "",
        transition: ""
      }, null, _parent));
      ssrRenderSlot(_ctx.$slots, "title", {}, () => {
        _push(`<span class="ml-2" font-bold>${ssrInterpolate(unref(title))}</span>`);
      }, _push, _parent);
      _push(`</div><div style="${ssrRenderStyle(!unref(isCollapsed) ? null : { display: "none" })}" mt-2>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div></div>`);
    };
  }
});

const _sfc_setup$e = _sfc_main$e.setup;
_sfc_main$e.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/ui/c-collapse/c-collapse.vue");
  return _sfc_setup$e ? _sfc_setup$e(props, ctx) : void 0;
};

const _sfc_main$d = {};

function _sfc_ssrRender$3(_ctx, _push, _parent, _attrs) {
  const _component_c_collapse = _sfc_main$e;

  _push(ssrRenderComponent(_component_c_collapse, mergeProps({ title: "Collapse title" }, _attrs), {
    default: withCtx((_, _push, _parent, _scopeId) => {
      if (_push) {
        _push(` Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquet iaculis class cubilia metus per nullam gravida ad venenatis. Id elementum elementum enim orci elementum justo facilisi habitant consequat. Justo eget ligula purus laoreet penatibus eros quisque fusce sociis. In eget amet sagittis dignissim eleifend proin lacinia potenti tellus. Interdum vulputate condimentum molestie pulvinar praesent accumsan quisque venenatis imperdiet. `);
      } else {
        return [
          createTextVNode(" Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquet iaculis class cubilia metus per nullam gravida ad venenatis. Id elementum elementum enim orci elementum justo facilisi habitant consequat. Justo eget ligula purus laoreet penatibus eros quisque fusce sociis. In eget amet sagittis dignissim eleifend proin lacinia potenti tellus. Interdum vulputate condimentum molestie pulvinar praesent accumsan quisque venenatis imperdiet. ")
        ]
      }
    }),
    _: 1
  }, _parent));
}
const _sfc_setup$d = _sfc_main$d.setup;
_sfc_main$d.setup = (props, ctx) => {
  const ssrContext = useSSRContext()
  ;(ssrContext.modules || (ssrContext.modules = new Set())).add("src/ui/c-collapse/c-collapse.demo.vue");
  return _sfc_setup$d ? _sfc_setup$d(props, ctx) : undefined
};
const cCollapse_demo = /*#__PURE__*/_export_sfc(_sfc_main$d, [['ssrRender',_sfc_ssrRender$3]]);

const __vite_glob_0_4 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: cCollapse_demo
}, Symbol.toStringTag, { value: 'Module' }));

const _sfc_main$c = {};

function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs) {
  const _component_c_file_upload = _sfc_main$k;

  _push(ssrRenderComponent(_component_c_file_upload, _attrs, null, _parent));
}
const _sfc_setup$c = _sfc_main$c.setup;
_sfc_main$c.setup = (props, ctx) => {
  const ssrContext = useSSRContext()
  ;(ssrContext.modules || (ssrContext.modules = new Set())).add("src/ui/c-file-upload/c-file-upload.demo.vue");
  return _sfc_setup$c ? _sfc_setup$c(props, ctx) : undefined
};
const cFileUpload_demo = /*#__PURE__*/_export_sfc(_sfc_main$c, [['ssrRender',_sfc_ssrRender$2]]);

const __vite_glob_0_5 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: cFileUpload_demo
}, Symbol.toStringTag, { value: 'Module' }));

const _sfc_main$b = /* @__PURE__ */ defineComponent({
  __name: "c-input-text.demo",
  __ssrInlineRender: true,
  setup(__props) {
    const value = ref("value");
    const valueLong = ref(
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum, est modi iusto repellendus fuga accusantium atque at magnam aliquam eum explicabo vero quia, nobis quasi quis! Earum amet quam a?"
    );
    const validationRules = [{ message: "Length must be > 10", validator: (value2) => value2.length > 10 }];
    const validation = useValidation({
      source: value,
      rules: validationRules
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_c_input_text = __unplugin_components_3$1;
      _push(`<!--[--><h2>Default</h2>`);
      _push(ssrRenderComponent(_component_c_input_text, { value: "qsd" }, null, _parent));
      _push(ssrRenderComponent(_component_c_input_text, { value: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum, est modi iusto repellendus fuga accusantium atque at magnam aliquam eum explicabo vero quia, nobis quasi quis! Earum amet quam a?" }, null, _parent));
      _push(`<h2>With placeholder</h2>`);
      _push(ssrRenderComponent(_component_c_input_text, { placeholder: "Placeholder" }, null, _parent));
      _push(`<h2>With label</h2>`);
      _push(ssrRenderComponent(_component_c_input_text, {
        label: "Label",
        "mb-2": ""
      }, null, _parent));
      _push(ssrRenderComponent(_component_c_input_text, {
        label: "Label",
        "mb-2": "",
        "label-position": "left"
      }, null, _parent));
      _push(ssrRenderComponent(_component_c_input_text, {
        label: "Label",
        "mb-2": "",
        "label-position": "left",
        "label-width": "100px"
      }, null, _parent));
      _push(ssrRenderComponent(_component_c_input_text, {
        label: "Label",
        "mb-2": "",
        "label-position": "left",
        "label-width": "100px",
        "label-align": "right"
      }, null, _parent));
      _push(`<h2>Readonly</h2>`);
      _push(ssrRenderComponent(_component_c_input_text, {
        value: "value",
        readonly: ""
      }, null, _parent));
      _push(`<h2>Disabled</h2>`);
      _push(ssrRenderComponent(_component_c_input_text, {
        value: "value",
        disabled: ""
      }, null, _parent));
      _push(`<h2>Validation</h2>`);
      _push(ssrRenderComponent(_component_c_input_text, {
        value: unref(value),
        "onUpdate:value": ($event) => isRef(value) ? value.value = $event : null,
        "validation-rules": validationRules,
        "mb-2": ""
      }, null, _parent));
      _push(ssrRenderComponent(_component_c_input_text, {
        value: unref(value),
        "onUpdate:value": ($event) => isRef(value) ? value.value = $event : null,
        "validation-rules": validationRules,
        "mb-2": "",
        "label-position": "left",
        label: "Yo "
      }, null, _parent));
      _push(ssrRenderComponent(_component_c_input_text, {
        value: unref(value),
        "onUpdate:value": ($event) => isRef(value) ? value.value = $event : null,
        validation: unref(validation)
      }, null, _parent));
      _push(ssrRenderComponent(_component_c_input_text, {
        value: unref(value),
        "onUpdate:value": ($event) => isRef(value) ? value.value = $event : null,
        validation: unref(validation),
        multiline: "",
        rows: "3"
      }, null, _parent));
      _push(`<h2>Clearable</h2>`);
      _push(ssrRenderComponent(_component_c_input_text, {
        value: unref(value),
        "onUpdate:value": ($event) => isRef(value) ? value.value = $event : null,
        clearable: ""
      }, null, _parent));
      _push(`<h2>Type password</h2>`);
      _push(ssrRenderComponent(_component_c_input_text, {
        value: "value",
        type: "password"
      }, null, _parent));
      _push(`<h2>Multiline</h2>`);
      _push(ssrRenderComponent(_component_c_input_text, {
        value: "value",
        multiline: "",
        label: "Label",
        "mb-2": "",
        rows: "1"
      }, null, _parent));
      _push(ssrRenderComponent(_component_c_input_text, {
        value: "value",
        multiline: "",
        label: "Label",
        "mb-2": ""
      }, null, _parent));
      _push(ssrRenderComponent(_component_c_input_text, {
        value: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum, est modi iusto repellendus fuga accusantium atque at magnam aliquam eum explicabo vero quia, nobis quasi quis! Earum amet quam a?",
        multiline: "",
        "mb-2": ""
      }, null, _parent));
      _push(ssrRenderComponent(_component_c_input_text, {
        value: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum, est modi iusto repellendus fuga accusantium atque at magnam aliquam eum explicabo vero quia, nobis quasi quis! Earum amet quam a?",
        multiline: "",
        clearable: ""
      }, null, _parent));
      _push(`<h2>Autosize</h2>`);
      _push(ssrRenderComponent(_component_c_input_text, {
        value: unref(value),
        "onUpdate:value": ($event) => isRef(value) ? value.value = $event : null,
        label: "Autosize",
        rows: "1",
        multiline: "",
        autosize: "",
        "mb-2": ""
      }, null, _parent));
      _push(ssrRenderComponent(_component_c_input_text, {
        value: unref(valueLong),
        "onUpdate:value": ($event) => isRef(valueLong) ? valueLong.value = $event : null,
        label: "Autosize monospace",
        rows: "1",
        multiline: "",
        autosize: "",
        monospace: "",
        "mb-2": ""
      }, null, _parent));
      _push(`<!--]-->`);
    };
  }
});

const _sfc_setup$b = _sfc_main$b.setup;
_sfc_main$b.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/ui/c-input-text/c-input-text.demo.vue");
  return _sfc_setup$b ? _sfc_setup$b(props, ctx) : void 0;
};

const __vite_glob_0_6 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _sfc_main$b
}, Symbol.toStringTag, { value: 'Module' }));

const { useTheme } = defineThemes({
  dark: {
    default: {
      textColor: appThemes.dark.primary.color,
      hover: {
        textColor: appThemes.dark.primary.colorHover
      },
      pressed: {
        textColor: appThemes.dark.primary.colorPressed
      },
      outline: {
        color: appThemes.dark.primary.color
      }
    }
  },
  light: {
    default: {
      textColor: appThemes.light.primary.color,
      hover: {
        textColor: appThemes.light.primary.colorHover
      },
      pressed: {
        textColor: appThemes.light.primary.colorPressed
      },
      outline: {
        color: appThemes.light.primary.color
      }
    }
  }
});

const _sfc_main$a = /* @__PURE__ */ defineComponent({
  __name: "c-link",
  __ssrInlineRender: true,
  props: {
    href: {},
    to: {}
  },
  setup(__props) {
    const props = __props;
    const { href, to } = toRefs(props);
    const theme = useTheme();
    const tag = computed(() => {
      if (href?.value) {
        return "a";
      }
      if (to?.value) {
        return RouterLink;
      }
      return "span";
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _cssVars = { style: {
        "--1eb0d378": unref(theme).default.textColor,
        "--7db8d4dc": unref(theme).default.hover.textColor,
        "--1fc91bc5": unref(theme).default.outline.color
      } };
      ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(tag)), mergeProps({
        href: unref(href) ?? unref(to),
        class: "c-link",
        to: unref(to)
      }, _attrs, _cssVars), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default", {}, void 0, true)
            ];
          }
        }),
        _: 3
      }), _parent);
    };
  }
});

/* unplugin-vue-components disabled */const cLink_vue_vue_type_style_index_0_scoped_affd0f5f_lang = '';

const _sfc_setup$a = _sfc_main$a.setup;
_sfc_main$a.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/ui/c-link/c-link.vue");
  return _sfc_setup$a ? _sfc_setup$a(props, ctx) : void 0;
};
const CLink = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["__scopeId", "data-v-affd0f5f"]]);

const _sfc_main$9 = /* @__PURE__ */ defineComponent({
  __name: "c-link.demo",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}><h2>Default</h2>`);
      _push(ssrRenderComponent(CLink, { "mx-1": "" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Link `);
          } else {
            return [
              createTextVNode(" Link ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});

const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/ui/c-link/c-link.demo.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};

const __vite_glob_0_7 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _sfc_main$9
}, Symbol.toStringTag, { value: 'Module' }));

const _sfc_main$8 = /* @__PURE__ */ defineComponent({
  __name: "c-markdown",
  __ssrInlineRender: true,
  props: {
    markdown: { default: "" }
  },
  setup(__props) {
    const props = __props;
    const { markdown } = toRefs(props);
    marked.use({
      renderer: {
        link(href, title, text) {
          return `<a class="text-primary transition decoration-none hover:underline" href="${href}" target="_blank" rel="noopener">${text}</a>`;
        }
      }
    });
    const html = computed(() => DomPurify.sanitize(marked(markdown.value), { ADD_ATTR: ["target"] }));
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}>${unref(html)}</div>`);
    };
  }
});

const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/ui/c-markdown/c-markdown.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};

const md = `
# Zeeklog Online Tools

## About
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl quis
mollis blandit, nunc nisl aliquam nunc, vitae aliquam nisl nunc vitae nisl.

- Lorem ipsum dolor sit amet, consectetur adipiscing elit.
- Sed euismod, nisl quis mollis blandit, nunc nisl aliquam nunc, vitae aliquam nisl nunc vitae nisl.

[it-tools](https://it-tools.tech)
`;
const _sfc_main$7 = /* @__PURE__ */ defineComponent({
  __name: "c-markdown.demo",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_c_markdown = _sfc_main$8;
      _push(ssrRenderComponent(_component_c_markdown, mergeProps({ markdown: md }, _attrs), null, _parent));
    };
  }
});

const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/ui/c-markdown/c-markdown.demo.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};

const __vite_glob_0_8 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _sfc_main$7
}, Symbol.toStringTag, { value: 'Module' }));

const _sfc_main$6 = {};

function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs) {
  const _component_c_modal_value = _sfc_main$l;
  const _component_c_button = __unplugin_components_0$1;

  _push(`<div${ssrRenderAttrs(mergeProps({
    flex: "",
    "gap-2": ""
  }, _attrs))}>`);
  _push(ssrRenderComponent(_component_c_modal_value, {
    value: "lorem ipsum",
    label: "test"
  }, null, _parent));
  _push(ssrRenderComponent(_component_c_modal_value, null, {
    label: withCtx(({ toggleModal }, _push, _parent, _scopeId) => {
      if (_push) {
        _push(ssrRenderComponent(_component_c_button, {
          class: "text-left",
          size: "small",
          onClick: toggleModal
        }, {
          default: withCtx((_, _push, _parent, _scopeId) => {
            if (_push) {
              _push(` Bonjour `);
            } else {
              return [
                createTextVNode(" Bonjour ")
              ]
            }
          }),
          _: 2
        }, _parent, _scopeId));
      } else {
        return [
          createVNode(_component_c_button, {
            class: "text-left",
            size: "small",
            onClick: toggleModal
          }, {
            default: withCtx(() => [
              createTextVNode(" Bonjour ")
            ]),
            _: 2
          }, 1032, ["onClick"])
        ]
      }
    }),
    value: withCtx((_, _push, _parent, _scopeId) => {
      if (_push) {
        _push(`<pre${_scopeId}>          Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Molestias, quisquam vitae saepe dolores quas debitis ab r
          ecusandae suscipit ex dignissimos minus quam repellat sunt.
          Molestiae culpa blanditiis totam sapiente dignissimos.
        </pre>`);
      } else {
        return [
          createVNode("pre", null, "          Lorem ipsum dolor sit amet consectetur adipisicing elit.\n          Molestias, quisquam vitae saepe dolores quas debitis ab r\n          ecusandae suscipit ex dignissimos minus quam repellat sunt.\n          Molestiae culpa blanditiis totam sapiente dignissimos.\n        ")
        ]
      }
    }),
    _: 1
  }, _parent));
  _push(`</div>`);
}
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext()
  ;(ssrContext.modules || (ssrContext.modules = new Set())).add("src/ui/c-modal-value/c-modal-value.demo.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : undefined
};
const cModalValue_demo = /*#__PURE__*/_export_sfc(_sfc_main$6, [['ssrRender',_sfc_ssrRender$1]]);

const __vite_glob_0_9 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: cModalValue_demo
}, Symbol.toStringTag, { value: 'Module' }));

const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "c-modal.demo",
  __ssrInlineRender: true,
  setup(__props) {
    const modal1 = ref();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_c_button = __unplugin_components_0$1;
      const _component_c_modal = __unplugin_components_2;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_c_button, {
        onClick: () => unref(modal1)?.open()
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Open Modal `);
          } else {
            return [
              createTextVNode(" Open Modal ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_c_modal, {
        ref_key: "modal1",
        ref: modal1
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Content `);
          } else {
            return [
              createTextVNode(" Content ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});

const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/ui/c-modal/c-modal.demo.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};

const __vite_glob_0_10 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _sfc_main$5
}, Symbol.toStringTag, { value: 'Module' }));

const _hoisted_1 = {
  viewBox: "0 0 24 24",
  width: "1.2em",
  height: "1.2em"
};
const _hoisted_2 = /*#__PURE__*/createElementVNode("path", {
  fill: "currentColor",
  d: "m12.87 15.07l-2.54-2.51l.03-.03A17.52 17.52 0 0 0 14.07 6H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35C8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5l3.11 3.11l.76-2.04M18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12m-2.62 7l1.62-4.33L19.12 17h-3.24Z"
}, null, -1);
const _hoisted_3 = [
  _hoisted_2
];

function render(_ctx, _cache) {
  return (openBlock(), createElementBlock("svg", _hoisted_1, _hoisted_3))
}

const __unplugin_components_1 = { name: 'mdi-translate', render };
/* vite-plugin-components disabled */

const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "c-select.demo",
  __ssrInlineRender: true,
  setup(__props) {
    const optionsA = [
      { label: "Option A", value: "a" },
      { label: "Option B", value: "b" },
      { label: "Option C", value: "c" }
    ];
    const optionsBig = Array.from({ length: 1e3 }, (_, i) => ({ label: `Option ${i}`, value: i }));
    const sizes = ["small", "medium", "large"];
    const value = ref("");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_c_select = __unplugin_components_0$2;
      const _component_icon_mdi_translate = __unplugin_components_1;
      _push(`<!--[--><h2>Sizes</h2><!--[-->`);
      ssrRenderList(sizes, (size) => {
        _push(ssrRenderComponent(_component_c_select, {
          key: size,
          value: unref(value),
          "onUpdate:value": ($event) => isRef(value) ? value.value = $event : null,
          options: optionsA,
          size,
          "mb-2": ""
        }, null, _parent));
      });
      _push(`<!--]--><h2>Searchable</h2><!--[-->`);
      ssrRenderList(sizes, (size) => {
        _push(ssrRenderComponent(_component_c_select, {
          key: size,
          value: unref(value),
          "onUpdate:value": ($event) => isRef(value) ? value.value = $event : null,
          options: optionsA,
          size,
          searchable: "",
          "mb-2": ""
        }, null, _parent));
      });
      _push(`<!--]--><h2>Big list</h2>`);
      _push(ssrRenderComponent(_component_c_select, {
        value: unref(value),
        "onUpdate:value": ($event) => isRef(value) ? value.value = $event : null,
        options: unref(optionsBig),
        searchable: ""
      }, null, _parent));
      _push(`<h2>Empty</h2>`);
      _push(ssrRenderComponent(_component_c_select, { options: [] }, null, _parent));
      _push(`<h2>String array as options</h2>`);
      _push(ssrRenderComponent(_component_c_select, {
        value: unref(value),
        "onUpdate:value": ($event) => isRef(value) ? value.value = $event : null,
        options: ["a", "Option B", "Option C"]
      }, null, _parent));
      _push(`<h2>Labels</h2>`);
      _push(ssrRenderComponent(_component_c_select, {
        label: "Label",
        "mb-2": ""
      }, null, _parent));
      _push(ssrRenderComponent(_component_c_select, {
        label: "Label",
        "label-position": "left",
        "mb-2": ""
      }, null, _parent));
      _push(ssrRenderComponent(_component_c_select, {
        label: "Label",
        "label-position": "left",
        "label-align": "left",
        "mb-2": "",
        "label-width": "200px"
      }, null, _parent));
      _push(ssrRenderComponent(_component_c_select, {
        label: "Label",
        "label-position": "left",
        "label-align": "center",
        "mb-2": "",
        "label-width": "200px"
      }, null, _parent));
      _push(ssrRenderComponent(_component_c_select, {
        label: "Label",
        "label-position": "left",
        "label-align": "right",
        "mb-2": "",
        "label-width": "200px"
      }, null, _parent));
      _push(`<h2>Custom displayed value</h2>`);
      _push(ssrRenderComponent(_component_c_select, {
        value: unref(value),
        "onUpdate:value": ($event) => isRef(value) ? value.value = $event : null,
        options: optionsA,
        "mb-2": ""
      }, {
        "displayed-value": withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="font-bold lh-normal"${_scopeId}>Hello</span>`);
          } else {
            return [
              createVNode("span", { class: "font-bold lh-normal" }, "Hello")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_c_select, {
        value: unref(value),
        "onUpdate:value": ($event) => isRef(value) ? value.value = $event : null,
        options: optionsA
      }, {
        "displayed-value": withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span lh-normal${_scopeId}>`);
            _push2(ssrRenderComponent(_component_icon_mdi_translate, null, null, _parent2, _scopeId));
            _push2(`</span>`);
          } else {
            return [
              createVNode("span", { "lh-normal": "" }, [
                createVNode(_component_icon_mdi_translate)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
});

const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/ui/c-select/c-select.demo.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};

const __vite_glob_0_11 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _sfc_main$4
}, Symbol.toStringTag, { value: 'Module' }));

const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "c-table.demo",
  __ssrInlineRender: true,
  setup(__props) {
    const data = ref([
      { name: "John", age: 20 },
      { name: "Jane", age: 24 },
      { name: "Joe", age: 30 }
    ]);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_c_table = _sfc_main$m;
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_c_table, {
        data: unref(data),
        "mb-2": ""
      }, null, _parent));
      _push(ssrRenderComponent(_component_c_table, {
        data: unref(data),
        "hide-headers": "",
        "mb-2": ""
      }, null, _parent));
      _push(ssrRenderComponent(_component_c_table, {
        data: unref(data),
        headers: ["age", "name"],
        "mb-2": ""
      }, null, _parent));
      _push(ssrRenderComponent(_component_c_table, {
        data: unref(data),
        headers: ["age", { key: "name", label: "Full name" }],
        "mb-2": ""
      }, null, _parent));
      _push(ssrRenderComponent(_component_c_table, {
        data: unref(data),
        headers: { name: "full name" },
        "mb-2": ""
      }, null, _parent));
      _push(ssrRenderComponent(_component_c_table, {
        data: unref(data),
        headers: ["age", "name"]
      }, {
        age: withCtx(({ value }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(value)}yo `);
          } else {
            return [
              createTextVNode(toDisplayString(value) + "yo ", 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
});

const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/ui/c-table/c-table.demo.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};

const __vite_glob_0_12 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _sfc_main$3
}, Symbol.toStringTag, { value: 'Module' }));

const _sfc_main$2 = {};

function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_c_text_copyable = _sfc_main$n;

  _push(ssrRenderComponent(_component_c_text_copyable, mergeProps({
    value: "value",
    "displayed-value": "displayedValue"
  }, _attrs), null, _parent));
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext()
  ;(ssrContext.modules || (ssrContext.modules = new Set())).add("src/ui/c-text-copyable/c-text-copyable.demo.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : undefined
};
const cTextCopyable_demo = /*#__PURE__*/_export_sfc(_sfc_main$2, [['ssrRender',_sfc_ssrRender]]);

const __vite_glob_0_13 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: cTextCopyable_demo
}, Symbol.toStringTag, { value: 'Module' }));

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "c-tooltip.demo",
  __ssrInlineRender: true,
  setup(__props) {
    const positions = ["top", "bottom", "left", "right"];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_c_tooltip = _sfc_main$o;
      const _component_c_button = __unplugin_components_0$1;
      _push(`<!--[--><div>`);
      _push(ssrRenderComponent(_component_c_tooltip, null, {
        tooltip: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Tooltip content `);
          } else {
            return [
              createTextVNode(" Tooltip content ")
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Hover me `);
          } else {
            return [
              createTextVNode(" Hover me ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div mt-5>`);
      _push(ssrRenderComponent(_component_c_tooltip, { tooltip: "Tooltip content" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Hover me `);
          } else {
            return [
              createTextVNode(" Hover me ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div mt-5><h2>Tooltip positions</h2><div class="flex flex-wrap gap-4"><!--[-->`);
      ssrRenderList(positions, (position) => {
        _push(`<div>`);
        _push(ssrRenderComponent(_component_c_tooltip, {
          position,
          tooltip: `Tooltip ${position}`
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_c_button, null, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(position)}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(position), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_c_button, null, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(position), 1)
                  ]),
                  _: 2
                }, 1024)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</div>`);
      });
      _push(`<!--]--></div></div><!--]-->`);
    };
  }
});

const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/ui/c-tooltip/c-tooltip.demo.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};

const __vite_glob_0_14 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _sfc_main$1
}, Symbol.toStringTag, { value: 'Module' }));

const demoPages = /* #__PURE__ */ Object.assign({"../c-alert/c-alert.demo.vue": __vite_glob_0_0,"../c-button/c-button.demo.vue": __vite_glob_0_1,"../c-buttons-select/c-buttons-select.demo.vue": __vite_glob_0_2,"../c-card/c-card.demo.vue": __vite_glob_0_3,"../c-collapse/c-collapse.demo.vue": __vite_glob_0_4,"../c-file-upload/c-file-upload.demo.vue": __vite_glob_0_5,"../c-input-text/c-input-text.demo.vue": __vite_glob_0_6,"../c-link/c-link.demo.vue": __vite_glob_0_7,"../c-markdown/c-markdown.demo.vue": __vite_glob_0_8,"../c-modal-value/c-modal-value.demo.vue": __vite_glob_0_9,"../c-modal/c-modal.demo.vue": __vite_glob_0_10,"../c-select/c-select.demo.vue": __vite_glob_0_11,"../c-table/c-table.demo.vue": __vite_glob_0_12,"../c-text-copyable/c-text-copyable.demo.vue": __vite_glob_0_13,"../c-tooltip/c-tooltip.demo.vue": __vite_glob_0_14});
const demoRoutes = Object.keys(demoPages).map((demoComponentPath) => {
  const [, , fileName] = demoComponentPath.split("/");
  const demoComponentName = fileName.split(".").shift();
  return {
    path: demoComponentName,
    name: demoComponentName,
    component: () => import(
      /* @vite-ignore */
      demoComponentPath
    )
  };
});
const routes = [
  {
    path: "/c-lib",
    name: "c-lib",
    children: [
      {
        path: "",
        name: "c-lib-index",
        component: _sfc_main
      },
      ...demoRoutes
    ],
    component: () => import('../chunks/chunk-10381e64.js')
  }
];

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "demo-home.page",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_c_button = __unplugin_components_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({
        grid: "",
        "grid-cols-5": "",
        "gap-2": ""
      }, _attrs))}><!--[-->`);
      ssrRenderList(unref(demoRoutes), ({ name }) => {
        _push(ssrRenderComponent(_component_c_button, {
          key: name,
          to: { name }
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(name)}`);
            } else {
              return [
                createTextVNode(toDisplayString(name), 1)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/ui/demo/demo-home.page.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

const demoHome_page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _sfc_main
}, Symbol.toStringTag, { value: 'Module' }));

export { CLink as C, _sfc_main$8 as _, demoHome_page as a, demoRoutes as d, _sfc_main as default, routes as r };
