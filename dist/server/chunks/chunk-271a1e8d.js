import { _ as __unplugin_components_3 } from './chunk-4e7a6a8d.js';
import { createVNode, Fragment, createTextVNode, defineComponent, ref, toRefs, computed, unref, mergeProps, withCtx, isRef, openBlock, createBlock, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import JSON5 from 'json5';
import { a as __unplugin_components_1 } from './chunk-8109fd17.js';
import { NFormItem, NSwitch } from 'naive-ui';
import _ from 'lodash';
import { u as useCopy } from './chunk-77c5cc16.js';
import { c as useAppTheme, _ as _export_sfc } from './chunk-6003391e.js';
import { w as withDefaultOnError } from './chunk-f1b4cc24.js';
import { i as isNotThrowing } from './chunk-5697d061.js';
import './chunk-11f44f81.js';
import './chunk-35c3d701.js';
import '@vueuse/core';
import 'pinia';

function diff(obj, newObj, { onlyShowDifferences = false } = {}) {
  if (_.isArray(obj) && _.isArray(newObj)) {
    return {
      key: "",
      type: "array",
      children: diffArrays(obj, newObj, { onlyShowDifferences }),
      oldValue: obj,
      value: newObj,
      status: getStatus(obj, newObj)
    };
  }
  if (_.isObject(obj) && _.isObject(newObj)) {
    return {
      key: "",
      type: "object",
      children: diffObjects(obj, newObj, { onlyShowDifferences }),
      oldValue: obj,
      value: newObj,
      status: getStatus(obj, newObj)
    };
  }
  return {
    key: "",
    type: "value",
    oldValue: obj,
    value: newObj,
    status: getStatus(obj, newObj)
  };
}
function diffObjects(obj, newObj, { onlyShowDifferences = false } = {}) {
  const keys = Object.keys({ ...obj, ...newObj });
  return keys.map((key) => createDifference(obj?.[key], newObj?.[key], key, { onlyShowDifferences })).filter((diff2) => !onlyShowDifferences || diff2.status !== "unchanged");
}
function createDifference(value, newValue, key, { onlyShowDifferences = false } = {}) {
  const type = getType(value);
  if (type === "object") {
    return {
      key,
      type,
      children: diffObjects(value, newValue, {
        onlyShowDifferences
      }),
      oldValue: value,
      value: newValue,
      status: getStatus(value, newValue)
    };
  }
  if (type === "array") {
    return {
      key,
      type,
      children: diffArrays(value, newValue, { onlyShowDifferences }),
      value: newValue,
      oldValue: value,
      status: getStatus(value, newValue)
    };
  }
  return {
    key,
    type,
    value: newValue,
    oldValue: value,
    status: getStatus(value, newValue)
  };
}
function diffArrays(arr, newArr, { onlyShowDifferences = false } = {}) {
  const maxLength = Math.max(0, arr?.length, newArr?.length);
  return Array.from(
    { length: maxLength },
    (_2, i) => createDifference(arr?.[i], newArr?.[i], i, { onlyShowDifferences })
  ).filter((diff2) => !onlyShowDifferences || diff2.status !== "unchanged");
}
function getType(value) {
  if (value === null) {
    return "value";
  }
  if (Array.isArray(value)) {
    return "array";
  }
  if (typeof value === "object") {
    return "object";
  }
  return "value";
}
function getStatus(value, newValue) {
  if (value === void 0) {
    return "added";
  }
  if (newValue === void 0) {
    return "removed";
  }
  const bothAreObjects = getType(value) === "object" && getType(newValue) === "object";
  const bothAreArrays = getType(value) === "array" && getType(newValue) === "array";
  const bothAreDeepEqual = _.isEqual(value, newValue);
  if (bothAreDeepEqual) {
    return "unchanged";
  }
  if (bothAreObjects || bothAreArrays) {
    return "children-updated";
  }
  return "updated";
}

function DiffRootViewer({
  diff
}) {
  return createVNode("div", {
    "class": 'diffs-viewer'
  }, [createVNode("ul", null, [DiffViewer({
    diff,
    showKeys: false
  })])]);
}
function DiffViewer({
  diff,
  showKeys = true
}) {
  const {
    type,
    status
  } = diff;
  if (status === 'updated') {
    return ComparisonViewer({
      diff,
      showKeys
    });
  }
  if (type === 'array') {
    return ChildrenViewer({
      diff,
      showKeys,
      showChildrenKeys: false,
      openTag: '[',
      closeTag: ']'
    });
  }
  if (type === 'object') {
    return ChildrenViewer({
      diff,
      showKeys,
      openTag: '{',
      closeTag: '}'
    });
  }
  return LineDiffViewer({
    diff,
    showKeys
  });
}
function LineDiffViewer({
  diff,
  showKeys
}) {
  const {
    value,
    key,
    status,
    oldValue
  } = diff;
  const valueToDisplay = status === 'removed' ? oldValue : value;
  return createVNode("li", null, [createVNode("span", {
    "class": [status, 'result']
  }, [showKeys && createVNode(Fragment, null, [createVNode("span", {
    "class": 'key'
  }, [key]), ': ']), Value({
    value: valueToDisplay,
    status
  })]), createTextVNode(",")]);
}
function ComparisonViewer({
  diff,
  showKeys
}) {
  const {
    value,
    key,
    oldValue
  } = diff;
  return createVNode("li", {
    "class": 'updated-line'
  }, [showKeys && createVNode(Fragment, null, [createVNode("span", {
    "class": 'key'
  }, [key]), ': ']), Value({
    value: oldValue,
    status: 'removed'
  }), Value({
    value,
    status: 'added'
  }), createTextVNode(",")]);
}
function ChildrenViewer({
  diff,
  openTag,
  closeTag,
  showKeys,
  showChildrenKeys = true
}) {
  const {
    children,
    key,
    status,
    type
  } = diff;
  return createVNode("li", null, [createVNode("div", {
    "class": [type, status],
    "style": {
      display: 'inline-block'
    }
  }, [showKeys && createVNode(Fragment, null, [createVNode("span", {
    "class": 'key'
  }, [key]), ': ']), openTag, children.length > 0 && createVNode("ul", null, [children.map(diff => DiffViewer({
    diff,
    showKeys: showChildrenKeys
  }))]), `${closeTag},`])]);
}
function formatValue(value) {
  if (_.isNull(value)) {
    return 'null';
  }
  return JSON.stringify(value);
}
function Value({
  value,
  status
}) {
  const formatedValue = formatValue(value);
  const {
    copy
  } = useCopy({
    source: formatedValue
  });
  return createVNode("span", {
    "class": ['value', status],
    "onClick": () => copy()
  }, [formatedValue]);
}

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "diff-viewer",
  __ssrInlineRender: true,
  props: {
    leftJson: {},
    rightJson: {}
  },
  setup(__props) {
    const props = __props;
    const onlyShowDifferences = ref(false);
    const { leftJson, rightJson } = toRefs(props);
    const appTheme = useAppTheme();
    const result = computed(
      () => diff(leftJson.value, rightJson.value, { onlyShowDifferences: onlyShowDifferences.value })
    );
    const jsonAreTheSame = computed(() => _.isEqual(leftJson.value, rightJson.value));
    const showResults = computed(() => !_.isUndefined(leftJson.value) && !_.isUndefined(rightJson.value));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_n_form_item = NFormItem;
      const _component_n_switch = NSwitch;
      const _component_c_card = __unplugin_components_1;
      const _cssVars = { style: {
        "--7a613f80": unref(appTheme).text.mutedColor,
        "--ed7825ee": unref(appTheme).success.colorFaded,
        "--31e3079f": unref(appTheme).success.color,
        "--8956bfb8": unref(appTheme).error.colorFaded,
        "--3a20e0b8": unref(appTheme).error.color,
        "--29d2da8a": unref(appTheme).text.baseColor
      } };
      if (unref(showResults)) {
        _push(`<div${ssrRenderAttrs(mergeProps(_attrs, _cssVars))} data-v-d84bb557><div flex justify-center data-v-d84bb557>`);
        _push(ssrRenderComponent(_component_n_form_item, {
          label: "Only show differences",
          "label-placement": "left"
        }, {
          default: withCtx((_2, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_n_switch, {
                value: unref(onlyShowDifferences),
                "onUpdate:value": ($event) => isRef(onlyShowDifferences) ? onlyShowDifferences.value = $event : null
              }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_n_switch, {
                  value: unref(onlyShowDifferences),
                  "onUpdate:value": ($event) => isRef(onlyShowDifferences) ? onlyShowDifferences.value = $event : null
                }, null, 8, ["value", "onUpdate:value"])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
        _push(ssrRenderComponent(_component_c_card, { "data-test-id": "diff-result" }, {
          default: withCtx((_2, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (unref(jsonAreTheSame)) {
                _push2(`<div text-center op-70 data-v-d84bb557${_scopeId}> The provided JSONs are the same </div>`);
              } else {
                _push2(ssrRenderComponent(unref(DiffRootViewer), { diff: unref(result) }, null, _parent2, _scopeId));
              }
            } else {
              return [
                unref(jsonAreTheSame) ? (openBlock(), createBlock("div", {
                  key: 0,
                  "text-center": "",
                  "op-70": ""
                }, " The provided JSONs are the same ")) : (openBlock(), createBlock(unref(DiffRootViewer), {
                  key: 1,
                  diff: unref(result)
                }, null, 8, ["diff"]))
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});

/* unplugin-vue-components disabled */const diffViewer_vue_vue_type_style_index_0_scoped_d84bb557_lang = '';

const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/tools/json-diff/diff-viewer/diff-viewer.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const DiffsViewer = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-d84bb557"]]);

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "json-diff",
  __ssrInlineRender: true,
  setup(__props) {
    const rawLeftJson = ref("");
    const rawRightJson = ref("");
    const leftJson = computed(() => withDefaultOnError(() => JSON5.parse(rawLeftJson.value), void 0));
    const rightJson = computed(() => withDefaultOnError(() => JSON5.parse(rawRightJson.value), void 0));
    const jsonValidationRules = [
      {
        validator: (value) => value === "" || isNotThrowing(() => JSON5.parse(value)),
        message: "Invalid JSON format"
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_c_input_text = __unplugin_components_3;
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_c_input_text, {
        value: unref(rawLeftJson),
        "onUpdate:value": ($event) => isRef(rawLeftJson) ? rawLeftJson.value = $event : null,
        "validation-rules": jsonValidationRules,
        label: "Your first JSON",
        placeholder: "Paste your first JSON here...",
        rows: "20",
        multiline: "",
        "test-id": "leftJson",
        "raw-text": "",
        monospace: ""
      }, null, _parent));
      _push(ssrRenderComponent(_component_c_input_text, {
        value: unref(rawRightJson),
        "onUpdate:value": ($event) => isRef(rawRightJson) ? rawRightJson.value = $event : null,
        "validation-rules": jsonValidationRules,
        label: "Your JSON to compare",
        placeholder: "Paste your JSON to compare here...",
        rows: "20",
        multiline: "",
        "test-id": "rightJson",
        "raw-text": "",
        monospace: ""
      }, null, _parent));
      _push(ssrRenderComponent(DiffsViewer, {
        "left-json": unref(leftJson),
        "right-json": unref(rightJson)
      }, null, _parent));
      _push(`<!--]-->`);
    };
  }
});

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/tools/json-diff/json-diff.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
