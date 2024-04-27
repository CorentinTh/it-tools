import { a as __unplugin_components_0 } from './chunk-6003391e.js';
import { _ as __unplugin_components_3 } from './chunk-4e7a6a8d.js';
import { NFormItem, NSlider, NSwitch } from 'naive-ui';
import { a as __unplugin_components_1 } from './chunk-8109fd17.js';
import { defineComponent, ref, computed, withCtx, unref, isRef, createVNode, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import { r as randFromArray, a as randIntFromInterval } from './chunk-11f44f81.js';
import { u as useCopy } from './chunk-77c5cc16.js';
import '@vueuse/core';
import 'pinia';
import './chunk-35c3d701.js';
import 'lodash';

const vocabulary = [
  "a",
  "ac",
  "accumsan",
  "ad",
  "adipiscing",
  "aenean",
  "aliquam",
  "aliquet",
  "amet",
  "ante",
  "aptent",
  "arcu",
  "at",
  "auctor",
  "bibendum",
  "blandit",
  "class",
  "commodo",
  "condimentum",
  "congue",
  "consectetur",
  "consequat",
  "conubia",
  "convallis",
  "cras",
  "cubilia",
  "cum",
  "curabitur",
  "curae",
  "dapibus",
  "diam",
  "dictum",
  "dictumst",
  "dignissim",
  "dolor",
  "donec",
  "dui",
  "duis",
  "egestas",
  "eget",
  "eleifend",
  "elementum",
  "elit",
  "enim",
  "erat",
  "eros",
  "est",
  "et",
  "etiam",
  "eu",
  "euismod",
  "facilisi",
  "faucibus",
  "felis",
  "fermentum",
  "feugiat",
  "fringilla",
  "fusce",
  "gravida",
  "habitant",
  "habitasse",
  "hac",
  "hendrerit",
  "himenaeos",
  "iaculis",
  "id",
  "imperdiet",
  "in",
  "inceptos",
  "integer",
  "interdum",
  "ipsum",
  "justo",
  "lacinia",
  "lacus",
  "laoreet",
  "lectus",
  "leo",
  "ligula",
  "litora",
  "lobortis",
  "lorem",
  "luctus",
  "maecenas",
  "magna",
  "magnis",
  "malesuada",
  "massa",
  "mattis",
  "mauris",
  "metus",
  "mi",
  "molestie",
  "mollis",
  "montes",
  "morbi",
  "mus",
  "nam",
  "nascetur",
  "natoque",
  "nec",
  "neque",
  "netus",
  "nisi",
  "nisl",
  "non",
  "nostra",
  "nulla",
  "nullam",
  "nunc",
  "odio",
  "orci",
  "ornare",
  "parturient",
  "pellentesque",
  "penatibus",
  "per",
  "pharetra",
  "phasellus",
  "placerat",
  "platea",
  "porta",
  "porttitor",
  "posuere",
  "potenti",
  "praesent",
  "pretium",
  "primis",
  "proin",
  "pulvinar",
  "purus",
  "quam",
  "quis",
  "quisque",
  "rhoncus",
  "ridiculus",
  "risus",
  "rutrum",
  "sagittis",
  "sapien",
  "scelerisque",
  "sed",
  "sem",
  "semper",
  "senectus",
  "sit",
  "sociis",
  "sociosqu",
  "sodales",
  "sollicitudin",
  "suscipit",
  "suspendisse",
  "taciti",
  "tellus",
  "tempor",
  "tempus",
  "tincidunt",
  "torquent",
  "tortor",
  "turpis",
  "ullamcorper",
  "ultrices",
  "ultricies",
  "urna",
  "varius",
  "vehicula",
  "vel",
  "velit",
  "venenatis",
  "vestibulum",
  "vitae",
  "vivamus",
  "viverra",
  "volutpat",
  "vulputate"
];
const firstSentence = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
function generateSentence(length) {
  const sentence = Array.from({ length }).map(() => randFromArray(vocabulary)).join(" ");
  return `${sentence.charAt(0).toUpperCase() + sentence.slice(1)}.`;
}
function generateLoremIpsum({
  paragraphCount = 1,
  sentencePerParagraph = 3,
  wordCount = 10,
  startWithLoremIpsum = true,
  asHTML = false
}) {
  const paragraphs = Array.from({ length: paragraphCount }).map(
    () => Array.from({ length: sentencePerParagraph }).map(() => generateSentence(wordCount))
  );
  if (startWithLoremIpsum) {
    paragraphs[0][0] = firstSentence;
  }
  if (asHTML) {
    return `<p>${paragraphs.map((s) => s.join(" ")).join("</p>\n\n<p>")}</p>`;
  }
  return paragraphs.map((s) => s.join(" ")).join("\n\n");
}

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "lorem-ipsum-generator",
  __ssrInlineRender: true,
  setup(__props) {
    const paragraphs = ref(1);
    const sentences = ref([3, 8]);
    const words = ref([8, 15]);
    const startWithLoremIpsum = ref(true);
    const asHTML = ref(false);
    const loremIpsumText = computed(
      () => generateLoremIpsum({
        paragraphCount: paragraphs.value,
        asHTML: asHTML.value,
        sentencePerParagraph: randIntFromInterval(sentences.value[0], sentences.value[1]),
        wordCount: randIntFromInterval(words.value[0], words.value[1]),
        startWithLoremIpsum: startWithLoremIpsum.value
      })
    );
    const { copy } = useCopy({ source: loremIpsumText, text: "Lorem ipsum copied to the clipboard" });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_c_card = __unplugin_components_1;
      const _component_n_form_item = NFormItem;
      const _component_n_slider = NSlider;
      const _component_n_switch = NSwitch;
      const _component_c_input_text = __unplugin_components_3;
      const _component_c_button = __unplugin_components_0;
      _push(ssrRenderComponent(_component_c_card, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_n_form_item, {
              label: "Paragraphs",
              "show-feedback": false,
              "label-width": "200",
              "label-placement": "left"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_n_slider, {
                    value: unref(paragraphs),
                    "onUpdate:value": ($event) => isRef(paragraphs) ? paragraphs.value = $event : null,
                    step: 1,
                    min: 1,
                    max: 20
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_n_slider, {
                      value: unref(paragraphs),
                      "onUpdate:value": ($event) => isRef(paragraphs) ? paragraphs.value = $event : null,
                      step: 1,
                      min: 1,
                      max: 20
                    }, null, 8, ["value", "onUpdate:value"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_n_form_item, {
              label: "Sentences per paragraph",
              "show-feedback": false,
              "label-width": "200",
              "label-placement": "left"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_n_slider, {
                    value: unref(sentences),
                    "onUpdate:value": ($event) => isRef(sentences) ? sentences.value = $event : null,
                    range: "",
                    step: 1,
                    min: 1,
                    max: 50
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_n_slider, {
                      value: unref(sentences),
                      "onUpdate:value": ($event) => isRef(sentences) ? sentences.value = $event : null,
                      range: "",
                      step: 1,
                      min: 1,
                      max: 50
                    }, null, 8, ["value", "onUpdate:value"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_n_form_item, {
              label: "Words per sentence",
              "show-feedback": false,
              "label-width": "200",
              "label-placement": "left"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_n_slider, {
                    value: unref(words),
                    "onUpdate:value": ($event) => isRef(words) ? words.value = $event : null,
                    range: "",
                    step: 1,
                    min: 1,
                    max: 50
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_n_slider, {
                      value: unref(words),
                      "onUpdate:value": ($event) => isRef(words) ? words.value = $event : null,
                      range: "",
                      step: 1,
                      min: 1,
                      max: 50
                    }, null, 8, ["value", "onUpdate:value"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_n_form_item, {
              label: "Start with lorem ipsum ?",
              "show-feedback": false,
              "label-width": "200",
              "label-placement": "left"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_n_switch, {
                    value: unref(startWithLoremIpsum),
                    "onUpdate:value": ($event) => isRef(startWithLoremIpsum) ? startWithLoremIpsum.value = $event : null
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_n_switch, {
                      value: unref(startWithLoremIpsum),
                      "onUpdate:value": ($event) => isRef(startWithLoremIpsum) ? startWithLoremIpsum.value = $event : null
                    }, null, 8, ["value", "onUpdate:value"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_n_form_item, {
              label: "As html ?",
              "show-feedback": false,
              "label-width": "200",
              "label-placement": "left"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_n_switch, {
                    value: unref(asHTML),
                    "onUpdate:value": ($event) => isRef(asHTML) ? asHTML.value = $event : null
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_n_switch, {
                      value: unref(asHTML),
                      "onUpdate:value": ($event) => isRef(asHTML) ? asHTML.value = $event : null
                    }, null, 8, ["value", "onUpdate:value"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_c_input_text, {
              value: unref(loremIpsumText),
              multiline: "",
              placeholder: "Your lorem ipsum...",
              readonly: "",
              "mt-5": "",
              rows: "5"
            }, null, _parent2, _scopeId));
            _push2(`<div mt-5 flex justify-center${_scopeId}>`);
            _push2(ssrRenderComponent(_component_c_button, {
              autofocus: "",
              onClick: ($event) => unref(copy)()
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Copy `);
                } else {
                  return [
                    createTextVNode(" Copy ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode(_component_n_form_item, {
                label: "Paragraphs",
                "show-feedback": false,
                "label-width": "200",
                "label-placement": "left"
              }, {
                default: withCtx(() => [
                  createVNode(_component_n_slider, {
                    value: unref(paragraphs),
                    "onUpdate:value": ($event) => isRef(paragraphs) ? paragraphs.value = $event : null,
                    step: 1,
                    min: 1,
                    max: 20
                  }, null, 8, ["value", "onUpdate:value"])
                ]),
                _: 1
              }),
              createVNode(_component_n_form_item, {
                label: "Sentences per paragraph",
                "show-feedback": false,
                "label-width": "200",
                "label-placement": "left"
              }, {
                default: withCtx(() => [
                  createVNode(_component_n_slider, {
                    value: unref(sentences),
                    "onUpdate:value": ($event) => isRef(sentences) ? sentences.value = $event : null,
                    range: "",
                    step: 1,
                    min: 1,
                    max: 50
                  }, null, 8, ["value", "onUpdate:value"])
                ]),
                _: 1
              }),
              createVNode(_component_n_form_item, {
                label: "Words per sentence",
                "show-feedback": false,
                "label-width": "200",
                "label-placement": "left"
              }, {
                default: withCtx(() => [
                  createVNode(_component_n_slider, {
                    value: unref(words),
                    "onUpdate:value": ($event) => isRef(words) ? words.value = $event : null,
                    range: "",
                    step: 1,
                    min: 1,
                    max: 50
                  }, null, 8, ["value", "onUpdate:value"])
                ]),
                _: 1
              }),
              createVNode(_component_n_form_item, {
                label: "Start with lorem ipsum ?",
                "show-feedback": false,
                "label-width": "200",
                "label-placement": "left"
              }, {
                default: withCtx(() => [
                  createVNode(_component_n_switch, {
                    value: unref(startWithLoremIpsum),
                    "onUpdate:value": ($event) => isRef(startWithLoremIpsum) ? startWithLoremIpsum.value = $event : null
                  }, null, 8, ["value", "onUpdate:value"])
                ]),
                _: 1
              }),
              createVNode(_component_n_form_item, {
                label: "As html ?",
                "show-feedback": false,
                "label-width": "200",
                "label-placement": "left"
              }, {
                default: withCtx(() => [
                  createVNode(_component_n_switch, {
                    value: unref(asHTML),
                    "onUpdate:value": ($event) => isRef(asHTML) ? asHTML.value = $event : null
                  }, null, 8, ["value", "onUpdate:value"])
                ]),
                _: 1
              }),
              createVNode(_component_c_input_text, {
                value: unref(loremIpsumText),
                multiline: "",
                placeholder: "Your lorem ipsum...",
                readonly: "",
                "mt-5": "",
                rows: "5"
              }, null, 8, ["value"]),
              createVNode("div", {
                "mt-5": "",
                flex: "",
                "justify-center": ""
              }, [
                createVNode(_component_c_button, {
                  autofocus: "",
                  onClick: ($event) => unref(copy)()
                }, {
                  default: withCtx(() => [
                    createTextVNode(" Copy ")
                  ]),
                  _: 1
                }, 8, ["onClick"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/tools/lorem-ipsum-generator/lorem-ipsum-generator.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
