import { _ as __unplugin_components_3$1 } from './chunk-28375bc9.js';
import { NDivider, NGrid, NGi, NFormItem, NInputNumber, NSpin } from 'naive-ui';
import { _ as __unplugin_components_0 } from './chunk-89a4876c.js';
import { _ as __unplugin_components_3 } from './chunk-4e7a6a8d.js';
import { a as __unplugin_components_1 } from './chunk-8109fd17.js';
import { defineComponent, ref, watchEffect, mergeProps, withCtx, unref, isRef, createVNode, createTextVNode, openBlock, createBlock, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import figlet from 'figlet';
import { T as TextareaCopyable } from './chunk-727cc0fb.js';
import { useStorage } from '@vueuse/core';
import './chunk-6003391e.js';
import 'pinia';
import './chunk-bb5bb4f6.js';
import './chunk-2ce6ed5e.js';
import 'fuse.js';
import './chunk-11f44f81.js';
import './chunk-35c3d701.js';
import 'lodash';
import '@vicons/tabler';
import 'highlight.js/lib/core';
import 'highlight.js/lib/languages/json';
import 'highlight.js/lib/languages/sql';
import 'highlight.js/lib/languages/xml';
import 'highlight.js/lib/languages/yaml';
import 'highlight.js/lib/languages/ini';
import './chunk-77c5cc16.js';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ascii-text-drawer",
  __ssrInlineRender: true,
  setup(__props) {
    const input = ref("Ascii ART");
    const font = useStorage("ascii-text-drawer:font", "Standard");
    const width = useStorage("ascii-text-drawer:width", 80);
    const output = ref("");
    const errored = ref(false);
    const processing = ref(false);
    figlet.defaults({ fontPath: "//unpkg.com/figlet@1.6.0/fonts/" });
    watchEffect(async () => {
      processing.value = true;
      try {
        const options = {
          font: font.value,
          width: width.value,
          whitespaceBreak: true
        };
        output.value = await new Promise((resolve, reject) => figlet.text(
          input.value,
          options,
          (err, text) => {
            if (err) {
              reject(err);
              return;
            }
            resolve(text ?? "");
          }
        ));
        errored.value = false;
      } catch (e) {
        errored.value = true;
      }
      processing.value = false;
    });
    const fonts = ["1Row", "3-D", "3D Diagonal", "3D-ASCII", "3x5", "4Max", "5 Line Oblique", "AMC 3 Line", "AMC 3 Liv1", "AMC AAA01", "AMC Neko", "AMC Razor", "AMC Razor2", "AMC Slash", "AMC Slider", "AMC Thin", "AMC Tubes", "AMC Untitled", "ANSI Shadow", "ASCII New Roman", "Acrobatic", "Alligator", "Alligator2", "Alpha", "Alphabet", "Arrows", "Avatar", "B1FF", "B1FF", "Banner", "Banner3-D", "Banner3", "Banner4", "Barbwire", "Basic", "Bear", "Bell", "Benjamin", "Big Chief", "Big Money-ne", "Big Money-nw", "Big Money-se", "Big Money-sw", "Big", "Bigfig", "Binary", "Block", "Blocks", "Bloody", "Bolger", "Braced", "Bright", "Broadway KB", "Broadway", "Bubble", "Bulbhead", "Caligraphy", "Caligraphy2", "Calvin S", "Cards", "Catwalk", "Chiseled", "Chunky", "Coinstak", "Cola", "Colossal", "Computer", "Contessa", "Contrast", "Cosmike", "Crawford", "Crawford2", "Crazy", "Cricket", "Cursive", "Cyberlarge", "Cybermedium", "Cybersmall", "Cygnet", "DANC4", "DOS Rebel", "DWhistled", "Dancing Font", "Decimal", "Def Leppard", "Delta Corps Priest 1", "Diamond", "Diet Cola", "Digital", "Doh", "Doom", "Dot Matrix", "Double Shorts", "Double", "Dr Pepper", "Efti Chess", "Efti Font", "Efti Italic", "Efti Piti", "Efti Robot", "Efti Wall", "Efti Water", "Electronic", "Elite", "Epic", "Fender", "Filter", "Fire Font-k", "Fire Font-s", "Flipped", "Flower Power", "Four Tops", "Fraktur", "Fun Face", "Fun Faces", "Fuzzy", "Georgi16", "Georgia11", "Ghost", "Ghoulish", "Glenyn", "Goofy", "Gothic", "Graceful", "Gradient", "Graffiti", "Greek", "Heart Left", "Heart Right", "Henry 3D", "Hex", "Hieroglyphs", "Hollywood", "Horizontal Left", "Horizontal Right", "ICL-1900", "Impossible", "Invita", "Isometric1", "Isometric2", "Isometric3", "Isometric4", "Italic", "Ivrit", "JS Block Letters", "JS Bracket Letters", "JS Capital Curves", "JS Cursive", "JS Stick Letters", "Jacky", "Jazmine", "Jerusalem", "Katakana", "Kban", "Keyboard", "Knob", "Konto Slant", "Konto", "LCD", "Larry 3D 2", "Larry 3D", "Lean", "Letters", "Lil Devil", "Line Blocks", "Linux", "Lockergnome", "Madrid", "Marquee", "Maxfour", "Merlin1", "Merlin2", "Mike", "Mini", "Mirror", "Mnemonic", "Modular", "Morse", "Morse2", "Moscow", "Mshebrew210", "Muzzle", "NScript", "NT Greek", "NV Script", "Nancyj-Fancy", "Nancyj-Improved", "Nancyj-Underlined", "Nancyj", "Nipples", "O8", "OS2", "Octal", "Ogre", "Old Banner", "Patorjk's Cheese", "Patorjk-HeX", "Pawp", "Peaks Slant", "Peaks", "Pebbles", "Pepper", "Poison", "Puffy", "Puzzle", "Pyramid", "Rammstein", "Rectangles", "Red Phoenix", "Relief", "Relief2", "Reverse", "Roman", "Rot13", "Rot13", "Rotated", "Rounded", "Rowan Cap", "Rozzo", "Runic", "Runyc", "S Blood", "SL Script", "Santa Clara", "Script", "Serifcap", "Shadow", "Shimrod", "Short", "Slant Relief", "Slant", "Slide", "Small Caps", "Small Isometric1", "Small Keyboard", "Small Poison", "Small Script", "Small Shadow", "Small Slant", "Small Tengwar", "Small", "Soft", "Speed", "Spliff", "Stacey", "Stampate", "Stampatello", "Standard", "Star Strips", "Star Wars", "Stellar", "Stforek", "Stick Letters", "Stop", "Straight", "Stronger Than All", "Sub-Zero", "Swamp Land", "Swan", "Sweet", "THIS", "Tanja", "Tengwar", "Term", "Test1", "The Edge", "Thick", "Thin", "Thorned", "Three Point", "Ticks Slant", "Ticks", "Tiles", "Tinker-Toy", "Tombstone", "Train", "Trek", "Tsalagi", "Tubular", "Twisted", "Two Point", "USA Flag", "Univers", "Varsity", "Wavy", "Weird", "Wet Letter", "Whimsy", "Wow"];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_c_card = __unplugin_components_1;
      const _component_c_input_text = __unplugin_components_3;
      const _component_n_divider = NDivider;
      const _component_n_grid = NGrid;
      const _component_n_gi = NGi;
      const _component_c_select = __unplugin_components_0;
      const _component_n_form_item = NFormItem;
      const _component_n_input_number = NInputNumber;
      const _component_n_spin = NSpin;
      const _component_c_alert = __unplugin_components_3$1;
      _push(ssrRenderComponent(_component_c_card, mergeProps({ style: { "max-width": "600px" } }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_c_input_text, {
              value: unref(input),
              "onUpdate:value": ($event) => isRef(input) ? input.value = $event : null,
              label: "Your text:",
              placeholder: "Your text to draw",
              "raw-text": "",
              multiline: "",
              rows: "4"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_n_divider, null, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_n_grid, {
              cols: "4",
              "x-gap": "12",
              "w-full": ""
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_n_gi, { span: "2" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_c_select, {
                          value: unref(font),
                          "onUpdate:value": ($event) => isRef(font) ? font.value = $event : null,
                          "label-position": "top",
                          label: "Font:",
                          options: fonts,
                          searchable: "true",
                          placeholder: "Select font to use"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_c_select, {
                            value: unref(font),
                            "onUpdate:value": ($event) => isRef(font) ? font.value = $event : null,
                            "label-position": "top",
                            label: "Font:",
                            options: fonts,
                            searchable: "true",
                            placeholder: "Select font to use"
                          }, null, 8, ["value", "onUpdate:value"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_n_gi, { span: "2" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_n_form_item, {
                          label: "Width:",
                          "label-placement": "top",
                          "label-width": "100",
                          "show-feedback": false
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_n_input_number, {
                                value: unref(width),
                                "onUpdate:value": ($event) => isRef(width) ? width.value = $event : null,
                                min: "0",
                                max: "10000",
                                "w-full": "",
                                placeholder: "Width of the text"
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_n_input_number, {
                                  value: unref(width),
                                  "onUpdate:value": ($event) => isRef(width) ? width.value = $event : null,
                                  min: "0",
                                  max: "10000",
                                  "w-full": "",
                                  placeholder: "Width of the text"
                                }, null, 8, ["value", "onUpdate:value"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_n_form_item, {
                            label: "Width:",
                            "label-placement": "top",
                            "label-width": "100",
                            "show-feedback": false
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_n_input_number, {
                                value: unref(width),
                                "onUpdate:value": ($event) => isRef(width) ? width.value = $event : null,
                                min: "0",
                                max: "10000",
                                "w-full": "",
                                placeholder: "Width of the text"
                              }, null, 8, ["value", "onUpdate:value"])
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_n_gi, { span: "2" }, {
                      default: withCtx(() => [
                        createVNode(_component_c_select, {
                          value: unref(font),
                          "onUpdate:value": ($event) => isRef(font) ? font.value = $event : null,
                          "label-position": "top",
                          label: "Font:",
                          options: fonts,
                          searchable: "true",
                          placeholder: "Select font to use"
                        }, null, 8, ["value", "onUpdate:value"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_n_gi, { span: "2" }, {
                      default: withCtx(() => [
                        createVNode(_component_n_form_item, {
                          label: "Width:",
                          "label-placement": "top",
                          "label-width": "100",
                          "show-feedback": false
                        }, {
                          default: withCtx(() => [
                            createVNode(_component_n_input_number, {
                              value: unref(width),
                              "onUpdate:value": ($event) => isRef(width) ? width.value = $event : null,
                              min: "0",
                              max: "10000",
                              "w-full": "",
                              placeholder: "Width of the text"
                            }, null, 8, ["value", "onUpdate:value"])
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_n_divider, null, null, _parent2, _scopeId));
            if (unref(processing)) {
              _push2(`<div flex items-center justify-center${_scopeId}>`);
              _push2(ssrRenderComponent(_component_n_spin, { size: "medium" }, null, _parent2, _scopeId));
              _push2(`<span class="ml-2"${_scopeId}>Loading font...</span></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (unref(errored)) {
              _push2(ssrRenderComponent(_component_c_alert, {
                "mt-1": "",
                "text-center": "",
                type: "error"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Current settings resulted in error. `);
                  } else {
                    return [
                      createTextVNode(" Current settings resulted in error. ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            if (!unref(processing) && !unref(errored)) {
              _push2(ssrRenderComponent(_component_n_form_item, { label: "Ascii Art text:" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(TextareaCopyable, {
                      value: unref(output),
                      "mb-1": "",
                      "mt-1": "",
                      "copy-placement": "outside"
                    }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(TextareaCopyable, {
                        value: unref(output),
                        "mb-1": "",
                        "mt-1": "",
                        "copy-placement": "outside"
                      }, null, 8, ["value"])
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
                value: unref(input),
                "onUpdate:value": ($event) => isRef(input) ? input.value = $event : null,
                label: "Your text:",
                placeholder: "Your text to draw",
                "raw-text": "",
                multiline: "",
                rows: "4"
              }, null, 8, ["value", "onUpdate:value"]),
              createVNode(_component_n_divider),
              createVNode(_component_n_grid, {
                cols: "4",
                "x-gap": "12",
                "w-full": ""
              }, {
                default: withCtx(() => [
                  createVNode(_component_n_gi, { span: "2" }, {
                    default: withCtx(() => [
                      createVNode(_component_c_select, {
                        value: unref(font),
                        "onUpdate:value": ($event) => isRef(font) ? font.value = $event : null,
                        "label-position": "top",
                        label: "Font:",
                        options: fonts,
                        searchable: "true",
                        placeholder: "Select font to use"
                      }, null, 8, ["value", "onUpdate:value"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_n_gi, { span: "2" }, {
                    default: withCtx(() => [
                      createVNode(_component_n_form_item, {
                        label: "Width:",
                        "label-placement": "top",
                        "label-width": "100",
                        "show-feedback": false
                      }, {
                        default: withCtx(() => [
                          createVNode(_component_n_input_number, {
                            value: unref(width),
                            "onUpdate:value": ($event) => isRef(width) ? width.value = $event : null,
                            min: "0",
                            max: "10000",
                            "w-full": "",
                            placeholder: "Width of the text"
                          }, null, 8, ["value", "onUpdate:value"])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(_component_n_divider),
              unref(processing) ? (openBlock(), createBlock("div", {
                key: 0,
                flex: "",
                "items-center": "",
                "justify-center": ""
              }, [
                createVNode(_component_n_spin, { size: "medium" }),
                createVNode("span", { class: "ml-2" }, "Loading font...")
              ])) : createCommentVNode("", true),
              unref(errored) ? (openBlock(), createBlock(_component_c_alert, {
                key: 1,
                "mt-1": "",
                "text-center": "",
                type: "error"
              }, {
                default: withCtx(() => [
                  createTextVNode(" Current settings resulted in error. ")
                ]),
                _: 1
              })) : createCommentVNode("", true),
              !unref(processing) && !unref(errored) ? (openBlock(), createBlock(_component_n_form_item, {
                key: 2,
                label: "Ascii Art text:"
              }, {
                default: withCtx(() => [
                  createVNode(TextareaCopyable, {
                    value: unref(output),
                    "mb-1": "",
                    "mt-1": "",
                    "copy-placement": "outside"
                  }, null, 8, ["value"])
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

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/tools/ascii-text-drawer/ascii-text-drawer.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
