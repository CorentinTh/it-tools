import ICAL from 'ical.js';

export function mergeIcals(inputs: Array<string>, options: {
  calname?: string
  timezone?: string
  caldesc?: string
} = {}) {
  let calendar;
  for (const input of inputs) {
    try {
      const jcal = ICAL.parse(input);
      const cal = new ICAL.Component(jcal);

      if (!calendar) {
        calendar = cal;
        calendar.updatePropertyWithValue('prodid', 'it-tools-ical-merger');
        calendar.updatePropertyWithValue('version', '1.0');

        if (options.calname) {
          calendar.updatePropertyWithValue('x-wr-calname', options.calname);
        }
        if (options.timezone) {
          calendar.updatePropertyWithValue('x-wr-timezone', options.timezone);
        }
        if (options.caldesc) {
          calendar.updatePropertyWithValue('x-wr-caldesc', options.caldesc);
        }
      }
      else {
        for (const vevent of cal.getAllSubcomponents('vevent')) {
          calendar.addSubcomponent(vevent);
        }
      }
    }
    catch (e) {
      throw new Error(`Failed to merge: ${e}\n\nWith input: ${input}`);
    }
  }

  if (!calendar) {
    throw new Error('No icals parsed successfully');
  }

  return calendar.toString();
}
