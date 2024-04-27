import { a as __unplugin_components_0$1 } from './chunk-6003391e.js';
import { NCheckbox, NForm, NFormItem, NColorPicker } from 'naive-ui';
import { _ as __unplugin_components_3 } from './chunk-4e7a6a8d.js';
import { _ as __unplugin_components_0 } from './chunk-89a4876c.js';
import { a as __unplugin_components_1 } from './chunk-8109fd17.js';
import { ref, watch, isRef, defineComponent, withCtx, unref, createTextVNode, createVNode, openBlock, createBlock, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderAttr } from 'vue/server-renderer';
import { get } from '@vueuse/core';
import QRCode from 'qrcode';
import { u as useDownloadFileFromBase64 } from './chunk-cce4ae69.js';
import 'pinia';
import './chunk-11f44f81.js';
import './chunk-35c3d701.js';
import 'lodash';
import './chunk-bb5bb4f6.js';
import './chunk-2ce6ed5e.js';
import 'fuse.js';
import 'mime-types';

const EAPMethods = [
  "MD5",
  "POTP",
  "GTC",
  "TLS",
  "IKEv2",
  "SIM",
  "AKA",
  "AKA'",
  "TTLS",
  "PWD",
  "LEAP",
  "PSK",
  "FAST",
  "TEAP",
  "EKE",
  "NOOB",
  "PEAP"
];
const EAPPhase2Methods = [
  "None",
  "MSCHAPV2"
];
function escapeString(str) {
  return str.replace(/([\\;,:"])/g, "\\$1");
}
function getQrCodeText(options) {
  const { ssid, password, encryption, eapMethod, isHiddenSSID, eapAnonymous, eapIdentity, eapPhase2Method } = options;
  if (!ssid) {
    return null;
  }
  if (encryption === "nopass") {
    return `WIFI:S:${escapeString(ssid)};;`;
  }
  if (encryption !== "WPA2-EAP" && password) {
    return `WIFI:S:${escapeString(ssid)};T:${encryption};P:${escapeString(password)};${isHiddenSSID ? "H:true" : ""};`;
  }
  if (encryption === "WPA2-EAP" && password && eapMethod) {
    if (!eapIdentity && !eapAnonymous) {
      return null;
    }
    if (eapMethod === "PEAP" && !eapPhase2Method) {
      return null;
    }
    const identity = eapAnonymous ? "A:anon" : `I:${escapeString(eapIdentity)}`;
    const phase2 = eapPhase2Method !== "None" ? `PH2:${eapPhase2Method};` : "";
    return `WIFI:S:${escapeString(ssid)};T:WPA2-EAP;P:${escapeString(password)};E:${eapMethod};${phase2}${identity};${isHiddenSSID ? "H:true" : ""};`;
  }
  return null;
}
function useWifiQRCode({
  ssid,
  password,
  eapMethod,
  isHiddenSSID,
  eapAnonymous,
  eapIdentity,
  eapPhase2Method,
  color: { background, foreground },
  options
}) {
  const qrcode = ref("");
  const encryption = ref("WPA");
  watch(
    [ssid, password, encryption, eapMethod, isHiddenSSID, eapAnonymous, eapIdentity, eapPhase2Method, background, foreground].filter(isRef),
    async () => {
      const text = getQrCodeText({
        ssid: get(ssid),
        password: get(password),
        encryption: get(encryption),
        eapMethod: get(eapMethod),
        isHiddenSSID: get(isHiddenSSID),
        eapAnonymous: get(eapAnonymous),
        eapIdentity: get(eapIdentity),
        eapPhase2Method: get(eapPhase2Method)
      });
      if (text) {
        qrcode.value = await QRCode.toDataURL(get(text).trim(), {
          color: {
            dark: get(foreground),
            light: get(background),
            ...options?.color
          },
          errorCorrectionLevel: "M",
          ...options
        });
      }
    },
    { immediate: true }
  );
  return { qrcode, encryption };
}

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "wifi-qr-code-generator",
  __ssrInlineRender: true,
  setup(__props) {
    const foreground = ref("#000000ff");
    const background = ref("#ffffffff");
    const ssid = ref();
    const password = ref();
    const eapMethod = ref();
    const isHiddenSSID = ref(false);
    const eapAnonymous = ref(false);
    const eapIdentity = ref();
    const eapPhase2Method = ref();
    const { qrcode, encryption } = useWifiQRCode({
      ssid,
      password,
      eapMethod,
      isHiddenSSID,
      eapAnonymous,
      eapIdentity,
      eapPhase2Method,
      color: {
        background,
        foreground
      },
      options: { width: 1024 }
    });
    const { download } = useDownloadFileFromBase64({ source: qrcode, filename: "qr-code.png" });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_c_card = __unplugin_components_1;
      const _component_c_select = __unplugin_components_0;
      const _component_c_input_text = __unplugin_components_3;
      const _component_n_checkbox = NCheckbox;
      const _component_n_form = NForm;
      const _component_n_form_item = NFormItem;
      const _component_n_color_picker = NColorPicker;
      const _component_c_button = __unplugin_components_0$1;
      _push(ssrRenderComponent(_component_c_card, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div grid grid-cols-1 gap-12${_scopeId}><div${_scopeId}>`);
            _push2(ssrRenderComponent(_component_c_select, {
              value: unref(encryption),
              "onUpdate:value": ($event) => isRef(encryption) ? encryption.value = $event : null,
              "mb-4": "",
              label: "Encryption method",
              "default-value": "WPA",
              "label-position": "left",
              "label-width": "130px",
              "label-align": "right",
              options: [
                {
                  label: "No password",
                  value: "nopass"
                },
                {
                  label: "WPA/WPA2",
                  value: "WPA"
                },
                {
                  label: "WEP",
                  value: "WEP"
                },
                {
                  label: "WPA2-EAP",
                  value: "WPA2-EAP"
                }
              ]
            }, null, _parent2, _scopeId));
            _push2(`<div class="mb-6 flex flex-row items-center gap-2"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_c_input_text, {
              value: unref(ssid),
              "onUpdate:value": ($event) => isRef(ssid) ? ssid.value = $event : null,
              "label-position": "left",
              "label-width": "130px",
              "label-align": "right",
              label: "SSID:",
              rows: "1",
              autosize: "",
              placeholder: "Your WiFi SSID...",
              "mb-6": ""
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_n_checkbox, {
              checked: unref(isHiddenSSID),
              "onUpdate:checked": ($event) => isRef(isHiddenSSID) ? isHiddenSSID.value = $event : null
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Hidden SSID `);
                } else {
                  return [
                    createTextVNode(" Hidden SSID ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
            if (unref(encryption) !== "nopass") {
              _push2(ssrRenderComponent(_component_c_input_text, {
                value: unref(password),
                "onUpdate:value": ($event) => isRef(password) ? password.value = $event : null,
                "label-position": "left",
                "label-width": "130px",
                "label-align": "right",
                label: "Password:",
                rows: "1",
                autosize: "",
                type: "password",
                placeholder: "Your WiFi Password...",
                "mb-6": ""
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            if (unref(encryption) === "WPA2-EAP") {
              _push2(ssrRenderComponent(_component_c_select, {
                value: unref(eapMethod),
                "onUpdate:value": ($event) => isRef(eapMethod) ? eapMethod.value = $event : null,
                label: "EAP method",
                "label-position": "left",
                "label-width": "130px",
                "label-align": "right",
                options: unref(EAPMethods).map((method) => ({ label: method, value: method })),
                searchable: "",
                "mb-4": ""
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            if (unref(encryption) === "WPA2-EAP") {
              _push2(`<div class="mb-6 flex flex-row items-center gap-2"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_c_input_text, {
                value: unref(eapIdentity),
                "onUpdate:value": ($event) => isRef(eapIdentity) ? eapIdentity.value = $event : null,
                "label-position": "left",
                "label-width": "130px",
                "label-align": "right",
                label: "Identity:",
                rows: "1",
                autosize: "",
                placeholder: "Your EAP Identity...",
                "mb-6": ""
              }, null, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_n_checkbox, {
                checked: unref(eapAnonymous),
                "onUpdate:checked": ($event) => isRef(eapAnonymous) ? eapAnonymous.value = $event : null
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Anonymous? `);
                  } else {
                    return [
                      createTextVNode(" Anonymous? ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            if (unref(encryption) === "WPA2-EAP") {
              _push2(ssrRenderComponent(_component_c_select, {
                value: unref(eapPhase2Method),
                "onUpdate:value": ($event) => isRef(eapPhase2Method) ? eapPhase2Method.value = $event : null,
                label: "EAP Phase 2 method",
                "label-position": "left",
                "label-width": "130px",
                "label-align": "right",
                options: unref(EAPPhase2Methods).map((method) => ({ label: method, value: method })),
                searchable: "",
                "mb-4": ""
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(_component_n_form, {
              "label-width": "130",
              "label-placement": "left"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_n_form_item, { label: "Foreground color:" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_n_color_picker, {
                          value: unref(foreground),
                          "onUpdate:value": ($event) => isRef(foreground) ? foreground.value = $event : null,
                          modes: ["hex"]
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_n_color_picker, {
                            value: unref(foreground),
                            "onUpdate:value": ($event) => isRef(foreground) ? foreground.value = $event : null,
                            modes: ["hex"]
                          }, null, 8, ["value", "onUpdate:value"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_n_form_item, { label: "Background color:" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_n_color_picker, {
                          value: unref(background),
                          "onUpdate:value": ($event) => isRef(background) ? background.value = $event : null,
                          modes: ["hex"]
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_n_color_picker, {
                            value: unref(background),
                            "onUpdate:value": ($event) => isRef(background) ? background.value = $event : null,
                            modes: ["hex"]
                          }, null, 8, ["value", "onUpdate:value"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_n_form_item, { label: "Foreground color:" }, {
                      default: withCtx(() => [
                        createVNode(_component_n_color_picker, {
                          value: unref(foreground),
                          "onUpdate:value": ($event) => isRef(foreground) ? foreground.value = $event : null,
                          modes: ["hex"]
                        }, null, 8, ["value", "onUpdate:value"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_n_form_item, { label: "Background color:" }, {
                      default: withCtx(() => [
                        createVNode(_component_n_color_picker, {
                          value: unref(background),
                          "onUpdate:value": ($event) => isRef(background) ? background.value = $event : null,
                          modes: ["hex"]
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
            if (unref(qrcode)) {
              _push2(`<div${_scopeId}><div flex flex-col items-center gap-3${_scopeId}><img alt="wifi-qrcode"${ssrRenderAttr("src", unref(qrcode))} width="200"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_c_button, { onClick: unref(download) }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Download qr-code `);
                  } else {
                    return [
                      createTextVNode(" Download qr-code ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", {
                grid: "",
                "grid-cols-1": "",
                "gap-12": ""
              }, [
                createVNode("div", null, [
                  createVNode(_component_c_select, {
                    value: unref(encryption),
                    "onUpdate:value": ($event) => isRef(encryption) ? encryption.value = $event : null,
                    "mb-4": "",
                    label: "Encryption method",
                    "default-value": "WPA",
                    "label-position": "left",
                    "label-width": "130px",
                    "label-align": "right",
                    options: [
                      {
                        label: "No password",
                        value: "nopass"
                      },
                      {
                        label: "WPA/WPA2",
                        value: "WPA"
                      },
                      {
                        label: "WEP",
                        value: "WEP"
                      },
                      {
                        label: "WPA2-EAP",
                        value: "WPA2-EAP"
                      }
                    ]
                  }, null, 8, ["value", "onUpdate:value"]),
                  createVNode("div", { class: "mb-6 flex flex-row items-center gap-2" }, [
                    createVNode(_component_c_input_text, {
                      value: unref(ssid),
                      "onUpdate:value": ($event) => isRef(ssid) ? ssid.value = $event : null,
                      "label-position": "left",
                      "label-width": "130px",
                      "label-align": "right",
                      label: "SSID:",
                      rows: "1",
                      autosize: "",
                      placeholder: "Your WiFi SSID...",
                      "mb-6": ""
                    }, null, 8, ["value", "onUpdate:value"]),
                    createVNode(_component_n_checkbox, {
                      checked: unref(isHiddenSSID),
                      "onUpdate:checked": ($event) => isRef(isHiddenSSID) ? isHiddenSSID.value = $event : null
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Hidden SSID ")
                      ]),
                      _: 1
                    }, 8, ["checked", "onUpdate:checked"])
                  ]),
                  unref(encryption) !== "nopass" ? (openBlock(), createBlock(_component_c_input_text, {
                    key: 0,
                    value: unref(password),
                    "onUpdate:value": ($event) => isRef(password) ? password.value = $event : null,
                    "label-position": "left",
                    "label-width": "130px",
                    "label-align": "right",
                    label: "Password:",
                    rows: "1",
                    autosize: "",
                    type: "password",
                    placeholder: "Your WiFi Password...",
                    "mb-6": ""
                  }, null, 8, ["value", "onUpdate:value"])) : createCommentVNode("", true),
                  unref(encryption) === "WPA2-EAP" ? (openBlock(), createBlock(_component_c_select, {
                    key: 1,
                    value: unref(eapMethod),
                    "onUpdate:value": ($event) => isRef(eapMethod) ? eapMethod.value = $event : null,
                    label: "EAP method",
                    "label-position": "left",
                    "label-width": "130px",
                    "label-align": "right",
                    options: unref(EAPMethods).map((method) => ({ label: method, value: method })),
                    searchable: "",
                    "mb-4": ""
                  }, null, 8, ["value", "onUpdate:value", "options"])) : createCommentVNode("", true),
                  unref(encryption) === "WPA2-EAP" ? (openBlock(), createBlock("div", {
                    key: 2,
                    class: "mb-6 flex flex-row items-center gap-2"
                  }, [
                    createVNode(_component_c_input_text, {
                      value: unref(eapIdentity),
                      "onUpdate:value": ($event) => isRef(eapIdentity) ? eapIdentity.value = $event : null,
                      "label-position": "left",
                      "label-width": "130px",
                      "label-align": "right",
                      label: "Identity:",
                      rows: "1",
                      autosize: "",
                      placeholder: "Your EAP Identity...",
                      "mb-6": ""
                    }, null, 8, ["value", "onUpdate:value"]),
                    createVNode(_component_n_checkbox, {
                      checked: unref(eapAnonymous),
                      "onUpdate:checked": ($event) => isRef(eapAnonymous) ? eapAnonymous.value = $event : null
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Anonymous? ")
                      ]),
                      _: 1
                    }, 8, ["checked", "onUpdate:checked"])
                  ])) : createCommentVNode("", true),
                  unref(encryption) === "WPA2-EAP" ? (openBlock(), createBlock(_component_c_select, {
                    key: 3,
                    value: unref(eapPhase2Method),
                    "onUpdate:value": ($event) => isRef(eapPhase2Method) ? eapPhase2Method.value = $event : null,
                    label: "EAP Phase 2 method",
                    "label-position": "left",
                    "label-width": "130px",
                    "label-align": "right",
                    options: unref(EAPPhase2Methods).map((method) => ({ label: method, value: method })),
                    searchable: "",
                    "mb-4": ""
                  }, null, 8, ["value", "onUpdate:value", "options"])) : createCommentVNode("", true),
                  createVNode(_component_n_form, {
                    "label-width": "130",
                    "label-placement": "left"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_n_form_item, { label: "Foreground color:" }, {
                        default: withCtx(() => [
                          createVNode(_component_n_color_picker, {
                            value: unref(foreground),
                            "onUpdate:value": ($event) => isRef(foreground) ? foreground.value = $event : null,
                            modes: ["hex"]
                          }, null, 8, ["value", "onUpdate:value"])
                        ]),
                        _: 1
                      }),
                      createVNode(_component_n_form_item, { label: "Background color:" }, {
                        default: withCtx(() => [
                          createVNode(_component_n_color_picker, {
                            value: unref(background),
                            "onUpdate:value": ($event) => isRef(background) ? background.value = $event : null,
                            modes: ["hex"]
                          }, null, 8, ["value", "onUpdate:value"])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                unref(qrcode) ? (openBlock(), createBlock("div", { key: 0 }, [
                  createVNode("div", {
                    flex: "",
                    "flex-col": "",
                    "items-center": "",
                    "gap-3": ""
                  }, [
                    createVNode("img", {
                      alt: "wifi-qrcode",
                      src: unref(qrcode),
                      width: "200"
                    }, null, 8, ["src"]),
                    createVNode(_component_c_button, { onClick: unref(download) }, {
                      default: withCtx(() => [
                        createTextVNode(" Download qr-code ")
                      ]),
                      _: 1
                    }, 8, ["onClick"])
                  ])
                ])) : createCommentVNode("", true)
              ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/tools/wifi-qr-code-generator/wifi-qr-code-generator.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
