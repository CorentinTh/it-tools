import { NInputGroup, NInputGroupLabel, NDynamicInput, NFormItem } from 'naive-ui';
import { _ as __unplugin_components_0 } from './chunk-89a4876c.js';
import { _ as __unplugin_components_3 } from './chunk-4e7a6a8d.js';
import { defineComponent, ref, watch, computed, unref, withCtx, createTextVNode, toDisplayString, createVNode, openBlock, createBlock, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderList, ssrRenderStyle, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import { generateMeta } from '@it-tools/oggen';
import _ from 'lodash';
import { T as TextareaCopyable } from './chunk-727cc0fb.js';
import { _ as _export_sfc } from './chunk-6003391e.js';
import './chunk-bb5bb4f6.js';
import './chunk-2ce6ed5e.js';
import '@vueuse/core';
import 'fuse.js';
import './chunk-11f44f81.js';
import './chunk-35c3d701.js';
import './chunk-8109fd17.js';
import '@vicons/tabler';
import 'highlight.js/lib/core';
import 'highlight.js/lib/languages/json';
import 'highlight.js/lib/languages/sql';
import 'highlight.js/lib/languages/xml';
import 'highlight.js/lib/languages/yaml';
import 'highlight.js/lib/languages/ini';
import './chunk-77c5cc16.js';
import 'pinia';

const article = {
  name: "Article",
  elements: [
    {
      type: "input",
      label: "Publishing date",
      key: "article:published_time",
      placeholder: "When the article was first published..."
    },
    {
      type: "input",
      label: "Modification date",
      key: "article:modified_time",
      placeholder: "When the article was last changed..."
    },
    {
      type: "input",
      label: "Expiration date",
      key: "article:expiration_time",
      placeholder: "When the article is out of date after..."
    },
    { type: "input", label: "Author", key: "article:author", placeholder: "Writers of the article..." },
    {
      type: "input",
      label: "Section",
      key: "article:section",
      placeholder: "A high-level section name. E.g. Technology.."
    },
    { type: "input", label: "Tag", key: "article:tag", placeholder: "Tag words associated with this article..." }
  ]
};

const book = {
  name: "Book",
  elements: [
    { type: "input", label: "Author", key: "book:author", placeholder: "Who wrote this book..." },
    { type: "input", label: "ISBN", key: "book:isbn", placeholder: "The International Standard Book Number..." },
    {
      type: "input",
      label: "Release date",
      key: "book:release_date",
      placeholder: "The date the book was released..."
    },
    { type: "input", label: "Tag", key: "book:tag", placeholder: "Tag words associated with this book..." }
  ]
};

const musicAlbum = {
  name: "Album details",
  elements: [
    { type: "input", label: "Song", key: "music:song", placeholder: "The song on this album..." },
    {
      type: "input",
      label: "Disc",
      key: "music:song:disc",
      placeholder: "The same as music:album:disc but in reverse..."
    },
    {
      type: "input",
      label: "Track",
      key: "music:song:track",
      placeholder: "The same as music:album:track but in reverse..."
    },
    { type: "input", label: "Musician", key: "music:musician", placeholder: "The musician that made this song..." },
    {
      type: "input",
      label: "Release date",
      key: "music:release_date",
      placeholder: "The date the album was released..."
    }
  ]
};

const musicPlaylist = {
  name: "Playlist details",
  elements: [
    { type: "input", label: "Song", key: "music:song", placeholder: "The song on this album..." },
    {
      type: "input",
      label: "Disc",
      key: "music:song:disc",
      placeholder: "The same as music:album:disc but in reverse..."
    },
    {
      type: "input",
      label: "Track",
      key: "music:song:track",
      placeholder: "The same as music:album:track but in reverse..."
    },
    { type: "input", label: "Creator", key: "music:creator", placeholder: "The creator of this playlist..." }
  ]
};

const musicRadioStation = {
  name: "Radio station details",
  elements: [
    { type: "input", label: "Creator", key: "music:creator", placeholder: "The creator of this radio station..." }
  ]
};

const musicSong = {
  name: "Song details",
  elements: [
    { type: "input", label: "Duration", placeholder: "The duration of the song...", key: "music:duration" },
    { type: "input", label: "Album", placeholder: "The album this song is from...", key: "music:album" },
    {
      type: "input",
      label: "Disc",
      placeholder: "Which disc of the album this song is on...",
      key: "music:album:disk"
    },
    { type: "input", label: "Track", placeholder: " Which track this song is...", key: "music:album:track" },
    {
      type: "input-multiple",
      label: "Musician",
      placeholder: "The musician that made this song...",
      key: "music:musician"
    }
  ]
};

const profile = {
  name: "Profile",
  elements: [
    {
      type: "input",
      label: "First name",
      placeholder: "Enter the first name of the person...",
      key: "profile:first_name"
    },
    {
      type: "input",
      label: "Last name",
      placeholder: "Enter the last name of the person...",
      key: "profile:last_name"
    },
    { type: "input", label: "Username", placeholder: "Enter the username of the person...", key: "profile:username" },
    { type: "input", label: "Gender", placeholder: "Enter the gender of the person...", key: "profile:gender" }
  ]
};

const videoMovie = {
  name: "Movie details",
  elements: [
    {
      type: "input-multiple",
      label: "Actor",
      key: "video:actor",
      placeholder: "Name of the actress/actor..."
    },
    // { type: 'input', label: 'Actor role', key: 'video:actor:role', placeholder: 'The role they played...' },
    {
      type: "input-multiple",
      label: "Director",
      key: "video:director",
      placeholder: "Name of the director..."
    },
    { type: "input-multiple", label: "Writer", key: "video:writer", placeholder: "Writers of the movie..." },
    { type: "input", label: "Duration", key: "video:duration", placeholder: "The movie's length in seconds..." },
    {
      type: "input",
      label: "Release date",
      key: "video:release_date",
      placeholder: "The date the movie was released..."
    },
    { type: "input", label: "Tag", key: "video:tag", placeholder: "Tag words associated with this movie..." }
  ]
};

const videoEpisode = {
  name: "Video episode details",
  elements: [
    ...videoMovie.elements,
    { type: "input", label: "Series", key: "video:series", placeholder: "Which series this episode belongs to..." }
  ]
};

const videoOther = {
  name: "Other video details",
  elements: [...videoMovie.elements]
};

const videoTVShow = {
  name: "TV show details",
  elements: [...videoMovie.elements]
};

const image = {
  name: "Image",
  elements: [
    {
      type: "input",
      label: "Image url",
      placeholder: "The url of your website social image...",
      key: "image"
    },
    {
      type: "input",
      label: "Image alt",
      placeholder: "The alternative text of your website social image...",
      key: "image:alt"
    },
    {
      type: "input",
      label: "Width",
      placeholder: "Width in px of your website social image...",
      key: "image:width"
    },
    {
      type: "input",
      label: "Height",
      placeholder: "Height in px of your website social image...",
      key: "image:height"
    }
  ]
};

const twitter = {
  name: "Twitter",
  elements: [
    {
      type: "select",
      options: [
        { label: "Summary", value: "summary" },
        { label: "Summary with large image", value: "summary_large_image" },
        { label: "Application", value: "app" },
        { label: "Player", value: "player" }
      ],
      label: "Card type",
      placeholder: "The Twitter card type...",
      key: "twitter:card"
    },
    {
      type: "input",
      label: "Site account",
      placeholder: "The name of the Twitter account of the site (ex: @ittoolsdottech)...",
      key: "twitter:site"
    },
    {
      type: "input",
      label: "Creator acc.",
      placeholder: "The name of the Twitter account of the creator (ex: @cthmsst)...",
      key: "twitter:creator"
    }
  ]
};

const typeOptions = [
  { label: "Website", value: "website" },
  { label: "Article", value: "article" },
  { label: "Book", value: "book" },
  { label: "Profile", value: "profile" },
  {
    type: "group",
    label: "Music",
    key: "Music",
    children: [
      { label: "Song", value: "music.song" },
      { label: "Music album", value: "music.album" },
      { label: "Playlist", value: "music.playlist" },
      { label: "Radio station", value: "music.radio_station" }
    ]
  },
  {
    type: "group",
    label: "Video",
    key: "Video",
    children: [
      { label: "Movie", value: "video.movie" },
      { label: "Episode", value: "video.episode" },
      { label: "TV show", value: "video.tv_show" },
      { label: "Other video", value: "video.other" }
    ]
  }
];
const website = {
  name: "General information",
  elements: [
    {
      type: "select",
      label: "Page type",
      placeholder: "Select the type of your website...",
      key: "type",
      options: typeOptions
    },
    { type: "input", label: "Title", placeholder: "Enter the title of your website...", key: "title" },
    {
      type: "input",
      label: "Description",
      placeholder: "Enter the description of your website...",
      key: "description"
    },
    {
      type: "input",
      label: "Page URL",
      placeholder: "Enter the url of your website...",
      key: "url"
    }
  ]
};

const ogSchemas = {
  "music.song": musicSong,
  "music.album": musicAlbum,
  "music.playlist": musicPlaylist,
  "music.radio_station": musicRadioStation,
  "video.movie": videoMovie,
  "video.episode": videoEpisode,
  "video.tv_show": videoTVShow,
  "video.other": videoOther,
  profile,
  article,
  book
};

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "meta-tag-generator",
  __ssrInlineRender: true,
  setup(__props) {
    const metadata = ref({
      "type": "website",
      "twitter:card": "summary_large_image"
    });
    watch(
      () => ref(metadata.value.type),
      (_ignored, prevSection) => {
        const section = ogSchemas[prevSection.value];
        if (!section) {
          return;
        }
        section.elements.forEach(({ key }) => {
          metadata.value[key] = "";
        });
      }
    );
    const sections = computed(() => {
      const secs = [website, image, twitter];
      const additionalSchema = ogSchemas[metadata.value.type];
      if (additionalSchema) {
        secs.push(additionalSchema);
      }
      return secs;
    });
    const metaTags = computed(() => {
      const twitterMeta = _.chain(metadata.value).pickBy((_value, k) => k.startsWith("twitter:")).mapKeys((_value, k) => k.replace(/^twitter:/, "")).value();
      const otherMeta = _.pickBy(metadata.value, (_value, k) => !k.startsWith("twitter:"));
      return generateMeta({ ...otherMeta, twitter: twitterMeta }, { generateTwitterCompatibleMeta: true });
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_n_input_group = NInputGroup;
      const _component_n_input_group_label = NInputGroupLabel;
      const _component_c_input_text = __unplugin_components_3;
      const _component_n_dynamic_input = NDynamicInput;
      const _component_c_select = __unplugin_components_0;
      const _component_n_form_item = NFormItem;
      _push(`<!--[--><div data-v-63153b5c><!--[-->`);
      ssrRenderList(unref(sections), ({ name, elements }) => {
        _push(`<div style="${ssrRenderStyle({ "margin-bottom": "15px" })}" data-v-63153b5c><div mb-5px data-v-63153b5c>${ssrInterpolate(name)}</div><!--[-->`);
        ssrRenderList(elements, ({ key, type, label, placeholder, ...element }) => {
          _push(ssrRenderComponent(_component_n_input_group, { key }, {
            default: withCtx((_2, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(_component_n_input_group_label, { style: { "flex": "0 0 110px" } }, {
                  default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`${ssrInterpolate(label)}`);
                    } else {
                      return [
                        createTextVNode(toDisplayString(label), 1)
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                if (type === "input") {
                  _push2(ssrRenderComponent(_component_c_input_text, {
                    value: unref(metadata)[key],
                    "onUpdate:value": ($event) => unref(metadata)[key] = $event,
                    placeholder,
                    clearable: ""
                  }, null, _parent2, _scopeId));
                } else if (type === "input-multiple") {
                  _push2(ssrRenderComponent(_component_n_dynamic_input, {
                    value: unref(metadata)[key],
                    "onUpdate:value": ($event) => unref(metadata)[key] = $event,
                    min: 1,
                    placeholder,
                    "default-value": [""],
                    "show-sort-button": true
                  }, null, _parent2, _scopeId));
                } else if (type === "select") {
                  _push2(ssrRenderComponent(_component_c_select, {
                    value: unref(metadata)[key],
                    "onUpdate:value": ($event) => unref(metadata)[key] = $event,
                    "w-full": "",
                    placeholder,
                    options: element.options
                  }, null, _parent2, _scopeId));
                } else {
                  _push2(`<!---->`);
                }
              } else {
                return [
                  createVNode(_component_n_input_group_label, { style: { "flex": "0 0 110px" } }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(label), 1)
                    ]),
                    _: 2
                  }, 1024),
                  type === "input" ? (openBlock(), createBlock(_component_c_input_text, {
                    key: 0,
                    value: unref(metadata)[key],
                    "onUpdate:value": ($event) => unref(metadata)[key] = $event,
                    placeholder,
                    clearable: ""
                  }, null, 8, ["value", "onUpdate:value", "placeholder"])) : type === "input-multiple" ? (openBlock(), createBlock(_component_n_dynamic_input, {
                    key: 1,
                    value: unref(metadata)[key],
                    "onUpdate:value": ($event) => unref(metadata)[key] = $event,
                    min: 1,
                    placeholder,
                    "default-value": [""],
                    "show-sort-button": true
                  }, null, 8, ["value", "onUpdate:value", "placeholder"])) : type === "select" ? (openBlock(), createBlock(_component_c_select, {
                    key: 2,
                    value: unref(metadata)[key],
                    "onUpdate:value": ($event) => unref(metadata)[key] = $event,
                    "w-full": "",
                    placeholder,
                    options: element.options
                  }, null, 8, ["value", "onUpdate:value", "placeholder", "options"])) : createCommentVNode("", true)
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div>`);
      });
      _push(`<!--]--></div><div data-v-63153b5c>`);
      _push(ssrRenderComponent(_component_n_form_item, { label: "Your meta tags" }, {
        default: withCtx((_2, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(TextareaCopyable, {
              value: unref(metaTags),
              language: "html"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(TextareaCopyable, {
                value: unref(metaTags),
                language: "html"
              }, null, 8, ["value"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><!--]-->`);
    };
  }
});

/* unplugin-vue-components disabled */const metaTagGenerator_vue_vue_type_style_index_0_scoped_63153b5c_lang = '';

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/tools/meta-tag-generator/meta-tag-generator.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const metaTagGenerator = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-63153b5c"]]);

export { metaTagGenerator as default };
