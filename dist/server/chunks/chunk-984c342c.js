import { _ as _sfc_main$1 } from './chunk-de61ec1c.js';
import { NDivider } from 'naive-ui';
import { _ as __unplugin_components_0 } from './chunk-89a4876c.js';
import { _ as __unplugin_components_3 } from './chunk-4e7a6a8d.js';
import { defineComponent, ref, computed, unref, isRef, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList } from 'vue/server-renderer';
import { formatISO, parseISO, formatISO9075, formatRFC3339, formatRFC7231, getUnixTime, fromUnixTime, getTime, parseJSON, isDate, isValid } from 'date-fns';
import _ from 'lodash';
import { w as withDefaultOnError } from './chunk-f1b4cc24.js';
import { u as useValidation } from './chunk-35c3d701.js';
import { useNow } from '@vueuse/core';
import './chunk-95ec8cf7.js';
import './chunk-6003391e.js';
import 'pinia';
import './chunk-8109fd17.js';
import './chunk-77c5cc16.js';
import './chunk-bb5bb4f6.js';
import './chunk-2ce6ed5e.js';
import 'fuse.js';
import './chunk-11f44f81.js';

const ISO8601_REGEX = /^([+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24:?00)([.,]\d+(?!:))?)?(\17[0-5]\d([.,]\d+)?)?([zZ]|([+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;
const ISO9075_REGEX = /^([0-9]{4})-([0-9]{2})-([0-9]{2}) ([0-9]{2}):([0-9]{2}):([0-9]{2})(\.[0-9]{1,6})?(([+-])([0-9]{2}):([0-9]{2})|Z)?$/;
const RFC3339_REGEX = /^([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2}):([0-9]{2})(\.[0-9]{1,9})?(([+-])([0-9]{2}):([0-9]{2})|Z)$/;
const RFC7231_REGEX = /^[A-Za-z]{3},\s[0-9]{2}\s[A-Za-z]{3}\s[0-9]{4}\s[0-9]{2}:[0-9]{2}:[0-9]{2}\sGMT$/;
const EXCEL_FORMAT_REGEX = /^-?\d+(\.\d+)?$/;
function createRegexMatcher(regex) {
  return (date) => !_.isNil(date) && regex.test(date);
}
const isISO8601DateTimeString = createRegexMatcher(ISO8601_REGEX);
const isISO9075DateString = createRegexMatcher(ISO9075_REGEX);
const isRFC3339DateString = createRegexMatcher(RFC3339_REGEX);
const isRFC7231DateString = createRegexMatcher(RFC7231_REGEX);
const isUnixTimestamp = createRegexMatcher(/^[0-9]{1,10}$/);
const isTimestamp = createRegexMatcher(/^[0-9]{1,13}$/);
const isMongoObjectId = createRegexMatcher(/^[0-9a-fA-F]{24}$/);
const isExcelFormat = createRegexMatcher(EXCEL_FORMAT_REGEX);
function isUTCDateString(date) {
  if (_.isNil(date)) {
    return false;
  }
  try {
    return new Date(date).toUTCString() === date;
  } catch (_ignored) {
    return false;
  }
}
function dateToExcelFormat(date) {
  return String(date.getTime() / (1e3 * 60 * 60 * 24) + 25569);
}
function excelFormatToDate(excelFormat) {
  return new Date((Number(excelFormat) - 25569) * 86400 * 1e3);
}

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "date-time-converter",
  __ssrInlineRender: true,
  setup(__props) {
    const inputDate = ref("");
    const toDate = (date) => new Date(date);
    const formats = [
      {
        name: "JS locale date string",
        fromDate: (date) => date.toString(),
        toDate,
        formatMatcher: () => false
      },
      {
        name: "ISO 8601",
        fromDate: formatISO,
        toDate: parseISO,
        formatMatcher: (date) => isISO8601DateTimeString(date)
      },
      {
        name: "ISO 9075",
        fromDate: formatISO9075,
        toDate: parseISO,
        formatMatcher: (date) => isISO9075DateString(date)
      },
      {
        name: "RFC 3339",
        fromDate: formatRFC3339,
        toDate,
        formatMatcher: (date) => isRFC3339DateString(date)
      },
      {
        name: "RFC 7231",
        fromDate: formatRFC7231,
        toDate,
        formatMatcher: (date) => isRFC7231DateString(date)
      },
      {
        name: "Unix timestamp",
        fromDate: (date) => String(getUnixTime(date)),
        toDate: (sec) => fromUnixTime(+sec),
        formatMatcher: (date) => isUnixTimestamp(date)
      },
      {
        name: "Timestamp",
        fromDate: (date) => String(getTime(date)),
        toDate: (ms) => parseJSON(+ms),
        formatMatcher: (date) => isTimestamp(date)
      },
      {
        name: "UTC format",
        fromDate: (date) => date.toUTCString(),
        toDate,
        formatMatcher: (date) => isUTCDateString(date)
      },
      {
        name: "Mongo ObjectID",
        fromDate: (date) => `${Math.floor(date.getTime() / 1e3).toString(16)}0000000000000000`,
        toDate: (objectId) => new Date(Number.parseInt(objectId.substring(0, 8), 16) * 1e3),
        formatMatcher: (date) => isMongoObjectId(date)
      },
      {
        name: "Excel date/time",
        fromDate: (date) => dateToExcelFormat(date),
        toDate: excelFormatToDate,
        formatMatcher: isExcelFormat
      }
    ];
    const formatIndex = ref(6);
    const now = useNow();
    const normalizedDate = computed(() => {
      if (!inputDate.value) {
        return now.value;
      }
      const { toDate: toDate2 } = formats[formatIndex.value];
      try {
        return toDate2(inputDate.value);
      } catch (_ignored) {
        return void 0;
      }
    });
    function onDateInputChanged(value) {
      const matchingIndex = formats.findIndex(({ formatMatcher }) => formatMatcher(value));
      if (matchingIndex !== -1) {
        formatIndex.value = matchingIndex;
      }
    }
    const validation = useValidation({
      source: inputDate,
      watch: [formatIndex],
      rules: [
        {
          message: "This date is invalid for this format",
          validator: (value) => withDefaultOnError(() => {
            if (value === "") {
              return true;
            }
            const maybeDate = formats[formatIndex.value].toDate(value);
            return isDate(maybeDate) && isValid(maybeDate);
          }, false)
        }
      ]
    });
    function formatDateUsingFormatter(formatter, date) {
      if (!date || !validation.isValid) {
        return "";
      }
      return withDefaultOnError(() => formatter(date), "");
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_c_input_text = __unplugin_components_3;
      const _component_c_select = __unplugin_components_0;
      const _component_n_divider = NDivider;
      const _component_input_copyable = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(_attrs)}><div flex gap-2>`);
      _push(ssrRenderComponent(_component_c_input_text, {
        value: unref(inputDate),
        "onUpdate:value": [($event) => isRef(inputDate) ? inputDate.value = $event : null, onDateInputChanged],
        autofocus: "",
        placeholder: "Put your date string here...",
        clearable: "",
        "test-id": "date-time-converter-input",
        validation: unref(validation)
      }, null, _parent));
      _push(ssrRenderComponent(_component_c_select, {
        value: unref(formatIndex),
        "onUpdate:value": ($event) => isRef(formatIndex) ? formatIndex.value = $event : null,
        style: { "flex": "0 0 170px" },
        options: formats.map(({ name }, i) => ({ label: name, value: i })),
        "data-test-id": "date-time-converter-format-select"
      }, null, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_n_divider, null, null, _parent));
      _push(`<!--[-->`);
      ssrRenderList(formats, ({ name, fromDate }) => {
        _push(ssrRenderComponent(_component_input_copyable, {
          key: name,
          label: name,
          "label-width": "150px",
          "label-position": "left",
          "label-align": "right",
          value: formatDateUsingFormatter(fromDate, unref(normalizedDate)),
          placeholder: "Invalid date...",
          "test-id": name,
          readonly: "",
          "mt-2": ""
        }, null, _parent));
      });
      _push(`<!--]--></div>`);
    };
  }
});

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/tools/date-time-converter/date-time-converter.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
