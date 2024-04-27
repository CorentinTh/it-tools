import { NDivider, NAlert } from 'naive-ui';
import { a as __unplugin_components_0 } from './chunk-6003391e.js';
import { _ as __unplugin_components_3 } from './chunk-4e7a6a8d.js';
import { defineComponent, ref, computed, unref, isRef, withCtx, createTextVNode, createVNode, openBlock, createBlock, Fragment, renderList, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { MessageType, composerize } from 'composerize-ts';
import { w as withDefaultOnError } from './chunk-f1b4cc24.js';
import { u as useDownloadFileFromBase64 } from './chunk-cce4ae69.js';
import { t as textToBase64 } from './chunk-72fc6fca.js';
import { T as TextareaCopyable } from './chunk-727cc0fb.js';
import '@vueuse/core';
import 'pinia';
import './chunk-11f44f81.js';
import './chunk-35c3d701.js';
import 'lodash';
import 'mime-types';
import './chunk-8109fd17.js';
import '@vicons/tabler';
import 'highlight.js/lib/core';
import 'highlight.js/lib/languages/json';
import 'highlight.js/lib/languages/sql';
import 'highlight.js/lib/languages/xml';
import 'highlight.js/lib/languages/yaml';
import 'highlight.js/lib/languages/ini';
import './chunk-77c5cc16.js';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "docker-run-to-docker-compose-converter",
  __ssrInlineRender: true,
  setup(__props) {
    const dockerRun = ref(
      "docker run -p 80:80 -v /var/run/docker.sock:/tmp/docker.sock:ro --restart always --log-opt max-size=1g nginx"
    );
    const conversionResult = computed(
      () => withDefaultOnError(() => composerize(dockerRun.value.trim()), { yaml: "", messages: [] })
    );
    const dockerCompose = computed(() => conversionResult.value.yaml);
    const notImplemented = computed(
      () => conversionResult.value.messages.filter((msg) => msg.type === MessageType.notImplemented).map((msg) => msg.value)
    );
    const notComposable = computed(
      () => conversionResult.value.messages.filter((msg) => msg.type === MessageType.notTranslatable).map((msg) => msg.value)
    );
    const errors = computed(
      () => conversionResult.value.messages.filter((msg) => msg.type === MessageType.errorDuringConversion).map((msg) => msg.value)
    );
    const dockerComposeBase64 = computed(() => `data:application/yaml;base64,${textToBase64(dockerCompose.value)}`);
    const { download } = useDownloadFileFromBase64({ source: dockerComposeBase64, filename: "docker-compose.yml" });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_c_input_text = __unplugin_components_3;
      const _component_n_divider = NDivider;
      const _component_c_button = __unplugin_components_0;
      const _component_n_alert = NAlert;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_c_input_text, {
        value: unref(dockerRun),
        "onUpdate:value": ($event) => isRef(dockerRun) ? dockerRun.value = $event : null,
        label: "Your docker run command:",
        style: { "font-family": "monospace" },
        multiline: "",
        "raw-text": "",
        monospace: "",
        placeholder: "Your docker run command to convert...",
        rows: "3"
      }, null, _parent));
      _push(ssrRenderComponent(_component_n_divider, null, null, _parent));
      _push(ssrRenderComponent(TextareaCopyable, {
        value: unref(dockerCompose),
        language: "yaml"
      }, null, _parent));
      _push(`<div mt-5 flex justify-center>`);
      _push(ssrRenderComponent(_component_c_button, {
        disabled: unref(dockerCompose) === "",
        secondary: "",
        onClick: unref(download)
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Download docker-compose.yml `);
          } else {
            return [
              createTextVNode(" Download docker-compose.yml ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (unref(notComposable).length > 0) {
        _push(`<div>`);
        _push(ssrRenderComponent(_component_n_alert, {
          title: "This options are not translatable to docker-compose",
          type: "info",
          "mt-5": ""
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<ul${_scopeId}><!--[-->`);
              ssrRenderList(unref(notComposable), (message, index) => {
                _push2(`<li${_scopeId}>${ssrInterpolate(message)}</li>`);
              });
              _push2(`<!--]--></ul>`);
            } else {
              return [
                createVNode("ul", null, [
                  (openBlock(true), createBlock(Fragment, null, renderList(unref(notComposable), (message, index) => {
                    return openBlock(), createBlock("li", { key: index }, toDisplayString(message), 1);
                  }), 128))
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(notImplemented).length > 0) {
        _push(`<div>`);
        _push(ssrRenderComponent(_component_n_alert, {
          title: "This options are not yet implemented and therefore haven't been translated to docker-compose",
          type: "warning",
          "mt-5": ""
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<ul${_scopeId}><!--[-->`);
              ssrRenderList(unref(notImplemented), (message, index) => {
                _push2(`<li${_scopeId}>${ssrInterpolate(message)}</li>`);
              });
              _push2(`<!--]--></ul>`);
            } else {
              return [
                createVNode("ul", null, [
                  (openBlock(true), createBlock(Fragment, null, renderList(unref(notImplemented), (message, index) => {
                    return openBlock(), createBlock("li", { key: index }, toDisplayString(message), 1);
                  }), 128))
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(errors).length > 0) {
        _push(`<div>`);
        _push(ssrRenderComponent(_component_n_alert, {
          title: "The following errors occured",
          type: "error",
          "mt-5": ""
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<ul${_scopeId}><!--[-->`);
              ssrRenderList(unref(errors), (message, index) => {
                _push2(`<li${_scopeId}>${ssrInterpolate(message)}</li>`);
              });
              _push2(`<!--]--></ul>`);
            } else {
              return [
                createVNode("ul", null, [
                  (openBlock(true), createBlock(Fragment, null, renderList(unref(errors), (message, index) => {
                    return openBlock(), createBlock("li", { key: index }, toDisplayString(message), 1);
                  }), 128))
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/tools/docker-run-to-docker-compose-converter/docker-run-to-docker-compose-converter.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
