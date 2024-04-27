import { a as _sfc_main$4 } from './chunk-6ba26b76.js';
import { _ as _sfc_main$3 } from './chunk-ab9bd3df.js';
import { _ as _sfc_main$2 } from './chunk-aab02bfe.js';
import { defineComponent, toRefs, computed, mergeProps, unref, withCtx, createVNode, toDisplayString, useSSRContext, ref, createTextVNode } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderStyle, ssrRenderList } from 'vue/server-renderer';
import { _ as __unplugin_components_3 } from './chunk-28375bc9.js';
import { a as __unplugin_components_1 } from './chunk-8109fd17.js';
import { _ as _sfc_main$5 } from './chunk-83cdd9a0.js';
import verifyPDF from 'pdf-signature-reader';
import { f as formatBytes } from './chunk-3e99c6bf.js';
import './chunk-6003391e.js';
import '@vueuse/core';
import 'pinia';
import './chunk-77c5cc16.js';
import 'naive-ui';
import './chunk-aff50618.js';
import './chunk-95ec8cf7.js';
import 'lodash';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "pdf-signature-details",
  __ssrInlineRender: true,
  props: {
    signature: {}
  },
  setup(__props) {
    const props = __props;
    const { signature } = toRefs(props);
    const tableHeaders = {
      validityPeriod: "Validity period",
      issuedBy: "Issued by",
      issuedTo: "Issued to",
      pemCertificate: "PEM certificate"
    };
    const certs = computed(
      () => signature.value.meta.certs.map((certificate, index) => ({
        ...certificate,
        validityPeriod: {
          notBefore: new Date(certificate.validityPeriod.notBefore).toLocaleString(),
          notAfter: new Date(certificate.validityPeriod.notAfter).toLocaleString()
        },
        certificateName: `Certificate ${index + 1}`
      }))
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_c_table = _sfc_main$2;
      const _component_c_key_value_list = _sfc_main$3;
      const _component_c_modal_value = _sfc_main$4;
      _push(`<div${ssrRenderAttrs(mergeProps({
        flex: "",
        "flex-col": "",
        "gap-2": ""
      }, _attrs))}>`);
      _push(ssrRenderComponent(_component_c_table, {
        data: unref(certs),
        headers: tableHeaders
      }, {
        validityPeriod: withCtx(({ value }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_c_key_value_list, {
              items: [{
                label: "Not before",
                value: value.notBefore
              }, {
                label: "Not after",
                value: value.notAfter
              }]
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_c_key_value_list, {
                items: [{
                  label: "Not before",
                  value: value.notBefore
                }, {
                  label: "Not after",
                  value: value.notAfter
                }]
              }, null, 8, ["items"])
            ];
          }
        }),
        issuedBy: withCtx(({ value }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_c_key_value_list, {
              items: [{
                label: "Common name",
                value: value.commonName
              }, {
                label: "Organization name",
                value: value.organizationName
              }, {
                label: "Country name",
                value: value.countryName
              }, {
                label: "Locality name",
                value: value.localityName
              }, {
                label: "Organizational unit name",
                value: value.organizationalUnitName
              }, {
                label: "State or province name",
                value: value.stateOrProvinceName
              }]
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_c_key_value_list, {
                items: [{
                  label: "Common name",
                  value: value.commonName
                }, {
                  label: "Organization name",
                  value: value.organizationName
                }, {
                  label: "Country name",
                  value: value.countryName
                }, {
                  label: "Locality name",
                  value: value.localityName
                }, {
                  label: "Organizational unit name",
                  value: value.organizationalUnitName
                }, {
                  label: "State or province name",
                  value: value.stateOrProvinceName
                }]
              }, null, 8, ["items"])
            ];
          }
        }),
        issuedTo: withCtx(({ value }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_c_key_value_list, {
              items: [{
                label: "Common name",
                value: value.commonName
              }, {
                label: "Organization name",
                value: value.organizationName
              }, {
                label: "Country name",
                value: value.countryName
              }, {
                label: "Locality name",
                value: value.localityName
              }, {
                label: "Organizational unit name",
                value: value.organizationalUnitName
              }, {
                label: "State or province name",
                value: value.stateOrProvinceName
              }]
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_c_key_value_list, {
                items: [{
                  label: "Common name",
                  value: value.commonName
                }, {
                  label: "Organization name",
                  value: value.organizationName
                }, {
                  label: "Country name",
                  value: value.countryName
                }, {
                  label: "Locality name",
                  value: value.localityName
                }, {
                  label: "Organizational unit name",
                  value: value.organizationalUnitName
                }, {
                  label: "State or province name",
                  value: value.stateOrProvinceName
                }]
              }, null, 8, ["items"])
            ];
          }
        }),
        pemCertificate: withCtx(({ value }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_c_modal_value, {
              value,
              label: "View PEM cert"
            }, {
              value: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div break-all text-xs${_scopeId2}>${ssrInterpolate(value)}</div>`);
                } else {
                  return [
                    createVNode("div", {
                      "break-all": "",
                      "text-xs": ""
                    }, toDisplayString(value), 1)
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_c_modal_value, {
                value,
                label: "View PEM cert"
              }, {
                value: withCtx(() => [
                  createVNode("div", {
                    "break-all": "",
                    "text-xs": ""
                  }, toDisplayString(value), 1)
                ]),
                _: 2
              }, 1032, ["value"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});

const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/tools/pdf-signature-checker/components/pdf-signature-details.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "pdf-signature-checker",
  __ssrInlineRender: true,
  setup(__props) {
    const signatures = ref([]);
    const status = ref("idle");
    const file = ref(null);
    async function onVerifyClicked(uploadedFile) {
      file.value = uploadedFile;
      const fileBuffer = await uploadedFile.arrayBuffer();
      status.value = "loading";
      try {
        const { signatures: parsedSignatures } = verifyPDF(fileBuffer);
        signatures.value = parsedSignatures;
        status.value = "parsed";
      } catch (e) {
        signatures.value = [];
        status.value = "error";
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_c_file_upload = _sfc_main$5;
      const _component_c_card = __unplugin_components_1;
      const _component_c_alert = __unplugin_components_3;
      const _component_pdf_signature_details = _sfc_main$1;
      _push(`<!--[--><div style="${ssrRenderStyle({ "flex": "0 0 100%" })}"><div mx-auto max-w-600px>`);
      _push(ssrRenderComponent(_component_c_file_upload, {
        title: "Drag and drop a PDF file here, or click to select a file",
        accept: ".pdf",
        onFileUpload: onVerifyClicked
      }, null, _parent));
      if (unref(file)) {
        _push(ssrRenderComponent(_component_c_card, {
          "mt-4": "",
          flex: "",
          "gap-2": ""
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div font-bold${_scopeId}>${ssrInterpolate(unref(file).name)}</div><div${_scopeId}>${ssrInterpolate(unref(formatBytes)(unref(file).size))}</div>`);
            } else {
              return [
                createVNode("div", { "font-bold": "" }, toDisplayString(unref(file).name), 1),
                createVNode("div", null, toDisplayString(unref(formatBytes)(unref(file).size)), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      if (unref(status) === "error") {
        _push(`<div>`);
        _push(ssrRenderComponent(_component_c_alert, { "mt-4": "" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` No signatures found in the provided file. `);
            } else {
              return [
                createTextVNode(" No signatures found in the provided file. ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
      if (unref(status) === "parsed" && unref(signatures).length) {
        _push(`<div style="${ssrRenderStyle({ "flex": "0 0 100%" })}" mt-5 flex flex-col gap-4><!--[-->`);
        ssrRenderList(unref(signatures), (signature, index) => {
          _push(`<div><div mb-2 font-bold> Signature ${ssrInterpolate(index + 1)} certificates : </div>`);
          _push(ssrRenderComponent(_component_pdf_signature_details, { signature }, null, _parent));
          _push(`</div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--]-->`);
    };
  }
});

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/tools/pdf-signature-checker/pdf-signature-checker.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
