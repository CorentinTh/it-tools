function isNotThrowing(cb) {
  try {
    cb();
    return true;
  } catch (_) {
    return false;
  }
}
function booleanToHumanReadable(value) {
  return value ? "Yes" : "No";
}

export { booleanToHumanReadable as b, isNotThrowing as i };
