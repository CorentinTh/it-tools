import { a as __unplugin_components_0$1 } from './chunk-6003391e.js';
import { _ as _sfc_main$1 } from './chunk-de61ec1c.js';
import { _ as __unplugin_components_0 } from './chunk-89a4876c.js';
import { _ as __unplugin_components_3 } from './chunk-4e7a6a8d.js';
import { defineComponent, ref, computed, mergeProps, unref, isRef, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { HmacMD5, HmacRIPEMD160, HmacSHA1, HmacSHA3, HmacSHA224, HmacSHA256, HmacSHA384, HmacSHA512, enc } from 'crypto-js';
import { c as convertHexToBin } from './chunk-915ca1f7.js';
import { u as useCopy } from './chunk-77c5cc16.js';
import '@vueuse/core';
import 'pinia';
import './chunk-95ec8cf7.js';
import './chunk-8109fd17.js';
import './chunk-bb5bb4f6.js';
import './chunk-2ce6ed5e.js';
import 'fuse.js';
import './chunk-11f44f81.js';
import './chunk-35c3d701.js';
import 'lodash';
import 'naive-ui';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "hmac-generator",
  __ssrInlineRender: true,
  setup(__props) {
    const algos = {
      MD5: HmacMD5,
      RIPEMD160: HmacRIPEMD160,
      SHA1: HmacSHA1,
      SHA3: HmacSHA3,
      SHA224: HmacSHA224,
      SHA256: HmacSHA256,
      SHA384: HmacSHA384,
      SHA512: HmacSHA512
    };
    function formatWithEncoding(words, encoding2) {
      if (encoding2 === "Bin") {
        return convertHexToBin(words.toString(enc.Hex));
      }
      return words.toString(enc[encoding2]);
    }
    const plainText = ref("");
    const secret = ref("");
    const hashFunction = ref("SHA256");
    const encoding = ref("Hex");
    const hmac = computed(
      () => formatWithEncoding(algos[hashFunction.value](plainText.value, secret.value), encoding.value)
    );
    const { copy } = useCopy({ source: hmac });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_c_input_text = __unplugin_components_3;
      const _component_c_select = __unplugin_components_0;
      const _component_input_copyable = _sfc_main$1;
      const _component_c_button = __unplugin_components_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({
        flex: "",
        "flex-col": "",
        "gap-4": ""
      }, _attrs))}>`);
      _push(ssrRenderComponent(_component_c_input_text, {
        value: unref(plainText),
        "onUpdate:value": ($event) => isRef(plainText) ? plainText.value = $event : null,
        multiline: "",
        "raw-text": "",
        placeholder: "Plain text to compute the hash...",
        rows: "3",
        autosize: "",
        autofocus: "",
        label: "Plain text to compute the hash"
      }, null, _parent));
      _push(ssrRenderComponent(_component_c_input_text, {
        value: unref(secret),
        "onUpdate:value": ($event) => isRef(secret) ? secret.value = $event : null,
        "raw-text": "",
        placeholder: "Enter the secret key...",
        label: "Secret key",
        clearable: ""
      }, null, _parent));
      _push(`<div flex gap-2>`);
      _push(ssrRenderComponent(_component_c_select, {
        value: unref(hashFunction),
        "onUpdate:value": ($event) => isRef(hashFunction) ? hashFunction.value = $event : null,
        label: "Hashing function",
        "flex-1": "",
        placeholder: "Select an hashing function...",
        options: Object.keys(algos).map((label) => ({ label, value: label }))
      }, null, _parent));
      _push(ssrRenderComponent(_component_c_select, {
        value: unref(encoding),
        "onUpdate:value": ($event) => isRef(encoding) ? encoding.value = $event : null,
        label: "Output encoding",
        "flex-1": "",
        placeholder: "Select the result encoding...",
        options: [
          {
            label: "Binary (base 2)",
            value: "Bin"
          },
          {
            label: "Hexadecimal (base 16)",
            value: "Hex"
          },
          {
            label: "Base64 (base 64)",
            value: "Base64"
          },
          {
            label: "Base64-url (base 64 with url safe chars)",
            value: "Base64url"
          }
        ]
      }, null, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_input_copyable, {
        value: unref(hmac),
        "onUpdate:value": ($event) => isRef(hmac) ? hmac.value = $event : null,
        type: "textarea",
        placeholder: "The result of the HMAC...",
        label: "HMAC of your text"
      }, null, _parent));
      _push(`<div flex justify-center>`);
      _push(ssrRenderComponent(_component_c_button, {
        onClick: ($event) => unref(copy)()
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Copy HMAC `);
          } else {
            return [
              createTextVNode(" Copy HMAC ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
    };
  }
});

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/tools/hmac-generator/hmac-generator.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
