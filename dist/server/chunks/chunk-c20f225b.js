import { a as __unplugin_components_1 } from './chunk-8109fd17.js';
import { defineComponent, toRefs, mergeProps, withCtx, unref, createVNode, toDisplayString, useSSRContext, ref, isRef } from 'vue';
import { ssrRenderComponent, ssrInterpolate, ssrRenderAttrs, ssrRenderList } from 'vue/server-renderer';
import { u as useCopy } from './chunk-77c5cc16.js';
import { _ as __unplugin_components_1$1 } from './chunk-8daff870.js';
import { _ as __unplugin_components_3 } from './chunk-4e7a6a8d.js';
import _ from 'lodash';
import { u as useFuzzySearch } from './chunk-2ce6ed5e.js';
import './chunk-6003391e.js';
import '@vueuse/core';
import 'pinia';
import 'naive-ui';
import './chunk-11f44f81.js';
import './chunk-35c3d701.js';
import 'fuse.js';

const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "emoji-card",
  __ssrInlineRender: true,
  props: {
    emojiInfo: {}
  },
  setup(__props) {
    const props = __props;
    const { emojiInfo } = toRefs(props);
    const { copy } = useCopy();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_c_card = __unplugin_components_1;
      _push(ssrRenderComponent(_component_c_card, mergeProps({
        flex: "",
        "items-center": "",
        "gap-3": "",
        "important:py-8px": "",
        "important:pl-10px": "",
        "important:pr-5px": ""
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div cursor-pointer text-30px${_scopeId}>${ssrInterpolate(unref(emojiInfo).emoji)}</div><div min-w-0 flex-1${_scopeId}><div truncate font-bold${_scopeId}>${ssrInterpolate(unref(emojiInfo).title)}</div><div flex gap-2 text-xs font-mono op-70${_scopeId}><span cursor-pointer transition hover:text-primary${_scopeId}>${ssrInterpolate(unref(emojiInfo).codePoints)}</span><span cursor-pointer truncate transition hover:text-primary${_scopeId}>${ssrInterpolate(unref(emojiInfo).unicode)}</span></div></div>`);
          } else {
            return [
              createVNode("div", {
                "cursor-pointer": "",
                "text-30px": "",
                onClick: ($event) => unref(copy)(unref(emojiInfo).emoji, { notificationMessage: `Emoji ${unref(emojiInfo).emoji} copied to the clipboard` })
              }, toDisplayString(unref(emojiInfo).emoji), 9, ["onClick"]),
              createVNode("div", {
                "min-w-0": "",
                "flex-1": ""
              }, [
                createVNode("div", {
                  truncate: "",
                  "font-bold": ""
                }, toDisplayString(unref(emojiInfo).title), 1),
                createVNode("div", {
                  flex: "",
                  "gap-2": "",
                  "text-xs": "",
                  "font-mono": "",
                  "op-70": ""
                }, [
                  createVNode("span", {
                    "cursor-pointer": "",
                    transition: "",
                    "hover:text-primary": "",
                    onClick: ($event) => unref(copy)(unref(emojiInfo).codePoints, { notificationMessage: `Code points '${unref(emojiInfo).codePoints}' copied to the clipboard` })
                  }, toDisplayString(unref(emojiInfo).codePoints), 9, ["onClick"]),
                  createVNode("span", {
                    "cursor-pointer": "",
                    truncate: "",
                    transition: "",
                    "hover:text-primary": "",
                    onClick: ($event) => unref(copy)(unref(emojiInfo).unicode, { notificationMessage: `Unicode '${unref(emojiInfo).unicode}' copied to the clipboard` })
                  }, toDisplayString(unref(emojiInfo).unicode), 9, ["onClick"])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});

const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/tools/emoji-picker/emoji-card.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "emoji-grid",
  __ssrInlineRender: true,
  props: {
    emojiInfos: { default: () => [] }
  },
  setup(__props) {
    const props = __props;
    const { emojiInfos } = toRefs(props);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_emoji_card = _sfc_main$2;
      _push(`<div${ssrRenderAttrs(mergeProps({
        grid: "",
        "grid-cols-1": "",
        "gap-2": "",
        "lg:grid-cols-4": "",
        "md:grid-cols-3": "",
        "sm:grid-cols-2": "",
        "xl:grid-cols-6": ""
      }, _attrs))}><!--[-->`);
      ssrRenderList(unref(emojiInfos), (emojiInfo) => {
        _push(ssrRenderComponent(_component_emoji_card, {
          key: emojiInfo.name,
          "emoji-info": emojiInfo,
          flex: "",
          "items-center": "",
          "gap-3": ""
        }, null, _parent));
      });
      _push(`<!--]--></div>`);
    };
  }
});

const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/tools/emoji-picker/emoji-grid.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};

const emojiUnicodeData = {
	"😀": {
	name: "grinning face",
	slug: "grinning_face",
	group: "Smileys & Emotion",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"😃": {
	name: "grinning face with big eyes",
	slug: "grinning_face_with_big_eyes",
	group: "Smileys & Emotion",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"😄": {
	name: "grinning face with smiling eyes",
	slug: "grinning_face_with_smiling_eyes",
	group: "Smileys & Emotion",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"😁": {
	name: "beaming face with smiling eyes",
	slug: "beaming_face_with_smiling_eyes",
	group: "Smileys & Emotion",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"😆": {
	name: "grinning squinting face",
	slug: "grinning_squinting_face",
	group: "Smileys & Emotion",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"😅": {
	name: "grinning face with sweat",
	slug: "grinning_face_with_sweat",
	group: "Smileys & Emotion",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🤣": {
	name: "rolling on the floor laughing",
	slug: "rolling_on_the_floor_laughing",
	group: "Smileys & Emotion",
	emoji_version: "3.0",
	unicode_version: "3.0",
	skin_tone_support: false
},
	"😂": {
	name: "face with tears of joy",
	slug: "face_with_tears_of_joy",
	group: "Smileys & Emotion",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🙂": {
	name: "slightly smiling face",
	slug: "slightly_smiling_face",
	group: "Smileys & Emotion",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🙃": {
	name: "upside-down face",
	slug: "upside_down_face",
	group: "Smileys & Emotion",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🫠": {
	name: "melting face",
	slug: "melting_face",
	group: "Smileys & Emotion",
	emoji_version: "14.0",
	unicode_version: "14.0",
	skin_tone_support: false
},
	"😉": {
	name: "winking face",
	slug: "winking_face",
	group: "Smileys & Emotion",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"😊": {
	name: "smiling face with smiling eyes",
	slug: "smiling_face_with_smiling_eyes",
	group: "Smileys & Emotion",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"😇": {
	name: "smiling face with halo",
	slug: "smiling_face_with_halo",
	group: "Smileys & Emotion",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🥰": {
	name: "smiling face with hearts",
	slug: "smiling_face_with_hearts",
	group: "Smileys & Emotion",
	emoji_version: "11.0",
	unicode_version: "11.0",
	skin_tone_support: false
},
	"😍": {
	name: "smiling face with heart-eyes",
	slug: "smiling_face_with_heart_eyes",
	group: "Smileys & Emotion",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🤩": {
	name: "star-struck",
	slug: "star_struck",
	group: "Smileys & Emotion",
	emoji_version: "5.0",
	unicode_version: "5.0",
	skin_tone_support: false
},
	"😘": {
	name: "face blowing a kiss",
	slug: "face_blowing_a_kiss",
	group: "Smileys & Emotion",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"😗": {
	name: "kissing face",
	slug: "kissing_face",
	group: "Smileys & Emotion",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"☺️": {
	name: "smiling face",
	slug: "smiling_face",
	group: "Smileys & Emotion",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"😚": {
	name: "kissing face with closed eyes",
	slug: "kissing_face_with_closed_eyes",
	group: "Smileys & Emotion",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"😙": {
	name: "kissing face with smiling eyes",
	slug: "kissing_face_with_smiling_eyes",
	group: "Smileys & Emotion",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🥲": {
	name: "smiling face with tear",
	slug: "smiling_face_with_tear",
	group: "Smileys & Emotion",
	emoji_version: "13.0",
	unicode_version: "13.0",
	skin_tone_support: false
},
	"😋": {
	name: "face savoring food",
	slug: "face_savoring_food",
	group: "Smileys & Emotion",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"😛": {
	name: "face with tongue",
	slug: "face_with_tongue",
	group: "Smileys & Emotion",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"😜": {
	name: "winking face with tongue",
	slug: "winking_face_with_tongue",
	group: "Smileys & Emotion",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🤪": {
	name: "zany face",
	slug: "zany_face",
	group: "Smileys & Emotion",
	emoji_version: "5.0",
	unicode_version: "5.0",
	skin_tone_support: false
},
	"😝": {
	name: "squinting face with tongue",
	slug: "squinting_face_with_tongue",
	group: "Smileys & Emotion",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🤑": {
	name: "money-mouth face",
	slug: "money_mouth_face",
	group: "Smileys & Emotion",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🤗": {
	name: "smiling face with open hands",
	slug: "smiling_face_with_open_hands",
	group: "Smileys & Emotion",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🤭": {
	name: "face with hand over mouth",
	slug: "face_with_hand_over_mouth",
	group: "Smileys & Emotion",
	emoji_version: "5.0",
	unicode_version: "5.0",
	skin_tone_support: false
},
	"🫢": {
	name: "face with open eyes and hand over mouth",
	slug: "face_with_open_eyes_and_hand_over_mouth",
	group: "Smileys & Emotion",
	emoji_version: "14.0",
	unicode_version: "14.0",
	skin_tone_support: false
},
	"🫣": {
	name: "face with peeking eye",
	slug: "face_with_peeking_eye",
	group: "Smileys & Emotion",
	emoji_version: "14.0",
	unicode_version: "14.0",
	skin_tone_support: false
},
	"🤫": {
	name: "shushing face",
	slug: "shushing_face",
	group: "Smileys & Emotion",
	emoji_version: "5.0",
	unicode_version: "5.0",
	skin_tone_support: false
},
	"🤔": {
	name: "thinking face",
	slug: "thinking_face",
	group: "Smileys & Emotion",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🫡": {
	name: "saluting face",
	slug: "saluting_face",
	group: "Smileys & Emotion",
	emoji_version: "14.0",
	unicode_version: "14.0",
	skin_tone_support: false
},
	"🤐": {
	name: "zipper-mouth face",
	slug: "zipper_mouth_face",
	group: "Smileys & Emotion",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🤨": {
	name: "face with raised eyebrow",
	slug: "face_with_raised_eyebrow",
	group: "Smileys & Emotion",
	emoji_version: "5.0",
	unicode_version: "5.0",
	skin_tone_support: false
},
	"😐": {
	name: "neutral face",
	slug: "neutral_face",
	group: "Smileys & Emotion",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"😑": {
	name: "expressionless face",
	slug: "expressionless_face",
	group: "Smileys & Emotion",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"😶": {
	name: "face without mouth",
	slug: "face_without_mouth",
	group: "Smileys & Emotion",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🫥": {
	name: "dotted line face",
	slug: "dotted_line_face",
	group: "Smileys & Emotion",
	emoji_version: "14.0",
	unicode_version: "14.0",
	skin_tone_support: false
},
	"😶‍🌫️": {
	name: "face in clouds",
	slug: "face_in_clouds",
	group: "Smileys & Emotion",
	emoji_version: "13.1",
	unicode_version: "13.1",
	skin_tone_support: false
},
	"😏": {
	name: "smirking face",
	slug: "smirking_face",
	group: "Smileys & Emotion",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"😒": {
	name: "unamused face",
	slug: "unamused_face",
	group: "Smileys & Emotion",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🙄": {
	name: "face with rolling eyes",
	slug: "face_with_rolling_eyes",
	group: "Smileys & Emotion",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"😬": {
	name: "grimacing face",
	slug: "grimacing_face",
	group: "Smileys & Emotion",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"😮‍💨": {
	name: "face exhaling",
	slug: "face_exhaling",
	group: "Smileys & Emotion",
	emoji_version: "13.1",
	unicode_version: "13.1",
	skin_tone_support: false
},
	"🤥": {
	name: "lying face",
	slug: "lying_face",
	group: "Smileys & Emotion",
	emoji_version: "3.0",
	unicode_version: "3.0",
	skin_tone_support: false
},
	"🫨": {
	name: "shaking face",
	slug: "shaking_face",
	group: "Smileys & Emotion",
	emoji_version: "15.0",
	unicode_version: "15.0",
	skin_tone_support: false
},
	"😌": {
	name: "relieved face",
	slug: "relieved_face",
	group: "Smileys & Emotion",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"😔": {
	name: "pensive face",
	slug: "pensive_face",
	group: "Smileys & Emotion",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"😪": {
	name: "sleepy face",
	slug: "sleepy_face",
	group: "Smileys & Emotion",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🤤": {
	name: "drooling face",
	slug: "drooling_face",
	group: "Smileys & Emotion",
	emoji_version: "3.0",
	unicode_version: "3.0",
	skin_tone_support: false
},
	"😴": {
	name: "sleeping face",
	slug: "sleeping_face",
	group: "Smileys & Emotion",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"😷": {
	name: "face with medical mask",
	slug: "face_with_medical_mask",
	group: "Smileys & Emotion",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🤒": {
	name: "face with thermometer",
	slug: "face_with_thermometer",
	group: "Smileys & Emotion",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🤕": {
	name: "face with head-bandage",
	slug: "face_with_head_bandage",
	group: "Smileys & Emotion",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🤢": {
	name: "nauseated face",
	slug: "nauseated_face",
	group: "Smileys & Emotion",
	emoji_version: "3.0",
	unicode_version: "3.0",
	skin_tone_support: false
},
	"🤮": {
	name: "face vomiting",
	slug: "face_vomiting",
	group: "Smileys & Emotion",
	emoji_version: "5.0",
	unicode_version: "5.0",
	skin_tone_support: false
},
	"🤧": {
	name: "sneezing face",
	slug: "sneezing_face",
	group: "Smileys & Emotion",
	emoji_version: "3.0",
	unicode_version: "3.0",
	skin_tone_support: false
},
	"🥵": {
	name: "hot face",
	slug: "hot_face",
	group: "Smileys & Emotion",
	emoji_version: "11.0",
	unicode_version: "11.0",
	skin_tone_support: false
},
	"🥶": {
	name: "cold face",
	slug: "cold_face",
	group: "Smileys & Emotion",
	emoji_version: "11.0",
	unicode_version: "11.0",
	skin_tone_support: false
},
	"🥴": {
	name: "woozy face",
	slug: "woozy_face",
	group: "Smileys & Emotion",
	emoji_version: "11.0",
	unicode_version: "11.0",
	skin_tone_support: false
},
	"😵": {
	name: "face with crossed-out eyes",
	slug: "face_with_crossed_out_eyes",
	group: "Smileys & Emotion",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"😵‍💫": {
	name: "face with spiral eyes",
	slug: "face_with_spiral_eyes",
	group: "Smileys & Emotion",
	emoji_version: "13.1",
	unicode_version: "13.1",
	skin_tone_support: false
},
	"🤯": {
	name: "exploding head",
	slug: "exploding_head",
	group: "Smileys & Emotion",
	emoji_version: "5.0",
	unicode_version: "5.0",
	skin_tone_support: false
},
	"🤠": {
	name: "cowboy hat face",
	slug: "cowboy_hat_face",
	group: "Smileys & Emotion",
	emoji_version: "3.0",
	unicode_version: "3.0",
	skin_tone_support: false
},
	"🥳": {
	name: "partying face",
	slug: "partying_face",
	group: "Smileys & Emotion",
	emoji_version: "11.0",
	unicode_version: "11.0",
	skin_tone_support: false
},
	"🥸": {
	name: "disguised face",
	slug: "disguised_face",
	group: "Smileys & Emotion",
	emoji_version: "13.0",
	unicode_version: "13.0",
	skin_tone_support: false
},
	"😎": {
	name: "smiling face with sunglasses",
	slug: "smiling_face_with_sunglasses",
	group: "Smileys & Emotion",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🤓": {
	name: "nerd face",
	slug: "nerd_face",
	group: "Smileys & Emotion",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🧐": {
	name: "face with monocle",
	slug: "face_with_monocle",
	group: "Smileys & Emotion",
	emoji_version: "5.0",
	unicode_version: "5.0",
	skin_tone_support: false
},
	"😕": {
	name: "confused face",
	slug: "confused_face",
	group: "Smileys & Emotion",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🫤": {
	name: "face with diagonal mouth",
	slug: "face_with_diagonal_mouth",
	group: "Smileys & Emotion",
	emoji_version: "14.0",
	unicode_version: "14.0",
	skin_tone_support: false
},
	"😟": {
	name: "worried face",
	slug: "worried_face",
	group: "Smileys & Emotion",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🙁": {
	name: "slightly frowning face",
	slug: "slightly_frowning_face",
	group: "Smileys & Emotion",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"☹️": {
	name: "frowning face",
	slug: "frowning_face",
	group: "Smileys & Emotion",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"😮": {
	name: "face with open mouth",
	slug: "face_with_open_mouth",
	group: "Smileys & Emotion",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"😯": {
	name: "hushed face",
	slug: "hushed_face",
	group: "Smileys & Emotion",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"😲": {
	name: "astonished face",
	slug: "astonished_face",
	group: "Smileys & Emotion",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"😳": {
	name: "flushed face",
	slug: "flushed_face",
	group: "Smileys & Emotion",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🥺": {
	name: "pleading face",
	slug: "pleading_face",
	group: "Smileys & Emotion",
	emoji_version: "11.0",
	unicode_version: "11.0",
	skin_tone_support: false
},
	"🥹": {
	name: "face holding back tears",
	slug: "face_holding_back_tears",
	group: "Smileys & Emotion",
	emoji_version: "14.0",
	unicode_version: "14.0",
	skin_tone_support: false
},
	"😦": {
	name: "frowning face with open mouth",
	slug: "frowning_face_with_open_mouth",
	group: "Smileys & Emotion",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"😧": {
	name: "anguished face",
	slug: "anguished_face",
	group: "Smileys & Emotion",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"😨": {
	name: "fearful face",
	slug: "fearful_face",
	group: "Smileys & Emotion",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"😰": {
	name: "anxious face with sweat",
	slug: "anxious_face_with_sweat",
	group: "Smileys & Emotion",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"😥": {
	name: "sad but relieved face",
	slug: "sad_but_relieved_face",
	group: "Smileys & Emotion",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"😢": {
	name: "crying face",
	slug: "crying_face",
	group: "Smileys & Emotion",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"😭": {
	name: "loudly crying face",
	slug: "loudly_crying_face",
	group: "Smileys & Emotion",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"😱": {
	name: "face screaming in fear",
	slug: "face_screaming_in_fear",
	group: "Smileys & Emotion",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"😖": {
	name: "confounded face",
	slug: "confounded_face",
	group: "Smileys & Emotion",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"😣": {
	name: "persevering face",
	slug: "persevering_face",
	group: "Smileys & Emotion",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"😞": {
	name: "disappointed face",
	slug: "disappointed_face",
	group: "Smileys & Emotion",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"😓": {
	name: "downcast face with sweat",
	slug: "downcast_face_with_sweat",
	group: "Smileys & Emotion",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"😩": {
	name: "weary face",
	slug: "weary_face",
	group: "Smileys & Emotion",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"😫": {
	name: "tired face",
	slug: "tired_face",
	group: "Smileys & Emotion",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🥱": {
	name: "yawning face",
	slug: "yawning_face",
	group: "Smileys & Emotion",
	emoji_version: "12.0",
	unicode_version: "12.0",
	skin_tone_support: false
},
	"😤": {
	name: "face with steam from nose",
	slug: "face_with_steam_from_nose",
	group: "Smileys & Emotion",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"😡": {
	name: "enraged face",
	slug: "enraged_face",
	group: "Smileys & Emotion",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"😠": {
	name: "angry face",
	slug: "angry_face",
	group: "Smileys & Emotion",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🤬": {
	name: "face with symbols on mouth",
	slug: "face_with_symbols_on_mouth",
	group: "Smileys & Emotion",
	emoji_version: "5.0",
	unicode_version: "5.0",
	skin_tone_support: false
},
	"😈": {
	name: "smiling face with horns",
	slug: "smiling_face_with_horns",
	group: "Smileys & Emotion",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"👿": {
	name: "angry face with horns",
	slug: "angry_face_with_horns",
	group: "Smileys & Emotion",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"💀": {
	name: "skull",
	slug: "skull",
	group: "Smileys & Emotion",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"☠️": {
	name: "skull and crossbones",
	slug: "skull_and_crossbones",
	group: "Smileys & Emotion",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"💩": {
	name: "pile of poo",
	slug: "pile_of_poo",
	group: "Smileys & Emotion",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🤡": {
	name: "clown face",
	slug: "clown_face",
	group: "Smileys & Emotion",
	emoji_version: "3.0",
	unicode_version: "3.0",
	skin_tone_support: false
},
	"👹": {
	name: "ogre",
	slug: "ogre",
	group: "Smileys & Emotion",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"👺": {
	name: "goblin",
	slug: "goblin",
	group: "Smileys & Emotion",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"👻": {
	name: "ghost",
	slug: "ghost",
	group: "Smileys & Emotion",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"👽": {
	name: "alien",
	slug: "alien",
	group: "Smileys & Emotion",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"👾": {
	name: "alien monster",
	slug: "alien_monster",
	group: "Smileys & Emotion",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🤖": {
	name: "robot",
	slug: "robot",
	group: "Smileys & Emotion",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"😺": {
	name: "grinning cat",
	slug: "grinning_cat",
	group: "Smileys & Emotion",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"😸": {
	name: "grinning cat with smiling eyes",
	slug: "grinning_cat_with_smiling_eyes",
	group: "Smileys & Emotion",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"😹": {
	name: "cat with tears of joy",
	slug: "cat_with_tears_of_joy",
	group: "Smileys & Emotion",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"😻": {
	name: "smiling cat with heart-eyes",
	slug: "smiling_cat_with_heart_eyes",
	group: "Smileys & Emotion",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"😼": {
	name: "cat with wry smile",
	slug: "cat_with_wry_smile",
	group: "Smileys & Emotion",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"😽": {
	name: "kissing cat",
	slug: "kissing_cat",
	group: "Smileys & Emotion",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🙀": {
	name: "weary cat",
	slug: "weary_cat",
	group: "Smileys & Emotion",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"😿": {
	name: "crying cat",
	slug: "crying_cat",
	group: "Smileys & Emotion",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"😾": {
	name: "pouting cat",
	slug: "pouting_cat",
	group: "Smileys & Emotion",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🙈": {
	name: "see-no-evil monkey",
	slug: "see_no_evil_monkey",
	group: "Smileys & Emotion",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🙉": {
	name: "hear-no-evil monkey",
	slug: "hear_no_evil_monkey",
	group: "Smileys & Emotion",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🙊": {
	name: "speak-no-evil monkey",
	slug: "speak_no_evil_monkey",
	group: "Smileys & Emotion",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"💌": {
	name: "love letter",
	slug: "love_letter",
	group: "Smileys & Emotion",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"💘": {
	name: "heart with arrow",
	slug: "heart_with_arrow",
	group: "Smileys & Emotion",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"💝": {
	name: "heart with ribbon",
	slug: "heart_with_ribbon",
	group: "Smileys & Emotion",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"💖": {
	name: "sparkling heart",
	slug: "sparkling_heart",
	group: "Smileys & Emotion",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"💗": {
	name: "growing heart",
	slug: "growing_heart",
	group: "Smileys & Emotion",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"💓": {
	name: "beating heart",
	slug: "beating_heart",
	group: "Smileys & Emotion",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"💞": {
	name: "revolving hearts",
	slug: "revolving_hearts",
	group: "Smileys & Emotion",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"💕": {
	name: "two hearts",
	slug: "two_hearts",
	group: "Smileys & Emotion",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"💟": {
	name: "heart decoration",
	slug: "heart_decoration",
	group: "Smileys & Emotion",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"❣️": {
	name: "heart exclamation",
	slug: "heart_exclamation",
	group: "Smileys & Emotion",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"💔": {
	name: "broken heart",
	slug: "broken_heart",
	group: "Smileys & Emotion",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"❤️‍🔥": {
	name: "heart on fire",
	slug: "heart_on_fire",
	group: "Smileys & Emotion",
	emoji_version: "13.1",
	unicode_version: "13.1",
	skin_tone_support: false
},
	"❤️‍🩹": {
	name: "mending heart",
	slug: "mending_heart",
	group: "Smileys & Emotion",
	emoji_version: "13.1",
	unicode_version: "13.1",
	skin_tone_support: false
},
	"❤️": {
	name: "red heart",
	slug: "red_heart",
	group: "Smileys & Emotion",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🩷": {
	name: "pink heart",
	slug: "pink_heart",
	group: "Smileys & Emotion",
	emoji_version: "15.0",
	unicode_version: "15.0",
	skin_tone_support: false
},
	"🧡": {
	name: "orange heart",
	slug: "orange_heart",
	group: "Smileys & Emotion",
	emoji_version: "5.0",
	unicode_version: "5.0",
	skin_tone_support: false
},
	"💛": {
	name: "yellow heart",
	slug: "yellow_heart",
	group: "Smileys & Emotion",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"💚": {
	name: "green heart",
	slug: "green_heart",
	group: "Smileys & Emotion",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"💙": {
	name: "blue heart",
	slug: "blue_heart",
	group: "Smileys & Emotion",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🩵": {
	name: "light blue heart",
	slug: "light_blue_heart",
	group: "Smileys & Emotion",
	emoji_version: "15.0",
	unicode_version: "15.0",
	skin_tone_support: false
},
	"💜": {
	name: "purple heart",
	slug: "purple_heart",
	group: "Smileys & Emotion",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🤎": {
	name: "brown heart",
	slug: "brown_heart",
	group: "Smileys & Emotion",
	emoji_version: "12.0",
	unicode_version: "12.0",
	skin_tone_support: false
},
	"🖤": {
	name: "black heart",
	slug: "black_heart",
	group: "Smileys & Emotion",
	emoji_version: "3.0",
	unicode_version: "3.0",
	skin_tone_support: false
},
	"🩶": {
	name: "grey heart",
	slug: "grey_heart",
	group: "Smileys & Emotion",
	emoji_version: "15.0",
	unicode_version: "15.0",
	skin_tone_support: false
},
	"🤍": {
	name: "white heart",
	slug: "white_heart",
	group: "Smileys & Emotion",
	emoji_version: "12.0",
	unicode_version: "12.0",
	skin_tone_support: false
},
	"💋": {
	name: "kiss mark",
	slug: "kiss_mark",
	group: "Smileys & Emotion",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"💯": {
	name: "hundred points",
	slug: "hundred_points",
	group: "Smileys & Emotion",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"💢": {
	name: "anger symbol",
	slug: "anger_symbol",
	group: "Smileys & Emotion",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"💥": {
	name: "collision",
	slug: "collision",
	group: "Smileys & Emotion",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"💫": {
	name: "dizzy",
	slug: "dizzy",
	group: "Smileys & Emotion",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"💦": {
	name: "sweat droplets",
	slug: "sweat_droplets",
	group: "Smileys & Emotion",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"💨": {
	name: "dashing away",
	slug: "dashing_away",
	group: "Smileys & Emotion",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🕳️": {
	name: "hole",
	slug: "hole",
	group: "Smileys & Emotion",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"💬": {
	name: "speech balloon",
	slug: "speech_balloon",
	group: "Smileys & Emotion",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"👁️‍🗨️": {
	name: "eye in speech bubble",
	slug: "eye_in_speech_bubble",
	group: "Smileys & Emotion",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🗨️": {
	name: "left speech bubble",
	slug: "left_speech_bubble",
	group: "Smileys & Emotion",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🗯️": {
	name: "right anger bubble",
	slug: "right_anger_bubble",
	group: "Smileys & Emotion",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"💭": {
	name: "thought balloon",
	slug: "thought_balloon",
	group: "Smileys & Emotion",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"💤": {
	name: "ZZZ",
	slug: "zzz",
	group: "Smileys & Emotion",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"👋": {
	name: "waving hand",
	slug: "waving_hand",
	group: "People & Body",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "1.0"
},
	"🤚": {
	name: "raised back of hand",
	slug: "raised_back_of_hand",
	group: "People & Body",
	emoji_version: "3.0",
	unicode_version: "3.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "3.0"
},
	"🖐️": {
	name: "hand with fingers splayed",
	slug: "hand_with_fingers_splayed",
	group: "People & Body",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "1.0"
},
	"✋": {
	name: "raised hand",
	slug: "raised_hand",
	group: "People & Body",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "1.0"
},
	"🖖": {
	name: "vulcan salute",
	slug: "vulcan_salute",
	group: "People & Body",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "1.0"
},
	"🫱": {
	name: "rightwards hand",
	slug: "rightwards_hand",
	group: "People & Body",
	emoji_version: "14.0",
	unicode_version: "14.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "14.0"
},
	"🫲": {
	name: "leftwards hand",
	slug: "leftwards_hand",
	group: "People & Body",
	emoji_version: "14.0",
	unicode_version: "14.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "14.0"
},
	"🫳": {
	name: "palm down hand",
	slug: "palm_down_hand",
	group: "People & Body",
	emoji_version: "14.0",
	unicode_version: "14.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "14.0"
},
	"🫴": {
	name: "palm up hand",
	slug: "palm_up_hand",
	group: "People & Body",
	emoji_version: "14.0",
	unicode_version: "14.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "14.0"
},
	"🫷": {
	name: "leftwards pushing hand",
	slug: "leftwards_pushing_hand",
	group: "People & Body",
	emoji_version: "15.0",
	unicode_version: "15.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "15.0"
},
	"🫸": {
	name: "rightwards pushing hand",
	slug: "rightwards_pushing_hand",
	group: "People & Body",
	emoji_version: "15.0",
	unicode_version: "15.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "15.0"
},
	"👌": {
	name: "OK hand",
	slug: "ok_hand",
	group: "People & Body",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "1.0"
},
	"🤌": {
	name: "pinched fingers",
	slug: "pinched_fingers",
	group: "People & Body",
	emoji_version: "13.0",
	unicode_version: "13.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "13.0"
},
	"🤏": {
	name: "pinching hand",
	slug: "pinching_hand",
	group: "People & Body",
	emoji_version: "12.0",
	unicode_version: "12.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "12.0"
},
	"✌️": {
	name: "victory hand",
	slug: "victory_hand",
	group: "People & Body",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "1.0"
},
	"🤞": {
	name: "crossed fingers",
	slug: "crossed_fingers",
	group: "People & Body",
	emoji_version: "3.0",
	unicode_version: "3.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "3.0"
},
	"🫰": {
	name: "hand with index finger and thumb crossed",
	slug: "hand_with_index_finger_and_thumb_crossed",
	group: "People & Body",
	emoji_version: "14.0",
	unicode_version: "14.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "14.0"
},
	"🤟": {
	name: "love-you gesture",
	slug: "love_you_gesture",
	group: "People & Body",
	emoji_version: "5.0",
	unicode_version: "5.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "5.0"
},
	"🤘": {
	name: "sign of the horns",
	slug: "sign_of_the_horns",
	group: "People & Body",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "1.0"
},
	"🤙": {
	name: "call me hand",
	slug: "call_me_hand",
	group: "People & Body",
	emoji_version: "3.0",
	unicode_version: "3.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "3.0"
},
	"👈": {
	name: "backhand index pointing left",
	slug: "backhand_index_pointing_left",
	group: "People & Body",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "1.0"
},
	"👉": {
	name: "backhand index pointing right",
	slug: "backhand_index_pointing_right",
	group: "People & Body",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "1.0"
},
	"👆": {
	name: "backhand index pointing up",
	slug: "backhand_index_pointing_up",
	group: "People & Body",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "1.0"
},
	"🖕": {
	name: "middle finger",
	slug: "middle_finger",
	group: "People & Body",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "1.0"
},
	"👇": {
	name: "backhand index pointing down",
	slug: "backhand_index_pointing_down",
	group: "People & Body",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "1.0"
},
	"☝️": {
	name: "index pointing up",
	slug: "index_pointing_up",
	group: "People & Body",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "1.0"
},
	"🫵": {
	name: "index pointing at the viewer",
	slug: "index_pointing_at_the_viewer",
	group: "People & Body",
	emoji_version: "14.0",
	unicode_version: "14.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "14.0"
},
	"👍": {
	name: "thumbs up",
	slug: "thumbs_up",
	group: "People & Body",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "1.0"
},
	"👎": {
	name: "thumbs down",
	slug: "thumbs_down",
	group: "People & Body",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "1.0"
},
	"✊": {
	name: "raised fist",
	slug: "raised_fist",
	group: "People & Body",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "1.0"
},
	"👊": {
	name: "oncoming fist",
	slug: "oncoming_fist",
	group: "People & Body",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "1.0"
},
	"🤛": {
	name: "left-facing fist",
	slug: "left_facing_fist",
	group: "People & Body",
	emoji_version: "3.0",
	unicode_version: "3.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "3.0"
},
	"🤜": {
	name: "right-facing fist",
	slug: "right_facing_fist",
	group: "People & Body",
	emoji_version: "3.0",
	unicode_version: "3.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "3.0"
},
	"👏": {
	name: "clapping hands",
	slug: "clapping_hands",
	group: "People & Body",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "1.0"
},
	"🙌": {
	name: "raising hands",
	slug: "raising_hands",
	group: "People & Body",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "1.0"
},
	"🫶": {
	name: "heart hands",
	slug: "heart_hands",
	group: "People & Body",
	emoji_version: "14.0",
	unicode_version: "14.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "14.0"
},
	"👐": {
	name: "open hands",
	slug: "open_hands",
	group: "People & Body",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "1.0"
},
	"🤲": {
	name: "palms up together",
	slug: "palms_up_together",
	group: "People & Body",
	emoji_version: "5.0",
	unicode_version: "5.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "5.0"
},
	"🤝": {
	name: "handshake",
	slug: "handshake",
	group: "People & Body",
	emoji_version: "3.0",
	unicode_version: "3.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "14.0"
},
	"🙏": {
	name: "folded hands",
	slug: "folded_hands",
	group: "People & Body",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "1.0"
},
	"✍️": {
	name: "writing hand",
	slug: "writing_hand",
	group: "People & Body",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "1.0"
},
	"💅": {
	name: "nail polish",
	slug: "nail_polish",
	group: "People & Body",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "1.0"
},
	"🤳": {
	name: "selfie",
	slug: "selfie",
	group: "People & Body",
	emoji_version: "3.0",
	unicode_version: "3.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "3.0"
},
	"💪": {
	name: "flexed biceps",
	slug: "flexed_biceps",
	group: "People & Body",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "1.0"
},
	"🦾": {
	name: "mechanical arm",
	slug: "mechanical_arm",
	group: "People & Body",
	emoji_version: "12.0",
	unicode_version: "12.0",
	skin_tone_support: false
},
	"🦿": {
	name: "mechanical leg",
	slug: "mechanical_leg",
	group: "People & Body",
	emoji_version: "12.0",
	unicode_version: "12.0",
	skin_tone_support: false
},
	"🦵": {
	name: "leg",
	slug: "leg",
	group: "People & Body",
	emoji_version: "11.0",
	unicode_version: "11.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "11.0"
},
	"🦶": {
	name: "foot",
	slug: "foot",
	group: "People & Body",
	emoji_version: "11.0",
	unicode_version: "11.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "11.0"
},
	"👂": {
	name: "ear",
	slug: "ear",
	group: "People & Body",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "1.0"
},
	"🦻": {
	name: "ear with hearing aid",
	slug: "ear_with_hearing_aid",
	group: "People & Body",
	emoji_version: "12.0",
	unicode_version: "12.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "12.0"
},
	"👃": {
	name: "nose",
	slug: "nose",
	group: "People & Body",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "1.0"
},
	"🧠": {
	name: "brain",
	slug: "brain",
	group: "People & Body",
	emoji_version: "5.0",
	unicode_version: "5.0",
	skin_tone_support: false
},
	"🫀": {
	name: "anatomical heart",
	slug: "anatomical_heart",
	group: "People & Body",
	emoji_version: "13.0",
	unicode_version: "13.0",
	skin_tone_support: false
},
	"🫁": {
	name: "lungs",
	slug: "lungs",
	group: "People & Body",
	emoji_version: "13.0",
	unicode_version: "13.0",
	skin_tone_support: false
},
	"🦷": {
	name: "tooth",
	slug: "tooth",
	group: "People & Body",
	emoji_version: "11.0",
	unicode_version: "11.0",
	skin_tone_support: false
},
	"🦴": {
	name: "bone",
	slug: "bone",
	group: "People & Body",
	emoji_version: "11.0",
	unicode_version: "11.0",
	skin_tone_support: false
},
	"👀": {
	name: "eyes",
	slug: "eyes",
	group: "People & Body",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"👁️": {
	name: "eye",
	slug: "eye",
	group: "People & Body",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"👅": {
	name: "tongue",
	slug: "tongue",
	group: "People & Body",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"👄": {
	name: "mouth",
	slug: "mouth",
	group: "People & Body",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🫦": {
	name: "biting lip",
	slug: "biting_lip",
	group: "People & Body",
	emoji_version: "14.0",
	unicode_version: "14.0",
	skin_tone_support: false
},
	"👶": {
	name: "baby",
	slug: "baby",
	group: "People & Body",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "1.0"
},
	"🧒": {
	name: "child",
	slug: "child",
	group: "People & Body",
	emoji_version: "5.0",
	unicode_version: "5.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "5.0"
},
	"👦": {
	name: "boy",
	slug: "boy",
	group: "People & Body",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "1.0"
},
	"👧": {
	name: "girl",
	slug: "girl",
	group: "People & Body",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "1.0"
},
	"🧑": {
	name: "person",
	slug: "person",
	group: "People & Body",
	emoji_version: "5.0",
	unicode_version: "5.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "5.0"
},
	"👱": {
	name: "person blond hair",
	slug: "person_blond_hair",
	group: "People & Body",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "1.0"
},
	"👨": {
	name: "man",
	slug: "man",
	group: "People & Body",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "1.0"
},
	"🧔": {
	name: "person beard",
	slug: "person_beard",
	group: "People & Body",
	emoji_version: "5.0",
	unicode_version: "5.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "5.0"
},
	"🧔‍♂️": {
	name: "man beard",
	slug: "man_beard",
	group: "People & Body",
	emoji_version: "13.1",
	unicode_version: "13.1",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "13.1"
},
	"🧔‍♀️": {
	name: "woman beard",
	slug: "woman_beard",
	group: "People & Body",
	emoji_version: "13.1",
	unicode_version: "13.1",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "13.1"
},
	"👨‍🦰": {
	name: "man red hair",
	slug: "man_red_hair",
	group: "People & Body",
	emoji_version: "11.0",
	unicode_version: "11.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "11.0"
},
	"👨‍🦱": {
	name: "man curly hair",
	slug: "man_curly_hair",
	group: "People & Body",
	emoji_version: "11.0",
	unicode_version: "11.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "11.0"
},
	"👨‍🦳": {
	name: "man white hair",
	slug: "man_white_hair",
	group: "People & Body",
	emoji_version: "11.0",
	unicode_version: "11.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "11.0"
},
	"👨‍🦲": {
	name: "man bald",
	slug: "man_bald",
	group: "People & Body",
	emoji_version: "11.0",
	unicode_version: "11.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "11.0"
},
	"👩": {
	name: "woman",
	slug: "woman",
	group: "People & Body",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "1.0"
},
	"👩‍🦰": {
	name: "woman red hair",
	slug: "woman_red_hair",
	group: "People & Body",
	emoji_version: "11.0",
	unicode_version: "11.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "11.0"
},
	"🧑‍🦰": {
	name: "person red hair",
	slug: "person_red_hair",
	group: "People & Body",
	emoji_version: "12.1",
	unicode_version: "12.1",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "12.1"
},
	"👩‍🦱": {
	name: "woman curly hair",
	slug: "woman_curly_hair",
	group: "People & Body",
	emoji_version: "11.0",
	unicode_version: "11.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "11.0"
},
	"🧑‍🦱": {
	name: "person curly hair",
	slug: "person_curly_hair",
	group: "People & Body",
	emoji_version: "12.1",
	unicode_version: "12.1",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "12.1"
},
	"👩‍🦳": {
	name: "woman white hair",
	slug: "woman_white_hair",
	group: "People & Body",
	emoji_version: "11.0",
	unicode_version: "11.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "11.0"
},
	"🧑‍🦳": {
	name: "person white hair",
	slug: "person_white_hair",
	group: "People & Body",
	emoji_version: "12.1",
	unicode_version: "12.1",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "12.1"
},
	"👩‍🦲": {
	name: "woman bald",
	slug: "woman_bald",
	group: "People & Body",
	emoji_version: "11.0",
	unicode_version: "11.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "11.0"
},
	"🧑‍🦲": {
	name: "person bald",
	slug: "person_bald",
	group: "People & Body",
	emoji_version: "12.1",
	unicode_version: "12.1",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "12.1"
},
	"👱‍♀️": {
	name: "woman blond hair",
	slug: "woman_blond_hair",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"👱‍♂️": {
	name: "man blond hair",
	slug: "man_blond_hair",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"🧓": {
	name: "older person",
	slug: "older_person",
	group: "People & Body",
	emoji_version: "5.0",
	unicode_version: "5.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "5.0"
},
	"👴": {
	name: "old man",
	slug: "old_man",
	group: "People & Body",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "1.0"
},
	"👵": {
	name: "old woman",
	slug: "old_woman",
	group: "People & Body",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "1.0"
},
	"🙍": {
	name: "person frowning",
	slug: "person_frowning",
	group: "People & Body",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "1.0"
},
	"🙍‍♂️": {
	name: "man frowning",
	slug: "man_frowning",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"🙍‍♀️": {
	name: "woman frowning",
	slug: "woman_frowning",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"🙎": {
	name: "person pouting",
	slug: "person_pouting",
	group: "People & Body",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "1.0"
},
	"🙎‍♂️": {
	name: "man pouting",
	slug: "man_pouting",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"🙎‍♀️": {
	name: "woman pouting",
	slug: "woman_pouting",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"🙅": {
	name: "person gesturing NO",
	slug: "person_gesturing_no",
	group: "People & Body",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "1.0"
},
	"🙅‍♂️": {
	name: "man gesturing NO",
	slug: "man_gesturing_no",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"🙅‍♀️": {
	name: "woman gesturing NO",
	slug: "woman_gesturing_no",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"🙆": {
	name: "person gesturing OK",
	slug: "person_gesturing_ok",
	group: "People & Body",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "1.0"
},
	"🙆‍♂️": {
	name: "man gesturing OK",
	slug: "man_gesturing_ok",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"🙆‍♀️": {
	name: "woman gesturing OK",
	slug: "woman_gesturing_ok",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"💁": {
	name: "person tipping hand",
	slug: "person_tipping_hand",
	group: "People & Body",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "1.0"
},
	"💁‍♂️": {
	name: "man tipping hand",
	slug: "man_tipping_hand",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"💁‍♀️": {
	name: "woman tipping hand",
	slug: "woman_tipping_hand",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"🙋": {
	name: "person raising hand",
	slug: "person_raising_hand",
	group: "People & Body",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "1.0"
},
	"🙋‍♂️": {
	name: "man raising hand",
	slug: "man_raising_hand",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"🙋‍♀️": {
	name: "woman raising hand",
	slug: "woman_raising_hand",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"🧏": {
	name: "deaf person",
	slug: "deaf_person",
	group: "People & Body",
	emoji_version: "12.0",
	unicode_version: "12.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "12.0"
},
	"🧏‍♂️": {
	name: "deaf man",
	slug: "deaf_man",
	group: "People & Body",
	emoji_version: "12.0",
	unicode_version: "12.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "12.0"
},
	"🧏‍♀️": {
	name: "deaf woman",
	slug: "deaf_woman",
	group: "People & Body",
	emoji_version: "12.0",
	unicode_version: "12.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "12.0"
},
	"🙇": {
	name: "person bowing",
	slug: "person_bowing",
	group: "People & Body",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "1.0"
},
	"🙇‍♂️": {
	name: "man bowing",
	slug: "man_bowing",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"🙇‍♀️": {
	name: "woman bowing",
	slug: "woman_bowing",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"🤦": {
	name: "person facepalming",
	slug: "person_facepalming",
	group: "People & Body",
	emoji_version: "3.0",
	unicode_version: "3.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "3.0"
},
	"🤦‍♂️": {
	name: "man facepalming",
	slug: "man_facepalming",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"🤦‍♀️": {
	name: "woman facepalming",
	slug: "woman_facepalming",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"🤷": {
	name: "person shrugging",
	slug: "person_shrugging",
	group: "People & Body",
	emoji_version: "3.0",
	unicode_version: "3.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "3.0"
},
	"🤷‍♂️": {
	name: "man shrugging",
	slug: "man_shrugging",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"🤷‍♀️": {
	name: "woman shrugging",
	slug: "woman_shrugging",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"🧑‍⚕️": {
	name: "health worker",
	slug: "health_worker",
	group: "People & Body",
	emoji_version: "12.1",
	unicode_version: "12.1",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "12.1"
},
	"👨‍⚕️": {
	name: "man health worker",
	slug: "man_health_worker",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"👩‍⚕️": {
	name: "woman health worker",
	slug: "woman_health_worker",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"🧑‍🎓": {
	name: "student",
	slug: "student",
	group: "People & Body",
	emoji_version: "12.1",
	unicode_version: "12.1",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "12.1"
},
	"👨‍🎓": {
	name: "man student",
	slug: "man_student",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"👩‍🎓": {
	name: "woman student",
	slug: "woman_student",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"🧑‍🏫": {
	name: "teacher",
	slug: "teacher",
	group: "People & Body",
	emoji_version: "12.1",
	unicode_version: "12.1",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "12.1"
},
	"👨‍🏫": {
	name: "man teacher",
	slug: "man_teacher",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"👩‍🏫": {
	name: "woman teacher",
	slug: "woman_teacher",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"🧑‍⚖️": {
	name: "judge",
	slug: "judge",
	group: "People & Body",
	emoji_version: "12.1",
	unicode_version: "12.1",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "12.1"
},
	"👨‍⚖️": {
	name: "man judge",
	slug: "man_judge",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"👩‍⚖️": {
	name: "woman judge",
	slug: "woman_judge",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"🧑‍🌾": {
	name: "farmer",
	slug: "farmer",
	group: "People & Body",
	emoji_version: "12.1",
	unicode_version: "12.1",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "12.1"
},
	"👨‍🌾": {
	name: "man farmer",
	slug: "man_farmer",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"👩‍🌾": {
	name: "woman farmer",
	slug: "woman_farmer",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"🧑‍🍳": {
	name: "cook",
	slug: "cook",
	group: "People & Body",
	emoji_version: "12.1",
	unicode_version: "12.1",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "12.1"
},
	"👨‍🍳": {
	name: "man cook",
	slug: "man_cook",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"👩‍🍳": {
	name: "woman cook",
	slug: "woman_cook",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"🧑‍🔧": {
	name: "mechanic",
	slug: "mechanic",
	group: "People & Body",
	emoji_version: "12.1",
	unicode_version: "12.1",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "12.1"
},
	"👨‍🔧": {
	name: "man mechanic",
	slug: "man_mechanic",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"👩‍🔧": {
	name: "woman mechanic",
	slug: "woman_mechanic",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"🧑‍🏭": {
	name: "factory worker",
	slug: "factory_worker",
	group: "People & Body",
	emoji_version: "12.1",
	unicode_version: "12.1",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "12.1"
},
	"👨‍🏭": {
	name: "man factory worker",
	slug: "man_factory_worker",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"👩‍🏭": {
	name: "woman factory worker",
	slug: "woman_factory_worker",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"🧑‍💼": {
	name: "office worker",
	slug: "office_worker",
	group: "People & Body",
	emoji_version: "12.1",
	unicode_version: "12.1",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "12.1"
},
	"👨‍💼": {
	name: "man office worker",
	slug: "man_office_worker",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"👩‍💼": {
	name: "woman office worker",
	slug: "woman_office_worker",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"🧑‍🔬": {
	name: "scientist",
	slug: "scientist",
	group: "People & Body",
	emoji_version: "12.1",
	unicode_version: "12.1",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "12.1"
},
	"👨‍🔬": {
	name: "man scientist",
	slug: "man_scientist",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"👩‍🔬": {
	name: "woman scientist",
	slug: "woman_scientist",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"🧑‍💻": {
	name: "technologist",
	slug: "technologist",
	group: "People & Body",
	emoji_version: "12.1",
	unicode_version: "12.1",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "12.1"
},
	"👨‍💻": {
	name: "man technologist",
	slug: "man_technologist",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"👩‍💻": {
	name: "woman technologist",
	slug: "woman_technologist",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"🧑‍🎤": {
	name: "singer",
	slug: "singer",
	group: "People & Body",
	emoji_version: "12.1",
	unicode_version: "12.1",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "12.1"
},
	"👨‍🎤": {
	name: "man singer",
	slug: "man_singer",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"👩‍🎤": {
	name: "woman singer",
	slug: "woman_singer",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"🧑‍🎨": {
	name: "artist",
	slug: "artist",
	group: "People & Body",
	emoji_version: "12.1",
	unicode_version: "12.1",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "12.1"
},
	"👨‍🎨": {
	name: "man artist",
	slug: "man_artist",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"👩‍🎨": {
	name: "woman artist",
	slug: "woman_artist",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"🧑‍✈️": {
	name: "pilot",
	slug: "pilot",
	group: "People & Body",
	emoji_version: "12.1",
	unicode_version: "12.1",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "12.1"
},
	"👨‍✈️": {
	name: "man pilot",
	slug: "man_pilot",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"👩‍✈️": {
	name: "woman pilot",
	slug: "woman_pilot",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"🧑‍🚀": {
	name: "astronaut",
	slug: "astronaut",
	group: "People & Body",
	emoji_version: "12.1",
	unicode_version: "12.1",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "12.1"
},
	"👨‍🚀": {
	name: "man astronaut",
	slug: "man_astronaut",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"👩‍🚀": {
	name: "woman astronaut",
	slug: "woman_astronaut",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"🧑‍🚒": {
	name: "firefighter",
	slug: "firefighter",
	group: "People & Body",
	emoji_version: "12.1",
	unicode_version: "12.1",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "12.1"
},
	"👨‍🚒": {
	name: "man firefighter",
	slug: "man_firefighter",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"👩‍🚒": {
	name: "woman firefighter",
	slug: "woman_firefighter",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"👮": {
	name: "police officer",
	slug: "police_officer",
	group: "People & Body",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "1.0"
},
	"👮‍♂️": {
	name: "man police officer",
	slug: "man_police_officer",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"👮‍♀️": {
	name: "woman police officer",
	slug: "woman_police_officer",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"🕵️": {
	name: "detective",
	slug: "detective",
	group: "People & Body",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "2.0"
},
	"🕵️‍♂️": {
	name: "man detective",
	slug: "man_detective",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"🕵️‍♀️": {
	name: "woman detective",
	slug: "woman_detective",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"💂": {
	name: "guard",
	slug: "guard",
	group: "People & Body",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "1.0"
},
	"💂‍♂️": {
	name: "man guard",
	slug: "man_guard",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"💂‍♀️": {
	name: "woman guard",
	slug: "woman_guard",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"🥷": {
	name: "ninja",
	slug: "ninja",
	group: "People & Body",
	emoji_version: "13.0",
	unicode_version: "13.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "13.0"
},
	"👷": {
	name: "construction worker",
	slug: "construction_worker",
	group: "People & Body",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "1.0"
},
	"👷‍♂️": {
	name: "man construction worker",
	slug: "man_construction_worker",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"👷‍♀️": {
	name: "woman construction worker",
	slug: "woman_construction_worker",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"🫅": {
	name: "person with crown",
	slug: "person_with_crown",
	group: "People & Body",
	emoji_version: "14.0",
	unicode_version: "14.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "14.0"
},
	"🤴": {
	name: "prince",
	slug: "prince",
	group: "People & Body",
	emoji_version: "3.0",
	unicode_version: "3.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "3.0"
},
	"👸": {
	name: "princess",
	slug: "princess",
	group: "People & Body",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "1.0"
},
	"👳": {
	name: "person wearing turban",
	slug: "person_wearing_turban",
	group: "People & Body",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "1.0"
},
	"👳‍♂️": {
	name: "man wearing turban",
	slug: "man_wearing_turban",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"👳‍♀️": {
	name: "woman wearing turban",
	slug: "woman_wearing_turban",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"👲": {
	name: "person with skullcap",
	slug: "person_with_skullcap",
	group: "People & Body",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "1.0"
},
	"🧕": {
	name: "woman with headscarf",
	slug: "woman_with_headscarf",
	group: "People & Body",
	emoji_version: "5.0",
	unicode_version: "5.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "5.0"
},
	"🤵": {
	name: "person in tuxedo",
	slug: "person_in_tuxedo",
	group: "People & Body",
	emoji_version: "3.0",
	unicode_version: "3.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "3.0"
},
	"🤵‍♂️": {
	name: "man in tuxedo",
	slug: "man_in_tuxedo",
	group: "People & Body",
	emoji_version: "13.0",
	unicode_version: "13.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "13.0"
},
	"🤵‍♀️": {
	name: "woman in tuxedo",
	slug: "woman_in_tuxedo",
	group: "People & Body",
	emoji_version: "13.0",
	unicode_version: "13.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "13.0"
},
	"👰": {
	name: "person with veil",
	slug: "person_with_veil",
	group: "People & Body",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "1.0"
},
	"👰‍♂️": {
	name: "man with veil",
	slug: "man_with_veil",
	group: "People & Body",
	emoji_version: "13.0",
	unicode_version: "13.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "13.0"
},
	"👰‍♀️": {
	name: "woman with veil",
	slug: "woman_with_veil",
	group: "People & Body",
	emoji_version: "13.0",
	unicode_version: "13.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "13.0"
},
	"🤰": {
	name: "pregnant woman",
	slug: "pregnant_woman",
	group: "People & Body",
	emoji_version: "3.0",
	unicode_version: "3.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "3.0"
},
	"🫃": {
	name: "pregnant man",
	slug: "pregnant_man",
	group: "People & Body",
	emoji_version: "14.0",
	unicode_version: "14.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "14.0"
},
	"🫄": {
	name: "pregnant person",
	slug: "pregnant_person",
	group: "People & Body",
	emoji_version: "14.0",
	unicode_version: "14.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "14.0"
},
	"🤱": {
	name: "breast-feeding",
	slug: "breast_feeding",
	group: "People & Body",
	emoji_version: "5.0",
	unicode_version: "5.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "5.0"
},
	"👩‍🍼": {
	name: "woman feeding baby",
	slug: "woman_feeding_baby",
	group: "People & Body",
	emoji_version: "13.0",
	unicode_version: "13.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "13.0"
},
	"👨‍🍼": {
	name: "man feeding baby",
	slug: "man_feeding_baby",
	group: "People & Body",
	emoji_version: "13.0",
	unicode_version: "13.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "13.0"
},
	"🧑‍🍼": {
	name: "person feeding baby",
	slug: "person_feeding_baby",
	group: "People & Body",
	emoji_version: "13.0",
	unicode_version: "13.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "13.0"
},
	"👼": {
	name: "baby angel",
	slug: "baby_angel",
	group: "People & Body",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "1.0"
},
	"🎅": {
	name: "Santa Claus",
	slug: "santa_claus",
	group: "People & Body",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "1.0"
},
	"🤶": {
	name: "Mrs. Claus",
	slug: "mrs_claus",
	group: "People & Body",
	emoji_version: "3.0",
	unicode_version: "3.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "3.0"
},
	"🧑‍🎄": {
	name: "mx claus",
	slug: "mx_claus",
	group: "People & Body",
	emoji_version: "13.0",
	unicode_version: "13.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "13.0"
},
	"🦸": {
	name: "superhero",
	slug: "superhero",
	group: "People & Body",
	emoji_version: "11.0",
	unicode_version: "11.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "11.0"
},
	"🦸‍♂️": {
	name: "man superhero",
	slug: "man_superhero",
	group: "People & Body",
	emoji_version: "11.0",
	unicode_version: "11.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "11.0"
},
	"🦸‍♀️": {
	name: "woman superhero",
	slug: "woman_superhero",
	group: "People & Body",
	emoji_version: "11.0",
	unicode_version: "11.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "11.0"
},
	"🦹": {
	name: "supervillain",
	slug: "supervillain",
	group: "People & Body",
	emoji_version: "11.0",
	unicode_version: "11.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "11.0"
},
	"🦹‍♂️": {
	name: "man supervillain",
	slug: "man_supervillain",
	group: "People & Body",
	emoji_version: "11.0",
	unicode_version: "11.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "11.0"
},
	"🦹‍♀️": {
	name: "woman supervillain",
	slug: "woman_supervillain",
	group: "People & Body",
	emoji_version: "11.0",
	unicode_version: "11.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "11.0"
},
	"🧙": {
	name: "mage",
	slug: "mage",
	group: "People & Body",
	emoji_version: "5.0",
	unicode_version: "5.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "5.0"
},
	"🧙‍♂️": {
	name: "man mage",
	slug: "man_mage",
	group: "People & Body",
	emoji_version: "5.0",
	unicode_version: "5.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "5.0"
},
	"🧙‍♀️": {
	name: "woman mage",
	slug: "woman_mage",
	group: "People & Body",
	emoji_version: "5.0",
	unicode_version: "5.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "5.0"
},
	"🧚": {
	name: "fairy",
	slug: "fairy",
	group: "People & Body",
	emoji_version: "5.0",
	unicode_version: "5.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "5.0"
},
	"🧚‍♂️": {
	name: "man fairy",
	slug: "man_fairy",
	group: "People & Body",
	emoji_version: "5.0",
	unicode_version: "5.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "5.0"
},
	"🧚‍♀️": {
	name: "woman fairy",
	slug: "woman_fairy",
	group: "People & Body",
	emoji_version: "5.0",
	unicode_version: "5.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "5.0"
},
	"🧛": {
	name: "vampire",
	slug: "vampire",
	group: "People & Body",
	emoji_version: "5.0",
	unicode_version: "5.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "5.0"
},
	"🧛‍♂️": {
	name: "man vampire",
	slug: "man_vampire",
	group: "People & Body",
	emoji_version: "5.0",
	unicode_version: "5.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "5.0"
},
	"🧛‍♀️": {
	name: "woman vampire",
	slug: "woman_vampire",
	group: "People & Body",
	emoji_version: "5.0",
	unicode_version: "5.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "5.0"
},
	"🧜": {
	name: "merperson",
	slug: "merperson",
	group: "People & Body",
	emoji_version: "5.0",
	unicode_version: "5.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "5.0"
},
	"🧜‍♂️": {
	name: "merman",
	slug: "merman",
	group: "People & Body",
	emoji_version: "5.0",
	unicode_version: "5.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "5.0"
},
	"🧜‍♀️": {
	name: "mermaid",
	slug: "mermaid",
	group: "People & Body",
	emoji_version: "5.0",
	unicode_version: "5.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "5.0"
},
	"🧝": {
	name: "elf",
	slug: "elf",
	group: "People & Body",
	emoji_version: "5.0",
	unicode_version: "5.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "5.0"
},
	"🧝‍♂️": {
	name: "man elf",
	slug: "man_elf",
	group: "People & Body",
	emoji_version: "5.0",
	unicode_version: "5.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "5.0"
},
	"🧝‍♀️": {
	name: "woman elf",
	slug: "woman_elf",
	group: "People & Body",
	emoji_version: "5.0",
	unicode_version: "5.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "5.0"
},
	"🧞": {
	name: "genie",
	slug: "genie",
	group: "People & Body",
	emoji_version: "5.0",
	unicode_version: "5.0",
	skin_tone_support: false
},
	"🧞‍♂️": {
	name: "man genie",
	slug: "man_genie",
	group: "People & Body",
	emoji_version: "5.0",
	unicode_version: "5.0",
	skin_tone_support: false
},
	"🧞‍♀️": {
	name: "woman genie",
	slug: "woman_genie",
	group: "People & Body",
	emoji_version: "5.0",
	unicode_version: "5.0",
	skin_tone_support: false
},
	"🧟": {
	name: "zombie",
	slug: "zombie",
	group: "People & Body",
	emoji_version: "5.0",
	unicode_version: "5.0",
	skin_tone_support: false
},
	"🧟‍♂️": {
	name: "man zombie",
	slug: "man_zombie",
	group: "People & Body",
	emoji_version: "5.0",
	unicode_version: "5.0",
	skin_tone_support: false
},
	"🧟‍♀️": {
	name: "woman zombie",
	slug: "woman_zombie",
	group: "People & Body",
	emoji_version: "5.0",
	unicode_version: "5.0",
	skin_tone_support: false
},
	"🧌": {
	name: "troll",
	slug: "troll",
	group: "People & Body",
	emoji_version: "14.0",
	unicode_version: "14.0",
	skin_tone_support: false
},
	"💆": {
	name: "person getting massage",
	slug: "person_getting_massage",
	group: "People & Body",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "1.0"
},
	"💆‍♂️": {
	name: "man getting massage",
	slug: "man_getting_massage",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"💆‍♀️": {
	name: "woman getting massage",
	slug: "woman_getting_massage",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"💇": {
	name: "person getting haircut",
	slug: "person_getting_haircut",
	group: "People & Body",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "1.0"
},
	"💇‍♂️": {
	name: "man getting haircut",
	slug: "man_getting_haircut",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"💇‍♀️": {
	name: "woman getting haircut",
	slug: "woman_getting_haircut",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"🚶": {
	name: "person walking",
	slug: "person_walking",
	group: "People & Body",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "1.0"
},
	"🚶‍♂️": {
	name: "man walking",
	slug: "man_walking",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"🚶‍♀️": {
	name: "woman walking",
	slug: "woman_walking",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"🧍": {
	name: "person standing",
	slug: "person_standing",
	group: "People & Body",
	emoji_version: "12.0",
	unicode_version: "12.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "12.0"
},
	"🧍‍♂️": {
	name: "man standing",
	slug: "man_standing",
	group: "People & Body",
	emoji_version: "12.0",
	unicode_version: "12.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "12.0"
},
	"🧍‍♀️": {
	name: "woman standing",
	slug: "woman_standing",
	group: "People & Body",
	emoji_version: "12.0",
	unicode_version: "12.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "12.0"
},
	"🧎": {
	name: "person kneeling",
	slug: "person_kneeling",
	group: "People & Body",
	emoji_version: "12.0",
	unicode_version: "12.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "12.0"
},
	"🧎‍♂️": {
	name: "man kneeling",
	slug: "man_kneeling",
	group: "People & Body",
	emoji_version: "12.0",
	unicode_version: "12.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "12.0"
},
	"🧎‍♀️": {
	name: "woman kneeling",
	slug: "woman_kneeling",
	group: "People & Body",
	emoji_version: "12.0",
	unicode_version: "12.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "12.0"
},
	"🧑‍🦯": {
	name: "person with white cane",
	slug: "person_with_white_cane",
	group: "People & Body",
	emoji_version: "12.1",
	unicode_version: "12.1",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "12.1"
},
	"👨‍🦯": {
	name: "man with white cane",
	slug: "man_with_white_cane",
	group: "People & Body",
	emoji_version: "12.0",
	unicode_version: "12.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "12.0"
},
	"👩‍🦯": {
	name: "woman with white cane",
	slug: "woman_with_white_cane",
	group: "People & Body",
	emoji_version: "12.0",
	unicode_version: "12.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "12.0"
},
	"🧑‍🦼": {
	name: "person in motorized wheelchair",
	slug: "person_in_motorized_wheelchair",
	group: "People & Body",
	emoji_version: "12.1",
	unicode_version: "12.1",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "12.1"
},
	"👨‍🦼": {
	name: "man in motorized wheelchair",
	slug: "man_in_motorized_wheelchair",
	group: "People & Body",
	emoji_version: "12.0",
	unicode_version: "12.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "12.0"
},
	"👩‍🦼": {
	name: "woman in motorized wheelchair",
	slug: "woman_in_motorized_wheelchair",
	group: "People & Body",
	emoji_version: "12.0",
	unicode_version: "12.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "12.0"
},
	"🧑‍🦽": {
	name: "person in manual wheelchair",
	slug: "person_in_manual_wheelchair",
	group: "People & Body",
	emoji_version: "12.1",
	unicode_version: "12.1",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "12.1"
},
	"👨‍🦽": {
	name: "man in manual wheelchair",
	slug: "man_in_manual_wheelchair",
	group: "People & Body",
	emoji_version: "12.0",
	unicode_version: "12.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "12.0"
},
	"👩‍🦽": {
	name: "woman in manual wheelchair",
	slug: "woman_in_manual_wheelchair",
	group: "People & Body",
	emoji_version: "12.0",
	unicode_version: "12.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "12.0"
},
	"🏃": {
	name: "person running",
	slug: "person_running",
	group: "People & Body",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "1.0"
},
	"🏃‍♂️": {
	name: "man running",
	slug: "man_running",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"🏃‍♀️": {
	name: "woman running",
	slug: "woman_running",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"💃": {
	name: "woman dancing",
	slug: "woman_dancing",
	group: "People & Body",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "1.0"
},
	"🕺": {
	name: "man dancing",
	slug: "man_dancing",
	group: "People & Body",
	emoji_version: "3.0",
	unicode_version: "3.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "3.0"
},
	"🕴️": {
	name: "person in suit levitating",
	slug: "person_in_suit_levitating",
	group: "People & Body",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"👯": {
	name: "people with bunny ears",
	slug: "people_with_bunny_ears",
	group: "People & Body",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"👯‍♂️": {
	name: "men with bunny ears",
	slug: "men_with_bunny_ears",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: false
},
	"👯‍♀️": {
	name: "women with bunny ears",
	slug: "women_with_bunny_ears",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: false
},
	"🧖": {
	name: "person in steamy room",
	slug: "person_in_steamy_room",
	group: "People & Body",
	emoji_version: "5.0",
	unicode_version: "5.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "5.0"
},
	"🧖‍♂️": {
	name: "man in steamy room",
	slug: "man_in_steamy_room",
	group: "People & Body",
	emoji_version: "5.0",
	unicode_version: "5.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "5.0"
},
	"🧖‍♀️": {
	name: "woman in steamy room",
	slug: "woman_in_steamy_room",
	group: "People & Body",
	emoji_version: "5.0",
	unicode_version: "5.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "5.0"
},
	"🧗": {
	name: "person climbing",
	slug: "person_climbing",
	group: "People & Body",
	emoji_version: "5.0",
	unicode_version: "5.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "5.0"
},
	"🧗‍♂️": {
	name: "man climbing",
	slug: "man_climbing",
	group: "People & Body",
	emoji_version: "5.0",
	unicode_version: "5.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "5.0"
},
	"🧗‍♀️": {
	name: "woman climbing",
	slug: "woman_climbing",
	group: "People & Body",
	emoji_version: "5.0",
	unicode_version: "5.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "5.0"
},
	"🤺": {
	name: "person fencing",
	slug: "person_fencing",
	group: "People & Body",
	emoji_version: "3.0",
	unicode_version: "3.0",
	skin_tone_support: false
},
	"🏇": {
	name: "horse racing",
	slug: "horse_racing",
	group: "People & Body",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "1.0"
},
	"⛷️": {
	name: "skier",
	slug: "skier",
	group: "People & Body",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🏂": {
	name: "snowboarder",
	slug: "snowboarder",
	group: "People & Body",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "1.0"
},
	"🏌️": {
	name: "person golfing",
	slug: "person_golfing",
	group: "People & Body",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"🏌️‍♂️": {
	name: "man golfing",
	slug: "man_golfing",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"🏌️‍♀️": {
	name: "woman golfing",
	slug: "woman_golfing",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"🏄": {
	name: "person surfing",
	slug: "person_surfing",
	group: "People & Body",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "1.0"
},
	"🏄‍♂️": {
	name: "man surfing",
	slug: "man_surfing",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"🏄‍♀️": {
	name: "woman surfing",
	slug: "woman_surfing",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"🚣": {
	name: "person rowing boat",
	slug: "person_rowing_boat",
	group: "People & Body",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "1.0"
},
	"🚣‍♂️": {
	name: "man rowing boat",
	slug: "man_rowing_boat",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"🚣‍♀️": {
	name: "woman rowing boat",
	slug: "woman_rowing_boat",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"🏊": {
	name: "person swimming",
	slug: "person_swimming",
	group: "People & Body",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "1.0"
},
	"🏊‍♂️": {
	name: "man swimming",
	slug: "man_swimming",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"🏊‍♀️": {
	name: "woman swimming",
	slug: "woman_swimming",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"⛹️": {
	name: "person bouncing ball",
	slug: "person_bouncing_ball",
	group: "People & Body",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "2.0"
},
	"⛹️‍♂️": {
	name: "man bouncing ball",
	slug: "man_bouncing_ball",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"⛹️‍♀️": {
	name: "woman bouncing ball",
	slug: "woman_bouncing_ball",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"🏋️": {
	name: "person lifting weights",
	slug: "person_lifting_weights",
	group: "People & Body",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "2.0"
},
	"🏋️‍♂️": {
	name: "man lifting weights",
	slug: "man_lifting_weights",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"🏋️‍♀️": {
	name: "woman lifting weights",
	slug: "woman_lifting_weights",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"🚴": {
	name: "person biking",
	slug: "person_biking",
	group: "People & Body",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "1.0"
},
	"🚴‍♂️": {
	name: "man biking",
	slug: "man_biking",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"🚴‍♀️": {
	name: "woman biking",
	slug: "woman_biking",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"🚵": {
	name: "person mountain biking",
	slug: "person_mountain_biking",
	group: "People & Body",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "1.0"
},
	"🚵‍♂️": {
	name: "man mountain biking",
	slug: "man_mountain_biking",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"🚵‍♀️": {
	name: "woman mountain biking",
	slug: "woman_mountain_biking",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"🤸": {
	name: "person cartwheeling",
	slug: "person_cartwheeling",
	group: "People & Body",
	emoji_version: "3.0",
	unicode_version: "3.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "3.0"
},
	"🤸‍♂️": {
	name: "man cartwheeling",
	slug: "man_cartwheeling",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"🤸‍♀️": {
	name: "woman cartwheeling",
	slug: "woman_cartwheeling",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"🤼": {
	name: "people wrestling",
	slug: "people_wrestling",
	group: "People & Body",
	emoji_version: "3.0",
	unicode_version: "3.0",
	skin_tone_support: false
},
	"🤼‍♂️": {
	name: "men wrestling",
	slug: "men_wrestling",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: false
},
	"🤼‍♀️": {
	name: "women wrestling",
	slug: "women_wrestling",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: false
},
	"🤽": {
	name: "person playing water polo",
	slug: "person_playing_water_polo",
	group: "People & Body",
	emoji_version: "3.0",
	unicode_version: "3.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "3.0"
},
	"🤽‍♂️": {
	name: "man playing water polo",
	slug: "man_playing_water_polo",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"🤽‍♀️": {
	name: "woman playing water polo",
	slug: "woman_playing_water_polo",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"🤾": {
	name: "person playing handball",
	slug: "person_playing_handball",
	group: "People & Body",
	emoji_version: "3.0",
	unicode_version: "3.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "3.0"
},
	"🤾‍♂️": {
	name: "man playing handball",
	slug: "man_playing_handball",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"🤾‍♀️": {
	name: "woman playing handball",
	slug: "woman_playing_handball",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"🤹": {
	name: "person juggling",
	slug: "person_juggling",
	group: "People & Body",
	emoji_version: "3.0",
	unicode_version: "3.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "3.0"
},
	"🤹‍♂️": {
	name: "man juggling",
	slug: "man_juggling",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"🤹‍♀️": {
	name: "woman juggling",
	slug: "woman_juggling",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"🧘": {
	name: "person in lotus position",
	slug: "person_in_lotus_position",
	group: "People & Body",
	emoji_version: "5.0",
	unicode_version: "5.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "5.0"
},
	"🧘‍♂️": {
	name: "man in lotus position",
	slug: "man_in_lotus_position",
	group: "People & Body",
	emoji_version: "5.0",
	unicode_version: "5.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "5.0"
},
	"🧘‍♀️": {
	name: "woman in lotus position",
	slug: "woman_in_lotus_position",
	group: "People & Body",
	emoji_version: "5.0",
	unicode_version: "5.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "5.0"
},
	"🛀": {
	name: "person taking bath",
	slug: "person_taking_bath",
	group: "People & Body",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "1.0"
},
	"🛌": {
	name: "person in bed",
	slug: "person_in_bed",
	group: "People & Body",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "4.0"
},
	"🧑‍🤝‍🧑": {
	name: "people holding hands",
	slug: "people_holding_hands",
	group: "People & Body",
	emoji_version: "12.0",
	unicode_version: "12.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "12.0"
},
	"👭": {
	name: "women holding hands",
	slug: "women_holding_hands",
	group: "People & Body",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "12.0"
},
	"👫": {
	name: "woman and man holding hands",
	slug: "woman_and_man_holding_hands",
	group: "People & Body",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "12.0"
},
	"👬": {
	name: "men holding hands",
	slug: "men_holding_hands",
	group: "People & Body",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "12.0"
},
	"💏": {
	name: "kiss",
	slug: "kiss",
	group: "People & Body",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "13.1"
},
	"👩‍❤️‍💋‍👨": {
	name: "kiss woman, man",
	slug: "kiss_woman_man",
	group: "People & Body",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "13.1"
},
	"👨‍❤️‍💋‍👨": {
	name: "kiss man, man",
	slug: "kiss_man_man",
	group: "People & Body",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "13.1"
},
	"👩‍❤️‍💋‍👩": {
	name: "kiss woman, woman",
	slug: "kiss_woman_woman",
	group: "People & Body",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "13.1"
},
	"💑": {
	name: "couple with heart",
	slug: "couple_with_heart",
	group: "People & Body",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "13.1"
},
	"👩‍❤️‍👨": {
	name: "couple with heart woman, man",
	slug: "couple_with_heart_woman_man",
	group: "People & Body",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "13.1"
},
	"👨‍❤️‍👨": {
	name: "couple with heart man, man",
	slug: "couple_with_heart_man_man",
	group: "People & Body",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "13.1"
},
	"👩‍❤️‍👩": {
	name: "couple with heart woman, woman",
	slug: "couple_with_heart_woman_woman",
	group: "People & Body",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: true,
	skin_tone_support_unicode_version: "13.1"
},
	"👪": {
	name: "family",
	slug: "family",
	group: "People & Body",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"👨‍👩‍👦": {
	name: "family man, woman, boy",
	slug: "family_man_woman_boy",
	group: "People & Body",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"👨‍👩‍👧": {
	name: "family man, woman, girl",
	slug: "family_man_woman_girl",
	group: "People & Body",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"👨‍👩‍👧‍👦": {
	name: "family man, woman, girl, boy",
	slug: "family_man_woman_girl_boy",
	group: "People & Body",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"👨‍👩‍👦‍👦": {
	name: "family man, woman, boy, boy",
	slug: "family_man_woman_boy_boy",
	group: "People & Body",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"👨‍👩‍👧‍👧": {
	name: "family man, woman, girl, girl",
	slug: "family_man_woman_girl_girl",
	group: "People & Body",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"👨‍👨‍👦": {
	name: "family man, man, boy",
	slug: "family_man_man_boy",
	group: "People & Body",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"👨‍👨‍👧": {
	name: "family man, man, girl",
	slug: "family_man_man_girl",
	group: "People & Body",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"👨‍👨‍👧‍👦": {
	name: "family man, man, girl, boy",
	slug: "family_man_man_girl_boy",
	group: "People & Body",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"👨‍👨‍👦‍👦": {
	name: "family man, man, boy, boy",
	slug: "family_man_man_boy_boy",
	group: "People & Body",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"👨‍👨‍👧‍👧": {
	name: "family man, man, girl, girl",
	slug: "family_man_man_girl_girl",
	group: "People & Body",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"👩‍👩‍👦": {
	name: "family woman, woman, boy",
	slug: "family_woman_woman_boy",
	group: "People & Body",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"👩‍👩‍👧": {
	name: "family woman, woman, girl",
	slug: "family_woman_woman_girl",
	group: "People & Body",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"👩‍👩‍👧‍👦": {
	name: "family woman, woman, girl, boy",
	slug: "family_woman_woman_girl_boy",
	group: "People & Body",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"👩‍👩‍👦‍👦": {
	name: "family woman, woman, boy, boy",
	slug: "family_woman_woman_boy_boy",
	group: "People & Body",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"👩‍👩‍👧‍👧": {
	name: "family woman, woman, girl, girl",
	slug: "family_woman_woman_girl_girl",
	group: "People & Body",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"👨‍👦": {
	name: "family man, boy",
	slug: "family_man_boy",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: false
},
	"👨‍👦‍👦": {
	name: "family man, boy, boy",
	slug: "family_man_boy_boy",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: false
},
	"👨‍👧": {
	name: "family man, girl",
	slug: "family_man_girl",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: false
},
	"👨‍👧‍👦": {
	name: "family man, girl, boy",
	slug: "family_man_girl_boy",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: false
},
	"👨‍👧‍👧": {
	name: "family man, girl, girl",
	slug: "family_man_girl_girl",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: false
},
	"👩‍👦": {
	name: "family woman, boy",
	slug: "family_woman_boy",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: false
},
	"👩‍👦‍👦": {
	name: "family woman, boy, boy",
	slug: "family_woman_boy_boy",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: false
},
	"👩‍👧": {
	name: "family woman, girl",
	slug: "family_woman_girl",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: false
},
	"👩‍👧‍👦": {
	name: "family woman, girl, boy",
	slug: "family_woman_girl_boy",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: false
},
	"👩‍👧‍👧": {
	name: "family woman, girl, girl",
	slug: "family_woman_girl_girl",
	group: "People & Body",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: false
},
	"🗣️": {
	name: "speaking head",
	slug: "speaking_head",
	group: "People & Body",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"👤": {
	name: "bust in silhouette",
	slug: "bust_in_silhouette",
	group: "People & Body",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"👥": {
	name: "busts in silhouette",
	slug: "busts_in_silhouette",
	group: "People & Body",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🫂": {
	name: "people hugging",
	slug: "people_hugging",
	group: "People & Body",
	emoji_version: "13.0",
	unicode_version: "13.0",
	skin_tone_support: false
},
	"👣": {
	name: "footprints",
	slug: "footprints",
	group: "People & Body",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🐵": {
	name: "monkey face",
	slug: "monkey_face",
	group: "Animals & Nature",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🐒": {
	name: "monkey",
	slug: "monkey",
	group: "Animals & Nature",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🦍": {
	name: "gorilla",
	slug: "gorilla",
	group: "Animals & Nature",
	emoji_version: "3.0",
	unicode_version: "3.0",
	skin_tone_support: false
},
	"🦧": {
	name: "orangutan",
	slug: "orangutan",
	group: "Animals & Nature",
	emoji_version: "12.0",
	unicode_version: "12.0",
	skin_tone_support: false
},
	"🐶": {
	name: "dog face",
	slug: "dog_face",
	group: "Animals & Nature",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🐕": {
	name: "dog",
	slug: "dog",
	group: "Animals & Nature",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🦮": {
	name: "guide dog",
	slug: "guide_dog",
	group: "Animals & Nature",
	emoji_version: "12.0",
	unicode_version: "12.0",
	skin_tone_support: false
},
	"🐕‍🦺": {
	name: "service dog",
	slug: "service_dog",
	group: "Animals & Nature",
	emoji_version: "12.0",
	unicode_version: "12.0",
	skin_tone_support: false
},
	"🐩": {
	name: "poodle",
	slug: "poodle",
	group: "Animals & Nature",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🐺": {
	name: "wolf",
	slug: "wolf",
	group: "Animals & Nature",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🦊": {
	name: "fox",
	slug: "fox",
	group: "Animals & Nature",
	emoji_version: "3.0",
	unicode_version: "3.0",
	skin_tone_support: false
},
	"🦝": {
	name: "raccoon",
	slug: "raccoon",
	group: "Animals & Nature",
	emoji_version: "11.0",
	unicode_version: "11.0",
	skin_tone_support: false
},
	"🐱": {
	name: "cat face",
	slug: "cat_face",
	group: "Animals & Nature",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🐈": {
	name: "cat",
	slug: "cat",
	group: "Animals & Nature",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🐈‍⬛": {
	name: "black cat",
	slug: "black_cat",
	group: "Animals & Nature",
	emoji_version: "13.0",
	unicode_version: "13.0",
	skin_tone_support: false
},
	"🦁": {
	name: "lion",
	slug: "lion",
	group: "Animals & Nature",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🐯": {
	name: "tiger face",
	slug: "tiger_face",
	group: "Animals & Nature",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🐅": {
	name: "tiger",
	slug: "tiger",
	group: "Animals & Nature",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🐆": {
	name: "leopard",
	slug: "leopard",
	group: "Animals & Nature",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🐴": {
	name: "horse face",
	slug: "horse_face",
	group: "Animals & Nature",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🫎": {
	name: "moose",
	slug: "moose",
	group: "Animals & Nature",
	emoji_version: "15.0",
	unicode_version: "15.0",
	skin_tone_support: false
},
	"🫏": {
	name: "donkey",
	slug: "donkey",
	group: "Animals & Nature",
	emoji_version: "15.0",
	unicode_version: "15.0",
	skin_tone_support: false
},
	"🐎": {
	name: "horse",
	slug: "horse",
	group: "Animals & Nature",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🦄": {
	name: "unicorn",
	slug: "unicorn",
	group: "Animals & Nature",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🦓": {
	name: "zebra",
	slug: "zebra",
	group: "Animals & Nature",
	emoji_version: "5.0",
	unicode_version: "5.0",
	skin_tone_support: false
},
	"🦌": {
	name: "deer",
	slug: "deer",
	group: "Animals & Nature",
	emoji_version: "3.0",
	unicode_version: "3.0",
	skin_tone_support: false
},
	"🦬": {
	name: "bison",
	slug: "bison",
	group: "Animals & Nature",
	emoji_version: "13.0",
	unicode_version: "13.0",
	skin_tone_support: false
},
	"🐮": {
	name: "cow face",
	slug: "cow_face",
	group: "Animals & Nature",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🐂": {
	name: "ox",
	slug: "ox",
	group: "Animals & Nature",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🐃": {
	name: "water buffalo",
	slug: "water_buffalo",
	group: "Animals & Nature",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🐄": {
	name: "cow",
	slug: "cow",
	group: "Animals & Nature",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🐷": {
	name: "pig face",
	slug: "pig_face",
	group: "Animals & Nature",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🐖": {
	name: "pig",
	slug: "pig",
	group: "Animals & Nature",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🐗": {
	name: "boar",
	slug: "boar",
	group: "Animals & Nature",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🐽": {
	name: "pig nose",
	slug: "pig_nose",
	group: "Animals & Nature",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🐏": {
	name: "ram",
	slug: "ram",
	group: "Animals & Nature",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🐑": {
	name: "ewe",
	slug: "ewe",
	group: "Animals & Nature",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🐐": {
	name: "goat",
	slug: "goat",
	group: "Animals & Nature",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🐪": {
	name: "camel",
	slug: "camel",
	group: "Animals & Nature",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🐫": {
	name: "two-hump camel",
	slug: "two_hump_camel",
	group: "Animals & Nature",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🦙": {
	name: "llama",
	slug: "llama",
	group: "Animals & Nature",
	emoji_version: "11.0",
	unicode_version: "11.0",
	skin_tone_support: false
},
	"🦒": {
	name: "giraffe",
	slug: "giraffe",
	group: "Animals & Nature",
	emoji_version: "5.0",
	unicode_version: "5.0",
	skin_tone_support: false
},
	"🐘": {
	name: "elephant",
	slug: "elephant",
	group: "Animals & Nature",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🦣": {
	name: "mammoth",
	slug: "mammoth",
	group: "Animals & Nature",
	emoji_version: "13.0",
	unicode_version: "13.0",
	skin_tone_support: false
},
	"🦏": {
	name: "rhinoceros",
	slug: "rhinoceros",
	group: "Animals & Nature",
	emoji_version: "3.0",
	unicode_version: "3.0",
	skin_tone_support: false
},
	"🦛": {
	name: "hippopotamus",
	slug: "hippopotamus",
	group: "Animals & Nature",
	emoji_version: "11.0",
	unicode_version: "11.0",
	skin_tone_support: false
},
	"🐭": {
	name: "mouse face",
	slug: "mouse_face",
	group: "Animals & Nature",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🐁": {
	name: "mouse",
	slug: "mouse",
	group: "Animals & Nature",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🐀": {
	name: "rat",
	slug: "rat",
	group: "Animals & Nature",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🐹": {
	name: "hamster",
	slug: "hamster",
	group: "Animals & Nature",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🐰": {
	name: "rabbit face",
	slug: "rabbit_face",
	group: "Animals & Nature",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🐇": {
	name: "rabbit",
	slug: "rabbit",
	group: "Animals & Nature",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🐿️": {
	name: "chipmunk",
	slug: "chipmunk",
	group: "Animals & Nature",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🦫": {
	name: "beaver",
	slug: "beaver",
	group: "Animals & Nature",
	emoji_version: "13.0",
	unicode_version: "13.0",
	skin_tone_support: false
},
	"🦔": {
	name: "hedgehog",
	slug: "hedgehog",
	group: "Animals & Nature",
	emoji_version: "5.0",
	unicode_version: "5.0",
	skin_tone_support: false
},
	"🦇": {
	name: "bat",
	slug: "bat",
	group: "Animals & Nature",
	emoji_version: "3.0",
	unicode_version: "3.0",
	skin_tone_support: false
},
	"🐻": {
	name: "bear",
	slug: "bear",
	group: "Animals & Nature",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🐻‍❄️": {
	name: "polar bear",
	slug: "polar_bear",
	group: "Animals & Nature",
	emoji_version: "13.0",
	unicode_version: "13.0",
	skin_tone_support: false
},
	"🐨": {
	name: "koala",
	slug: "koala",
	group: "Animals & Nature",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🐼": {
	name: "panda",
	slug: "panda",
	group: "Animals & Nature",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🦥": {
	name: "sloth",
	slug: "sloth",
	group: "Animals & Nature",
	emoji_version: "12.0",
	unicode_version: "12.0",
	skin_tone_support: false
},
	"🦦": {
	name: "otter",
	slug: "otter",
	group: "Animals & Nature",
	emoji_version: "12.0",
	unicode_version: "12.0",
	skin_tone_support: false
},
	"🦨": {
	name: "skunk",
	slug: "skunk",
	group: "Animals & Nature",
	emoji_version: "12.0",
	unicode_version: "12.0",
	skin_tone_support: false
},
	"🦘": {
	name: "kangaroo",
	slug: "kangaroo",
	group: "Animals & Nature",
	emoji_version: "11.0",
	unicode_version: "11.0",
	skin_tone_support: false
},
	"🦡": {
	name: "badger",
	slug: "badger",
	group: "Animals & Nature",
	emoji_version: "11.0",
	unicode_version: "11.0",
	skin_tone_support: false
},
	"🐾": {
	name: "paw prints",
	slug: "paw_prints",
	group: "Animals & Nature",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🦃": {
	name: "turkey",
	slug: "turkey",
	group: "Animals & Nature",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🐔": {
	name: "chicken",
	slug: "chicken",
	group: "Animals & Nature",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🐓": {
	name: "rooster",
	slug: "rooster",
	group: "Animals & Nature",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🐣": {
	name: "hatching chick",
	slug: "hatching_chick",
	group: "Animals & Nature",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🐤": {
	name: "baby chick",
	slug: "baby_chick",
	group: "Animals & Nature",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🐥": {
	name: "front-facing baby chick",
	slug: "front_facing_baby_chick",
	group: "Animals & Nature",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🐦": {
	name: "bird",
	slug: "bird",
	group: "Animals & Nature",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🐧": {
	name: "penguin",
	slug: "penguin",
	group: "Animals & Nature",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🕊️": {
	name: "dove",
	slug: "dove",
	group: "Animals & Nature",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🦅": {
	name: "eagle",
	slug: "eagle",
	group: "Animals & Nature",
	emoji_version: "3.0",
	unicode_version: "3.0",
	skin_tone_support: false
},
	"🦆": {
	name: "duck",
	slug: "duck",
	group: "Animals & Nature",
	emoji_version: "3.0",
	unicode_version: "3.0",
	skin_tone_support: false
},
	"🦢": {
	name: "swan",
	slug: "swan",
	group: "Animals & Nature",
	emoji_version: "11.0",
	unicode_version: "11.0",
	skin_tone_support: false
},
	"🦉": {
	name: "owl",
	slug: "owl",
	group: "Animals & Nature",
	emoji_version: "3.0",
	unicode_version: "3.0",
	skin_tone_support: false
},
	"🦤": {
	name: "dodo",
	slug: "dodo",
	group: "Animals & Nature",
	emoji_version: "13.0",
	unicode_version: "13.0",
	skin_tone_support: false
},
	"🪶": {
	name: "feather",
	slug: "feather",
	group: "Animals & Nature",
	emoji_version: "13.0",
	unicode_version: "13.0",
	skin_tone_support: false
},
	"🦩": {
	name: "flamingo",
	slug: "flamingo",
	group: "Animals & Nature",
	emoji_version: "12.0",
	unicode_version: "12.0",
	skin_tone_support: false
},
	"🦚": {
	name: "peacock",
	slug: "peacock",
	group: "Animals & Nature",
	emoji_version: "11.0",
	unicode_version: "11.0",
	skin_tone_support: false
},
	"🦜": {
	name: "parrot",
	slug: "parrot",
	group: "Animals & Nature",
	emoji_version: "11.0",
	unicode_version: "11.0",
	skin_tone_support: false
},
	"🪽": {
	name: "wing",
	slug: "wing",
	group: "Animals & Nature",
	emoji_version: "15.0",
	unicode_version: "15.0",
	skin_tone_support: false
},
	"🐦‍⬛": {
	name: "black bird",
	slug: "black_bird",
	group: "Animals & Nature",
	emoji_version: "15.0",
	unicode_version: "15.0",
	skin_tone_support: false
},
	"🪿": {
	name: "goose",
	slug: "goose",
	group: "Animals & Nature",
	emoji_version: "15.0",
	unicode_version: "15.0",
	skin_tone_support: false
},
	"🐸": {
	name: "frog",
	slug: "frog",
	group: "Animals & Nature",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🐊": {
	name: "crocodile",
	slug: "crocodile",
	group: "Animals & Nature",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🐢": {
	name: "turtle",
	slug: "turtle",
	group: "Animals & Nature",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🦎": {
	name: "lizard",
	slug: "lizard",
	group: "Animals & Nature",
	emoji_version: "3.0",
	unicode_version: "3.0",
	skin_tone_support: false
},
	"🐍": {
	name: "snake",
	slug: "snake",
	group: "Animals & Nature",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🐲": {
	name: "dragon face",
	slug: "dragon_face",
	group: "Animals & Nature",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🐉": {
	name: "dragon",
	slug: "dragon",
	group: "Animals & Nature",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🦕": {
	name: "sauropod",
	slug: "sauropod",
	group: "Animals & Nature",
	emoji_version: "5.0",
	unicode_version: "5.0",
	skin_tone_support: false
},
	"🦖": {
	name: "T-Rex",
	slug: "t_rex",
	group: "Animals & Nature",
	emoji_version: "5.0",
	unicode_version: "5.0",
	skin_tone_support: false
},
	"🐳": {
	name: "spouting whale",
	slug: "spouting_whale",
	group: "Animals & Nature",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🐋": {
	name: "whale",
	slug: "whale",
	group: "Animals & Nature",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🐬": {
	name: "dolphin",
	slug: "dolphin",
	group: "Animals & Nature",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🦭": {
	name: "seal",
	slug: "seal",
	group: "Animals & Nature",
	emoji_version: "13.0",
	unicode_version: "13.0",
	skin_tone_support: false
},
	"🐟": {
	name: "fish",
	slug: "fish",
	group: "Animals & Nature",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🐠": {
	name: "tropical fish",
	slug: "tropical_fish",
	group: "Animals & Nature",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🐡": {
	name: "blowfish",
	slug: "blowfish",
	group: "Animals & Nature",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🦈": {
	name: "shark",
	slug: "shark",
	group: "Animals & Nature",
	emoji_version: "3.0",
	unicode_version: "3.0",
	skin_tone_support: false
},
	"🐙": {
	name: "octopus",
	slug: "octopus",
	group: "Animals & Nature",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🐚": {
	name: "spiral shell",
	slug: "spiral_shell",
	group: "Animals & Nature",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🪸": {
	name: "coral",
	slug: "coral",
	group: "Animals & Nature",
	emoji_version: "14.0",
	unicode_version: "14.0",
	skin_tone_support: false
},
	"🪼": {
	name: "jellyfish",
	slug: "jellyfish",
	group: "Animals & Nature",
	emoji_version: "15.0",
	unicode_version: "15.0",
	skin_tone_support: false
},
	"🐌": {
	name: "snail",
	slug: "snail",
	group: "Animals & Nature",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🦋": {
	name: "butterfly",
	slug: "butterfly",
	group: "Animals & Nature",
	emoji_version: "3.0",
	unicode_version: "3.0",
	skin_tone_support: false
},
	"🐛": {
	name: "bug",
	slug: "bug",
	group: "Animals & Nature",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🐜": {
	name: "ant",
	slug: "ant",
	group: "Animals & Nature",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🐝": {
	name: "honeybee",
	slug: "honeybee",
	group: "Animals & Nature",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🪲": {
	name: "beetle",
	slug: "beetle",
	group: "Animals & Nature",
	emoji_version: "13.0",
	unicode_version: "13.0",
	skin_tone_support: false
},
	"🐞": {
	name: "lady beetle",
	slug: "lady_beetle",
	group: "Animals & Nature",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🦗": {
	name: "cricket",
	slug: "cricket",
	group: "Animals & Nature",
	emoji_version: "5.0",
	unicode_version: "5.0",
	skin_tone_support: false
},
	"🪳": {
	name: "cockroach",
	slug: "cockroach",
	group: "Animals & Nature",
	emoji_version: "13.0",
	unicode_version: "13.0",
	skin_tone_support: false
},
	"🕷️": {
	name: "spider",
	slug: "spider",
	group: "Animals & Nature",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🕸️": {
	name: "spider web",
	slug: "spider_web",
	group: "Animals & Nature",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🦂": {
	name: "scorpion",
	slug: "scorpion",
	group: "Animals & Nature",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🦟": {
	name: "mosquito",
	slug: "mosquito",
	group: "Animals & Nature",
	emoji_version: "11.0",
	unicode_version: "11.0",
	skin_tone_support: false
},
	"🪰": {
	name: "fly",
	slug: "fly",
	group: "Animals & Nature",
	emoji_version: "13.0",
	unicode_version: "13.0",
	skin_tone_support: false
},
	"🪱": {
	name: "worm",
	slug: "worm",
	group: "Animals & Nature",
	emoji_version: "13.0",
	unicode_version: "13.0",
	skin_tone_support: false
},
	"🦠": {
	name: "microbe",
	slug: "microbe",
	group: "Animals & Nature",
	emoji_version: "11.0",
	unicode_version: "11.0",
	skin_tone_support: false
},
	"💐": {
	name: "bouquet",
	slug: "bouquet",
	group: "Animals & Nature",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🌸": {
	name: "cherry blossom",
	slug: "cherry_blossom",
	group: "Animals & Nature",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"💮": {
	name: "white flower",
	slug: "white_flower",
	group: "Animals & Nature",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🪷": {
	name: "lotus",
	slug: "lotus",
	group: "Animals & Nature",
	emoji_version: "14.0",
	unicode_version: "14.0",
	skin_tone_support: false
},
	"🏵️": {
	name: "rosette",
	slug: "rosette",
	group: "Animals & Nature",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🌹": {
	name: "rose",
	slug: "rose",
	group: "Animals & Nature",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🥀": {
	name: "wilted flower",
	slug: "wilted_flower",
	group: "Animals & Nature",
	emoji_version: "3.0",
	unicode_version: "3.0",
	skin_tone_support: false
},
	"🌺": {
	name: "hibiscus",
	slug: "hibiscus",
	group: "Animals & Nature",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🌻": {
	name: "sunflower",
	slug: "sunflower",
	group: "Animals & Nature",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🌼": {
	name: "blossom",
	slug: "blossom",
	group: "Animals & Nature",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🌷": {
	name: "tulip",
	slug: "tulip",
	group: "Animals & Nature",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🪻": {
	name: "hyacinth",
	slug: "hyacinth",
	group: "Animals & Nature",
	emoji_version: "15.0",
	unicode_version: "15.0",
	skin_tone_support: false
},
	"🌱": {
	name: "seedling",
	slug: "seedling",
	group: "Animals & Nature",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🪴": {
	name: "potted plant",
	slug: "potted_plant",
	group: "Animals & Nature",
	emoji_version: "13.0",
	unicode_version: "13.0",
	skin_tone_support: false
},
	"🌲": {
	name: "evergreen tree",
	slug: "evergreen_tree",
	group: "Animals & Nature",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🌳": {
	name: "deciduous tree",
	slug: "deciduous_tree",
	group: "Animals & Nature",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🌴": {
	name: "palm tree",
	slug: "palm_tree",
	group: "Animals & Nature",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🌵": {
	name: "cactus",
	slug: "cactus",
	group: "Animals & Nature",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🌾": {
	name: "sheaf of rice",
	slug: "sheaf_of_rice",
	group: "Animals & Nature",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🌿": {
	name: "herb",
	slug: "herb",
	group: "Animals & Nature",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"☘️": {
	name: "shamrock",
	slug: "shamrock",
	group: "Animals & Nature",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🍀": {
	name: "four leaf clover",
	slug: "four_leaf_clover",
	group: "Animals & Nature",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🍁": {
	name: "maple leaf",
	slug: "maple_leaf",
	group: "Animals & Nature",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🍂": {
	name: "fallen leaf",
	slug: "fallen_leaf",
	group: "Animals & Nature",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🍃": {
	name: "leaf fluttering in wind",
	slug: "leaf_fluttering_in_wind",
	group: "Animals & Nature",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🪹": {
	name: "empty nest",
	slug: "empty_nest",
	group: "Animals & Nature",
	emoji_version: "14.0",
	unicode_version: "14.0",
	skin_tone_support: false
},
	"🪺": {
	name: "nest with eggs",
	slug: "nest_with_eggs",
	group: "Animals & Nature",
	emoji_version: "14.0",
	unicode_version: "14.0",
	skin_tone_support: false
},
	"🍄": {
	name: "mushroom",
	slug: "mushroom",
	group: "Animals & Nature",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🍇": {
	name: "grapes",
	slug: "grapes",
	group: "Food & Drink",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🍈": {
	name: "melon",
	slug: "melon",
	group: "Food & Drink",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🍉": {
	name: "watermelon",
	slug: "watermelon",
	group: "Food & Drink",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🍊": {
	name: "tangerine",
	slug: "tangerine",
	group: "Food & Drink",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🍋": {
	name: "lemon",
	slug: "lemon",
	group: "Food & Drink",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🍌": {
	name: "banana",
	slug: "banana",
	group: "Food & Drink",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🍍": {
	name: "pineapple",
	slug: "pineapple",
	group: "Food & Drink",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🥭": {
	name: "mango",
	slug: "mango",
	group: "Food & Drink",
	emoji_version: "11.0",
	unicode_version: "11.0",
	skin_tone_support: false
},
	"🍎": {
	name: "red apple",
	slug: "red_apple",
	group: "Food & Drink",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🍏": {
	name: "green apple",
	slug: "green_apple",
	group: "Food & Drink",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🍐": {
	name: "pear",
	slug: "pear",
	group: "Food & Drink",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🍑": {
	name: "peach",
	slug: "peach",
	group: "Food & Drink",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🍒": {
	name: "cherries",
	slug: "cherries",
	group: "Food & Drink",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🍓": {
	name: "strawberry",
	slug: "strawberry",
	group: "Food & Drink",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🫐": {
	name: "blueberries",
	slug: "blueberries",
	group: "Food & Drink",
	emoji_version: "13.0",
	unicode_version: "13.0",
	skin_tone_support: false
},
	"🥝": {
	name: "kiwi fruit",
	slug: "kiwi_fruit",
	group: "Food & Drink",
	emoji_version: "3.0",
	unicode_version: "3.0",
	skin_tone_support: false
},
	"🍅": {
	name: "tomato",
	slug: "tomato",
	group: "Food & Drink",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🫒": {
	name: "olive",
	slug: "olive",
	group: "Food & Drink",
	emoji_version: "13.0",
	unicode_version: "13.0",
	skin_tone_support: false
},
	"🥥": {
	name: "coconut",
	slug: "coconut",
	group: "Food & Drink",
	emoji_version: "5.0",
	unicode_version: "5.0",
	skin_tone_support: false
},
	"🥑": {
	name: "avocado",
	slug: "avocado",
	group: "Food & Drink",
	emoji_version: "3.0",
	unicode_version: "3.0",
	skin_tone_support: false
},
	"🍆": {
	name: "eggplant",
	slug: "eggplant",
	group: "Food & Drink",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🥔": {
	name: "potato",
	slug: "potato",
	group: "Food & Drink",
	emoji_version: "3.0",
	unicode_version: "3.0",
	skin_tone_support: false
},
	"🥕": {
	name: "carrot",
	slug: "carrot",
	group: "Food & Drink",
	emoji_version: "3.0",
	unicode_version: "3.0",
	skin_tone_support: false
},
	"🌽": {
	name: "ear of corn",
	slug: "ear_of_corn",
	group: "Food & Drink",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🌶️": {
	name: "hot pepper",
	slug: "hot_pepper",
	group: "Food & Drink",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🫑": {
	name: "bell pepper",
	slug: "bell_pepper",
	group: "Food & Drink",
	emoji_version: "13.0",
	unicode_version: "13.0",
	skin_tone_support: false
},
	"🥒": {
	name: "cucumber",
	slug: "cucumber",
	group: "Food & Drink",
	emoji_version: "3.0",
	unicode_version: "3.0",
	skin_tone_support: false
},
	"🥬": {
	name: "leafy green",
	slug: "leafy_green",
	group: "Food & Drink",
	emoji_version: "11.0",
	unicode_version: "11.0",
	skin_tone_support: false
},
	"🥦": {
	name: "broccoli",
	slug: "broccoli",
	group: "Food & Drink",
	emoji_version: "5.0",
	unicode_version: "5.0",
	skin_tone_support: false
},
	"🧄": {
	name: "garlic",
	slug: "garlic",
	group: "Food & Drink",
	emoji_version: "12.0",
	unicode_version: "12.0",
	skin_tone_support: false
},
	"🧅": {
	name: "onion",
	slug: "onion",
	group: "Food & Drink",
	emoji_version: "12.0",
	unicode_version: "12.0",
	skin_tone_support: false
},
	"🥜": {
	name: "peanuts",
	slug: "peanuts",
	group: "Food & Drink",
	emoji_version: "3.0",
	unicode_version: "3.0",
	skin_tone_support: false
},
	"🫘": {
	name: "beans",
	slug: "beans",
	group: "Food & Drink",
	emoji_version: "14.0",
	unicode_version: "14.0",
	skin_tone_support: false
},
	"🌰": {
	name: "chestnut",
	slug: "chestnut",
	group: "Food & Drink",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🫚": {
	name: "ginger root",
	slug: "ginger_root",
	group: "Food & Drink",
	emoji_version: "15.0",
	unicode_version: "15.0",
	skin_tone_support: false
},
	"🫛": {
	name: "pea pod",
	slug: "pea_pod",
	group: "Food & Drink",
	emoji_version: "15.0",
	unicode_version: "15.0",
	skin_tone_support: false
},
	"🍞": {
	name: "bread",
	slug: "bread",
	group: "Food & Drink",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🥐": {
	name: "croissant",
	slug: "croissant",
	group: "Food & Drink",
	emoji_version: "3.0",
	unicode_version: "3.0",
	skin_tone_support: false
},
	"🥖": {
	name: "baguette bread",
	slug: "baguette_bread",
	group: "Food & Drink",
	emoji_version: "3.0",
	unicode_version: "3.0",
	skin_tone_support: false
},
	"🫓": {
	name: "flatbread",
	slug: "flatbread",
	group: "Food & Drink",
	emoji_version: "13.0",
	unicode_version: "13.0",
	skin_tone_support: false
},
	"🥨": {
	name: "pretzel",
	slug: "pretzel",
	group: "Food & Drink",
	emoji_version: "5.0",
	unicode_version: "5.0",
	skin_tone_support: false
},
	"🥯": {
	name: "bagel",
	slug: "bagel",
	group: "Food & Drink",
	emoji_version: "11.0",
	unicode_version: "11.0",
	skin_tone_support: false
},
	"🥞": {
	name: "pancakes",
	slug: "pancakes",
	group: "Food & Drink",
	emoji_version: "3.0",
	unicode_version: "3.0",
	skin_tone_support: false
},
	"🧇": {
	name: "waffle",
	slug: "waffle",
	group: "Food & Drink",
	emoji_version: "12.0",
	unicode_version: "12.0",
	skin_tone_support: false
},
	"🧀": {
	name: "cheese wedge",
	slug: "cheese_wedge",
	group: "Food & Drink",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🍖": {
	name: "meat on bone",
	slug: "meat_on_bone",
	group: "Food & Drink",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🍗": {
	name: "poultry leg",
	slug: "poultry_leg",
	group: "Food & Drink",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🥩": {
	name: "cut of meat",
	slug: "cut_of_meat",
	group: "Food & Drink",
	emoji_version: "5.0",
	unicode_version: "5.0",
	skin_tone_support: false
},
	"🥓": {
	name: "bacon",
	slug: "bacon",
	group: "Food & Drink",
	emoji_version: "3.0",
	unicode_version: "3.0",
	skin_tone_support: false
},
	"🍔": {
	name: "hamburger",
	slug: "hamburger",
	group: "Food & Drink",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🍟": {
	name: "french fries",
	slug: "french_fries",
	group: "Food & Drink",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🍕": {
	name: "pizza",
	slug: "pizza",
	group: "Food & Drink",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🌭": {
	name: "hot dog",
	slug: "hot_dog",
	group: "Food & Drink",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🥪": {
	name: "sandwich",
	slug: "sandwich",
	group: "Food & Drink",
	emoji_version: "5.0",
	unicode_version: "5.0",
	skin_tone_support: false
},
	"🌮": {
	name: "taco",
	slug: "taco",
	group: "Food & Drink",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🌯": {
	name: "burrito",
	slug: "burrito",
	group: "Food & Drink",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🫔": {
	name: "tamale",
	slug: "tamale",
	group: "Food & Drink",
	emoji_version: "13.0",
	unicode_version: "13.0",
	skin_tone_support: false
},
	"🥙": {
	name: "stuffed flatbread",
	slug: "stuffed_flatbread",
	group: "Food & Drink",
	emoji_version: "3.0",
	unicode_version: "3.0",
	skin_tone_support: false
},
	"🧆": {
	name: "falafel",
	slug: "falafel",
	group: "Food & Drink",
	emoji_version: "12.0",
	unicode_version: "12.0",
	skin_tone_support: false
},
	"🥚": {
	name: "egg",
	slug: "egg",
	group: "Food & Drink",
	emoji_version: "3.0",
	unicode_version: "3.0",
	skin_tone_support: false
},
	"🍳": {
	name: "cooking",
	slug: "cooking",
	group: "Food & Drink",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🥘": {
	name: "shallow pan of food",
	slug: "shallow_pan_of_food",
	group: "Food & Drink",
	emoji_version: "3.0",
	unicode_version: "3.0",
	skin_tone_support: false
},
	"🍲": {
	name: "pot of food",
	slug: "pot_of_food",
	group: "Food & Drink",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🫕": {
	name: "fondue",
	slug: "fondue",
	group: "Food & Drink",
	emoji_version: "13.0",
	unicode_version: "13.0",
	skin_tone_support: false
},
	"🥣": {
	name: "bowl with spoon",
	slug: "bowl_with_spoon",
	group: "Food & Drink",
	emoji_version: "5.0",
	unicode_version: "5.0",
	skin_tone_support: false
},
	"🥗": {
	name: "green salad",
	slug: "green_salad",
	group: "Food & Drink",
	emoji_version: "3.0",
	unicode_version: "3.0",
	skin_tone_support: false
},
	"🍿": {
	name: "popcorn",
	slug: "popcorn",
	group: "Food & Drink",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🧈": {
	name: "butter",
	slug: "butter",
	group: "Food & Drink",
	emoji_version: "12.0",
	unicode_version: "12.0",
	skin_tone_support: false
},
	"🧂": {
	name: "salt",
	slug: "salt",
	group: "Food & Drink",
	emoji_version: "11.0",
	unicode_version: "11.0",
	skin_tone_support: false
},
	"🥫": {
	name: "canned food",
	slug: "canned_food",
	group: "Food & Drink",
	emoji_version: "5.0",
	unicode_version: "5.0",
	skin_tone_support: false
},
	"🍱": {
	name: "bento box",
	slug: "bento_box",
	group: "Food & Drink",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🍘": {
	name: "rice cracker",
	slug: "rice_cracker",
	group: "Food & Drink",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🍙": {
	name: "rice ball",
	slug: "rice_ball",
	group: "Food & Drink",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🍚": {
	name: "cooked rice",
	slug: "cooked_rice",
	group: "Food & Drink",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🍛": {
	name: "curry rice",
	slug: "curry_rice",
	group: "Food & Drink",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🍜": {
	name: "steaming bowl",
	slug: "steaming_bowl",
	group: "Food & Drink",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🍝": {
	name: "spaghetti",
	slug: "spaghetti",
	group: "Food & Drink",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🍠": {
	name: "roasted sweet potato",
	slug: "roasted_sweet_potato",
	group: "Food & Drink",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🍢": {
	name: "oden",
	slug: "oden",
	group: "Food & Drink",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🍣": {
	name: "sushi",
	slug: "sushi",
	group: "Food & Drink",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🍤": {
	name: "fried shrimp",
	slug: "fried_shrimp",
	group: "Food & Drink",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🍥": {
	name: "fish cake with swirl",
	slug: "fish_cake_with_swirl",
	group: "Food & Drink",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🥮": {
	name: "moon cake",
	slug: "moon_cake",
	group: "Food & Drink",
	emoji_version: "11.0",
	unicode_version: "11.0",
	skin_tone_support: false
},
	"🍡": {
	name: "dango",
	slug: "dango",
	group: "Food & Drink",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🥟": {
	name: "dumpling",
	slug: "dumpling",
	group: "Food & Drink",
	emoji_version: "5.0",
	unicode_version: "5.0",
	skin_tone_support: false
},
	"🥠": {
	name: "fortune cookie",
	slug: "fortune_cookie",
	group: "Food & Drink",
	emoji_version: "5.0",
	unicode_version: "5.0",
	skin_tone_support: false
},
	"🥡": {
	name: "takeout box",
	slug: "takeout_box",
	group: "Food & Drink",
	emoji_version: "5.0",
	unicode_version: "5.0",
	skin_tone_support: false
},
	"🦀": {
	name: "crab",
	slug: "crab",
	group: "Food & Drink",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🦞": {
	name: "lobster",
	slug: "lobster",
	group: "Food & Drink",
	emoji_version: "11.0",
	unicode_version: "11.0",
	skin_tone_support: false
},
	"🦐": {
	name: "shrimp",
	slug: "shrimp",
	group: "Food & Drink",
	emoji_version: "3.0",
	unicode_version: "3.0",
	skin_tone_support: false
},
	"🦑": {
	name: "squid",
	slug: "squid",
	group: "Food & Drink",
	emoji_version: "3.0",
	unicode_version: "3.0",
	skin_tone_support: false
},
	"🦪": {
	name: "oyster",
	slug: "oyster",
	group: "Food & Drink",
	emoji_version: "12.0",
	unicode_version: "12.0",
	skin_tone_support: false
},
	"🍦": {
	name: "soft ice cream",
	slug: "soft_ice_cream",
	group: "Food & Drink",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🍧": {
	name: "shaved ice",
	slug: "shaved_ice",
	group: "Food & Drink",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🍨": {
	name: "ice cream",
	slug: "ice_cream",
	group: "Food & Drink",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🍩": {
	name: "doughnut",
	slug: "doughnut",
	group: "Food & Drink",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🍪": {
	name: "cookie",
	slug: "cookie",
	group: "Food & Drink",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🎂": {
	name: "birthday cake",
	slug: "birthday_cake",
	group: "Food & Drink",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🍰": {
	name: "shortcake",
	slug: "shortcake",
	group: "Food & Drink",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🧁": {
	name: "cupcake",
	slug: "cupcake",
	group: "Food & Drink",
	emoji_version: "11.0",
	unicode_version: "11.0",
	skin_tone_support: false
},
	"🥧": {
	name: "pie",
	slug: "pie",
	group: "Food & Drink",
	emoji_version: "5.0",
	unicode_version: "5.0",
	skin_tone_support: false
},
	"🍫": {
	name: "chocolate bar",
	slug: "chocolate_bar",
	group: "Food & Drink",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🍬": {
	name: "candy",
	slug: "candy",
	group: "Food & Drink",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🍭": {
	name: "lollipop",
	slug: "lollipop",
	group: "Food & Drink",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🍮": {
	name: "custard",
	slug: "custard",
	group: "Food & Drink",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🍯": {
	name: "honey pot",
	slug: "honey_pot",
	group: "Food & Drink",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🍼": {
	name: "baby bottle",
	slug: "baby_bottle",
	group: "Food & Drink",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🥛": {
	name: "glass of milk",
	slug: "glass_of_milk",
	group: "Food & Drink",
	emoji_version: "3.0",
	unicode_version: "3.0",
	skin_tone_support: false
},
	"☕": {
	name: "hot beverage",
	slug: "hot_beverage",
	group: "Food & Drink",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🫖": {
	name: "teapot",
	slug: "teapot",
	group: "Food & Drink",
	emoji_version: "13.0",
	unicode_version: "13.0",
	skin_tone_support: false
},
	"🍵": {
	name: "teacup without handle",
	slug: "teacup_without_handle",
	group: "Food & Drink",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🍶": {
	name: "sake",
	slug: "sake",
	group: "Food & Drink",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🍾": {
	name: "bottle with popping cork",
	slug: "bottle_with_popping_cork",
	group: "Food & Drink",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🍷": {
	name: "wine glass",
	slug: "wine_glass",
	group: "Food & Drink",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🍸": {
	name: "cocktail glass",
	slug: "cocktail_glass",
	group: "Food & Drink",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🍹": {
	name: "tropical drink",
	slug: "tropical_drink",
	group: "Food & Drink",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🍺": {
	name: "beer mug",
	slug: "beer_mug",
	group: "Food & Drink",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🍻": {
	name: "clinking beer mugs",
	slug: "clinking_beer_mugs",
	group: "Food & Drink",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🥂": {
	name: "clinking glasses",
	slug: "clinking_glasses",
	group: "Food & Drink",
	emoji_version: "3.0",
	unicode_version: "3.0",
	skin_tone_support: false
},
	"🥃": {
	name: "tumbler glass",
	slug: "tumbler_glass",
	group: "Food & Drink",
	emoji_version: "3.0",
	unicode_version: "3.0",
	skin_tone_support: false
},
	"🫗": {
	name: "pouring liquid",
	slug: "pouring_liquid",
	group: "Food & Drink",
	emoji_version: "14.0",
	unicode_version: "14.0",
	skin_tone_support: false
},
	"🥤": {
	name: "cup with straw",
	slug: "cup_with_straw",
	group: "Food & Drink",
	emoji_version: "5.0",
	unicode_version: "5.0",
	skin_tone_support: false
},
	"🧋": {
	name: "bubble tea",
	slug: "bubble_tea",
	group: "Food & Drink",
	emoji_version: "13.0",
	unicode_version: "13.0",
	skin_tone_support: false
},
	"🧃": {
	name: "beverage box",
	slug: "beverage_box",
	group: "Food & Drink",
	emoji_version: "12.0",
	unicode_version: "12.0",
	skin_tone_support: false
},
	"🧉": {
	name: "mate",
	slug: "mate",
	group: "Food & Drink",
	emoji_version: "12.0",
	unicode_version: "12.0",
	skin_tone_support: false
},
	"🧊": {
	name: "ice",
	slug: "ice",
	group: "Food & Drink",
	emoji_version: "12.0",
	unicode_version: "12.0",
	skin_tone_support: false
},
	"🥢": {
	name: "chopsticks",
	slug: "chopsticks",
	group: "Food & Drink",
	emoji_version: "5.0",
	unicode_version: "5.0",
	skin_tone_support: false
},
	"🍽️": {
	name: "fork and knife with plate",
	slug: "fork_and_knife_with_plate",
	group: "Food & Drink",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🍴": {
	name: "fork and knife",
	slug: "fork_and_knife",
	group: "Food & Drink",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🥄": {
	name: "spoon",
	slug: "spoon",
	group: "Food & Drink",
	emoji_version: "3.0",
	unicode_version: "3.0",
	skin_tone_support: false
},
	"🔪": {
	name: "kitchen knife",
	slug: "kitchen_knife",
	group: "Food & Drink",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🫙": {
	name: "jar",
	slug: "jar",
	group: "Food & Drink",
	emoji_version: "14.0",
	unicode_version: "14.0",
	skin_tone_support: false
},
	"🏺": {
	name: "amphora",
	slug: "amphora",
	group: "Food & Drink",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🌍": {
	name: "globe showing Europe-Africa",
	slug: "globe_showing_europe_africa",
	group: "Travel & Places",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🌎": {
	name: "globe showing Americas",
	slug: "globe_showing_americas",
	group: "Travel & Places",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🌏": {
	name: "globe showing Asia-Australia",
	slug: "globe_showing_asia_australia",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🌐": {
	name: "globe with meridians",
	slug: "globe_with_meridians",
	group: "Travel & Places",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🗺️": {
	name: "world map",
	slug: "world_map",
	group: "Travel & Places",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🗾": {
	name: "map of Japan",
	slug: "map_of_japan",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🧭": {
	name: "compass",
	slug: "compass",
	group: "Travel & Places",
	emoji_version: "11.0",
	unicode_version: "11.0",
	skin_tone_support: false
},
	"🏔️": {
	name: "snow-capped mountain",
	slug: "snow_capped_mountain",
	group: "Travel & Places",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"⛰️": {
	name: "mountain",
	slug: "mountain",
	group: "Travel & Places",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🌋": {
	name: "volcano",
	slug: "volcano",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🗻": {
	name: "mount fuji",
	slug: "mount_fuji",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🏕️": {
	name: "camping",
	slug: "camping",
	group: "Travel & Places",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🏖️": {
	name: "beach with umbrella",
	slug: "beach_with_umbrella",
	group: "Travel & Places",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🏜️": {
	name: "desert",
	slug: "desert",
	group: "Travel & Places",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🏝️": {
	name: "desert island",
	slug: "desert_island",
	group: "Travel & Places",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🏞️": {
	name: "national park",
	slug: "national_park",
	group: "Travel & Places",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🏟️": {
	name: "stadium",
	slug: "stadium",
	group: "Travel & Places",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🏛️": {
	name: "classical building",
	slug: "classical_building",
	group: "Travel & Places",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🏗️": {
	name: "building construction",
	slug: "building_construction",
	group: "Travel & Places",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🧱": {
	name: "brick",
	slug: "brick",
	group: "Travel & Places",
	emoji_version: "11.0",
	unicode_version: "11.0",
	skin_tone_support: false
},
	"🪨": {
	name: "rock",
	slug: "rock",
	group: "Travel & Places",
	emoji_version: "13.0",
	unicode_version: "13.0",
	skin_tone_support: false
},
	"🪵": {
	name: "wood",
	slug: "wood",
	group: "Travel & Places",
	emoji_version: "13.0",
	unicode_version: "13.0",
	skin_tone_support: false
},
	"🛖": {
	name: "hut",
	slug: "hut",
	group: "Travel & Places",
	emoji_version: "13.0",
	unicode_version: "13.0",
	skin_tone_support: false
},
	"🏘️": {
	name: "houses",
	slug: "houses",
	group: "Travel & Places",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🏚️": {
	name: "derelict house",
	slug: "derelict_house",
	group: "Travel & Places",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🏠": {
	name: "house",
	slug: "house",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🏡": {
	name: "house with garden",
	slug: "house_with_garden",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🏢": {
	name: "office building",
	slug: "office_building",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🏣": {
	name: "Japanese post office",
	slug: "japanese_post_office",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🏤": {
	name: "post office",
	slug: "post_office",
	group: "Travel & Places",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🏥": {
	name: "hospital",
	slug: "hospital",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🏦": {
	name: "bank",
	slug: "bank",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🏨": {
	name: "hotel",
	slug: "hotel",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🏩": {
	name: "love hotel",
	slug: "love_hotel",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🏪": {
	name: "convenience store",
	slug: "convenience_store",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🏫": {
	name: "school",
	slug: "school",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🏬": {
	name: "department store",
	slug: "department_store",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🏭": {
	name: "factory",
	slug: "factory",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🏯": {
	name: "Japanese castle",
	slug: "japanese_castle",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🏰": {
	name: "castle",
	slug: "castle",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"💒": {
	name: "wedding",
	slug: "wedding",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🗼": {
	name: "Tokyo tower",
	slug: "tokyo_tower",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🗽": {
	name: "Statue of Liberty",
	slug: "statue_of_liberty",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"⛪": {
	name: "church",
	slug: "church",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🕌": {
	name: "mosque",
	slug: "mosque",
	group: "Travel & Places",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🛕": {
	name: "hindu temple",
	slug: "hindu_temple",
	group: "Travel & Places",
	emoji_version: "12.0",
	unicode_version: "12.0",
	skin_tone_support: false
},
	"🕍": {
	name: "synagogue",
	slug: "synagogue",
	group: "Travel & Places",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"⛩️": {
	name: "shinto shrine",
	slug: "shinto_shrine",
	group: "Travel & Places",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🕋": {
	name: "kaaba",
	slug: "kaaba",
	group: "Travel & Places",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"⛲": {
	name: "fountain",
	slug: "fountain",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"⛺": {
	name: "tent",
	slug: "tent",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🌁": {
	name: "foggy",
	slug: "foggy",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🌃": {
	name: "night with stars",
	slug: "night_with_stars",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🏙️": {
	name: "cityscape",
	slug: "cityscape",
	group: "Travel & Places",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🌄": {
	name: "sunrise over mountains",
	slug: "sunrise_over_mountains",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🌅": {
	name: "sunrise",
	slug: "sunrise",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🌆": {
	name: "cityscape at dusk",
	slug: "cityscape_at_dusk",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🌇": {
	name: "sunset",
	slug: "sunset",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🌉": {
	name: "bridge at night",
	slug: "bridge_at_night",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"♨️": {
	name: "hot springs",
	slug: "hot_springs",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🎠": {
	name: "carousel horse",
	slug: "carousel_horse",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🛝": {
	name: "playground slide",
	slug: "playground_slide",
	group: "Travel & Places",
	emoji_version: "14.0",
	unicode_version: "14.0",
	skin_tone_support: false
},
	"🎡": {
	name: "ferris wheel",
	slug: "ferris_wheel",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🎢": {
	name: "roller coaster",
	slug: "roller_coaster",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"💈": {
	name: "barber pole",
	slug: "barber_pole",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🎪": {
	name: "circus tent",
	slug: "circus_tent",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🚂": {
	name: "locomotive",
	slug: "locomotive",
	group: "Travel & Places",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🚃": {
	name: "railway car",
	slug: "railway_car",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🚄": {
	name: "high-speed train",
	slug: "high_speed_train",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🚅": {
	name: "bullet train",
	slug: "bullet_train",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🚆": {
	name: "train",
	slug: "train",
	group: "Travel & Places",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🚇": {
	name: "metro",
	slug: "metro",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🚈": {
	name: "light rail",
	slug: "light_rail",
	group: "Travel & Places",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🚉": {
	name: "station",
	slug: "station",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🚊": {
	name: "tram",
	slug: "tram",
	group: "Travel & Places",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🚝": {
	name: "monorail",
	slug: "monorail",
	group: "Travel & Places",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🚞": {
	name: "mountain railway",
	slug: "mountain_railway",
	group: "Travel & Places",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🚋": {
	name: "tram car",
	slug: "tram_car",
	group: "Travel & Places",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🚌": {
	name: "bus",
	slug: "bus",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🚍": {
	name: "oncoming bus",
	slug: "oncoming_bus",
	group: "Travel & Places",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🚎": {
	name: "trolleybus",
	slug: "trolleybus",
	group: "Travel & Places",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🚐": {
	name: "minibus",
	slug: "minibus",
	group: "Travel & Places",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🚑": {
	name: "ambulance",
	slug: "ambulance",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🚒": {
	name: "fire engine",
	slug: "fire_engine",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🚓": {
	name: "police car",
	slug: "police_car",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🚔": {
	name: "oncoming police car",
	slug: "oncoming_police_car",
	group: "Travel & Places",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🚕": {
	name: "taxi",
	slug: "taxi",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🚖": {
	name: "oncoming taxi",
	slug: "oncoming_taxi",
	group: "Travel & Places",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🚗": {
	name: "automobile",
	slug: "automobile",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🚘": {
	name: "oncoming automobile",
	slug: "oncoming_automobile",
	group: "Travel & Places",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🚙": {
	name: "sport utility vehicle",
	slug: "sport_utility_vehicle",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🛻": {
	name: "pickup truck",
	slug: "pickup_truck",
	group: "Travel & Places",
	emoji_version: "13.0",
	unicode_version: "13.0",
	skin_tone_support: false
},
	"🚚": {
	name: "delivery truck",
	slug: "delivery_truck",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🚛": {
	name: "articulated lorry",
	slug: "articulated_lorry",
	group: "Travel & Places",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🚜": {
	name: "tractor",
	slug: "tractor",
	group: "Travel & Places",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🏎️": {
	name: "racing car",
	slug: "racing_car",
	group: "Travel & Places",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🏍️": {
	name: "motorcycle",
	slug: "motorcycle",
	group: "Travel & Places",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🛵": {
	name: "motor scooter",
	slug: "motor_scooter",
	group: "Travel & Places",
	emoji_version: "3.0",
	unicode_version: "3.0",
	skin_tone_support: false
},
	"🦽": {
	name: "manual wheelchair",
	slug: "manual_wheelchair",
	group: "Travel & Places",
	emoji_version: "12.0",
	unicode_version: "12.0",
	skin_tone_support: false
},
	"🦼": {
	name: "motorized wheelchair",
	slug: "motorized_wheelchair",
	group: "Travel & Places",
	emoji_version: "12.0",
	unicode_version: "12.0",
	skin_tone_support: false
},
	"🛺": {
	name: "auto rickshaw",
	slug: "auto_rickshaw",
	group: "Travel & Places",
	emoji_version: "12.0",
	unicode_version: "12.0",
	skin_tone_support: false
},
	"🚲": {
	name: "bicycle",
	slug: "bicycle",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🛴": {
	name: "kick scooter",
	slug: "kick_scooter",
	group: "Travel & Places",
	emoji_version: "3.0",
	unicode_version: "3.0",
	skin_tone_support: false
},
	"🛹": {
	name: "skateboard",
	slug: "skateboard",
	group: "Travel & Places",
	emoji_version: "11.0",
	unicode_version: "11.0",
	skin_tone_support: false
},
	"🛼": {
	name: "roller skate",
	slug: "roller_skate",
	group: "Travel & Places",
	emoji_version: "13.0",
	unicode_version: "13.0",
	skin_tone_support: false
},
	"🚏": {
	name: "bus stop",
	slug: "bus_stop",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🛣️": {
	name: "motorway",
	slug: "motorway",
	group: "Travel & Places",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🛤️": {
	name: "railway track",
	slug: "railway_track",
	group: "Travel & Places",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🛢️": {
	name: "oil drum",
	slug: "oil_drum",
	group: "Travel & Places",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"⛽": {
	name: "fuel pump",
	slug: "fuel_pump",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🛞": {
	name: "wheel",
	slug: "wheel",
	group: "Travel & Places",
	emoji_version: "14.0",
	unicode_version: "14.0",
	skin_tone_support: false
},
	"🚨": {
	name: "police car light",
	slug: "police_car_light",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🚥": {
	name: "horizontal traffic light",
	slug: "horizontal_traffic_light",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🚦": {
	name: "vertical traffic light",
	slug: "vertical_traffic_light",
	group: "Travel & Places",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🛑": {
	name: "stop sign",
	slug: "stop_sign",
	group: "Travel & Places",
	emoji_version: "3.0",
	unicode_version: "3.0",
	skin_tone_support: false
},
	"🚧": {
	name: "construction",
	slug: "construction",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"⚓": {
	name: "anchor",
	slug: "anchor",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🛟": {
	name: "ring buoy",
	slug: "ring_buoy",
	group: "Travel & Places",
	emoji_version: "14.0",
	unicode_version: "14.0",
	skin_tone_support: false
},
	"⛵": {
	name: "sailboat",
	slug: "sailboat",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🛶": {
	name: "canoe",
	slug: "canoe",
	group: "Travel & Places",
	emoji_version: "3.0",
	unicode_version: "3.0",
	skin_tone_support: false
},
	"🚤": {
	name: "speedboat",
	slug: "speedboat",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🛳️": {
	name: "passenger ship",
	slug: "passenger_ship",
	group: "Travel & Places",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"⛴️": {
	name: "ferry",
	slug: "ferry",
	group: "Travel & Places",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🛥️": {
	name: "motor boat",
	slug: "motor_boat",
	group: "Travel & Places",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🚢": {
	name: "ship",
	slug: "ship",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"✈️": {
	name: "airplane",
	slug: "airplane",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🛩️": {
	name: "small airplane",
	slug: "small_airplane",
	group: "Travel & Places",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🛫": {
	name: "airplane departure",
	slug: "airplane_departure",
	group: "Travel & Places",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🛬": {
	name: "airplane arrival",
	slug: "airplane_arrival",
	group: "Travel & Places",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🪂": {
	name: "parachute",
	slug: "parachute",
	group: "Travel & Places",
	emoji_version: "12.0",
	unicode_version: "12.0",
	skin_tone_support: false
},
	"💺": {
	name: "seat",
	slug: "seat",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🚁": {
	name: "helicopter",
	slug: "helicopter",
	group: "Travel & Places",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🚟": {
	name: "suspension railway",
	slug: "suspension_railway",
	group: "Travel & Places",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🚠": {
	name: "mountain cableway",
	slug: "mountain_cableway",
	group: "Travel & Places",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🚡": {
	name: "aerial tramway",
	slug: "aerial_tramway",
	group: "Travel & Places",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🛰️": {
	name: "satellite",
	slug: "satellite",
	group: "Travel & Places",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🚀": {
	name: "rocket",
	slug: "rocket",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🛸": {
	name: "flying saucer",
	slug: "flying_saucer",
	group: "Travel & Places",
	emoji_version: "5.0",
	unicode_version: "5.0",
	skin_tone_support: false
},
	"🛎️": {
	name: "bellhop bell",
	slug: "bellhop_bell",
	group: "Travel & Places",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🧳": {
	name: "luggage",
	slug: "luggage",
	group: "Travel & Places",
	emoji_version: "11.0",
	unicode_version: "11.0",
	skin_tone_support: false
},
	"⌛": {
	name: "hourglass done",
	slug: "hourglass_done",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"⏳": {
	name: "hourglass not done",
	slug: "hourglass_not_done",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"⌚": {
	name: "watch",
	slug: "watch",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"⏰": {
	name: "alarm clock",
	slug: "alarm_clock",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"⏱️": {
	name: "stopwatch",
	slug: "stopwatch",
	group: "Travel & Places",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"⏲️": {
	name: "timer clock",
	slug: "timer_clock",
	group: "Travel & Places",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🕰️": {
	name: "mantelpiece clock",
	slug: "mantelpiece_clock",
	group: "Travel & Places",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🕛": {
	name: "twelve o’clock",
	slug: "twelve_o_clock",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🕧": {
	name: "twelve-thirty",
	slug: "twelve_thirty",
	group: "Travel & Places",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🕐": {
	name: "one o’clock",
	slug: "one_o_clock",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🕜": {
	name: "one-thirty",
	slug: "one_thirty",
	group: "Travel & Places",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🕑": {
	name: "two o’clock",
	slug: "two_o_clock",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🕝": {
	name: "two-thirty",
	slug: "two_thirty",
	group: "Travel & Places",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🕒": {
	name: "three o’clock",
	slug: "three_o_clock",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🕞": {
	name: "three-thirty",
	slug: "three_thirty",
	group: "Travel & Places",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🕓": {
	name: "four o’clock",
	slug: "four_o_clock",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🕟": {
	name: "four-thirty",
	slug: "four_thirty",
	group: "Travel & Places",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🕔": {
	name: "five o’clock",
	slug: "five_o_clock",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🕠": {
	name: "five-thirty",
	slug: "five_thirty",
	group: "Travel & Places",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🕕": {
	name: "six o’clock",
	slug: "six_o_clock",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🕡": {
	name: "six-thirty",
	slug: "six_thirty",
	group: "Travel & Places",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🕖": {
	name: "seven o’clock",
	slug: "seven_o_clock",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🕢": {
	name: "seven-thirty",
	slug: "seven_thirty",
	group: "Travel & Places",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🕗": {
	name: "eight o’clock",
	slug: "eight_o_clock",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🕣": {
	name: "eight-thirty",
	slug: "eight_thirty",
	group: "Travel & Places",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🕘": {
	name: "nine o’clock",
	slug: "nine_o_clock",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🕤": {
	name: "nine-thirty",
	slug: "nine_thirty",
	group: "Travel & Places",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🕙": {
	name: "ten o’clock",
	slug: "ten_o_clock",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🕥": {
	name: "ten-thirty",
	slug: "ten_thirty",
	group: "Travel & Places",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🕚": {
	name: "eleven o’clock",
	slug: "eleven_o_clock",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🕦": {
	name: "eleven-thirty",
	slug: "eleven_thirty",
	group: "Travel & Places",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🌑": {
	name: "new moon",
	slug: "new_moon",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🌒": {
	name: "waxing crescent moon",
	slug: "waxing_crescent_moon",
	group: "Travel & Places",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🌓": {
	name: "first quarter moon",
	slug: "first_quarter_moon",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🌔": {
	name: "waxing gibbous moon",
	slug: "waxing_gibbous_moon",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🌕": {
	name: "full moon",
	slug: "full_moon",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🌖": {
	name: "waning gibbous moon",
	slug: "waning_gibbous_moon",
	group: "Travel & Places",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🌗": {
	name: "last quarter moon",
	slug: "last_quarter_moon",
	group: "Travel & Places",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🌘": {
	name: "waning crescent moon",
	slug: "waning_crescent_moon",
	group: "Travel & Places",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🌙": {
	name: "crescent moon",
	slug: "crescent_moon",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🌚": {
	name: "new moon face",
	slug: "new_moon_face",
	group: "Travel & Places",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🌛": {
	name: "first quarter moon face",
	slug: "first_quarter_moon_face",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🌜": {
	name: "last quarter moon face",
	slug: "last_quarter_moon_face",
	group: "Travel & Places",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🌡️": {
	name: "thermometer",
	slug: "thermometer",
	group: "Travel & Places",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"☀️": {
	name: "sun",
	slug: "sun",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🌝": {
	name: "full moon face",
	slug: "full_moon_face",
	group: "Travel & Places",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🌞": {
	name: "sun with face",
	slug: "sun_with_face",
	group: "Travel & Places",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🪐": {
	name: "ringed planet",
	slug: "ringed_planet",
	group: "Travel & Places",
	emoji_version: "12.0",
	unicode_version: "12.0",
	skin_tone_support: false
},
	"⭐": {
	name: "star",
	slug: "star",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🌟": {
	name: "glowing star",
	slug: "glowing_star",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🌠": {
	name: "shooting star",
	slug: "shooting_star",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🌌": {
	name: "milky way",
	slug: "milky_way",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"☁️": {
	name: "cloud",
	slug: "cloud",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"⛅": {
	name: "sun behind cloud",
	slug: "sun_behind_cloud",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"⛈️": {
	name: "cloud with lightning and rain",
	slug: "cloud_with_lightning_and_rain",
	group: "Travel & Places",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🌤️": {
	name: "sun behind small cloud",
	slug: "sun_behind_small_cloud",
	group: "Travel & Places",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🌥️": {
	name: "sun behind large cloud",
	slug: "sun_behind_large_cloud",
	group: "Travel & Places",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🌦️": {
	name: "sun behind rain cloud",
	slug: "sun_behind_rain_cloud",
	group: "Travel & Places",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🌧️": {
	name: "cloud with rain",
	slug: "cloud_with_rain",
	group: "Travel & Places",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🌨️": {
	name: "cloud with snow",
	slug: "cloud_with_snow",
	group: "Travel & Places",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🌩️": {
	name: "cloud with lightning",
	slug: "cloud_with_lightning",
	group: "Travel & Places",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🌪️": {
	name: "tornado",
	slug: "tornado",
	group: "Travel & Places",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🌫️": {
	name: "fog",
	slug: "fog",
	group: "Travel & Places",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🌬️": {
	name: "wind face",
	slug: "wind_face",
	group: "Travel & Places",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🌀": {
	name: "cyclone",
	slug: "cyclone",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🌈": {
	name: "rainbow",
	slug: "rainbow",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🌂": {
	name: "closed umbrella",
	slug: "closed_umbrella",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"☂️": {
	name: "umbrella",
	slug: "umbrella",
	group: "Travel & Places",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"☔": {
	name: "umbrella with rain drops",
	slug: "umbrella_with_rain_drops",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"⛱️": {
	name: "umbrella on ground",
	slug: "umbrella_on_ground",
	group: "Travel & Places",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"⚡": {
	name: "high voltage",
	slug: "high_voltage",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"❄️": {
	name: "snowflake",
	slug: "snowflake",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"☃️": {
	name: "snowman",
	slug: "snowman",
	group: "Travel & Places",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"⛄": {
	name: "snowman without snow",
	slug: "snowman_without_snow",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"☄️": {
	name: "comet",
	slug: "comet",
	group: "Travel & Places",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🔥": {
	name: "fire",
	slug: "fire",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"💧": {
	name: "droplet",
	slug: "droplet",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🌊": {
	name: "water wave",
	slug: "water_wave",
	group: "Travel & Places",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🎃": {
	name: "jack-o-lantern",
	slug: "jack_o_lantern",
	group: "Activities",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🎄": {
	name: "Christmas tree",
	slug: "christmas_tree",
	group: "Activities",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🎆": {
	name: "fireworks",
	slug: "fireworks",
	group: "Activities",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🎇": {
	name: "sparkler",
	slug: "sparkler",
	group: "Activities",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🧨": {
	name: "firecracker",
	slug: "firecracker",
	group: "Activities",
	emoji_version: "11.0",
	unicode_version: "11.0",
	skin_tone_support: false
},
	"✨": {
	name: "sparkles",
	slug: "sparkles",
	group: "Activities",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🎈": {
	name: "balloon",
	slug: "balloon",
	group: "Activities",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🎉": {
	name: "party popper",
	slug: "party_popper",
	group: "Activities",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🎊": {
	name: "confetti ball",
	slug: "confetti_ball",
	group: "Activities",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🎋": {
	name: "tanabata tree",
	slug: "tanabata_tree",
	group: "Activities",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🎍": {
	name: "pine decoration",
	slug: "pine_decoration",
	group: "Activities",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🎎": {
	name: "Japanese dolls",
	slug: "japanese_dolls",
	group: "Activities",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🎏": {
	name: "carp streamer",
	slug: "carp_streamer",
	group: "Activities",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🎐": {
	name: "wind chime",
	slug: "wind_chime",
	group: "Activities",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🎑": {
	name: "moon viewing ceremony",
	slug: "moon_viewing_ceremony",
	group: "Activities",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🧧": {
	name: "red envelope",
	slug: "red_envelope",
	group: "Activities",
	emoji_version: "11.0",
	unicode_version: "11.0",
	skin_tone_support: false
},
	"🎀": {
	name: "ribbon",
	slug: "ribbon",
	group: "Activities",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🎁": {
	name: "wrapped gift",
	slug: "wrapped_gift",
	group: "Activities",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🎗️": {
	name: "reminder ribbon",
	slug: "reminder_ribbon",
	group: "Activities",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🎟️": {
	name: "admission tickets",
	slug: "admission_tickets",
	group: "Activities",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🎫": {
	name: "ticket",
	slug: "ticket",
	group: "Activities",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🎖️": {
	name: "military medal",
	slug: "military_medal",
	group: "Activities",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🏆": {
	name: "trophy",
	slug: "trophy",
	group: "Activities",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🏅": {
	name: "sports medal",
	slug: "sports_medal",
	group: "Activities",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🥇": {
	name: "1st place medal",
	slug: "1st_place_medal",
	group: "Activities",
	emoji_version: "3.0",
	unicode_version: "3.0",
	skin_tone_support: false
},
	"🥈": {
	name: "2nd place medal",
	slug: "2nd_place_medal",
	group: "Activities",
	emoji_version: "3.0",
	unicode_version: "3.0",
	skin_tone_support: false
},
	"🥉": {
	name: "3rd place medal",
	slug: "3rd_place_medal",
	group: "Activities",
	emoji_version: "3.0",
	unicode_version: "3.0",
	skin_tone_support: false
},
	"⚽": {
	name: "soccer ball",
	slug: "soccer_ball",
	group: "Activities",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"⚾": {
	name: "baseball",
	slug: "baseball",
	group: "Activities",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🥎": {
	name: "softball",
	slug: "softball",
	group: "Activities",
	emoji_version: "11.0",
	unicode_version: "11.0",
	skin_tone_support: false
},
	"🏀": {
	name: "basketball",
	slug: "basketball",
	group: "Activities",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🏐": {
	name: "volleyball",
	slug: "volleyball",
	group: "Activities",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🏈": {
	name: "american football",
	slug: "american_football",
	group: "Activities",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🏉": {
	name: "rugby football",
	slug: "rugby_football",
	group: "Activities",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🎾": {
	name: "tennis",
	slug: "tennis",
	group: "Activities",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🥏": {
	name: "flying disc",
	slug: "flying_disc",
	group: "Activities",
	emoji_version: "11.0",
	unicode_version: "11.0",
	skin_tone_support: false
},
	"🎳": {
	name: "bowling",
	slug: "bowling",
	group: "Activities",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🏏": {
	name: "cricket game",
	slug: "cricket_game",
	group: "Activities",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🏑": {
	name: "field hockey",
	slug: "field_hockey",
	group: "Activities",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🏒": {
	name: "ice hockey",
	slug: "ice_hockey",
	group: "Activities",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🥍": {
	name: "lacrosse",
	slug: "lacrosse",
	group: "Activities",
	emoji_version: "11.0",
	unicode_version: "11.0",
	skin_tone_support: false
},
	"🏓": {
	name: "ping pong",
	slug: "ping_pong",
	group: "Activities",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🏸": {
	name: "badminton",
	slug: "badminton",
	group: "Activities",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🥊": {
	name: "boxing glove",
	slug: "boxing_glove",
	group: "Activities",
	emoji_version: "3.0",
	unicode_version: "3.0",
	skin_tone_support: false
},
	"🥋": {
	name: "martial arts uniform",
	slug: "martial_arts_uniform",
	group: "Activities",
	emoji_version: "3.0",
	unicode_version: "3.0",
	skin_tone_support: false
},
	"🥅": {
	name: "goal net",
	slug: "goal_net",
	group: "Activities",
	emoji_version: "3.0",
	unicode_version: "3.0",
	skin_tone_support: false
},
	"⛳": {
	name: "flag in hole",
	slug: "flag_in_hole",
	group: "Activities",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"⛸️": {
	name: "ice skate",
	slug: "ice_skate",
	group: "Activities",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🎣": {
	name: "fishing pole",
	slug: "fishing_pole",
	group: "Activities",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🤿": {
	name: "diving mask",
	slug: "diving_mask",
	group: "Activities",
	emoji_version: "12.0",
	unicode_version: "12.0",
	skin_tone_support: false
},
	"🎽": {
	name: "running shirt",
	slug: "running_shirt",
	group: "Activities",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🎿": {
	name: "skis",
	slug: "skis",
	group: "Activities",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🛷": {
	name: "sled",
	slug: "sled",
	group: "Activities",
	emoji_version: "5.0",
	unicode_version: "5.0",
	skin_tone_support: false
},
	"🥌": {
	name: "curling stone",
	slug: "curling_stone",
	group: "Activities",
	emoji_version: "5.0",
	unicode_version: "5.0",
	skin_tone_support: false
},
	"🎯": {
	name: "bullseye",
	slug: "bullseye",
	group: "Activities",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🪀": {
	name: "yo-yo",
	slug: "yo_yo",
	group: "Activities",
	emoji_version: "12.0",
	unicode_version: "12.0",
	skin_tone_support: false
},
	"🪁": {
	name: "kite",
	slug: "kite",
	group: "Activities",
	emoji_version: "12.0",
	unicode_version: "12.0",
	skin_tone_support: false
},
	"🔫": {
	name: "water pistol",
	slug: "water_pistol",
	group: "Activities",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🎱": {
	name: "pool 8 ball",
	slug: "pool_8_ball",
	group: "Activities",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🔮": {
	name: "crystal ball",
	slug: "crystal_ball",
	group: "Activities",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🪄": {
	name: "magic wand",
	slug: "magic_wand",
	group: "Activities",
	emoji_version: "13.0",
	unicode_version: "13.0",
	skin_tone_support: false
},
	"🎮": {
	name: "video game",
	slug: "video_game",
	group: "Activities",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🕹️": {
	name: "joystick",
	slug: "joystick",
	group: "Activities",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🎰": {
	name: "slot machine",
	slug: "slot_machine",
	group: "Activities",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🎲": {
	name: "game die",
	slug: "game_die",
	group: "Activities",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🧩": {
	name: "puzzle piece",
	slug: "puzzle_piece",
	group: "Activities",
	emoji_version: "11.0",
	unicode_version: "11.0",
	skin_tone_support: false
},
	"🧸": {
	name: "teddy bear",
	slug: "teddy_bear",
	group: "Activities",
	emoji_version: "11.0",
	unicode_version: "11.0",
	skin_tone_support: false
},
	"🪅": {
	name: "piñata",
	slug: "pinata",
	group: "Activities",
	emoji_version: "13.0",
	unicode_version: "13.0",
	skin_tone_support: false
},
	"🪩": {
	name: "mirror ball",
	slug: "mirror_ball",
	group: "Activities",
	emoji_version: "14.0",
	unicode_version: "14.0",
	skin_tone_support: false
},
	"🪆": {
	name: "nesting dolls",
	slug: "nesting_dolls",
	group: "Activities",
	emoji_version: "13.0",
	unicode_version: "13.0",
	skin_tone_support: false
},
	"♠️": {
	name: "spade suit",
	slug: "spade_suit",
	group: "Activities",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"♥️": {
	name: "heart suit",
	slug: "heart_suit",
	group: "Activities",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"♦️": {
	name: "diamond suit",
	slug: "diamond_suit",
	group: "Activities",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"♣️": {
	name: "club suit",
	slug: "club_suit",
	group: "Activities",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"♟️": {
	name: "chess pawn",
	slug: "chess_pawn",
	group: "Activities",
	emoji_version: "11.0",
	unicode_version: "11.0",
	skin_tone_support: false
},
	"🃏": {
	name: "joker",
	slug: "joker",
	group: "Activities",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🀄": {
	name: "mahjong red dragon",
	slug: "mahjong_red_dragon",
	group: "Activities",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🎴": {
	name: "flower playing cards",
	slug: "flower_playing_cards",
	group: "Activities",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🎭": {
	name: "performing arts",
	slug: "performing_arts",
	group: "Activities",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🖼️": {
	name: "framed picture",
	slug: "framed_picture",
	group: "Activities",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🎨": {
	name: "artist palette",
	slug: "artist_palette",
	group: "Activities",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🧵": {
	name: "thread",
	slug: "thread",
	group: "Activities",
	emoji_version: "11.0",
	unicode_version: "11.0",
	skin_tone_support: false
},
	"🪡": {
	name: "sewing needle",
	slug: "sewing_needle",
	group: "Activities",
	emoji_version: "13.0",
	unicode_version: "13.0",
	skin_tone_support: false
},
	"🧶": {
	name: "yarn",
	slug: "yarn",
	group: "Activities",
	emoji_version: "11.0",
	unicode_version: "11.0",
	skin_tone_support: false
},
	"🪢": {
	name: "knot",
	slug: "knot",
	group: "Activities",
	emoji_version: "13.0",
	unicode_version: "13.0",
	skin_tone_support: false
},
	"👓": {
	name: "glasses",
	slug: "glasses",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🕶️": {
	name: "sunglasses",
	slug: "sunglasses",
	group: "Objects",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🥽": {
	name: "goggles",
	slug: "goggles",
	group: "Objects",
	emoji_version: "11.0",
	unicode_version: "11.0",
	skin_tone_support: false
},
	"🥼": {
	name: "lab coat",
	slug: "lab_coat",
	group: "Objects",
	emoji_version: "11.0",
	unicode_version: "11.0",
	skin_tone_support: false
},
	"🦺": {
	name: "safety vest",
	slug: "safety_vest",
	group: "Objects",
	emoji_version: "12.0",
	unicode_version: "12.0",
	skin_tone_support: false
},
	"👔": {
	name: "necktie",
	slug: "necktie",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"👕": {
	name: "t-shirt",
	slug: "t_shirt",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"👖": {
	name: "jeans",
	slug: "jeans",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🧣": {
	name: "scarf",
	slug: "scarf",
	group: "Objects",
	emoji_version: "5.0",
	unicode_version: "5.0",
	skin_tone_support: false
},
	"🧤": {
	name: "gloves",
	slug: "gloves",
	group: "Objects",
	emoji_version: "5.0",
	unicode_version: "5.0",
	skin_tone_support: false
},
	"🧥": {
	name: "coat",
	slug: "coat",
	group: "Objects",
	emoji_version: "5.0",
	unicode_version: "5.0",
	skin_tone_support: false
},
	"🧦": {
	name: "socks",
	slug: "socks",
	group: "Objects",
	emoji_version: "5.0",
	unicode_version: "5.0",
	skin_tone_support: false
},
	"👗": {
	name: "dress",
	slug: "dress",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"👘": {
	name: "kimono",
	slug: "kimono",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🥻": {
	name: "sari",
	slug: "sari",
	group: "Objects",
	emoji_version: "12.0",
	unicode_version: "12.0",
	skin_tone_support: false
},
	"🩱": {
	name: "one-piece swimsuit",
	slug: "one_piece_swimsuit",
	group: "Objects",
	emoji_version: "12.0",
	unicode_version: "12.0",
	skin_tone_support: false
},
	"🩲": {
	name: "briefs",
	slug: "briefs",
	group: "Objects",
	emoji_version: "12.0",
	unicode_version: "12.0",
	skin_tone_support: false
},
	"🩳": {
	name: "shorts",
	slug: "shorts",
	group: "Objects",
	emoji_version: "12.0",
	unicode_version: "12.0",
	skin_tone_support: false
},
	"👙": {
	name: "bikini",
	slug: "bikini",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"👚": {
	name: "woman’s clothes",
	slug: "woman_s_clothes",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🪭": {
	name: "folding hand fan",
	slug: "folding_hand_fan",
	group: "Objects",
	emoji_version: "15.0",
	unicode_version: "15.0",
	skin_tone_support: false
},
	"👛": {
	name: "purse",
	slug: "purse",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"👜": {
	name: "handbag",
	slug: "handbag",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"👝": {
	name: "clutch bag",
	slug: "clutch_bag",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🛍️": {
	name: "shopping bags",
	slug: "shopping_bags",
	group: "Objects",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🎒": {
	name: "backpack",
	slug: "backpack",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🩴": {
	name: "thong sandal",
	slug: "thong_sandal",
	group: "Objects",
	emoji_version: "13.0",
	unicode_version: "13.0",
	skin_tone_support: false
},
	"👞": {
	name: "man’s shoe",
	slug: "man_s_shoe",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"👟": {
	name: "running shoe",
	slug: "running_shoe",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🥾": {
	name: "hiking boot",
	slug: "hiking_boot",
	group: "Objects",
	emoji_version: "11.0",
	unicode_version: "11.0",
	skin_tone_support: false
},
	"🥿": {
	name: "flat shoe",
	slug: "flat_shoe",
	group: "Objects",
	emoji_version: "11.0",
	unicode_version: "11.0",
	skin_tone_support: false
},
	"👠": {
	name: "high-heeled shoe",
	slug: "high_heeled_shoe",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"👡": {
	name: "woman’s sandal",
	slug: "woman_s_sandal",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🩰": {
	name: "ballet shoes",
	slug: "ballet_shoes",
	group: "Objects",
	emoji_version: "12.0",
	unicode_version: "12.0",
	skin_tone_support: false
},
	"👢": {
	name: "woman’s boot",
	slug: "woman_s_boot",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🪮": {
	name: "hair pick",
	slug: "hair_pick",
	group: "Objects",
	emoji_version: "15.0",
	unicode_version: "15.0",
	skin_tone_support: false
},
	"👑": {
	name: "crown",
	slug: "crown",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"👒": {
	name: "woman’s hat",
	slug: "woman_s_hat",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🎩": {
	name: "top hat",
	slug: "top_hat",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🎓": {
	name: "graduation cap",
	slug: "graduation_cap",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🧢": {
	name: "billed cap",
	slug: "billed_cap",
	group: "Objects",
	emoji_version: "5.0",
	unicode_version: "5.0",
	skin_tone_support: false
},
	"🪖": {
	name: "military helmet",
	slug: "military_helmet",
	group: "Objects",
	emoji_version: "13.0",
	unicode_version: "13.0",
	skin_tone_support: false
},
	"⛑️": {
	name: "rescue worker’s helmet",
	slug: "rescue_worker_s_helmet",
	group: "Objects",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"📿": {
	name: "prayer beads",
	slug: "prayer_beads",
	group: "Objects",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"💄": {
	name: "lipstick",
	slug: "lipstick",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"💍": {
	name: "ring",
	slug: "ring",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"💎": {
	name: "gem stone",
	slug: "gem_stone",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🔇": {
	name: "muted speaker",
	slug: "muted_speaker",
	group: "Objects",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🔈": {
	name: "speaker low volume",
	slug: "speaker_low_volume",
	group: "Objects",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🔉": {
	name: "speaker medium volume",
	slug: "speaker_medium_volume",
	group: "Objects",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🔊": {
	name: "speaker high volume",
	slug: "speaker_high_volume",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"📢": {
	name: "loudspeaker",
	slug: "loudspeaker",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"📣": {
	name: "megaphone",
	slug: "megaphone",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"📯": {
	name: "postal horn",
	slug: "postal_horn",
	group: "Objects",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🔔": {
	name: "bell",
	slug: "bell",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🔕": {
	name: "bell with slash",
	slug: "bell_with_slash",
	group: "Objects",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🎼": {
	name: "musical score",
	slug: "musical_score",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🎵": {
	name: "musical note",
	slug: "musical_note",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🎶": {
	name: "musical notes",
	slug: "musical_notes",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🎙️": {
	name: "studio microphone",
	slug: "studio_microphone",
	group: "Objects",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🎚️": {
	name: "level slider",
	slug: "level_slider",
	group: "Objects",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🎛️": {
	name: "control knobs",
	slug: "control_knobs",
	group: "Objects",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🎤": {
	name: "microphone",
	slug: "microphone",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🎧": {
	name: "headphone",
	slug: "headphone",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"📻": {
	name: "radio",
	slug: "radio",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🎷": {
	name: "saxophone",
	slug: "saxophone",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🪗": {
	name: "accordion",
	slug: "accordion",
	group: "Objects",
	emoji_version: "13.0",
	unicode_version: "13.0",
	skin_tone_support: false
},
	"🎸": {
	name: "guitar",
	slug: "guitar",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🎹": {
	name: "musical keyboard",
	slug: "musical_keyboard",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🎺": {
	name: "trumpet",
	slug: "trumpet",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🎻": {
	name: "violin",
	slug: "violin",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🪕": {
	name: "banjo",
	slug: "banjo",
	group: "Objects",
	emoji_version: "12.0",
	unicode_version: "12.0",
	skin_tone_support: false
},
	"🥁": {
	name: "drum",
	slug: "drum",
	group: "Objects",
	emoji_version: "3.0",
	unicode_version: "3.0",
	skin_tone_support: false
},
	"🪘": {
	name: "long drum",
	slug: "long_drum",
	group: "Objects",
	emoji_version: "13.0",
	unicode_version: "13.0",
	skin_tone_support: false
},
	"🪇": {
	name: "maracas",
	slug: "maracas",
	group: "Objects",
	emoji_version: "15.0",
	unicode_version: "15.0",
	skin_tone_support: false
},
	"🪈": {
	name: "flute",
	slug: "flute",
	group: "Objects",
	emoji_version: "15.0",
	unicode_version: "15.0",
	skin_tone_support: false
},
	"📱": {
	name: "mobile phone",
	slug: "mobile_phone",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"📲": {
	name: "mobile phone with arrow",
	slug: "mobile_phone_with_arrow",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"☎️": {
	name: "telephone",
	slug: "telephone",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"📞": {
	name: "telephone receiver",
	slug: "telephone_receiver",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"📟": {
	name: "pager",
	slug: "pager",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"📠": {
	name: "fax machine",
	slug: "fax_machine",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🔋": {
	name: "battery",
	slug: "battery",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🪫": {
	name: "low battery",
	slug: "low_battery",
	group: "Objects",
	emoji_version: "14.0",
	unicode_version: "14.0",
	skin_tone_support: false
},
	"🔌": {
	name: "electric plug",
	slug: "electric_plug",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"💻": {
	name: "laptop",
	slug: "laptop",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🖥️": {
	name: "desktop computer",
	slug: "desktop_computer",
	group: "Objects",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🖨️": {
	name: "printer",
	slug: "printer",
	group: "Objects",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"⌨️": {
	name: "keyboard",
	slug: "keyboard",
	group: "Objects",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🖱️": {
	name: "computer mouse",
	slug: "computer_mouse",
	group: "Objects",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🖲️": {
	name: "trackball",
	slug: "trackball",
	group: "Objects",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"💽": {
	name: "computer disk",
	slug: "computer_disk",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"💾": {
	name: "floppy disk",
	slug: "floppy_disk",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"💿": {
	name: "optical disk",
	slug: "optical_disk",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"📀": {
	name: "dvd",
	slug: "dvd",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🧮": {
	name: "abacus",
	slug: "abacus",
	group: "Objects",
	emoji_version: "11.0",
	unicode_version: "11.0",
	skin_tone_support: false
},
	"🎥": {
	name: "movie camera",
	slug: "movie_camera",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🎞️": {
	name: "film frames",
	slug: "film_frames",
	group: "Objects",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"📽️": {
	name: "film projector",
	slug: "film_projector",
	group: "Objects",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🎬": {
	name: "clapper board",
	slug: "clapper_board",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"📺": {
	name: "television",
	slug: "television",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"📷": {
	name: "camera",
	slug: "camera",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"📸": {
	name: "camera with flash",
	slug: "camera_with_flash",
	group: "Objects",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"📹": {
	name: "video camera",
	slug: "video_camera",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"📼": {
	name: "videocassette",
	slug: "videocassette",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🔍": {
	name: "magnifying glass tilted left",
	slug: "magnifying_glass_tilted_left",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🔎": {
	name: "magnifying glass tilted right",
	slug: "magnifying_glass_tilted_right",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🕯️": {
	name: "candle",
	slug: "candle",
	group: "Objects",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"💡": {
	name: "light bulb",
	slug: "light_bulb",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🔦": {
	name: "flashlight",
	slug: "flashlight",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🏮": {
	name: "red paper lantern",
	slug: "red_paper_lantern",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🪔": {
	name: "diya lamp",
	slug: "diya_lamp",
	group: "Objects",
	emoji_version: "12.0",
	unicode_version: "12.0",
	skin_tone_support: false
},
	"📔": {
	name: "notebook with decorative cover",
	slug: "notebook_with_decorative_cover",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"📕": {
	name: "closed book",
	slug: "closed_book",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"📖": {
	name: "open book",
	slug: "open_book",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"📗": {
	name: "green book",
	slug: "green_book",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"📘": {
	name: "blue book",
	slug: "blue_book",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"📙": {
	name: "orange book",
	slug: "orange_book",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"📚": {
	name: "books",
	slug: "books",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"📓": {
	name: "notebook",
	slug: "notebook",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"📒": {
	name: "ledger",
	slug: "ledger",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"📃": {
	name: "page with curl",
	slug: "page_with_curl",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"📜": {
	name: "scroll",
	slug: "scroll",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"📄": {
	name: "page facing up",
	slug: "page_facing_up",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"📰": {
	name: "newspaper",
	slug: "newspaper",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🗞️": {
	name: "rolled-up newspaper",
	slug: "rolled_up_newspaper",
	group: "Objects",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"📑": {
	name: "bookmark tabs",
	slug: "bookmark_tabs",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🔖": {
	name: "bookmark",
	slug: "bookmark",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🏷️": {
	name: "label",
	slug: "label",
	group: "Objects",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"💰": {
	name: "money bag",
	slug: "money_bag",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🪙": {
	name: "coin",
	slug: "coin",
	group: "Objects",
	emoji_version: "13.0",
	unicode_version: "13.0",
	skin_tone_support: false
},
	"💴": {
	name: "yen banknote",
	slug: "yen_banknote",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"💵": {
	name: "dollar banknote",
	slug: "dollar_banknote",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"💶": {
	name: "euro banknote",
	slug: "euro_banknote",
	group: "Objects",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"💷": {
	name: "pound banknote",
	slug: "pound_banknote",
	group: "Objects",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"💸": {
	name: "money with wings",
	slug: "money_with_wings",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"💳": {
	name: "credit card",
	slug: "credit_card",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🧾": {
	name: "receipt",
	slug: "receipt",
	group: "Objects",
	emoji_version: "11.0",
	unicode_version: "11.0",
	skin_tone_support: false
},
	"💹": {
	name: "chart increasing with yen",
	slug: "chart_increasing_with_yen",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"✉️": {
	name: "envelope",
	slug: "envelope",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"📧": {
	name: "e-mail",
	slug: "e_mail",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"📨": {
	name: "incoming envelope",
	slug: "incoming_envelope",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"📩": {
	name: "envelope with arrow",
	slug: "envelope_with_arrow",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"📤": {
	name: "outbox tray",
	slug: "outbox_tray",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"📥": {
	name: "inbox tray",
	slug: "inbox_tray",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"📦": {
	name: "package",
	slug: "package",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"📫": {
	name: "closed mailbox with raised flag",
	slug: "closed_mailbox_with_raised_flag",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"📪": {
	name: "closed mailbox with lowered flag",
	slug: "closed_mailbox_with_lowered_flag",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"📬": {
	name: "open mailbox with raised flag",
	slug: "open_mailbox_with_raised_flag",
	group: "Objects",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"📭": {
	name: "open mailbox with lowered flag",
	slug: "open_mailbox_with_lowered_flag",
	group: "Objects",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"📮": {
	name: "postbox",
	slug: "postbox",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🗳️": {
	name: "ballot box with ballot",
	slug: "ballot_box_with_ballot",
	group: "Objects",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"✏️": {
	name: "pencil",
	slug: "pencil",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"✒️": {
	name: "black nib",
	slug: "black_nib",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🖋️": {
	name: "fountain pen",
	slug: "fountain_pen",
	group: "Objects",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🖊️": {
	name: "pen",
	slug: "pen",
	group: "Objects",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🖌️": {
	name: "paintbrush",
	slug: "paintbrush",
	group: "Objects",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🖍️": {
	name: "crayon",
	slug: "crayon",
	group: "Objects",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"📝": {
	name: "memo",
	slug: "memo",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"💼": {
	name: "briefcase",
	slug: "briefcase",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"📁": {
	name: "file folder",
	slug: "file_folder",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"📂": {
	name: "open file folder",
	slug: "open_file_folder",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🗂️": {
	name: "card index dividers",
	slug: "card_index_dividers",
	group: "Objects",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"📅": {
	name: "calendar",
	slug: "calendar",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"📆": {
	name: "tear-off calendar",
	slug: "tear_off_calendar",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🗒️": {
	name: "spiral notepad",
	slug: "spiral_notepad",
	group: "Objects",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🗓️": {
	name: "spiral calendar",
	slug: "spiral_calendar",
	group: "Objects",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"📇": {
	name: "card index",
	slug: "card_index",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"📈": {
	name: "chart increasing",
	slug: "chart_increasing",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"📉": {
	name: "chart decreasing",
	slug: "chart_decreasing",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"📊": {
	name: "bar chart",
	slug: "bar_chart",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"📋": {
	name: "clipboard",
	slug: "clipboard",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"📌": {
	name: "pushpin",
	slug: "pushpin",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"📍": {
	name: "round pushpin",
	slug: "round_pushpin",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"📎": {
	name: "paperclip",
	slug: "paperclip",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🖇️": {
	name: "linked paperclips",
	slug: "linked_paperclips",
	group: "Objects",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"📏": {
	name: "straight ruler",
	slug: "straight_ruler",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"📐": {
	name: "triangular ruler",
	slug: "triangular_ruler",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"✂️": {
	name: "scissors",
	slug: "scissors",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🗃️": {
	name: "card file box",
	slug: "card_file_box",
	group: "Objects",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🗄️": {
	name: "file cabinet",
	slug: "file_cabinet",
	group: "Objects",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🗑️": {
	name: "wastebasket",
	slug: "wastebasket",
	group: "Objects",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🔒": {
	name: "locked",
	slug: "locked",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🔓": {
	name: "unlocked",
	slug: "unlocked",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🔏": {
	name: "locked with pen",
	slug: "locked_with_pen",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🔐": {
	name: "locked with key",
	slug: "locked_with_key",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🔑": {
	name: "key",
	slug: "key",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🗝️": {
	name: "old key",
	slug: "old_key",
	group: "Objects",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🔨": {
	name: "hammer",
	slug: "hammer",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🪓": {
	name: "axe",
	slug: "axe",
	group: "Objects",
	emoji_version: "12.0",
	unicode_version: "12.0",
	skin_tone_support: false
},
	"⛏️": {
	name: "pick",
	slug: "pick",
	group: "Objects",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"⚒️": {
	name: "hammer and pick",
	slug: "hammer_and_pick",
	group: "Objects",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🛠️": {
	name: "hammer and wrench",
	slug: "hammer_and_wrench",
	group: "Objects",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🗡️": {
	name: "dagger",
	slug: "dagger",
	group: "Objects",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"⚔️": {
	name: "crossed swords",
	slug: "crossed_swords",
	group: "Objects",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"💣": {
	name: "bomb",
	slug: "bomb",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🪃": {
	name: "boomerang",
	slug: "boomerang",
	group: "Objects",
	emoji_version: "13.0",
	unicode_version: "13.0",
	skin_tone_support: false
},
	"🏹": {
	name: "bow and arrow",
	slug: "bow_and_arrow",
	group: "Objects",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🛡️": {
	name: "shield",
	slug: "shield",
	group: "Objects",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🪚": {
	name: "carpentry saw",
	slug: "carpentry_saw",
	group: "Objects",
	emoji_version: "13.0",
	unicode_version: "13.0",
	skin_tone_support: false
},
	"🔧": {
	name: "wrench",
	slug: "wrench",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🪛": {
	name: "screwdriver",
	slug: "screwdriver",
	group: "Objects",
	emoji_version: "13.0",
	unicode_version: "13.0",
	skin_tone_support: false
},
	"🔩": {
	name: "nut and bolt",
	slug: "nut_and_bolt",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"⚙️": {
	name: "gear",
	slug: "gear",
	group: "Objects",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🗜️": {
	name: "clamp",
	slug: "clamp",
	group: "Objects",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"⚖️": {
	name: "balance scale",
	slug: "balance_scale",
	group: "Objects",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🦯": {
	name: "white cane",
	slug: "white_cane",
	group: "Objects",
	emoji_version: "12.0",
	unicode_version: "12.0",
	skin_tone_support: false
},
	"🔗": {
	name: "link",
	slug: "link",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"⛓️": {
	name: "chains",
	slug: "chains",
	group: "Objects",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🪝": {
	name: "hook",
	slug: "hook",
	group: "Objects",
	emoji_version: "13.0",
	unicode_version: "13.0",
	skin_tone_support: false
},
	"🧰": {
	name: "toolbox",
	slug: "toolbox",
	group: "Objects",
	emoji_version: "11.0",
	unicode_version: "11.0",
	skin_tone_support: false
},
	"🧲": {
	name: "magnet",
	slug: "magnet",
	group: "Objects",
	emoji_version: "11.0",
	unicode_version: "11.0",
	skin_tone_support: false
},
	"🪜": {
	name: "ladder",
	slug: "ladder",
	group: "Objects",
	emoji_version: "13.0",
	unicode_version: "13.0",
	skin_tone_support: false
},
	"⚗️": {
	name: "alembic",
	slug: "alembic",
	group: "Objects",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🧪": {
	name: "test tube",
	slug: "test_tube",
	group: "Objects",
	emoji_version: "11.0",
	unicode_version: "11.0",
	skin_tone_support: false
},
	"🧫": {
	name: "petri dish",
	slug: "petri_dish",
	group: "Objects",
	emoji_version: "11.0",
	unicode_version: "11.0",
	skin_tone_support: false
},
	"🧬": {
	name: "dna",
	slug: "dna",
	group: "Objects",
	emoji_version: "11.0",
	unicode_version: "11.0",
	skin_tone_support: false
},
	"🔬": {
	name: "microscope",
	slug: "microscope",
	group: "Objects",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🔭": {
	name: "telescope",
	slug: "telescope",
	group: "Objects",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"📡": {
	name: "satellite antenna",
	slug: "satellite_antenna",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"💉": {
	name: "syringe",
	slug: "syringe",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🩸": {
	name: "drop of blood",
	slug: "drop_of_blood",
	group: "Objects",
	emoji_version: "12.0",
	unicode_version: "12.0",
	skin_tone_support: false
},
	"💊": {
	name: "pill",
	slug: "pill",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🩹": {
	name: "adhesive bandage",
	slug: "adhesive_bandage",
	group: "Objects",
	emoji_version: "12.0",
	unicode_version: "12.0",
	skin_tone_support: false
},
	"🩼": {
	name: "crutch",
	slug: "crutch",
	group: "Objects",
	emoji_version: "14.0",
	unicode_version: "14.0",
	skin_tone_support: false
},
	"🩺": {
	name: "stethoscope",
	slug: "stethoscope",
	group: "Objects",
	emoji_version: "12.0",
	unicode_version: "12.0",
	skin_tone_support: false
},
	"🩻": {
	name: "x-ray",
	slug: "x_ray",
	group: "Objects",
	emoji_version: "14.0",
	unicode_version: "14.0",
	skin_tone_support: false
},
	"🚪": {
	name: "door",
	slug: "door",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🛗": {
	name: "elevator",
	slug: "elevator",
	group: "Objects",
	emoji_version: "13.0",
	unicode_version: "13.0",
	skin_tone_support: false
},
	"🪞": {
	name: "mirror",
	slug: "mirror",
	group: "Objects",
	emoji_version: "13.0",
	unicode_version: "13.0",
	skin_tone_support: false
},
	"🪟": {
	name: "window",
	slug: "window",
	group: "Objects",
	emoji_version: "13.0",
	unicode_version: "13.0",
	skin_tone_support: false
},
	"🛏️": {
	name: "bed",
	slug: "bed",
	group: "Objects",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🛋️": {
	name: "couch and lamp",
	slug: "couch_and_lamp",
	group: "Objects",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🪑": {
	name: "chair",
	slug: "chair",
	group: "Objects",
	emoji_version: "12.0",
	unicode_version: "12.0",
	skin_tone_support: false
},
	"🚽": {
	name: "toilet",
	slug: "toilet",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🪠": {
	name: "plunger",
	slug: "plunger",
	group: "Objects",
	emoji_version: "13.0",
	unicode_version: "13.0",
	skin_tone_support: false
},
	"🚿": {
	name: "shower",
	slug: "shower",
	group: "Objects",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🛁": {
	name: "bathtub",
	slug: "bathtub",
	group: "Objects",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🪤": {
	name: "mouse trap",
	slug: "mouse_trap",
	group: "Objects",
	emoji_version: "13.0",
	unicode_version: "13.0",
	skin_tone_support: false
},
	"🪒": {
	name: "razor",
	slug: "razor",
	group: "Objects",
	emoji_version: "12.0",
	unicode_version: "12.0",
	skin_tone_support: false
},
	"🧴": {
	name: "lotion bottle",
	slug: "lotion_bottle",
	group: "Objects",
	emoji_version: "11.0",
	unicode_version: "11.0",
	skin_tone_support: false
},
	"🧷": {
	name: "safety pin",
	slug: "safety_pin",
	group: "Objects",
	emoji_version: "11.0",
	unicode_version: "11.0",
	skin_tone_support: false
},
	"🧹": {
	name: "broom",
	slug: "broom",
	group: "Objects",
	emoji_version: "11.0",
	unicode_version: "11.0",
	skin_tone_support: false
},
	"🧺": {
	name: "basket",
	slug: "basket",
	group: "Objects",
	emoji_version: "11.0",
	unicode_version: "11.0",
	skin_tone_support: false
},
	"🧻": {
	name: "roll of paper",
	slug: "roll_of_paper",
	group: "Objects",
	emoji_version: "11.0",
	unicode_version: "11.0",
	skin_tone_support: false
},
	"🪣": {
	name: "bucket",
	slug: "bucket",
	group: "Objects",
	emoji_version: "13.0",
	unicode_version: "13.0",
	skin_tone_support: false
},
	"🧼": {
	name: "soap",
	slug: "soap",
	group: "Objects",
	emoji_version: "11.0",
	unicode_version: "11.0",
	skin_tone_support: false
},
	"🫧": {
	name: "bubbles",
	slug: "bubbles",
	group: "Objects",
	emoji_version: "14.0",
	unicode_version: "14.0",
	skin_tone_support: false
},
	"🪥": {
	name: "toothbrush",
	slug: "toothbrush",
	group: "Objects",
	emoji_version: "13.0",
	unicode_version: "13.0",
	skin_tone_support: false
},
	"🧽": {
	name: "sponge",
	slug: "sponge",
	group: "Objects",
	emoji_version: "11.0",
	unicode_version: "11.0",
	skin_tone_support: false
},
	"🧯": {
	name: "fire extinguisher",
	slug: "fire_extinguisher",
	group: "Objects",
	emoji_version: "11.0",
	unicode_version: "11.0",
	skin_tone_support: false
},
	"🛒": {
	name: "shopping cart",
	slug: "shopping_cart",
	group: "Objects",
	emoji_version: "3.0",
	unicode_version: "3.0",
	skin_tone_support: false
},
	"🚬": {
	name: "cigarette",
	slug: "cigarette",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"⚰️": {
	name: "coffin",
	slug: "coffin",
	group: "Objects",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🪦": {
	name: "headstone",
	slug: "headstone",
	group: "Objects",
	emoji_version: "13.0",
	unicode_version: "13.0",
	skin_tone_support: false
},
	"⚱️": {
	name: "funeral urn",
	slug: "funeral_urn",
	group: "Objects",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🧿": {
	name: "nazar amulet",
	slug: "nazar_amulet",
	group: "Objects",
	emoji_version: "11.0",
	unicode_version: "11.0",
	skin_tone_support: false
},
	"🪬": {
	name: "hamsa",
	slug: "hamsa",
	group: "Objects",
	emoji_version: "14.0",
	unicode_version: "14.0",
	skin_tone_support: false
},
	"🗿": {
	name: "moai",
	slug: "moai",
	group: "Objects",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🪧": {
	name: "placard",
	slug: "placard",
	group: "Objects",
	emoji_version: "13.0",
	unicode_version: "13.0",
	skin_tone_support: false
},
	"🪪": {
	name: "identification card",
	slug: "identification_card",
	group: "Objects",
	emoji_version: "14.0",
	unicode_version: "14.0",
	skin_tone_support: false
},
	"🏧": {
	name: "ATM sign",
	slug: "atm_sign",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🚮": {
	name: "litter in bin sign",
	slug: "litter_in_bin_sign",
	group: "Symbols",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🚰": {
	name: "potable water",
	slug: "potable_water",
	group: "Symbols",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"♿": {
	name: "wheelchair symbol",
	slug: "wheelchair_symbol",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🚹": {
	name: "men’s room",
	slug: "men_s_room",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🚺": {
	name: "women’s room",
	slug: "women_s_room",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🚻": {
	name: "restroom",
	slug: "restroom",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🚼": {
	name: "baby symbol",
	slug: "baby_symbol",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🚾": {
	name: "water closet",
	slug: "water_closet",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🛂": {
	name: "passport control",
	slug: "passport_control",
	group: "Symbols",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🛃": {
	name: "customs",
	slug: "customs",
	group: "Symbols",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🛄": {
	name: "baggage claim",
	slug: "baggage_claim",
	group: "Symbols",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🛅": {
	name: "left luggage",
	slug: "left_luggage",
	group: "Symbols",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"⚠️": {
	name: "warning",
	slug: "warning",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🚸": {
	name: "children crossing",
	slug: "children_crossing",
	group: "Symbols",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"⛔": {
	name: "no entry",
	slug: "no_entry",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🚫": {
	name: "prohibited",
	slug: "prohibited",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🚳": {
	name: "no bicycles",
	slug: "no_bicycles",
	group: "Symbols",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🚭": {
	name: "no smoking",
	slug: "no_smoking",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🚯": {
	name: "no littering",
	slug: "no_littering",
	group: "Symbols",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🚱": {
	name: "non-potable water",
	slug: "non_potable_water",
	group: "Symbols",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🚷": {
	name: "no pedestrians",
	slug: "no_pedestrians",
	group: "Symbols",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"📵": {
	name: "no mobile phones",
	slug: "no_mobile_phones",
	group: "Symbols",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🔞": {
	name: "no one under eighteen",
	slug: "no_one_under_eighteen",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"☢️": {
	name: "radioactive",
	slug: "radioactive",
	group: "Symbols",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"☣️": {
	name: "biohazard",
	slug: "biohazard",
	group: "Symbols",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"⬆️": {
	name: "up arrow",
	slug: "up_arrow",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"↗️": {
	name: "up-right arrow",
	slug: "up_right_arrow",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"➡️": {
	name: "right arrow",
	slug: "right_arrow",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"↘️": {
	name: "down-right arrow",
	slug: "down_right_arrow",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"⬇️": {
	name: "down arrow",
	slug: "down_arrow",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"↙️": {
	name: "down-left arrow",
	slug: "down_left_arrow",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"⬅️": {
	name: "left arrow",
	slug: "left_arrow",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"↖️": {
	name: "up-left arrow",
	slug: "up_left_arrow",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"↕️": {
	name: "up-down arrow",
	slug: "up_down_arrow",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"↔️": {
	name: "left-right arrow",
	slug: "left_right_arrow",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"↩️": {
	name: "right arrow curving left",
	slug: "right_arrow_curving_left",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"↪️": {
	name: "left arrow curving right",
	slug: "left_arrow_curving_right",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"⤴️": {
	name: "right arrow curving up",
	slug: "right_arrow_curving_up",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"⤵️": {
	name: "right arrow curving down",
	slug: "right_arrow_curving_down",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🔃": {
	name: "clockwise vertical arrows",
	slug: "clockwise_vertical_arrows",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🔄": {
	name: "counterclockwise arrows button",
	slug: "counterclockwise_arrows_button",
	group: "Symbols",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🔙": {
	name: "BACK arrow",
	slug: "back_arrow",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🔚": {
	name: "END arrow",
	slug: "end_arrow",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🔛": {
	name: "ON! arrow",
	slug: "on_arrow",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🔜": {
	name: "SOON arrow",
	slug: "soon_arrow",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🔝": {
	name: "TOP arrow",
	slug: "top_arrow",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🛐": {
	name: "place of worship",
	slug: "place_of_worship",
	group: "Symbols",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"⚛️": {
	name: "atom symbol",
	slug: "atom_symbol",
	group: "Symbols",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🕉️": {
	name: "om",
	slug: "om",
	group: "Symbols",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"✡️": {
	name: "star of David",
	slug: "star_of_david",
	group: "Symbols",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"☸️": {
	name: "wheel of dharma",
	slug: "wheel_of_dharma",
	group: "Symbols",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"☯️": {
	name: "yin yang",
	slug: "yin_yang",
	group: "Symbols",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"✝️": {
	name: "latin cross",
	slug: "latin_cross",
	group: "Symbols",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"☦️": {
	name: "orthodox cross",
	slug: "orthodox_cross",
	group: "Symbols",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"☪️": {
	name: "star and crescent",
	slug: "star_and_crescent",
	group: "Symbols",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"☮️": {
	name: "peace symbol",
	slug: "peace_symbol",
	group: "Symbols",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🕎": {
	name: "menorah",
	slug: "menorah",
	group: "Symbols",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🔯": {
	name: "dotted six-pointed star",
	slug: "dotted_six_pointed_star",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🪯": {
	name: "khanda",
	slug: "khanda",
	group: "Symbols",
	emoji_version: "15.0",
	unicode_version: "15.0",
	skin_tone_support: false
},
	"♈": {
	name: "Aries",
	slug: "aries",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"♉": {
	name: "Taurus",
	slug: "taurus",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"♊": {
	name: "Gemini",
	slug: "gemini",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"♋": {
	name: "Cancer",
	slug: "cancer",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"♌": {
	name: "Leo",
	slug: "leo",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"♍": {
	name: "Virgo",
	slug: "virgo",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"♎": {
	name: "Libra",
	slug: "libra",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"♏": {
	name: "Scorpio",
	slug: "scorpio",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"♐": {
	name: "Sagittarius",
	slug: "sagittarius",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"♑": {
	name: "Capricorn",
	slug: "capricorn",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"♒": {
	name: "Aquarius",
	slug: "aquarius",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"♓": {
	name: "Pisces",
	slug: "pisces",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"⛎": {
	name: "Ophiuchus",
	slug: "ophiuchus",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🔀": {
	name: "shuffle tracks button",
	slug: "shuffle_tracks_button",
	group: "Symbols",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🔁": {
	name: "repeat button",
	slug: "repeat_button",
	group: "Symbols",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🔂": {
	name: "repeat single button",
	slug: "repeat_single_button",
	group: "Symbols",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"▶️": {
	name: "play button",
	slug: "play_button",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"⏩": {
	name: "fast-forward button",
	slug: "fast_forward_button",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"⏭️": {
	name: "next track button",
	slug: "next_track_button",
	group: "Symbols",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"⏯️": {
	name: "play or pause button",
	slug: "play_or_pause_button",
	group: "Symbols",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"◀️": {
	name: "reverse button",
	slug: "reverse_button",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"⏪": {
	name: "fast reverse button",
	slug: "fast_reverse_button",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"⏮️": {
	name: "last track button",
	slug: "last_track_button",
	group: "Symbols",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🔼": {
	name: "upwards button",
	slug: "upwards_button",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"⏫": {
	name: "fast up button",
	slug: "fast_up_button",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🔽": {
	name: "downwards button",
	slug: "downwards_button",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"⏬": {
	name: "fast down button",
	slug: "fast_down_button",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"⏸️": {
	name: "pause button",
	slug: "pause_button",
	group: "Symbols",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"⏹️": {
	name: "stop button",
	slug: "stop_button",
	group: "Symbols",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"⏺️": {
	name: "record button",
	slug: "record_button",
	group: "Symbols",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"⏏️": {
	name: "eject button",
	slug: "eject_button",
	group: "Symbols",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🎦": {
	name: "cinema",
	slug: "cinema",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🔅": {
	name: "dim button",
	slug: "dim_button",
	group: "Symbols",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🔆": {
	name: "bright button",
	slug: "bright_button",
	group: "Symbols",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"📶": {
	name: "antenna bars",
	slug: "antenna_bars",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🛜": {
	name: "wireless",
	slug: "wireless",
	group: "Symbols",
	emoji_version: "15.0",
	unicode_version: "15.0",
	skin_tone_support: false
},
	"📳": {
	name: "vibration mode",
	slug: "vibration_mode",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"📴": {
	name: "mobile phone off",
	slug: "mobile_phone_off",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"♀️": {
	name: "female sign",
	slug: "female_sign",
	group: "Symbols",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: false
},
	"♂️": {
	name: "male sign",
	slug: "male_sign",
	group: "Symbols",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: false
},
	"⚧️": {
	name: "transgender symbol",
	slug: "transgender_symbol",
	group: "Symbols",
	emoji_version: "13.0",
	unicode_version: "13.0",
	skin_tone_support: false
},
	"✖️": {
	name: "multiply",
	slug: "multiply",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"➕": {
	name: "plus",
	slug: "plus",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"➖": {
	name: "minus",
	slug: "minus",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"➗": {
	name: "divide",
	slug: "divide",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🟰": {
	name: "heavy equals sign",
	slug: "heavy_equals_sign",
	group: "Symbols",
	emoji_version: "14.0",
	unicode_version: "14.0",
	skin_tone_support: false
},
	"♾️": {
	name: "infinity",
	slug: "infinity",
	group: "Symbols",
	emoji_version: "11.0",
	unicode_version: "11.0",
	skin_tone_support: false
},
	"‼️": {
	name: "double exclamation mark",
	slug: "double_exclamation_mark",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"⁉️": {
	name: "exclamation question mark",
	slug: "exclamation_question_mark",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"❓": {
	name: "red question mark",
	slug: "red_question_mark",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"❔": {
	name: "white question mark",
	slug: "white_question_mark",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"❕": {
	name: "white exclamation mark",
	slug: "white_exclamation_mark",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"❗": {
	name: "red exclamation mark",
	slug: "red_exclamation_mark",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"〰️": {
	name: "wavy dash",
	slug: "wavy_dash",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"💱": {
	name: "currency exchange",
	slug: "currency_exchange",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"💲": {
	name: "heavy dollar sign",
	slug: "heavy_dollar_sign",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"⚕️": {
	name: "medical symbol",
	slug: "medical_symbol",
	group: "Symbols",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: false
},
	"♻️": {
	name: "recycling symbol",
	slug: "recycling_symbol",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"⚜️": {
	name: "fleur-de-lis",
	slug: "fleur_de_lis",
	group: "Symbols",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🔱": {
	name: "trident emblem",
	slug: "trident_emblem",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"📛": {
	name: "name badge",
	slug: "name_badge",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🔰": {
	name: "Japanese symbol for beginner",
	slug: "japanese_symbol_for_beginner",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"⭕": {
	name: "hollow red circle",
	slug: "hollow_red_circle",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"✅": {
	name: "check mark button",
	slug: "check_mark_button",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"☑️": {
	name: "check box with check",
	slug: "check_box_with_check",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"✔️": {
	name: "check mark",
	slug: "check_mark",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"❌": {
	name: "cross mark",
	slug: "cross_mark",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"❎": {
	name: "cross mark button",
	slug: "cross_mark_button",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"➰": {
	name: "curly loop",
	slug: "curly_loop",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"➿": {
	name: "double curly loop",
	slug: "double_curly_loop",
	group: "Symbols",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"〽️": {
	name: "part alternation mark",
	slug: "part_alternation_mark",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"✳️": {
	name: "eight-spoked asterisk",
	slug: "eight_spoked_asterisk",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"✴️": {
	name: "eight-pointed star",
	slug: "eight_pointed_star",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"❇️": {
	name: "sparkle",
	slug: "sparkle",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"©️": {
	name: "copyright",
	slug: "copyright",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"®️": {
	name: "registered",
	slug: "registered",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"™️": {
	name: "trade mark",
	slug: "trade_mark",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"#️⃣": {
	name: "keycap #",
	slug: "keycap_number_sign",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"*️⃣": {
	name: "keycap *",
	slug: "keycap_asterisk",
	group: "Symbols",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"0️⃣": {
	name: "keycap 0",
	slug: "keycap_0",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"1️⃣": {
	name: "keycap 1",
	slug: "keycap_1",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"2️⃣": {
	name: "keycap 2",
	slug: "keycap_2",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"3️⃣": {
	name: "keycap 3",
	slug: "keycap_3",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"4️⃣": {
	name: "keycap 4",
	slug: "keycap_4",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"5️⃣": {
	name: "keycap 5",
	slug: "keycap_5",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"6️⃣": {
	name: "keycap 6",
	slug: "keycap_6",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"7️⃣": {
	name: "keycap 7",
	slug: "keycap_7",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"8️⃣": {
	name: "keycap 8",
	slug: "keycap_8",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"9️⃣": {
	name: "keycap 9",
	slug: "keycap_9",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🔟": {
	name: "keycap 10",
	slug: "keycap_10",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🔠": {
	name: "input latin uppercase",
	slug: "input_latin_uppercase",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🔡": {
	name: "input latin lowercase",
	slug: "input_latin_lowercase",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🔢": {
	name: "input numbers",
	slug: "input_numbers",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🔣": {
	name: "input symbols",
	slug: "input_symbols",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🔤": {
	name: "input latin letters",
	slug: "input_latin_letters",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🅰️": {
	name: "A button (blood type)",
	slug: "a_button",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🆎": {
	name: "AB button (blood type)",
	slug: "ab_button",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🅱️": {
	name: "B button (blood type)",
	slug: "b_button",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🆑": {
	name: "CL button",
	slug: "cl_button",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🆒": {
	name: "COOL button",
	slug: "cool_button",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🆓": {
	name: "FREE button",
	slug: "free_button",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"ℹ️": {
	name: "information",
	slug: "information",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🆔": {
	name: "ID button",
	slug: "id_button",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"Ⓜ️": {
	name: "circled M",
	slug: "circled_m",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🆕": {
	name: "NEW button",
	slug: "new_button",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🆖": {
	name: "NG button",
	slug: "ng_button",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🅾️": {
	name: "O button (blood type)",
	slug: "o_button",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🆗": {
	name: "OK button",
	slug: "ok_button",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🅿️": {
	name: "P button",
	slug: "p_button",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🆘": {
	name: "SOS button",
	slug: "sos_button",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🆙": {
	name: "UP! button",
	slug: "up_button",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🆚": {
	name: "VS button",
	slug: "vs_button",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🈁": {
	name: "Japanese “here” button",
	slug: "japanese_here_button",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🈂️": {
	name: "Japanese “service charge” button",
	slug: "japanese_service_charge_button",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🈷️": {
	name: "Japanese “monthly amount” button",
	slug: "japanese_monthly_amount_button",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🈶": {
	name: "Japanese “not free of charge” button",
	slug: "japanese_not_free_of_charge_button",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🈯": {
	name: "Japanese “reserved” button",
	slug: "japanese_reserved_button",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🉐": {
	name: "Japanese “bargain” button",
	slug: "japanese_bargain_button",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🈹": {
	name: "Japanese “discount” button",
	slug: "japanese_discount_button",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🈚": {
	name: "Japanese “free of charge” button",
	slug: "japanese_free_of_charge_button",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🈲": {
	name: "Japanese “prohibited” button",
	slug: "japanese_prohibited_button",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🉑": {
	name: "Japanese “acceptable” button",
	slug: "japanese_acceptable_button",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🈸": {
	name: "Japanese “application” button",
	slug: "japanese_application_button",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🈴": {
	name: "Japanese “passing grade” button",
	slug: "japanese_passing_grade_button",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🈳": {
	name: "Japanese “vacancy” button",
	slug: "japanese_vacancy_button",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"㊗️": {
	name: "Japanese “congratulations” button",
	slug: "japanese_congratulations_button",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"㊙️": {
	name: "Japanese “secret” button",
	slug: "japanese_secret_button",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🈺": {
	name: "Japanese “open for business” button",
	slug: "japanese_open_for_business_button",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🈵": {
	name: "Japanese “no vacancy” button",
	slug: "japanese_no_vacancy_button",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🔴": {
	name: "red circle",
	slug: "red_circle",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🟠": {
	name: "orange circle",
	slug: "orange_circle",
	group: "Symbols",
	emoji_version: "12.0",
	unicode_version: "12.0",
	skin_tone_support: false
},
	"🟡": {
	name: "yellow circle",
	slug: "yellow_circle",
	group: "Symbols",
	emoji_version: "12.0",
	unicode_version: "12.0",
	skin_tone_support: false
},
	"🟢": {
	name: "green circle",
	slug: "green_circle",
	group: "Symbols",
	emoji_version: "12.0",
	unicode_version: "12.0",
	skin_tone_support: false
},
	"🔵": {
	name: "blue circle",
	slug: "blue_circle",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🟣": {
	name: "purple circle",
	slug: "purple_circle",
	group: "Symbols",
	emoji_version: "12.0",
	unicode_version: "12.0",
	skin_tone_support: false
},
	"🟤": {
	name: "brown circle",
	slug: "brown_circle",
	group: "Symbols",
	emoji_version: "12.0",
	unicode_version: "12.0",
	skin_tone_support: false
},
	"⚫": {
	name: "black circle",
	slug: "black_circle",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"⚪": {
	name: "white circle",
	slug: "white_circle",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🟥": {
	name: "red square",
	slug: "red_square",
	group: "Symbols",
	emoji_version: "12.0",
	unicode_version: "12.0",
	skin_tone_support: false
},
	"🟧": {
	name: "orange square",
	slug: "orange_square",
	group: "Symbols",
	emoji_version: "12.0",
	unicode_version: "12.0",
	skin_tone_support: false
},
	"🟨": {
	name: "yellow square",
	slug: "yellow_square",
	group: "Symbols",
	emoji_version: "12.0",
	unicode_version: "12.0",
	skin_tone_support: false
},
	"🟩": {
	name: "green square",
	slug: "green_square",
	group: "Symbols",
	emoji_version: "12.0",
	unicode_version: "12.0",
	skin_tone_support: false
},
	"🟦": {
	name: "blue square",
	slug: "blue_square",
	group: "Symbols",
	emoji_version: "12.0",
	unicode_version: "12.0",
	skin_tone_support: false
},
	"🟪": {
	name: "purple square",
	slug: "purple_square",
	group: "Symbols",
	emoji_version: "12.0",
	unicode_version: "12.0",
	skin_tone_support: false
},
	"🟫": {
	name: "brown square",
	slug: "brown_square",
	group: "Symbols",
	emoji_version: "12.0",
	unicode_version: "12.0",
	skin_tone_support: false
},
	"⬛": {
	name: "black large square",
	slug: "black_large_square",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"⬜": {
	name: "white large square",
	slug: "white_large_square",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"◼️": {
	name: "black medium square",
	slug: "black_medium_square",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"◻️": {
	name: "white medium square",
	slug: "white_medium_square",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"◾": {
	name: "black medium-small square",
	slug: "black_medium_small_square",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"◽": {
	name: "white medium-small square",
	slug: "white_medium_small_square",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"▪️": {
	name: "black small square",
	slug: "black_small_square",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"▫️": {
	name: "white small square",
	slug: "white_small_square",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🔶": {
	name: "large orange diamond",
	slug: "large_orange_diamond",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🔷": {
	name: "large blue diamond",
	slug: "large_blue_diamond",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🔸": {
	name: "small orange diamond",
	slug: "small_orange_diamond",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🔹": {
	name: "small blue diamond",
	slug: "small_blue_diamond",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🔺": {
	name: "red triangle pointed up",
	slug: "red_triangle_pointed_up",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🔻": {
	name: "red triangle pointed down",
	slug: "red_triangle_pointed_down",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"💠": {
	name: "diamond with a dot",
	slug: "diamond_with_a_dot",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🔘": {
	name: "radio button",
	slug: "radio_button",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🔳": {
	name: "white square button",
	slug: "white_square_button",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🔲": {
	name: "black square button",
	slug: "black_square_button",
	group: "Symbols",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🏁": {
	name: "chequered flag",
	slug: "chequered_flag",
	group: "Flags",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🚩": {
	name: "triangular flag",
	slug: "triangular_flag",
	group: "Flags",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🎌": {
	name: "crossed flags",
	slug: "crossed_flags",
	group: "Flags",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🏴": {
	name: "black flag",
	slug: "black_flag",
	group: "Flags",
	emoji_version: "1.0",
	unicode_version: "1.0",
	skin_tone_support: false
},
	"🏳️": {
	name: "white flag",
	slug: "white_flag",
	group: "Flags",
	emoji_version: "0.7",
	unicode_version: "0.7",
	skin_tone_support: false
},
	"🏳️‍🌈": {
	name: "rainbow flag",
	slug: "rainbow_flag",
	group: "Flags",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: false
},
	"🏳️‍⚧️": {
	name: "transgender flag",
	slug: "transgender_flag",
	group: "Flags",
	emoji_version: "13.0",
	unicode_version: "13.0",
	skin_tone_support: false
},
	"🏴‍☠️": {
	name: "pirate flag",
	slug: "pirate_flag",
	group: "Flags",
	emoji_version: "11.0",
	unicode_version: "11.0",
	skin_tone_support: false
},
	"🇦🇨": {
	name: "flag Ascension Island",
	slug: "flag_ascension_island",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇦🇩": {
	name: "flag Andorra",
	slug: "flag_andorra",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇦🇪": {
	name: "flag United Arab Emirates",
	slug: "flag_united_arab_emirates",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇦🇫": {
	name: "flag Afghanistan",
	slug: "flag_afghanistan",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇦🇬": {
	name: "flag Antigua & Barbuda",
	slug: "flag_antigua_barbuda",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇦🇮": {
	name: "flag Anguilla",
	slug: "flag_anguilla",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇦🇱": {
	name: "flag Albania",
	slug: "flag_albania",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇦🇲": {
	name: "flag Armenia",
	slug: "flag_armenia",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇦🇴": {
	name: "flag Angola",
	slug: "flag_angola",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇦🇶": {
	name: "flag Antarctica",
	slug: "flag_antarctica",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇦🇷": {
	name: "flag Argentina",
	slug: "flag_argentina",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇦🇸": {
	name: "flag American Samoa",
	slug: "flag_american_samoa",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇦🇹": {
	name: "flag Austria",
	slug: "flag_austria",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇦🇺": {
	name: "flag Australia",
	slug: "flag_australia",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇦🇼": {
	name: "flag Aruba",
	slug: "flag_aruba",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇦🇽": {
	name: "flag Åland Islands",
	slug: "flag_aland_islands",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇦🇿": {
	name: "flag Azerbaijan",
	slug: "flag_azerbaijan",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇧🇦": {
	name: "flag Bosnia & Herzegovina",
	slug: "flag_bosnia_herzegovina",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇧🇧": {
	name: "flag Barbados",
	slug: "flag_barbados",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇧🇩": {
	name: "flag Bangladesh",
	slug: "flag_bangladesh",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇧🇪": {
	name: "flag Belgium",
	slug: "flag_belgium",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇧🇫": {
	name: "flag Burkina Faso",
	slug: "flag_burkina_faso",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇧🇬": {
	name: "flag Bulgaria",
	slug: "flag_bulgaria",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇧🇭": {
	name: "flag Bahrain",
	slug: "flag_bahrain",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇧🇮": {
	name: "flag Burundi",
	slug: "flag_burundi",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇧🇯": {
	name: "flag Benin",
	slug: "flag_benin",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇧🇱": {
	name: "flag St. Barthélemy",
	slug: "flag_st_barthelemy",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇧🇲": {
	name: "flag Bermuda",
	slug: "flag_bermuda",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇧🇳": {
	name: "flag Brunei",
	slug: "flag_brunei",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇧🇴": {
	name: "flag Bolivia",
	slug: "flag_bolivia",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇧🇶": {
	name: "flag Caribbean Netherlands",
	slug: "flag_caribbean_netherlands",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇧🇷": {
	name: "flag Brazil",
	slug: "flag_brazil",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇧🇸": {
	name: "flag Bahamas",
	slug: "flag_bahamas",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇧🇹": {
	name: "flag Bhutan",
	slug: "flag_bhutan",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇧🇻": {
	name: "flag Bouvet Island",
	slug: "flag_bouvet_island",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇧🇼": {
	name: "flag Botswana",
	slug: "flag_botswana",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇧🇾": {
	name: "flag Belarus",
	slug: "flag_belarus",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇧🇿": {
	name: "flag Belize",
	slug: "flag_belize",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇨🇦": {
	name: "flag Canada",
	slug: "flag_canada",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇨🇨": {
	name: "flag Cocos (Keeling) Islands",
	slug: "flag_cocos_islands",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇨🇩": {
	name: "flag Congo - Kinshasa",
	slug: "flag_congo_kinshasa",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇨🇫": {
	name: "flag Central African Republic",
	slug: "flag_central_african_republic",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇨🇬": {
	name: "flag Congo - Brazzaville",
	slug: "flag_congo_brazzaville",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇨🇭": {
	name: "flag Switzerland",
	slug: "flag_switzerland",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇨🇮": {
	name: "flag Côte d’Ivoire",
	slug: "flag_cote_d_ivoire",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇨🇰": {
	name: "flag Cook Islands",
	slug: "flag_cook_islands",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇨🇱": {
	name: "flag Chile",
	slug: "flag_chile",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇨🇲": {
	name: "flag Cameroon",
	slug: "flag_cameroon",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇨🇳": {
	name: "flag China",
	slug: "flag_china",
	group: "Flags",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🇨🇴": {
	name: "flag Colombia",
	slug: "flag_colombia",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇨🇵": {
	name: "flag Clipperton Island",
	slug: "flag_clipperton_island",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇨🇷": {
	name: "flag Costa Rica",
	slug: "flag_costa_rica",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇨🇺": {
	name: "flag Cuba",
	slug: "flag_cuba",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇨🇻": {
	name: "flag Cape Verde",
	slug: "flag_cape_verde",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇨🇼": {
	name: "flag Curaçao",
	slug: "flag_curacao",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇨🇽": {
	name: "flag Christmas Island",
	slug: "flag_christmas_island",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇨🇾": {
	name: "flag Cyprus",
	slug: "flag_cyprus",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇨🇿": {
	name: "flag Czechia",
	slug: "flag_czechia",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇩🇪": {
	name: "flag Germany",
	slug: "flag_germany",
	group: "Flags",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🇩🇬": {
	name: "flag Diego Garcia",
	slug: "flag_diego_garcia",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇩🇯": {
	name: "flag Djibouti",
	slug: "flag_djibouti",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇩🇰": {
	name: "flag Denmark",
	slug: "flag_denmark",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇩🇲": {
	name: "flag Dominica",
	slug: "flag_dominica",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇩🇴": {
	name: "flag Dominican Republic",
	slug: "flag_dominican_republic",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇩🇿": {
	name: "flag Algeria",
	slug: "flag_algeria",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇪🇦": {
	name: "flag Ceuta & Melilla",
	slug: "flag_ceuta_melilla",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇪🇨": {
	name: "flag Ecuador",
	slug: "flag_ecuador",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇪🇪": {
	name: "flag Estonia",
	slug: "flag_estonia",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇪🇬": {
	name: "flag Egypt",
	slug: "flag_egypt",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇪🇭": {
	name: "flag Western Sahara",
	slug: "flag_western_sahara",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇪🇷": {
	name: "flag Eritrea",
	slug: "flag_eritrea",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇪🇸": {
	name: "flag Spain",
	slug: "flag_spain",
	group: "Flags",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🇪🇹": {
	name: "flag Ethiopia",
	slug: "flag_ethiopia",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇪🇺": {
	name: "flag European Union",
	slug: "flag_european_union",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇫🇮": {
	name: "flag Finland",
	slug: "flag_finland",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇫🇯": {
	name: "flag Fiji",
	slug: "flag_fiji",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇫🇰": {
	name: "flag Falkland Islands",
	slug: "flag_falkland_islands",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇫🇲": {
	name: "flag Micronesia",
	slug: "flag_micronesia",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇫🇴": {
	name: "flag Faroe Islands",
	slug: "flag_faroe_islands",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇫🇷": {
	name: "flag France",
	slug: "flag_france",
	group: "Flags",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🇬🇦": {
	name: "flag Gabon",
	slug: "flag_gabon",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇬🇧": {
	name: "flag United Kingdom",
	slug: "flag_united_kingdom",
	group: "Flags",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🇬🇩": {
	name: "flag Grenada",
	slug: "flag_grenada",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇬🇪": {
	name: "flag Georgia",
	slug: "flag_georgia",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇬🇫": {
	name: "flag French Guiana",
	slug: "flag_french_guiana",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇬🇬": {
	name: "flag Guernsey",
	slug: "flag_guernsey",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇬🇭": {
	name: "flag Ghana",
	slug: "flag_ghana",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇬🇮": {
	name: "flag Gibraltar",
	slug: "flag_gibraltar",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇬🇱": {
	name: "flag Greenland",
	slug: "flag_greenland",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇬🇲": {
	name: "flag Gambia",
	slug: "flag_gambia",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇬🇳": {
	name: "flag Guinea",
	slug: "flag_guinea",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇬🇵": {
	name: "flag Guadeloupe",
	slug: "flag_guadeloupe",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇬🇶": {
	name: "flag Equatorial Guinea",
	slug: "flag_equatorial_guinea",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇬🇷": {
	name: "flag Greece",
	slug: "flag_greece",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇬🇸": {
	name: "flag South Georgia & South Sandwich Islands",
	slug: "flag_south_georgia_south_sandwich_islands",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇬🇹": {
	name: "flag Guatemala",
	slug: "flag_guatemala",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇬🇺": {
	name: "flag Guam",
	slug: "flag_guam",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇬🇼": {
	name: "flag Guinea-Bissau",
	slug: "flag_guinea_bissau",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇬🇾": {
	name: "flag Guyana",
	slug: "flag_guyana",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇭🇰": {
	name: "flag Hong Kong SAR China",
	slug: "flag_hong_kong_sar_china",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇭🇲": {
	name: "flag Heard & McDonald Islands",
	slug: "flag_heard_mcdonald_islands",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇭🇳": {
	name: "flag Honduras",
	slug: "flag_honduras",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇭🇷": {
	name: "flag Croatia",
	slug: "flag_croatia",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇭🇹": {
	name: "flag Haiti",
	slug: "flag_haiti",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇭🇺": {
	name: "flag Hungary",
	slug: "flag_hungary",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇮🇨": {
	name: "flag Canary Islands",
	slug: "flag_canary_islands",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇮🇩": {
	name: "flag Indonesia",
	slug: "flag_indonesia",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇮🇪": {
	name: "flag Ireland",
	slug: "flag_ireland",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇮🇱": {
	name: "flag Israel",
	slug: "flag_israel",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇮🇲": {
	name: "flag Isle of Man",
	slug: "flag_isle_of_man",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇮🇳": {
	name: "flag India",
	slug: "flag_india",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇮🇴": {
	name: "flag British Indian Ocean Territory",
	slug: "flag_british_indian_ocean_territory",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇮🇶": {
	name: "flag Iraq",
	slug: "flag_iraq",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇮🇷": {
	name: "flag Iran",
	slug: "flag_iran",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇮🇸": {
	name: "flag Iceland",
	slug: "flag_iceland",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇮🇹": {
	name: "flag Italy",
	slug: "flag_italy",
	group: "Flags",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🇯🇪": {
	name: "flag Jersey",
	slug: "flag_jersey",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇯🇲": {
	name: "flag Jamaica",
	slug: "flag_jamaica",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇯🇴": {
	name: "flag Jordan",
	slug: "flag_jordan",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇯🇵": {
	name: "flag Japan",
	slug: "flag_japan",
	group: "Flags",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🇰🇪": {
	name: "flag Kenya",
	slug: "flag_kenya",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇰🇬": {
	name: "flag Kyrgyzstan",
	slug: "flag_kyrgyzstan",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇰🇭": {
	name: "flag Cambodia",
	slug: "flag_cambodia",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇰🇮": {
	name: "flag Kiribati",
	slug: "flag_kiribati",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇰🇲": {
	name: "flag Comoros",
	slug: "flag_comoros",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇰🇳": {
	name: "flag St. Kitts & Nevis",
	slug: "flag_st_kitts_nevis",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇰🇵": {
	name: "flag North Korea",
	slug: "flag_north_korea",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇰🇷": {
	name: "flag South Korea",
	slug: "flag_south_korea",
	group: "Flags",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🇰🇼": {
	name: "flag Kuwait",
	slug: "flag_kuwait",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇰🇾": {
	name: "flag Cayman Islands",
	slug: "flag_cayman_islands",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇰🇿": {
	name: "flag Kazakhstan",
	slug: "flag_kazakhstan",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇱🇦": {
	name: "flag Laos",
	slug: "flag_laos",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇱🇧": {
	name: "flag Lebanon",
	slug: "flag_lebanon",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇱🇨": {
	name: "flag St. Lucia",
	slug: "flag_st_lucia",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇱🇮": {
	name: "flag Liechtenstein",
	slug: "flag_liechtenstein",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇱🇰": {
	name: "flag Sri Lanka",
	slug: "flag_sri_lanka",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇱🇷": {
	name: "flag Liberia",
	slug: "flag_liberia",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇱🇸": {
	name: "flag Lesotho",
	slug: "flag_lesotho",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇱🇹": {
	name: "flag Lithuania",
	slug: "flag_lithuania",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇱🇺": {
	name: "flag Luxembourg",
	slug: "flag_luxembourg",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇱🇻": {
	name: "flag Latvia",
	slug: "flag_latvia",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇱🇾": {
	name: "flag Libya",
	slug: "flag_libya",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇲🇦": {
	name: "flag Morocco",
	slug: "flag_morocco",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇲🇨": {
	name: "flag Monaco",
	slug: "flag_monaco",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇲🇩": {
	name: "flag Moldova",
	slug: "flag_moldova",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇲🇪": {
	name: "flag Montenegro",
	slug: "flag_montenegro",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇲🇫": {
	name: "flag St. Martin",
	slug: "flag_st_martin",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇲🇬": {
	name: "flag Madagascar",
	slug: "flag_madagascar",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇲🇭": {
	name: "flag Marshall Islands",
	slug: "flag_marshall_islands",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇲🇰": {
	name: "flag North Macedonia",
	slug: "flag_north_macedonia",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇲🇱": {
	name: "flag Mali",
	slug: "flag_mali",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇲🇲": {
	name: "flag Myanmar (Burma)",
	slug: "flag_myanmar",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇲🇳": {
	name: "flag Mongolia",
	slug: "flag_mongolia",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇲🇴": {
	name: "flag Macao SAR China",
	slug: "flag_macao_sar_china",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇲🇵": {
	name: "flag Northern Mariana Islands",
	slug: "flag_northern_mariana_islands",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇲🇶": {
	name: "flag Martinique",
	slug: "flag_martinique",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇲🇷": {
	name: "flag Mauritania",
	slug: "flag_mauritania",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇲🇸": {
	name: "flag Montserrat",
	slug: "flag_montserrat",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇲🇹": {
	name: "flag Malta",
	slug: "flag_malta",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇲🇺": {
	name: "flag Mauritius",
	slug: "flag_mauritius",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇲🇻": {
	name: "flag Maldives",
	slug: "flag_maldives",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇲🇼": {
	name: "flag Malawi",
	slug: "flag_malawi",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇲🇽": {
	name: "flag Mexico",
	slug: "flag_mexico",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇲🇾": {
	name: "flag Malaysia",
	slug: "flag_malaysia",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇲🇿": {
	name: "flag Mozambique",
	slug: "flag_mozambique",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇳🇦": {
	name: "flag Namibia",
	slug: "flag_namibia",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇳🇨": {
	name: "flag New Caledonia",
	slug: "flag_new_caledonia",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇳🇪": {
	name: "flag Niger",
	slug: "flag_niger",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇳🇫": {
	name: "flag Norfolk Island",
	slug: "flag_norfolk_island",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇳🇬": {
	name: "flag Nigeria",
	slug: "flag_nigeria",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇳🇮": {
	name: "flag Nicaragua",
	slug: "flag_nicaragua",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇳🇱": {
	name: "flag Netherlands",
	slug: "flag_netherlands",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇳🇴": {
	name: "flag Norway",
	slug: "flag_norway",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇳🇵": {
	name: "flag Nepal",
	slug: "flag_nepal",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇳🇷": {
	name: "flag Nauru",
	slug: "flag_nauru",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇳🇺": {
	name: "flag Niue",
	slug: "flag_niue",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇳🇿": {
	name: "flag New Zealand",
	slug: "flag_new_zealand",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇴🇲": {
	name: "flag Oman",
	slug: "flag_oman",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇵🇦": {
	name: "flag Panama",
	slug: "flag_panama",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇵🇪": {
	name: "flag Peru",
	slug: "flag_peru",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇵🇫": {
	name: "flag French Polynesia",
	slug: "flag_french_polynesia",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇵🇬": {
	name: "flag Papua New Guinea",
	slug: "flag_papua_new_guinea",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇵🇭": {
	name: "flag Philippines",
	slug: "flag_philippines",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇵🇰": {
	name: "flag Pakistan",
	slug: "flag_pakistan",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇵🇱": {
	name: "flag Poland",
	slug: "flag_poland",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇵🇲": {
	name: "flag St. Pierre & Miquelon",
	slug: "flag_st_pierre_miquelon",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇵🇳": {
	name: "flag Pitcairn Islands",
	slug: "flag_pitcairn_islands",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇵🇷": {
	name: "flag Puerto Rico",
	slug: "flag_puerto_rico",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇵🇸": {
	name: "flag Palestinian Territories",
	slug: "flag_palestinian_territories",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇵🇹": {
	name: "flag Portugal",
	slug: "flag_portugal",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇵🇼": {
	name: "flag Palau",
	slug: "flag_palau",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇵🇾": {
	name: "flag Paraguay",
	slug: "flag_paraguay",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇶🇦": {
	name: "flag Qatar",
	slug: "flag_qatar",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇷🇪": {
	name: "flag Réunion",
	slug: "flag_reunion",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇷🇴": {
	name: "flag Romania",
	slug: "flag_romania",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇷🇸": {
	name: "flag Serbia",
	slug: "flag_serbia",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇷🇺": {
	name: "flag Russia",
	slug: "flag_russia",
	group: "Flags",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🇷🇼": {
	name: "flag Rwanda",
	slug: "flag_rwanda",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇸🇦": {
	name: "flag Saudi Arabia",
	slug: "flag_saudi_arabia",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇸🇧": {
	name: "flag Solomon Islands",
	slug: "flag_solomon_islands",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇸🇨": {
	name: "flag Seychelles",
	slug: "flag_seychelles",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇸🇩": {
	name: "flag Sudan",
	slug: "flag_sudan",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇸🇪": {
	name: "flag Sweden",
	slug: "flag_sweden",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇸🇬": {
	name: "flag Singapore",
	slug: "flag_singapore",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇸🇭": {
	name: "flag St. Helena",
	slug: "flag_st_helena",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇸🇮": {
	name: "flag Slovenia",
	slug: "flag_slovenia",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇸🇯": {
	name: "flag Svalbard & Jan Mayen",
	slug: "flag_svalbard_jan_mayen",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇸🇰": {
	name: "flag Slovakia",
	slug: "flag_slovakia",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇸🇱": {
	name: "flag Sierra Leone",
	slug: "flag_sierra_leone",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇸🇲": {
	name: "flag San Marino",
	slug: "flag_san_marino",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇸🇳": {
	name: "flag Senegal",
	slug: "flag_senegal",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇸🇴": {
	name: "flag Somalia",
	slug: "flag_somalia",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇸🇷": {
	name: "flag Suriname",
	slug: "flag_suriname",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇸🇸": {
	name: "flag South Sudan",
	slug: "flag_south_sudan",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇸🇹": {
	name: "flag São Tomé & Príncipe",
	slug: "flag_sao_tome_principe",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇸🇻": {
	name: "flag El Salvador",
	slug: "flag_el_salvador",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇸🇽": {
	name: "flag Sint Maarten",
	slug: "flag_sint_maarten",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇸🇾": {
	name: "flag Syria",
	slug: "flag_syria",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇸🇿": {
	name: "flag Eswatini",
	slug: "flag_eswatini",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇹🇦": {
	name: "flag Tristan da Cunha",
	slug: "flag_tristan_da_cunha",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇹🇨": {
	name: "flag Turks & Caicos Islands",
	slug: "flag_turks_caicos_islands",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇹🇩": {
	name: "flag Chad",
	slug: "flag_chad",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇹🇫": {
	name: "flag French Southern Territories",
	slug: "flag_french_southern_territories",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇹🇬": {
	name: "flag Togo",
	slug: "flag_togo",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇹🇭": {
	name: "flag Thailand",
	slug: "flag_thailand",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇹🇯": {
	name: "flag Tajikistan",
	slug: "flag_tajikistan",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇹🇰": {
	name: "flag Tokelau",
	slug: "flag_tokelau",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇹🇱": {
	name: "flag Timor-Leste",
	slug: "flag_timor_leste",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇹🇲": {
	name: "flag Turkmenistan",
	slug: "flag_turkmenistan",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇹🇳": {
	name: "flag Tunisia",
	slug: "flag_tunisia",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇹🇴": {
	name: "flag Tonga",
	slug: "flag_tonga",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇹🇷": {
	name: "flag Turkey",
	slug: "flag_turkey",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇹🇹": {
	name: "flag Trinidad & Tobago",
	slug: "flag_trinidad_tobago",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇹🇻": {
	name: "flag Tuvalu",
	slug: "flag_tuvalu",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇹🇼": {
	name: "flag Taiwan",
	slug: "flag_taiwan",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇹🇿": {
	name: "flag Tanzania",
	slug: "flag_tanzania",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇺🇦": {
	name: "flag Ukraine",
	slug: "flag_ukraine",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇺🇬": {
	name: "flag Uganda",
	slug: "flag_uganda",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇺🇲": {
	name: "flag U.S. Outlying Islands",
	slug: "flag_u_s_outlying_islands",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇺🇳": {
	name: "flag United Nations",
	slug: "flag_united_nations",
	group: "Flags",
	emoji_version: "4.0",
	unicode_version: "4.0",
	skin_tone_support: false
},
	"🇺🇸": {
	name: "flag United States",
	slug: "flag_united_states",
	group: "Flags",
	emoji_version: "0.6",
	unicode_version: "0.6",
	skin_tone_support: false
},
	"🇺🇾": {
	name: "flag Uruguay",
	slug: "flag_uruguay",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇺🇿": {
	name: "flag Uzbekistan",
	slug: "flag_uzbekistan",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇻🇦": {
	name: "flag Vatican City",
	slug: "flag_vatican_city",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇻🇨": {
	name: "flag St. Vincent & Grenadines",
	slug: "flag_st_vincent_grenadines",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇻🇪": {
	name: "flag Venezuela",
	slug: "flag_venezuela",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇻🇬": {
	name: "flag British Virgin Islands",
	slug: "flag_british_virgin_islands",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇻🇮": {
	name: "flag U.S. Virgin Islands",
	slug: "flag_u_s_virgin_islands",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇻🇳": {
	name: "flag Vietnam",
	slug: "flag_vietnam",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇻🇺": {
	name: "flag Vanuatu",
	slug: "flag_vanuatu",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇼🇫": {
	name: "flag Wallis & Futuna",
	slug: "flag_wallis_futuna",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇼🇸": {
	name: "flag Samoa",
	slug: "flag_samoa",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇽🇰": {
	name: "flag Kosovo",
	slug: "flag_kosovo",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇾🇪": {
	name: "flag Yemen",
	slug: "flag_yemen",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇾🇹": {
	name: "flag Mayotte",
	slug: "flag_mayotte",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇿🇦": {
	name: "flag South Africa",
	slug: "flag_south_africa",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇿🇲": {
	name: "flag Zambia",
	slug: "flag_zambia",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🇿🇼": {
	name: "flag Zimbabwe",
	slug: "flag_zimbabwe",
	group: "Flags",
	emoji_version: "2.0",
	unicode_version: "2.0",
	skin_tone_support: false
},
	"🏴󠁧󠁢󠁥󠁮󠁧󠁿": {
	name: "flag England",
	slug: "flag_england",
	group: "Flags",
	emoji_version: "5.0",
	unicode_version: "5.0",
	skin_tone_support: false
},
	"🏴󠁧󠁢󠁳󠁣󠁴󠁿": {
	name: "flag Scotland",
	slug: "flag_scotland",
	group: "Flags",
	emoji_version: "5.0",
	unicode_version: "5.0",
	skin_tone_support: false
},
	"🏴󠁧󠁢󠁷󠁬󠁳󠁿": {
	name: "flag Wales",
	slug: "flag_wales",
	group: "Flags",
	emoji_version: "5.0",
	unicode_version: "5.0",
	skin_tone_support: false
}
};

const emojiKeywords = {
	"😀": [
	"grinning_face",
	"face",
	"smile",
	"happy",
	"joy",
	":D",
	"grin"
],
	"😃": [
	"grinning_face_with_big_eyes",
	"face",
	"happy",
	"joy",
	"haha",
	":D",
	":)",
	"smile",
	"funny"
],
	"😄": [
	"grinning_face_with_smiling_eyes",
	"face",
	"happy",
	"joy",
	"funny",
	"haha",
	"laugh",
	"like",
	":D",
	":)",
	"smile"
],
	"😁": [
	"beaming_face_with_smiling_eyes",
	"face",
	"happy",
	"smile",
	"joy",
	"kawaii"
],
	"😆": [
	"grinning_squinting_face",
	"happy",
	"joy",
	"lol",
	"satisfied",
	"haha",
	"face",
	"glad",
	"XD",
	"laugh"
],
	"😅": [
	"grinning_face_with_sweat",
	"face",
	"hot",
	"happy",
	"laugh",
	"sweat",
	"smile",
	"relief"
],
	"🤣": [
	"rolling_on_the_floor_laughing",
	"face",
	"rolling",
	"floor",
	"laughing",
	"lol",
	"haha",
	"rofl"
],
	"😂": [
	"face_with_tears_of_joy",
	"face",
	"cry",
	"tears",
	"weep",
	"happy",
	"happytears",
	"haha"
],
	"🙂": [
	"slightly_smiling_face",
	"face",
	"smile"
],
	"🙃": [
	"upside_down_face",
	"face",
	"flipped",
	"silly",
	"smile"
],
	"😉": [
	"winking_face",
	"face",
	"happy",
	"mischievous",
	"secret",
	";)",
	"smile",
	"eye"
],
	"😊": [
	"smiling_face_with_smiling_eyes",
	"face",
	"smile",
	"happy",
	"flushed",
	"crush",
	"embarrassed",
	"shy",
	"joy"
],
	"😇": [
	"smiling_face_with_halo",
	"face",
	"angel",
	"heaven",
	"halo",
	"innocent"
],
	"🥰": [
	"smiling_face_with_hearts",
	"face",
	"love",
	"like",
	"affection",
	"valentines",
	"infatuation",
	"crush",
	"hearts",
	"adore"
],
	"😍": [
	"smiling_face_with_heart_eyes",
	"face",
	"love",
	"like",
	"affection",
	"valentines",
	"infatuation",
	"crush",
	"heart"
],
	"🤩": [
	"star_struck",
	"face",
	"smile",
	"starry",
	"eyes",
	"grinning"
],
	"😘": [
	"face_blowing_a_kiss",
	"face",
	"love",
	"like",
	"affection",
	"valentines",
	"infatuation",
	"kiss"
],
	"😗": [
	"kissing_face",
	"love",
	"like",
	"face",
	"3",
	"valentines",
	"infatuation",
	"kiss"
],
	"☺️": [
	"smiling_face",
	"face",
	"blush",
	"massage",
	"happiness"
],
	"😚": [
	"kissing_face_with_closed_eyes",
	"face",
	"love",
	"like",
	"affection",
	"valentines",
	"infatuation",
	"kiss"
],
	"😙": [
	"kissing_face_with_smiling_eyes",
	"face",
	"affection",
	"valentines",
	"infatuation",
	"kiss"
],
	"😋": [
	"face_savoring_food",
	"happy",
	"joy",
	"tongue",
	"smile",
	"face",
	"silly",
	"yummy",
	"nom",
	"delicious",
	"savouring"
],
	"😛": [
	"face_with_tongue",
	"face",
	"prank",
	"childish",
	"playful",
	"mischievous",
	"smile",
	"tongue"
],
	"😜": [
	"winking_face_with_tongue",
	"face",
	"prank",
	"childish",
	"playful",
	"mischievous",
	"smile",
	"wink",
	"tongue"
],
	"🤪": [
	"zany_face",
	"face",
	"goofy",
	"crazy"
],
	"😝": [
	"squinting_face_with_tongue",
	"face",
	"prank",
	"playful",
	"mischievous",
	"smile",
	"tongue"
],
	"🤑": [
	"money_mouth_face",
	"face",
	"rich",
	"dollar",
	"money"
],
	"🤗": [
	"hugging_face",
	"face",
	"smile",
	"hug"
],
	"🤭": [
	"face_with_hand_over_mouth",
	"face",
	"whoops",
	"shock",
	"surprise"
],
	"🤫": [
	"shushing_face",
	"face",
	"quiet",
	"shhh"
],
	"🤔": [
	"thinking_face",
	"face",
	"hmmm",
	"think",
	"consider"
],
	"🤐": [
	"zipper_mouth_face",
	"face",
	"sealed",
	"zipper",
	"secret"
],
	"🤨": [
	"face_with_raised_eyebrow",
	"face",
	"distrust",
	"scepticism",
	"disapproval",
	"disbelief",
	"surprise"
],
	"😐": [
	"neutral_face",
	"indifference",
	"meh",
	":|",
	"neutral"
],
	"😑": [
	"expressionless_face",
	"face",
	"indifferent",
	"-_-",
	"meh",
	"deadpan"
],
	"😶": [
	"face_without_mouth",
	"face",
	"hellokitty"
],
	"😏": [
	"smirking_face",
	"face",
	"smile",
	"mean",
	"prank",
	"smug",
	"sarcasm"
],
	"😒": [
	"unamused_face",
	"indifference",
	"bored",
	"straight face",
	"serious",
	"sarcasm",
	"unimpressed",
	"skeptical",
	"dubious",
	"side_eye"
],
	"🙄": [
	"face_with_rolling_eyes",
	"face",
	"eyeroll",
	"frustrated"
],
	"😬": [
	"grimacing_face",
	"face",
	"grimace",
	"teeth"
],
	"🤥": [
	"lying_face",
	"face",
	"lie",
	"pinocchio"
],
	"😌": [
	"relieved_face",
	"face",
	"relaxed",
	"phew",
	"massage",
	"happiness"
],
	"😔": [
	"pensive_face",
	"face",
	"sad",
	"depressed",
	"upset"
],
	"😪": [
	"sleepy_face",
	"face",
	"tired",
	"rest",
	"nap"
],
	"🤤": [
	"drooling_face",
	"face"
],
	"😴": [
	"sleeping_face",
	"face",
	"tired",
	"sleepy",
	"night",
	"zzz"
],
	"😷": [
	"face_with_medical_mask",
	"face",
	"sick",
	"ill",
	"disease",
	"covid"
],
	"🤒": [
	"face_with_thermometer",
	"sick",
	"temperature",
	"thermometer",
	"cold",
	"fever",
	"covid"
],
	"🤕": [
	"face_with_head_bandage",
	"injured",
	"clumsy",
	"bandage",
	"hurt"
],
	"🤢": [
	"nauseated_face",
	"face",
	"vomit",
	"gross",
	"green",
	"sick",
	"throw up",
	"ill"
],
	"🤮": [
	"face_vomiting",
	"face",
	"sick"
],
	"🤧": [
	"sneezing_face",
	"face",
	"gesundheit",
	"sneeze",
	"sick",
	"allergy"
],
	"🥵": [
	"hot_face",
	"face",
	"feverish",
	"heat",
	"red",
	"sweating"
],
	"🥶": [
	"cold_face",
	"face",
	"blue",
	"freezing",
	"frozen",
	"frostbite",
	"icicles"
],
	"🥴": [
	"woozy_face",
	"face",
	"dizzy",
	"intoxicated",
	"tipsy",
	"wavy"
],
	"😵": [
	"dizzy_face",
	"spent",
	"unconscious",
	"xox",
	"dizzy"
],
	"🤯": [
	"exploding_head",
	"face",
	"shocked",
	"mind",
	"blown"
],
	"🤠": [
	"cowboy_hat_face",
	"face",
	"cowgirl",
	"hat"
],
	"🥳": [
	"partying_face",
	"face",
	"celebration",
	"woohoo"
],
	"😎": [
	"smiling_face_with_sunglasses",
	"face",
	"cool",
	"smile",
	"summer",
	"beach",
	"sunglass"
],
	"🤓": [
	"nerd_face",
	"face",
	"nerdy",
	"geek",
	"dork"
],
	"🧐": [
	"face_with_monocle",
	"face",
	"stuffy",
	"wealthy"
],
	"😕": [
	"confused_face",
	"face",
	"indifference",
	"huh",
	"weird",
	"hmmm",
	":/"
],
	"😟": [
	"worried_face",
	"face",
	"concern",
	"nervous",
	":("
],
	"🙁": [
	"slightly_frowning_face",
	"face",
	"frowning",
	"disappointed",
	"sad",
	"upset"
],
	"☹️": [
	"frowning_face",
	"face",
	"sad",
	"upset",
	"frown"
],
	"😮": [
	"face_with_open_mouth",
	"face",
	"surprise",
	"impressed",
	"wow",
	"whoa",
	":O"
],
	"😯": [
	"hushed_face",
	"face",
	"woo",
	"shh"
],
	"😲": [
	"astonished_face",
	"face",
	"xox",
	"surprised",
	"poisoned"
],
	"😳": [
	"flushed_face",
	"face",
	"blush",
	"shy",
	"flattered"
],
	"🥺": [
	"pleading_face",
	"face",
	"begging",
	"mercy",
	"cry",
	"tears",
	"sad",
	"grievance"
],
	"😦": [
	"frowning_face_with_open_mouth",
	"face",
	"aw",
	"what"
],
	"😧": [
	"anguished_face",
	"face",
	"stunned",
	"nervous"
],
	"😨": [
	"fearful_face",
	"face",
	"scared",
	"terrified",
	"nervous"
],
	"😰": [
	"anxious_face_with_sweat",
	"face",
	"nervous",
	"sweat"
],
	"😥": [
	"sad_but_relieved_face",
	"face",
	"phew",
	"sweat",
	"nervous"
],
	"😢": [
	"crying_face",
	"face",
	"tears",
	"sad",
	"depressed",
	"upset",
	":'("
],
	"😭": [
	"loudly_crying_face",
	"face",
	"cry",
	"tears",
	"sad",
	"upset",
	"depressed"
],
	"😱": [
	"face_screaming_in_fear",
	"face",
	"munch",
	"scared",
	"omg"
],
	"😖": [
	"confounded_face",
	"face",
	"confused",
	"sick",
	"unwell",
	"oops",
	":S"
],
	"😣": [
	"persevering_face",
	"face",
	"sick",
	"no",
	"upset",
	"oops"
],
	"😞": [
	"disappointed_face",
	"face",
	"sad",
	"upset",
	"depressed",
	":("
],
	"😓": [
	"downcast_face_with_sweat",
	"face",
	"hot",
	"sad",
	"tired",
	"exercise"
],
	"😩": [
	"weary_face",
	"face",
	"tired",
	"sleepy",
	"sad",
	"frustrated",
	"upset"
],
	"😫": [
	"tired_face",
	"sick",
	"whine",
	"upset",
	"frustrated"
],
	"🥱": [
	"yawning_face",
	"tired",
	"sleepy"
],
	"😤": [
	"face_with_steam_from_nose",
	"face",
	"gas",
	"phew",
	"proud",
	"pride"
],
	"😡": [
	"pouting_face",
	"angry",
	"mad",
	"hate",
	"despise"
],
	"😠": [
	"angry_face",
	"mad",
	"face",
	"annoyed",
	"frustrated"
],
	"🤬": [
	"face_with_symbols_on_mouth",
	"face",
	"swearing",
	"cursing",
	"cussing",
	"profanity",
	"expletive"
],
	"😈": [
	"smiling_face_with_horns",
	"devil",
	"horns"
],
	"👿": [
	"angry_face_with_horns",
	"devil",
	"angry",
	"horns"
],
	"💀": [
	"skull",
	"dead",
	"skeleton",
	"creepy",
	"death"
],
	"☠️": [
	"skull_and_crossbones",
	"poison",
	"danger",
	"deadly",
	"scary",
	"death",
	"pirate",
	"evil"
],
	"💩": [
	"pile_of_poo",
	"hankey",
	"shitface",
	"fail",
	"turd",
	"shit"
],
	"🤡": [
	"clown_face",
	"face"
],
	"👹": [
	"ogre",
	"monster",
	"red",
	"mask",
	"halloween",
	"scary",
	"creepy",
	"devil",
	"demon",
	"japanese",
	"ogre"
],
	"👺": [
	"goblin",
	"red",
	"evil",
	"mask",
	"monster",
	"scary",
	"creepy",
	"japanese",
	"goblin"
],
	"👻": [
	"ghost",
	"halloween",
	"spooky",
	"scary"
],
	"👽": [
	"alien",
	"UFO",
	"paul",
	"weird",
	"outer_space"
],
	"👾": [
	"alien_monster",
	"game",
	"arcade",
	"play"
],
	"🤖": [
	"robot",
	"computer",
	"machine",
	"bot"
],
	"😺": [
	"grinning_cat",
	"animal",
	"cats",
	"happy",
	"smile"
],
	"😸": [
	"grinning_cat_with_smiling_eyes",
	"animal",
	"cats",
	"smile"
],
	"😹": [
	"cat_with_tears_of_joy",
	"animal",
	"cats",
	"haha",
	"happy",
	"tears"
],
	"😻": [
	"smiling_cat_with_heart_eyes",
	"animal",
	"love",
	"like",
	"affection",
	"cats",
	"valentines",
	"heart"
],
	"😼": [
	"cat_with_wry_smile",
	"animal",
	"cats",
	"smirk"
],
	"😽": [
	"kissing_cat",
	"animal",
	"cats",
	"kiss"
],
	"🙀": [
	"weary_cat",
	"animal",
	"cats",
	"munch",
	"scared",
	"scream"
],
	"😿": [
	"crying_cat",
	"animal",
	"tears",
	"weep",
	"sad",
	"cats",
	"upset",
	"cry"
],
	"😾": [
	"pouting_cat",
	"animal",
	"cats"
],
	"🙈": [
	"see_no_evil_monkey",
	"monkey",
	"animal",
	"nature",
	"haha"
],
	"🙉": [
	"hear_no_evil_monkey",
	"animal",
	"monkey",
	"nature"
],
	"🙊": [
	"speak_no_evil_monkey",
	"monkey",
	"animal",
	"nature",
	"omg"
],
	"💋": [
	"kiss_mark",
	"face",
	"lips",
	"love",
	"like",
	"affection",
	"valentines"
],
	"💌": [
	"love_letter",
	"email",
	"like",
	"affection",
	"envelope",
	"valentines"
],
	"💘": [
	"heart_with_arrow",
	"love",
	"like",
	"heart",
	"affection",
	"valentines"
],
	"💝": [
	"heart_with_ribbon",
	"love",
	"valentines"
],
	"💖": [
	"sparkling_heart",
	"love",
	"like",
	"affection",
	"valentines"
],
	"💗": [
	"growing_heart",
	"like",
	"love",
	"affection",
	"valentines",
	"pink"
],
	"💓": [
	"beating_heart",
	"love",
	"like",
	"affection",
	"valentines",
	"pink",
	"heart"
],
	"💞": [
	"revolving_hearts",
	"love",
	"like",
	"affection",
	"valentines"
],
	"💕": [
	"two_hearts",
	"love",
	"like",
	"affection",
	"valentines",
	"heart"
],
	"💟": [
	"heart_decoration",
	"purple-square",
	"love",
	"like"
],
	"❣️": [
	"heart_exclamation",
	"decoration",
	"love"
],
	"💔": [
	"broken_heart",
	"sad",
	"sorry",
	"break",
	"heart",
	"heartbreak"
],
	"❤️": [
	"red_heart",
	"love",
	"like",
	"valentines"
],
	"🧡": [
	"orange_heart",
	"love",
	"like",
	"affection",
	"valentines"
],
	"💛": [
	"yellow_heart",
	"love",
	"like",
	"affection",
	"valentines"
],
	"💚": [
	"green_heart",
	"love",
	"like",
	"affection",
	"valentines"
],
	"💙": [
	"blue_heart",
	"love",
	"like",
	"affection",
	"valentines"
],
	"💜": [
	"purple_heart",
	"love",
	"like",
	"affection",
	"valentines"
],
	"🤎": [
	"brown_heart",
	"coffee"
],
	"🖤": [
	"black_heart",
	"evil"
],
	"🤍": [
	"white_heart",
	"pure"
],
	"💯": [
	"hundred_points",
	"score",
	"perfect",
	"numbers",
	"century",
	"exam",
	"quiz",
	"test",
	"pass",
	"hundred"
],
	"💢": [
	"anger_symbol",
	"angry",
	"mad"
],
	"💥": [
	"collision",
	"bomb",
	"explode",
	"explosion",
	"collision",
	"blown"
],
	"💫": [
	"dizzy",
	"star",
	"sparkle",
	"shoot",
	"magic"
],
	"💦": [
	"sweat_droplets",
	"water",
	"drip",
	"oops"
],
	"💨": [
	"dashing_away",
	"wind",
	"air",
	"fast",
	"shoo",
	"fart",
	"smoke",
	"puff"
],
	"🕳️": [
	"hole",
	"embarrassing"
],
	"💣": [
	"bomb",
	"boom",
	"explode",
	"explosion",
	"terrorism"
],
	"💬": [
	"speech_balloon",
	"bubble",
	"words",
	"message",
	"talk",
	"chatting"
],
	"👁️‍🗨️": [
	"eye_in_speech_bubble",
	"info"
],
	"🗨️": [
	"left_speech_bubble",
	"words",
	"message",
	"talk",
	"chatting"
],
	"🗯️": [
	"right_anger_bubble",
	"caption",
	"speech",
	"thinking",
	"mad"
],
	"💭": [
	"thought_balloon",
	"bubble",
	"cloud",
	"speech",
	"thinking",
	"dream"
],
	"💤": [
	"zzz",
	"sleepy",
	"tired",
	"dream"
],
	"👋": [
	"waving_hand",
	"hands",
	"gesture",
	"goodbye",
	"solong",
	"farewell",
	"hello",
	"hi",
	"palm"
],
	"🤚": [
	"raised_back_of_hand",
	"fingers",
	"raised",
	"backhand"
],
	"🖐️": [
	"hand_with_fingers_splayed",
	"hand",
	"fingers",
	"palm"
],
	"✋": [
	"raised_hand",
	"fingers",
	"stop",
	"highfive",
	"palm",
	"ban"
],
	"🖖": [
	"vulcan_salute",
	"hand",
	"fingers",
	"spock",
	"star trek"
],
	"👌": [
	"ok_hand",
	"fingers",
	"limbs",
	"perfect",
	"ok",
	"okay"
],
	"🤏": [
	"pinching_hand",
	"tiny",
	"small",
	"size"
],
	"✌️": [
	"victory_hand",
	"fingers",
	"ohyeah",
	"hand",
	"peace",
	"victory",
	"two"
],
	"🤞": [
	"crossed_fingers",
	"good",
	"lucky"
],
	"🤟": [
	"love_you_gesture",
	"hand",
	"fingers",
	"gesture"
],
	"🤘": [
	"sign_of_the_horns",
	"hand",
	"fingers",
	"evil_eye",
	"sign_of_horns",
	"rock_on"
],
	"🤙": [
	"call_me_hand",
	"hands",
	"gesture",
	"shaka"
],
	"👈": [
	"backhand_index_pointing_left",
	"direction",
	"fingers",
	"hand",
	"left"
],
	"👉": [
	"backhand_index_pointing_right",
	"fingers",
	"hand",
	"direction",
	"right"
],
	"👆": [
	"backhand_index_pointing_up",
	"fingers",
	"hand",
	"direction",
	"up"
],
	"🖕": [
	"middle_finger",
	"hand",
	"fingers",
	"rude",
	"middle",
	"flipping"
],
	"👇": [
	"backhand_index_pointing_down",
	"fingers",
	"hand",
	"direction",
	"down"
],
	"☝️": [
	"index_pointing_up",
	"hand",
	"fingers",
	"direction",
	"up"
],
	"👍": [
	"thumbs_up",
	"thumbsup",
	"yes",
	"awesome",
	"good",
	"agree",
	"accept",
	"cool",
	"hand",
	"like",
	"+1"
],
	"👎": [
	"thumbs_down",
	"thumbsdown",
	"no",
	"dislike",
	"hand",
	"-1"
],
	"✊": [
	"raised_fist",
	"fingers",
	"hand",
	"grasp"
],
	"👊": [
	"oncoming_fist",
	"angry",
	"violence",
	"fist",
	"hit",
	"attack",
	"hand"
],
	"🤛": [
	"left_facing_fist",
	"hand",
	"fistbump"
],
	"🤜": [
	"right_facing_fist",
	"hand",
	"fistbump"
],
	"👏": [
	"clapping_hands",
	"hands",
	"praise",
	"applause",
	"congrats",
	"yay"
],
	"🙌": [
	"raising_hands",
	"gesture",
	"hooray",
	"yea",
	"celebration",
	"hands"
],
	"👐": [
	"open_hands",
	"fingers",
	"butterfly",
	"hands",
	"open"
],
	"🤲": [
	"palms_up_together",
	"hands",
	"gesture",
	"cupped",
	"prayer"
],
	"🤝": [
	"handshake",
	"agreement",
	"shake"
],
	"🙏": [
	"folded_hands",
	"please",
	"hope",
	"wish",
	"namaste",
	"highfive",
	"pray",
	"thank you",
	"thanks",
	"appreciate"
],
	"✍️": [
	"writing_hand",
	"lower_left_ballpoint_pen",
	"stationery",
	"write",
	"compose"
],
	"💅": [
	"nail_polish",
	"beauty",
	"manicure",
	"finger",
	"fashion",
	"nail"
],
	"🤳": [
	"selfie",
	"camera",
	"phone"
],
	"💪": [
	"flexed_biceps",
	"arm",
	"flex",
	"hand",
	"summer",
	"strong",
	"biceps"
],
	"🦾": [
	"mechanical_arm",
	"accessibility"
],
	"🦿": [
	"mechanical_leg",
	"accessibility"
],
	"🦵": [
	"leg",
	"kick",
	"limb"
],
	"🦶": [
	"foot",
	"kick",
	"stomp"
],
	"👂": [
	"ear",
	"face",
	"hear",
	"sound",
	"listen"
],
	"🦻": [
	"ear_with_hearing_aid",
	"accessibility"
],
	"👃": [
	"nose",
	"smell",
	"sniff"
],
	"🧠": [
	"brain",
	"smart",
	"intelligent"
],
	"🦷": [
	"tooth",
	"teeth",
	"dentist"
],
	"🦴": [
	"bone",
	"skeleton"
],
	"👀": [
	"eyes",
	"look",
	"watch",
	"stalk",
	"peek",
	"see"
],
	"👁️": [
	"eye",
	"face",
	"look",
	"see",
	"watch",
	"stare"
],
	"👅": [
	"tongue",
	"mouth",
	"playful"
],
	"👄": [
	"mouth",
	"mouth",
	"kiss"
],
	"👶": [
	"baby",
	"child",
	"boy",
	"girl",
	"toddler"
],
	"🧒": [
	"child",
	"gender-neutral",
	"young"
],
	"👦": [
	"boy",
	"man",
	"male",
	"guy",
	"teenager"
],
	"👧": [
	"girl",
	"female",
	"woman",
	"teenager"
],
	"🧑": [
	"person",
	"gender-neutral",
	"person"
],
	"👱": [
	"person_blond_hair",
	"hairstyle"
],
	"👨": [
	"man",
	"mustache",
	"father",
	"dad",
	"guy",
	"classy",
	"sir",
	"moustache"
],
	"🧔": [
	"man_beard",
	"person",
	"bewhiskered"
],
	"👨‍🦰": [
	"man_red_hair",
	"hairstyle"
],
	"👨‍🦱": [
	"man_curly_hair",
	"hairstyle"
],
	"👨‍🦳": [
	"man_white_hair",
	"old",
	"elder"
],
	"👨‍🦲": [
	"man_bald",
	"hairless"
],
	"👩": [
	"woman",
	"female",
	"girls",
	"lady"
],
	"👩‍🦰": [
	"woman_red_hair",
	"hairstyle"
],
	"🧑‍🦰": [
	"person_red_hair",
	"hairstyle"
],
	"👩‍🦱": [
	"woman_curly_hair",
	"hairstyle"
],
	"🧑‍🦱": [
	"person_curly_hair",
	"hairstyle"
],
	"👩‍🦳": [
	"woman_white_hair",
	"old",
	"elder"
],
	"🧑‍🦳": [
	"person_white_hair",
	"elder",
	"old"
],
	"👩‍🦲": [
	"woman_bald",
	"hairless"
],
	"🧑‍🦲": [
	"person_bald",
	"hairless"
],
	"👱‍♀️": [
	"woman_blond_hair",
	"woman",
	"female",
	"girl",
	"blonde",
	"person"
],
	"👱‍♂️": [
	"man_blond_hair",
	"man",
	"male",
	"boy",
	"blonde",
	"guy",
	"person"
],
	"🧓": [
	"older_person",
	"human",
	"elder",
	"senior",
	"gender-neutral"
],
	"👴": [
	"old_man",
	"human",
	"male",
	"men",
	"old",
	"elder",
	"senior"
],
	"👵": [
	"old_woman",
	"human",
	"female",
	"women",
	"lady",
	"old",
	"elder",
	"senior"
],
	"🙍": [
	"person_frowning",
	"worried"
],
	"🙍‍♂️": [
	"man_frowning",
	"male",
	"boy",
	"man",
	"sad",
	"depressed",
	"discouraged",
	"unhappy"
],
	"🙍‍♀️": [
	"woman_frowning",
	"female",
	"girl",
	"woman",
	"sad",
	"depressed",
	"discouraged",
	"unhappy"
],
	"🙎": [
	"person_pouting",
	"upset"
],
	"🙎‍♂️": [
	"man_pouting",
	"male",
	"boy",
	"man"
],
	"🙎‍♀️": [
	"woman_pouting",
	"female",
	"girl",
	"woman"
],
	"🙅": [
	"person_gesturing_no",
	"decline"
],
	"🙅‍♂️": [
	"man_gesturing_no",
	"male",
	"boy",
	"man",
	"nope"
],
	"🙅‍♀️": [
	"woman_gesturing_no",
	"female",
	"girl",
	"woman",
	"nope"
],
	"🙆": [
	"person_gesturing_ok",
	"agree"
],
	"🙆‍♂️": [
	"man_gesturing_ok",
	"men",
	"boy",
	"male",
	"blue",
	"human",
	"man"
],
	"🙆‍♀️": [
	"woman_gesturing_ok",
	"women",
	"girl",
	"female",
	"pink",
	"human",
	"woman"
],
	"💁": [
	"person_tipping_hand",
	"information"
],
	"💁‍♂️": [
	"man_tipping_hand",
	"male",
	"boy",
	"man",
	"human",
	"information"
],
	"💁‍♀️": [
	"woman_tipping_hand",
	"female",
	"girl",
	"woman",
	"human",
	"information"
],
	"🙋": [
	"person_raising_hand",
	"question"
],
	"🙋‍♂️": [
	"man_raising_hand",
	"male",
	"boy",
	"man"
],
	"🙋‍♀️": [
	"woman_raising_hand",
	"female",
	"girl",
	"woman"
],
	"🧏": [
	"deaf_person",
	"accessibility"
],
	"🧏‍♂️": [
	"deaf_man",
	"accessibility"
],
	"🧏‍♀️": [
	"deaf_woman",
	"accessibility"
],
	"🙇": [
	"person_bowing",
	"respectiful"
],
	"🙇‍♂️": [
	"man_bowing",
	"man",
	"male",
	"boy"
],
	"🙇‍♀️": [
	"woman_bowing",
	"woman",
	"female",
	"girl"
],
	"🤦": [
	"person_facepalming",
	"disappointed"
],
	"🤦‍♂️": [
	"man_facepalming",
	"man",
	"male",
	"boy",
	"disbelief"
],
	"🤦‍♀️": [
	"woman_facepalming",
	"woman",
	"female",
	"girl",
	"disbelief"
],
	"🤷": [
	"person_shrugging",
	"regardless"
],
	"🤷‍♂️": [
	"man_shrugging",
	"man",
	"male",
	"boy",
	"confused",
	"indifferent",
	"doubt"
],
	"🤷‍♀️": [
	"woman_shrugging",
	"woman",
	"female",
	"girl",
	"confused",
	"indifferent",
	"doubt"
],
	"🧑‍⚕️": [
	"health_worker",
	"hospital"
],
	"👨‍⚕️": [
	"man_health_worker",
	"doctor",
	"nurse",
	"therapist",
	"healthcare",
	"man",
	"human"
],
	"👩‍⚕️": [
	"woman_health_worker",
	"doctor",
	"nurse",
	"therapist",
	"healthcare",
	"woman",
	"human"
],
	"🧑‍🎓": [
	"student",
	"learn"
],
	"👨‍🎓": [
	"man_student",
	"graduate",
	"man",
	"human"
],
	"👩‍🎓": [
	"woman_student",
	"graduate",
	"woman",
	"human"
],
	"🧑‍🏫": [
	"teacher",
	"professor"
],
	"👨‍🏫": [
	"man_teacher",
	"instructor",
	"professor",
	"man",
	"human"
],
	"👩‍🏫": [
	"woman_teacher",
	"instructor",
	"professor",
	"woman",
	"human"
],
	"🧑‍⚖️": [
	"judge",
	"law"
],
	"👨‍⚖️": [
	"man_judge",
	"justice",
	"court",
	"man",
	"human"
],
	"👩‍⚖️": [
	"woman_judge",
	"justice",
	"court",
	"woman",
	"human"
],
	"🧑‍🌾": [
	"farmer",
	"crops"
],
	"👨‍🌾": [
	"man_farmer",
	"rancher",
	"gardener",
	"man",
	"human"
],
	"👩‍🌾": [
	"woman_farmer",
	"rancher",
	"gardener",
	"woman",
	"human"
],
	"🧑‍🍳": [
	"cook",
	"food",
	"kitchen",
	"culinary"
],
	"👨‍🍳": [
	"man_cook",
	"chef",
	"man",
	"human"
],
	"👩‍🍳": [
	"woman_cook",
	"chef",
	"woman",
	"human"
],
	"🧑‍🔧": [
	"mechanic",
	"worker",
	"technician"
],
	"👨‍🔧": [
	"man_mechanic",
	"plumber",
	"man",
	"human",
	"wrench"
],
	"👩‍🔧": [
	"woman_mechanic",
	"plumber",
	"woman",
	"human",
	"wrench"
],
	"🧑‍🏭": [
	"factory_worker",
	"labor"
],
	"👨‍🏭": [
	"man_factory_worker",
	"assembly",
	"industrial",
	"man",
	"human"
],
	"👩‍🏭": [
	"woman_factory_worker",
	"assembly",
	"industrial",
	"woman",
	"human"
],
	"🧑‍💼": [
	"office_worker",
	"business"
],
	"👨‍💼": [
	"man_office_worker",
	"business",
	"manager",
	"man",
	"human"
],
	"👩‍💼": [
	"woman_office_worker",
	"business",
	"manager",
	"woman",
	"human"
],
	"🧑‍🔬": [
	"scientist",
	"chemistry"
],
	"👨‍🔬": [
	"man_scientist",
	"biologist",
	"chemist",
	"engineer",
	"physicist",
	"man",
	"human"
],
	"👩‍🔬": [
	"woman_scientist",
	"biologist",
	"chemist",
	"engineer",
	"physicist",
	"woman",
	"human"
],
	"🧑‍💻": [
	"technologist",
	"computer"
],
	"👨‍💻": [
	"man_technologist",
	"coder",
	"developer",
	"engineer",
	"programmer",
	"software",
	"man",
	"human",
	"laptop",
	"computer"
],
	"👩‍💻": [
	"woman_technologist",
	"coder",
	"developer",
	"engineer",
	"programmer",
	"software",
	"woman",
	"human",
	"laptop",
	"computer"
],
	"🧑‍🎤": [
	"singer",
	"song",
	"artist",
	"performer"
],
	"👨‍🎤": [
	"man_singer",
	"rockstar",
	"entertainer",
	"man",
	"human"
],
	"👩‍🎤": [
	"woman_singer",
	"rockstar",
	"entertainer",
	"woman",
	"human"
],
	"🧑‍🎨": [
	"artist",
	"painting",
	"draw",
	"creativity"
],
	"👨‍🎨": [
	"man_artist",
	"painter",
	"man",
	"human"
],
	"👩‍🎨": [
	"woman_artist",
	"painter",
	"woman",
	"human"
],
	"🧑‍✈️": [
	"pilot",
	"fly",
	"plane",
	"airplane"
],
	"👨‍✈️": [
	"man_pilot",
	"aviator",
	"plane",
	"man",
	"human"
],
	"👩‍✈️": [
	"woman_pilot",
	"aviator",
	"plane",
	"woman",
	"human"
],
	"🧑‍🚀": [
	"astronaut",
	"outerspace"
],
	"👨‍🚀": [
	"man_astronaut",
	"space",
	"rocket",
	"man",
	"human"
],
	"👩‍🚀": [
	"woman_astronaut",
	"space",
	"rocket",
	"woman",
	"human"
],
	"🧑‍🚒": [
	"firefighter",
	"fire"
],
	"👨‍🚒": [
	"man_firefighter",
	"fireman",
	"man",
	"human"
],
	"👩‍🚒": [
	"woman_firefighter",
	"fireman",
	"woman",
	"human"
],
	"👮": [
	"police_officer",
	"cop"
],
	"👮‍♂️": [
	"man_police_officer",
	"man",
	"police",
	"law",
	"legal",
	"enforcement",
	"arrest",
	"911"
],
	"👮‍♀️": [
	"woman_police_officer",
	"woman",
	"police",
	"law",
	"legal",
	"enforcement",
	"arrest",
	"911",
	"female"
],
	"🕵️": [
	"detective",
	"human",
	"spy",
	"detective"
],
	"🕵️‍♂️": [
	"man_detective",
	"crime"
],
	"🕵️‍♀️": [
	"woman_detective",
	"human",
	"spy",
	"detective",
	"female",
	"woman"
],
	"💂": [
	"guard",
	"protect"
],
	"💂‍♂️": [
	"man_guard",
	"uk",
	"gb",
	"british",
	"male",
	"guy",
	"royal"
],
	"💂‍♀️": [
	"woman_guard",
	"uk",
	"gb",
	"british",
	"female",
	"royal",
	"woman"
],
	"👷": [
	"construction_worker",
	"labor",
	"build"
],
	"👷‍♂️": [
	"man_construction_worker",
	"male",
	"human",
	"wip",
	"guy",
	"build",
	"construction",
	"worker",
	"labor"
],
	"👷‍♀️": [
	"woman_construction_worker",
	"female",
	"human",
	"wip",
	"build",
	"construction",
	"worker",
	"labor",
	"woman"
],
	"🤴": [
	"prince",
	"boy",
	"man",
	"male",
	"crown",
	"royal",
	"king"
],
	"👸": [
	"princess",
	"girl",
	"woman",
	"female",
	"blond",
	"crown",
	"royal",
	"queen"
],
	"👳": [
	"person_wearing_turban",
	"headdress"
],
	"👳‍♂️": [
	"man_wearing_turban",
	"male",
	"indian",
	"hinduism",
	"arabs"
],
	"👳‍♀️": [
	"woman_wearing_turban",
	"female",
	"indian",
	"hinduism",
	"arabs",
	"woman"
],
	"👲": [
	"man_with_skullcap",
	"male",
	"boy",
	"chinese"
],
	"🧕": [
	"woman_with_headscarf",
	"female",
	"hijab",
	"mantilla",
	"tichel"
],
	"🤵": [
	"man_in_tuxedo",
	"couple",
	"marriage",
	"wedding",
	"groom"
],
	"👰": [
	"bride_with_veil",
	"couple",
	"marriage",
	"wedding",
	"woman",
	"bride"
],
	"🤰": [
	"pregnant_woman",
	"baby"
],
	"🤱": [
	"breast_feeding",
	"nursing",
	"baby"
],
	"👼": [
	"baby_angel",
	"heaven",
	"wings",
	"halo"
],
	"🎅": [
	"santa_claus",
	"festival",
	"man",
	"male",
	"xmas",
	"father christmas"
],
	"🤶": [
	"mrs_claus",
	"woman",
	"female",
	"xmas",
	"mother christmas"
],
	"🦸": [
	"superhero",
	"marvel"
],
	"🦸‍♂️": [
	"man_superhero",
	"man",
	"male",
	"good",
	"hero",
	"superpowers"
],
	"🦸‍♀️": [
	"woman_superhero",
	"woman",
	"female",
	"good",
	"heroine",
	"superpowers"
],
	"🦹": [
	"supervillain",
	"marvel"
],
	"🦹‍♂️": [
	"man_supervillain",
	"man",
	"male",
	"evil",
	"bad",
	"criminal",
	"hero",
	"superpowers"
],
	"🦹‍♀️": [
	"woman_supervillain",
	"woman",
	"female",
	"evil",
	"bad",
	"criminal",
	"heroine",
	"superpowers"
],
	"🧙": [
	"mage",
	"magic"
],
	"🧙‍♂️": [
	"man_mage",
	"man",
	"male",
	"mage",
	"sorcerer"
],
	"🧙‍♀️": [
	"woman_mage",
	"woman",
	"female",
	"mage",
	"witch"
],
	"🧚": [
	"fairy",
	"wings",
	"magical"
],
	"🧚‍♂️": [
	"man_fairy",
	"man",
	"male"
],
	"🧚‍♀️": [
	"woman_fairy",
	"woman",
	"female"
],
	"🧛": [
	"vampire",
	"blood",
	"twilight"
],
	"🧛‍♂️": [
	"man_vampire",
	"man",
	"male",
	"dracula"
],
	"🧛‍♀️": [
	"woman_vampire",
	"woman",
	"female"
],
	"🧜": [
	"merperson",
	"sea"
],
	"🧜‍♂️": [
	"merman",
	"man",
	"male",
	"triton"
],
	"🧜‍♀️": [
	"mermaid",
	"woman",
	"female",
	"merwoman",
	"ariel"
],
	"🧝": [
	"elf",
	"magical"
],
	"🧝‍♂️": [
	"man_elf",
	"man",
	"male"
],
	"🧝‍♀️": [
	"woman_elf",
	"woman",
	"female"
],
	"🧞": [
	"genie",
	"magical",
	"wishes"
],
	"🧞‍♂️": [
	"man_genie",
	"man",
	"male"
],
	"🧞‍♀️": [
	"woman_genie",
	"woman",
	"female"
],
	"🧟": [
	"zombie",
	"dead"
],
	"🧟‍♂️": [
	"man_zombie",
	"man",
	"male",
	"dracula",
	"undead",
	"walking dead"
],
	"🧟‍♀️": [
	"woman_zombie",
	"woman",
	"female",
	"undead",
	"walking dead"
],
	"💆": [
	"person_getting_massage",
	"relax"
],
	"💆‍♂️": [
	"man_getting_massage",
	"male",
	"boy",
	"man",
	"head"
],
	"💆‍♀️": [
	"woman_getting_massage",
	"female",
	"girl",
	"woman",
	"head"
],
	"💇": [
	"person_getting_haircut",
	"hairstyle"
],
	"💇‍♂️": [
	"man_getting_haircut",
	"male",
	"boy",
	"man"
],
	"💇‍♀️": [
	"woman_getting_haircut",
	"female",
	"girl",
	"woman"
],
	"🚶": [
	"person_walking",
	"move"
],
	"🚶‍♂️": [
	"man_walking",
	"human",
	"feet",
	"steps"
],
	"🚶‍♀️": [
	"woman_walking",
	"human",
	"feet",
	"steps",
	"woman",
	"female"
],
	"🧍": [
	"person_standing",
	"still"
],
	"🧍‍♂️": [
	"man_standing",
	"still"
],
	"🧍‍♀️": [
	"woman_standing",
	"still"
],
	"🧎": [
	"person_kneeling",
	"pray",
	"respectful"
],
	"🧎‍♂️": [
	"man_kneeling",
	"pray",
	"respectful"
],
	"🧎‍♀️": [
	"woman_kneeling",
	"respectful",
	"pray"
],
	"🧑‍🦯": [
	"person_with_probing_cane",
	"blind"
],
	"👨‍🦯": [
	"man_with_probing_cane",
	"blind"
],
	"👩‍🦯": [
	"woman_with_probing_cane",
	"blind"
],
	"🧑‍🦼": [
	"person_in_motorized_wheelchair",
	"disability",
	"accessibility"
],
	"👨‍🦼": [
	"man_in_motorized_wheelchair",
	"disability",
	"accessibility"
],
	"👩‍🦼": [
	"woman_in_motorized_wheelchair",
	"disability",
	"accessibility"
],
	"🧑‍🦽": [
	"person_in_manual_wheelchair",
	"disability",
	"accessibility"
],
	"👨‍🦽": [
	"man_in_manual_wheelchair",
	"disability",
	"accessibility"
],
	"👩‍🦽": [
	"woman_in_manual_wheelchair",
	"disability",
	"accessibility"
],
	"🏃": [
	"person_running",
	"move"
],
	"🏃‍♂️": [
	"man_running",
	"man",
	"walking",
	"exercise",
	"race",
	"running"
],
	"🏃‍♀️": [
	"woman_running",
	"woman",
	"walking",
	"exercise",
	"race",
	"running",
	"female"
],
	"💃": [
	"woman_dancing",
	"female",
	"girl",
	"woman",
	"fun"
],
	"🕺": [
	"man_dancing",
	"male",
	"boy",
	"fun",
	"dancer"
],
	"🕴️": [
	"man_in_suit_levitating",
	"suit",
	"business",
	"levitate",
	"hover",
	"jump"
],
	"👯": [
	"people_with_bunny_ears",
	"perform",
	"costume"
],
	"👯‍♂️": [
	"men_with_bunny_ears",
	"male",
	"bunny",
	"men",
	"boys"
],
	"👯‍♀️": [
	"women_with_bunny_ears",
	"female",
	"bunny",
	"women",
	"girls"
],
	"🧖": [
	"person_in_steamy_room",
	"relax",
	"spa"
],
	"🧖‍♂️": [
	"man_in_steamy_room",
	"male",
	"man",
	"spa",
	"steamroom",
	"sauna"
],
	"🧖‍♀️": [
	"woman_in_steamy_room",
	"female",
	"woman",
	"spa",
	"steamroom",
	"sauna"
],
	"🧗": [
	"person_climbing",
	"sport"
],
	"🧗‍♂️": [
	"man_climbing",
	"sports",
	"hobby",
	"man",
	"male",
	"rock"
],
	"🧗‍♀️": [
	"woman_climbing",
	"sports",
	"hobby",
	"woman",
	"female",
	"rock"
],
	"🤺": [
	"person_fencing",
	"sports",
	"fencing",
	"sword"
],
	"🏇": [
	"horse_racing",
	"animal",
	"betting",
	"competition",
	"gambling",
	"luck"
],
	"⛷️": [
	"skier",
	"sports",
	"winter",
	"snow"
],
	"🏂": [
	"snowboarder",
	"sports",
	"winter"
],
	"🏌️": [
	"person_golfing",
	"sports",
	"business"
],
	"🏌️‍♂️": [
	"man_golfing",
	"sport"
],
	"🏌️‍♀️": [
	"woman_golfing",
	"sports",
	"business",
	"woman",
	"female"
],
	"🏄": [
	"person_surfing",
	"sport",
	"sea"
],
	"🏄‍♂️": [
	"man_surfing",
	"sports",
	"ocean",
	"sea",
	"summer",
	"beach"
],
	"🏄‍♀️": [
	"woman_surfing",
	"sports",
	"ocean",
	"sea",
	"summer",
	"beach",
	"woman",
	"female"
],
	"🚣": [
	"person_rowing_boat",
	"sport",
	"move"
],
	"🚣‍♂️": [
	"man_rowing_boat",
	"sports",
	"hobby",
	"water",
	"ship"
],
	"🚣‍♀️": [
	"woman_rowing_boat",
	"sports",
	"hobby",
	"water",
	"ship",
	"woman",
	"female"
],
	"🏊": [
	"person_swimming",
	"sport",
	"pool"
],
	"🏊‍♂️": [
	"man_swimming",
	"sports",
	"exercise",
	"human",
	"athlete",
	"water",
	"summer"
],
	"🏊‍♀️": [
	"woman_swimming",
	"sports",
	"exercise",
	"human",
	"athlete",
	"water",
	"summer",
	"woman",
	"female"
],
	"⛹️": [
	"person_bouncing_ball",
	"sports",
	"human"
],
	"⛹️‍♂️": [
	"man_bouncing_ball",
	"sport"
],
	"⛹️‍♀️": [
	"woman_bouncing_ball",
	"sports",
	"human",
	"woman",
	"female"
],
	"🏋️": [
	"person_lifting_weights",
	"sports",
	"training",
	"exercise"
],
	"🏋️‍♂️": [
	"man_lifting_weights",
	"sport"
],
	"🏋️‍♀️": [
	"woman_lifting_weights",
	"sports",
	"training",
	"exercise",
	"woman",
	"female"
],
	"🚴": [
	"person_biking",
	"sport",
	"move"
],
	"🚴‍♂️": [
	"man_biking",
	"sports",
	"bike",
	"exercise",
	"hipster"
],
	"🚴‍♀️": [
	"woman_biking",
	"sports",
	"bike",
	"exercise",
	"hipster",
	"woman",
	"female"
],
	"🚵": [
	"person_mountain_biking",
	"sport",
	"move"
],
	"🚵‍♂️": [
	"man_mountain_biking",
	"transportation",
	"sports",
	"human",
	"race",
	"bike"
],
	"🚵‍♀️": [
	"woman_mountain_biking",
	"transportation",
	"sports",
	"human",
	"race",
	"bike",
	"woman",
	"female"
],
	"🤸": [
	"person_cartwheeling",
	"sport",
	"gymnastic"
],
	"🤸‍♂️": [
	"man_cartwheeling",
	"gymnastics"
],
	"🤸‍♀️": [
	"woman_cartwheeling",
	"gymnastics"
],
	"🤼": [
	"people_wrestling",
	"sport"
],
	"🤼‍♂️": [
	"men_wrestling",
	"sports",
	"wrestlers"
],
	"🤼‍♀️": [
	"women_wrestling",
	"sports",
	"wrestlers"
],
	"🤽": [
	"person_playing_water_polo",
	"sport"
],
	"🤽‍♂️": [
	"man_playing_water_polo",
	"sports",
	"pool"
],
	"🤽‍♀️": [
	"woman_playing_water_polo",
	"sports",
	"pool"
],
	"🤾": [
	"person_playing_handball",
	"sport"
],
	"🤾‍♂️": [
	"man_playing_handball",
	"sports"
],
	"🤾‍♀️": [
	"woman_playing_handball",
	"sports"
],
	"🤹": [
	"person_juggling",
	"performance",
	"balance"
],
	"🤹‍♂️": [
	"man_juggling",
	"juggle",
	"balance",
	"skill",
	"multitask"
],
	"🤹‍♀️": [
	"woman_juggling",
	"juggle",
	"balance",
	"skill",
	"multitask"
],
	"🧘": [
	"person_in_lotus_position",
	"meditate"
],
	"🧘‍♂️": [
	"man_in_lotus_position",
	"man",
	"male",
	"meditation",
	"yoga",
	"serenity",
	"zen",
	"mindfulness"
],
	"🧘‍♀️": [
	"woman_in_lotus_position",
	"woman",
	"female",
	"meditation",
	"yoga",
	"serenity",
	"zen",
	"mindfulness"
],
	"🛀": [
	"person_taking_bath",
	"clean",
	"shower",
	"bathroom"
],
	"🛌": [
	"person_in_bed",
	"bed",
	"rest"
],
	"🧑‍🤝‍🧑": [
	"people_holding_hands",
	"friendship"
],
	"👭": [
	"women_holding_hands",
	"pair",
	"friendship",
	"couple",
	"love",
	"like",
	"female",
	"people",
	"human"
],
	"👫": [
	"woman_and_man_holding_hands",
	"pair",
	"people",
	"human",
	"love",
	"date",
	"dating",
	"like",
	"affection",
	"valentines",
	"marriage"
],
	"👬": [
	"men_holding_hands",
	"pair",
	"couple",
	"love",
	"like",
	"bromance",
	"friendship",
	"people",
	"human"
],
	"💏": [
	"kiss",
	"pair",
	"valentines",
	"love",
	"like",
	"dating",
	"marriage"
],
	"👩‍❤️‍💋‍👨": [
	"kiss_woman_man",
	"love"
],
	"👨‍❤️‍💋‍👨": [
	"kiss_man_man",
	"pair",
	"valentines",
	"love",
	"like",
	"dating",
	"marriage"
],
	"👩‍❤️‍💋‍👩": [
	"kiss_woman_woman",
	"pair",
	"valentines",
	"love",
	"like",
	"dating",
	"marriage"
],
	"💑": [
	"couple_with_heart",
	"pair",
	"love",
	"like",
	"affection",
	"human",
	"dating",
	"valentines",
	"marriage"
],
	"👩‍❤️‍👨": [
	"couple_with_heart_woman_man",
	"love"
],
	"👨‍❤️‍👨": [
	"couple_with_heart_man_man",
	"pair",
	"love",
	"like",
	"affection",
	"human",
	"dating",
	"valentines",
	"marriage"
],
	"👩‍❤️‍👩": [
	"couple_with_heart_woman_woman",
	"pair",
	"love",
	"like",
	"affection",
	"human",
	"dating",
	"valentines",
	"marriage"
],
	"👪": [
	"family",
	"home",
	"parents",
	"child",
	"mom",
	"dad",
	"father",
	"mother",
	"people",
	"human"
],
	"👨‍👩‍👦": [
	"family_man_woman_boy",
	"love"
],
	"👨‍👩‍👧": [
	"family_man_woman_girl",
	"home",
	"parents",
	"people",
	"human",
	"child"
],
	"👨‍👩‍👧‍👦": [
	"family_man_woman_girl_boy",
	"home",
	"parents",
	"people",
	"human",
	"children"
],
	"👨‍👩‍👦‍👦": [
	"family_man_woman_boy_boy",
	"home",
	"parents",
	"people",
	"human",
	"children"
],
	"👨‍👩‍👧‍👧": [
	"family_man_woman_girl_girl",
	"home",
	"parents",
	"people",
	"human",
	"children"
],
	"👨‍👨‍👦": [
	"family_man_man_boy",
	"home",
	"parents",
	"people",
	"human",
	"children"
],
	"👨‍👨‍👧": [
	"family_man_man_girl",
	"home",
	"parents",
	"people",
	"human",
	"children"
],
	"👨‍👨‍👧‍👦": [
	"family_man_man_girl_boy",
	"home",
	"parents",
	"people",
	"human",
	"children"
],
	"👨‍👨‍👦‍👦": [
	"family_man_man_boy_boy",
	"home",
	"parents",
	"people",
	"human",
	"children"
],
	"👨‍👨‍👧‍👧": [
	"family_man_man_girl_girl",
	"home",
	"parents",
	"people",
	"human",
	"children"
],
	"👩‍👩‍👦": [
	"family_woman_woman_boy",
	"home",
	"parents",
	"people",
	"human",
	"children"
],
	"👩‍👩‍👧": [
	"family_woman_woman_girl",
	"home",
	"parents",
	"people",
	"human",
	"children"
],
	"👩‍👩‍👧‍👦": [
	"family_woman_woman_girl_boy",
	"home",
	"parents",
	"people",
	"human",
	"children"
],
	"👩‍👩‍👦‍👦": [
	"family_woman_woman_boy_boy",
	"home",
	"parents",
	"people",
	"human",
	"children"
],
	"👩‍👩‍👧‍👧": [
	"family_woman_woman_girl_girl",
	"home",
	"parents",
	"people",
	"human",
	"children"
],
	"👨‍👦": [
	"family_man_boy",
	"home",
	"parent",
	"people",
	"human",
	"child"
],
	"👨‍👦‍👦": [
	"family_man_boy_boy",
	"home",
	"parent",
	"people",
	"human",
	"children"
],
	"👨‍👧": [
	"family_man_girl",
	"home",
	"parent",
	"people",
	"human",
	"child"
],
	"👨‍👧‍👦": [
	"family_man_girl_boy",
	"home",
	"parent",
	"people",
	"human",
	"children"
],
	"👨‍👧‍👧": [
	"family_man_girl_girl",
	"home",
	"parent",
	"people",
	"human",
	"children"
],
	"👩‍👦": [
	"family_woman_boy",
	"home",
	"parent",
	"people",
	"human",
	"child"
],
	"👩‍👦‍👦": [
	"family_woman_boy_boy",
	"home",
	"parent",
	"people",
	"human",
	"children"
],
	"👩‍👧": [
	"family_woman_girl",
	"home",
	"parent",
	"people",
	"human",
	"child"
],
	"👩‍👧‍👦": [
	"family_woman_girl_boy",
	"home",
	"parent",
	"people",
	"human",
	"children"
],
	"👩‍👧‍👧": [
	"family_woman_girl_girl",
	"home",
	"parent",
	"people",
	"human",
	"children"
],
	"🗣️": [
	"speaking_head",
	"user",
	"person",
	"human",
	"sing",
	"say",
	"talk"
],
	"👤": [
	"bust_in_silhouette",
	"user",
	"person",
	"human"
],
	"👥": [
	"busts_in_silhouette",
	"user",
	"person",
	"human",
	"group",
	"team"
],
	"👣": [
	"footprints",
	"feet",
	"tracking",
	"walking",
	"beach"
],
	"🐵": [
	"monkey_face",
	"animal",
	"nature",
	"circus"
],
	"🐒": [
	"monkey",
	"animal",
	"nature",
	"banana",
	"circus"
],
	"🦍": [
	"gorilla",
	"animal",
	"nature",
	"circus"
],
	"🦧": [
	"orangutan",
	"animal"
],
	"🐶": [
	"dog_face",
	"animal",
	"friend",
	"nature",
	"woof",
	"puppy",
	"pet",
	"faithful"
],
	"🐕": [
	"dog",
	"animal",
	"nature",
	"friend",
	"doge",
	"pet",
	"faithful"
],
	"🦮": [
	"guide_dog",
	"animal",
	"blind"
],
	"🐕‍🦺": [
	"service_dog",
	"blind",
	"animal"
],
	"🐩": [
	"poodle",
	"dog",
	"animal",
	"101",
	"nature",
	"pet"
],
	"🐺": [
	"wolf",
	"animal",
	"nature",
	"wild"
],
	"🦊": [
	"fox",
	"animal",
	"nature",
	"face"
],
	"🦝": [
	"raccoon",
	"animal",
	"nature"
],
	"🐱": [
	"cat_face",
	"animal",
	"meow",
	"nature",
	"pet",
	"kitten"
],
	"🐈": [
	"cat",
	"animal",
	"meow",
	"pet",
	"cats"
],
	"🦁": [
	"lion",
	"animal",
	"nature"
],
	"🐯": [
	"tiger_face",
	"animal",
	"cat",
	"danger",
	"wild",
	"nature",
	"roar"
],
	"🐅": [
	"tiger",
	"animal",
	"nature",
	"roar"
],
	"🐆": [
	"leopard",
	"animal",
	"nature"
],
	"🐴": [
	"horse_face",
	"animal",
	"brown",
	"nature"
],
	"🐎": [
	"horse",
	"animal",
	"gamble",
	"luck"
],
	"🦄": [
	"unicorn",
	"animal",
	"nature",
	"mystical"
],
	"🦓": [
	"zebra",
	"animal",
	"nature",
	"stripes",
	"safari"
],
	"🦌": [
	"deer",
	"animal",
	"nature",
	"horns",
	"venison"
],
	"🐮": [
	"cow_face",
	"beef",
	"ox",
	"animal",
	"nature",
	"moo",
	"milk"
],
	"🐂": [
	"ox",
	"animal",
	"cow",
	"beef"
],
	"🐃": [
	"water_buffalo",
	"animal",
	"nature",
	"ox",
	"cow"
],
	"🐄": [
	"cow",
	"beef",
	"ox",
	"animal",
	"nature",
	"moo",
	"milk"
],
	"🐷": [
	"pig_face",
	"animal",
	"oink",
	"nature"
],
	"🐖": [
	"pig",
	"animal",
	"nature"
],
	"🐗": [
	"boar",
	"animal",
	"nature"
],
	"🐽": [
	"pig_nose",
	"animal",
	"oink"
],
	"🐏": [
	"ram",
	"animal",
	"sheep",
	"nature"
],
	"🐑": [
	"ewe",
	"animal",
	"nature",
	"wool",
	"shipit"
],
	"🐐": [
	"goat",
	"animal",
	"nature"
],
	"🐪": [
	"camel",
	"animal",
	"hot",
	"desert",
	"hump"
],
	"🐫": [
	"two_hump_camel",
	"animal",
	"nature",
	"hot",
	"desert",
	"hump"
],
	"🦙": [
	"llama",
	"animal",
	"nature",
	"alpaca"
],
	"🦒": [
	"giraffe",
	"animal",
	"nature",
	"spots",
	"safari"
],
	"🐘": [
	"elephant",
	"animal",
	"nature",
	"nose",
	"th",
	"circus"
],
	"🦏": [
	"rhinoceros",
	"animal",
	"nature",
	"horn"
],
	"🦛": [
	"hippopotamus",
	"animal",
	"nature"
],
	"🐭": [
	"mouse_face",
	"animal",
	"nature",
	"cheese_wedge",
	"rodent"
],
	"🐁": [
	"mouse",
	"animal",
	"nature",
	"rodent"
],
	"🐀": [
	"rat",
	"animal",
	"mouse",
	"rodent"
],
	"🐹": [
	"hamster",
	"animal",
	"nature"
],
	"🐰": [
	"rabbit_face",
	"animal",
	"nature",
	"pet",
	"spring",
	"magic",
	"bunny"
],
	"🐇": [
	"rabbit",
	"animal",
	"nature",
	"pet",
	"magic",
	"spring"
],
	"🐿️": [
	"chipmunk",
	"animal",
	"nature",
	"rodent",
	"squirrel"
],
	"🦔": [
	"hedgehog",
	"animal",
	"nature",
	"spiny"
],
	"🦇": [
	"bat",
	"animal",
	"nature",
	"blind",
	"vampire"
],
	"🐻": [
	"bear",
	"animal",
	"nature",
	"wild"
],
	"🐨": [
	"koala",
	"animal",
	"nature"
],
	"🐼": [
	"panda",
	"animal",
	"nature",
	"panda"
],
	"🦥": [
	"sloth",
	"animal"
],
	"🦦": [
	"otter",
	"animal"
],
	"🦨": [
	"skunk",
	"animal"
],
	"🦘": [
	"kangaroo",
	"animal",
	"nature",
	"australia",
	"joey",
	"hop",
	"marsupial"
],
	"🦡": [
	"badger",
	"animal",
	"nature",
	"honey"
],
	"🐾": [
	"paw_prints",
	"animal",
	"tracking",
	"footprints",
	"dog",
	"cat",
	"pet",
	"feet"
],
	"🦃": [
	"turkey",
	"animal",
	"bird"
],
	"🐔": [
	"chicken",
	"animal",
	"cluck",
	"nature",
	"bird"
],
	"🐓": [
	"rooster",
	"animal",
	"nature",
	"chicken"
],
	"🐣": [
	"hatching_chick",
	"animal",
	"chicken",
	"egg",
	"born",
	"baby",
	"bird"
],
	"🐤": [
	"baby_chick",
	"animal",
	"chicken",
	"bird"
],
	"🐥": [
	"front_facing_baby_chick",
	"animal",
	"chicken",
	"baby",
	"bird"
],
	"🐦": [
	"bird",
	"animal",
	"nature",
	"fly",
	"tweet",
	"spring"
],
	"🐧": [
	"penguin",
	"animal",
	"nature"
],
	"🕊️": [
	"dove",
	"animal",
	"bird"
],
	"🦅": [
	"eagle",
	"animal",
	"nature",
	"bird"
],
	"🦆": [
	"duck",
	"animal",
	"nature",
	"bird",
	"mallard"
],
	"🦢": [
	"swan",
	"animal",
	"nature",
	"bird"
],
	"🦉": [
	"owl",
	"animal",
	"nature",
	"bird",
	"hoot"
],
	"🦩": [
	"flamingo",
	"animal"
],
	"🦚": [
	"peacock",
	"animal",
	"nature",
	"peahen",
	"bird"
],
	"🦜": [
	"parrot",
	"animal",
	"nature",
	"bird",
	"pirate",
	"talk"
],
	"🐸": [
	"frog",
	"animal",
	"nature",
	"croak",
	"toad"
],
	"🐊": [
	"crocodile",
	"animal",
	"nature",
	"reptile",
	"lizard",
	"alligator"
],
	"🐢": [
	"turtle",
	"animal",
	"slow",
	"nature",
	"tortoise"
],
	"🦎": [
	"lizard",
	"animal",
	"nature",
	"reptile"
],
	"🐍": [
	"snake",
	"animal",
	"evil",
	"nature",
	"hiss",
	"python"
],
	"🐲": [
	"dragon_face",
	"animal",
	"myth",
	"nature",
	"chinese",
	"green"
],
	"🐉": [
	"dragon",
	"animal",
	"myth",
	"nature",
	"chinese",
	"green"
],
	"🦕": [
	"sauropod",
	"animal",
	"nature",
	"dinosaur",
	"brachiosaurus",
	"brontosaurus",
	"diplodocus",
	"extinct"
],
	"🦖": [
	"t_rex",
	"animal",
	"nature",
	"dinosaur",
	"tyrannosaurus",
	"extinct"
],
	"🐳": [
	"spouting_whale",
	"animal",
	"nature",
	"sea",
	"ocean"
],
	"🐋": [
	"whale",
	"animal",
	"nature",
	"sea",
	"ocean"
],
	"🐬": [
	"dolphin",
	"animal",
	"nature",
	"fish",
	"sea",
	"ocean",
	"flipper",
	"fins",
	"beach"
],
	"🐟": [
	"fish",
	"animal",
	"food",
	"nature"
],
	"🐠": [
	"tropical_fish",
	"animal",
	"swim",
	"ocean",
	"beach",
	"nemo"
],
	"🐡": [
	"blowfish",
	"animal",
	"nature",
	"food",
	"sea",
	"ocean"
],
	"🦈": [
	"shark",
	"animal",
	"nature",
	"fish",
	"sea",
	"ocean",
	"jaws",
	"fins",
	"beach"
],
	"🐙": [
	"octopus",
	"animal",
	"creature",
	"ocean",
	"sea",
	"nature",
	"beach"
],
	"🐚": [
	"spiral_shell",
	"nature",
	"sea",
	"beach"
],
	"🐌": [
	"snail",
	"slow",
	"animal",
	"shell"
],
	"🦋": [
	"butterfly",
	"animal",
	"insect",
	"nature",
	"caterpillar"
],
	"🐛": [
	"bug",
	"animal",
	"insect",
	"nature",
	"worm"
],
	"🐜": [
	"ant",
	"animal",
	"insect",
	"nature",
	"bug"
],
	"🐝": [
	"honeybee",
	"animal",
	"insect",
	"nature",
	"bug",
	"spring",
	"honey"
],
	"🐞": [
	"lady_beetle",
	"animal",
	"insect",
	"nature",
	"ladybug"
],
	"🦗": [
	"cricket",
	"animal",
	"cricket",
	"chirp"
],
	"🕷️": [
	"spider",
	"animal",
	"arachnid"
],
	"🕸️": [
	"spider_web",
	"animal",
	"insect",
	"arachnid",
	"silk"
],
	"🦂": [
	"scorpion",
	"animal",
	"arachnid"
],
	"🦟": [
	"mosquito",
	"animal",
	"nature",
	"insect",
	"malaria"
],
	"🦠": [
	"microbe",
	"amoeba",
	"bacteria",
	"germs",
	"virus",
	"covid"
],
	"💐": [
	"bouquet",
	"flowers",
	"nature",
	"spring"
],
	"🌸": [
	"cherry_blossom",
	"nature",
	"plant",
	"spring",
	"flower"
],
	"💮": [
	"white_flower",
	"japanese",
	"spring"
],
	"🏵️": [
	"rosette",
	"flower",
	"decoration",
	"military"
],
	"🌹": [
	"rose",
	"flowers",
	"valentines",
	"love",
	"spring"
],
	"🥀": [
	"wilted_flower",
	"plant",
	"nature",
	"flower",
	"rose"
],
	"🌺": [
	"hibiscus",
	"plant",
	"vegetable",
	"flowers",
	"beach"
],
	"🌻": [
	"sunflower",
	"nature",
	"plant",
	"fall"
],
	"🌼": [
	"blossom",
	"nature",
	"flowers",
	"yellow"
],
	"🌷": [
	"tulip",
	"flowers",
	"plant",
	"nature",
	"summer",
	"spring"
],
	"🌱": [
	"seedling",
	"plant",
	"nature",
	"grass",
	"lawn",
	"spring"
],
	"🌲": [
	"evergreen_tree",
	"plant",
	"nature"
],
	"🌳": [
	"deciduous_tree",
	"plant",
	"nature"
],
	"🌴": [
	"palm_tree",
	"plant",
	"vegetable",
	"nature",
	"summer",
	"beach",
	"mojito",
	"tropical"
],
	"🌵": [
	"cactus",
	"vegetable",
	"plant",
	"nature"
],
	"🌾": [
	"sheaf_of_rice",
	"nature",
	"plant"
],
	"🌿": [
	"herb",
	"vegetable",
	"plant",
	"medicine",
	"weed",
	"grass",
	"lawn"
],
	"☘️": [
	"shamrock",
	"vegetable",
	"plant",
	"nature",
	"irish",
	"clover"
],
	"🍀": [
	"four_leaf_clover",
	"vegetable",
	"plant",
	"nature",
	"lucky",
	"irish"
],
	"🍁": [
	"maple_leaf",
	"nature",
	"plant",
	"vegetable",
	"ca",
	"fall"
],
	"🍂": [
	"fallen_leaf",
	"nature",
	"plant",
	"vegetable",
	"leaves"
],
	"🍃": [
	"leaf_fluttering_in_wind",
	"nature",
	"plant",
	"tree",
	"vegetable",
	"grass",
	"lawn",
	"spring"
],
	"🍇": [
	"grapes",
	"fruit",
	"food",
	"wine"
],
	"🍈": [
	"melon",
	"fruit",
	"nature",
	"food"
],
	"🍉": [
	"watermelon",
	"fruit",
	"food",
	"picnic",
	"summer"
],
	"🍊": [
	"tangerine",
	"food",
	"fruit",
	"nature",
	"orange"
],
	"🍋": [
	"lemon",
	"fruit",
	"nature"
],
	"🍌": [
	"banana",
	"fruit",
	"food",
	"monkey"
],
	"🍍": [
	"pineapple",
	"fruit",
	"nature",
	"food"
],
	"🥭": [
	"mango",
	"fruit",
	"food",
	"tropical"
],
	"🍎": [
	"red_apple",
	"fruit",
	"mac",
	"school"
],
	"🍏": [
	"green_apple",
	"fruit",
	"nature"
],
	"🍐": [
	"pear",
	"fruit",
	"nature",
	"food"
],
	"🍑": [
	"peach",
	"fruit",
	"nature",
	"food"
],
	"🍒": [
	"cherries",
	"food",
	"fruit"
],
	"🍓": [
	"strawberry",
	"fruit",
	"food",
	"nature"
],
	"🥝": [
	"kiwi_fruit",
	"fruit",
	"food"
],
	"🍅": [
	"tomato",
	"fruit",
	"vegetable",
	"nature",
	"food"
],
	"🥥": [
	"coconut",
	"fruit",
	"nature",
	"food",
	"palm"
],
	"🥑": [
	"avocado",
	"fruit",
	"food"
],
	"🍆": [
	"eggplant",
	"vegetable",
	"nature",
	"food",
	"aubergine"
],
	"🥔": [
	"potato",
	"food",
	"tuber",
	"vegatable",
	"starch"
],
	"🥕": [
	"carrot",
	"vegetable",
	"food",
	"orange"
],
	"🌽": [
	"ear_of_corn",
	"food",
	"vegetable",
	"plant"
],
	"🌶️": [
	"hot_pepper",
	"food",
	"spicy",
	"chilli",
	"chili"
],
	"🥒": [
	"cucumber",
	"fruit",
	"food",
	"pickle"
],
	"🥬": [
	"leafy_green",
	"food",
	"vegetable",
	"plant",
	"bok choy",
	"cabbage",
	"kale",
	"lettuce"
],
	"🥦": [
	"broccoli",
	"fruit",
	"food",
	"vegetable"
],
	"🧄": [
	"garlic",
	"food",
	"spice",
	"cook"
],
	"🧅": [
	"onion",
	"cook",
	"food",
	"spice"
],
	"🍄": [
	"mushroom",
	"plant",
	"vegetable"
],
	"🥜": [
	"peanuts",
	"food",
	"nut"
],
	"🌰": [
	"chestnut",
	"food",
	"squirrel"
],
	"🍞": [
	"bread",
	"food",
	"wheat",
	"breakfast",
	"toast"
],
	"🥐": [
	"croissant",
	"food",
	"bread",
	"french"
],
	"🥖": [
	"baguette_bread",
	"food",
	"bread",
	"french",
	"france",
	"bakery"
],
	"🥨": [
	"pretzel",
	"food",
	"bread",
	"twisted",
	"germany",
	"bakery"
],
	"🥯": [
	"bagel",
	"food",
	"bread",
	"bakery",
	"schmear",
	"jewish",
	"bakery"
],
	"🥞": [
	"pancakes",
	"food",
	"breakfast",
	"flapjacks",
	"hotcakes",
	"brunch"
],
	"🧇": [
	"waffle",
	"food",
	"breakfast",
	"brunch"
],
	"🧀": [
	"cheese_wedge",
	"food",
	"chadder",
	"swiss"
],
	"🍖": [
	"meat_on_bone",
	"good",
	"food",
	"drumstick"
],
	"🍗": [
	"poultry_leg",
	"food",
	"meat",
	"drumstick",
	"bird",
	"chicken",
	"turkey"
],
	"🥩": [
	"cut_of_meat",
	"food",
	"cow",
	"meat",
	"cut",
	"chop",
	"lambchop",
	"porkchop"
],
	"🥓": [
	"bacon",
	"food",
	"breakfast",
	"pork",
	"pig",
	"meat",
	"brunch"
],
	"🍔": [
	"hamburger",
	"meat",
	"fast food",
	"beef",
	"cheeseburger",
	"mcdonalds",
	"burger king"
],
	"🍟": [
	"french_fries",
	"chips",
	"snack",
	"fast food",
	"potato"
],
	"🍕": [
	"pizza",
	"food",
	"party",
	"italy"
],
	"🌭": [
	"hot_dog",
	"food",
	"frankfurter",
	"america"
],
	"🥪": [
	"sandwich",
	"food",
	"lunch",
	"bread",
	"toast",
	"bakery"
],
	"🌮": [
	"taco",
	"food",
	"mexican"
],
	"🌯": [
	"burrito",
	"food",
	"mexican"
],
	"🥙": [
	"stuffed_flatbread",
	"food",
	"flatbread",
	"stuffed",
	"gyro",
	"mediterranean"
],
	"🧆": [
	"falafel",
	"food",
	"mediterranean"
],
	"🥚": [
	"egg",
	"food",
	"chicken",
	"breakfast"
],
	"🍳": [
	"cooking",
	"food",
	"breakfast",
	"kitchen",
	"egg",
	"skillet"
],
	"🥘": [
	"shallow_pan_of_food",
	"food",
	"cooking",
	"casserole",
	"paella",
	"skillet"
],
	"🍲": [
	"pot_of_food",
	"food",
	"meat",
	"soup",
	"hot pot"
],
	"🥣": [
	"bowl_with_spoon",
	"food",
	"breakfast",
	"cereal",
	"oatmeal",
	"porridge"
],
	"🥗": [
	"green_salad",
	"food",
	"healthy",
	"lettuce",
	"vegetable"
],
	"🍿": [
	"popcorn",
	"food",
	"movie theater",
	"films",
	"snack",
	"drama"
],
	"🧈": [
	"butter",
	"food",
	"cook"
],
	"🧂": [
	"salt",
	"condiment",
	"shaker"
],
	"🥫": [
	"canned_food",
	"food",
	"soup",
	"tomatoes"
],
	"🍱": [
	"bento_box",
	"food",
	"japanese",
	"box",
	"lunch"
],
	"🍘": [
	"rice_cracker",
	"food",
	"japanese",
	"snack"
],
	"🍙": [
	"rice_ball",
	"food",
	"japanese"
],
	"🍚": [
	"cooked_rice",
	"food",
	"asian"
],
	"🍛": [
	"curry_rice",
	"food",
	"spicy",
	"hot",
	"indian"
],
	"🍜": [
	"steaming_bowl",
	"food",
	"japanese",
	"noodle",
	"chopsticks",
	"ramen"
],
	"🍝": [
	"spaghetti",
	"food",
	"italian",
	"pasta",
	"noodle"
],
	"🍠": [
	"roasted_sweet_potato",
	"food",
	"nature",
	"plant"
],
	"🍢": [
	"oden",
	"food",
	"japanese"
],
	"🍣": [
	"sushi",
	"food",
	"fish",
	"japanese",
	"rice"
],
	"🍤": [
	"fried_shrimp",
	"food",
	"animal",
	"appetizer",
	"summer"
],
	"🍥": [
	"fish_cake_with_swirl",
	"food",
	"japan",
	"sea",
	"beach",
	"narutomaki",
	"pink",
	"swirl",
	"kamaboko",
	"surimi",
	"ramen"
],
	"🥮": [
	"moon_cake",
	"food",
	"autumn",
	"dessert"
],
	"🍡": [
	"dango",
	"food",
	"dessert",
	"sweet",
	"japanese",
	"barbecue",
	"meat"
],
	"🥟": [
	"dumpling",
	"food",
	"empanada",
	"pierogi",
	"potsticker",
	"gyoza"
],
	"🥠": [
	"fortune_cookie",
	"food",
	"prophecy",
	"dessert"
],
	"🥡": [
	"takeout_box",
	"food",
	"leftovers"
],
	"🦀": [
	"crab",
	"animal",
	"crustacean"
],
	"🦞": [
	"lobster",
	"animal",
	"nature",
	"bisque",
	"claws",
	"seafood"
],
	"🦐": [
	"shrimp",
	"animal",
	"ocean",
	"nature",
	"seafood"
],
	"🦑": [
	"squid",
	"animal",
	"nature",
	"ocean",
	"sea"
],
	"🦪": [
	"oyster",
	"food"
],
	"🍦": [
	"soft_ice_cream",
	"food",
	"hot",
	"dessert",
	"summer"
],
	"🍧": [
	"shaved_ice",
	"hot",
	"dessert",
	"summer"
],
	"🍨": [
	"ice_cream",
	"food",
	"hot",
	"dessert"
],
	"🍩": [
	"doughnut",
	"food",
	"dessert",
	"snack",
	"sweet",
	"donut"
],
	"🍪": [
	"cookie",
	"food",
	"snack",
	"oreo",
	"chocolate",
	"sweet",
	"dessert"
],
	"🎂": [
	"birthday_cake",
	"food",
	"dessert",
	"cake"
],
	"🍰": [
	"shortcake",
	"food",
	"dessert"
],
	"🧁": [
	"cupcake",
	"food",
	"dessert",
	"bakery",
	"sweet"
],
	"🥧": [
	"pie",
	"food",
	"dessert",
	"pastry"
],
	"🍫": [
	"chocolate_bar",
	"food",
	"snack",
	"dessert",
	"sweet"
],
	"🍬": [
	"candy",
	"snack",
	"dessert",
	"sweet",
	"lolly"
],
	"🍭": [
	"lollipop",
	"food",
	"snack",
	"candy",
	"sweet"
],
	"🍮": [
	"custard",
	"dessert",
	"food"
],
	"🍯": [
	"honey_pot",
	"bees",
	"sweet",
	"kitchen"
],
	"🍼": [
	"baby_bottle",
	"food",
	"container",
	"milk"
],
	"🥛": [
	"glass_of_milk",
	"beverage",
	"drink",
	"cow"
],
	"☕": [
	"hot_beverage",
	"beverage",
	"caffeine",
	"latte",
	"espresso",
	"coffee",
	"mug"
],
	"🍵": [
	"teacup_without_handle",
	"drink",
	"bowl",
	"breakfast",
	"green",
	"british"
],
	"🍶": [
	"sake",
	"wine",
	"drink",
	"drunk",
	"beverage",
	"japanese",
	"alcohol",
	"booze"
],
	"🍾": [
	"bottle_with_popping_cork",
	"drink",
	"wine",
	"bottle",
	"celebration"
],
	"🍷": [
	"wine_glass",
	"drink",
	"beverage",
	"drunk",
	"alcohol",
	"booze"
],
	"🍸": [
	"cocktail_glass",
	"drink",
	"drunk",
	"alcohol",
	"beverage",
	"booze",
	"mojito"
],
	"🍹": [
	"tropical_drink",
	"beverage",
	"cocktail",
	"summer",
	"beach",
	"alcohol",
	"booze",
	"mojito"
],
	"🍺": [
	"beer_mug",
	"relax",
	"beverage",
	"drink",
	"drunk",
	"party",
	"pub",
	"summer",
	"alcohol",
	"booze"
],
	"🍻": [
	"clinking_beer_mugs",
	"relax",
	"beverage",
	"drink",
	"drunk",
	"party",
	"pub",
	"summer",
	"alcohol",
	"booze"
],
	"🥂": [
	"clinking_glasses",
	"beverage",
	"drink",
	"party",
	"alcohol",
	"celebrate",
	"cheers",
	"wine",
	"champagne",
	"toast"
],
	"🥃": [
	"tumbler_glass",
	"drink",
	"beverage",
	"drunk",
	"alcohol",
	"liquor",
	"booze",
	"bourbon",
	"scotch",
	"whisky",
	"glass",
	"shot"
],
	"🥤": [
	"cup_with_straw",
	"drink",
	"soda"
],
	"🧃": [
	"beverage_box",
	"drink"
],
	"🧉": [
	"mate",
	"drink",
	"tea",
	"beverage"
],
	"🧊": [
	"ice",
	"water",
	"cold"
],
	"🥢": [
	"chopsticks",
	"food"
],
	"🍽️": [
	"fork_and_knife_with_plate",
	"food",
	"eat",
	"meal",
	"lunch",
	"dinner",
	"restaurant"
],
	"🍴": [
	"fork_and_knife",
	"cutlery",
	"kitchen"
],
	"🥄": [
	"spoon",
	"cutlery",
	"kitchen",
	"tableware"
],
	"🔪": [
	"kitchen_knife",
	"knife",
	"blade",
	"cutlery",
	"kitchen",
	"weapon"
],
	"🏺": [
	"amphora",
	"vase",
	"jar"
],
	"🌍": [
	"globe_showing_europe_africa",
	"globe",
	"world",
	"international"
],
	"🌎": [
	"globe_showing_americas",
	"globe",
	"world",
	"USA",
	"international"
],
	"🌏": [
	"globe_showing_asia_australia",
	"globe",
	"world",
	"east",
	"international"
],
	"🌐": [
	"globe_with_meridians",
	"earth",
	"international",
	"world",
	"internet",
	"interweb",
	"i18n"
],
	"🗺️": [
	"world_map",
	"location",
	"direction"
],
	"🗾": [
	"map_of_japan",
	"nation",
	"country",
	"japanese",
	"asia"
],
	"🧭": [
	"compass",
	"magnetic",
	"navigation",
	"orienteering"
],
	"🏔️": [
	"snow_capped_mountain",
	"photo",
	"nature",
	"environment",
	"winter",
	"cold"
],
	"⛰️": [
	"mountain",
	"photo",
	"nature",
	"environment"
],
	"🌋": [
	"volcano",
	"photo",
	"nature",
	"disaster"
],
	"🗻": [
	"mount_fuji",
	"photo",
	"mountain",
	"nature",
	"japanese"
],
	"🏕️": [
	"camping",
	"photo",
	"outdoors",
	"tent"
],
	"🏖️": [
	"beach_with_umbrella",
	"weather",
	"summer",
	"sunny",
	"sand",
	"mojito"
],
	"🏜️": [
	"desert",
	"photo",
	"warm",
	"saharah"
],
	"🏝️": [
	"desert_island",
	"photo",
	"tropical",
	"mojito"
],
	"🏞️": [
	"national_park",
	"photo",
	"environment",
	"nature"
],
	"🏟️": [
	"stadium",
	"photo",
	"place",
	"sports",
	"concert",
	"venue"
],
	"🏛️": [
	"classical_building",
	"art",
	"culture",
	"history"
],
	"🏗️": [
	"building_construction",
	"wip",
	"working",
	"progress"
],
	"🧱": [
	"brick",
	"bricks"
],
	"🏘️": [
	"houses",
	"buildings",
	"photo"
],
	"🏚️": [
	"derelict_house",
	"abandon",
	"evict",
	"broken",
	"building"
],
	"🏠": [
	"house",
	"building",
	"home"
],
	"🏡": [
	"house_with_garden",
	"home",
	"plant",
	"nature"
],
	"🏢": [
	"office_building",
	"building",
	"bureau",
	"work"
],
	"🏣": [
	"japanese_post_office",
	"building",
	"envelope",
	"communication"
],
	"🏤": [
	"post_office",
	"building",
	"email"
],
	"🏥": [
	"hospital",
	"building",
	"health",
	"surgery",
	"doctor"
],
	"🏦": [
	"bank",
	"building",
	"money",
	"sales",
	"cash",
	"business",
	"enterprise"
],
	"🏨": [
	"hotel",
	"building",
	"accomodation",
	"checkin"
],
	"🏩": [
	"love_hotel",
	"like",
	"affection",
	"dating"
],
	"🏪": [
	"convenience_store",
	"building",
	"shopping",
	"groceries"
],
	"🏫": [
	"school",
	"building",
	"student",
	"education",
	"learn",
	"teach"
],
	"🏬": [
	"department_store",
	"building",
	"shopping",
	"mall"
],
	"🏭": [
	"factory",
	"building",
	"industry",
	"pollution",
	"smoke"
],
	"🏯": [
	"japanese_castle",
	"photo",
	"building"
],
	"🏰": [
	"castle",
	"building",
	"royalty",
	"history"
],
	"💒": [
	"wedding",
	"love",
	"like",
	"affection",
	"couple",
	"marriage",
	"bride",
	"groom"
],
	"🗼": [
	"tokyo_tower",
	"photo",
	"japanese"
],
	"🗽": [
	"statue_of_liberty",
	"american",
	"newyork"
],
	"⛪": [
	"church",
	"building",
	"religion",
	"christ"
],
	"🕌": [
	"mosque",
	"islam",
	"worship",
	"minaret"
],
	"🛕": [
	"hindu_temple",
	"religion"
],
	"🕍": [
	"synagogue",
	"judaism",
	"worship",
	"temple",
	"jewish"
],
	"⛩️": [
	"shinto_shrine",
	"temple",
	"japan",
	"kyoto"
],
	"🕋": [
	"kaaba",
	"mecca",
	"mosque",
	"islam"
],
	"⛲": [
	"fountain",
	"photo",
	"summer",
	"water",
	"fresh"
],
	"⛺": [
	"tent",
	"photo",
	"camping",
	"outdoors"
],
	"🌁": [
	"foggy",
	"photo",
	"mountain"
],
	"🌃": [
	"night_with_stars",
	"evening",
	"city",
	"downtown"
],
	"🏙️": [
	"cityscape",
	"photo",
	"night life",
	"urban"
],
	"🌄": [
	"sunrise_over_mountains",
	"view",
	"vacation",
	"photo"
],
	"🌅": [
	"sunrise",
	"morning",
	"view",
	"vacation",
	"photo"
],
	"🌆": [
	"cityscape_at_dusk",
	"photo",
	"evening",
	"sky",
	"buildings"
],
	"🌇": [
	"sunset",
	"photo",
	"good morning",
	"dawn"
],
	"🌉": [
	"bridge_at_night",
	"photo",
	"sanfrancisco"
],
	"♨️": [
	"hot_springs",
	"bath",
	"warm",
	"relax"
],
	"🎠": [
	"carousel_horse",
	"photo",
	"carnival"
],
	"🎡": [
	"ferris_wheel",
	"photo",
	"carnival",
	"londoneye"
],
	"🎢": [
	"roller_coaster",
	"carnival",
	"playground",
	"photo",
	"fun"
],
	"💈": [
	"barber_pole",
	"hair",
	"salon",
	"style"
],
	"🎪": [
	"circus_tent",
	"festival",
	"carnival",
	"party"
],
	"🚂": [
	"locomotive",
	"transportation",
	"vehicle",
	"train"
],
	"🚃": [
	"railway_car",
	"transportation",
	"vehicle"
],
	"🚄": [
	"high_speed_train",
	"transportation",
	"vehicle"
],
	"🚅": [
	"bullet_train",
	"transportation",
	"vehicle",
	"speed",
	"fast",
	"public",
	"travel"
],
	"🚆": [
	"train",
	"transportation",
	"vehicle"
],
	"🚇": [
	"metro",
	"transportation",
	"blue-square",
	"mrt",
	"underground",
	"tube"
],
	"🚈": [
	"light_rail",
	"transportation",
	"vehicle"
],
	"🚉": [
	"station",
	"transportation",
	"vehicle",
	"public"
],
	"🚊": [
	"tram",
	"transportation",
	"vehicle"
],
	"🚝": [
	"monorail",
	"transportation",
	"vehicle"
],
	"🚞": [
	"mountain_railway",
	"transportation",
	"vehicle"
],
	"🚋": [
	"tram_car",
	"transportation",
	"vehicle",
	"carriage",
	"public",
	"travel"
],
	"🚌": [
	"bus",
	"car",
	"vehicle",
	"transportation"
],
	"🚍": [
	"oncoming_bus",
	"vehicle",
	"transportation"
],
	"🚎": [
	"trolleybus",
	"bart",
	"transportation",
	"vehicle"
],
	"🚐": [
	"minibus",
	"vehicle",
	"car",
	"transportation"
],
	"🚑": [
	"ambulance",
	"health",
	"911",
	"hospital"
],
	"🚒": [
	"fire_engine",
	"transportation",
	"cars",
	"vehicle"
],
	"🚓": [
	"police_car",
	"vehicle",
	"cars",
	"transportation",
	"law",
	"legal",
	"enforcement"
],
	"🚔": [
	"oncoming_police_car",
	"vehicle",
	"law",
	"legal",
	"enforcement",
	"911"
],
	"🚕": [
	"taxi",
	"uber",
	"vehicle",
	"cars",
	"transportation"
],
	"🚖": [
	"oncoming_taxi",
	"vehicle",
	"cars",
	"uber"
],
	"🚗": [
	"automobile",
	"red",
	"transportation",
	"vehicle"
],
	"🚘": [
	"oncoming_automobile",
	"car",
	"vehicle",
	"transportation"
],
	"🚙": [
	"sport_utility_vehicle",
	"transportation",
	"vehicle"
],
	"🚚": [
	"delivery_truck",
	"cars",
	"transportation"
],
	"🚛": [
	"articulated_lorry",
	"vehicle",
	"cars",
	"transportation",
	"express"
],
	"🚜": [
	"tractor",
	"vehicle",
	"car",
	"farming",
	"agriculture"
],
	"🏎️": [
	"racing_car",
	"sports",
	"race",
	"fast",
	"formula",
	"f1"
],
	"🏍️": [
	"motorcycle",
	"race",
	"sports",
	"fast"
],
	"🛵": [
	"motor_scooter",
	"vehicle",
	"vespa",
	"sasha"
],
	"🦽": [
	"manual_wheelchair",
	"accessibility"
],
	"🦼": [
	"motorized_wheelchair",
	"accessibility"
],
	"🛺": [
	"auto_rickshaw",
	"move",
	"transportation"
],
	"🚲": [
	"bicycle",
	"sports",
	"bicycle",
	"exercise",
	"hipster"
],
	"🛴": [
	"kick_scooter",
	"vehicle",
	"kick",
	"razor"
],
	"🛹": [
	"skateboard",
	"board"
],
	"🚏": [
	"bus_stop",
	"transportation",
	"wait"
],
	"🛣️": [
	"motorway",
	"road",
	"cupertino",
	"interstate",
	"highway"
],
	"🛤️": [
	"railway_track",
	"train",
	"transportation"
],
	"🛢️": [
	"oil_drum",
	"barrell"
],
	"⛽": [
	"fuel_pump",
	"gas station",
	"petroleum"
],
	"🚨": [
	"police_car_light",
	"police",
	"ambulance",
	"911",
	"emergency",
	"alert",
	"error",
	"pinged",
	"law",
	"legal"
],
	"🚥": [
	"horizontal_traffic_light",
	"transportation",
	"signal"
],
	"🚦": [
	"vertical_traffic_light",
	"transportation",
	"driving"
],
	"🛑": [
	"stop_sign",
	"stop"
],
	"🚧": [
	"construction",
	"wip",
	"progress",
	"caution",
	"warning"
],
	"⚓": [
	"anchor",
	"ship",
	"ferry",
	"sea",
	"boat"
],
	"⛵": [
	"sailboat",
	"ship",
	"summer",
	"transportation",
	"water",
	"sailing"
],
	"🛶": [
	"canoe",
	"boat",
	"paddle",
	"water",
	"ship"
],
	"🚤": [
	"speedboat",
	"ship",
	"transportation",
	"vehicle",
	"summer"
],
	"🛳️": [
	"passenger_ship",
	"yacht",
	"cruise",
	"ferry"
],
	"⛴️": [
	"ferry",
	"boat",
	"ship",
	"yacht"
],
	"🛥️": [
	"motor_boat",
	"ship"
],
	"🚢": [
	"ship",
	"transportation",
	"titanic",
	"deploy"
],
	"✈️": [
	"airplane",
	"vehicle",
	"transportation",
	"flight",
	"fly"
],
	"🛩️": [
	"small_airplane",
	"flight",
	"transportation",
	"fly",
	"vehicle"
],
	"🛫": [
	"airplane_departure",
	"airport",
	"flight",
	"landing"
],
	"🛬": [
	"airplane_arrival",
	"airport",
	"flight",
	"boarding"
],
	"🪂": [
	"parachute",
	"fly",
	"glide"
],
	"💺": [
	"seat",
	"sit",
	"airplane",
	"transport",
	"bus",
	"flight",
	"fly"
],
	"🚁": [
	"helicopter",
	"transportation",
	"vehicle",
	"fly"
],
	"🚟": [
	"suspension_railway",
	"vehicle",
	"transportation"
],
	"🚠": [
	"mountain_cableway",
	"transportation",
	"vehicle",
	"ski"
],
	"🚡": [
	"aerial_tramway",
	"transportation",
	"vehicle",
	"ski"
],
	"🛰️": [
	"satellite",
	"communication",
	"gps",
	"orbit",
	"spaceflight",
	"NASA",
	"ISS"
],
	"🚀": [
	"rocket",
	"launch",
	"ship",
	"staffmode",
	"NASA",
	"outer space",
	"outer_space",
	"fly"
],
	"🛸": [
	"flying_saucer",
	"transportation",
	"vehicle",
	"ufo"
],
	"🛎️": [
	"bellhop_bell",
	"service"
],
	"🧳": [
	"luggage",
	"packing",
	"travel"
],
	"⌛": [
	"hourglass_done",
	"time",
	"clock",
	"oldschool",
	"limit",
	"exam",
	"quiz",
	"test"
],
	"⏳": [
	"hourglass_not_done",
	"oldschool",
	"time",
	"countdown"
],
	"⌚": [
	"watch",
	"time",
	"accessories"
],
	"⏰": [
	"alarm_clock",
	"time",
	"wake"
],
	"⏱️": [
	"stopwatch",
	"time",
	"deadline"
],
	"⏲️": [
	"timer_clock",
	"alarm"
],
	"🕰️": [
	"mantelpiece_clock",
	"time"
],
	"🕛": [
	"twelve_o_clock",
	"12",
	"00:00",
	"0000",
	"12:00",
	"1200",
	"time",
	"noon",
	"midnight",
	"midday",
	"late",
	"early",
	"schedule"
],
	"🕧": [
	"twelve_thirty",
	"00:30",
	"0030",
	"12:30",
	"1230",
	"time",
	"late",
	"early",
	"schedule"
],
	"🕐": [
	"one_o_clock",
	"1",
	"1:00",
	"100",
	"13:00",
	"1300",
	"time",
	"late",
	"early",
	"schedule"
],
	"🕜": [
	"one_thirty",
	"1:30",
	"130",
	"13:30",
	"1330",
	"time",
	"late",
	"early",
	"schedule"
],
	"🕑": [
	"two_o_clock",
	"2",
	"2:00",
	"200",
	"14:00",
	"1400",
	"time",
	"late",
	"early",
	"schedule"
],
	"🕝": [
	"two_thirty",
	"2:30",
	"230",
	"14:30",
	"1430",
	"time",
	"late",
	"early",
	"schedule"
],
	"🕒": [
	"three_o_clock",
	"3",
	"3:00",
	"300",
	"15:00",
	"1500",
	"time",
	"late",
	"early",
	"schedule"
],
	"🕞": [
	"three_thirty",
	"3:30",
	"330",
	"15:30",
	"1530",
	"time",
	"late",
	"early",
	"schedule"
],
	"🕓": [
	"four_o_clock",
	"4",
	"4:00",
	"400",
	"16:00",
	"1600",
	"time",
	"late",
	"early",
	"schedule"
],
	"🕟": [
	"four_thirty",
	"4:30",
	"430",
	"16:30",
	"1630",
	"time",
	"late",
	"early",
	"schedule"
],
	"🕔": [
	"five_o_clock",
	"5",
	"5:00",
	"500",
	"17:00",
	"1700",
	"time",
	"late",
	"early",
	"schedule"
],
	"🕠": [
	"five_thirty",
	"5:30",
	"530",
	"17:30",
	"1730",
	"time",
	"late",
	"early",
	"schedule"
],
	"🕕": [
	"six_o_clock",
	"6",
	"6:00",
	"600",
	"18:00",
	"1800",
	"time",
	"late",
	"early",
	"schedule",
	"dawn",
	"dusk"
],
	"🕡": [
	"six_thirty",
	"6:30",
	"630",
	"18:30",
	"1830",
	"time",
	"late",
	"early",
	"schedule"
],
	"🕖": [
	"seven_o_clock",
	"7",
	"7:00",
	"700",
	"19:00",
	"1900",
	"time",
	"late",
	"early",
	"schedule"
],
	"🕢": [
	"seven_thirty",
	"7:30",
	"730",
	"19:30",
	"1930",
	"time",
	"late",
	"early",
	"schedule"
],
	"🕗": [
	"eight_o_clock",
	"8",
	"8:00",
	"800",
	"20:00",
	"2000",
	"time",
	"late",
	"early",
	"schedule"
],
	"🕣": [
	"eight_thirty",
	"8:30",
	"830",
	"20:30",
	"2030",
	"time",
	"late",
	"early",
	"schedule"
],
	"🕘": [
	"nine_o_clock",
	"9",
	"9:00",
	"900",
	"21:00",
	"2100",
	"time",
	"late",
	"early",
	"schedule"
],
	"🕤": [
	"nine_thirty",
	"9:30",
	"930",
	"21:30",
	"2130",
	"time",
	"late",
	"early",
	"schedule"
],
	"🕙": [
	"ten_o_clock",
	"10",
	"10:00",
	"1000",
	"22:00",
	"2200",
	"time",
	"late",
	"early",
	"schedule"
],
	"🕥": [
	"ten_thirty",
	"10:30",
	"1030",
	"22:30",
	"2230",
	"time",
	"late",
	"early",
	"schedule"
],
	"🕚": [
	"eleven_o_clock",
	"11",
	"11:00",
	"1100",
	"23:00",
	"2300",
	"time",
	"late",
	"early",
	"schedule"
],
	"🕦": [
	"eleven_thirty",
	"11:30",
	"1130",
	"23:30",
	"2330",
	"time",
	"late",
	"early",
	"schedule"
],
	"🌑": [
	"new_moon",
	"nature",
	"twilight",
	"planet",
	"space",
	"night",
	"evening",
	"sleep"
],
	"🌒": [
	"waxing_crescent_moon",
	"nature",
	"twilight",
	"planet",
	"space",
	"night",
	"evening",
	"sleep"
],
	"🌓": [
	"first_quarter_moon",
	"nature",
	"twilight",
	"planet",
	"space",
	"night",
	"evening",
	"sleep"
],
	"🌔": [
	"waxing_gibbous_moon",
	"nature",
	"night",
	"sky",
	"gray",
	"twilight",
	"planet",
	"space",
	"evening",
	"sleep"
],
	"🌕": [
	"full_moon",
	"nature",
	"yellow",
	"twilight",
	"planet",
	"space",
	"night",
	"evening",
	"sleep"
],
	"🌖": [
	"waning_gibbous_moon",
	"nature",
	"twilight",
	"planet",
	"space",
	"night",
	"evening",
	"sleep",
	"waxing_gibbous_moon"
],
	"🌗": [
	"last_quarter_moon",
	"nature",
	"twilight",
	"planet",
	"space",
	"night",
	"evening",
	"sleep"
],
	"🌘": [
	"waning_crescent_moon",
	"nature",
	"twilight",
	"planet",
	"space",
	"night",
	"evening",
	"sleep"
],
	"🌙": [
	"crescent_moon",
	"night",
	"sleep",
	"sky",
	"evening",
	"magic"
],
	"🌚": [
	"new_moon_face",
	"nature",
	"twilight",
	"planet",
	"space",
	"night",
	"evening",
	"sleep"
],
	"🌛": [
	"first_quarter_moon_face",
	"nature",
	"twilight",
	"planet",
	"space",
	"night",
	"evening",
	"sleep"
],
	"🌜": [
	"last_quarter_moon_face",
	"nature",
	"twilight",
	"planet",
	"space",
	"night",
	"evening",
	"sleep"
],
	"🌡️": [
	"thermometer",
	"weather",
	"temperature",
	"hot",
	"cold"
],
	"☀️": [
	"sun",
	"weather",
	"nature",
	"brightness",
	"summer",
	"beach",
	"spring"
],
	"🌝": [
	"full_moon_face",
	"nature",
	"twilight",
	"planet",
	"space",
	"night",
	"evening",
	"sleep"
],
	"🌞": [
	"sun_with_face",
	"nature",
	"morning",
	"sky"
],
	"🪐": [
	"ringed_planet",
	"outerspace"
],
	"⭐": [
	"star",
	"night",
	"yellow"
],
	"🌟": [
	"glowing_star",
	"night",
	"sparkle",
	"awesome",
	"good",
	"magic"
],
	"🌠": [
	"shooting_star",
	"night",
	"photo"
],
	"🌌": [
	"milky_way",
	"photo",
	"space",
	"stars"
],
	"☁️": [
	"cloud",
	"weather",
	"sky"
],
	"⛅": [
	"sun_behind_cloud",
	"weather",
	"nature",
	"cloudy",
	"morning",
	"fall",
	"spring"
],
	"⛈️": [
	"cloud_with_lightning_and_rain",
	"weather",
	"lightning"
],
	"🌤️": [
	"sun_behind_small_cloud",
	"weather"
],
	"🌥️": [
	"sun_behind_large_cloud",
	"weather"
],
	"🌦️": [
	"sun_behind_rain_cloud",
	"weather"
],
	"🌧️": [
	"cloud_with_rain",
	"weather"
],
	"🌨️": [
	"cloud_with_snow",
	"weather"
],
	"🌩️": [
	"cloud_with_lightning",
	"weather",
	"thunder"
],
	"🌪️": [
	"tornado",
	"weather",
	"cyclone",
	"twister"
],
	"🌫️": [
	"fog",
	"weather"
],
	"🌬️": [
	"wind_face",
	"gust",
	"air"
],
	"🌀": [
	"cyclone",
	"weather",
	"swirl",
	"blue",
	"cloud",
	"vortex",
	"spiral",
	"whirlpool",
	"spin",
	"tornado",
	"hurricane",
	"typhoon"
],
	"🌈": [
	"rainbow",
	"nature",
	"happy",
	"unicorn_face",
	"photo",
	"sky",
	"spring"
],
	"🌂": [
	"closed_umbrella",
	"weather",
	"rain",
	"drizzle"
],
	"☂️": [
	"umbrella",
	"weather",
	"spring"
],
	"☔": [
	"umbrella_with_rain_drops",
	"rainy",
	"weather",
	"spring"
],
	"⛱️": [
	"umbrella_on_ground",
	"weather",
	"summer"
],
	"⚡": [
	"high_voltage",
	"thunder",
	"weather",
	"lightning bolt",
	"fast"
],
	"❄️": [
	"snowflake",
	"winter",
	"season",
	"cold",
	"weather",
	"christmas",
	"xmas"
],
	"☃️": [
	"snowman",
	"winter",
	"season",
	"cold",
	"weather",
	"christmas",
	"xmas",
	"frozen"
],
	"⛄": [
	"snowman_without_snow",
	"winter",
	"season",
	"cold",
	"weather",
	"christmas",
	"xmas",
	"frozen",
	"without_snow"
],
	"☄️": [
	"comet",
	"space"
],
	"🔥": [
	"fire",
	"hot",
	"cook",
	"flame"
],
	"💧": [
	"droplet",
	"water",
	"drip",
	"faucet",
	"spring"
],
	"🌊": [
	"water_wave",
	"sea",
	"water",
	"wave",
	"nature",
	"tsunami",
	"disaster"
],
	"🎃": [
	"jack_o_lantern",
	"halloween",
	"light",
	"pumpkin",
	"creepy",
	"fall"
],
	"🎄": [
	"christmas_tree",
	"festival",
	"vacation",
	"december",
	"xmas",
	"celebration"
],
	"🎆": [
	"fireworks",
	"photo",
	"festival",
	"carnival",
	"congratulations"
],
	"🎇": [
	"sparkler",
	"stars",
	"night",
	"shine"
],
	"🧨": [
	"firecracker",
	"dynamite",
	"boom",
	"explode",
	"explosion",
	"explosive"
],
	"✨": [
	"sparkles",
	"stars",
	"shine",
	"shiny",
	"cool",
	"awesome",
	"good",
	"magic"
],
	"🎈": [
	"balloon",
	"party",
	"celebration",
	"birthday",
	"circus"
],
	"🎉": [
	"party_popper",
	"party",
	"congratulations",
	"birthday",
	"magic",
	"circus",
	"celebration",
	"tada"
],
	"🎊": [
	"confetti_ball",
	"festival",
	"party",
	"birthday",
	"circus"
],
	"🎋": [
	"tanabata_tree",
	"plant",
	"nature",
	"branch",
	"summer",
	"bamboo",
	"wish",
	"star_festival",
	"tanzaku"
],
	"🎍": [
	"pine_decoration",
	"japanese",
	"plant",
	"nature",
	"vegetable",
	"panda",
	"new_years",
	"bamboo"
],
	"🎎": [
	"japanese_dolls",
	"japanese",
	"toy",
	"kimono"
],
	"🎏": [
	"carp_streamer",
	"fish",
	"japanese",
	"koinobori",
	"carp",
	"banner"
],
	"🎐": [
	"wind_chime",
	"nature",
	"ding",
	"spring",
	"bell"
],
	"🎑": [
	"moon_viewing_ceremony",
	"photo",
	"japan",
	"asia",
	"tsukimi"
],
	"🧧": [
	"red_envelope",
	"gift"
],
	"🎀": [
	"ribbon",
	"decoration",
	"pink",
	"girl",
	"bowtie"
],
	"🎁": [
	"wrapped_gift",
	"present",
	"birthday",
	"christmas",
	"xmas"
],
	"🎗️": [
	"reminder_ribbon",
	"sports",
	"cause",
	"support",
	"awareness"
],
	"🎟️": [
	"admission_tickets",
	"sports",
	"concert",
	"entrance"
],
	"🎫": [
	"ticket",
	"event",
	"concert",
	"pass"
],
	"🎖️": [
	"military_medal",
	"award",
	"winning",
	"army"
],
	"🏆": [
	"trophy",
	"win",
	"award",
	"contest",
	"place",
	"ftw",
	"ceremony"
],
	"🏅": [
	"sports_medal",
	"award",
	"winning"
],
	"🥇": [
	"1st_place_medal",
	"award",
	"winning",
	"first"
],
	"🥈": [
	"2nd_place_medal",
	"award",
	"second"
],
	"🥉": [
	"3rd_place_medal",
	"award",
	"third"
],
	"⚽": [
	"soccer_ball",
	"sports",
	"football"
],
	"⚾": [
	"baseball",
	"sports",
	"balls"
],
	"🥎": [
	"softball",
	"sports",
	"balls"
],
	"🏀": [
	"basketball",
	"sports",
	"balls",
	"NBA"
],
	"🏐": [
	"volleyball",
	"sports",
	"balls"
],
	"🏈": [
	"american_football",
	"sports",
	"balls",
	"NFL"
],
	"🏉": [
	"rugby_football",
	"sports",
	"team"
],
	"🎾": [
	"tennis",
	"sports",
	"balls",
	"green"
],
	"🥏": [
	"flying_disc",
	"sports",
	"frisbee",
	"ultimate"
],
	"🎳": [
	"bowling",
	"sports",
	"fun",
	"play"
],
	"🏏": [
	"cricket_game",
	"sports"
],
	"🏑": [
	"field_hockey",
	"sports"
],
	"🏒": [
	"ice_hockey",
	"sports"
],
	"🥍": [
	"lacrosse",
	"sports",
	"ball",
	"stick"
],
	"🏓": [
	"ping_pong",
	"sports",
	"pingpong"
],
	"🏸": [
	"badminton",
	"sports"
],
	"🥊": [
	"boxing_glove",
	"sports",
	"fighting"
],
	"🥋": [
	"martial_arts_uniform",
	"judo",
	"karate",
	"taekwondo"
],
	"🥅": [
	"goal_net",
	"sports"
],
	"⛳": [
	"flag_in_hole",
	"sports",
	"business",
	"flag",
	"hole",
	"summer"
],
	"⛸️": [
	"ice_skate",
	"sports"
],
	"🎣": [
	"fishing_pole",
	"food",
	"hobby",
	"summer"
],
	"🤿": [
	"diving_mask",
	"sport",
	"ocean"
],
	"🎽": [
	"running_shirt",
	"play",
	"pageant"
],
	"🎿": [
	"skis",
	"sports",
	"winter",
	"cold",
	"snow"
],
	"🛷": [
	"sled",
	"sleigh",
	"luge",
	"toboggan"
],
	"🥌": [
	"curling_stone",
	"sports"
],
	"🎯": [
	"direct_hit",
	"game",
	"play",
	"bar",
	"target",
	"bullseye"
],
	"🪀": [
	"yo_yo",
	"toy"
],
	"🪁": [
	"kite",
	"wind",
	"fly"
],
	"🎱": [
	"pool_8_ball",
	"pool",
	"hobby",
	"game",
	"luck",
	"magic"
],
	"🔮": [
	"crystal_ball",
	"disco",
	"party",
	"magic",
	"circus",
	"fortune_teller"
],
	"🧿": [
	"nazar_amulet",
	"bead",
	"charm"
],
	"🎮": [
	"video_game",
	"play",
	"console",
	"PS4",
	"controller"
],
	"🕹️": [
	"joystick",
	"game",
	"play"
],
	"🎰": [
	"slot_machine",
	"bet",
	"gamble",
	"vegas",
	"fruit machine",
	"luck",
	"casino"
],
	"🎲": [
	"game_die",
	"dice",
	"random",
	"tabletop",
	"play",
	"luck"
],
	"🧩": [
	"puzzle_piece",
	"interlocking",
	"puzzle",
	"piece"
],
	"🧸": [
	"teddy_bear",
	"plush",
	"stuffed"
],
	"♠️": [
	"spade_suit",
	"poker",
	"cards",
	"suits",
	"magic"
],
	"♥️": [
	"heart_suit",
	"poker",
	"cards",
	"magic",
	"suits"
],
	"♦️": [
	"diamond_suit",
	"poker",
	"cards",
	"magic",
	"suits"
],
	"♣️": [
	"club_suit",
	"poker",
	"cards",
	"magic",
	"suits"
],
	"♟️": [
	"chess_pawn",
	"expendable"
],
	"🃏": [
	"joker",
	"poker",
	"cards",
	"game",
	"play",
	"magic"
],
	"🀄": [
	"mahjong_red_dragon",
	"game",
	"play",
	"chinese",
	"kanji"
],
	"🎴": [
	"flower_playing_cards",
	"game",
	"sunset",
	"red"
],
	"🎭": [
	"performing_arts",
	"acting",
	"theater",
	"drama"
],
	"🖼️": [
	"framed_picture",
	"photography"
],
	"🎨": [
	"artist_palette",
	"design",
	"paint",
	"draw",
	"colors"
],
	"🧵": [
	"thread",
	"needle",
	"sewing",
	"spool",
	"string"
],
	"🧶": [
	"yarn",
	"ball",
	"crochet",
	"knit"
],
	"👓": [
	"glasses",
	"fashion",
	"accessories",
	"eyesight",
	"nerdy",
	"dork",
	"geek"
],
	"🕶️": [
	"sunglasses",
	"face",
	"cool",
	"accessories"
],
	"🥽": [
	"goggles",
	"eyes",
	"protection",
	"safety"
],
	"🥼": [
	"lab_coat",
	"doctor",
	"experiment",
	"scientist",
	"chemist"
],
	"🦺": [
	"safety_vest",
	"protection"
],
	"👔": [
	"necktie",
	"shirt",
	"suitup",
	"formal",
	"fashion",
	"cloth",
	"business"
],
	"👕": [
	"t_shirt",
	"fashion",
	"cloth",
	"casual",
	"shirt",
	"tee"
],
	"👖": [
	"jeans",
	"fashion",
	"shopping"
],
	"🧣": [
	"scarf",
	"neck",
	"winter",
	"clothes"
],
	"🧤": [
	"gloves",
	"hands",
	"winter",
	"clothes"
],
	"🧥": [
	"coat",
	"jacket"
],
	"🧦": [
	"socks",
	"stockings",
	"clothes"
],
	"👗": [
	"dress",
	"clothes",
	"fashion",
	"shopping"
],
	"👘": [
	"kimono",
	"dress",
	"fashion",
	"women",
	"female",
	"japanese"
],
	"🥻": [
	"sari",
	"dress"
],
	"🩱": [
	"one_piece_swimsuit",
	"fashion"
],
	"🩲": [
	"briefs",
	"clothing"
],
	"🩳": [
	"shorts",
	"clothing"
],
	"👙": [
	"bikini",
	"swimming",
	"female",
	"woman",
	"girl",
	"fashion",
	"beach",
	"summer"
],
	"👚": [
	"woman_s_clothes",
	"fashion",
	"shopping_bags",
	"female"
],
	"👛": [
	"purse",
	"fashion",
	"accessories",
	"money",
	"sales",
	"shopping"
],
	"👜": [
	"handbag",
	"fashion",
	"accessory",
	"accessories",
	"shopping"
],
	"👝": [
	"clutch_bag",
	"bag",
	"accessories",
	"shopping"
],
	"🛍️": [
	"shopping_bags",
	"mall",
	"buy",
	"purchase"
],
	"🎒": [
	"backpack",
	"student",
	"education",
	"bag",
	"backpack"
],
	"👞": [
	"man_s_shoe",
	"fashion",
	"male"
],
	"👟": [
	"running_shoe",
	"shoes",
	"sports",
	"sneakers"
],
	"🥾": [
	"hiking_boot",
	"backpacking",
	"camping",
	"hiking"
],
	"🥿": [
	"flat_shoe",
	"ballet",
	"slip-on",
	"slipper"
],
	"👠": [
	"high_heeled_shoe",
	"fashion",
	"shoes",
	"female",
	"pumps",
	"stiletto"
],
	"👡": [
	"woman_s_sandal",
	"shoes",
	"fashion",
	"flip flops"
],
	"🩰": [
	"ballet_shoes",
	"dance"
],
	"👢": [
	"woman_s_boot",
	"shoes",
	"fashion"
],
	"👑": [
	"crown",
	"king",
	"kod",
	"leader",
	"royalty",
	"lord"
],
	"👒": [
	"woman_s_hat",
	"fashion",
	"accessories",
	"female",
	"lady",
	"spring"
],
	"🎩": [
	"top_hat",
	"magic",
	"gentleman",
	"classy",
	"circus"
],
	"🎓": [
	"graduation_cap",
	"school",
	"college",
	"degree",
	"university",
	"graduation",
	"cap",
	"hat",
	"legal",
	"learn",
	"education"
],
	"🧢": [
	"billed_cap",
	"cap",
	"baseball"
],
	"⛑️": [
	"rescue_worker_s_helmet",
	"construction",
	"build"
],
	"📿": [
	"prayer_beads",
	"dhikr",
	"religious"
],
	"💄": [
	"lipstick",
	"female",
	"girl",
	"fashion",
	"woman"
],
	"💍": [
	"ring",
	"wedding",
	"propose",
	"marriage",
	"valentines",
	"diamond",
	"fashion",
	"jewelry",
	"gem",
	"engagement"
],
	"💎": [
	"gem_stone",
	"blue",
	"ruby",
	"diamond",
	"jewelry"
],
	"🔇": [
	"muted_speaker",
	"sound",
	"volume",
	"silence",
	"quiet"
],
	"🔈": [
	"speaker_low_volume",
	"sound",
	"volume",
	"silence",
	"broadcast"
],
	"🔉": [
	"speaker_medium_volume",
	"volume",
	"speaker",
	"broadcast"
],
	"🔊": [
	"speaker_high_volume",
	"volume",
	"noise",
	"noisy",
	"speaker",
	"broadcast"
],
	"📢": [
	"loudspeaker",
	"volume",
	"sound"
],
	"📣": [
	"megaphone",
	"sound",
	"speaker",
	"volume"
],
	"📯": [
	"postal_horn",
	"instrument",
	"music"
],
	"🔔": [
	"bell",
	"sound",
	"notification",
	"christmas",
	"xmas",
	"chime"
],
	"🔕": [
	"bell_with_slash",
	"sound",
	"volume",
	"mute",
	"quiet",
	"silent"
],
	"🎼": [
	"musical_score",
	"treble",
	"clef",
	"compose"
],
	"🎵": [
	"musical_note",
	"score",
	"tone",
	"sound"
],
	"🎶": [
	"musical_notes",
	"music",
	"score"
],
	"🎙️": [
	"studio_microphone",
	"sing",
	"recording",
	"artist",
	"talkshow"
],
	"🎚️": [
	"level_slider",
	"scale"
],
	"🎛️": [
	"control_knobs",
	"dial"
],
	"🎤": [
	"microphone",
	"sound",
	"music",
	"PA",
	"sing",
	"talkshow"
],
	"🎧": [
	"headphone",
	"music",
	"score",
	"gadgets"
],
	"📻": [
	"radio",
	"communication",
	"music",
	"podcast",
	"program"
],
	"🎷": [
	"saxophone",
	"music",
	"instrument",
	"jazz",
	"blues"
],
	"🎸": [
	"guitar",
	"music",
	"instrument"
],
	"🎹": [
	"musical_keyboard",
	"piano",
	"instrument",
	"compose"
],
	"🎺": [
	"trumpet",
	"music",
	"brass"
],
	"🎻": [
	"violin",
	"music",
	"instrument",
	"orchestra",
	"symphony"
],
	"🪕": [
	"banjo",
	"music",
	"instructment"
],
	"🥁": [
	"drum",
	"music",
	"instrument",
	"drumsticks",
	"snare"
],
	"📱": [
	"mobile_phone",
	"technology",
	"apple",
	"gadgets",
	"dial"
],
	"📲": [
	"mobile_phone_with_arrow",
	"iphone",
	"incoming"
],
	"☎️": [
	"telephone",
	"technology",
	"communication",
	"dial",
	"telephone"
],
	"📞": [
	"telephone_receiver",
	"technology",
	"communication",
	"dial"
],
	"📟": [
	"pager",
	"bbcall",
	"oldschool",
	"90s"
],
	"📠": [
	"fax_machine",
	"communication",
	"technology"
],
	"🔋": [
	"battery",
	"power",
	"energy",
	"sustain"
],
	"🔌": [
	"electric_plug",
	"charger",
	"power"
],
	"💻": [
	"laptop",
	"technology",
	"laptop",
	"screen",
	"display",
	"monitor"
],
	"🖥️": [
	"desktop_computer",
	"technology",
	"computing",
	"screen"
],
	"🖨️": [
	"printer",
	"paper",
	"ink"
],
	"⌨️": [
	"keyboard",
	"technology",
	"computer",
	"type",
	"input",
	"text"
],
	"🖱️": [
	"computer_mouse",
	"click"
],
	"🖲️": [
	"trackball",
	"technology",
	"trackpad"
],
	"💽": [
	"computer_disk",
	"technology",
	"record",
	"data",
	"disk",
	"90s"
],
	"💾": [
	"floppy_disk",
	"oldschool",
	"technology",
	"save",
	"90s",
	"80s"
],
	"💿": [
	"optical_disk",
	"technology",
	"dvd",
	"disk",
	"disc",
	"90s"
],
	"📀": [
	"dvd",
	"cd",
	"disk",
	"disc"
],
	"🧮": [
	"abacus",
	"calculation"
],
	"🎥": [
	"movie_camera",
	"film",
	"record"
],
	"🎞️": [
	"film_frames",
	"movie"
],
	"📽️": [
	"film_projector",
	"video",
	"tape",
	"record",
	"movie"
],
	"🎬": [
	"clapper_board",
	"movie",
	"film",
	"record"
],
	"📺": [
	"television",
	"technology",
	"program",
	"oldschool",
	"show",
	"television"
],
	"📷": [
	"camera",
	"gadgets",
	"photography"
],
	"📸": [
	"camera_with_flash",
	"photography",
	"gadgets"
],
	"📹": [
	"video_camera",
	"film",
	"record"
],
	"📼": [
	"videocassette",
	"record",
	"video",
	"oldschool",
	"90s",
	"80s"
],
	"🔍": [
	"magnifying_glass_tilted_left",
	"search",
	"zoom",
	"find",
	"detective"
],
	"🔎": [
	"magnifying_glass_tilted_right",
	"search",
	"zoom",
	"find",
	"detective"
],
	"🕯️": [
	"candle",
	"fire",
	"wax"
],
	"💡": [
	"light_bulb",
	"light",
	"electricity",
	"idea"
],
	"🔦": [
	"flashlight",
	"dark",
	"camping",
	"sight",
	"night"
],
	"🏮": [
	"red_paper_lantern",
	"light",
	"paper",
	"halloween",
	"spooky"
],
	"🪔": [
	"diya_lamp",
	"lighting"
],
	"📔": [
	"notebook_with_decorative_cover",
	"classroom",
	"notes",
	"record",
	"paper",
	"study"
],
	"📕": [
	"closed_book",
	"read",
	"library",
	"knowledge",
	"textbook",
	"learn"
],
	"📖": [
	"open_book",
	"book",
	"read",
	"library",
	"knowledge",
	"literature",
	"learn",
	"study"
],
	"📗": [
	"green_book",
	"read",
	"library",
	"knowledge",
	"study"
],
	"📘": [
	"blue_book",
	"read",
	"library",
	"knowledge",
	"learn",
	"study"
],
	"📙": [
	"orange_book",
	"read",
	"library",
	"knowledge",
	"textbook",
	"study"
],
	"📚": [
	"books",
	"literature",
	"library",
	"study"
],
	"📓": [
	"notebook",
	"stationery",
	"record",
	"notes",
	"paper",
	"study"
],
	"📒": [
	"ledger",
	"notes",
	"paper"
],
	"📃": [
	"page_with_curl",
	"documents",
	"office",
	"paper"
],
	"📜": [
	"scroll",
	"documents",
	"ancient",
	"history",
	"paper"
],
	"📄": [
	"page_facing_up",
	"documents",
	"office",
	"paper",
	"information"
],
	"📰": [
	"newspaper",
	"press",
	"headline"
],
	"🗞️": [
	"rolled_up_newspaper",
	"press",
	"headline"
],
	"📑": [
	"bookmark_tabs",
	"favorite",
	"save",
	"order",
	"tidy"
],
	"🔖": [
	"bookmark",
	"favorite",
	"label",
	"save"
],
	"🏷️": [
	"label",
	"sale",
	"tag"
],
	"💰": [
	"money_bag",
	"dollar",
	"payment",
	"coins",
	"sale"
],
	"💴": [
	"yen_banknote",
	"money",
	"sales",
	"japanese",
	"dollar",
	"currency"
],
	"💵": [
	"dollar_banknote",
	"money",
	"sales",
	"bill",
	"currency"
],
	"💶": [
	"euro_banknote",
	"money",
	"sales",
	"dollar",
	"currency"
],
	"💷": [
	"pound_banknote",
	"british",
	"sterling",
	"money",
	"sales",
	"bills",
	"uk",
	"england",
	"currency"
],
	"💸": [
	"money_with_wings",
	"dollar",
	"bills",
	"payment",
	"sale"
],
	"💳": [
	"credit_card",
	"money",
	"sales",
	"dollar",
	"bill",
	"payment",
	"shopping"
],
	"🧾": [
	"receipt",
	"accounting",
	"expenses"
],
	"💹": [
	"chart_increasing_with_yen",
	"green-square",
	"graph",
	"presentation",
	"stats"
],
	"💱": [
	"currency_exchange",
	"money",
	"sales",
	"dollar",
	"travel"
],
	"💲": [
	"heavy_dollar_sign",
	"money",
	"sales",
	"payment",
	"currency",
	"buck"
],
	"✉️": [
	"envelope",
	"letter",
	"postal",
	"inbox",
	"communication"
],
	"📧": [
	"e_mail",
	"communication",
	"inbox"
],
	"📨": [
	"incoming_envelope",
	"email",
	"inbox"
],
	"📩": [
	"envelope_with_arrow",
	"email",
	"communication"
],
	"📤": [
	"outbox_tray",
	"inbox",
	"email"
],
	"📥": [
	"inbox_tray",
	"email",
	"documents"
],
	"📦": [
	"package",
	"mail",
	"gift",
	"cardboard",
	"box",
	"moving"
],
	"📫": [
	"closed_mailbox_with_raised_flag",
	"email",
	"inbox",
	"communication"
],
	"📪": [
	"closed_mailbox_with_lowered_flag",
	"email",
	"communication",
	"inbox"
],
	"📬": [
	"open_mailbox_with_raised_flag",
	"email",
	"inbox",
	"communication"
],
	"📭": [
	"open_mailbox_with_lowered_flag",
	"email",
	"inbox"
],
	"📮": [
	"postbox",
	"email",
	"letter",
	"envelope"
],
	"🗳️": [
	"ballot_box_with_ballot",
	"election",
	"vote"
],
	"✏️": [
	"pencil",
	"stationery",
	"write",
	"paper",
	"writing",
	"school",
	"study"
],
	"✒️": [
	"black_nib",
	"pen",
	"stationery",
	"writing",
	"write"
],
	"🖋️": [
	"fountain_pen",
	"stationery",
	"writing",
	"write"
],
	"🖊️": [
	"pen",
	"stationery",
	"writing",
	"write"
],
	"🖌️": [
	"paintbrush",
	"drawing",
	"creativity",
	"art"
],
	"🖍️": [
	"crayon",
	"drawing",
	"creativity"
],
	"📝": [
	"memo",
	"write",
	"documents",
	"stationery",
	"pencil",
	"paper",
	"writing",
	"legal",
	"exam",
	"quiz",
	"test",
	"study",
	"compose"
],
	"💼": [
	"briefcase",
	"business",
	"documents",
	"work",
	"law",
	"legal",
	"job",
	"career"
],
	"📁": [
	"file_folder",
	"documents",
	"business",
	"office"
],
	"📂": [
	"open_file_folder",
	"documents",
	"load"
],
	"🗂️": [
	"card_index_dividers",
	"organizing",
	"business",
	"stationery"
],
	"📅": [
	"calendar",
	"calendar",
	"schedule"
],
	"📆": [
	"tear_off_calendar",
	"schedule",
	"date",
	"planning"
],
	"🗒️": [
	"spiral_notepad",
	"memo",
	"stationery"
],
	"🗓️": [
	"spiral_calendar",
	"date",
	"schedule",
	"planning"
],
	"📇": [
	"card_index",
	"business",
	"stationery"
],
	"📈": [
	"chart_increasing",
	"graph",
	"presentation",
	"stats",
	"recovery",
	"business",
	"economics",
	"money",
	"sales",
	"good",
	"success"
],
	"📉": [
	"chart_decreasing",
	"graph",
	"presentation",
	"stats",
	"recession",
	"business",
	"economics",
	"money",
	"sales",
	"bad",
	"failure"
],
	"📊": [
	"bar_chart",
	"graph",
	"presentation",
	"stats"
],
	"📋": [
	"clipboard",
	"stationery",
	"documents"
],
	"📌": [
	"pushpin",
	"stationery",
	"mark",
	"here"
],
	"📍": [
	"round_pushpin",
	"stationery",
	"location",
	"map",
	"here"
],
	"📎": [
	"paperclip",
	"documents",
	"stationery"
],
	"🖇️": [
	"linked_paperclips",
	"documents",
	"stationery"
],
	"📏": [
	"straight_ruler",
	"stationery",
	"calculate",
	"length",
	"math",
	"school",
	"drawing",
	"architect",
	"sketch"
],
	"📐": [
	"triangular_ruler",
	"stationery",
	"math",
	"architect",
	"sketch"
],
	"✂️": [
	"scissors",
	"stationery",
	"cut"
],
	"🗃️": [
	"card_file_box",
	"business",
	"stationery"
],
	"🗄️": [
	"file_cabinet",
	"filing",
	"organizing"
],
	"🗑️": [
	"wastebasket",
	"bin",
	"trash",
	"rubbish",
	"garbage",
	"toss"
],
	"🔒": [
	"locked",
	"security",
	"password",
	"padlock"
],
	"🔓": [
	"unlocked",
	"privacy",
	"security"
],
	"🔏": [
	"locked_with_pen",
	"security",
	"secret"
],
	"🔐": [
	"locked_with_key",
	"security",
	"privacy"
],
	"🔑": [
	"key",
	"lock",
	"door",
	"password"
],
	"🗝️": [
	"old_key",
	"lock",
	"door",
	"password"
],
	"🔨": [
	"hammer",
	"tools",
	"build",
	"create"
],
	"🪓": [
	"axe",
	"tool",
	"chop",
	"cut"
],
	"⛏️": [
	"pick",
	"tools",
	"dig"
],
	"⚒️": [
	"hammer_and_pick",
	"tools",
	"build",
	"create"
],
	"🛠️": [
	"hammer_and_wrench",
	"tools",
	"build",
	"create"
],
	"🗡️": [
	"dagger",
	"weapon"
],
	"⚔️": [
	"crossed_swords",
	"weapon"
],
	"🔫": [
	"pistol",
	"violence",
	"weapon",
	"pistol",
	"revolver"
],
	"🏹": [
	"bow_and_arrow",
	"sports"
],
	"🛡️": [
	"shield",
	"protection",
	"security"
],
	"🔧": [
	"wrench",
	"tools",
	"diy",
	"ikea",
	"fix",
	"maintainer"
],
	"🔩": [
	"nut_and_bolt",
	"handy",
	"tools",
	"fix"
],
	"⚙️": [
	"gear",
	"cog"
],
	"🗜️": [
	"clamp",
	"tool"
],
	"⚖️": [
	"balance_scale",
	"law",
	"fairness",
	"weight"
],
	"🦯": [
	"probing_cane",
	"accessibility"
],
	"🔗": [
	"link",
	"rings",
	"url"
],
	"⛓️": [
	"chains",
	"lock",
	"arrest"
],
	"🧰": [
	"toolbox",
	"tools",
	"diy",
	"fix",
	"maintainer",
	"mechanic"
],
	"🧲": [
	"magnet",
	"attraction",
	"magnetic"
],
	"⚗️": [
	"alembic",
	"distilling",
	"science",
	"experiment",
	"chemistry"
],
	"🧪": [
	"test_tube",
	"chemistry",
	"experiment",
	"lab",
	"science"
],
	"🧫": [
	"petri_dish",
	"bacteria",
	"biology",
	"culture",
	"lab"
],
	"🧬": [
	"dna",
	"biologist",
	"genetics",
	"life"
],
	"🔬": [
	"microscope",
	"laboratory",
	"experiment",
	"zoomin",
	"science",
	"study"
],
	"🔭": [
	"telescope",
	"stars",
	"space",
	"zoom",
	"science",
	"astronomy"
],
	"📡": [
	"satellite_antenna",
	"communication",
	"future",
	"radio",
	"space"
],
	"💉": [
	"syringe",
	"health",
	"hospital",
	"drugs",
	"blood",
	"medicine",
	"needle",
	"doctor",
	"nurse"
],
	"🩸": [
	"drop_of_blood",
	"period",
	"hurt",
	"harm",
	"wound"
],
	"💊": [
	"pill",
	"health",
	"medicine",
	"doctor",
	"pharmacy",
	"drug"
],
	"🩹": [
	"adhesive_bandage",
	"heal"
],
	"🩺": [
	"stethoscope",
	"health"
],
	"🚪": [
	"door",
	"house",
	"entry",
	"exit"
],
	"🛏️": [
	"bed",
	"sleep",
	"rest"
],
	"🛋️": [
	"couch_and_lamp",
	"read",
	"chill"
],
	"🪑": [
	"chair",
	"sit",
	"furniture"
],
	"🚽": [
	"toilet",
	"restroom",
	"wc",
	"washroom",
	"bathroom",
	"potty"
],
	"🚿": [
	"shower",
	"clean",
	"water",
	"bathroom"
],
	"🛁": [
	"bathtub",
	"clean",
	"shower",
	"bathroom"
],
	"🪒": [
	"razor",
	"cut"
],
	"🧴": [
	"lotion_bottle",
	"moisturizer",
	"sunscreen"
],
	"🧷": [
	"safety_pin",
	"diaper"
],
	"🧹": [
	"broom",
	"cleaning",
	"sweeping",
	"witch"
],
	"🧺": [
	"basket",
	"laundry"
],
	"🧻": [
	"roll_of_paper",
	"roll"
],
	"🧼": [
	"soap",
	"bar",
	"bathing",
	"cleaning",
	"lather"
],
	"🧽": [
	"sponge",
	"absorbing",
	"cleaning",
	"porous"
],
	"🧯": [
	"fire_extinguisher",
	"quench"
],
	"🛒": [
	"shopping_cart",
	"trolley"
],
	"🚬": [
	"cigarette",
	"kills",
	"tobacco",
	"cigarette",
	"joint",
	"smoke"
],
	"⚰️": [
	"coffin",
	"vampire",
	"dead",
	"die",
	"death",
	"rip",
	"graveyard",
	"cemetery",
	"casket",
	"funeral",
	"box"
],
	"⚱️": [
	"funeral_urn",
	"dead",
	"die",
	"death",
	"rip",
	"ashes"
],
	"🗿": [
	"moai",
	"rock",
	"easter island",
	"moai"
],
	"🏧": [
	"atm_sign",
	"money",
	"sales",
	"cash",
	"blue-square",
	"payment",
	"bank"
],
	"🚮": [
	"litter_in_bin_sign",
	"blue-square",
	"sign",
	"human",
	"info"
],
	"🚰": [
	"potable_water",
	"blue-square",
	"liquid",
	"restroom",
	"cleaning",
	"faucet"
],
	"♿": [
	"wheelchair_symbol",
	"blue-square",
	"disabled",
	"accessibility"
],
	"🚹": [
	"men_s_room",
	"toilet",
	"restroom",
	"wc",
	"blue-square",
	"gender",
	"male"
],
	"🚺": [
	"women_s_room",
	"purple-square",
	"woman",
	"female",
	"toilet",
	"loo",
	"restroom",
	"gender"
],
	"🚻": [
	"restroom",
	"blue-square",
	"toilet",
	"refresh",
	"wc",
	"gender"
],
	"🚼": [
	"baby_symbol",
	"orange-square",
	"child"
],
	"🚾": [
	"water_closet",
	"toilet",
	"restroom",
	"blue-square"
],
	"🛂": [
	"passport_control",
	"custom",
	"blue-square"
],
	"🛃": [
	"customs",
	"passport",
	"border",
	"blue-square"
],
	"🛄": [
	"baggage_claim",
	"blue-square",
	"airport",
	"transport"
],
	"🛅": [
	"left_luggage",
	"blue-square",
	"travel"
],
	"⚠️": [
	"warning",
	"exclamation",
	"wip",
	"alert",
	"error",
	"problem",
	"issue"
],
	"🚸": [
	"children_crossing",
	"school",
	"warning",
	"danger",
	"sign",
	"driving",
	"yellow-diamond"
],
	"⛔": [
	"no_entry",
	"limit",
	"security",
	"privacy",
	"bad",
	"denied",
	"stop",
	"circle"
],
	"🚫": [
	"prohibited",
	"forbid",
	"stop",
	"limit",
	"denied",
	"disallow",
	"circle"
],
	"🚳": [
	"no_bicycles",
	"cyclist",
	"prohibited",
	"circle"
],
	"🚭": [
	"no_smoking",
	"cigarette",
	"blue-square",
	"smell",
	"smoke"
],
	"🚯": [
	"no_littering",
	"trash",
	"bin",
	"garbage",
	"circle"
],
	"🚱": [
	"non_potable_water",
	"drink",
	"faucet",
	"tap",
	"circle"
],
	"🚷": [
	"no_pedestrians",
	"rules",
	"crossing",
	"walking",
	"circle"
],
	"📵": [
	"no_mobile_phones",
	"iphone",
	"mute",
	"circle"
],
	"🔞": [
	"no_one_under_eighteen",
	"18",
	"drink",
	"pub",
	"night",
	"minor",
	"circle"
],
	"☢️": [
	"radioactive",
	"nuclear",
	"danger"
],
	"☣️": [
	"biohazard",
	"danger"
],
	"⬆️": [
	"up_arrow",
	"blue-square",
	"continue",
	"top",
	"direction"
],
	"↗️": [
	"up_right_arrow",
	"blue-square",
	"point",
	"direction",
	"diagonal",
	"northeast"
],
	"➡️": [
	"right_arrow",
	"blue-square",
	"next"
],
	"↘️": [
	"down_right_arrow",
	"blue-square",
	"direction",
	"diagonal",
	"southeast"
],
	"⬇️": [
	"down_arrow",
	"blue-square",
	"direction",
	"bottom"
],
	"↙️": [
	"down_left_arrow",
	"blue-square",
	"direction",
	"diagonal",
	"southwest"
],
	"⬅️": [
	"left_arrow",
	"blue-square",
	"previous",
	"back"
],
	"↖️": [
	"up_left_arrow",
	"blue-square",
	"point",
	"direction",
	"diagonal",
	"northwest"
],
	"↕️": [
	"up_down_arrow",
	"blue-square",
	"direction",
	"way",
	"vertical"
],
	"↔️": [
	"left_right_arrow",
	"shape",
	"direction",
	"horizontal",
	"sideways"
],
	"↩️": [
	"right_arrow_curving_left",
	"back",
	"return",
	"blue-square",
	"undo",
	"enter"
],
	"↪️": [
	"left_arrow_curving_right",
	"blue-square",
	"return",
	"rotate",
	"direction"
],
	"⤴️": [
	"right_arrow_curving_up",
	"blue-square",
	"direction",
	"top"
],
	"⤵️": [
	"right_arrow_curving_down",
	"blue-square",
	"direction",
	"bottom"
],
	"🔃": [
	"clockwise_vertical_arrows",
	"sync",
	"cycle",
	"round",
	"repeat"
],
	"🔄": [
	"counterclockwise_arrows_button",
	"blue-square",
	"sync",
	"cycle"
],
	"🔙": [
	"back_arrow",
	"arrow",
	"words",
	"return"
],
	"🔚": [
	"end_arrow",
	"words",
	"arrow"
],
	"🔛": [
	"on_arrow",
	"arrow",
	"words"
],
	"🔜": [
	"soon_arrow",
	"arrow",
	"words"
],
	"🔝": [
	"top_arrow",
	"words",
	"blue-square"
],
	"🛐": [
	"place_of_worship",
	"religion",
	"church",
	"temple",
	"prayer"
],
	"⚛️": [
	"atom_symbol",
	"science",
	"physics",
	"chemistry"
],
	"🕉️": [
	"om",
	"hinduism",
	"buddhism",
	"sikhism",
	"jainism"
],
	"✡️": [
	"star_of_david",
	"judaism"
],
	"☸️": [
	"wheel_of_dharma",
	"hinduism",
	"buddhism",
	"sikhism",
	"jainism"
],
	"☯️": [
	"yin_yang",
	"balance"
],
	"✝️": [
	"latin_cross",
	"christianity"
],
	"☦️": [
	"orthodox_cross",
	"suppedaneum",
	"religion"
],
	"☪️": [
	"star_and_crescent",
	"islam"
],
	"☮️": [
	"peace_symbol",
	"hippie"
],
	"🕎": [
	"menorah",
	"hanukkah",
	"candles",
	"jewish"
],
	"🔯": [
	"dotted_six_pointed_star",
	"purple-square",
	"religion",
	"jewish",
	"hexagram"
],
	"♈": [
	"aries",
	"sign",
	"purple-square",
	"zodiac",
	"astrology"
],
	"♉": [
	"taurus",
	"purple-square",
	"sign",
	"zodiac",
	"astrology"
],
	"♊": [
	"gemini",
	"sign",
	"zodiac",
	"purple-square",
	"astrology"
],
	"♋": [
	"cancer",
	"sign",
	"zodiac",
	"purple-square",
	"astrology"
],
	"♌": [
	"leo",
	"sign",
	"purple-square",
	"zodiac",
	"astrology"
],
	"♍": [
	"virgo",
	"sign",
	"zodiac",
	"purple-square",
	"astrology"
],
	"♎": [
	"libra",
	"sign",
	"purple-square",
	"zodiac",
	"astrology"
],
	"♏": [
	"scorpio",
	"sign",
	"zodiac",
	"purple-square",
	"astrology",
	"scorpio"
],
	"♐": [
	"sagittarius",
	"sign",
	"zodiac",
	"purple-square",
	"astrology"
],
	"♑": [
	"capricorn",
	"sign",
	"zodiac",
	"purple-square",
	"astrology"
],
	"♒": [
	"aquarius",
	"sign",
	"purple-square",
	"zodiac",
	"astrology"
],
	"♓": [
	"pisces",
	"purple-square",
	"sign",
	"zodiac",
	"astrology"
],
	"⛎": [
	"ophiuchus",
	"sign",
	"purple-square",
	"constellation",
	"astrology"
],
	"🔀": [
	"shuffle_tracks_button",
	"blue-square",
	"shuffle",
	"music",
	"random"
],
	"🔁": [
	"repeat_button",
	"loop",
	"record"
],
	"🔂": [
	"repeat_single_button",
	"blue-square",
	"loop"
],
	"▶️": [
	"play_button",
	"blue-square",
	"right",
	"direction",
	"play"
],
	"⏩": [
	"fast_forward_button",
	"blue-square",
	"play",
	"speed",
	"continue"
],
	"⏭️": [
	"next_track_button",
	"forward",
	"next",
	"blue-square"
],
	"⏯️": [
	"play_or_pause_button",
	"blue-square",
	"play",
	"pause"
],
	"◀️": [
	"reverse_button",
	"blue-square",
	"left",
	"direction"
],
	"⏪": [
	"fast_reverse_button",
	"play",
	"blue-square"
],
	"⏮️": [
	"last_track_button",
	"backward"
],
	"🔼": [
	"upwards_button",
	"blue-square",
	"triangle",
	"direction",
	"point",
	"forward",
	"top"
],
	"⏫": [
	"fast_up_button",
	"blue-square",
	"direction",
	"top"
],
	"🔽": [
	"downwards_button",
	"blue-square",
	"direction",
	"bottom"
],
	"⏬": [
	"fast_down_button",
	"blue-square",
	"direction",
	"bottom"
],
	"⏸️": [
	"pause_button",
	"pause",
	"blue-square"
],
	"⏹️": [
	"stop_button",
	"blue-square"
],
	"⏺️": [
	"record_button",
	"blue-square"
],
	"⏏️": [
	"eject_button",
	"blue-square"
],
	"🎦": [
	"cinema",
	"blue-square",
	"record",
	"film",
	"movie",
	"curtain",
	"stage",
	"theater"
],
	"🔅": [
	"dim_button",
	"sun",
	"afternoon",
	"warm",
	"summer"
],
	"🔆": [
	"bright_button",
	"sun",
	"light"
],
	"📶": [
	"antenna_bars",
	"blue-square",
	"reception",
	"phone",
	"internet",
	"connection",
	"wifi",
	"bluetooth",
	"bars"
],
	"📳": [
	"vibration_mode",
	"orange-square",
	"phone"
],
	"📴": [
	"mobile_phone_off",
	"mute",
	"orange-square",
	"silence",
	"quiet"
],
	"♀️": [
	"female_sign",
	"woman",
	"women",
	"lady",
	"girl"
],
	"♂️": [
	"male_sign",
	"man",
	"boy",
	"men"
],
	"⚕️": [
	"medical_symbol",
	"health",
	"hospital"
],
	"♾️": [
	"infinity",
	"forever"
],
	"♻️": [
	"recycling_symbol",
	"arrow",
	"environment",
	"garbage",
	"trash"
],
	"⚜️": [
	"fleur_de_lis",
	"decorative",
	"scout"
],
	"🔱": [
	"trident_emblem",
	"weapon",
	"spear"
],
	"📛": [
	"name_badge",
	"fire",
	"forbid"
],
	"🔰": [
	"japanese_symbol_for_beginner",
	"badge",
	"shield"
],
	"⭕": [
	"hollow_red_circle",
	"circle",
	"round"
],
	"✅": [
	"check_mark_button",
	"green-square",
	"ok",
	"agree",
	"vote",
	"election",
	"answer",
	"tick"
],
	"☑️": [
	"check_box_with_check",
	"ok",
	"agree",
	"confirm",
	"black-square",
	"vote",
	"election",
	"yes",
	"tick"
],
	"✔️": [
	"check_mark",
	"ok",
	"nike",
	"answer",
	"yes",
	"tick"
],
	"✖️": [
	"multiplication_sign",
	"math",
	"calculation"
],
	"❌": [
	"cross_mark",
	"no",
	"delete",
	"remove",
	"cancel",
	"red"
],
	"❎": [
	"cross_mark_button",
	"x",
	"green-square",
	"no",
	"deny"
],
	"➕": [
	"plus_sign",
	"math",
	"calculation",
	"addition",
	"more",
	"increase"
],
	"➖": [
	"minus_sign",
	"math",
	"calculation",
	"subtract",
	"less"
],
	"➗": [
	"division_sign",
	"divide",
	"math",
	"calculation"
],
	"➰": [
	"curly_loop",
	"scribble",
	"draw",
	"shape",
	"squiggle"
],
	"➿": [
	"double_curly_loop",
	"tape",
	"cassette"
],
	"〽️": [
	"part_alternation_mark",
	"graph",
	"presentation",
	"stats",
	"business",
	"economics",
	"bad"
],
	"✳️": [
	"eight_spoked_asterisk",
	"star",
	"sparkle",
	"green-square"
],
	"✴️": [
	"eight_pointed_star",
	"orange-square",
	"shape",
	"polygon"
],
	"❇️": [
	"sparkle",
	"stars",
	"green-square",
	"awesome",
	"good",
	"fireworks"
],
	"‼️": [
	"double_exclamation_mark",
	"exclamation",
	"surprise"
],
	"⁉️": [
	"exclamation_question_mark",
	"wat",
	"punctuation",
	"surprise"
],
	"❓": [
	"question_mark",
	"doubt",
	"confused"
],
	"❔": [
	"white_question_mark",
	"doubts",
	"gray",
	"huh",
	"confused"
],
	"❕": [
	"white_exclamation_mark",
	"surprise",
	"punctuation",
	"gray",
	"wow",
	"warning"
],
	"❗": [
	"exclamation_mark",
	"heavy_exclamation_mark",
	"danger",
	"surprise",
	"punctuation",
	"wow",
	"warning"
],
	"〰️": [
	"wavy_dash",
	"draw",
	"line",
	"moustache",
	"mustache",
	"squiggle",
	"scribble"
],
	"©️": [
	"copyright",
	"ip",
	"license",
	"circle",
	"law",
	"legal"
],
	"®️": [
	"registered",
	"alphabet",
	"circle"
],
	"™️": [
	"trade_mark",
	"trademark",
	"brand",
	"law",
	"legal"
],
	"#️⃣": [
	"keycap_",
	"symbol",
	"blue-square",
	"twitter"
],
	"*️⃣": [
	"keycap_",
	"star",
	"keycap"
],
	"0️⃣": [
	"keycap_0",
	"0",
	"numbers",
	"blue-square",
	"null"
],
	"1️⃣": [
	"keycap_1",
	"blue-square",
	"numbers",
	"1"
],
	"2️⃣": [
	"keycap_2",
	"numbers",
	"2",
	"prime",
	"blue-square"
],
	"3️⃣": [
	"keycap_3",
	"3",
	"numbers",
	"prime",
	"blue-square"
],
	"4️⃣": [
	"keycap_4",
	"4",
	"numbers",
	"blue-square"
],
	"5️⃣": [
	"keycap_5",
	"5",
	"numbers",
	"blue-square",
	"prime"
],
	"6️⃣": [
	"keycap_6",
	"6",
	"numbers",
	"blue-square"
],
	"7️⃣": [
	"keycap_7",
	"7",
	"numbers",
	"blue-square",
	"prime"
],
	"8️⃣": [
	"keycap_8",
	"8",
	"blue-square",
	"numbers"
],
	"9️⃣": [
	"keycap_9",
	"blue-square",
	"numbers",
	"9"
],
	"🔟": [
	"keycap_10",
	"numbers",
	"10",
	"blue-square"
],
	"🔠": [
	"input_latin_uppercase",
	"alphabet",
	"words",
	"blue-square"
],
	"🔡": [
	"input_latin_lowercase",
	"blue-square",
	"alphabet"
],
	"🔢": [
	"input_numbers",
	"numbers",
	"blue-square",
	"1234",
	"1",
	"2",
	"3",
	"4"
],
	"🔣": [
	"input_symbols",
	"blue-square",
	"music",
	"note",
	"ampersand",
	"percent",
	"glyphs",
	"characters"
],
	"🔤": [
	"input_latin_letters",
	"blue-square",
	"alphabet"
],
	"🅰️": [
	"a_button",
	"red-square",
	"alphabet",
	"letter"
],
	"🆎": [
	"ab_button",
	"red-square",
	"alphabet"
],
	"🅱️": [
	"b_button",
	"red-square",
	"alphabet",
	"letter"
],
	"🆑": [
	"cl_button",
	"alphabet",
	"words",
	"red-square"
],
	"🆒": [
	"cool_button",
	"words",
	"blue-square"
],
	"🆓": [
	"free_button",
	"blue-square",
	"words"
],
	"ℹ️": [
	"information",
	"blue-square",
	"alphabet",
	"letter"
],
	"🆔": [
	"id_button",
	"purple-square",
	"words"
],
	"Ⓜ️": [
	"circled_m",
	"alphabet",
	"blue-circle",
	"letter"
],
	"🆕": [
	"new_button",
	"blue-square",
	"words",
	"start"
],
	"🆖": [
	"ng_button",
	"blue-square",
	"words",
	"shape",
	"icon"
],
	"🅾️": [
	"o_button",
	"alphabet",
	"red-square",
	"letter"
],
	"🆗": [
	"ok_button",
	"good",
	"agree",
	"yes",
	"blue-square"
],
	"🅿️": [
	"p_button",
	"cars",
	"blue-square",
	"alphabet",
	"letter"
],
	"🆘": [
	"sos_button",
	"help",
	"red-square",
	"words",
	"emergency",
	"911"
],
	"🆙": [
	"up_button",
	"blue-square",
	"above",
	"high"
],
	"🆚": [
	"vs_button",
	"words",
	"orange-square"
],
	"🈁": [
	"japanese_here_button",
	"blue-square",
	"here",
	"katakana",
	"japanese",
	"destination"
],
	"🈂️": [
	"japanese_service_charge_button",
	"japanese",
	"blue-square",
	"katakana"
],
	"🈷️": [
	"japanese_monthly_amount_button",
	"chinese",
	"month",
	"moon",
	"japanese",
	"orange-square",
	"kanji"
],
	"🈶": [
	"japanese_not_free_of_charge_button",
	"orange-square",
	"chinese",
	"have",
	"kanji"
],
	"🈯": [
	"japanese_reserved_button",
	"chinese",
	"point",
	"green-square",
	"kanji"
],
	"🉐": [
	"japanese_bargain_button",
	"chinese",
	"kanji",
	"obtain",
	"get",
	"circle"
],
	"🈹": [
	"japanese_discount_button",
	"cut",
	"divide",
	"chinese",
	"kanji",
	"pink-square"
],
	"🈚": [
	"japanese_free_of_charge_button",
	"nothing",
	"chinese",
	"kanji",
	"japanese",
	"orange-square"
],
	"🈲": [
	"japanese_prohibited_button",
	"kanji",
	"japanese",
	"chinese",
	"forbidden",
	"limit",
	"restricted",
	"red-square"
],
	"🉑": [
	"japanese_acceptable_button",
	"ok",
	"good",
	"chinese",
	"kanji",
	"agree",
	"yes",
	"orange-circle"
],
	"🈸": [
	"japanese_application_button",
	"chinese",
	"japanese",
	"kanji",
	"orange-square"
],
	"🈴": [
	"japanese_passing_grade_button",
	"japanese",
	"chinese",
	"join",
	"kanji",
	"red-square"
],
	"🈳": [
	"japanese_vacancy_button",
	"kanji",
	"japanese",
	"chinese",
	"empty",
	"sky",
	"blue-square"
],
	"㊗️": [
	"japanese_congratulations_button",
	"chinese",
	"kanji",
	"japanese",
	"red-circle"
],
	"㊙️": [
	"japanese_secret_button",
	"privacy",
	"chinese",
	"sshh",
	"kanji",
	"red-circle"
],
	"🈺": [
	"japanese_open_for_business_button",
	"japanese",
	"opening hours",
	"orange-square"
],
	"🈵": [
	"japanese_no_vacancy_button",
	"full",
	"chinese",
	"japanese",
	"red-square",
	"kanji"
],
	"🔴": [
	"red_circle",
	"shape",
	"error",
	"danger"
],
	"🟠": [
	"orange_circle",
	"round"
],
	"🟡": [
	"yellow_circle",
	"round"
],
	"🟢": [
	"green_circle",
	"round"
],
	"🔵": [
	"blue_circle",
	"shape",
	"icon",
	"button"
],
	"🟣": [
	"purple_circle",
	"round"
],
	"🟤": [
	"brown_circle",
	"round"
],
	"⚫": [
	"black_circle",
	"shape",
	"button",
	"round"
],
	"⚪": [
	"white_circle",
	"shape",
	"round"
],
	"🟥": [
	"red_square"
],
	"🟧": [
	"orange_square"
],
	"🟨": [
	"yellow_square"
],
	"🟩": [
	"green_square"
],
	"🟦": [
	"blue_square"
],
	"🟪": [
	"purple_square"
],
	"🟫": [
	"brown_square"
],
	"⬛": [
	"black_large_square",
	"shape",
	"icon",
	"button"
],
	"⬜": [
	"white_large_square",
	"shape",
	"icon",
	"stone",
	"button"
],
	"◼️": [
	"black_medium_square",
	"shape",
	"button",
	"icon"
],
	"◻️": [
	"white_medium_square",
	"shape",
	"stone",
	"icon"
],
	"◾": [
	"black_medium_small_square",
	"icon",
	"shape",
	"button"
],
	"◽": [
	"white_medium_small_square",
	"shape",
	"stone",
	"icon",
	"button"
],
	"▪️": [
	"black_small_square",
	"shape",
	"icon"
],
	"▫️": [
	"white_small_square",
	"shape",
	"icon"
],
	"🔶": [
	"large_orange_diamond",
	"shape",
	"jewel",
	"gem"
],
	"🔷": [
	"large_blue_diamond",
	"shape",
	"jewel",
	"gem"
],
	"🔸": [
	"small_orange_diamond",
	"shape",
	"jewel",
	"gem"
],
	"🔹": [
	"small_blue_diamond",
	"shape",
	"jewel",
	"gem"
],
	"🔺": [
	"red_triangle_pointed_up",
	"shape",
	"direction",
	"up",
	"top"
],
	"🔻": [
	"red_triangle_pointed_down",
	"shape",
	"direction",
	"bottom"
],
	"💠": [
	"diamond_with_a_dot",
	"jewel",
	"blue",
	"gem",
	"crystal",
	"fancy"
],
	"🔘": [
	"radio_button",
	"input",
	"old",
	"music",
	"circle"
],
	"🔳": [
	"white_square_button",
	"shape",
	"input"
],
	"🔲": [
	"black_square_button",
	"shape",
	"input",
	"frame"
],
	"🏁": [
	"chequered_flag",
	"contest",
	"finishline",
	"race",
	"gokart"
],
	"🚩": [
	"triangular_flag",
	"mark",
	"milestone",
	"place"
],
	"🎌": [
	"crossed_flags",
	"japanese",
	"nation",
	"country",
	"border"
],
	"🏴": [
	"black_flag",
	"pirate"
],
	"🏳️": [
	"white_flag",
	"losing",
	"loser",
	"lost",
	"surrender",
	"give up",
	"fail"
],
	"🏳️‍🌈": [
	"rainbow_flag",
	"flag",
	"rainbow",
	"pride",
	"gay",
	"lgbt",
	"glbt",
	"queer",
	"homosexual",
	"lesbian",
	"bisexual",
	"transgender"
],
	"🏴‍☠️": [
	"pirate_flag",
	"skull",
	"crossbones",
	"flag",
	"banner"
],
	"🇦🇨": [
	"flag_ascension_island"
],
	"🇦🇩": [
	"flag_andorra",
	"ad",
	"flag",
	"nation",
	"country",
	"banner",
	"andorra"
],
	"🇦🇪": [
	"flag_united_arab_emirates",
	"united",
	"arab",
	"emirates",
	"flag",
	"nation",
	"country",
	"banner",
	"united_arab_emirates"
],
	"🇦🇫": [
	"flag_afghanistan",
	"af",
	"flag",
	"nation",
	"country",
	"banner",
	"afghanistan"
],
	"🇦🇬": [
	"flag_antigua_barbuda",
	"antigua",
	"barbuda",
	"flag",
	"nation",
	"country",
	"banner",
	"antigua_barbuda"
],
	"🇦🇮": [
	"flag_anguilla",
	"ai",
	"flag",
	"nation",
	"country",
	"banner",
	"anguilla"
],
	"🇦🇱": [
	"flag_albania",
	"al",
	"flag",
	"nation",
	"country",
	"banner",
	"albania"
],
	"🇦🇲": [
	"flag_armenia",
	"am",
	"flag",
	"nation",
	"country",
	"banner",
	"armenia"
],
	"🇦🇴": [
	"flag_angola",
	"ao",
	"flag",
	"nation",
	"country",
	"banner",
	"angola"
],
	"🇦🇶": [
	"flag_antarctica",
	"aq",
	"flag",
	"nation",
	"country",
	"banner",
	"antarctica"
],
	"🇦🇷": [
	"flag_argentina",
	"ar",
	"flag",
	"nation",
	"country",
	"banner",
	"argentina"
],
	"🇦🇸": [
	"flag_american_samoa",
	"american",
	"ws",
	"flag",
	"nation",
	"country",
	"banner",
	"american_samoa"
],
	"🇦🇹": [
	"flag_austria",
	"at",
	"flag",
	"nation",
	"country",
	"banner",
	"austria"
],
	"🇦🇺": [
	"flag_australia",
	"au",
	"flag",
	"nation",
	"country",
	"banner",
	"australia"
],
	"🇦🇼": [
	"flag_aruba",
	"aw",
	"flag",
	"nation",
	"country",
	"banner",
	"aruba"
],
	"🇦🇽": [
	"flag_aland_islands",
	"Åland",
	"islands",
	"flag",
	"nation",
	"country",
	"banner",
	"aland_islands"
],
	"🇦🇿": [
	"flag_azerbaijan",
	"az",
	"flag",
	"nation",
	"country",
	"banner",
	"azerbaijan"
],
	"🇧🇦": [
	"flag_bosnia_herzegovina",
	"bosnia",
	"herzegovina",
	"flag",
	"nation",
	"country",
	"banner",
	"bosnia_herzegovina"
],
	"🇧🇧": [
	"flag_barbados",
	"bb",
	"flag",
	"nation",
	"country",
	"banner",
	"barbados"
],
	"🇧🇩": [
	"flag_bangladesh",
	"bd",
	"flag",
	"nation",
	"country",
	"banner",
	"bangladesh"
],
	"🇧🇪": [
	"flag_belgium",
	"be",
	"flag",
	"nation",
	"country",
	"banner",
	"belgium"
],
	"🇧🇫": [
	"flag_burkina_faso",
	"burkina",
	"faso",
	"flag",
	"nation",
	"country",
	"banner",
	"burkina_faso"
],
	"🇧🇬": [
	"flag_bulgaria",
	"bg",
	"flag",
	"nation",
	"country",
	"banner",
	"bulgaria"
],
	"🇧🇭": [
	"flag_bahrain",
	"bh",
	"flag",
	"nation",
	"country",
	"banner",
	"bahrain"
],
	"🇧🇮": [
	"flag_burundi",
	"bi",
	"flag",
	"nation",
	"country",
	"banner",
	"burundi"
],
	"🇧🇯": [
	"flag_benin",
	"bj",
	"flag",
	"nation",
	"country",
	"banner",
	"benin"
],
	"🇧🇱": [
	"flag_st_barthelemy",
	"saint",
	"barthélemy",
	"flag",
	"nation",
	"country",
	"banner",
	"st_barthelemy"
],
	"🇧🇲": [
	"flag_bermuda",
	"bm",
	"flag",
	"nation",
	"country",
	"banner",
	"bermuda"
],
	"🇧🇳": [
	"flag_brunei",
	"bn",
	"darussalam",
	"flag",
	"nation",
	"country",
	"banner",
	"brunei"
],
	"🇧🇴": [
	"flag_bolivia",
	"bo",
	"flag",
	"nation",
	"country",
	"banner",
	"bolivia"
],
	"🇧🇶": [
	"flag_caribbean_netherlands",
	"bonaire",
	"flag",
	"nation",
	"country",
	"banner",
	"caribbean_netherlands"
],
	"🇧🇷": [
	"flag_brazil",
	"br",
	"flag",
	"nation",
	"country",
	"banner",
	"brazil"
],
	"🇧🇸": [
	"flag_bahamas",
	"bs",
	"flag",
	"nation",
	"country",
	"banner",
	"bahamas"
],
	"🇧🇹": [
	"flag_bhutan",
	"bt",
	"flag",
	"nation",
	"country",
	"banner",
	"bhutan"
],
	"🇧🇻": [
	"flag_bouvet_island",
	"norway"
],
	"🇧🇼": [
	"flag_botswana",
	"bw",
	"flag",
	"nation",
	"country",
	"banner",
	"botswana"
],
	"🇧🇾": [
	"flag_belarus",
	"by",
	"flag",
	"nation",
	"country",
	"banner",
	"belarus"
],
	"🇧🇿": [
	"flag_belize",
	"bz",
	"flag",
	"nation",
	"country",
	"banner",
	"belize"
],
	"🇨🇦": [
	"flag_canada",
	"ca",
	"flag",
	"nation",
	"country",
	"banner",
	"canada"
],
	"🇨🇨": [
	"flag_cocos_islands",
	"cocos",
	"keeling",
	"islands",
	"flag",
	"nation",
	"country",
	"banner",
	"cocos_islands"
],
	"🇨🇩": [
	"flag_congo_kinshasa",
	"congo",
	"democratic",
	"republic",
	"flag",
	"nation",
	"country",
	"banner",
	"congo_kinshasa"
],
	"🇨🇫": [
	"flag_central_african_republic",
	"central",
	"african",
	"republic",
	"flag",
	"nation",
	"country",
	"banner",
	"central_african_republic"
],
	"🇨🇬": [
	"flag_congo_brazzaville",
	"congo",
	"flag",
	"nation",
	"country",
	"banner",
	"congo_brazzaville"
],
	"🇨🇭": [
	"flag_switzerland",
	"ch",
	"flag",
	"nation",
	"country",
	"banner",
	"switzerland"
],
	"🇨🇮": [
	"flag_cote_d_ivoire",
	"ivory",
	"coast",
	"flag",
	"nation",
	"country",
	"banner",
	"cote_d_ivoire"
],
	"🇨🇰": [
	"flag_cook_islands",
	"cook",
	"islands",
	"flag",
	"nation",
	"country",
	"banner",
	"cook_islands"
],
	"🇨🇱": [
	"flag_chile",
	"flag",
	"nation",
	"country",
	"banner",
	"chile"
],
	"🇨🇲": [
	"flag_cameroon",
	"cm",
	"flag",
	"nation",
	"country",
	"banner",
	"cameroon"
],
	"🇨🇳": [
	"flag_china",
	"china",
	"chinese",
	"prc",
	"flag",
	"country",
	"nation",
	"banner",
	"china"
],
	"🇨🇴": [
	"flag_colombia",
	"co",
	"flag",
	"nation",
	"country",
	"banner",
	"colombia"
],
	"🇨🇵": [
	"flag_clipperton_island"
],
	"🇨🇷": [
	"flag_costa_rica",
	"costa",
	"rica",
	"flag",
	"nation",
	"country",
	"banner",
	"costa_rica"
],
	"🇨🇺": [
	"flag_cuba",
	"cu",
	"flag",
	"nation",
	"country",
	"banner",
	"cuba"
],
	"🇨🇻": [
	"flag_cape_verde",
	"cabo",
	"verde",
	"flag",
	"nation",
	"country",
	"banner",
	"cape_verde"
],
	"🇨🇼": [
	"flag_curacao",
	"curaçao",
	"flag",
	"nation",
	"country",
	"banner",
	"curacao"
],
	"🇨🇽": [
	"flag_christmas_island",
	"christmas",
	"island",
	"flag",
	"nation",
	"country",
	"banner",
	"christmas_island"
],
	"🇨🇾": [
	"flag_cyprus",
	"cy",
	"flag",
	"nation",
	"country",
	"banner",
	"cyprus"
],
	"🇨🇿": [
	"flag_czechia",
	"cz",
	"flag",
	"nation",
	"country",
	"banner",
	"czechia"
],
	"🇩🇪": [
	"flag_germany",
	"german",
	"nation",
	"flag",
	"country",
	"banner",
	"germany"
],
	"🇩🇬": [
	"flag_diego_garcia"
],
	"🇩🇯": [
	"flag_djibouti",
	"dj",
	"flag",
	"nation",
	"country",
	"banner",
	"djibouti"
],
	"🇩🇰": [
	"flag_denmark",
	"dk",
	"flag",
	"nation",
	"country",
	"banner",
	"denmark"
],
	"🇩🇲": [
	"flag_dominica",
	"dm",
	"flag",
	"nation",
	"country",
	"banner",
	"dominica"
],
	"🇩🇴": [
	"flag_dominican_republic",
	"dominican",
	"republic",
	"flag",
	"nation",
	"country",
	"banner",
	"dominican_republic"
],
	"🇩🇿": [
	"flag_algeria",
	"dz",
	"flag",
	"nation",
	"country",
	"banner",
	"algeria"
],
	"🇪🇦": [
	"flag_ceuta_melilla"
],
	"🇪🇨": [
	"flag_ecuador",
	"ec",
	"flag",
	"nation",
	"country",
	"banner",
	"ecuador"
],
	"🇪🇪": [
	"flag_estonia",
	"ee",
	"flag",
	"nation",
	"country",
	"banner",
	"estonia"
],
	"🇪🇬": [
	"flag_egypt",
	"eg",
	"flag",
	"nation",
	"country",
	"banner",
	"egypt"
],
	"🇪🇭": [
	"flag_western_sahara",
	"western",
	"sahara",
	"flag",
	"nation",
	"country",
	"banner",
	"western_sahara"
],
	"🇪🇷": [
	"flag_eritrea",
	"er",
	"flag",
	"nation",
	"country",
	"banner",
	"eritrea"
],
	"🇪🇸": [
	"flag_spain",
	"spain",
	"flag",
	"nation",
	"country",
	"banner",
	"spain"
],
	"🇪🇹": [
	"flag_ethiopia",
	"et",
	"flag",
	"nation",
	"country",
	"banner",
	"ethiopia"
],
	"🇪🇺": [
	"flag_european_union",
	"european",
	"union",
	"flag",
	"banner"
],
	"🇫🇮": [
	"flag_finland",
	"fi",
	"flag",
	"nation",
	"country",
	"banner",
	"finland"
],
	"🇫🇯": [
	"flag_fiji",
	"fj",
	"flag",
	"nation",
	"country",
	"banner",
	"fiji"
],
	"🇫🇰": [
	"flag_falkland_islands",
	"falkland",
	"islands",
	"malvinas",
	"flag",
	"nation",
	"country",
	"banner",
	"falkland_islands"
],
	"🇫🇲": [
	"flag_micronesia",
	"micronesia",
	"federated",
	"states",
	"flag",
	"nation",
	"country",
	"banner",
	"micronesia"
],
	"🇫🇴": [
	"flag_faroe_islands",
	"faroe",
	"islands",
	"flag",
	"nation",
	"country",
	"banner",
	"faroe_islands"
],
	"🇫🇷": [
	"flag_france",
	"banner",
	"flag",
	"nation",
	"france",
	"french",
	"country",
	"france"
],
	"🇬🇦": [
	"flag_gabon",
	"ga",
	"flag",
	"nation",
	"country",
	"banner",
	"gabon"
],
	"🇬🇧": [
	"flag_united_kingdom",
	"united",
	"kingdom",
	"great",
	"britain",
	"northern",
	"ireland",
	"flag",
	"nation",
	"country",
	"banner",
	"british",
	"UK",
	"english",
	"england",
	"union jack",
	"united_kingdom"
],
	"🇬🇩": [
	"flag_grenada",
	"gd",
	"flag",
	"nation",
	"country",
	"banner",
	"grenada"
],
	"🇬🇪": [
	"flag_georgia",
	"ge",
	"flag",
	"nation",
	"country",
	"banner",
	"georgia"
],
	"🇬🇫": [
	"flag_french_guiana",
	"french",
	"guiana",
	"flag",
	"nation",
	"country",
	"banner",
	"french_guiana"
],
	"🇬🇬": [
	"flag_guernsey",
	"gg",
	"flag",
	"nation",
	"country",
	"banner",
	"guernsey"
],
	"🇬🇭": [
	"flag_ghana",
	"gh",
	"flag",
	"nation",
	"country",
	"banner",
	"ghana"
],
	"🇬🇮": [
	"flag_gibraltar",
	"gi",
	"flag",
	"nation",
	"country",
	"banner",
	"gibraltar"
],
	"🇬🇱": [
	"flag_greenland",
	"gl",
	"flag",
	"nation",
	"country",
	"banner",
	"greenland"
],
	"🇬🇲": [
	"flag_gambia",
	"gm",
	"flag",
	"nation",
	"country",
	"banner",
	"gambia"
],
	"🇬🇳": [
	"flag_guinea",
	"gn",
	"flag",
	"nation",
	"country",
	"banner",
	"guinea"
],
	"🇬🇵": [
	"flag_guadeloupe",
	"gp",
	"flag",
	"nation",
	"country",
	"banner",
	"guadeloupe"
],
	"🇬🇶": [
	"flag_equatorial_guinea",
	"equatorial",
	"gn",
	"flag",
	"nation",
	"country",
	"banner",
	"equatorial_guinea"
],
	"🇬🇷": [
	"flag_greece",
	"gr",
	"flag",
	"nation",
	"country",
	"banner",
	"greece"
],
	"🇬🇸": [
	"flag_south_georgia_south_sandwich_islands",
	"south",
	"georgia",
	"sandwich",
	"islands",
	"flag",
	"nation",
	"country",
	"banner",
	"south_georgia_south_sandwich_islands"
],
	"🇬🇹": [
	"flag_guatemala",
	"gt",
	"flag",
	"nation",
	"country",
	"banner",
	"guatemala"
],
	"🇬🇺": [
	"flag_guam",
	"gu",
	"flag",
	"nation",
	"country",
	"banner",
	"guam"
],
	"🇬🇼": [
	"flag_guinea_bissau",
	"gw",
	"bissau",
	"flag",
	"nation",
	"country",
	"banner",
	"guinea_bissau"
],
	"🇬🇾": [
	"flag_guyana",
	"gy",
	"flag",
	"nation",
	"country",
	"banner",
	"guyana"
],
	"🇭🇰": [
	"flag_hong_kong_sar_china",
	"hong",
	"kong",
	"flag",
	"nation",
	"country",
	"banner",
	"hong_kong_sar_china"
],
	"🇭🇲": [
	"flag_heard_mcdonald_islands"
],
	"🇭🇳": [
	"flag_honduras",
	"hn",
	"flag",
	"nation",
	"country",
	"banner",
	"honduras"
],
	"🇭🇷": [
	"flag_croatia",
	"hr",
	"flag",
	"nation",
	"country",
	"banner",
	"croatia"
],
	"🇭🇹": [
	"flag_haiti",
	"ht",
	"flag",
	"nation",
	"country",
	"banner",
	"haiti"
],
	"🇭🇺": [
	"flag_hungary",
	"hu",
	"flag",
	"nation",
	"country",
	"banner",
	"hungary"
],
	"🇮🇨": [
	"flag_canary_islands",
	"canary",
	"islands",
	"flag",
	"nation",
	"country",
	"banner",
	"canary_islands"
],
	"🇮🇩": [
	"flag_indonesia",
	"flag",
	"nation",
	"country",
	"banner",
	"indonesia"
],
	"🇮🇪": [
	"flag_ireland",
	"ie",
	"flag",
	"nation",
	"country",
	"banner",
	"ireland"
],
	"🇮🇱": [
	"flag_israel",
	"il",
	"flag",
	"nation",
	"country",
	"banner",
	"israel"
],
	"🇮🇲": [
	"flag_isle_of_man",
	"isle",
	"man",
	"flag",
	"nation",
	"country",
	"banner",
	"isle_of_man"
],
	"🇮🇳": [
	"flag_india",
	"in",
	"flag",
	"nation",
	"country",
	"banner",
	"india"
],
	"🇮🇴": [
	"flag_british_indian_ocean_territory",
	"british",
	"indian",
	"ocean",
	"territory",
	"flag",
	"nation",
	"country",
	"banner",
	"british_indian_ocean_territory"
],
	"🇮🇶": [
	"flag_iraq",
	"iq",
	"flag",
	"nation",
	"country",
	"banner",
	"iraq"
],
	"🇮🇷": [
	"flag_iran",
	"iran",
	"islamic",
	"republic",
	"flag",
	"nation",
	"country",
	"banner",
	"iran"
],
	"🇮🇸": [
	"flag_iceland",
	"is",
	"flag",
	"nation",
	"country",
	"banner",
	"iceland"
],
	"🇮🇹": [
	"flag_italy",
	"italy",
	"flag",
	"nation",
	"country",
	"banner",
	"italy"
],
	"🇯🇪": [
	"flag_jersey",
	"je",
	"flag",
	"nation",
	"country",
	"banner",
	"jersey"
],
	"🇯🇲": [
	"flag_jamaica",
	"jm",
	"flag",
	"nation",
	"country",
	"banner",
	"jamaica"
],
	"🇯🇴": [
	"flag_jordan",
	"jo",
	"flag",
	"nation",
	"country",
	"banner",
	"jordan"
],
	"🇯🇵": [
	"flag_japan",
	"japanese",
	"nation",
	"flag",
	"country",
	"banner",
	"japan",
	"jp",
	"ja"
],
	"🇰🇪": [
	"flag_kenya",
	"ke",
	"flag",
	"nation",
	"country",
	"banner",
	"kenya"
],
	"🇰🇬": [
	"flag_kyrgyzstan",
	"kg",
	"flag",
	"nation",
	"country",
	"banner",
	"kyrgyzstan"
],
	"🇰🇭": [
	"flag_cambodia",
	"kh",
	"flag",
	"nation",
	"country",
	"banner",
	"cambodia"
],
	"🇰🇮": [
	"flag_kiribati",
	"ki",
	"flag",
	"nation",
	"country",
	"banner",
	"kiribati"
],
	"🇰🇲": [
	"flag_comoros",
	"km",
	"flag",
	"nation",
	"country",
	"banner",
	"comoros"
],
	"🇰🇳": [
	"flag_st_kitts_nevis",
	"saint",
	"kitts",
	"nevis",
	"flag",
	"nation",
	"country",
	"banner",
	"st_kitts_nevis"
],
	"🇰🇵": [
	"flag_north_korea",
	"north",
	"korea",
	"nation",
	"flag",
	"country",
	"banner",
	"north_korea"
],
	"🇰🇷": [
	"flag_south_korea",
	"south",
	"korea",
	"nation",
	"flag",
	"country",
	"banner",
	"south_korea"
],
	"🇰🇼": [
	"flag_kuwait",
	"kw",
	"flag",
	"nation",
	"country",
	"banner",
	"kuwait"
],
	"🇰🇾": [
	"flag_cayman_islands",
	"cayman",
	"islands",
	"flag",
	"nation",
	"country",
	"banner",
	"cayman_islands"
],
	"🇰🇿": [
	"flag_kazakhstan",
	"kz",
	"flag",
	"nation",
	"country",
	"banner",
	"kazakhstan"
],
	"🇱🇦": [
	"flag_laos",
	"lao",
	"democratic",
	"republic",
	"flag",
	"nation",
	"country",
	"banner",
	"laos"
],
	"🇱🇧": [
	"flag_lebanon",
	"lb",
	"flag",
	"nation",
	"country",
	"banner",
	"lebanon"
],
	"🇱🇨": [
	"flag_st_lucia",
	"saint",
	"lucia",
	"flag",
	"nation",
	"country",
	"banner",
	"st_lucia"
],
	"🇱🇮": [
	"flag_liechtenstein",
	"li",
	"flag",
	"nation",
	"country",
	"banner",
	"liechtenstein"
],
	"🇱🇰": [
	"flag_sri_lanka",
	"sri",
	"lanka",
	"flag",
	"nation",
	"country",
	"banner",
	"sri_lanka"
],
	"🇱🇷": [
	"flag_liberia",
	"lr",
	"flag",
	"nation",
	"country",
	"banner",
	"liberia"
],
	"🇱🇸": [
	"flag_lesotho",
	"ls",
	"flag",
	"nation",
	"country",
	"banner",
	"lesotho"
],
	"🇱🇹": [
	"flag_lithuania",
	"lt",
	"flag",
	"nation",
	"country",
	"banner",
	"lithuania"
],
	"🇱🇺": [
	"flag_luxembourg",
	"lu",
	"flag",
	"nation",
	"country",
	"banner",
	"luxembourg"
],
	"🇱🇻": [
	"flag_latvia",
	"lv",
	"flag",
	"nation",
	"country",
	"banner",
	"latvia"
],
	"🇱🇾": [
	"flag_libya",
	"ly",
	"flag",
	"nation",
	"country",
	"banner",
	"libya"
],
	"🇲🇦": [
	"flag_morocco",
	"ma",
	"flag",
	"nation",
	"country",
	"banner",
	"morocco"
],
	"🇲🇨": [
	"flag_monaco",
	"mc",
	"flag",
	"nation",
	"country",
	"banner",
	"monaco"
],
	"🇲🇩": [
	"flag_moldova",
	"moldova",
	"republic",
	"flag",
	"nation",
	"country",
	"banner",
	"moldova"
],
	"🇲🇪": [
	"flag_montenegro",
	"me",
	"flag",
	"nation",
	"country",
	"banner",
	"montenegro"
],
	"🇲🇫": [
	"flag_st_martin"
],
	"🇲🇬": [
	"flag_madagascar",
	"mg",
	"flag",
	"nation",
	"country",
	"banner",
	"madagascar"
],
	"🇲🇭": [
	"flag_marshall_islands",
	"marshall",
	"islands",
	"flag",
	"nation",
	"country",
	"banner",
	"marshall_islands"
],
	"🇲🇰": [
	"flag_north_macedonia",
	"macedonia",
	"flag",
	"nation",
	"country",
	"banner",
	"north_macedonia"
],
	"🇲🇱": [
	"flag_mali",
	"ml",
	"flag",
	"nation",
	"country",
	"banner",
	"mali"
],
	"🇲🇲": [
	"flag_myanmar",
	"mm",
	"flag",
	"nation",
	"country",
	"banner",
	"myanmar"
],
	"🇲🇳": [
	"flag_mongolia",
	"mn",
	"flag",
	"nation",
	"country",
	"banner",
	"mongolia"
],
	"🇲🇴": [
	"flag_macao_sar_china",
	"macao",
	"flag",
	"nation",
	"country",
	"banner",
	"macao_sar_china"
],
	"🇲🇵": [
	"flag_northern_mariana_islands",
	"northern",
	"mariana",
	"islands",
	"flag",
	"nation",
	"country",
	"banner",
	"northern_mariana_islands"
],
	"🇲🇶": [
	"flag_martinique",
	"mq",
	"flag",
	"nation",
	"country",
	"banner",
	"martinique"
],
	"🇲🇷": [
	"flag_mauritania",
	"mr",
	"flag",
	"nation",
	"country",
	"banner",
	"mauritania"
],
	"🇲🇸": [
	"flag_montserrat",
	"ms",
	"flag",
	"nation",
	"country",
	"banner",
	"montserrat"
],
	"🇲🇹": [
	"flag_malta",
	"mt",
	"flag",
	"nation",
	"country",
	"banner",
	"malta"
],
	"🇲🇺": [
	"flag_mauritius",
	"mu",
	"flag",
	"nation",
	"country",
	"banner",
	"mauritius"
],
	"🇲🇻": [
	"flag_maldives",
	"mv",
	"flag",
	"nation",
	"country",
	"banner",
	"maldives"
],
	"🇲🇼": [
	"flag_malawi",
	"mw",
	"flag",
	"nation",
	"country",
	"banner",
	"malawi"
],
	"🇲🇽": [
	"flag_mexico",
	"mx",
	"flag",
	"nation",
	"country",
	"banner",
	"mexico"
],
	"🇲🇾": [
	"flag_malaysia",
	"my",
	"flag",
	"nation",
	"country",
	"banner",
	"malaysia"
],
	"🇲🇿": [
	"flag_mozambique",
	"mz",
	"flag",
	"nation",
	"country",
	"banner",
	"mozambique"
],
	"🇳🇦": [
	"flag_namibia",
	"na",
	"flag",
	"nation",
	"country",
	"banner",
	"namibia"
],
	"🇳🇨": [
	"flag_new_caledonia",
	"new",
	"caledonia",
	"flag",
	"nation",
	"country",
	"banner",
	"new_caledonia"
],
	"🇳🇪": [
	"flag_niger",
	"ne",
	"flag",
	"nation",
	"country",
	"banner",
	"niger"
],
	"🇳🇫": [
	"flag_norfolk_island",
	"norfolk",
	"island",
	"flag",
	"nation",
	"country",
	"banner",
	"norfolk_island"
],
	"🇳🇬": [
	"flag_nigeria",
	"flag",
	"nation",
	"country",
	"banner",
	"nigeria"
],
	"🇳🇮": [
	"flag_nicaragua",
	"ni",
	"flag",
	"nation",
	"country",
	"banner",
	"nicaragua"
],
	"🇳🇱": [
	"flag_netherlands",
	"nl",
	"flag",
	"nation",
	"country",
	"banner",
	"netherlands"
],
	"🇳🇴": [
	"flag_norway",
	"no",
	"flag",
	"nation",
	"country",
	"banner",
	"norway"
],
	"🇳🇵": [
	"flag_nepal",
	"np",
	"flag",
	"nation",
	"country",
	"banner",
	"nepal"
],
	"🇳🇷": [
	"flag_nauru",
	"nr",
	"flag",
	"nation",
	"country",
	"banner",
	"nauru"
],
	"🇳🇺": [
	"flag_niue",
	"nu",
	"flag",
	"nation",
	"country",
	"banner",
	"niue"
],
	"🇳🇿": [
	"flag_new_zealand",
	"new",
	"zealand",
	"flag",
	"nation",
	"country",
	"banner",
	"new_zealand"
],
	"🇴🇲": [
	"flag_oman",
	"om_symbol",
	"flag",
	"nation",
	"country",
	"banner",
	"oman"
],
	"🇵🇦": [
	"flag_panama",
	"pa",
	"flag",
	"nation",
	"country",
	"banner",
	"panama"
],
	"🇵🇪": [
	"flag_peru",
	"pe",
	"flag",
	"nation",
	"country",
	"banner",
	"peru"
],
	"🇵🇫": [
	"flag_french_polynesia",
	"french",
	"polynesia",
	"flag",
	"nation",
	"country",
	"banner",
	"french_polynesia"
],
	"🇵🇬": [
	"flag_papua_new_guinea",
	"papua",
	"new",
	"guinea",
	"flag",
	"nation",
	"country",
	"banner",
	"papua_new_guinea"
],
	"🇵🇭": [
	"flag_philippines",
	"ph",
	"flag",
	"nation",
	"country",
	"banner",
	"philippines"
],
	"🇵🇰": [
	"flag_pakistan",
	"pk",
	"flag",
	"nation",
	"country",
	"banner",
	"pakistan"
],
	"🇵🇱": [
	"flag_poland",
	"pl",
	"flag",
	"nation",
	"country",
	"banner",
	"poland"
],
	"🇵🇲": [
	"flag_st_pierre_miquelon",
	"saint",
	"pierre",
	"miquelon",
	"flag",
	"nation",
	"country",
	"banner",
	"st_pierre_miquelon"
],
	"🇵🇳": [
	"flag_pitcairn_islands",
	"pitcairn",
	"flag",
	"nation",
	"country",
	"banner",
	"pitcairn_islands"
],
	"🇵🇷": [
	"flag_puerto_rico",
	"puerto",
	"rico",
	"flag",
	"nation",
	"country",
	"banner",
	"puerto_rico"
],
	"🇵🇸": [
	"flag_palestinian_territories",
	"palestine",
	"palestinian",
	"territories",
	"flag",
	"nation",
	"country",
	"banner",
	"palestinian_territories"
],
	"🇵🇹": [
	"flag_portugal",
	"pt",
	"flag",
	"nation",
	"country",
	"banner",
	"portugal"
],
	"🇵🇼": [
	"flag_palau",
	"pw",
	"flag",
	"nation",
	"country",
	"banner",
	"palau"
],
	"🇵🇾": [
	"flag_paraguay",
	"py",
	"flag",
	"nation",
	"country",
	"banner",
	"paraguay"
],
	"🇶🇦": [
	"flag_qatar",
	"qa",
	"flag",
	"nation",
	"country",
	"banner",
	"qatar"
],
	"🇷🇪": [
	"flag_reunion",
	"réunion",
	"flag",
	"nation",
	"country",
	"banner",
	"reunion"
],
	"🇷🇴": [
	"flag_romania",
	"ro",
	"flag",
	"nation",
	"country",
	"banner",
	"romania"
],
	"🇷🇸": [
	"flag_serbia",
	"rs",
	"flag",
	"nation",
	"country",
	"banner",
	"serbia"
],
	"🇷🇺": [
	"flag_russia",
	"russian",
	"federation",
	"flag",
	"nation",
	"country",
	"banner",
	"russia"
],
	"🇷🇼": [
	"flag_rwanda",
	"rw",
	"flag",
	"nation",
	"country",
	"banner",
	"rwanda"
],
	"🇸🇦": [
	"flag_saudi_arabia",
	"flag",
	"nation",
	"country",
	"banner",
	"saudi_arabia"
],
	"🇸🇧": [
	"flag_solomon_islands",
	"solomon",
	"islands",
	"flag",
	"nation",
	"country",
	"banner",
	"solomon_islands"
],
	"🇸🇨": [
	"flag_seychelles",
	"sc",
	"flag",
	"nation",
	"country",
	"banner",
	"seychelles"
],
	"🇸🇩": [
	"flag_sudan",
	"sd",
	"flag",
	"nation",
	"country",
	"banner",
	"sudan"
],
	"🇸🇪": [
	"flag_sweden",
	"se",
	"flag",
	"nation",
	"country",
	"banner",
	"sweden"
],
	"🇸🇬": [
	"flag_singapore",
	"sg",
	"flag",
	"nation",
	"country",
	"banner",
	"singapore"
],
	"🇸🇭": [
	"flag_st_helena",
	"saint",
	"helena",
	"ascension",
	"tristan",
	"cunha",
	"flag",
	"nation",
	"country",
	"banner",
	"st_helena"
],
	"🇸🇮": [
	"flag_slovenia",
	"si",
	"flag",
	"nation",
	"country",
	"banner",
	"slovenia"
],
	"🇸🇯": [
	"flag_svalbard_jan_mayen"
],
	"🇸🇰": [
	"flag_slovakia",
	"sk",
	"flag",
	"nation",
	"country",
	"banner",
	"slovakia"
],
	"🇸🇱": [
	"flag_sierra_leone",
	"sierra",
	"leone",
	"flag",
	"nation",
	"country",
	"banner",
	"sierra_leone"
],
	"🇸🇲": [
	"flag_san_marino",
	"san",
	"marino",
	"flag",
	"nation",
	"country",
	"banner",
	"san_marino"
],
	"🇸🇳": [
	"flag_senegal",
	"sn",
	"flag",
	"nation",
	"country",
	"banner",
	"senegal"
],
	"🇸🇴": [
	"flag_somalia",
	"so",
	"flag",
	"nation",
	"country",
	"banner",
	"somalia"
],
	"🇸🇷": [
	"flag_suriname",
	"sr",
	"flag",
	"nation",
	"country",
	"banner",
	"suriname"
],
	"🇸🇸": [
	"flag_south_sudan",
	"south",
	"sd",
	"flag",
	"nation",
	"country",
	"banner",
	"south_sudan"
],
	"🇸🇹": [
	"flag_sao_tome_principe",
	"sao",
	"tome",
	"principe",
	"flag",
	"nation",
	"country",
	"banner",
	"sao_tome_principe"
],
	"🇸🇻": [
	"flag_el_salvador",
	"el",
	"salvador",
	"flag",
	"nation",
	"country",
	"banner",
	"el_salvador"
],
	"🇸🇽": [
	"flag_sint_maarten",
	"sint",
	"maarten",
	"dutch",
	"flag",
	"nation",
	"country",
	"banner",
	"sint_maarten"
],
	"🇸🇾": [
	"flag_syria",
	"syrian",
	"arab",
	"republic",
	"flag",
	"nation",
	"country",
	"banner",
	"syria"
],
	"🇸🇿": [
	"flag_eswatini",
	"sz",
	"flag",
	"nation",
	"country",
	"banner",
	"eswatini"
],
	"🇹🇦": [
	"flag_tristan_da_cunha"
],
	"🇹🇨": [
	"flag_turks_caicos_islands",
	"turks",
	"caicos",
	"islands",
	"flag",
	"nation",
	"country",
	"banner",
	"turks_caicos_islands"
],
	"🇹🇩": [
	"flag_chad",
	"td",
	"flag",
	"nation",
	"country",
	"banner",
	"chad"
],
	"🇹🇫": [
	"flag_french_southern_territories",
	"french",
	"southern",
	"territories",
	"flag",
	"nation",
	"country",
	"banner",
	"french_southern_territories"
],
	"🇹🇬": [
	"flag_togo",
	"tg",
	"flag",
	"nation",
	"country",
	"banner",
	"togo"
],
	"🇹🇭": [
	"flag_thailand",
	"th",
	"flag",
	"nation",
	"country",
	"banner",
	"thailand"
],
	"🇹🇯": [
	"flag_tajikistan",
	"tj",
	"flag",
	"nation",
	"country",
	"banner",
	"tajikistan"
],
	"🇹🇰": [
	"flag_tokelau",
	"tk",
	"flag",
	"nation",
	"country",
	"banner",
	"tokelau"
],
	"🇹🇱": [
	"flag_timor_leste",
	"timor",
	"leste",
	"flag",
	"nation",
	"country",
	"banner",
	"timor_leste"
],
	"🇹🇲": [
	"flag_turkmenistan",
	"flag",
	"nation",
	"country",
	"banner",
	"turkmenistan"
],
	"🇹🇳": [
	"flag_tunisia",
	"tn",
	"flag",
	"nation",
	"country",
	"banner",
	"tunisia"
],
	"🇹🇴": [
	"flag_tonga",
	"to",
	"flag",
	"nation",
	"country",
	"banner",
	"tonga"
],
	"🇹🇷": [
	"flag_turkey",
	"turkey",
	"flag",
	"nation",
	"country",
	"banner",
	"turkey"
],
	"🇹🇹": [
	"flag_trinidad_tobago",
	"trinidad",
	"tobago",
	"flag",
	"nation",
	"country",
	"banner",
	"trinidad_tobago"
],
	"🇹🇻": [
	"flag_tuvalu",
	"flag",
	"nation",
	"country",
	"banner",
	"tuvalu"
],
	"🇹🇼": [
	"flag_taiwan",
	"tw",
	"flag",
	"nation",
	"country",
	"banner",
	"taiwan"
],
	"🇹🇿": [
	"flag_tanzania",
	"tanzania",
	"united",
	"republic",
	"flag",
	"nation",
	"country",
	"banner",
	"tanzania"
],
	"🇺🇦": [
	"flag_ukraine",
	"ua",
	"flag",
	"nation",
	"country",
	"banner",
	"ukraine"
],
	"🇺🇬": [
	"flag_uganda",
	"ug",
	"flag",
	"nation",
	"country",
	"banner",
	"uganda"
],
	"🇺🇲": [
	"flag_u_s_outlying_islands"
],
	"🇺🇳": [
	"flag_united_nations",
	"un",
	"flag",
	"banner"
],
	"🇺🇸": [
	"flag_united_states",
	"united",
	"states",
	"america",
	"flag",
	"nation",
	"country",
	"banner",
	"united_states"
],
	"🇺🇾": [
	"flag_uruguay",
	"uy",
	"flag",
	"nation",
	"country",
	"banner",
	"uruguay"
],
	"🇺🇿": [
	"flag_uzbekistan",
	"uz",
	"flag",
	"nation",
	"country",
	"banner",
	"uzbekistan"
],
	"🇻🇦": [
	"flag_vatican_city",
	"vatican",
	"city",
	"flag",
	"nation",
	"country",
	"banner",
	"vatican_city"
],
	"🇻🇨": [
	"flag_st_vincent_grenadines",
	"saint",
	"vincent",
	"grenadines",
	"flag",
	"nation",
	"country",
	"banner",
	"st_vincent_grenadines"
],
	"🇻🇪": [
	"flag_venezuela",
	"ve",
	"bolivarian",
	"republic",
	"flag",
	"nation",
	"country",
	"banner",
	"venezuela"
],
	"🇻🇬": [
	"flag_british_virgin_islands",
	"british",
	"virgin",
	"islands",
	"bvi",
	"flag",
	"nation",
	"country",
	"banner",
	"british_virgin_islands"
],
	"🇻🇮": [
	"flag_u_s_virgin_islands",
	"virgin",
	"islands",
	"us",
	"flag",
	"nation",
	"country",
	"banner",
	"u_s_virgin_islands"
],
	"🇻🇳": [
	"flag_vietnam",
	"viet",
	"nam",
	"flag",
	"nation",
	"country",
	"banner",
	"vietnam"
],
	"🇻🇺": [
	"flag_vanuatu",
	"vu",
	"flag",
	"nation",
	"country",
	"banner",
	"vanuatu"
],
	"🇼🇫": [
	"flag_wallis_futuna",
	"wallis",
	"futuna",
	"flag",
	"nation",
	"country",
	"banner",
	"wallis_futuna"
],
	"🇼🇸": [
	"flag_samoa",
	"ws",
	"flag",
	"nation",
	"country",
	"banner",
	"samoa"
],
	"🇽🇰": [
	"flag_kosovo",
	"xk",
	"flag",
	"nation",
	"country",
	"banner",
	"kosovo"
],
	"🇾🇪": [
	"flag_yemen",
	"ye",
	"flag",
	"nation",
	"country",
	"banner",
	"yemen"
],
	"🇾🇹": [
	"flag_mayotte",
	"yt",
	"flag",
	"nation",
	"country",
	"banner",
	"mayotte"
],
	"🇿🇦": [
	"flag_south_africa",
	"south",
	"africa",
	"flag",
	"nation",
	"country",
	"banner",
	"south_africa"
],
	"🇿🇲": [
	"flag_zambia",
	"zm",
	"flag",
	"nation",
	"country",
	"banner",
	"zambia"
],
	"🇿🇼": [
	"flag_zimbabwe",
	"zw",
	"flag",
	"nation",
	"country",
	"banner",
	"zimbabwe"
],
	"🏴󠁧󠁢󠁥󠁮󠁧󠁿": [
	"flag_england",
	"flag",
	"english"
],
	"🏴󠁧󠁢󠁳󠁣󠁴󠁿": [
	"flag_scotland",
	"flag",
	"scottish"
],
	"🏴󠁧󠁢󠁷󠁬󠁳󠁿": [
	"flag_wales",
	"flag",
	"welsh"
],
	"🥲": [
	"smiling face with tear",
	"sad",
	"cry",
	"pretend"
],
	"🥸": [
	"disguised face",
	"pretent",
	"brows",
	"glasses",
	"moustache"
],
	"🤌": [
	"pinched fingers",
	"size",
	"tiny",
	"small"
],
	"🫀": [
	"anatomical heart",
	"health",
	"heartbeat"
],
	"🫁": [
	"lungs",
	"breathe"
],
	"🥷": [
	"ninja",
	"ninjutsu",
	"skills",
	"japanese"
],
	"🤵‍♂️": [
	"man in tuxedo",
	"formal",
	"fashion"
],
	"🤵‍♀️": [
	"woman in tuxedo",
	"formal",
	"fashion"
],
	"👰‍♂️": [
	"man with veil",
	"wedding",
	"marriage"
],
	"👰‍♀️": [
	"woman with veil",
	"wedding",
	"marriage"
],
	"👩‍🍼": [
	"woman feeding baby",
	"birth",
	"food"
],
	"👨‍🍼": [
	"man feeding baby",
	"birth",
	"food"
],
	"🧑‍🍼": [
	"person feeding baby",
	"birth",
	"food"
],
	"🧑‍🎄": [
	"mx claus",
	"christmas"
],
	"🫂": [
	"people hugging",
	"care"
],
	"🐈‍⬛": [
	"black cat",
	"superstition",
	"luck"
],
	"🦬": [
	"bison",
	"ox"
],
	"🦣": [
	"mammoth",
	"elephant",
	"tusks"
],
	"🦫": [
	"beaver",
	"animal",
	"rodent"
],
	"🐻‍❄️": [
	"polar bear",
	"animal",
	"arctic"
],
	"🦤": [
	"dodo",
	"animal",
	"bird"
],
	"🪶": [
	"feather",
	"bird",
	"fly"
],
	"🦭": [
	"seal",
	"animal",
	"creature",
	"sea"
],
	"🪲": [
	"beetle",
	"insect"
],
	"🪳": [
	"cockroach",
	"insect",
	"pests"
],
	"🪰": [
	"fly",
	"insect"
],
	"🪱": [
	"worm",
	"animal"
],
	"🪴": [
	"potted plant",
	"greenery",
	"house"
],
	"🫐": [
	"blueberries",
	"fruit"
],
	"🫒": [
	"olive",
	"fruit"
],
	"🫑": [
	"bell pepper",
	"fruit",
	"plant"
],
	"🫓": [
	"flatbread",
	"flour",
	"food",
	"bakery"
],
	"🫔": [
	"tamale",
	"food",
	"masa"
],
	"🫕": [
	"fondue",
	"cheese",
	"pot",
	"food"
],
	"🫖": [
	"teapot",
	"drink",
	"hot"
],
	"🧋": [
	"bubble tea",
	"taiwan",
	"boba",
	"milk tea",
	"straw"
],
	"🪨": [
	"rock",
	"stone"
],
	"🪵": [
	"wood",
	"nature",
	"timber",
	"trunk"
],
	"🛖": [
	"hut",
	"house",
	"structure"
],
	"🛻": [
	"pickup truck",
	"car",
	"transportation"
],
	"🛼": [
	"roller skate",
	"footwear",
	"sports"
],
	"🪄": [
	"magic wand",
	"supernature",
	"power"
],
	"🪅": [
	"pinata",
	"mexico",
	"candy",
	"celebration"
],
	"🪆": [
	"nesting dolls",
	"matryoshka",
	"toy"
],
	"🪡": [
	"sewing needle",
	"stitches"
],
	"🪢": [
	"knot",
	"rope",
	"scout"
],
	"🩴": [
	"thong sandal",
	"footwear",
	"summer"
],
	"🪖": [
	"military helmet",
	"army",
	"protection"
],
	"🪗": [
	"accordion",
	"music"
],
	"🪘": [
	"long drum",
	"music"
],
	"🪙": [
	"coin",
	"money",
	"currency"
],
	"🪃": [
	"boomerang",
	"weapon"
],
	"🪚": [
	"carpentry saw",
	"cut",
	"chop"
],
	"🪛": [
	"screwdriver",
	"tools"
],
	"🪝": [
	"hook",
	"tools"
],
	"🪜": [
	"ladder",
	"tools"
],
	"🛗": [
	"elevator",
	"lift"
],
	"🪞": [
	"mirror",
	"reflection"
],
	"🪟": [
	"window",
	"scenery"
],
	"🪠": [
	"plunger",
	"toilet"
],
	"🪤": [
	"mouse trap",
	"cheese"
],
	"🪣": [
	"bucket",
	"water",
	"container"
],
	"🪥": [
	"toothbrush",
	"hygiene",
	"dental"
],
	"🪦": [
	"headstone",
	"death",
	"rip",
	"grave"
],
	"🪧": [
	"placard",
	"announcement"
],
	"⚧️": [
	"transgender symbol",
	"lgbtq"
],
	"🏳️‍⚧️": [
	"transgender flag",
	"lgbtq"
],
	"😶‍🌫️": [
	"face in clouds",
	"shower",
	"steam",
	"dream"
],
	"😮‍💨": [
	"face exhaling",
	"relieve",
	"relief",
	"tired",
	"sigh"
],
	"😵‍💫": [
	"face with spiral eyes",
	"sick",
	"ill",
	"confused",
	"nauseous",
	"nausea"
],
	"❤️‍🔥": [
	"heart on fire",
	"passionate",
	"enthusiastic"
],
	"❤️‍🩹": [
	"mending heart",
	"broken heart",
	"bandage",
	"wounded"
],
	"🧔‍♂️": [
	"man beard",
	"facial hair"
],
	"🧔‍♀️": [
	"woman beard",
	"facial hair"
],
	"🫠": [
	"melting face",
	"hot",
	"heat"
],
	"🫢": [
	"face with open eyes and hand over mouth",
	"silence",
	"secret",
	"shock",
	"surprise"
],
	"🫣": [
	"face with peeking eye",
	"scared",
	"frightening",
	"embarrassing",
	"shy"
],
	"🫡": [
	"saluting face",
	"respect",
	"salute"
],
	"🫥": [
	"dotted line face",
	"invisible",
	"lonely",
	"isolation",
	"depression"
],
	"🫤": [
	"face with diagonal mouth",
	"skeptic",
	"confuse",
	"frustrated",
	"indifferent"
],
	"🥹": [
	"face holding back tears",
	"touched",
	"gratitude",
	"cry"
],
	"🫱": [
	"rightwards hand",
	"palm",
	"offer"
],
	"🫲": [
	"leftwards hand",
	"palm",
	"offer"
],
	"🫳": [
	"palm down hand",
	"palm",
	"drop"
],
	"🫴": [
	"palm up hand",
	"lift",
	"offer",
	"demand"
],
	"🫰": [
	"hand with index finger and thumb crossed",
	"heart",
	"love",
	"money",
	"expensive"
],
	"🫵": [
	"index pointing at the viewer",
	"you",
	"recruit"
],
	"🫶": [
	"heart hands",
	"love",
	"appreciation",
	"support"
],
	"🫦": [
	"biting lip",
	"flirt",
	"sexy",
	"pain",
	"worry"
],
	"🫅": [
	"person with crown",
	"royalty",
	"power"
],
	"🫃": [
	"pregnant man",
	"baby",
	"belly"
],
	"🫄": [
	"pregnant person",
	"baby",
	"belly"
],
	"🧌": [
	"troll",
	"mystical",
	"monster"
],
	"🪸": [
	"coral",
	"ocean",
	"sea",
	"reef"
],
	"🪷": [
	"lotus",
	"flower",
	"calm",
	"meditation"
],
	"🪹": [
	"empty nest",
	"bird"
],
	"🪺": [
	"nest with eggs",
	"bird"
],
	"🫘": [
	"beans",
	"food"
],
	"🫗": [
	"pouring liquid",
	"cup",
	"water"
],
	"🫙": [
	"jar",
	"container",
	"sauce"
],
	"🛝": [
	"playground slide",
	"fun",
	"park"
],
	"🛞": [
	"wheel",
	"car",
	"transport"
],
	"🛟": [
	"ring buoy",
	"life saver",
	"life preserver"
],
	"🪬": [
	"hamsa",
	"religion",
	"protection"
],
	"🪩": [
	"mirror ball",
	"disco",
	"dance",
	"party"
],
	"🪫": [
	"low battery",
	"drained",
	"dead"
],
	"🩼": [
	"crutch",
	"accessibility",
	"assist"
],
	"🩻": [
	"x-ray",
	"skeleton",
	"medicine"
],
	"🫧": [
	"bubbles",
	"soap",
	"fun",
	"carbonation",
	"sparkling"
],
	"🪪": [
	"identification card",
	"document"
],
	"🟰": [
	"heavy equals sign",
	"math"
],
	"🫨": [
	"shaking face",
	"dizzy",
	"shock",
	"blurry",
	"earthquake"
],
	"🩷": [
	"pink heart",
	"valentines"
],
	"🩵": [
	"light blue heart",
	"ice",
	"baby blue"
],
	"🩶": [
	"grey heart",
	"silver",
	"monochrome"
],
	"🫷": [
	"leftwards pushing hand",
	"highfive",
	"pressing",
	"stop"
],
	"🫸": [
	"rightwards pushing hand",
	"highfive",
	"pressing",
	"stop"
],
	"🫎": [
	"moose",
	"shrek",
	"canada",
	"sweden",
	"sven",
	"cool"
],
	"🫏": [
	"donkey",
	"eeyore",
	"mule"
],
	"🪽": [
	"wing",
	"angel",
	"birds",
	"flying"
],
	"🐦‍⬛": [
	"black bird",
	"crow"
],
	"🪿": [
	"goose",
	"silly",
	"jemima",
	"goosebumps"
],
	"🪼": [
	"jellyfish",
	"sting",
	"tentacles"
],
	"🪻": [
	"hyacinth",
	"flower",
	"lavender"
],
	"🫚": [
	"ginger root",
	"spice",
	"yellow",
	"cooking",
	"gingerbread"
],
	"🫛": [
	"pea pod",
	"cozy",
	"green"
],
	"🪭": [
	"folding hand fan",
	"flamenco",
	"hot"
],
	"🪮": [
	"hair pick",
	"afro",
	"comb"
],
	"🪇": [
	"maracas",
	"music",
	"instrument",
	"percussion"
],
	"🪈": [
	"flute",
	"bamboo",
	"music",
	"instrument",
	"pied piper"
],
	"🪯": [
	"khanda",
	"Sikhism",
	"religion"
],
	"🛜": [
	"wireless",
	"wifi",
	"internet",
	"contactless",
	"signal"
]
};

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "emoji-picker",
  __ssrInlineRender: true,
  setup(__props) {
    const escapeUnicode = ({ emoji }) => emoji.split("").map((unit) => `\\u${unit.charCodeAt(0).toString(16).padStart(4, "0")}`).join("");
    const getEmojiCodePoints = ({ emoji }) => emoji.codePointAt(0) ? `0x${emoji.codePointAt(0)?.toString(16)}` : void 0;
    const emojis = _.map(emojiUnicodeData, (emojiInfo, emoji) => ({
      ...emojiInfo,
      emoji,
      title: _.capitalize(emojiInfo.name),
      keywords: emojiKeywords[emoji],
      codePoints: getEmojiCodePoints({ emoji }),
      unicode: escapeUnicode({ emoji })
    }));
    const emojisGroups = _.chain(emojis).groupBy("group").map((emojiInfos, group) => ({ group, emojiInfos })).value();
    const searchQuery = ref("");
    const { searchResult } = useFuzzySearch({
      search: searchQuery,
      data: emojis,
      options: {
        keys: ["group", { name: "name", weight: 3 }, "keywords", "unicode", "codePoints", "emoji"],
        threshold: 0.3,
        useExtendedSearch: true,
        isCaseSensitive: false
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_c_input_text = __unplugin_components_3;
      const _component_icon_mdi_search = __unplugin_components_1$1;
      const _component_emoji_grid = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({
        "mx-auto": "",
        "max-w-2400px": "",
        "important:flex-1": ""
      }, _attrs))}><div flex items-center gap-3>`);
      _push(ssrRenderComponent(_component_c_input_text, {
        value: unref(searchQuery),
        "onUpdate:value": ($event) => isRef(searchQuery) ? searchQuery.value = $event : null,
        placeholder: "Search emojis (e.g. 'smile')...",
        "mx-auto": "",
        "max-w-600px": ""
      }, {
        prefix: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_icon_mdi_search, {
              "mr-6px": "",
              "color-black": "",
              "op-70": "",
              "dark:color-white": ""
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_icon_mdi_search, {
                "mr-6px": "",
                "color-black": "",
                "op-70": "",
                "dark:color-white": ""
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (unref(searchQuery).trim().length > 0) {
        _push(`<div>`);
        if (unref(searchResult).length === 0) {
          _push(`<div mt-4 text-20px font-bold> No results </div>`);
        } else {
          _push(`<div><div mt-4 text-20px font-bold> Search result </div>`);
          _push(ssrRenderComponent(_component_emoji_grid, { "emoji-infos": unref(searchResult) }, null, _parent));
          _push(`</div>`);
        }
        _push(`</div>`);
      } else {
        _push(`<!--[-->`);
        ssrRenderList(unref(emojisGroups), ({ group, emojiInfos }) => {
          _push(`<div><div mt-4 text-20px font-bold>${ssrInterpolate(group)}</div>`);
          _push(ssrRenderComponent(_component_emoji_grid, { "emoji-infos": emojiInfos }, null, _parent));
          _push(`</div>`);
        });
        _push(`<!--]-->`);
      }
      _push(`</div>`);
    };
  }
});

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/tools/emoji-picker/emoji-picker.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
