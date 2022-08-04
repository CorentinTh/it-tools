export { isNotThrowing };

function isNotThrowing(cb: () => unknown): boolean {
  try {
    cb();
    return true;
  } catch (_) {
    return false;
  }
}
