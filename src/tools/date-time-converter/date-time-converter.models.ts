import _ from 'lodash';

export {
  dateToExcelFormat,
  excelFormatToDate,
  isExcelFormat,
  isISO8601DateTimeString,
  isISO9075DateString,
  isMongoObjectId,
  isRFC3339DateString,
  isRFC7231DateString,
  isTimestamp,
  isUnixTimestamp,
  isUTCDateString,
};

/* eslint-disable regexp/no-unused-capturing-group, regexp/no-potentially-useless-backreference -- Standard date patterns: the ISO 8601 pattern relies on the group numbering of its \3 backreference. */
const ISO8601_REGEX
  = /^([+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24:?00)([.,]\d+(?!:))?)?(\17[0-5]\d([.,]\d+)?)?([zZ]|([+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;
const ISO9075_REGEX
  = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})(\.\d{1,6})?(([+-])(\d{2}):(\d{2})|Z)?$/;

const RFC3339_REGEX
  = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(\.\d{1,9})?(([+-])(\d{2}):(\d{2})|Z)$/;
/* eslint-enable regexp/no-unused-capturing-group, regexp/no-potentially-useless-backreference */

const RFC7231_REGEX = /^[A-Za-z]{3},\s\d{2}\s[A-Za-z]{3}\s\d{4}\s\d{2}:\d{2}:\d{2}\sGMT$/;

const EXCEL_FORMAT_REGEX = /^-?\d+(?:\.\d+)?$/;

function createRegexMatcher(regex: RegExp) {
  return (date?: string) => !_.isNil(date) && regex.test(date);
}

const isISO8601DateTimeString = createRegexMatcher(ISO8601_REGEX);
const isISO9075DateString = createRegexMatcher(ISO9075_REGEX);
const isRFC3339DateString = createRegexMatcher(RFC3339_REGEX);
const isRFC7231DateString = createRegexMatcher(RFC7231_REGEX);
const isUnixTimestamp = createRegexMatcher(/^\d{1,10}$/);
const isTimestamp = createRegexMatcher(/^\d{1,13}$/);
const isMongoObjectId = createRegexMatcher(/^[0-9a-f]{24}$/i);

const isExcelFormat = createRegexMatcher(EXCEL_FORMAT_REGEX);

function isUTCDateString(date?: string) {
  if (_.isNil(date)) {
    return false;
  }

  try {
    return new Date(date).toUTCString() === date;
  }
  catch {
    return false;
  }
}

function dateToExcelFormat(date: Date) {
  return String(((date.getTime()) / (1000 * 60 * 60 * 24)) + 25569);
}

function excelFormatToDate(excelFormat: string | number) {
  return new Date((Number(excelFormat) - 25569) * 86400 * 1000);
}
