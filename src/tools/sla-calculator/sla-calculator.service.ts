import Big from 'big.js';

const hoursDay = Big('24');
const daysWeek = Big('7');
const monthsYear = Big('12');
const daysYear = Big('365.2425');
const weeksYear = daysYear.div(daysWeek);
const daysMonth = daysYear.div(monthsYear);
const weeksMonth = daysMonth.div(daysWeek);

interface DaysHours {
  mondayHours?: number
  tuesdayHours?: number
  wednesdayHours?: number
  thursdayHours?: number
  fridayHours?: number
  saturdayHours?: number
  sundayHours?: number
}

function prepareDurations({
  mondayHours = 24,
  tuesdayHours = 24,
  wednesdayHours = 24,
  thursdayHours = 24,
  fridayHours = 24,
  saturdayHours = 24,
  sundayHours = 24,
}: DaysHours) {
  const durHoursWeek = Big(mondayHours).plus(tuesdayHours).plus(wednesdayHours).plus(thursdayHours).plus(fridayHours).plus(saturdayHours).plus(sundayHours);
  const durSecondsWeek = durHoursWeek.mul('3600');
  const durSecondsDay = durSecondsWeek.div(daysWeek);
  const durSecondsMonth = durSecondsWeek.mul(weeksMonth);
  const durSecondsQuarter = durSecondsMonth.mul('3');
  const durSecondsYear = durSecondsWeek.mul(weeksYear);
  const fullWeekHours = daysWeek.mul(hoursDay);

  return {
    durHoursWeek,
    durSecondsWeek,
    durSecondsDay,
    durSecondsMonth,
    durSecondsQuarter,
    durSecondsYear,
    fullWeekHours,
  };
}

export function downTimeToSLA({
  downTimeSeconds,
  mondayHours = 24,
  tuesdayHours = 24,
  wednesdayHours = 24,
  thursdayHours = 24,
  fridayHours = 24,
  saturdayHours = 24,
  sundayHours = 24,
}: {
  downTimeSeconds: number
} & DaysHours) {
  const {
    durHoursWeek,
    durSecondsWeek,
    durSecondsDay,
    durSecondsMonth,
    durSecondsQuarter,
    durSecondsYear,
    fullWeekHours,
  } = prepareDurations({
    mondayHours, tuesdayHours, wednesdayHours, thursdayHours, fridayHours, saturdayHours, sundayHours,
  });

  const one = Big('1');
  const hundred = Big('100');
  const downTimeSecondsBig = Big(downTimeSeconds);

  return {
    slaForDay: fullWeekHours.eq(durHoursWeek) ? one.minus(downTimeSecondsBig.div(durSecondsDay)).mul(hundred).toNumber() : null,
    slaForWeek: one.minus(downTimeSecondsBig.div(durSecondsWeek)).mul(hundred).toNumber(),
    slaForMonth: one.minus(downTimeSecondsBig.div(durSecondsMonth)).mul(hundred).toNumber(),
    slaForQuarter: one.minus(downTimeSecondsBig.div(durSecondsQuarter)).mul(hundred).toNumber(),
    slaForYear: one.minus(downTimeSecondsBig.div(durSecondsYear)).mul(hundred).toNumber(),
  };
}

export function slaToDowntimes({
  targetSLA,
  mondayHours = 24,
  tuesdayHours = 24,
  wednesdayHours = 24,
  thursdayHours = 24,
  fridayHours = 24,
  saturdayHours = 24,
  sundayHours = 24,
}: {
  targetSLA: number
  mondayHours?: number
  tuesdayHours?: number
  wednesdayHours?: number
  thursdayHours?: number
  fridayHours?: number
  saturdayHours?: number
  sundayHours?: number
}) {
  const {
    durHoursWeek,
    durSecondsWeek,
    durSecondsDay,
    durSecondsMonth,
    durSecondsQuarter,
    durSecondsYear,
    fullWeekHours,
  } = prepareDurations({
    mondayHours, tuesdayHours, wednesdayHours, thursdayHours, fridayHours, saturdayHours, sundayHours,
  });

  const allowedDowntime = Big('1').minus(Big(targetSLA).div('100'));

  return {
    secondsPerDay: fullWeekHours.eq(durHoursWeek) ? allowedDowntime.mul(durSecondsDay).toNumber() : null,
    secondsPerWeek: allowedDowntime.mul(durSecondsWeek).toNumber(),
    secondsPerMonth: allowedDowntime.mul(durSecondsMonth).toNumber(),
    secondsPerQuarter: allowedDowntime.mul(durSecondsQuarter).toNumber(),
    secondsPerYear: allowedDowntime.mul(durSecondsYear).toNumber(),
  };
}
