import { openBlock, createElementBlock, createElementVNode, computed, ref, defineComponent, watchEffect, onBeforeUnmount, unref, withCtx, createTextVNode, createBlock, createVNode, isRef, createCommentVNode, toDisplayString, useSSRContext } from 'vue';
import { _ as __unplugin_components_0$1 } from './chunk-89a4876c.js';
import { a as __unplugin_components_0 } from './chunk-6003391e.js';
import { _ as __unplugin_components_3 } from './chunk-28375bc9.js';
import { a as __unplugin_components_1 } from './chunk-8109fd17.js';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
import _ from 'lodash';
import { createEventHook, useDevicesList, useUserMedia } from '@vueuse/core';
import './chunk-bb5bb4f6.js';
import './chunk-2ce6ed5e.js';
import 'fuse.js';
import 'pinia';

const _hoisted_1$6 = {
  viewBox: "0 0 24 24",
  width: "1.2em",
  height: "1.2em"
};
const _hoisted_2$6 = /*#__PURE__*/createElementVNode("path", {
  fill: "currentColor",
  d: "M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12M8 9h8v10H8V9m7.5-5l-1-1h-5l-1 1H5v2h14V4h-3.5Z"
}, null, -1);
const _hoisted_3$6 = [
  _hoisted_2$6
];

function render$6(_ctx, _cache) {
  return (openBlock(), createElementBlock("svg", _hoisted_1$6, _hoisted_3$6))
}

const __unplugin_components_10 = { name: 'mdi-delete-outline', render: render$6 };
/* vite-plugin-components disabled */

const _hoisted_1$5 = {
  viewBox: "0 0 24 24",
  width: "1.2em",
  height: "1.2em"
};
const _hoisted_2$5 = /*#__PURE__*/createElementVNode("path", {
  fill: "currentColor",
  d: "M5 20h14v-2H5m14-9h-4V3H9v6H5l7 7l7-7Z"
}, null, -1);
const _hoisted_3$5 = [
  _hoisted_2$5
];

function render$5(_ctx, _cache) {
  return (openBlock(), createElementBlock("svg", _hoisted_1$5, _hoisted_3$5))
}

const __unplugin_components_9 = { name: 'mdi-download', render: render$5 };
/* vite-plugin-components disabled */

const _hoisted_1$4 = {
  viewBox: "0 0 24 24",
  width: "1.2em",
  height: "1.2em"
};
const _hoisted_2$4 = /*#__PURE__*/createElementVNode("path", {
  fill: "currentColor",
  d: "M19 12c0 3.86-3.14 7-7 7s-7-3.14-7-7s3.14-7 7-7s7 3.14 7 7Z"
}, null, -1);
const _hoisted_3$4 = [
  _hoisted_2$4
];

function render$4(_ctx, _cache) {
  return (openBlock(), createElementBlock("svg", _hoisted_1$4, _hoisted_3$4))
}

const __unplugin_components_8 = { name: 'mdi-record', render: render$4 };
/* vite-plugin-components disabled */

const _hoisted_1$3 = {
  viewBox: "0 0 24 24",
  width: "1.2em",
  height: "1.2em"
};
const _hoisted_2$3 = /*#__PURE__*/createElementVNode("path", {
  fill: "currentColor",
  d: "M8 5.14v14l11-7l-11-7Z"
}, null, -1);
const _hoisted_3$3 = [
  _hoisted_2$3
];

function render$3(_ctx, _cache) {
  return (openBlock(), createElementBlock("svg", _hoisted_1$3, _hoisted_3$3))
}

const __unplugin_components_7 = { name: 'mdi-play', render: render$3 };
/* vite-plugin-components disabled */

const _hoisted_1$2 = {
  viewBox: "0 0 24 24",
  width: "1.2em",
  height: "1.2em"
};
const _hoisted_2$2 = /*#__PURE__*/createElementVNode("path", {
  fill: "currentColor",
  d: "M14 19h4V5h-4M6 19h4V5H6v14Z"
}, null, -1);
const _hoisted_3$2 = [
  _hoisted_2$2
];

function render$2(_ctx, _cache) {
  return (openBlock(), createElementBlock("svg", _hoisted_1$2, _hoisted_3$2))
}

const __unplugin_components_6 = { name: 'mdi-pause', render: render$2 };
/* vite-plugin-components disabled */

const _hoisted_1$1 = {
  viewBox: "0 0 24 24",
  width: "1.2em",
  height: "1.2em"
};
const _hoisted_2$1 = /*#__PURE__*/createElementVNode("path", {
  fill: "currentColor",
  d: "M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 4v-11l-4 4Z"
}, null, -1);
const _hoisted_3$1 = [
  _hoisted_2$1
];

function render$1(_ctx, _cache) {
  return (openBlock(), createElementBlock("svg", _hoisted_1$1, _hoisted_3$1))
}

const __unplugin_components_5 = { name: 'mdi-video', render: render$1 };
/* vite-plugin-components disabled */

const _hoisted_1 = {
  viewBox: "0 0 24 24",
  width: "1.2em",
  height: "1.2em"
};
const _hoisted_2 = /*#__PURE__*/createElementVNode("path", {
  fill: "currentColor",
  d: "M4 4h3l2-2h6l2 2h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2m8 3a5 5 0 0 0-5 5a5 5 0 0 0 5 5a5 5 0 0 0 5-5a5 5 0 0 0-5-5m0 2a3 3 0 0 1 3 3a3 3 0 0 1-3 3a3 3 0 0 1-3-3a3 3 0 0 1 3-3Z"
}, null, -1);
const _hoisted_3 = [
  _hoisted_2
];

function render(_ctx, _cache) {
  return (openBlock(), createElementBlock("svg", _hoisted_1, _hoisted_3))
}

const __unplugin_components_4 = { name: 'mdi-camera', render };
/* vite-plugin-components disabled */

function useMediaRecorder({ stream }) {
  const isRecordingSupported = computed(() => MediaRecorder.isTypeSupported("video/webm"));
  const mediaRecorder = ref(null);
  const recordedChunks = ref([]);
  const recordAvailable = createEventHook();
  const recordingState = ref("stopped");
  const createVideo = () => {
    const blob = new Blob(recordedChunks.value, { type: "video/webm" });
    const url = URL.createObjectURL(blob);
    recordedChunks.value = [];
    return url;
  };
  const startRecording = () => {
    if (!isRecordingSupported.value) {
      return;
    }
    if (!stream.value) {
      return;
    }
    if (recordingState.value !== "stopped") {
      return;
    }
    mediaRecorder.value = new MediaRecorder(stream.value, { mimeType: "video/webm" });
    mediaRecorder.value.ondataavailable = (e) => {
      if (e.data.size > 0) {
        recordedChunks.value.push(e.data);
      }
    };
    mediaRecorder.value.onstop = () => {
      recordAvailable.trigger(createVideo());
    };
    if (mediaRecorder.value.state !== "inactive") {
      return;
    }
    mediaRecorder.value.start();
    recordingState.value = "recording";
  };
  const stopRecording = () => {
    if (!isRecordingSupported.value) {
      return;
    }
    if (!mediaRecorder.value) {
      return;
    }
    if (recordingState.value === "stopped") {
      return;
    }
    mediaRecorder.value.stop();
    recordingState.value = "stopped";
  };
  const pauseRecording = () => {
    if (!isRecordingSupported.value) {
      return;
    }
    if (!mediaRecorder.value) {
      return;
    }
    if (recordingState.value !== "recording") {
      return;
    }
    mediaRecorder.value.pause();
    recordingState.value = "paused";
  };
  const resumeRecording = () => {
    if (!isRecordingSupported.value) {
      return;
    }
    if (!mediaRecorder.value) {
      return;
    }
    if (recordingState.value !== "paused") {
      return;
    }
    mediaRecorder.value.resume();
    recordingState.value = "recording";
  };
  return {
    isRecordingSupported,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    recordingState,
    onRecordAvailable: recordAvailable.on
  };
}

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "camera-recorder",
  __ssrInlineRender: true,
  setup(__props) {
    const {
      videoInputs: cameras,
      audioInputs: microphones,
      permissionGranted,
      isSupported,
      ensurePermissions
    } = useDevicesList({
      requestPermissions: true,
      constraints: { video: true, audio: true },
      onUpdated() {
        refreshCurrentDevices();
      }
    });
    const video = ref();
    const medias = ref([]);
    const currentCamera = ref(cameras.value[0]?.deviceId);
    const currentMicrophone = ref(microphones.value[0]?.deviceId);
    const permissionCannotBePrompted = ref(false);
    const {
      stream,
      start,
      stop,
      enabled: isMediaStreamAvailable
    } = useUserMedia({
      constraints: computed(() => ({
        video: { deviceId: currentCamera.value },
        ...currentMicrophone.value ? { audio: { deviceId: currentMicrophone.value } } : {}
      })),
      autoSwitch: true
    });
    const {
      isRecordingSupported,
      onRecordAvailable,
      startRecording,
      stopRecording,
      pauseRecording,
      recordingState,
      resumeRecording
    } = useMediaRecorder({
      stream
    });
    onRecordAvailable((value) => {
      medias.value.unshift({ type: "video", value, createdAt: /* @__PURE__ */ new Date() });
    });
    function refreshCurrentDevices() {
      if (_.isNil(currentCamera) || !cameras.value.find((i) => i.deviceId === currentCamera.value)) {
        currentCamera.value = cameras.value[0]?.deviceId;
      }
      if (_.isNil(microphones) || !microphones.value.find((i) => i.deviceId === currentMicrophone.value)) {
        currentMicrophone.value = microphones.value[0]?.deviceId;
      }
    }
    function takeScreenshot() {
      if (!video.value) {
        return;
      }
      const canvas = document.createElement("canvas");
      canvas.width = video.value.videoWidth;
      canvas.height = video.value.videoHeight;
      canvas.getContext("2d")?.drawImage(video.value, 0, 0);
      const image = canvas.toDataURL("image/png");
      medias.value.unshift({ type: "image", value: image, createdAt: /* @__PURE__ */ new Date() });
    }
    watchEffect(() => {
      if (video.value && stream.value) {
        video.value.srcObject = stream.value;
      }
    });
    onBeforeUnmount(() => stop());
    async function requestPermissions() {
      try {
        await ensurePermissions();
      } catch (e) {
        permissionCannotBePrompted.value = true;
      }
    }
    function downloadMedia({ type, value, createdAt }) {
      const link = document.createElement("a");
      link.href = value;
      link.download = `${type}-${createdAt.getTime()}.${type === "image" ? "png" : "webm"}`;
      link.click();
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_c_card = __unplugin_components_1;
      const _component_c_alert = __unplugin_components_3;
      const _component_c_button = __unplugin_components_0;
      const _component_c_select = __unplugin_components_0$1;
      const _component_icon_mdi_camera = __unplugin_components_4;
      const _component_icon_mdi_video = __unplugin_components_5;
      const _component_icon_mdi_pause = __unplugin_components_6;
      const _component_icon_mdi_play = __unplugin_components_7;
      const _component_icon_mdi_record = __unplugin_components_8;
      const _component_icon_mdi_download = __unplugin_components_9;
      const _component_icon_mdi_delete_outline = __unplugin_components_10;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      if (!unref(isSupported)) {
        _push(ssrRenderComponent(_component_c_card, null, {
          default: withCtx((_2, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Your browser does not support recording video from camera `);
            } else {
              return [
                createTextVNode(" Your browser does not support recording video from camera ")
              ];
            }
          }),
          _: 1
        }, _parent));
      } else if (!unref(permissionGranted)) {
        _push(ssrRenderComponent(_component_c_card, { "text-center": "" }, {
          default: withCtx((_2, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` You need to grant permission to use your camera and microphone `);
              if (unref(permissionCannotBePrompted)) {
                _push2(ssrRenderComponent(_component_c_alert, {
                  "mt-4": "",
                  "text-left": ""
                }, {
                  default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(` Your browser has blocked permission request or does not support it. You need to grant permission manually in your browser settings (usually the lock icon in the address bar). `);
                    } else {
                      return [
                        createTextVNode(" Your browser has blocked permission request or does not support it. You need to grant permission manually in your browser settings (usually the lock icon in the address bar). ")
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                _push2(`<div mt-4 flex justify-center${_scopeId}>`);
                _push2(ssrRenderComponent(_component_c_button, { onClick: requestPermissions }, {
                  default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(` Grant permission `);
                    } else {
                      return [
                        createTextVNode(" Grant permission ")
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
                _push2(`</div>`);
              }
            } else {
              return [
                createTextVNode(" You need to grant permission to use your camera and microphone "),
                unref(permissionCannotBePrompted) ? (openBlock(), createBlock(_component_c_alert, {
                  key: 0,
                  "mt-4": "",
                  "text-left": ""
                }, {
                  default: withCtx(() => [
                    createTextVNode(" Your browser has blocked permission request or does not support it. You need to grant permission manually in your browser settings (usually the lock icon in the address bar). ")
                  ]),
                  _: 1
                })) : (openBlock(), createBlock("div", {
                  key: 1,
                  "mt-4": "",
                  flex: "",
                  "justify-center": ""
                }, [
                  createVNode(_component_c_button, { onClick: requestPermissions }, {
                    default: withCtx(() => [
                      createTextVNode(" Grant permission ")
                    ]),
                    _: 1
                  })
                ]))
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(ssrRenderComponent(_component_c_card, null, {
          default: withCtx((_2, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div flex flex-col gap-2${_scopeId}>`);
              _push2(ssrRenderComponent(_component_c_select, {
                value: unref(currentCamera),
                "onUpdate:value": ($event) => isRef(currentCamera) ? currentCamera.value = $event : null,
                "label-position": "left",
                "label-width": "60px",
                label: "Video:",
                options: unref(cameras).map(({ deviceId, label }) => ({ value: deviceId, label })),
                placeholder: "Select camera"
              }, null, _parent2, _scopeId));
              if (unref(currentMicrophone) && unref(microphones).length > 0) {
                _push2(ssrRenderComponent(_component_c_select, {
                  value: unref(currentMicrophone),
                  "onUpdate:value": ($event) => isRef(currentMicrophone) ? currentMicrophone.value = $event : null,
                  label: "Audio:",
                  "label-position": "left",
                  "label-width": "60px",
                  options: unref(microphones).map(({ deviceId, label }) => ({ value: deviceId, label })),
                  placeholder: "Select microphone"
                }, null, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
              if (!unref(isMediaStreamAvailable)) {
                _push2(`<div mt-3 flex justify-center${_scopeId}>`);
                _push2(ssrRenderComponent(_component_c_button, {
                  type: "primary",
                  onClick: unref(start)
                }, {
                  default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(` Start webcam `);
                    } else {
                      return [
                        createTextVNode(" Start webcam ")
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
                _push2(`</div>`);
              } else {
                _push2(`<div${_scopeId}><div my-2${_scopeId}><video autoplay controls playsinline max-h-full w-full${_scopeId}></video></div><div flex items-center justify-between gap-2${_scopeId}>`);
                _push2(ssrRenderComponent(_component_c_button, {
                  disabled: !unref(isMediaStreamAvailable),
                  onClick: takeScreenshot
                }, {
                  default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<span mr-2${_scopeId2}>`);
                      _push3(ssrRenderComponent(_component_icon_mdi_camera, null, null, _parent3, _scopeId2));
                      _push3(`</span> Take screenshot `);
                    } else {
                      return [
                        createVNode("span", { "mr-2": "" }, [
                          createVNode(_component_icon_mdi_camera)
                        ]),
                        createTextVNode(" Take screenshot ")
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
                if (unref(isRecordingSupported)) {
                  _push2(`<div flex justify-center gap-2${_scopeId}>`);
                  if (unref(recordingState) === "stopped") {
                    _push2(ssrRenderComponent(_component_c_button, { onClick: unref(startRecording) }, {
                      default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                        if (_push3) {
                          _push3(`<span mr-2${_scopeId2}>`);
                          _push3(ssrRenderComponent(_component_icon_mdi_video, null, null, _parent3, _scopeId2));
                          _push3(`</span> Start recording `);
                        } else {
                          return [
                            createVNode("span", { "mr-2": "" }, [
                              createVNode(_component_icon_mdi_video)
                            ]),
                            createTextVNode(" Start recording ")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent2, _scopeId));
                  } else {
                    _push2(`<!---->`);
                  }
                  if (unref(recordingState) === "recording") {
                    _push2(ssrRenderComponent(_component_c_button, { onClick: unref(pauseRecording) }, {
                      default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                        if (_push3) {
                          _push3(`<span mr-2${_scopeId2}>`);
                          _push3(ssrRenderComponent(_component_icon_mdi_pause, null, null, _parent3, _scopeId2));
                          _push3(`</span> Pause `);
                        } else {
                          return [
                            createVNode("span", { "mr-2": "" }, [
                              createVNode(_component_icon_mdi_pause)
                            ]),
                            createTextVNode(" Pause ")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent2, _scopeId));
                  } else {
                    _push2(`<!---->`);
                  }
                  if (unref(recordingState) === "paused") {
                    _push2(ssrRenderComponent(_component_c_button, { onClick: unref(resumeRecording) }, {
                      default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                        if (_push3) {
                          _push3(`<span mr-2${_scopeId2}>`);
                          _push3(ssrRenderComponent(_component_icon_mdi_play, null, null, _parent3, _scopeId2));
                          _push3(`</span> Resume `);
                        } else {
                          return [
                            createVNode("span", { "mr-2": "" }, [
                              createVNode(_component_icon_mdi_play)
                            ]),
                            createTextVNode(" Resume ")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent2, _scopeId));
                  } else {
                    _push2(`<!---->`);
                  }
                  if (unref(recordingState) !== "stopped") {
                    _push2(ssrRenderComponent(_component_c_button, {
                      type: "error",
                      onClick: unref(stopRecording)
                    }, {
                      default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                        if (_push3) {
                          _push3(`<span mr-2${_scopeId2}>`);
                          _push3(ssrRenderComponent(_component_icon_mdi_record, null, null, _parent3, _scopeId2));
                          _push3(`</span> Stop `);
                        } else {
                          return [
                            createVNode("span", { "mr-2": "" }, [
                              createVNode(_component_icon_mdi_record)
                            ]),
                            createTextVNode(" Stop ")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent2, _scopeId));
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`</div>`);
                } else {
                  _push2(`<div italic op-60${_scopeId}> Video recording is not supported in your browser </div>`);
                }
                _push2(`</div></div>`);
              }
            } else {
              return [
                createVNode("div", {
                  flex: "",
                  "flex-col": "",
                  "gap-2": ""
                }, [
                  createVNode(_component_c_select, {
                    value: unref(currentCamera),
                    "onUpdate:value": ($event) => isRef(currentCamera) ? currentCamera.value = $event : null,
                    "label-position": "left",
                    "label-width": "60px",
                    label: "Video:",
                    options: unref(cameras).map(({ deviceId, label }) => ({ value: deviceId, label })),
                    placeholder: "Select camera"
                  }, null, 8, ["value", "onUpdate:value", "options"]),
                  unref(currentMicrophone) && unref(microphones).length > 0 ? (openBlock(), createBlock(_component_c_select, {
                    key: 0,
                    value: unref(currentMicrophone),
                    "onUpdate:value": ($event) => isRef(currentMicrophone) ? currentMicrophone.value = $event : null,
                    label: "Audio:",
                    "label-position": "left",
                    "label-width": "60px",
                    options: unref(microphones).map(({ deviceId, label }) => ({ value: deviceId, label })),
                    placeholder: "Select microphone"
                  }, null, 8, ["value", "onUpdate:value", "options"])) : createCommentVNode("", true)
                ]),
                !unref(isMediaStreamAvailable) ? (openBlock(), createBlock("div", {
                  key: 0,
                  "mt-3": "",
                  flex: "",
                  "justify-center": ""
                }, [
                  createVNode(_component_c_button, {
                    type: "primary",
                    onClick: unref(start)
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" Start webcam ")
                    ]),
                    _: 1
                  }, 8, ["onClick"])
                ])) : (openBlock(), createBlock("div", { key: 1 }, [
                  createVNode("div", { "my-2": "" }, [
                    createVNode("video", {
                      ref_key: "video",
                      ref: video,
                      autoplay: "",
                      controls: "",
                      playsinline: "",
                      "max-h-full": "",
                      "w-full": ""
                    }, null, 512)
                  ]),
                  createVNode("div", {
                    flex: "",
                    "items-center": "",
                    "justify-between": "",
                    "gap-2": ""
                  }, [
                    createVNode(_component_c_button, {
                      disabled: !unref(isMediaStreamAvailable),
                      onClick: takeScreenshot
                    }, {
                      default: withCtx(() => [
                        createVNode("span", { "mr-2": "" }, [
                          createVNode(_component_icon_mdi_camera)
                        ]),
                        createTextVNode(" Take screenshot ")
                      ]),
                      _: 1
                    }, 8, ["disabled"]),
                    unref(isRecordingSupported) ? (openBlock(), createBlock("div", {
                      key: 0,
                      flex: "",
                      "justify-center": "",
                      "gap-2": ""
                    }, [
                      unref(recordingState) === "stopped" ? (openBlock(), createBlock(_component_c_button, {
                        key: 0,
                        onClick: unref(startRecording)
                      }, {
                        default: withCtx(() => [
                          createVNode("span", { "mr-2": "" }, [
                            createVNode(_component_icon_mdi_video)
                          ]),
                          createTextVNode(" Start recording ")
                        ]),
                        _: 1
                      }, 8, ["onClick"])) : createCommentVNode("", true),
                      unref(recordingState) === "recording" ? (openBlock(), createBlock(_component_c_button, {
                        key: 1,
                        onClick: unref(pauseRecording)
                      }, {
                        default: withCtx(() => [
                          createVNode("span", { "mr-2": "" }, [
                            createVNode(_component_icon_mdi_pause)
                          ]),
                          createTextVNode(" Pause ")
                        ]),
                        _: 1
                      }, 8, ["onClick"])) : createCommentVNode("", true),
                      unref(recordingState) === "paused" ? (openBlock(), createBlock(_component_c_button, {
                        key: 2,
                        onClick: unref(resumeRecording)
                      }, {
                        default: withCtx(() => [
                          createVNode("span", { "mr-2": "" }, [
                            createVNode(_component_icon_mdi_play)
                          ]),
                          createTextVNode(" Resume ")
                        ]),
                        _: 1
                      }, 8, ["onClick"])) : createCommentVNode("", true),
                      unref(recordingState) !== "stopped" ? (openBlock(), createBlock(_component_c_button, {
                        key: 3,
                        type: "error",
                        onClick: unref(stopRecording)
                      }, {
                        default: withCtx(() => [
                          createVNode("span", { "mr-2": "" }, [
                            createVNode(_component_icon_mdi_record)
                          ]),
                          createTextVNode(" Stop ")
                        ]),
                        _: 1
                      }, 8, ["onClick"])) : createCommentVNode("", true)
                    ])) : (openBlock(), createBlock("div", {
                      key: 1,
                      italic: "",
                      "op-60": ""
                    }, " Video recording is not supported in your browser "))
                  ])
                ]))
              ];
            }
          }),
          _: 1
        }, _parent));
      }
      _push(`<div grid grid-cols-2 mt-5 gap-2><!--[-->`);
      ssrRenderList(unref(medias), ({ type, value, createdAt }, index) => {
        _push(ssrRenderComponent(_component_c_card, { key: index }, {
          default: withCtx((_2, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (type === "image") {
                _push2(`<img${ssrRenderAttr("src", value)} max-h-full w-full alt="screenshot"${_scopeId}>`);
              } else {
                _push2(`<video${ssrRenderAttr("src", value)} controls max-h-full w-full${_scopeId}></video>`);
              }
              _push2(`<div flex items-center justify-between${_scopeId}><div font-bold${_scopeId}>${ssrInterpolate(type === "image" ? "Screenshot" : "Video")}</div><div flex gap-2${_scopeId}>`);
              _push2(ssrRenderComponent(_component_c_button, {
                onClick: ($event) => downloadMedia({ type, value, createdAt })
              }, {
                default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_icon_mdi_download, null, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_icon_mdi_download)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_c_button, {
                onClick: ($event) => medias.value = unref(medias).filter((_ignored, i) => i !== index)
              }, {
                default: withCtx((_3, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_icon_mdi_delete_outline, null, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_icon_mdi_delete_outline)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(`</div></div>`);
            } else {
              return [
                type === "image" ? (openBlock(), createBlock("img", {
                  key: 0,
                  src: value,
                  "max-h-full": "",
                  "w-full": "",
                  alt: "screenshot"
                }, null, 8, ["src"])) : (openBlock(), createBlock("video", {
                  key: 1,
                  src: value,
                  controls: "",
                  "max-h-full": "",
                  "w-full": ""
                }, null, 8, ["src"])),
                createVNode("div", {
                  flex: "",
                  "items-center": "",
                  "justify-between": ""
                }, [
                  createVNode("div", { "font-bold": "" }, toDisplayString(type === "image" ? "Screenshot" : "Video"), 1),
                  createVNode("div", {
                    flex: "",
                    "gap-2": ""
                  }, [
                    createVNode(_component_c_button, {
                      onClick: ($event) => downloadMedia({ type, value, createdAt })
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_icon_mdi_download)
                      ]),
                      _: 2
                    }, 1032, ["onClick"]),
                    createVNode(_component_c_button, {
                      onClick: ($event) => medias.value = unref(medias).filter((_ignored, i) => i !== index)
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_icon_mdi_delete_outline)
                      ]),
                      _: 2
                    }, 1032, ["onClick"])
                  ])
                ])
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div></div>`);
    };
  }
});

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/tools/camera-recorder/camera-recorder.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
