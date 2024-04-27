import { defineComponent, toRefs, mergeProps, unref, withCtx, createVNode, useSSRContext, isRef } from 'vue';
import { ssrRenderComponent, ssrRenderAttrs, ssrRenderList } from 'vue/server-renderer';
import { format } from 'prettier';
import htmlParser from 'prettier/plugins/html';
import { useVModel, tryOnBeforeUnmount, useStorage, asyncComputed } from '@vueuse/core';
import { NIcon, NDivider, useThemeVars } from 'naive-ui';
import { _ as _sfc_main$4, a as __unplugin_components_1 } from './chunk-8109fd17.js';
import { Editor as Editor$1, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, Strikethrough, Code, H1, H2, H3, H4, List, ListNumbers, CodePlus, Blockquote, TextWrap, ClearFormatting, ArrowBack, ArrowForwardUp } from '@vicons/tabler';
import { a as __unplugin_components_0, _ as _export_sfc } from './chunk-6003391e.js';
import { T as TextareaCopyable } from './chunk-727cc0fb.js';
import 'pinia';
import 'highlight.js/lib/core';
import 'highlight.js/lib/languages/json';
import 'highlight.js/lib/languages/sql';
import 'highlight.js/lib/languages/xml';
import 'highlight.js/lib/languages/yaml';
import 'highlight.js/lib/languages/ini';
import './chunk-77c5cc16.js';

const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "menu-bar-item",
  __ssrInlineRender: true,
  props: {
    icon: {},
    title: {},
    action: { type: Function },
    isActive: { type: Function }
  },
  setup(__props) {
    const props = __props;
    const { icon, title, action, isActive } = toRefs(props);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_c_tooltip = _sfc_main$4;
      const _component_c_button = __unplugin_components_0;
      const _component_n_icon = NIcon;
      _push(ssrRenderComponent(_component_c_tooltip, mergeProps({ tooltip: unref(title) }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_c_button, {
              circle: "",
              variant: "text",
              type: unref(isActive)?.() ? "primary" : "default",
              onClick: unref(action)
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_n_icon, { component: unref(icon) }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_n_icon, { component: unref(icon) }, null, 8, ["component"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_c_button, {
                circle: "",
                variant: "text",
                type: unref(isActive)?.() ? "primary" : "default",
                onClick: unref(action)
              }, {
                default: withCtx(() => [
                  createVNode(_component_n_icon, { component: unref(icon) }, null, 8, ["component"])
                ]),
                _: 1
              }, 8, ["type", "onClick"])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});

const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/tools/html-wysiwyg-editor/editor/menu-bar-item.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};

const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "menu-bar",
  __ssrInlineRender: true,
  props: {
    editor: {}
  },
  setup(__props) {
    const props = __props;
    const { editor } = toRefs(props);
    const items = [
      {
        type: "button",
        icon: Bold,
        title: "Bold",
        action: () => editor.value.chain().focus().toggleBold().run(),
        isActive: () => editor.value.isActive("bold")
      },
      {
        type: "button",
        icon: Italic,
        title: "Italic",
        action: () => editor.value.chain().focus().toggleItalic().run(),
        isActive: () => editor.value.isActive("italic")
      },
      {
        type: "button",
        icon: Strikethrough,
        title: "Strike",
        action: () => editor.value.chain().focus().toggleStrike().run(),
        isActive: () => editor.value.isActive("strike")
      },
      {
        type: "button",
        icon: Code,
        title: "Inline code",
        action: () => editor.value.chain().focus().toggleCode().run(),
        isActive: () => editor.value.isActive("code")
      },
      {
        type: "divider"
      },
      {
        type: "button",
        icon: H1,
        title: "Heading 1",
        action: () => editor.value.chain().focus().toggleHeading({ level: 1 }).run(),
        isActive: () => editor.value.isActive("heading", { level: 1 })
      },
      {
        type: "button",
        icon: H2,
        title: "Heading 2",
        action: () => editor.value.chain().focus().toggleHeading({ level: 2 }).run(),
        isActive: () => editor.value.isActive("heading", { level: 2 })
      },
      {
        type: "button",
        icon: H3,
        title: "Heading 3",
        action: () => editor.value.chain().focus().toggleHeading({ level: 4 }).run(),
        isActive: () => editor.value.isActive("heading", { level: 4 })
      },
      {
        type: "button",
        icon: H4,
        title: "Heading 4",
        action: () => editor.value.chain().focus().toggleHeading({ level: 4 }).run(),
        isActive: () => editor.value.isActive("heading", { level: 4 })
      },
      {
        type: "divider"
      },
      {
        type: "button",
        icon: List,
        title: "Bullet list",
        action: () => editor.value.chain().focus().toggleBulletList().run(),
        isActive: () => editor.value.isActive("bulletList")
      },
      {
        type: "button",
        icon: ListNumbers,
        title: "Ordered list",
        action: () => editor.value.chain().focus().toggleOrderedList().run(),
        isActive: () => editor.value.isActive("orderedList")
      },
      {
        type: "button",
        icon: CodePlus,
        title: "Code block",
        action: () => editor.value.chain().focus().toggleCodeBlock().run(),
        isActive: () => editor.value.isActive("codeBlock")
      },
      {
        type: "button",
        icon: Blockquote,
        title: "Blockquote",
        action: () => editor.value.chain().focus().toggleBlockquote().run(),
        isActive: () => editor.value.isActive("blockquote")
      },
      {
        type: "divider"
      },
      {
        type: "button",
        icon: TextWrap,
        title: "Hard break",
        action: () => editor.value.chain().focus().setHardBreak().run()
      },
      {
        type: "button",
        icon: ClearFormatting,
        title: "Clear format",
        action: () => editor.value.chain().focus().clearNodes().unsetAllMarks().run()
      },
      {
        type: "button",
        icon: ArrowBack,
        title: "Undo",
        action: () => editor.value.chain().focus().undo().run()
      },
      {
        type: "button",
        icon: ArrowForwardUp,
        title: "Redo",
        action: () => editor.value.chain().focus().redo().run()
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_n_divider = NDivider;
      _push(`<div${ssrRenderAttrs(mergeProps({
        flex: "",
        "items-center": ""
      }, _attrs))}><!--[-->`);
      ssrRenderList(items, (item, index) => {
        _push(`<!--[-->`);
        if (item.type === "divider") {
          _push(ssrRenderComponent(_component_n_divider, {
            key: `divider${index}`,
            vertical: ""
          }, null, _parent));
        } else if (item.type === "button") {
          _push(ssrRenderComponent(_sfc_main$3, mergeProps({ key: index }, item), null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      });
      _push(`<!--]--></div>`);
    };
  }
});

const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/tools/html-wysiwyg-editor/editor/menu-bar.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "editor",
  __ssrInlineRender: true,
  props: {
    html: {}
  },
  emits: ["update:html"],
  setup(__props, { emit }) {
    const props = __props;
    const themeVars = useThemeVars();
    const html = useVModel(props, "html", emit);
    const editor = new Editor$1({
      content: html.value,
      extensions: [StarterKit]
    });
    editor.on("update", ({ editor: editor2 }) => emit("update:html", editor2.getHTML()));
    tryOnBeforeUnmount(() => {
      editor.destroy();
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_c_card = __unplugin_components_1;
      const _component_n_divider = NDivider;
      const _cssVars = { style: {
        "--99251dac": unref(themeVars).codeColor
      } };
      if (unref(editor)) {
        _push(ssrRenderComponent(_component_c_card, mergeProps({ "important:p0": "" }, _attrs, _cssVars), {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_sfc_main$2, {
                class: "editor-header",
                editor: unref(editor)
              }, null, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_n_divider, { style: { "margin-top": "0" } }, null, _parent2, _scopeId));
              _push2(`<div px8 pb6 data-v-3bc77d7d${_scopeId}>`);
              _push2(ssrRenderComponent(unref(EditorContent), {
                class: "editor-content",
                editor: unref(editor)
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              return [
                createVNode(_sfc_main$2, {
                  class: "editor-header",
                  editor: unref(editor)
                }, null, 8, ["editor"]),
                createVNode(_component_n_divider, { style: { "margin-top": "0" } }),
                createVNode("div", {
                  px8: "",
                  pb6: ""
                }, [
                  createVNode(unref(EditorContent), {
                    class: "editor-content",
                    editor: unref(editor)
                  }, null, 8, ["editor"])
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
    };
  }
});

/* unplugin-vue-components disabled */const editor_vue_vue_type_style_index_0_scoped_3bc77d7d_lang = '';

/* unplugin-vue-components disabled */const editor_vue_vue_type_style_index_1_scoped_3bc77d7d_lang = '';

const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/tools/html-wysiwyg-editor/editor/editor.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const Editor = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-3bc77d7d"]]);

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "html-wysiwyg-editor",
  __ssrInlineRender: true,
  setup(__props) {
    const html = useStorage("html-wysiwyg-editor--html", "<h1>Hey!</h1><p>Welcome to this html wysiwyg editor</p>");
    const formattedHtml = asyncComputed(() => format(html.value, { parser: "html", plugins: [htmlParser] }), "");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(Editor, {
        html: unref(html),
        "onUpdate:html": ($event) => isRef(html) ? html.value = $event : null
      }, null, _parent));
      _push(ssrRenderComponent(TextareaCopyable, {
        value: unref(formattedHtml),
        language: "html"
      }, null, _parent));
      _push(`<!--]-->`);
    };
  }
});

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/tools/html-wysiwyg-editor/html-wysiwyg-editor.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
