import { NTable } from 'naive-ui';
import { _ as __unplugin_components_3 } from './chunk-4e7a6a8d.js';
import { a as __unplugin_components_1 } from './chunk-8109fd17.js';
import { defineComponent, ref, computed, withCtx, unref, isRef, createVNode, openBlock, createBlock, Fragment, renderList, toDisplayString, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import jwtDecode from 'jwt-decode';
import _ from 'lodash';
import { u as useValidation } from './chunk-35c3d701.js';
import { i as isNotThrowing } from './chunk-5697d061.js';
import { w as withDefaultOnError } from './chunk-f1b4cc24.js';
import { _ as _export_sfc } from './chunk-6003391e.js';
import './chunk-11f44f81.js';
import '@vueuse/core';
import 'pinia';

const ALGORITHM_DESCRIPTIONS = {
  HS256: "HMAC using SHA-256",
  HS384: "HMAC using SHA-384",
  HS512: "HMAC using SHA-512",
  RS256: "RSASSA-PKCS1-v1_5 using SHA-256",
  RS384: "RSASSA-PKCS1-v1_5 using SHA-384",
  RS512: "RSASSA-PKCS1-v1_5 using SHA-512",
  ES256: "ECDSA using P-256 and SHA-256",
  ES384: "ECDSA using P-384 and SHA-384",
  ES512: "ECDSA using P-521 and SHA-512",
  PS256: "RSASSA-PSS using SHA-256 and MGF1 with SHA-256",
  PS384: "RSASSA-PSS using SHA-384 and MGF1 with SHA-384",
  PS512: "RSASSA-PSS using SHA-512 and MGF1 with SHA-512",
  none: "No digital signature or MAC performed"
};
const CLAIM_DESCRIPTIONS = {
  typ: "Type",
  alg: "Algorithm",
  iss: "Issuer",
  sub: "Subject",
  aud: "Audience",
  exp: "Expiration Time",
  nbf: "Not Before",
  iat: "Issued At",
  jti: "JWT ID",
  name: "Full name",
  given_name: "Given name(s) or first name(s)",
  family_name: "Surname(s) or last name(s)",
  middle_name: "Middle name(s)",
  nickname: "Casual name",
  preferred_username: "Shorthand name by which the End-User wishes to be referred to",
  profile: "Profile page URL",
  picture: "Profile picture URL",
  website: "Web page or blog URL",
  email: "Preferred e-mail address",
  email_verified: "True if the e-mail address has been verified; otherwise false",
  gender: "Gender",
  birthdate: "Birthday",
  zoneinfo: "Time zone",
  locale: "Locale",
  phone_number: "Preferred telephone number",
  phone_number_verified: "True if the phone number has been verified; otherwise false",
  address: "Preferred postal address",
  updated_at: "Time the information was last updated",
  azp: "Authorized party - the party to which the ID Token was issued",
  nonce: "Value used to associate a Client session with an ID Token",
  auth_time: "Time when the authentication occurred",
  at_hash: "Access Token hash value",
  c_hash: "Code hash value",
  acr: "Authentication Context Class Reference",
  amr: "Authentication Methods References",
  sub_jwk: "Public key used to check the signature of an ID Token",
  cnf: "Confirmation",
  sip_from_tag: "SIP From tag header field parameter value",
  sip_date: "SIP Date header field value",
  sip_callid: "SIP Call-Id header field value",
  sip_cseq_num: "SIP CSeq numeric header field parameter value",
  sip_via_branch: "SIP Via branch header field parameter value",
  orig: "Originating Identity String",
  dest: "Destination Identity String",
  mky: "Media Key Fingerprint String",
  events: "Security Events",
  toe: "Time of Event",
  txn: "Transaction Identifier",
  rph: "Resource Priority Header Authorization",
  sid: "Session ID",
  vot: "Vector of Trust value",
  vtm: "Vector of Trust trustmark URL",
  attest: "Attestation level as defined in SHAKEN framework",
  origid: "Originating Identifier as defined in SHAKEN framework",
  act: "Actor",
  scope: "Scope Values",
  client_id: "Client Identifier",
  may_act: "Authorized Actor - the party that is authorized to become the actor",
  jcard: "jCard data",
  at_use_nbr: "Number of API requests for which the access token can be used",
  div: "Diverted Target of a Call",
  opt: "Original PASSporT (in Full Form)",
  vc: "Verifiable Credential as specified in the W3C Recommendation",
  vp: "Verifiable Presentation as specified in the W3C Recommendation",
  sph: "SIP Priority header field",
  ace_profile: "ACE profile a token is supposed to be used with.",
  cnonce: "Client nonce",
  exi: "Expires in",
  roles: "Roles",
  groups: "Groups",
  entitlements: "Entitlements",
  token_introspection: "Token introspection response"
};

function decodeJwt({ jwt }) {
  const rawHeader = jwtDecode(jwt, { header: true });
  const rawPayload = jwtDecode(jwt);
  const header = _.map(rawHeader, (value, claim) => parseClaims({ claim, value }));
  const payload = _.map(rawPayload, (value, claim) => parseClaims({ claim, value }));
  return {
    header,
    payload
  };
}
function parseClaims({ claim, value }) {
  const claimDescription = CLAIM_DESCRIPTIONS[claim];
  const formattedValue = _.isPlainObject(value) || _.isArray(value) ? JSON.stringify(value, null, 3) : _.toString(value);
  const friendlyValue = getFriendlyValue({ claim, value });
  return {
    value: formattedValue,
    friendlyValue,
    claim,
    claimDescription
  };
}
function getFriendlyValue({ claim, value }) {
  if (["exp", "nbf", "iat"].includes(claim)) {
    return dateFormatter(value);
  }
  if (claim === "alg" && _.isString(value)) {
    return ALGORITHM_DESCRIPTIONS[value];
  }
  return void 0;
}
function dateFormatter(value) {
  if (_.isNil(value)) {
    return void 0;
  }
  const date = new Date(Number(value) * 1e3);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
}

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "jwt-parser",
  __ssrInlineRender: true,
  setup(__props) {
    const rawJwt = ref(
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
    );
    const decodedJWT = computed(
      () => withDefaultOnError(() => decodeJwt({ jwt: rawJwt.value }), { header: [], payload: [] })
    );
    const sections = [
      { key: "header", title: "Header" },
      { key: "payload", title: "Payload" }
    ];
    const validation = useValidation({
      source: rawJwt,
      rules: [
        {
          validator: (value) => value.length > 0 && isNotThrowing(() => decodeJwt({ jwt: rawJwt.value })),
          message: "Invalid JWT"
        }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_c_card = __unplugin_components_1;
      const _component_c_input_text = __unplugin_components_3;
      const _component_n_table = NTable;
      _push(ssrRenderComponent(_component_c_card, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_c_input_text, {
              value: unref(rawJwt),
              "onUpdate:value": ($event) => isRef(rawJwt) ? rawJwt.value = $event : null,
              label: "JWT to decode",
              validation: unref(validation),
              placeholder: "Put your token here...",
              rows: "5",
              multiline: "",
              "raw-text": "",
              autofocus: "",
              "mb-3": ""
            }, null, _parent2, _scopeId));
            if (unref(validation).isValid) {
              _push2(ssrRenderComponent(_component_n_table, null, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<tbody data-v-a66f36d1${_scopeId2}><!--[-->`);
                    ssrRenderList(sections, (section) => {
                      _push3(`<!--[--><th colspan="2" class="table-header" data-v-a66f36d1${_scopeId2}>${ssrInterpolate(section.title)}</th><!--[-->`);
                      ssrRenderList(unref(decodedJWT)[section.key], ({ claim, claimDescription, friendlyValue, value }) => {
                        _push3(`<tr data-v-a66f36d1${_scopeId2}><td class="claims" data-v-a66f36d1${_scopeId2}><span font-bold data-v-a66f36d1${_scopeId2}>${ssrInterpolate(claim)}</span>`);
                        if (claimDescription) {
                          _push3(`<span ml-2 op-70 data-v-a66f36d1${_scopeId2}> (${ssrInterpolate(claimDescription)}) </span>`);
                        } else {
                          _push3(`<!---->`);
                        }
                        _push3(`</td><td data-v-a66f36d1${_scopeId2}><span data-v-a66f36d1${_scopeId2}>${ssrInterpolate(value)}</span>`);
                        if (friendlyValue) {
                          _push3(`<span ml-2 op-70 data-v-a66f36d1${_scopeId2}> (${ssrInterpolate(friendlyValue)}) </span>`);
                        } else {
                          _push3(`<!---->`);
                        }
                        _push3(`</td></tr>`);
                      });
                      _push3(`<!--]--><!--]-->`);
                    });
                    _push3(`<!--]--></tbody>`);
                  } else {
                    return [
                      createVNode("tbody", null, [
                        (openBlock(), createBlock(Fragment, null, renderList(sections, (section) => {
                          return openBlock(), createBlock(Fragment, {
                            key: section.key
                          }, [
                            createVNode("th", {
                              colspan: "2",
                              class: "table-header"
                            }, toDisplayString(section.title), 1),
                            (openBlock(true), createBlock(Fragment, null, renderList(unref(decodedJWT)[section.key], ({ claim, claimDescription, friendlyValue, value }) => {
                              return openBlock(), createBlock("tr", {
                                key: claim + value
                              }, [
                                createVNode("td", { class: "claims" }, [
                                  createVNode("span", { "font-bold": "" }, toDisplayString(claim), 1),
                                  claimDescription ? (openBlock(), createBlock("span", {
                                    key: 0,
                                    "ml-2": "",
                                    "op-70": ""
                                  }, " (" + toDisplayString(claimDescription) + ") ", 1)) : createCommentVNode("", true)
                                ]),
                                createVNode("td", null, [
                                  createVNode("span", null, toDisplayString(value), 1),
                                  friendlyValue ? (openBlock(), createBlock("span", {
                                    key: 0,
                                    "ml-2": "",
                                    "op-70": ""
                                  }, " (" + toDisplayString(friendlyValue) + ") ", 1)) : createCommentVNode("", true)
                                ])
                              ]);
                            }), 128))
                          ], 64);
                        }), 64))
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode(_component_c_input_text, {
                value: unref(rawJwt),
                "onUpdate:value": ($event) => isRef(rawJwt) ? rawJwt.value = $event : null,
                label: "JWT to decode",
                validation: unref(validation),
                placeholder: "Put your token here...",
                rows: "5",
                multiline: "",
                "raw-text": "",
                autofocus: "",
                "mb-3": ""
              }, null, 8, ["value", "onUpdate:value", "validation"]),
              unref(validation).isValid ? (openBlock(), createBlock(_component_n_table, { key: 0 }, {
                default: withCtx(() => [
                  createVNode("tbody", null, [
                    (openBlock(), createBlock(Fragment, null, renderList(sections, (section) => {
                      return openBlock(), createBlock(Fragment, {
                        key: section.key
                      }, [
                        createVNode("th", {
                          colspan: "2",
                          class: "table-header"
                        }, toDisplayString(section.title), 1),
                        (openBlock(true), createBlock(Fragment, null, renderList(unref(decodedJWT)[section.key], ({ claim, claimDescription, friendlyValue, value }) => {
                          return openBlock(), createBlock("tr", {
                            key: claim + value
                          }, [
                            createVNode("td", { class: "claims" }, [
                              createVNode("span", { "font-bold": "" }, toDisplayString(claim), 1),
                              claimDescription ? (openBlock(), createBlock("span", {
                                key: 0,
                                "ml-2": "",
                                "op-70": ""
                              }, " (" + toDisplayString(claimDescription) + ") ", 1)) : createCommentVNode("", true)
                            ]),
                            createVNode("td", null, [
                              createVNode("span", null, toDisplayString(value), 1),
                              friendlyValue ? (openBlock(), createBlock("span", {
                                key: 0,
                                "ml-2": "",
                                "op-70": ""
                              }, " (" + toDisplayString(friendlyValue) + ") ", 1)) : createCommentVNode("", true)
                            ])
                          ]);
                        }), 128))
                      ], 64);
                    }), 64))
                  ])
                ]),
                _: 1
              })) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});

/* unplugin-vue-components disabled */const jwtParser_vue_vue_type_style_index_0_scoped_a66f36d1_lang = '';

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/tools/jwt-parser/jwt-parser.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const jwtParser = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-a66f36d1"]]);

export { jwtParser as default };
