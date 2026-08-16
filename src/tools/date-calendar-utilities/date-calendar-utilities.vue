<script setup lang="ts">
import { buildIcalendarEvent, dateToIsoWeek, inspectIcalendarEvent, isoWeekToDate } from './date-calendar-utilities.service';
import { useCopy } from '@/composable/copy';
import { downloadTextFile } from '@/composable/downloadText';

type Mode = 'date-to-week' | 'week-to-date' | 'build-event' | 'inspect-event';
const mode = ref<Mode>('date-to-week');
const date = ref('2026-08-16');
const weekYear = ref('2026');
const week = ref('33');
const weekday = ref('7');
const uid = ref('planning@example.local');
const summary = ref('Planning review');
const description = ref('Review the release plan.');
const location = ref('Online');
const startUtc = ref('2026-08-17T09:00');
const endUtc = ref('2026-08-17T10:00');
const icalSource = ref('BEGIN:VCALENDAR\r\nVERSION:2.0\r\nBEGIN:VEVENT\r\nUID:demo@example.local\r\nDTSTART:20260817T090000Z\r\nDTEND:20260817T100000Z\r\nSUMMARY:Planning review\r\nEND:VEVENT\r\nEND:VCALENDAR\r\n');
const output = ref('');
const error = ref('');
const status = ref('Ready.');
const completedSignature = ref('');
const signature = computed(() => [mode.value, date.value, weekYear.value, week.value, weekday.value, uid.value, summary.value, description.value, location.value, startUtc.value, endUtc.value, icalSource.value].join('\0'));
const stale = computed(() => Boolean(output.value && completedSignature.value !== signature.value));
const { copy } = useCopy({ source: output, text: 'Calendar result copied' });

function run() {
  try {
    if (mode.value === 'date-to-week') {
      const result = dateToIsoWeek(date.value);
      output.value = `${date.value} = ${result.year}-W${String(result.week).padStart(2, '0')}-${result.weekday}\nWeekday 1 is Monday; 7 is Sunday.`;
    }
    else if (mode.value === 'week-to-date') {
      output.value = `${weekYear.value}-W${String(Number(week.value)).padStart(2, '0')}-${weekday.value} = ${isoWeekToDate(Number(weekYear.value), Number(week.value), Number(weekday.value))}`;
    }
    else if (mode.value === 'build-event') {
      const now = new Date();
      const stamp = `${String(now.getUTCFullYear()).padStart(4, '0')}-${String(now.getUTCMonth() + 1).padStart(2, '0')}-${String(now.getUTCDate()).padStart(2, '0')}T${String(now.getUTCHours()).padStart(2, '0')}:${String(now.getUTCMinutes()).padStart(2, '0')}:${String(now.getUTCSeconds()).padStart(2, '0')}`;
      output.value = buildIcalendarEvent({ uid: uid.value, summary: summary.value, description: description.value, location: location.value, startUtc: startUtc.value, endUtc: endUtc.value, stampUtc: stamp });
    }
    else {
      output.value = inspectIcalendarEvent(icalSource.value);
    }
    completedSignature.value = signature.value;
    error.value = '';
    status.value = 'Completed locally.';
  }
  catch (caught) {
    error.value = caught instanceof Error ? caught.message : 'Calendar operation failed.';
    status.value = 'Operation failed.';
  }
}
</script>

<template>
  <div class="c-task-layout">
    <c-alert title="Strict local calendar utilities">
      ISO weeks use the proleptic Gregorian calendar. Event date-times are interpreted as UTC, output uses RFC 5545 escaping and 75-octet folding, and no calendar application, network, or account is accessed.
    </c-alert>
    <c-card class="c-task-options" title="Operation">
      <c-select v-model:value="mode" label="Calendar operation" :options="[{ label: 'Date → ISO week', value: 'date-to-week' }, { label: 'ISO week → date', value: 'week-to-date' }, { label: 'Build UTC VEVENT', value: 'build-event' }, { label: 'Inspect VEVENT', value: 'inspect-event' }]" />
    </c-card>

    <c-card v-if="mode === 'date-to-week'" title="Gregorian date">
      <c-input-text v-model:value="date" label="Date (YYYY-MM-DD)" test-id="calendar-date" raw-text monospace />
    </c-card>
    <c-card v-else-if="mode === 'week-to-date'" title="ISO week date">
      <div grid grid-cols-1 gap-3 md:grid-cols-3>
        <c-input-text v-model:value="weekYear" label="Week year" inputmode="numeric" raw-text />
        <c-input-text v-model:value="week" label="Week (1–53)" inputmode="numeric" raw-text />
        <c-input-text v-model:value="weekday" label="Weekday (1–7)" inputmode="numeric" raw-text />
      </div>
    </c-card>
    <c-card v-else-if="mode === 'build-event'" title="UTC event fields">
      <div grid grid-cols-1 gap-3 md:grid-cols-2>
        <c-input-text v-model:value="summary" label="Summary" :maxlength="512" raw-text />
        <c-input-text v-model:value="uid" label="UID" :maxlength="256" raw-text monospace />
        <c-input-text v-model:value="startUtc" label="Start UTC (YYYY-MM-DDTHH:mm)" raw-text monospace />
        <c-input-text v-model:value="endUtc" label="End UTC (YYYY-MM-DDTHH:mm)" raw-text monospace />
        <c-input-text v-model:value="location" label="Location" :maxlength="1024" raw-text />
      </div>
      <c-input-text v-model:value="description" label="Description" :maxlength="16384" raw-text multiline :rows="6" mt-3 />
    </c-card>
    <c-input-text v-else v-model:value="icalSource" label="iCalendar data containing VEVENT" test-id="calendar-ical-input" raw-text monospace multiline :rows="16" />

    <div class="c-task-actions">
      <c-button type="primary" data-test-id="calendar-run" @click="run">
        Run locally
      </c-button>
    </div>
    <p class="c-task-status" role="status" aria-live="polite">
      {{ status }}
    </p>
    <c-alert v-if="error" title="Calendar error" data-test-id="calendar-error">
      {{ error }}
    </c-alert>
    <c-alert v-if="stale" title="Output uses previous fields">
      Run again to apply the current operation and values.
    </c-alert>
    <c-input-text :value="output" label="Result" data-test-id="calendar-output" raw-text monospace multiline readonly :rows="18" />
    <div class="c-task-actions">
      <c-button :disabled="!output" @click="copy()">
        Copy
      </c-button>
      <c-button :disabled="!output" @click="downloadTextFile({ content: output, filename: mode === 'build-event' ? 'event.ics' : 'calendar-result.txt' })">
        Download
      </c-button>
    </div>
  </div>
</template>
