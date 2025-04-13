// Returns the first day (Monday) of the specified week

// Year defaults to the current local calendar year
export function getFirstMondayFromISOWeek(weekInYear: number, year = new Date().getFullYear()) {
  const d = new Date(year, 0, 4);
  d.setDate(d.getDate() - (d.getDay() || 7) + 1 + 7 * (weekInYear - 1));
  return d;
}
export function getFirstMondayFromMonthWeek(weekInMonth: number, month = new Date().getMonth() + 1, year = new Date().getFullYear()) {
  const d = new Date(year, month - 1, 4);
  const day = d.getDay() || 7;
  d.setDate(d.getDate() - day + 1);
  d.setDate(d.getDate() + 7 * (weekInMonth - 1));
  return d;
}
