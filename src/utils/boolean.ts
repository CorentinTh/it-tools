export { isNotThrowing, booleanToHumanReadable };

function isNotThrowing(cb: () => unknown): boolean {
  try {
    cb();
    return true;
  }
  catch (_) {
    return false;
  }
}

function booleanToHumanReadable(value: boolean): string {
  return value ? 'Yes' : 'No';
}
